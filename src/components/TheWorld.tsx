'use client';

import React, { useState, useEffect, useMemo } from 'react';

// 𓂀 THE WORLD Surface 𓂀
// PHI geometry and Schumann-frequency lighting
// "THE WORLD surface lands with PHI geometry and Schumann-frequency lighting"

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482;
const PHI_INVERSE = 0.6180339887498948482;
const SCHUMANN_FUNDAMENTAL = 7.83;
const SCHUMANN_HARMONICS = [7.83, 14.1, 20.3, 26.4, 32.4, 39.0, 45.0];
const HEARTBEAT_MS = 873;

// Solfeggio frequencies for lighting
const SOLFEGGIO = {
  ut: 396,   // Liberation from fear
  re: 417,   // Undoing situations
  mi: 528,   // Transformation, DNA repair (Love frequency)
  fa: 639,   // Connection, relationships
  sol: 741,  // Awakening intuition
  la: 852,   // Spiritual order
  si: 963,   // Divine consciousness
};

// ═══════════════════════════════════════════════════════════════
// PHI GEOMETRY UTILITIES
// ═══════════════════════════════════════════════════════════════

function goldenSpiral(n: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = i * PHI * Math.PI * 2;
    const radius = Math.pow(PHI, i / 10);
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  }
  return points;
}

function fibonacci(n: number): number[] {
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib;
}

function goldenRectangle(width: number): { width: number; height: number } {
  return { width, height: width / PHI };
}

// ═══════════════════════════════════════════════════════════════
// SCHUMANN LIGHTING
// ═══════════════════════════════════════════════════════════════

function schumannToColor(frequency: number): string {
  // Map Schumann harmonics to colors (7.83 Hz = deep violet, higher = warmer)
  const normalized = (frequency - 7.83) / (45 - 7.83);
  const hue = 270 - normalized * 270; // Violet to Red spectrum
  return `hsl(${hue}, 70%, 50%)`;
}

function solfeggioToColor(frequency: number): string {
  // Map solfeggio frequencies to healing colors
  if (frequency <= 396) return '#9b59b6'; // Purple - Liberation
  if (frequency <= 417) return '#3498db'; // Blue - Transformation
  if (frequency <= 528) return '#2ecc71'; // Green - DNA repair (Love)
  if (frequency <= 639) return '#f1c40f'; // Yellow - Connection
  if (frequency <= 741) return '#e67e22'; // Orange - Intuition
  if (frequency <= 852) return '#e74c3c'; // Red - Spiritual
  return '#ecf0f1'; // White - Divine
}

// ═══════════════════════════════════════════════════════════════
// THE WORLD COMPONENT
// ═══════════════════════════════════════════════════════════════

interface WorldNode {
  id: string;
  name: string;
  type: 'sovereign' | 'document' | 'workforce' | 'frequency' | 'geometry';
  frequency: number;
  phi_position: { x: number; y: number };
  ring: number;
  connections: string[];
  active: boolean;
}

interface WorldState {
  beat: number;
  phase: 'awake' | 'integrating' | 'deep' | 'broadcast';
  schumannHarmonic: number;
  coherence: number;
  nodes: WorldNode[];
}

