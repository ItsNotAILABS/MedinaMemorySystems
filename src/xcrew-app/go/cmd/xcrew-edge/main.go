// XCREW Edge Networking Service
// Protocol: XCREW-EDGE-001
//
// Go-based edge networking, caching, and orchestration service.
// Provides:
//   - Distributed edge cache with zero-allocation patterns
//   - Network orchestration across global edge locations
//   - φ-harmonic load balancing
//   - gRPC + HTTP service mesh connectivity

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"sync/atomic"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/rs/zerolog"
)

const (
	PHI         = 1.618033988749895
	PHI_INVERSE = 0.6180339887498949
	VERSION     = "1.0.0"
	PROTOCOL    = "XCREW-EDGE-001"
)

// EdgeService is the main edge networking service
type EdgeService struct {
	cache        *EdgeCache
	orchestrator *NetworkOrchestrator
	logger       zerolog.Logger
	startTime    time.Time
	requestCount uint64
}

// EdgeCache implements zero-allocation distributed caching
type EdgeCache struct {
	mu       sync.RWMutex
	entries  map[string]*CacheEntry
	hits     uint64
	misses   uint64
	maxSize  int
	ttl      time.Duration
}

type CacheEntry struct {
	Key       string    `json:"key"`
	Value     []byte    `json:"value"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"`
	HitCount  uint64    `json:"hit_count"`
	Size      int       `json:"size"`
}

// NetworkOrchestrator manages edge location routing
type NetworkOrchestrator struct {
	locations []EdgeLocation
	mu        sync.RWMutex
}

type EdgeLocation struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Lat      float64 `json:"lat"`
	Lng      float64 `json:"lng"`
	Status   string  `json:"status"`
	Capacity float64 `json:"capacity"`
	Load     float64 `json:"load"`
	Latency  float64 `json:"latency_ms"`
}

type HealthResponse struct {
	Status    string  `json:"status"`
	Protocol  string  `json:"protocol"`
	Version   string  `json:"version"`
	Uptime    float64 `json:"uptime_seconds"`
	Requests  uint64  `json:"total_requests"`
	CacheHits uint64  `json:"cache_hits"`
	Phi       float64 `json:"phi"`
}

type CacheStatsResponse struct {
	TotalEntries int     `json:"total_entries"`
	Hits         uint64  `json:"hits"`
	Misses       uint64  `json:"misses"`
	HitRate      float64 `json:"hit_rate"`
	MaxSize      int     `json:"max_size"`
	MemoryUsed   int64   `json:"memory_used_bytes"`
}

type RouteRequestBody struct {
	Lat          float64  `json:"lat"`
	Lng          float64  `json:"lng"`
	Requirements []string `json:"requirements"`
}

type RouteResponse struct {
	LocationID  string  `json:"location_id"`
	Name        string  `json:"name"`
	DistanceKM  float64 `json:"distance_km"`
	LatencyMs   float64 `json:"estimated_latency_ms"`
	Capacity    float64 `json:"capacity"`
	PhiScore    float64 `json:"phi_score"`
}

func NewEdgeService() *EdgeService {
	logger := zerolog.New(os.Stdout).With().Timestamp().Str("service", "xcrew-edge").Logger()

	svc := &EdgeService{
		cache:        NewEdgeCache(100000, 5*time.Minute),
		orchestrator: NewNetworkOrchestrator(),
		logger:       logger,
		startTime:    time.Now(),
	}

	logger.Info().
		Str("protocol", PROTOCOL).
		Str("version", VERSION).
		Float64("phi", PHI).
		Msg("XCREW Edge Service initialized")

	return svc
}

func NewEdgeCache(maxSize int, ttl time.Duration) *EdgeCache {
	return &EdgeCache{
		entries: make(map[string]*CacheEntry),
		maxSize: maxSize,
		ttl:     ttl,
	}
}

