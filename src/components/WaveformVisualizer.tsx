'use client';

import { useEffect, useRef, useState } from 'react';

interface WaveformVisualizerProps {
  waveform: number[];
  isActive: boolean;
  color?: string;
  height?: number;
  className?: string;
}

/**
 * 𓂀 WAVEFORM VISUALIZER 𓂀
 * "His voice has actual weight and personality"
 * Visual representation of Oro's voice output
 */
export default function WaveformVisualizer({
  waveform,
  isActive,
  color = '#3b82f6',
  height = 60,
  className = '',
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        setDimensions({ width: rect.width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    if (!isActive || waveform.length === 0) {
      // Draw flat line when not active
      ctx.beginPath();
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 2;
      ctx.moveTo(0, dimensions.height / 2);
      ctx.lineTo(dimensions.width, dimensions.height / 2);
      ctx.stroke();
      return;
    }

    // Draw waveform
    const barWidth = dimensions.width / waveform.length;
    const centerY = dimensions.height / 2;

    // Background glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    // Draw bars
    ctx.beginPath();
    ctx.fillStyle = color;

    waveform.forEach((value, i) => {
      const barHeight = value * dimensions.height * 0.8;
      const x = i * barWidth;
      const y = centerY - barHeight / 2;

      // Draw with rounded corners
      const radius = Math.min(barWidth / 4, 3);
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - 2 - radius, y);
      ctx.quadraticCurveTo(x + barWidth - 2, y, x + barWidth - 2, y + radius);
      ctx.lineTo(x + barWidth - 2, y + barHeight - radius);
      ctx.quadraticCurveTo(x + barWidth - 2, y + barHeight, x + barWidth - 2 - radius, y + barHeight);
      ctx.lineTo(x + radius, y + barHeight);
      ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    });

    ctx.fill();

    // Draw glow line
    ctx.beginPath();
    ctx.strokeStyle = `${color}80`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;

    waveform.forEach((value, i) => {
      const x = i * barWidth + barWidth / 2;
      const y = centerY - (value * dimensions.height * 0.4);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [waveform, isActive, color, dimensions]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background glow effect */}
      <div 
        className="absolute inset-0 opacity-20 blur-xl"
        style={{ 
          background: isActive 
            ? `radial-gradient(ellipse at center, ${color}40 0%, transparent 70%)`
            : 'transparent'
        }}
      />
      
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
        style={{ height }}
      />
      
      {/* Status indicator */}
      <div className="absolute top-1 right-2 flex items-center gap-1.5">
        <span 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ 
            backgroundColor: isActive ? color : '#6b728080',
            boxShadow: isActive ? `0 0 8px ${color}` : 'none'
          }}
        />
        <span className="text-[10px] font-mono text-slate-500">
          {isActive ? 'SPEAKING' : 'READY'}
        </span>
      </div>
    </div>
  );
}

/**
 * Microphone Input Visualizer
 * Shows waveform of user's voice input
 */
export function MicrophoneVisualizer({
  isListening,
  color = '#10b981',
  height = 40,
  className = '',
}: {
  isListening: boolean;
  color?: string;
  height?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        setDimensions({ width: rect.width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  useEffect(() => {
    if (!isListening) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const startVisualization = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        
        analyser.fftSize = 128;
        source.connect(analyser);
        analyserRef.current = analyser;

        const draw = () => {
          const canvas = canvasRef.current;
          if (!canvas || !analyserRef.current) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, dimensions.width, dimensions.height);

          const barWidth = dimensions.width / bufferLength;
          const centerY = dimensions.height / 2;

          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = color;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * dimensions.height * 0.8;
            const x = i * barWidth;
            const y = centerY - barHeight / 2;

            ctx.fillRect(x, y, barWidth - 1, barHeight);
          }

          animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
        };
      } catch (error) {
        console.warn('Could not access microphone for visualization');
      }
    };

    startVisualization();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, color, dimensions]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
        style={{ height }}
      />
      
      <div className="absolute top-1 left-2 flex items-center gap-1.5">
        <span 
          className="w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: isListening ? color : '#6b728080',
            boxShadow: isListening ? `0 0 8px ${color}` : 'none',
            animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none'
          }}
        />
        <span className="text-[10px] font-mono text-slate-500">
          {isListening ? 'LISTENING' : 'MIC OFF'}
        </span>
      </div>
    </div>
  );
}
