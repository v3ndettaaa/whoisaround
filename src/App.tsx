/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import RadarCanvas from './components/RadarCanvas';
import { dummyDevices } from './data';

export default function App() {
  return (
    <div 
      className="w-full h-screen bg-[#08080a] text-slate-300 font-sans relative overflow-hidden flex flex-col select-none"
      style={{ backgroundImage: 'radial-gradient(#1a1a1f 1px, transparent 1px)', backgroundSize: '32px 32px' }}
    >
      <header className="h-16 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md flex items-center justify-between px-8 z-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-widest uppercase text-white">NetScan v4.0</h1>
            <p className="text-[10px] font-mono text-blue-400/70">INTERFACE: WLAN0 // SCANNING...</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-[11px] font-mono">
          <div className="flex flex-col items-end">
            <span className="text-slate-500">CONNECTED</span>
            <span className="text-white">{dummyDevices.length} DEVICES</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-500">UPTIME</span>
            <span className="text-white">02:44:12</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-500">SECURITY</span>
            <span className="text-green-400">WPA3-SAE</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 relative">
        <RadarCanvas devices={dummyDevices} />
      </main>

      <footer className="h-12 border-t border-white/5 bg-[#0a0a0c]/80 flex items-center justify-between px-8 text-[10px] font-mono text-slate-500 z-20">
        <div>LAT: 40.7128° N // LON: 74.0060° W</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-400"></span> SYSTEM STABLE
          </span>
          <span className="text-slate-700">|</span>
          <span>ENCRYPTION ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
