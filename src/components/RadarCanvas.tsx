import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { NetworkDevice, DeviceType } from '../types';
import { Router, Smartphone, Laptop, Monitor, HelpCircle, Wifi, Signal, Activity, X } from 'lucide-react';
import { cn } from '../utils';

interface RadarCanvasProps {
  devices: NetworkDevice[];
}

export default function RadarCanvas({ devices }: RadarCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);

  // Initialize D3 zoom/pan
  useEffect(() => {
    if (!wrapperRef.current) return;

    const zoom = d3.zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.3, 3]) // Limit zoom to 0.3x -> 3x
      .on('zoom', (e) => {
        setTransform(e.transform);
      });

    const wrapper = d3.select(wrapperRef.current);
    wrapper.call(zoom);

    // Initial center transform
    const { clientWidth, clientHeight } = wrapperRef.current;
    wrapper.call(
      zoom.transform,
      d3.zoomIdentity.translate(clientWidth / 2, clientHeight / 2)
    );
  }, []);

  // Map device types to icons
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'router': return <Router className="w-5 h-5" />;
      case 'smartphone': return <Smartphone className="w-5 h-5" />;
      case 'laptop': return <Laptop className="w-5 h-5" />;
      case 'desktop': return <Monitor className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getSignalColor = (signal: number) => {
    if (signal > -50) return 'text-green-500 border-green-500 bg-[#1a1a1f]';
    if (signal > -70) return 'text-blue-500 border-blue-500 bg-[#1a1a1f]';
    return 'text-red-500 border-red-500 bg-[#1a1a1f]';
  };
  
  const getSignalLineColor = (signal: number) => {
    if (signal > -50) return 'rgba(34, 197, 94, 0.2)';
    if (signal > -70) return 'rgba(59, 130, 246, 0.2)';
    return 'rgba(239, 68, 68, 0.2)';
  }

  return (
    <div 
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      ref={wrapperRef}
      onClick={() => setSelectedDevice(null)}
    >
      {/* Panning Grid & Radar Content */}
      <div
        className="absolute inset-0 pointer-events-none origin-top-left"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
        }}
      >
        {/* Radar Rings (Concentric Circles) */}
        <svg className="absolute inset-0 overflow-visible">
          {/* Radar Circles */}
          <g>
            {[150, 300, 450, 600].map(r => (
              <circle 
                key={r} 
                cx={0} 
                cy={0} 
                r={r} 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.05)" 
                strokeWidth={1} 
              />
            ))}
            <line x1={-2000} y1={0} x2={2000} y2={0} stroke="rgba(255, 255, 255, 0.05)" strokeWidth={1} />
            <line x1={0} y1={-2000} x2={0} y2={2000} stroke="rgba(255, 255, 255, 0.05)" strokeWidth={1} />
            
            <text x={0} y={-590} fill="#475569" fontSize={10} fontFamily="monospace" textAnchor="middle">-90dBm</text>
            <text x={0} y={-440} fill="#475569" fontSize={10} fontFamily="monospace" textAnchor="middle">-70dBm</text>
            <text x={0} y={-290} fill="#475569" fontSize={10} fontFamily="monospace" textAnchor="middle">-50dBm</text>
            <text x={0} y={-140} fill="#475569" fontSize={10} fontFamily="monospace" textAnchor="middle">-30dBm</text>
          </g>

          {/* Connecting Lines */}
          <g>
            {devices.map(d => (
              <line 
                key={`line-${d.id}`} 
                x1={0} 
                y1={0} 
                x2={d.x} 
                y2={d.y} 
                stroke={getSignalLineColor(d.signalStrength)} 
                strokeWidth={selectedDevice?.id === d.id ? 2 : 1}
                strokeDasharray={selectedDevice?.id === d.id ? "none" : "2 4"}
                className="transition-all duration-300"
              />
            ))}
          </g>
        </svg>

        {/* Center Node (My Device) */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center relative backdrop-blur-md">
            <div className="absolute inset-0 rounded-full border border-blue-400 animate-pulse opacity-50"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          </div>
          <span className="mt-2 text-[10px] font-mono text-blue-400 uppercase tracking-widest">
            WLAN0
          </span>
        </div>

        {/* Remote Devices */}
        {devices.map(d => (
          <div
            key={d.id}
            className="absolute top-0 left-0 pointer-events-auto"
            style={{ transform: `translate(${d.x}px, ${d.y}px)` }}
          >
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedDevice(d); 
              }}
              className={cn(
                "group relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300",
                selectedDevice?.id === d.id ? "scale-110 z-10" : "hover:scale-105 z-0"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                getSignalColor(d.signalStrength),
                selectedDevice?.id === d.id ? "ring-2 ring-offset-2 ring-offset-[#08080a] ring-slate-500 opacity-100" : "opacity-80 group-hover:opacity-100"
              )}>
                {getDeviceIcon(d.type)}
              </div>
              
              {/* Minimal Label */}
              <span className={cn(
                "mt-2 text-[10px] font-mono whitespace-nowrap transition-colors",
                selectedDevice?.id === d.id
                  ? "text-white"
                  : "text-slate-500 group-hover:text-slate-300"
              )}>
                {d.ssid}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Floating Info Panel (sleek modal style) */}
      <div className={cn(
        "absolute right-8 top-8 w-72 bg-[#0d0d12]/90 border border-white/10 rounded-xl backdrop-blur-xl p-6 z-30 shadow-2xl transition-all duration-300 ease-out transform pointer-events-auto",
        selectedDevice ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0 pointer-events-none"
      )}>
        {selectedDevice && (
          <div className="relative">
            <button 
              onClick={() => setSelectedDevice(null)}
              className="absolute -top-2 -right-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold tracking-tighter text-blue-400 uppercase">Node Intelligence</span>
              <div className={cn("w-2 h-2 rounded-full", 
                selectedDevice.signalStrength > -50 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : 
                selectedDevice.signalStrength > -70 ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : 
                "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
              )}></div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase">Device Name</span>
                <span className="text-sm text-white font-medium">{selectedDevice.ssid}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase">Signal</span>
                  <span className={cn("text-sm font-mono",
                    selectedDevice.signalStrength > -50 ? "text-green-400" : 
                    selectedDevice.signalStrength > -70 ? "text-blue-400" : 
                    "text-red-400"
                  )}>{selectedDevice.signalStrength} dBm</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase">Type</span>
                  <span className="text-sm text-white font-mono capitalize">{selectedDevice.type}</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase">MAC Address</span>
                <span className="text-xs text-slate-300 font-mono">{selectedDevice.mac}</span>
              </div>

              <div className="pt-4 mt-2 border-t border-white/5">
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded uppercase tracking-wider transition-colors">
                  Block Connection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute left-8 bottom-8 flex flex-col gap-2 z-20 pointer-events-none">
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div> TRUSTED NODE
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div> STATIC IP
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <div className="w-2 h-2 rounded-full bg-red-500"></div> ROGUE / UNKNOWN
        </div>
      </div>
    </div>
  );
}
