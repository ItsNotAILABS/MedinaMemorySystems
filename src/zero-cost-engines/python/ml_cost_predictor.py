"""
𓂀 ZERO-COST ML COST PREDICTOR ENGINE 𓂀
Predictive cost elimination using machine learning
Charter: ZCE-PY-001
Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX | May 2026
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Callable
from collections import deque
import time
import math
import hashlib
from functools import lru_cache

# φ (Golden Ratio) constants for harmonic optimization
PHI = 1.618033988749895
PHI_INVERSE = 0.6180339887498949
SCHUMANN_HZ = 7.83

@dataclass
class CostVector:
    """Immutable cost vector for ML processing"""
    timestamp: float
    requests: int
    cpu_ms: float
    memory_mb: float
    storage_gb: float
    network_bytes: int
    cache_hits: int
    cache_misses: int
    
    def to_array(self) -> np.ndarray:
        return np.array([
            self.requests,
            self.cpu_ms,
            self.memory_mb,
            self.storage_gb,
            self.network_bytes,
            self.cache_hits,
            self.cache_misses
        ], dtype=np.float64)
    
    @property
    def cache_hit_rate(self) -> float:
        total = self.cache_hits + self.cache_misses
        return self.cache_hits / total if total > 0 else 0.0


class PhiHarmonicPredictor:
    """
    φ-Harmonic predictor using golden ratio for natural optimization.
    Based on Fibonacci patterns found in efficient natural systems.
    """
    
    def __init__(self, window_size: int = None):
        # φ-based window size
        self.window_size = window_size or int(PHI * 100)  # ~162
        self.history: deque = deque(maxlen=self.window_size)
        self.phi_weights = self._generate_phi_weights()
        
    def _generate_phi_weights(self) -> np.ndarray:
        """Generate φ-based exponential weights"""
        weights = np.zeros(self.window_size)
        for i in range(self.window_size):
            # Weight decays by PHI_INVERSE each step
            weights[i] = PHI_INVERSE ** (self.window_size - i - 1)
        return weights / weights.sum()
    
    def add_sample(self, cost_vector: CostVector):
        """Add cost sample to history"""
        self.history.append(cost_vector.to_array())
        
    def predict_next(self, horizon: int = 1) -> np.ndarray:
        """Predict next cost vector using φ-weighted average"""
        if len(self.history) < 3:
            return np.zeros(7)
        
        history_array = np.array(list(self.history))
        weights = self.phi_weights[-len(self.history):]
        weights = weights / weights.sum()
        
        # Weighted prediction
        weighted_avg = np.average(history_array, axis=0, weights=weights)
        
        # Trend component using φ-harmonic oscillation
        if len(self.history) >= 10:
            recent = history_array[-10:]
            trend = np.mean(np.diff(recent, axis=0), axis=0)
            # Dampen trend by φ-inverse
            weighted_avg += trend * horizon * PHI_INVERSE
            
        return weighted_avg
    
    def confidence(self) -> float:
        """Prediction confidence based on data stability"""
        if len(self.history) < 10:
            return 0.0
        
        history_array = np.array(list(self.history))
        variance = np.var(history_array, axis=0).mean()
        mean = np.abs(np.mean(history_array, axis=0)).mean() + 1e-10
        
        # Coefficient of variation
        cv = np.sqrt(variance) / mean
        
        # Confidence inversely related to CV
        return max(0.0, min(1.0, 1.0 - cv * PHI_INVERSE))


class CostAnomalyDetector:
    """
    Detects cost anomalies using φ-based statistical thresholds.
    Anomaly = deviation > φ * standard_deviation
    """
    
    def __init__(self, sensitivity: float = PHI):
        self.sensitivity = sensitivity
        self.running_mean = None
        self.running_var = None
        self.n_samples = 0
        self.anomalies: List[Tuple[float, np.ndarray]] = []
        
    def update(self, cost_vector: CostVector) -> bool:
        """Update statistics and check for anomaly"""
        x = cost_vector.to_array()
        self.n_samples += 1
        
        if self.running_mean is None:
            self.running_mean = x
            self.running_var = np.zeros_like(x)
            return False
        
        # Welford's online algorithm
        delta = x - self.running_mean
        self.running_mean += delta / self.n_samples
        delta2 = x - self.running_mean
        self.running_var += delta * delta2
        
        if self.n_samples < 10:
            return False
            
        # Check for anomaly
        std = np.sqrt(self.running_var / self.n_samples)
        z_scores = np.abs(delta) / (std + 1e-10)
        
        is_anomaly = np.any(z_scores > self.sensitivity)
        if is_anomaly:
            self.anomalies.append((time.time(), x))
            
        return is_anomaly
    
    def cost_spike_probability(self) -> float:
        """Probability of cost spike in next period"""
        if self.n_samples < 50:
            return 0.5  # Uncertain
            
        recent_anomalies = sum(1 for ts, _ in self.anomalies 
                               if time.time() - ts < 3600)
        return min(1.0, recent_anomalies / 10)


class AdaptiveCachePredictor:
    """
    Predicts optimal cache parameters to minimize costs.
    Uses reinforcement learning-like adaptation.
    """
    
    def __init__(self):
        self.cache_size_history: List[Tuple[int, float, float]] = []  # (size, hit_rate, cost)
        self.optimal_size = 65536  # Default
        self.learning_rate = PHI_INVERSE * 0.1
        
    def record_observation(self, cache_size: int, hit_rate: float, cost: float):
        """Record cache performance observation"""
        self.cache_size_history.append((cache_size, hit_rate, cost))
        self._adapt()
        
    def _adapt(self):
        """Adapt optimal cache size based on observations"""
        if len(self.cache_size_history) < 10:
            return
            
        # Find correlation between cache size and cost reduction
        recent = self.cache_size_history[-50:]
        sizes = np.array([x[0] for x in recent])
        costs = np.array([x[2] for x in recent])
        
        # Gradient of cost w.r.t. size
        if len(np.unique(sizes)) > 1:
            gradient = np.polyfit(sizes, costs, 1)[0]
            
            # If larger cache = lower cost, increase
            if gradient < 0:
                self.optimal_size = int(self.optimal_size * (1 + self.learning_rate))
            else:
                self.optimal_size = int(self.optimal_size * (1 - self.learning_rate))
                
            # Bounds
            self.optimal_size = max(1024, min(1048576, self.optimal_size))
    
    def recommend_cache_size(self) -> int:
        """Get recommended cache size"""
        return self.optimal_size
    
    def predicted_savings(self) -> float:
        """Predicted cost savings from optimal cache"""
        if not self.cache_size_history:
            return 0.0
            
        recent = self.cache_size_history[-10:]
        avg_hit_rate = np.mean([x[1] for x in recent])
        
        # Each cache hit saves ~$0.0000005
        requests_per_hour = 10000  # Assumed
        return avg_hit_rate * requests_per_hour * 0.0000005 * 24 * 30


class BatchSizeOptimizer:
    """
    Optimizes batch sizes using φ-harmonic principles.
    Finds natural batch sizes that minimize overhead.
    """
    
    def __init__(self):
        self.observations: List[Tuple[int, float, float]] = []  # (batch_size, throughput, cost)
        self.fibonacci_sizes = self._generate_fibonacci_sizes()
        
    def _generate_fibonacci_sizes(self) -> List[int]:
        """Generate Fibonacci sequence batch sizes"""
        sizes = [1, 1]
        while sizes[-1] < 10000:
            sizes.append(sizes[-1] + sizes[-2])
        return sizes[5:]  # Start from reasonable size
    
    def record_batch(self, size: int, throughput: float, cost: float):
        """Record batch performance"""
        self.observations.append((size, throughput, cost))
        
    def recommend_batch_size(self) -> int:
        """Recommend optimal batch size"""
        if len(self.observations) < 5:
            return int(PHI * 100)  # Default φ-based
            
        # Find size with best throughput/cost ratio
        best_ratio = 0
        best_size = int(PHI * 100)
        
        for size, throughput, cost in self.observations[-20:]:
            if cost > 0:
                ratio = throughput / cost
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_size = size
                    
        # Round to nearest Fibonacci number
        return min(self.fibonacci_sizes, key=lambda x: abs(x - best_size))
    
    def cost_per_item(self) -> float:
        """Average cost per item in batch"""
        if not self.observations:
            return 0.0
        return np.mean([cost / size for size, _, cost in self.observations[-10:]])


class ZeroCostPredictor:
    """
    Main ML engine for predicting and achieving zero operational costs.
    Combines multiple predictors for comprehensive optimization.
    """
    
    def __init__(self):
        self.phi_predictor = PhiHarmonicPredictor()
        self.anomaly_detector = CostAnomalyDetector()
        self.cache_predictor = AdaptiveCachePredictor()
        self.batch_optimizer = BatchSizeOptimizer()
        self.total_savings = 0.0
        self.predictions_made = 0
        self.accurate_predictions = 0
        
    def ingest_metrics(self, metrics: Dict) -> Dict:
        """
        Ingest metrics and return optimization recommendations.
        """
        cost_vector = CostVector(
            timestamp=time.time(),
            requests=metrics.get('requests', 0),
            cpu_ms=metrics.get('cpu_ms', 0),
            memory_mb=metrics.get('memory_mb', 0),
            storage_gb=metrics.get('storage_gb', 0),
            network_bytes=metrics.get('network_bytes', 0),
            cache_hits=metrics.get('cache_hits', 0),
            cache_misses=metrics.get('cache_misses', 0)
        )
        
        # Update all predictors
        self.phi_predictor.add_sample(cost_vector)
        is_anomaly = self.anomaly_detector.update(cost_vector)
        self.cache_predictor.record_observation(
            metrics.get('cache_size', 65536),
            cost_vector.cache_hit_rate,
            metrics.get('cost', 0)
        )
        
        # Generate predictions
        next_costs = self.phi_predictor.predict_next()
        
        return {
            'predicted_requests': int(next_costs[0]),
            'predicted_cpu_ms': next_costs[1],
            'predicted_memory_mb': next_costs[2],
            'is_anomaly': is_anomaly,
            'anomaly_probability': self.anomaly_detector.cost_spike_probability(),
            'recommended_cache_size': self.cache_predictor.recommend_cache_size(),
            'recommended_batch_size': self.batch_optimizer.recommend_batch_size(),
            'confidence': self.phi_predictor.confidence(),
            'phi_efficiency': self._calculate_phi_efficiency(cost_vector)
        }
    
    def _calculate_phi_efficiency(self, cv: CostVector) -> float:
        """Calculate φ-harmonic efficiency score"""
        hit_rate = cv.cache_hit_rate
        return hit_rate * PHI_INVERSE + (1 - hit_rate) * 0.1
    
    def get_cost_elimination_strategy(self) -> Dict:
        """
        Generate comprehensive cost elimination strategy.
        """
        cache_savings = self.cache_predictor.predicted_savings()
        batch_cost = self.batch_optimizer.cost_per_item()
        spike_prob = self.anomaly_detector.cost_spike_probability()
        
        strategies = []
        
        # Cache optimization
        if cache_savings > 0:
            strategies.append({
                'action': 'INCREASE_CACHE',
                'target_size': self.cache_predictor.recommend_cache_size(),
                'expected_savings': cache_savings,
                'priority': 1
            })
        
        # Batch optimization
        optimal_batch = self.batch_optimizer.recommend_batch_size()
        strategies.append({
            'action': 'OPTIMIZE_BATCH_SIZE',
            'target_size': optimal_batch,
            'expected_savings': batch_cost * optimal_batch * 0.1,
            'priority': 2
        })
        
        # Anomaly prevention
        if spike_prob > 0.3:
            strategies.append({
                'action': 'ENABLE_RATE_LIMITING',
                'reason': f'High anomaly probability: {spike_prob:.2%}',
                'expected_savings': spike_prob * 100,  # Estimated spike cost
                'priority': 0
            })
        
        # Request deduplication
        strategies.append({
            'action': 'ENABLE_DEDUPLICATION',
            'expected_savings': cache_savings * 0.2,  # 20% additional savings
            'priority': 3
        })
        
        return {
            'strategies': sorted(strategies, key=lambda x: x['priority']),
            'total_expected_savings': sum(s['expected_savings'] for s in strategies),
            'path_to_zero_cost': self._calculate_zero_cost_path(strategies)
        }
    
    def _calculate_zero_cost_path(self, strategies: List[Dict]) -> Dict:
        """Calculate path to zero operational costs"""
        current_estimate = 100.0  # Baseline monthly cost
        
        path = []
        remaining_cost = current_estimate
        
        for strategy in strategies:
            savings = strategy['expected_savings']
            remaining_cost = max(0, remaining_cost - savings)
            path.append({
                'step': strategy['action'],
                'savings': savings,
                'remaining_cost': remaining_cost,
                'percent_to_zero': (1 - remaining_cost / current_estimate) * 100
            })
            
        return {
            'initial_cost': current_estimate,
            'final_cost': remaining_cost,
            'cost_reduction': (1 - remaining_cost / current_estimate) * 100,
            'steps': path,
            'achievable': remaining_cost < 1.0  # Under $1/month = "zero"
        }


class NeuralCostOptimizer:
    """
    Simple neural network for cost pattern learning.
    Implemented without external ML dependencies.
    """
    
    def __init__(self, input_size: int = 7, hidden_size: int = None):
        self.input_size = input_size
        # φ-based hidden layer size
        self.hidden_size = hidden_size or int(input_size * PHI)
        self.output_size = 1  # Cost prediction
        
        # Initialize weights with φ-scaled Xavier
        scale = np.sqrt(2.0 / (input_size + self.hidden_size)) * PHI_INVERSE
        self.W1 = np.random.randn(input_size, self.hidden_size) * scale
        self.b1 = np.zeros(self.hidden_size)
        self.W2 = np.random.randn(self.hidden_size, self.output_size) * scale
        self.b2 = np.zeros(self.output_size)
        
        self.learning_rate = 0.001 * PHI_INVERSE
        
    def forward(self, x: np.ndarray) -> np.ndarray:
        """Forward pass with ReLU activation"""
        self.z1 = x @ self.W1 + self.b1
        self.a1 = np.maximum(0, self.z1)  # ReLU
        self.z2 = self.a1 @ self.W2 + self.b2
        return self.z2
    
    def backward(self, x: np.ndarray, y: np.ndarray, y_pred: np.ndarray):
        """Backward pass with gradient descent"""
        m = x.shape[0]
        
        dz2 = y_pred - y.reshape(-1, 1)
        dW2 = self.a1.T @ dz2 / m
        db2 = np.mean(dz2, axis=0)
        
        da1 = dz2 @ self.W2.T
        dz1 = da1 * (self.z1 > 0)  # ReLU derivative
        dW1 = x.T @ dz1 / m
        db1 = np.mean(dz1, axis=0)
        
        # Update weights
        self.W2 -= self.learning_rate * dW2
        self.b2 -= self.learning_rate * db2
        self.W1 -= self.learning_rate * dW1
        self.b1 -= self.learning_rate * db1
        
    def train_step(self, x: np.ndarray, y: np.ndarray) -> float:
        """Single training step, returns loss"""
        y_pred = self.forward(x)
        loss = np.mean((y_pred - y.reshape(-1, 1)) ** 2)
        self.backward(x, y, y_pred)
        return loss
    
    def predict(self, x: np.ndarray) -> float:
        """Predict cost"""
        return float(self.forward(x)[0])


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def calculate_cloudflare_cost(usage: Dict) -> float:
    """Calculate Cloudflare costs from usage metrics"""
    cost = 0.0
    
    # Workers
    requests = usage.get('requests', 0)
    if requests > 100000:
        cost += (requests - 100000) / 1000000 * 0.50
    
    cpu_ms = usage.get('cpu_ms', 0)
    free_cpu = requests * 10  # 10ms free per request
    if cpu_ms > free_cpu:
        cost += (cpu_ms - free_cpu) * 0.00001
    
    # KV
    kv_reads = usage.get('kv_reads', 0)
    if kv_reads > 100000:
        cost += (kv_reads - 100000) / 1000000 * 0.50
    
    kv_writes = usage.get('kv_writes', 0)
    if kv_writes > 1000:
        cost += (kv_writes - 1000) / 1000000 * 5.00
    
    kv_storage = usage.get('kv_storage_gb', 0)
    cost += kv_storage * 0.50
    
    # D1
    d1_reads = usage.get('d1_reads', 0)
    if d1_reads > 5000000:
        cost += (d1_reads - 5000000) / 1000000 * 0.25
    
    d1_writes = usage.get('d1_writes', 0)
    if d1_writes > 100000:
        cost += (d1_writes - 100000) / 1000000 * 1.00
    
    return cost


def fibonacci_sequence(n: int) -> List[int]:
    """Generate Fibonacci sequence up to n terms"""
    if n <= 0:
        return []
    elif n == 1:
        return [1]
    
    seq = [1, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq


@lru_cache(maxsize=1024)
def phi_hash(key: str) -> int:
    """φ-harmonic hash function with caching"""
    h = hashlib.sha256(key.encode()).hexdigest()
    return int(h[:16], 16)


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    'CostVector',
    'PhiHarmonicPredictor',
    'CostAnomalyDetector',
    'AdaptiveCachePredictor',
    'BatchSizeOptimizer',
    'ZeroCostPredictor',
    'NeuralCostOptimizer',
    'calculate_cloudflare_cost',
    'PHI',
    'PHI_INVERSE'
]


if __name__ == '__main__':
    # Example usage
    predictor = ZeroCostPredictor()
    
    # Simulate metrics
    for i in range(100):
        metrics = {
            'requests': 1000 + i * 10,
            'cpu_ms': 500 + i * 5,
            'memory_mb': 128,
            'storage_gb': 0.1,
            'network_bytes': 1000000,
            'cache_hits': 800 + i,
            'cache_misses': 200 - i // 2,
            'cache_size': 65536,
            'cost': 0.01 - i * 0.00005
        }
        
        result = predictor.ingest_metrics(metrics)
        
    strategy = predictor.get_cost_elimination_strategy()
    print(f"Path to zero cost: {strategy['path_to_zero_cost']}")
