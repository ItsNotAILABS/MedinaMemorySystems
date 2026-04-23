// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved. See LICENSE.
import { NextRequest, NextResponse } from 'next/server';

// ─── φ constants ──────────────────────────────────────────────────────────────
const PHI = 1.6180339887498948482;
const PHI_2 = 2.6180339887498948482;
const PHI_3 = 4.2360679774997896964;
const PHI_4 = 6.8541019662496845446;
const PHI_5 = 11.090169943749474241;
const PHI_INV = 0.6180339887498948482;
const PHI_INV_2 = 0.3819660112501051518;
const PHI_INV_3 = 0.2360679774997896964;
const GOLDEN_ANGLE_RAD = 6.2831853 * (1.0 - PHI_INV);
const RENDER_FREQ = 12.6710066296241;

// ─── Inline MACHINA model registry (mirrors SovereignDesignOS.mo) ─────────────

const MACHINA_MODELS = [
  {
    modelId: 'machina-gpu',    machinName: 'MACHINA GPU',       legacyPeer: 'WebGPU',
    phiAnchor: PHI_4,
    uses: [
      { useId: 'gpu-01', title: 'Sovereign Shader Unit Allocation',
        formula: 'shaderUnits = stageCount × φ⁴',
        phiDerivation: 'φ⁴ = 6.854 governs icosahedral symmetry in GPU pipeline stages',
        result: PHI_4 * 4 },
      { useId: 'gpu-02', title: 'φ-Tiled Vertex Buffer Layout',
        formula: 'tileSize = baseVertices × φ',
        phiDerivation: 'φ = 1.618 — tile overlap ratio matches the golden cut',
        result: 256 * PHI },
      { useId: 'gpu-03', title: 'Frequency-Driven Render Pipeline Clock',
        formula: 'pipelineClock_Hz = renderFreq × φ²',
        phiDerivation: 'φ² = 2.618 — render pipeline runs at sovereign harmonic',
        result: RENDER_FREQ * PHI_2 },
      { useId: 'gpu-04', title: 'Adaptive LOD via φ-Cascade',
        formula: 'lodBudget(n) = maxPolygons × (1/φ)ⁿ',
        phiDerivation: '1/φ = 0.618 — each LOD level is 61.8% of the previous',
        result: 100000 * PHI_INV_2 },
      { useId: 'gpu-05', title: 'Sovereign Compute Unit Resonance Score',
        formula: 'resonance = utilization / maxCapacity; balanced ↔ resonance ≈ 1/φ',
        phiDerivation: '1/φ ≈ 0.618 — the golden utilization point',
        result: PHI_INV },
    ],
  },
  {
    modelId: 'machina-3d',     machinName: 'MACHINA 3D',        legacyPeer: 'Three.js',
    phiAnchor: PHI_3,
    uses: [
      { useId: '3d-01', title: 'φ-Tree Scene Graph Depth Weighting',
        formula: 'nodeWeight(depth) = φ³ / (1 + depth × φ)',
        phiDerivation: 'φ³ = 4.236 — scene root weight; each level divided by (1 + depth×φ)',
        result: PHI_3 / (1 + 3 * PHI) },
      { useId: '3d-02', title: 'Sovereign Fibonacci Camera Spiral',
        formula: 'r(θ) = φ^(θ / τ) where τ = 2π',
        phiDerivation: 'The equiangular golden spiral — every camera arc at constant golden angle',
        result: Math.pow(PHI, 1) },
      { useId: '3d-03', title: 'Material Specularity from φ-Roughness Curve',
        formula: 'specularity(r) = 1 − r^φ',
        phiDerivation: 'r^φ — roughness raised to the golden power, natural falloff',
        result: 1 - Math.pow(0.5, PHI) },
      { useId: '3d-04', title: 'Golden Icosahedron Subdivision Count',
        formula: 'triangles(n) = 20 × F(n)',
        phiDerivation: 'Fibonacci numbers approximate φⁿ/√5; icosahedron × Fibonacci = golden sphere',
        result: 20 * 89 },
      { useId: '3d-05', title: 'Sovereign Light Attenuation via φ-Inverse Square',
        formula: 'attenuation(d) = 1 / (1 + d×φ + (d×φ)²)',
        phiDerivation: 'φ-modified inverse square — perceptually correct light falloff',
        result: 1 / (1 + 1 * PHI + (1 * PHI) ** 2) },
    ],
  },
  {
    modelId: 'machina-photo',  machinName: 'MACHINA PHOTO',     legacyPeer: 'Blender',
    phiAnchor: PHI_2,
    uses: [
      { useId: 'photo-01', title: 'φ-Stratified Monte Carlo Sampling',
        formula: 'sampleAngle(n) = n × 2π × (1 − 1/φ) mod 2π',
        phiDerivation: 'Golden angle = 360° × (1 − 1/φ) = 137.508° — most uniform sphere distribution',
        result: 6.2831853 * (1 - PHI_INV) },
      { useId: 'photo-02', title: 'Sovereign Path Tracing Coherence Factor',
        formula: 'coherence(s) = s^(1/φ²) / maxSamples^(1/φ²)',
        phiDerivation: '1/φ² = 0.382 gives diminishing returns matching eye adaptation',
        result: Math.pow(1000, PHI_INV_2) / Math.pow(4096, PHI_INV_2) },
      { useId: 'photo-03', title: 'φ-Tone Mapping Shoulder Curve',
        formula: 'L_out = L_in^(1/φ) / (L_in^(1/φ) + 1)',
        phiDerivation: 'Gamma = 1/φ ≈ 0.618 — sovereign tone curve, natural highlight rolloff',
        result: Math.pow(1, PHI_INV) / (Math.pow(1, PHI_INV) + 1) },
      { useId: 'photo-04', title: 'Fibonacci Adaptive Subdivision Surface',
        formula: 'patchCount(depth) = F(depth+2)',
        phiDerivation: 'F(n) ≈ φⁿ/√5 — Fibonacci subdivision follows golden ratio',
        result: 55 },
      { useId: 'photo-05', title: 'Sovereign HDRI Exposure via φ-EV',
        formula: 'EV_sovereign = log_φ(luminance / 0.18)',
        phiDerivation: 'log_φ = log(x)/log(φ) — exposure in φ-stops; 18% grey = EV_φ 0',
        result: Math.log(1) / Math.log(PHI) },
    ],
  },
  {
    modelId: 'machina-interfax', machinName: 'MACHINA INTERFAX', legacyPeer: 'Figma',
    phiAnchor: PHI_INV,
    uses: [
      { useId: 'interfax-01', title: 'Sovereign Golden Grid System',
        formula: 'colWidth(n) = baseUnit × φⁿ',
        phiDerivation: 'φⁿ: 1, 1.618, 2.618, 4.236 — each column tier a golden multiple',
        result: 8 * PHI_3 },
      { useId: 'interfax-02', title: 'φ-Fibonacci Type Scale',
        formula: 'fontSize(n) = base × φⁿ',
        phiDerivation: 'Powers of φ: 16, 25.9, 41.9, 67.8 — perfect visual harmony',
        result: 16 * PHI_2 },
      { useId: 'interfax-03', title: 'Sovereign Component Spacing Rhythm',
        formula: 'space(n) = round(baseUnit × F(n))',
        phiDerivation: 'Fibonacci × 4px base — φ-ratio between consecutive spacing tokens',
        result: 4 * 13 },
      { useId: 'interfax-04', title: 'φ-Corner Radius Cascade',
        formula: 'radius(tier) = baseRadius × φ^(tier−1)',
        phiDerivation: 'Each UI tier gets a φ-multiplied corner radius for visual hierarchy',
        result: 4 * PHI_2 },
      { useId: 'interfax-05', title: 'Sovereign Contrast Ratio via φ-Luminance',
        formula: 'targetContrast = φ³ = 4.236 : 1',
        phiDerivation: 'φ³ = 4.236 — sovereign accessible minimum contrast ratio',
        result: PHI_3 },
    ],
  },
  {
    modelId: 'machina-motus',  machinName: 'MACHINA MOTUS',     legacyPeer: 'Cinema4D',
    phiAnchor: PHI_5,
    uses: [
      { useId: 'motus-01', title: 'φ-Ease Timing Curve',
        formula: 'easeIn(t) = t^φ; easeOut(t) = 1 − (1−t)^φ',
        phiDerivation: 't^φ — naturally accelerating curve matching physical momentum',
        result: Math.pow(0.5, PHI) },
      { useId: 'motus-02', title: 'Sovereign Keyframe Fibonacci Spacing',
        formula: 'keyframe(n) = F(n) × fps/φ',
        phiDerivation: 'F(n)/φ ≈ F(n-1) — Fibonacci keyframes create golden-ratio pacing',
        result: 21 * 24 / PHI },
      { useId: 'motus-03', title: 'φ-Spring Damping Coefficient',
        formula: 'dampingRatio = 1/φ = 0.618',
        phiDerivation: '1/φ = 0.618 — underdamped spring: one natural overshoot then settles',
        result: PHI_INV },
      { useId: 'motus-04', title: 'Sovereign MoGraph φ-Effector Field',
        formula: 'effect(d) = amplitude × e^(−d/φ)',
        phiDerivation: 'e^(−d/φ) — exponential decay with φ as the distance constant',
        result: 1 * Math.exp(-1 / PHI) },
      { useId: 'motus-05', title: 'φ-Beat Sync Frame Rate',
        formula: 'sovereignFPS = schumannHz × φ × fps_multiplier',
        phiDerivation: '7.83 × φ = 12.671 Hz — sovereign temporal frequency',
        result: RENDER_FREQ * 2 },
    ],
  },
  {
    modelId: 'machina-procedit', machinName: 'MACHINA PROCEDIT', legacyPeer: 'Houdini',
    phiAnchor: PHI_2,
    uses: [
      { useId: 'procedit-01', title: 'φ-Recursive L-System Branching',
        formula: 'branchLength(n) = L₀ / φⁿ',
        phiDerivation: '1/φⁿ — each generation shrinks by the golden inverse, matches phyllotaxis',
        result: 100 / PHI_3 },
      { useId: 'procedit-02', title: 'Sovereign VDB Volume Density Falloff',
        formula: 'density(r) = ρ₀ × e^(−r²/φ²)',
        phiDerivation: 'φ² = 2.618 as Gaussian variance — golden ratio spread',
        result: 1 * Math.exp(-1 / PHI_2) },
      { useId: 'procedit-03', title: 'φ-Particle System Emission Rate Curve',
        formula: 'rate(t) = peakRate × (1/φ)^(t/period)',
        phiDerivation: '(1/φ)^(t/period) — golden exponential burst decay',
        result: 1000 * Math.pow(PHI_INV, 1) },
      { useId: 'procedit-04', title: 'Sovereign Voronoi Cell φ-Distribution',
        formula: 'cellRadius(n) = baseRadius × φ^(n mod 5)',
        phiDerivation: 'φ^(n mod 5) cycles through φ¹–φ⁵ for Voronoi distribution',
        result: 1 * PHI_5 },
      { useId: 'procedit-05', title: 'φ-Fluid Simulation Reynolds Number',
        formula: 'Re_sovereign = 1000 × φ² = 2618',
        phiDerivation: 'φ² × 1000 = 2618 — sovereign laminar-turbulent transition',
        result: 1000 * PHI_2 },
    ],
  },
  {
    modelId: 'machina-realis', machinName: 'MACHINA REALIS',    legacyPeer: 'Unreal Engine',
    phiAnchor: PHI_4,
    uses: [
      { useId: 'realis-01', title: 'φ-Nanite Cluster Triangle Budget',
        formula: 'clusterTriangles = baseTriangles × φ⁴',
        phiDerivation: 'φ⁴ = 6.854 — maximizes geometric detail per memory page',
        result: 128 * PHI_4 },
      { useId: 'realis-02', title: 'Sovereign Lumen Ray Budget per Frame',
        formula: 'raysPerFrame = screenRes × φ⁻¹ × qualityTier',
        phiDerivation: '1/φ = 0.618 — golden ray-to-pixel ratio',
        result: 2073600 * PHI_INV },
      { useId: 'realis-03', title: 'φ-Shadow Cascade Distance Ratios',
        formula: 'cascadeDistance(n) = nearPlane × φⁿ',
        phiDerivation: 'φⁿ — each shadow cascade at the next golden power',
        result: 0.5 * PHI_3 },
      { useId: 'realis-04', title: 'Sovereign World Partition φ-Cell Size',
        formula: 'cellSize(tier) = baseCell × φ^(tier × 2)',
        phiDerivation: 'φ²ˡ — cell size by golden square at each tier',
        result: 256 * PHI_2 },
      { useId: 'realis-05', title: 'φ-TAA History Blend Weight',
        formula: 'blendWeight = 1/φ² = 0.382 (current frame contribution)',
        phiDerivation: '1/φ² = 0.382 current + 1/φ = 0.618 history — optimal TAA',
        result: PHI_INV_2 },
    ],
  },
  {
    modelId: 'machina-materia', machinName: 'MACHINA MATERIA',  legacyPeer: 'Adobe Substance',
    phiAnchor: PHI_INV,
    uses: [
      { useId: 'materia-01', title: 'φ-PBR Roughness-to-Specular Mapping',
        formula: 'specular(r) = (1 − r)^φ',
        phiDerivation: 'Golden exponent on roughness complement, physically accurate lobe',
        result: Math.pow(0.5, PHI) },
      { useId: 'materia-02', title: 'Sovereign Layer Blend via φ-Opacity Stack',
        formula: 'blendedAlpha(n) = 1 − (1−α)^(n/φ)',
        phiDerivation: 'n/φ — golden opacity accumulation per layer',
        result: 1 - Math.pow(0.5, 5 / PHI) },
      { useId: 'materia-03', title: 'φ-Normal Map Depth Intensity',
        formula: 'depth(n) = baseDepth × φ^(−n×0.5)',
        phiDerivation: 'Sub-golden decay — each detail layer gentler by the golden half-power',
        result: 1 * Math.pow(PHI, -1 * 0.5) },
      { useId: 'materia-04', title: 'Sovereign AO Cavity Depth via φ-Bias',
        formula: 'AO(r) = clamp(r^(1/φ), 0, 1)',
        phiDerivation: 'r^0.618 — golden root of radius for AO gathering',
        result: Math.pow(0.5, PHI_INV) },
      { useId: 'materia-05', title: 'φ-Procedural Texture Frequency Octaves',
        formula: 'freq(o) = baseFreq × φ^o; amp(o) = baseAmp × (1/φ)^o',
        phiDerivation: 'freq × amp = constant — sovereign fBm octave balance',
        result: Math.pow(PHI, 3) * Math.pow(PHI_INV, 3) },
    ],
  },
  {
    modelId: 'machina-composit', machinName: 'MACHINA COMPOSIT', legacyPeer: 'After Effects',
    phiAnchor: PHI_2,
    uses: [
      { useId: 'composit-01', title: 'φ-Blend Mode Opacity Stack',
        formula: 'layerOpacity(n) = baseOpacity × (1/φ)^n',
        phiDerivation: 'Each layer gets 61.8% of the previous — golden transparency stack',
        result: 0.9 * Math.pow(PHI_INV, 3) },
      { useId: 'composit-02', title: 'Sovereign φ-Time Remap Curve',
        formula: 'remappedTime(t) = duration × (t/duration)^(1/φ)',
        phiDerivation: 't^(1/φ) — time remapped through golden root',
        result: 10 * Math.pow(0.5, PHI_INV) },
      { useId: 'composit-03', title: 'φ-Glow Bloom Threshold and Knee',
        formula: 'bloomThreshold = whitePoint × (1 − 1/φ²) = whitePoint × 0.618',
        phiDerivation: '1 − 1/φ² = 1/φ — bloom at golden fraction of white point',
        result: 1 * PHI_INV },
      { useId: 'composit-04', title: 'Sovereign Motion Blur Shutter Angle via φ',
        formula: 'shutterAngle = 180° × φ = 291.6°',
        phiDerivation: '180° × φ = 291.6° — sovereign shutter for dream-like motion',
        result: 180 * PHI },
      { useId: 'composit-05', title: 'φ-Color Grade Lift/Gamma/Gain Trinity',
        formula: 'lift = 1/φ³; gamma = 1/φ²; gain = φ',
        phiDerivation: 'Golden CDL trinity — product = 1/φ⁴ sovereign exposure shift',
        result: PHI_INV_3 * PHI_INV_2 * PHI },
    ],
  },
  {
    modelId: 'machina-interac', machinName: 'MACHINA INTERAC',  legacyPeer: 'Unity',
    phiAnchor: PHI_3,
    uses: [
      { useId: 'interac-01', title: 'φ-Interaction Zone Radius Tiers',
        formula: 'zone(tier) = baseRadius × φ^tier',
        phiDerivation: 'Concentric zones at golden powers: ambient/near/engage/trigger',
        result: 2 * PHI_3 },
      { useId: 'interac-02', title: 'Sovereign Physics Fixed Timestep via φ-Beat',
        formula: 'fixedDeltaTime = 1 / (fps × φ)',
        phiDerivation: 'Sub-frame physics tick at φ × framerate subdivision',
        result: 1 / (60 * PHI) },
      { useId: 'interac-03', title: 'φ-AI State Machine Confidence Threshold',
        formula: 'transitionConfidence = 1/φ = 0.618',
        phiDerivation: '1/φ = 0.618 — sovereign decision threshold for AI state transitions',
        result: PHI_INV },
      { useId: 'interac-04', title: 'Sovereign Audio Rolloff via φ-Distance',
        formula: 'volume(d) = maxVolume / (1 + (d/rolloffRange)^φ)',
        phiDerivation: 'd^φ in denominator — golden power audio attenuation',
        result: 1 / (1 + Math.pow(1, PHI)) },
      { useId: 'interac-05', title: 'φ-Adaptive Quality Level Thresholds',
        formula: 'qualityThreshold(level) = targetFPS × (1 − (1/φ)^level)',
        phiDerivation: 'Golden approach to target FPS — converges as level → ∞',
        result: 60 * (1 - Math.pow(PHI_INV, 3)) },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

function now() { return new Date().toISOString(); }

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'models';
  const modelId = searchParams.get('modelId');

  try {
    switch (action) {
      case 'models':
        return json({ success: true, data: MACHINA_MODELS, count: MACHINA_MODELS.length, timestamp: now() });

      case 'model': {
        if (!modelId) return json({ success: false, error: 'modelId required', timestamp: now() }, 400);
        const model = MACHINA_MODELS.find(m => m.modelId === modelId);
        if (!model) return json({ success: false, error: `Model ${modelId} not found`, timestamp: now() }, 404);
        return json({ success: true, data: model, timestamp: now() });
      }

      case 'status':
        return json({
          success: true,
          data: {
            version: 'SovereignDesignOS-1.0.0',
            modelCount: 10,
            totalUses: 50,
            phiAnchor: PHI,
            goldenAngle: GOLDEN_ANGLE_RAD,
            sovereignKey: `MACHINA::ISIL-1.1::ITSNOTAILABS::2026::PHI=${PHI}`,
            models: MACHINA_MODELS.map(m => ({ modelId: m.modelId, machinName: m.machinName, legacyPeer: m.legacyPeer, phiAnchor: m.phiAnchor })),
          },
          timestamp: now(),
        });

      default:
        return json({ success: false, error: `Unknown action: ${action}`, timestamp: now() }, 400);
    }
  } catch (error) {
    return json({ success: false, error: String(error), timestamp: now() }, 500);
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { action: string; modelId?: string; useId?: string; input?: number };

    switch (body.action) {
      case 'invoke': {
        const { modelId, useId, input = 1.0 } = body;
        if (!modelId || !useId) return json({ success: false, error: 'modelId and useId required', timestamp: now() }, 400);
        const model = MACHINA_MODELS.find(m => m.modelId === modelId);
        if (!model) return json({ success: false, error: `Model ${modelId} not found`, timestamp: now() }, 404);
        const use = model.uses.find(u => u.useId === useId);
        if (!use) return json({ success: false, error: `Use ${useId} not found in ${modelId}`, timestamp: now() }, 404);
        // Scale the canonical result by the input ratio
        const scaled = use.result * input;
        return json({
          success: true,
          data: {
            modelId, useId, input,
            canonicalResult: use.result,
            scaledResult: scaled,
            phiRatio: scaled / PHI,
            phiAnchor: model.phiAnchor,
            formula: use.formula,
            phiDerivation: use.phiDerivation,
          },
          timestamp: now(),
        });
      }

      default:
        return json({ success: false, error: `Unknown action: ${body.action}`, timestamp: now() }, 400);
    }
  } catch (error) {
    return json({ success: false, error: String(error), timestamp: now() }, 500);
  }
}