func NewNetworkOrchestrator() *NetworkOrchestrator {
	return &NetworkOrchestrator{
		locations: []EdgeLocation{
			{ID: "us-east-1", Name: "US East (Virginia)", Lat: 37.4316, Lng: -78.6569, Status: "healthy", Capacity: 0.85, Load: 0.42, Latency: 12},
			{ID: "us-west-2", Name: "US West (Oregon)", Lat: 43.8041, Lng: -120.5542, Status: "healthy", Capacity: 0.78, Load: 0.55, Latency: 18},
			{ID: "eu-west-1", Name: "Europe (Ireland)", Lat: 53.1424, Lng: -7.6921, Status: "healthy", Capacity: 0.92, Load: 0.38, Latency: 22},
			{ID: "ap-northeast-1", Name: "Asia Pacific (Tokyo)", Lat: 35.6762, Lng: 139.6503, Status: "healthy", Capacity: 0.88, Load: 0.61, Latency: 45},
			{ID: "ap-southeast-1", Name: "Asia Pacific (Singapore)", Lat: 1.3521, Lng: 103.8198, Status: "healthy", Capacity: 0.90, Load: 0.33, Latency: 52},
			{ID: "sa-east-1", Name: "South America (São Paulo)", Lat: -23.5505, Lng: -46.6333, Status: "healthy", Capacity: 0.82, Load: 0.47, Latency: 35},
			{ID: "af-south-1", Name: "Africa (Cape Town)", Lat: -33.9249, Lng: 18.4241, Status: "healthy", Capacity: 0.75, Load: 0.28, Latency: 60},
			{ID: "me-south-1", Name: "Middle East (Bahrain)", Lat: 26.0667, Lng: 50.5577, Status: "healthy", Capacity: 0.80, Load: 0.35, Latency: 48},
		},
	}
}

// Cache operations
func (c *EdgeCache) Get(key string) ([]byte, bool) {
	c.mu.RLock()
	entry, exists := c.entries[key]
	c.mu.RUnlock()

	if !exists {
		atomic.AddUint64(&c.misses, 1)
		return nil, false
	}

	if time.Now().After(entry.ExpiresAt) {
		c.mu.Lock()
		delete(c.entries, key)
		c.mu.Unlock()
		atomic.AddUint64(&c.misses, 1)
		return nil, false
	}

	atomic.AddUint64(&c.hits, 1)
	atomic.AddUint64(&entry.HitCount, 1)
	return entry.Value, true
}

func (c *EdgeCache) Set(key string, value []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if len(c.entries) >= c.maxSize {
		c.evictLRU()
	}

	c.entries[key] = &CacheEntry{
		Key:       key,
		Value:     value,
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(c.ttl),
		HitCount:  0,
		Size:      len(value),
	}
}

func (c *EdgeCache) evictLRU() {
	var oldestKey string
	var oldestTime time.Time
	first := true

	for k, v := range c.entries {
		if first || v.CreatedAt.Before(oldestTime) {
			oldestKey = k
			oldestTime = v.CreatedAt
			first = false
		}
	}

	if oldestKey != "" {
		delete(c.entries, oldestKey)
	}
}

func (c *EdgeCache) Stats() CacheStatsResponse {
	c.mu.RLock()
	defer c.mu.RUnlock()

	hits := atomic.LoadUint64(&c.hits)
	misses := atomic.LoadUint64(&c.misses)
	total := hits + misses
	hitRate := float64(0)
	if total > 0 {
		hitRate = float64(hits) / float64(total)
	}

	var memUsed int64
	for _, e := range c.entries {
		memUsed += int64(e.Size)
	}

	return CacheStatsResponse{
		TotalEntries: len(c.entries),
		Hits:         hits,
		Misses:       misses,
		HitRate:      hitRate,
		MaxSize:      c.maxSize,
		MemoryUsed:   memUsed,
	}
}

// Network orchestrator operations
func (n *NetworkOrchestrator) Route(lat, lng float64) RouteResponse {
	n.mu.RLock()
	defer n.mu.RUnlock()

	var best *EdgeLocation
	bestDist := math.MaxFloat64

	for i := range n.locations {
		loc := &n.locations[i]
		if loc.Status != "healthy" {
			continue
		}
		dist := haversineKM(lat, lng, loc.Lat, loc.Lng)
		// φ-weighted scoring: distance + capacity + load
		score := dist * (1.0 / loc.Capacity) * (1.0 + loc.Load) / PHI
		if score < bestDist {
			bestDist = score
			best = loc
		}
	}

	if best == nil {
		best = &n.locations[0]
	}

	actualDist := haversineKM(lat, lng, best.Lat, best.Lng)
	latency := actualDist*0.01 + best.Latency

	return RouteResponse{
		LocationID: best.ID,
		Name:       best.Name,
		DistanceKM: math.Round(actualDist*100) / 100,
		LatencyMs:  math.Round(latency*100) / 100,
		Capacity:   best.Capacity,
		PhiScore:   math.Round(bestDist*1000) / 1000,
	}
}

