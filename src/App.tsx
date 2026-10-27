import React from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { TopBar } from './components/TopBar';
import { LandingPage } from './components/LandingPage';
import { CommandCenter } from './components/CommandCenter/CommandCenter';
import { AttackLab } from './components/AttackLab/AttackLab';
import { SecurityReport } from './components/SecurityReport/SecurityReport';
import { QuantumCore } from './components/QuantumCore/QuantumCore';
import { ArchitectureModal } from './components/ArchitectureModal';
import { FinalDemoModal } from './components/FinalDemoModal';
import { CyberGlobeBackground } from './components/CyberGlobeBackground';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useSimulation();

  return (
    <div className="relative min-h-screen bg-[#050914] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* 3D Rotating Cyber Globe & Ambient Light Orbs Canvas Background */}
      <CyberGlobeBackground />

      {/* 3-Zone Top Navigation Bar */}
      <TopBar />

      {/* Main Viewport Content (elevated z-10 above canvas) */}
      <main className="relative z-10 flex-1">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'command_center' && <CommandCenter />}
        {activeTab === 'attack_lab' && <AttackLab />}
        {activeTab === 'quantum_core' && <QuantumCore />}
        {activeTab === 'security_report' && <SecurityReport />}
      </main>

      {/* Architecture and Final Evaluation Modals */}
      <ArchitectureModal />
      <FinalDemoModal />

      {/* Clean Minimal Hackathon Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#050914]/90 backdrop-blur-sm py-8 text-xs font-mono text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">PROTEGO MAXIMA</span>
            <span>·</span>
            <span className="text-cyan-400">BAYORA ZERO-TRUST</span>
          </div>
          <div className="text-center sm:text-right text-slate-400">
            "Don't just test whether AI can be broken. Measure what the attacker can learn."
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}