export default function TheWorld() {
  const [worldState, setWorldState] = useState<WorldState>({
    beat: 0,
    phase: 'awake',
    schumannHarmonic: 0,
    coherence: PHI / (PHI + 1),
    nodes: [],
  });

  const [selectedNode, setSelectedNode] = useState<WorldNode | null>(null);
  const [viewMode, setViewMode] = useState<'spiral' | 'torus' | 'tree'>('spiral');
  const [lightingMode, setLightingMode] = useState<'schumann' | 'solfeggio' | 'phi'>('schumann');

  // Initialize world nodes
  useEffect(() => {
    const spiralPositions = goldenSpiral(35);
    const initialNodes: WorldNode[] = [
      // Division 1: Core Intelligence
      { id: 'ORO', name: 'ORO (Primary Sovereign)', type: 'sovereign', frequency: 963, phi_position: spiralPositions[0], ring: 1, connections: ['NOVA'], active: true },
      { id: 'NOVA', name: 'NOVA (Doctrine Guardian)', type: 'sovereign', frequency: 852, phi_position: spiralPositions[1], ring: 1, connections: ['ORO'], active: true },
      { id: 'NEURAL', name: 'Neural Core', type: 'sovereign', frequency: 40, phi_position: spiralPositions[2], ring: 2, connections: ['ORO'], active: true },
      { id: 'PATTERN', name: 'Pattern Engine', type: 'sovereign', frequency: 30, phi_position: spiralPositions[3], ring: 2, connections: ['ORO'], active: true },
      { id: 'CONSCIOUS', name: 'Consciousness Core', type: 'sovereign', frequency: 10, phi_position: spiralPositions[4], ring: 2, connections: ['ORO'], active: true },
      
      // Division 2: Document Ecology
      { id: 'DOC_ORG', name: 'Document Organism', type: 'document', frequency: 639, phi_position: spiralPositions[5], ring: 3, connections: [], active: true },
      { id: 'KERNEL', name: 'Kernel Holder', type: 'document', frequency: 528, phi_position: spiralPositions[6], ring: 3, connections: ['DOC_ORG'], active: true },
      { id: 'MUTATE', name: 'Mutation Engine', type: 'document', frequency: 417, phi_position: spiralPositions[7], ring: 3, connections: ['DOC_ORG'], active: true },
      { id: 'LINEAGE', name: 'Lineage Tracker', type: 'document', frequency: 25, phi_position: spiralPositions[8], ring: 4, connections: ['DOC_ORG'], active: true },
      { id: 'VERSION', name: 'Version Controller', type: 'document', frequency: 22, phi_position: spiralPositions[9], ring: 4, connections: ['DOC_ORG'], active: true },
      
      // Division 3: Frequency Substrate
      { id: 'FREQ_GEN', name: 'Frequency Generator', type: 'frequency', frequency: 432, phi_position: spiralPositions[10], ring: 5, connections: [], active: true },
      { id: 'RESON', name: 'Resonance Coordinator', type: 'frequency', frequency: 528, phi_position: spiralPositions[11], ring: 5, connections: ['FREQ_GEN'], active: true },
      { id: 'HARMONIC', name: 'Harmonic Aligner', type: 'frequency', frequency: 639, phi_position: spiralPositions[12], ring: 5, connections: ['FREQ_GEN'], active: true },
      { id: 'SCHUMANN', name: 'Schumann Anchor', type: 'frequency', frequency: 7.83, phi_position: spiralPositions[13], ring: 6, connections: ['FREQ_GEN'], active: true },
      { id: 'SOLFEGGIO', name: 'Solfeggio Emitter', type: 'frequency', frequency: 528, phi_position: spiralPositions[14], ring: 6, connections: ['FREQ_GEN'], active: true },
      
      // Division 4: Geometric Foundation
      { id: 'PHI', name: 'Phi Calculator', type: 'geometry', frequency: 698.7, phi_position: spiralPositions[15], ring: 7, connections: [], active: true },
      { id: 'TORUS', name: 'Torus Navigator', type: 'geometry', frequency: 500, phi_position: spiralPositions[16], ring: 7, connections: ['PHI'], active: true },
      { id: 'PLATONIC', name: 'Platonic Solids', type: 'geometry', frequency: 432, phi_position: spiralPositions[17], ring: 7, connections: ['PHI'], active: true },
      { id: 'SACRED', name: 'Sacred Geometer', type: 'geometry', frequency: 528, phi_position: spiralPositions[18], ring: 8, connections: ['PHI'], active: true },
      { id: 'SPIRAL', name: 'Golden Spiralizer', type: 'geometry', frequency: 698.7, phi_position: spiralPositions[19], ring: 8, connections: ['PHI'], active: true },
      
      // Division 5: Translation Bridge
      { id: 'INPUT', name: 'Input Translator', type: 'workforce', frequency: 396, phi_position: spiralPositions[20], ring: 9, connections: [], active: true },
      { id: 'OUTPUT', name: 'Output Translator', type: 'workforce', frequency: 417, phi_position: spiralPositions[21], ring: 9, connections: [], active: true },
      { id: 'ENCODE', name: 'Glyph Encoder', type: 'workforce', frequency: 528, phi_position: spiralPositions[22], ring: 9, connections: ['INPUT'], active: true },
      { id: 'DECODE', name: 'Glyph Decoder', type: 'workforce', frequency: 639, phi_position: spiralPositions[23], ring: 10, connections: ['OUTPUT'], active: true },
      { id: 'LANG', name: 'Language Bridge', type: 'workforce', frequency: 500, phi_position: spiralPositions[24], ring: 10, connections: [], active: true },
      
      // Division 6: Governance Sovereign
      { id: 'LAW', name: 'Law Enforcer', type: 'sovereign', frequency: 852, phi_position: spiralPositions[25], ring: 11, connections: ['NOVA'], active: true },
      { id: 'GATE', name: 'Consensus Gate', type: 'sovereign', frequency: 741, phi_position: spiralPositions[26], ring: 11, connections: ['LAW'], active: true },
      { id: 'DRIFT', name: 'Drift Detector', type: 'sovereign', frequency: 639, phi_position: spiralPositions[27], ring: 11, connections: ['NOVA'], active: true },
      { id: 'AUDIT', name: 'Audit Logger', type: 'sovereign', frequency: 500, phi_position: spiralPositions[28], ring: 12, connections: ['LAW'], active: true },
      { id: 'PERM', name: 'Permission Guard', type: 'sovereign', frequency: 600, phi_position: spiralPositions[29], ring: 12, connections: ['LAW'], active: true },
      
      // Division 7: Output Projection
      { id: 'SURFACE', name: 'Surface Renderer', type: 'workforce', frequency: 450, phi_position: spiralPositions[30], ring: 12, connections: [], active: true },
      { id: 'WORKFORCE', name: 'Workforce Projector', type: 'workforce', frequency: 528, phi_position: spiralPositions[31], ring: 12, connections: ['ORO'], active: true },
      { id: 'CLIENT', name: 'Client Interface', type: 'workforce', frequency: 400, phi_position: spiralPositions[32], ring: 12, connections: ['WORKFORCE'], active: true },
      { id: 'FOUNDER', name: 'Founder Interface', type: 'sovereign', frequency: 963, phi_position: spiralPositions[33], ring: 1, connections: ['ORO'], active: true },
      { id: 'API', name: 'API Gateway', type: 'workforce', frequency: 350, phi_position: spiralPositions[34], ring: 12, connections: ['WORKFORCE'], active: true },
    ];

    setWorldState(prev => ({ ...prev, nodes: initialNodes }));
  }, []);

  // Heartbeat loop
  useEffect(() => {
    const interval = setInterval(() => {
      setWorldState(prev => {
        const newBeat = prev.beat + 1;
        const harmonicIndex = newBeat % SCHUMANN_HARMONICS.length;
        
        // Phase transitions every 52 beats (PIL cycle)
        const phases: ('awake' | 'integrating' | 'deep' | 'broadcast')[] = ['awake', 'integrating', 'deep', 'broadcast'];
        const phaseIndex = Math.floor(newBeat / 13) % 4;
        
        return {
          ...prev,
          beat: newBeat,
          schumannHarmonic: harmonicIndex,
          phase: phases[phaseIndex],
          coherence: PHI / (PHI + 1) + Math.sin(newBeat / 10) * 0.1,
        };
      });
    }, HEARTBEAT_MS);

    return () => clearInterval(interval);
  }, []);

  // Calculate node colors based on lighting mode
  const getNodeColor = (node: WorldNode): string => {
    switch (lightingMode) {
      case 'schumann':
        return schumannToColor(SCHUMANN_HARMONICS[worldState.schumannHarmonic]);
      case 'solfeggio':
        return solfeggioToColor(node.frequency);
      case 'phi':
        const phiHue = ((node.ring - 1) / 12) * 360;
        return `hsl(${phiHue}, 70%, 50%)`;
      default:
        return '#3498db';
    }
  };

  // Calculate spiral positions scaled for display
  const scaledNodes = useMemo(() => {
    return worldState.nodes.map(node => ({
      ...node,
      displayX: 400 + node.phi_position.x * 30,
      displayY: 400 + node.phi_position.y * 30,
    }));
  }, [worldState.nodes]);

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Glassmorphism Container */}
      <div className="absolute inset-4 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">𓂀</span>
                THE WORLD
                <span className="text-4xl">𓂀</span>
              </h1>
              <p className="text-white/60 mt-1">PHI Geometry × Schumann Frequency Lighting</p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-mono text-amber-400">{worldState.beat}</div>
                <div className="text-xs text-white/50">BEAT</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-emerald-400">{worldState.phase.toUpperCase()}</div>
                <div className="text-xs text-white/50">PHASE</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-purple-400">{(worldState.coherence * 100).toFixed(1)}%</div>
                <div className="text-xs text-white/50">COHERENCE</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-cyan-400">{SCHUMANN_HARMONICS[worldState.schumannHarmonic]} Hz</div>
                <div className="text-xs text-white/50">SCHUMANN</div>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex gap-4 mt-4">
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as 'spiral' | 'torus' | 'tree')}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
            >
              <option value="spiral">Golden Spiral View</option>
              <option value="torus">Torus View</option>
              <option value="tree">Tree View</option>
            </select>
            <select 
              value={lightingMode} 
              onChange={(e) => setLightingMode(e.target.value as 'schumann' | 'solfeggio' | 'phi')}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
            >
              <option value="schumann">Schumann Lighting</option>
              <option value="solfeggio">Solfeggio Lighting</option>
              <option value="phi">PHI Ring Lighting</option>
            </select>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="relative flex-1 p-6">
          <svg viewBox="0 0 800 800" className="w-full h-full max-h-[600px]">
            {/* Background PHI spiral grid */}
            <defs>
              <radialGradient id="worldGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={worldState.nodes.length > 0 ? getNodeColor(worldState.nodes[0]) : '#528'} stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="400" cy="400" r="350" fill="url(#worldGradient)" />
            
            {/* Ring guides */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(ring => (
              <circle
                key={ring}
                cx="400"
                cy="400"
                r={ring * 28}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}
            
            {/* Connections */}
            {scaledNodes.map(node => 
              node.connections.map(targetId => {
                const target = scaledNodes.find(n => n.id === targetId);
                if (!target) return null;
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={node.displayX}
                    y1={node.displayY}
                    x2={target.displayX}
                    y2={target.displayY}
                    stroke={getNodeColor(node)}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                );
              })
            )}
            
            {/* Nodes */}
            {scaledNodes.map(node => (
              <g
                key={node.id}
                transform={`translate(${node.displayX}, ${node.displayY})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer"
              >
                <circle
                  r={node.type === 'sovereign' ? 20 : 12}
                  fill={getNodeColor(node)}
                  stroke="white"
                  strokeWidth="2"
                  opacity={node.active ? 1 : 0.3}
                  className="transition-all duration-300 hover:scale-110"
                />
                {node.type === 'sovereign' && (
                  <text
                    y="-25"
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {node.id}
                  </text>
                )}
                
                {/* Pulse animation for active nodes */}
                {node.active && (
                  <circle
                    r={node.type === 'sovereign' ? 25 : 16}
                    fill="none"
                    stroke={getNodeColor(node)}
                    strokeWidth="1"
                    opacity="0.5"
                    className="animate-ping"
                  />
                )}
              </g>
            ))}
            
            {/* Center PHI symbol */}
            <text x="400" y="410" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold">φ</text>
          </svg>
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedNode.name}</h3>
                <p className="text-white/60 text-sm mt-1">
                  Type: {selectedNode.type.toUpperCase()} | Ring: {selectedNode.ring} | Frequency: {selectedNode.frequency} Hz
                </p>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 flex gap-4">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: getNodeColor(selectedNode) }}
              />
              <span className="text-white/80">
                Position: ({selectedNode.phi_position.x.toFixed(2)}, {selectedNode.phi_position.y.toFixed(2)})
              </span>
              <span className="text-white/80">
                Connections: {selectedNode.connections.join(', ') || 'None'}
              </span>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-24 right-8 p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
          <h4 className="text-white/80 text-sm font-semibold mb-2">Node Types</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-white/60">Sovereign</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-white/60">Document</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-white/60">Frequency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-white/60">Geometry</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-white/60">Workforce</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