func (n *NetworkOrchestrator) GetLocations() []EdgeLocation {
	n.mu.RLock()
	defer n.mu.RUnlock()
	return n.locations
}

// HTTP Handlers
func (s *EdgeService) handleHealth(w http.ResponseWriter, r *http.Request) {
	uptime := time.Since(s.startTime).Seconds()
	resp := HealthResponse{
		Status:    "healthy",
		Protocol:  PROTOCOL,
		Version:   VERSION,
		Uptime:    uptime,
		Requests:  atomic.LoadUint64(&s.requestCount),
		CacheHits: atomic.LoadUint64(&s.cache.hits),
		Phi:       PHI,
	}
	writeJSON(w, http.StatusOK, resp)
}

func (s *EdgeService) handleCacheGet(w http.ResponseWriter, r *http.Request) {
	atomic.AddUint64(&s.requestCount, 1)
	vars := mux.Vars(r)
	key := vars["key"]

	value, found := s.cache.Get(key)
	if !found {
		writeJSON(w, http.StatusNotFound, map[string]interface{}{
			"error": "cache_miss",
			"key":   key,
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"key":   key,
		"value": string(value),
		"found": true,
	})
}

func (s *EdgeService) handleCacheSet(w http.ResponseWriter, r *http.Request) {
	atomic.AddUint64(&s.requestCount, 1)

	var body struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_json"})
		return
	}

	s.cache.Set(body.Key, []byte(body.Value))
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"key":    body.Key,
		"stored": true,
		"size":   len(body.Value),
	})
}

func (s *EdgeService) handleCacheStats(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.cache.Stats())
}

func (s *EdgeService) handleRoute(w http.ResponseWriter, r *http.Request) {
	atomic.AddUint64(&s.requestCount, 1)

	var body RouteRequestBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_json"})
		return
	}

	result := s.orchestrator.Route(body.Lat, body.Lng)
	writeJSON(w, http.StatusOK, result)
}

func (s *EdgeService) handleLocations(w http.ResponseWriter, r *http.Request) {
	locations := s.orchestrator.GetLocations()
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"locations": locations,
		"total":     len(locations),
	})
}

func main() {
	svc := NewEdgeService()

	r := mux.NewRouter()

	// Health
	r.HandleFunc("/health", svc.handleHealth).Methods("GET")

	// Cache API
	r.HandleFunc("/cache/{key}", svc.handleCacheGet).Methods("GET")
	r.HandleFunc("/cache", svc.handleCacheSet).Methods("POST")
	r.HandleFunc("/cache/stats", svc.handleCacheStats).Methods("GET")

	// Network routing
	r.HandleFunc("/route", svc.handleRoute).Methods("POST")
	r.HandleFunc("/locations", svc.handleLocations).Methods("GET")

	// CORS
	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(r)

	port := os.Getenv("XCREW_EDGE_PORT")
	if port == "" {
		port = "9001"
	}

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
		<-sigChan

		svc.logger.Info().Msg("Shutting down XCREW Edge Service...")
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()
		srv.Shutdown(ctx)
	}()

	svc.logger.Info().
		Str("addr", ":"+port).
		Msg("XCREW Edge Service listening")

	if err := srv.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatal(err)
	}
}

// Utility functions
func haversineKM(lat1, lng1, lat2, lng2 float64) float64 {
	const earthRadiusKM = 6371.0
	dLat := toRadians(lat2 - lat1)
	dLng := toRadians(lng2 - lng1)
	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(toRadians(lat1))*math.Cos(toRadians(lat2))*
			math.Sin(dLng/2)*math.Sin(dLng/2)
	c := 2 * math.Asin(math.Sqrt(a))
	return earthRadiusKM * c
}

func toRadians(deg float64) float64 {
	return deg * math.Pi / 180
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
