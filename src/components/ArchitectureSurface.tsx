'use client';

import React, { useState } from 'react';

// 𓂀 ARCHITECTURE SURFACE 𓂀
// Complete Doctrine → Procedures → Engine → Three Computers → Output stack visualization
// "Architecture surface updated to show the complete Doctrine → Procedures → Engine → Three Computers → Output stack"

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482;

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface ArchitectureLayer {
  id: string;
  name: string;
  level: number;
  category: LayerCategory;
  description: string;
  components: LayerComponent[];
  color: string;
  icon: string;
}

type LayerCategory = 'doctrine' | 'procedures' | 'engine' | 'computers' | 'output';

interface LayerComponent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  health: number;
  connections: string[];
}

// ═══════════════════════════════════════════════════════════════
// ARCHITECTURE DATA
// ═══════════════════════════════════════════════════════════════

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  // DOCTRINE (Top Level)
  {
    id: 'doctrine',
    name: 'DOCTRINE',
    level: 1,
    category: 'doctrine',
    description: 'The immutable laws and principles that govern the organism',
    color: '#9b59b6',
    icon: '📜',
    components: [
      { id: 'd1', name: 'PHI Sovereign Law', status: 'active', health: 100, connections: ['p1', 'p2'] },
      { id: 'd2', name: 'RECITAL_PLUS_ONE', status: 'active', health: 100, connections: ['p2', 'p3'] },
      { id: 'd3', name: 'Dual Consensus Law', status: 'active', health: 100, connections: ['p3', 'p4'] },
      { id: 'd4', name: 'Distance from PC = 0', status: 'active', health: 100, connections: ['p1'] },
      { id: 'd5', name: 'CODEX VIVENS', status: 'active', health: 100, connections: ['p1', 'p2', 'p3', 'p4'] },
    ],
  },
  
  // PROCEDURES
  {
    id: 'procedures',
    name: 'PROCEDURES',
    level: 2,
    category: 'procedures',
    description: 'Executable protocols that implement doctrine',
    color: '#3498db',
    icon: '⚙️',
    components: [
      { id: 'p1', name: 'Kernel Compression Protocol', status: 'active', health: 98, connections: ['e1', 'e2'] },
      { id: 'p2', name: 'Document Mutation Protocol', status: 'active', health: 95, connections: ['e2', 'e3'] },
      { id: 'p3', name: 'Cross-Organism Resonance', status: 'processing', health: 92, connections: ['e3', 'e4'] },
      { id: 'p4', name: 'State Machine Contracts', status: 'active', health: 97, connections: ['e1', 'e4'] },
      { id: 'p5', name: 'Torus Navigation Protocol', status: 'active', health: 94, connections: ['e2'] },
    ],
  },
  
  // ENGINE
  {
    id: 'engine',
    name: 'ENGINE',
    level: 3,
    category: 'engine',
    description: 'The computational core that executes all procedures',
    color: '#e74c3c',
    icon: '🔥',
    components: [
      { id: 'e1', name: 'MatalkoICP.mo', status: 'active', health: 99, connections: ['c1', 'c2'] },
      { id: 'e2', name: 'AncientMathEngine.mo', status: 'active', health: 100, connections: ['c1'] },
      { id: 'e3', name: 'AncientGlyphCodex.mo', status: 'active', health: 97, connections: ['c2'] },
      { id: 'e4', name: 'FieldPhysicsEngine.mo', status: 'active', health: 96, connections: ['c1', 'c3'] },
      { id: 'e5', name: 'CPL.mo', status: 'active', health: 98, connections: ['c2', 'c3'] },
      { id: 'e6', name: 'KernelCompression.mo', status: 'active', health: 95, connections: ['c1', 'c2', 'c3'] },
    ],
  },
  
  // THREE COMPUTERS
  {
    id: 'computers',
    name: 'THREE COMPUTERS',
    level: 4,
    category: 'computers',
    description: 'Heart, Brain, and Workforce — the three sovereign canisters',
    color: '#f39c12',
    icon: '🖥️',
    components: [
      { id: 'c1', name: 'HEART (Rhythm Canister)', status: 'active', health: 100, connections: ['o1', 'o2'] },
      { id: 'c2', name: 'ORGANISM (Sovereign Core)', status: 'active', health: 99, connections: ['o1', 'o2', 'o3'] },
      { id: 'c3', name: 'WORKFORCE (Projections)', status: 'active', health: 97, connections: ['o2', 'o3', 'o4'] },
    ],
  },
  
  // OUTPUT
  {
    id: 'output',
    name: 'OUTPUT',
    level: 5,
    category: 'output',
    description: 'The interfaces and projections that interact with the external world',
    color: '#2ecc71',
    icon: '📤',
    components: [
      { id: 'o1', name: 'Founder Interface', status: 'active', health: 100, connections: [] },
      { id: 'o2', name: 'Client Projections', status: 'active', health: 95, connections: [] },
      { id: 'o3', name: 'API Gateway', status: 'active', health: 98, connections: [] },
      { id: 'o4', name: 'Surface Renderer', status: 'active', health: 96, connections: [] },
      { id: 'o5', name: 'THE WORLD', status: 'active', health: 94, connections: [] },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function ArchitectureSurface() {
  const [selectedLayer, setSelectedLayer] = useState<ArchitectureLayer | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<LayerComponent | null>(null);
  const [viewMode, setViewMode] = useState<'stack' | 'flow' | 'radial'>('stack');

  const getStatusColor = (status: LayerComponent['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'processing': return 'bg-amber-500 animate-pulse';
      case 'idle': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-emerald-400';
    if (health >= 80) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Glassmorphism Container */}
      <div className="absolute inset-4 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">🏛️</span>
                ARCHITECTURE SURFACE
              </h1>
              <p className="text-white/60 mt-1">Doctrine → Procedures → Engine → Three Computers → Output</p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              {[
                { id: 'stack', label: 'Stack View', icon: '📊' },
                { id: 'flow', label: 'Flow View', icon: '🔀' },
                { id: 'radial', label: 'Radial View', icon: '🎯' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as 'stack' | 'flow' | 'radial')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === mode.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{mode.icon}</span>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* System Health Overview */}
          <div className="flex gap-4 mt-6">
            {ARCHITECTURE_LAYERS.map(layer => {
              const avgHealth = layer.components.reduce((sum, c) => sum + c.health, 0) / layer.components.length;
              return (
                <div 
                  key={layer.id}
                  className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                  onClick={() => setSelectedLayer(layer)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{layer.icon}</span>
                    <span className={`text-sm font-mono ${getHealthColor(avgHealth)}`}>{avgHealth.toFixed(1)}%</span>
                  </div>
                  <div className="text-white text-sm font-semibold">{layer.name}</div>
                  <div className="text-white/40 text-xs">{layer.components.length} components</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
          {/* STACK VIEW */}
          {viewMode === 'stack' && (
            <div className="space-y-4">
              {ARCHITECTURE_LAYERS.map((layer, layerIndex) => (
                <div 
                  key={layer.id}
                  className="relative"
                  style={{ marginLeft: `${layerIndex * 20}px` }}
                >
                  {/* Layer Header */}
                  <div 
                    className="p-4 rounded-t-xl cursor-pointer transition-all hover:brightness-110"
                    style={{ backgroundColor: `${layer.color}30`, borderLeft: `4px solid ${layer.color}` }}
                    onClick={() => setSelectedLayer(selectedLayer?.id === layer.id ? null : layer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{layer.icon}</span>
                        <div>
                          <h3 className="text-white font-bold text-lg">{layer.name}</h3>
                          <p className="text-white/60 text-sm">{layer.description}</p>
                        </div>
                      </div>
                      <div className="text-white/60 text-sm">
                        Level {layer.level} • {layer.components.length} components
                      </div>
                    </div>
                  </div>
                  
                  {/* Layer Components */}
                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-b-xl bg-white/5"
                    style={{ borderLeft: `4px solid ${layer.color}` }}
                  >
                    {layer.components.map(component => (
                      <div
                        key={component.id}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => setSelectedComponent(component)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(component.status)}`} />
                            <span className="text-white font-medium text-sm">{component.name}</span>
                          </div>
                          <span className={`text-xs font-mono ${getHealthColor(component.health)}`}>
                            {component.health}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span>{component.status}</span>
                          {component.connections.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{component.connections.length} connections</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Connection arrows to next layer */}
                  {layerIndex < ARCHITECTURE_LAYERS.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="text-white/30 text-2xl">↓</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* FLOW VIEW */}
          {viewMode === 'flow' && (
            <div className="relative">
              <svg className="w-full h-[600px]" viewBox="0 0 1000 600">
                {/* Flow paths */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
                  </marker>
                </defs>
                
                {/* Layer boxes */}
                {ARCHITECTURE_LAYERS.map((layer, index) => {
                  const x = 50 + index * 180;
                  const y = 100;
                  const width = 150;
                  const height = 400;
                  
                  return (
                    <g key={layer.id}>
                      {/* Layer container */}
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx="12"
                        fill={`${layer.color}20`}
                        stroke={layer.color}
                        strokeWidth="2"
                      />
                      
                      {/* Layer title */}
                      <text x={x + width/2} y={y + 30} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                        {layer.name}
                      </text>
                      
                      {/* Components */}
                      {layer.components.map((comp, compIndex) => {
                        const compY = y + 50 + compIndex * 60;
                        return (
                          <g key={comp.id}>
                            <rect
                              x={x + 10}
                              y={compY}
                              width={width - 20}
                              height={50}
                              rx="6"
                              fill="rgba(255,255,255,0.1)"
                              stroke="rgba(255,255,255,0.2)"
                            />
                            <circle
                              cx={x + 25}
                              cy={compY + 25}
                              r="5"
                              fill={comp.status === 'active' ? '#2ecc71' : comp.status === 'processing' ? '#f39c12' : '#e74c3c'}
                            />
                            <text x={x + 40} y={compY + 22} fill="white" fontSize="10">
                              {comp.name.length > 18 ? comp.name.substring(0, 15) + '...' : comp.name}
                            </text>
                            <text x={x + 40} y={compY + 38} fill="rgba(255,255,255,0.5)" fontSize="9">
                              {comp.health}% health
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Connection lines to next layer */}
                      {index < ARCHITECTURE_LAYERS.length - 1 && (
                        <line
                          x1={x + width}
                          y1={y + height/2}
                          x2={x + width + 30}
                          y2={y + height/2}
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* RADIAL VIEW */}
          {viewMode === 'radial' && (
            <div className="flex justify-center items-center min-h-[600px]">
              <svg className="w-full max-w-[700px] h-[600px]" viewBox="0 0 700 600">
                {/* Center */}
                <circle cx="350" cy="300" r="40" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="2" />
                <text x="350" y="295" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">ORGANISM</text>
                <text x="350" y="310" textAnchor="middle" fill="white" fontSize="20">φ</text>
                
                {/* Rings */}
                {ARCHITECTURE_LAYERS.map((layer, index) => {
                  const radius = 80 + index * 50;
                  const componentCount = layer.components.length;
                  
                  return (
                    <g key={layer.id}>
                      {/* Ring */}
                      <circle 
                        cx="350" 
                        cy="300" 
                        r={radius}
                        fill="none"
                        stroke={layer.color}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        opacity="0.5"
                      />
                      
                      {/* Layer label */}
                      <text 
                        x="350" 
                        y={300 - radius - 10}
                        textAnchor="middle"
                        fill={layer.color}
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {layer.name}
                      </text>
                      
                      {/* Components on ring */}
                      {layer.components.map((comp, compIndex) => {
                        const angle = (compIndex / componentCount) * Math.PI * 2 - Math.PI / 2;
                        const x = 350 + Math.cos(angle) * radius;
                        const y = 300 + Math.sin(angle) * radius;
                        
                        return (
                          <g key={comp.id}>
                            <circle
                              cx={x}
                              cy={y}
                              r="15"
                              fill={layer.color}
                              opacity="0.8"
                            />
                            <circle
                              cx={x}
                              cy={y}
                              r="5"
                              fill={comp.status === 'active' ? '#2ecc71' : '#f39c12'}
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Component Detail Panel */}
        {selectedComponent && (
          <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-xl bg-slate-800/90 border-t border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedComponent.status)}`} />
                  <h3 className="text-xl font-bold text-white">{selectedComponent.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-white/60">Status: {selectedComponent.status}</span>
                  <span className={getHealthColor(selectedComponent.health)}>Health: {selectedComponent.health}%</span>
                  <span className="text-white/60">Connections: {selectedComponent.connections.length}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedComponent(null)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {selectedComponent.connections.length > 0 && (
              <div className="mt-4">
                <h4 className="text-white/60 text-sm mb-2">Connected To:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedComponent.connections.map(connId => {
                    const connectedComp = ARCHITECTURE_LAYERS
                      .flatMap(l => l.components)
                      .find(c => c.id === connId);
                    return connectedComp ? (
                      <span 
                        key={connId}
                        className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm"
                      >
                        {connectedComp.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-24 right-8 p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
          <h4 className="text-white/80 text-sm font-semibold mb-2">Architecture Layers</h4>
          <div className="space-y-2 text-xs">
            {ARCHITECTURE_LAYERS.map(layer => (
              <div key={layer.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                <span className="text-white/60">{layer.name}</span>
              </div>
            ))}
          </div>
          
          <h4 className="text-white/80 text-sm font-semibold mt-4 mb-2">Status</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-white/60">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-white/60">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <span className="text-white/60">Idle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
