import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Skull,
  Shield,
  Activity,
  AlertTriangle,
  Cpu,
  ShieldCheck,
  FileCheck2,
  Lock,
  Zap,
  Radio,
  Eye,
  EyeOff,
  Filter,
  CheckCircle2,
  ExternalLink,
  Radar,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export type PingFilterMode = 'all' | 'adversary' | 'telemetry' | 'defense';

export interface PingNodeDef {
  id: string;
  label: string;
  subLabel: string;
  code: string;
  tier: string;
  category: 'adversary' | 'perimeter' | 'enclave' | 'telemetry' | 'defense' | 'forensics';
  lat: number;
  lon: number;
  baseColor: string;
  glowColor: string;
  nominalPingRate: string;
  nominalLatency: number;
  nominalCipher: string;
}

export interface PingTrajectoryDef {
  id: string;
  fromId: string;
  toId: string;
  type: 'adversarial' | 'defense' | 'telemetry' | 'audit';
  speed: number;
  label: string;
  color: string;
  isAdversarialVector: boolean;
}

// 9 Zero-Trust Nodes corresponding to Command Center NetworkTopology
const COMMAND_CENTER_NODES: PingNodeDef[] = [
  {
    id: 'red_team',
    label: 'Adversary Injection Node',
    subLabel: 'Rogue C2 Offensive Relay',
    code: 'ADV-RED',
    tier: 'TIER 2 - WORKLOAD',
    category: 'adversary',
    lat: 55.7,
    lon: 37.6, // Eastern European Rogue Relay
    baseColor: '#f43f5e',
    glowColor: '#fb7185',
    nominalPingRate: '48.2 kHz',
    nominalLatency: 14.8,
    nominalCipher: 'ChaCha20-Poly1305 (Adversarial)',
  },
  {
    id: 'ingress_gateway',
    label: 'API Ingress Gateway',
    subLabel: 'Envoy mTLS 1.3 Proxy',
    code: 'GW-INGRESS',
    tier: 'TIER 1 - GATEWAY',
    category: 'perimeter',
    lat: 51.5,
    lon: -0.1, // London Perimeter
    baseColor: '#38bdf8',
    glowColor: '#0284c7',
    nominalPingRate: '12.4 kHz',
    nominalLatency: 2.1,
    nominalCipher: 'TLS_AES_256_GCM_SHA384 (mTLS Strict)',
  },
  {
    id: 'target_enclave',
    label: 'Target LLM Enclave',
    subLabel: 'Protego Confidential SEV-SNP Core',
    code: 'ENC-ROOT',
    tier: 'TIER 0 - ROOT',
    category: 'enclave',
    lat: 47.4,
    lon: 8.5, // Zurich Alpine Vault
    baseColor: '#06b6d4',
    glowColor: '#22d3ee',
    nominalPingRate: '100.0 kHz',
    nominalLatency: 0.6,
    nominalCipher: 'Hardware SEV-SNP / TDX Encrypted Memory',
  },
  {
    id: 'observability_tap',
    label: 'Micro-Arch Telemetry Tap',
    subLabel: '10 kHz Hardware Res-Sampler',
    code: 'TAP-10K',
    tier: 'TIER 0 - ROOT',
    category: 'telemetry',
    lat: 35.7,
    lon: 139.7, // Tokyo Telemetry Sensor Bus
    baseColor: '#10b981',
    glowColor: '#34d399',
    nominalPingRate: '10.0 kHz',
    nominalLatency: 0.4,
    nominalCipher: 'Direct DMA Hardware Ring-Buffer',
  },
  {
    id: 'sidechannel_analyzer',
    label: 'Indirect Leakage Engine',
    subLabel: 'Mutual Information & Jitter Evaluator',
    code: 'ANA-LEAK',
    tier: 'TIER 2 - WORKLOAD',
    category: 'forensics',
    lat: 1.3,
    lon: 103.8, // Singapore Analytics Hub
    baseColor: '#eab308',
    glowColor: '#facc15',
    nominalPingRate: '8.5 kHz',
    nominalLatency: 1.9,
    nominalCipher: 'TLS_AES_256_GCM_SHA384',
  },
  {
    id: 'hardware_guard',
    label: 'Hardware Isolation Guard',
    subLabel: 'cgroups v2 + Seccomp BPF',
    code: 'SEC-CGROUP',
    tier: 'TIER 1 - GATEWAY',
    category: 'enclave',
    lat: 37.8,
    lon: -122.4, // San Francisco Silicon Enclave
    baseColor: '#14b8a6',
    glowColor: '#2dd4bf',
    nominalPingRate: '25.0 kHz',
    nominalLatency: 0.8,
    nominalCipher: 'Host Bus Cryptographic Segmentation',
  },
  {
    id: 'blue_team_mitigator',
    label: 'Blue Team Mitigator',
    subLabel: 'Autonomous Kernel Synthesizer',
    code: 'DEF-SYNTH',
    tier: 'TIER 1 - GATEWAY',
    category: 'defense',
    lat: 40.7,
    lon: -74.0, // NYC Autonomous Countermeasure Node
    baseColor: '#6366f1',
    glowColor: '#818cf8',
    nominalPingRate: '15.2 kHz',
    nominalLatency: 1.2,
    nominalCipher: 'Kernel Cryptographic Keyring',
  },
  {
    id: 'audit_ledger',
    label: 'Tamper-Evident Ledger',
    subLabel: 'SHA-256 Provenance Chain',
    code: 'AUD-LEDGER',
    tier: 'TIER 3 - FORENSICS',
    category: 'forensics',
    lat: -33.8,
    lon: 151.2, // Sydney Merkle Proof Ledger
    baseColor: '#a855f7',
    glowColor: '#c084fc',
    nominalPingRate: '1.0 kHz',
    nominalLatency: 3.4,
    nominalCipher: 'Merkle SHA-256 HMAC Chain',
  },
  {
    id: 'canary_vault',
    label: 'Honey-Token Canary Vault',
    subLabel: 'Active Deception Tripwires',
    code: 'CNR-VAULT',
    tier: 'TIER 1 - GATEWAY',
    category: 'perimeter',
    lat: -23.5,
    lon: -46.6, // São Paulo Deception Vault
    baseColor: '#f97316',
    glowColor: '#fb923c',
    nominalPingRate: '5.0 kHz',
    nominalLatency: 2.8,
    nominalCipher: 'Dynamic Honey-Credential Vault',
  },
];

// Active Adversarial and Telemetry Ping Trajectories
const TRAJECTORIES: PingTrajectoryDef[] = [
  {
    id: 'traj-red-enclave',
    fromId: 'red_team',
    toId: 'target_enclave',
    type: 'adversarial',
    speed: 0.009,
    label: 'Direct Side-Channel Exfiltration Probe',
    color: '#f43f5e',
    isAdversarialVector: true,
  },
  {
    id: 'traj-red-gateway',
    fromId: 'red_team',
    toId: 'ingress_gateway',
    type: 'adversarial',
    speed: 0.0075,
    label: 'Perimeter mTLS Ingress Penetration',
    color: '#fb7185',
    isAdversarialVector: true,
  },
  {
    id: 'traj-red-hardware',
    fromId: 'red_team',
    toId: 'hardware_guard',
    type: 'adversarial',
    speed: 0.0085,
    label: 'L2 Cache Eviction & Timing Probe',
    color: '#f43f5e',
    isAdversarialVector: true,
  },
  {
    id: 'traj-red-canary',
    fromId: 'red_team',
    toId: 'canary_vault',
    type: 'adversarial',
    speed: 0.006,
    label: 'Honey-Token Tripwire Harvest Probe',
    color: '#f97316',
    isAdversarialVector: true,
  },
  {
    id: 'traj-gateway-enclave',
    fromId: 'ingress_gateway',
    toId: 'target_enclave',
    type: 'telemetry',
    speed: 0.005,
    label: 'Sanitized SPIFFE/Spire mTLS Pipeline',
    color: '#38bdf8',
    isAdversarialVector: false,
  },
  {
    id: 'traj-mitigator-enclave',
    fromId: 'blue_team_mitigator',
    toId: 'target_enclave',
    type: 'defense',
    speed: 0.007,
    label: 'Zero-Downtime Kernel Jitter Injection',
    color: '#818cf8',
    isAdversarialVector: false,
  },
  {
    id: 'traj-tap-analyzer',
    fromId: 'observability_tap',
    toId: 'sidechannel_analyzer',
    type: 'telemetry',
    speed: 0.010,
    label: '10 kHz eBPF Micro-Arch Telemetry Stream',
    color: '#10b981',
    isAdversarialVector: false,
  },
  {
    id: 'traj-enclave-ledger',
    fromId: 'target_enclave',
    toId: 'audit_ledger',
    type: 'audit',
    speed: 0.004,
    label: 'Cryptographic SHA-256 Provenance Attestation',
    color: '#c084fc',
    isAdversarialVector: false,
  },
];

export const CyberGlobeBackground: React.FC = () => {
  const {
    attackStatus,
    activeAttack,
    threatLevel,
    isolationLevel,
    isolationName,
    currentTelemetry,
    leakageScore,
    securityScore,
    activeDefenses,
    activeTab,
    setActiveTab,
  } = useSimulation();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // UI State for the transparent SVG overlay controls
  const [filterMode, setFilterMode] = useState<PingFilterMode>('all');
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Live simulation state ref so animation loop always has up-to-date attack metrics
  const simStateRef = useRef({
    attackStatus,
    activeAttack,
    threatLevel,
    isolationLevel,
    leakageScore,
  });

  useEffect(() => {
    simStateRef.current = {
      attackStatus,
      activeAttack,
      threatLevel,
      isolationLevel,
      leakageScore,
    };
  }, [attackStatus, activeAttack, threatLevel, isolationLevel, leakageScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / width - 0.5) * 2;
      const normY = (e.clientY / height - 0.5) * 2;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Point on Globe
    interface GlobeVertex {
      x: number;
      y: number;
      z: number;
      lat: number;
      lon: number;
      isLand: boolean;
      isCity: boolean;
      cityName?: string;
      pulse: number;
      intensity: number;
    }

    interface ImpactShockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
      lineWidth: number;
    }

    interface VoidCosmicOrb {
      id: number;
      px: number;
      py: number;
      pz: number;
      dist: number;
      initialDist: number;
      speed: number;
      spiralAngle: number;
      spiralRate: number;
      targetLat: number;
      targetLon: number;
      radius: number;
      color: string;
      glowColor: string;
      trail: { x: number; y: number; z: number; alpha: number }[];
      maxTrail: number;
    }

    // High-resolution polygon samples across world continents
    const continentBounds = [
      { latMin: 18, latMax: 68, lonMin: -135, lonMax: -60, density: 160 },
      { latMin: 8, latMax: 22, lonMin: -90, lonMax: -65, density: 40 },
      { latMin: -52, latMax: 12, lonMin: -80, lonMax: -35, density: 140 },
      { latMin: 36, latMax: 68, lonMin: -10, lonMax: 35, density: 150 },
      { latMin: 45, latMax: 72, lonMin: 30, lonMax: 160, density: 180 },
      { latMin: 14, latMax: 38, lonMin: 35, lonMax: 65, density: 70 },
      { latMin: -34, latMax: 36, lonMin: -16, lonMax: 50, density: 170 },
      { latMin: 8, latMax: 34, lonMin: 68, lonMax: 92, density: 120 },
      { latMin: 20, latMax: 52, lonMin: 95, lonMax: 145, density: 160 },
      { latMin: -10, latMax: 22, lonMin: 95, lonMax: 130, density: 80 },
      { latMin: -44, latMax: -12, lonMin: 112, lonMax: 175, density: 90 },
    ];

    const majorCities = [
      { name: 'Tokyo', lat: 35.6, lon: 139.7 },
      { name: 'San Francisco', lat: 37.7, lon: -122.4 },
      { name: 'New York', lat: 40.7, lon: -74.0 },
      { name: 'London', lat: 51.5, lon: -0.1 },
      { name: 'Paris', lat: 48.8, lon: 2.3 },
      { name: 'Berlin', lat: 52.5, lon: 13.4 },
      { name: 'Zurich', lat: 47.3, lon: 8.5 },
      { name: 'Singapore', lat: 1.3, lon: 103.8 },
      { name: 'Seoul', lat: 37.5, lon: 126.9 },
      { name: 'Bengaluru', lat: 12.9, lon: 77.5 },
      { name: 'Sydney', lat: -33.8, lon: 151.2 },
      { name: 'Dubai', lat: 25.2, lon: 55.3 },
      { name: 'São Paulo', lat: -23.5, lon: -46.6 },
    ];

    const globeVertices: GlobeVertex[] = [];

    const latLonToVec3 = (latDeg: number, lonDeg: number) => {
      const phi = (90 - latDeg) * (Math.PI / 180);
      const theta = (lonDeg + 180) * (Math.PI / 180);
      return {
        x: -Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
      };
    };

    for (const region of continentBounds) {
      for (let i = 0; i < region.density; i++) {
        const lat = region.latMin + Math.random() * (region.latMax - region.latMin);
        const lon = region.lonMin + Math.random() * (region.lonMax - region.lonMin);
        const vec = latLonToVec3(lat, lon);

        let isCity = Math.random() < 0.08;
        let cityName: string | undefined;

        for (const city of majorCities) {
          const dLat = Math.abs(city.lat - lat);
          const dLon = Math.abs(city.lon - lon);
          if (dLat < 4 && dLon < 6) {
            isCity = true;
            cityName = city.name;
            break;
          }
        }

        globeVertices.push({
          x: vec.x,
          y: vec.y,
          z: vec.z,
          lat,
          lon,
          isLand: true,
          isCity,
          cityName,
          pulse: Math.random() * Math.PI * 2,
          intensity: 0.6 + Math.random() * 0.4,
        });
      }
    }

    const oceanGridSteps = 16;
    for (let i = 1; i < oceanGridSteps; i++) {
      const lat = (i / oceanGridSteps - 0.5) * 160;
      const lonStep = 24;
      for (let j = 0; j < lonStep; j++) {
        const lon = (j / lonStep) * 360 - 180;
        const vec = latLonToVec3(lat, lon);
        globeVertices.push({
          x: vec.x,
          y: vec.y,
          z: vec.z,
          lat,
          lon,
          isLand: false,
          isCity: false,
          pulse: Math.random() * Math.PI * 2,
          intensity: 0.25,
        });
      }
    }

    const cloudPoints: { x: number; y: number; z: number; size: number; alpha: number }[] = [];
    for (let c = 0; c < 80; c++) {
      const lat = (Math.random() - 0.5) * 140;
      const lon = Math.random() * 360 - 180;
      const vec = latLonToVec3(lat, lon);
      cloudPoints.push({
        x: vec.x * 1.03,
        y: vec.y * 1.03,
        z: vec.z * 1.03,
        size: 15 + Math.random() * 35,
        alpha: 0.08 + Math.random() * 0.12,
      });
    }

    const orbitalRingPoints: { angle: number; r: number; color: string }[] = [];
    for (let r = 0; r < 72; r++) {
      orbitalRingPoints.push({
        angle: (r / 72) * Math.PI * 2,
        r: 1.35 + Math.sin(r * 0.4) * 0.05,
        color: r % 4 === 0 ? '#38bdf8' : '#06b6d4',
      });
    }

    const voidOrbs: VoidCosmicOrb[] = [];
    const impactShockwaves: ImpactShockwave[] = [];
    let orbCounter = 0;

    const orbPalettes = [
      { core: '#ffffff', glow: '#22d3ee' },
      { core: '#ffffff', glow: '#38bdf8' },
      { core: '#fdf4ff', glow: '#c084fc' },
      { core: '#ffffff', glow: '#60a5fa' },
      { core: '#fffbeb', glow: '#fb923c' },
    ];

    const spawnCosmicOrb = () => {
      const palette = orbPalettes[Math.floor(Math.random() * orbPalettes.length)];
      const spawnAngle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const dist = Math.max(width, height) * (0.85 + Math.random() * 0.5);

      const px = Math.cos(elevation) * Math.cos(spawnAngle) * dist;
      const py = Math.sin(elevation) * dist * 0.7;
      const pz = Math.cos(elevation) * Math.sin(spawnAngle) * dist;

      const targetLat = (Math.random() - 0.5) * 120;
      const targetLon = Math.random() * 360 - 180;

      voidOrbs.push({
        id: ++orbCounter,
        px,
        py,
        pz,
        dist,
        initialDist: dist,
        speed: 3.5 + Math.random() * 3.5,
        spiralAngle: Math.random() * Math.PI * 2,
        spiralRate: (Math.random() - 0.5) * 0.06,
        targetLat,
        targetLon,
        radius: 3.5 + Math.random() * 4,
        color: palette.core,
        glowColor: palette.glow,
        trail: [],
        maxTrail: 22,
      });
    };

    for (let i = 0; i < 20; i++) {
      spawnCosmicOrb();
      const orb = voidOrbs[voidOrbs.length - 1];
      const progress = Math.random() * 0.75;
      orb.dist = orb.initialDist * (1 - progress);
      orb.px *= 1 - progress;
      orb.py *= 1 - progress;
      orb.pz *= 1 - progress;
    }

    let globeRotation = 0;
    let cloudRotation = 0;

    // Track trajectory packet progress timers
    const packetProgress: Record<string, number> = {};
    TRAJECTORIES.forEach((t) => {
      packetProgress[t.id] = Math.random();
    });

    const render = () => {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const globeCenterX = width / 2 + mouseRef.current.x * 65;
      const globeCenterY = Math.min(height * 0.46, 420) + mouseRef.current.y * 50;
      const globeRadius = Math.min(width * 0.38, height * 0.42, 380);

      globeRotation += 0.0022;
      cloudRotation += 0.0030;

      const tiltX = 0.40 + mouseRef.current.y * 0.18;
      const tiltY = globeRotation + mouseRef.current.x * 0.35;

      // 3D Matrix Projection
      const projectPoint = (x: number, y: number, z: number, rotation: number, radius = globeRadius) => {
        const cosY = Math.cos(rotation);
        const sinY = Math.sin(rotation);
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;

        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const fov = 850;
        const scale = fov / (fov + z2 * radius);
        return {
          sx: globeCenterX + x2 * radius * scale,
          sy: globeCenterY + y2 * radius * scale,
          sz: z2,
          visible: z2 > -0.25,
        };
      };

      // 1. COSMIC VOID NEBULA & DEEP SPACE BACKGROUND
      const voidNebula = ctx.createRadialGradient(
        globeCenterX,
        globeCenterY,
        globeRadius * 0.1,
        globeCenterX,
        globeCenterY,
        globeRadius * 2.8
      );
      voidNebula.addColorStop(0, 'rgba(6, 182, 212, 0.10)');
      voidNebula.addColorStop(0.3, 'rgba(15, 23, 42, 0.08)');
      voidNebula.addColorStop(0.65, 'rgba(5, 12, 28, 0.04)');
      voidNebula.addColorStop(1, 'rgba(5, 9, 20, 0)');

      ctx.fillStyle = voidNebula;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, globeRadius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // 2. REALISTIC PLANETARY SHADING & TERMINATOR
      const sunGradient = ctx.createRadialGradient(
        globeCenterX - globeRadius * 0.45,
        globeCenterY - globeRadius * 0.45,
        globeRadius * 0.05,
        globeCenterX,
        globeCenterY,
        globeRadius
      );
      sunGradient.addColorStop(0, 'rgba(14, 116, 144, 0.35)');
      sunGradient.addColorStop(0.45, 'rgba(8, 47, 73, 0.55)');
      sunGradient.addColorStop(0.75, 'rgba(4, 18, 42, 0.88)');
      sunGradient.addColorStop(1, 'rgba(2, 6, 18, 0.98)');

      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. MULTI-LAYER VOLUMETRIC ATMOSPHERE
      const atmosphereOuter = ctx.createRadialGradient(
        globeCenterX,
        globeCenterY,
        globeRadius * 0.92,
        globeCenterX,
        globeCenterY,
        globeRadius * 1.12
      );
      atmosphereOuter.addColorStop(0, 'rgba(6, 182, 212, 0)');
      atmosphereOuter.addColorStop(0.5, 'rgba(34, 211, 238, 0.15)');
      atmosphereOuter.addColorStop(0.85, 'rgba(59, 130, 246, 0.35)');
      atmosphereOuter.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.fillStyle = atmosphereOuter;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, globeRadius * 1.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 4. DRAW 3D TILTED ORBITAL RING
      ctx.save();
      for (const p of orbitalRingPoints) {
        const ringRadius = globeRadius * p.r;
        const rx = Math.cos(p.angle) * ringRadius;
        const ry = Math.sin(p.angle) * ringRadius * 0.35;
        const rz = Math.sin(p.angle) * ringRadius * 0.6;

        const proj = projectPoint(rx / globeRadius, ry / globeRadius, rz / globeRadius, tiltY * 0.5);
        if (proj.sz > -0.2) {
          const alpha = 0.15 + (proj.sz + 0.2) * 0.45;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 5. DRAW CONTINENTAL LANDMASSES & CITY LIGHTS
      for (const v of globeVertices) {
        const proj = projectPoint(v.x, v.y, v.z, tiltY);

        if (proj.sz > 0.02) {
          v.pulse += 0.025;
          const sunDot = (-v.x * 0.6 - v.y * 0.6 + v.z * 0.5);
          const isDaySide = sunDot > -0.1;
          const lightFactor = Math.max(0.1, (sunDot + 1) * 0.5);

          if (v.isLand) {
            if (isDaySide) {
              const alpha = (0.2 + proj.sz * 0.65) * lightFactor * v.intensity;
              ctx.fillStyle = `rgba(45, 212, 191, ${alpha})`;
              ctx.beginPath();
              ctx.arc(proj.sx, proj.sy, 1.6, 0, Math.PI * 2);
              ctx.fill();
            } else {
              if (v.isCity) {
                const cityAlpha = 0.6 + Math.sin(v.pulse) * 0.35;
                ctx.fillStyle = `rgba(251, 191, 36, ${cityAlpha})`;
                ctx.beginPath();
                ctx.arc(proj.sx, proj.sy, 2.2, 0, Math.PI * 2);
                ctx.fill();

                if (proj.sz > 0.4) {
                  ctx.strokeStyle = `rgba(34, 211, 238, ${cityAlpha * 0.5})`;
                  ctx.lineWidth = 0.8;
                  ctx.beginPath();
                  ctx.arc(proj.sx, proj.sy, 4.5, 0, Math.PI * 2);
                  ctx.stroke();
                }
              } else {
                ctx.fillStyle = `rgba(30, 58, 138, ${0.12 * proj.sz})`;
                ctx.beginPath();
                ctx.arc(proj.sx, proj.sy, 1.2, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          } else {
            if (isDaySide) {
              ctx.fillStyle = `rgba(59, 130, 246, ${0.15 * proj.sz})`;
              ctx.beginPath();
              ctx.arc(proj.sx, proj.sy, 1.0, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // 6. DRAW ATMOSPHERIC CLOUD SWIRL LAYER
      for (const c of cloudPoints) {
        const proj = projectPoint(c.x, c.y, c.z, cloudRotation);
        if (proj.sz > 0.15) {
          const cloudGrad = ctx.createRadialGradient(
            proj.sx,
            proj.sy,
            0,
            proj.sx,
            proj.sy,
            c.size
          );
          cloudGrad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha * 1.3})`);
          cloudGrad.addColorStop(0.6, `rgba(224, 242, 254, ${c.alpha * 0.5})`);
          cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = cloudGrad;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, c.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 7. STREAMING COSMIC LIGHT ORBS
      if (voidOrbs.length < 24 && Math.random() < 0.15) {
        spawnCosmicOrb();
      }

      for (let i = voidOrbs.length - 1; i >= 0; i--) {
        const orb = voidOrbs[i];
        const currentDist = Math.sqrt(orb.px * orb.px + orb.py * orb.py + orb.pz * orb.pz);
        const gravityAccel = Math.min(12, (1 - currentDist / orb.initialDist) * 8 + orb.speed);
        orb.dist -= gravityAccel;

        orb.spiralAngle += orb.spiralRate;
        const targetVec = latLonToVec3(orb.targetLat, orb.targetLon);
        const currentRadius = globeRadius + orb.dist * 0.8;

        orb.px = targetVec.x * currentRadius + Math.cos(orb.spiralAngle) * (orb.dist * 0.35);
        orb.py = targetVec.y * currentRadius + Math.sin(orb.spiralAngle * 0.7) * (orb.dist * 0.25);
        orb.pz = targetVec.z * currentRadius + Math.sin(orb.spiralAngle) * (orb.dist * 0.35);

        const fov = 850;
        const scale = fov / (fov + (orb.pz / currentRadius) * globeRadius);
        const screenX = globeCenterX + (orb.px / currentRadius) * globeRadius * scale;
        const screenY = globeCenterY + (orb.py / currentRadius) * globeRadius * scale;
        const isOccluded = currentDist < globeRadius * 1.05 && orb.pz < -globeRadius * 0.2;

        orb.trail.push({ x: screenX, y: screenY, z: orb.pz, alpha: 1 });
        if (orb.trail.length > orb.maxTrail) {
          orb.trail.shift();
        }

        if (!isOccluded) {
          if (orb.trail.length > 2) {
            ctx.beginPath();
            for (let t = 0; t < orb.trail.length - 1; t++) {
              const t1 = orb.trail[t];
              const t2 = orb.trail[t + 1];
              const trailAlpha = (t / orb.trail.length) * 0.55;

              ctx.strokeStyle = orb.glowColor;
              ctx.globalAlpha = trailAlpha;
              ctx.lineWidth = (t / orb.trail.length) * (orb.radius * 1.8);
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(t1.x, t1.y);
              ctx.lineTo(t2.x, t2.y);
              ctx.stroke();
            }
            ctx.globalAlpha = 1;
          }

          const bloomRadius = orb.radius * 4.5;
          const orbBloom = ctx.createRadialGradient(
            screenX,
            screenY,
            0,
            screenX,
            screenY,
            bloomRadius
          );
          orbBloom.addColorStop(0, orb.color);
          orbBloom.addColorStop(0.35, orb.glowColor);
          orbBloom.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = orbBloom;
          ctx.beginPath();
          ctx.arc(screenX, screenY, bloomRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(screenX, screenY, orb.radius * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        if (orb.dist <= 15) {
          impactShockwaves.push({
            x: screenX,
            y: screenY,
            radius: 2,
            maxRadius: 35 + Math.random() * 25,
            alpha: 0.95,
            color: orb.glowColor,
            lineWidth: 2.2,
          });

          impactShockwaves.push({
            x: screenX,
            y: screenY,
            radius: 1,
            maxRadius: 18,
            alpha: 1.0,
            color: '#ffffff',
            lineWidth: 3.0,
          });

          voidOrbs.splice(i, 1);
          spawnCosmicOrb();
        }
      }

      // 8. RENDER EXPANDING IMPACT RIPPLES
      for (let s = impactShockwaves.length - 1; s >= 0; s--) {
        const sw = impactShockwaves[s];
        sw.radius += 1.4;
        sw.alpha *= 0.93;

        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = sw.lineWidth * sw.alpha;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (sw.alpha <= 0.04 || sw.radius >= sw.maxRadius) {
          impactShockwaves.splice(s, 1);
        }
      }
      ctx.globalAlpha = 1;

      // ---------------------------------------------------------------------
      // 9. SYNCHRONIZE TRANSPARENT SVG OVERLAY (ADVERSARIAL PING MESH)
      // ---------------------------------------------------------------------
      const svg = svgRef.current;
      if (svg) {
        // Project all 9 nodes to screen coordinates
        const projectedNodes: Record<
          string,
          { sx: number; sy: number; sz: number; visible: boolean; opacity: number }
        > = {};

        for (const n of COMMAND_CENTER_NODES) {
          const vec = latLonToVec3(n.lat, n.lon);
          const proj = projectPoint(vec.x, vec.y, vec.z, tiltY);

          // Graceful limb fading: fully visible on front hemisphere, fades at horizon
          let opacity = 0;
          if (proj.sz > 0.05) {
            opacity = Math.min(1, 0.45 + proj.sz * 0.95);
          } else if (proj.sz > -0.08) {
            opacity = ((proj.sz + 0.08) / 0.13) * 0.45;
          }

          projectedNodes[n.id] = {
            sx: proj.sx,
            sy: proj.sy,
            sz: proj.sz,
            visible: opacity > 0.02,
            opacity,
          };

          // Update SVG node group position & opacity
          const nodeGroupEl = svg.getElementById(`ping-node-${n.id}`);
          if (nodeGroupEl) {
            if (opacity > 0.02) {
              nodeGroupEl.setAttribute(
                'transform',
                `translate(${proj.sx.toFixed(1)}, ${proj.sy.toFixed(1)})`
              );
              nodeGroupEl.setAttribute('opacity', opacity.toFixed(2));
              (nodeGroupEl as SVGElement).style.display = 'block';
            } else {
              (nodeGroupEl as SVGElement).style.display = 'none';
            }
          }
        }

        // Speed multiplier during active adversarial attacks
        const currentSim = simStateRef.current;
        const isAttacking =
          currentSim.attackStatus === 'TRANSMITTING' || currentSim.attackStatus === 'DETECTED';
        const speedMultiplier = isAttacking ? 2.4 : 1.0;

        // Update trajectories and streaming photon ping packets
        for (const t of TRAJECTORIES) {
          const pFrom = projectedNodes[t.fromId];
          const pTo = projectedNodes[t.toId];
          const arcEl = svg.getElementById(`ping-arc-${t.id}`);
          const packetEl = svg.getElementById(`ping-packet-${t.id}`);

          if (pFrom && pTo && pFrom.visible && pTo.visible) {
            // Compute arched quadratic bezier curve elevated outward from globe center
            const midX = (pFrom.sx + pTo.sx) / 2;
            const midY = (pFrom.sy + pTo.sy) / 2;

            const dirX = midX - globeCenterX;
            const dirY = midY - globeCenterY;
            const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
            const normX = dirX / dirLen;
            const normY = dirY / dirLen;

            const chordDist = Math.hypot(pTo.sx - pFrom.sx, pTo.sy - pFrom.sy);
            const elevation = Math.min(55, Math.max(16, chordDist * 0.22));
            const ctrlX = midX + normX * elevation;
            const ctrlY = midY + normY * elevation;

            const pathD = `M ${pFrom.sx.toFixed(1)} ${pFrom.sy.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${pTo.sx.toFixed(1)} ${pTo.sy.toFixed(1)}`;
            const arcOpacity = Math.min(pFrom.opacity, pTo.opacity) * (t.isAdversarialVector && isAttacking ? 0.95 : 0.65);

            if (arcEl) {
              arcEl.setAttribute('d', pathD);
              arcEl.setAttribute('opacity', arcOpacity.toFixed(2));
              (arcEl as SVGElement).style.display = 'block';
            }

            // Advance packet progress
            packetProgress[t.id] =
              (packetProgress[t.id] + t.speed * speedMultiplier) % 1;
            const progress = packetProgress[t.id];

            // Quadratic bezier interpolation: (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
            const inv = 1 - progress;
            const pktX = inv * inv * pFrom.sx + 2 * inv * progress * ctrlX + progress * progress * pTo.sx;
            const pktY = inv * inv * pFrom.sy + 2 * inv * progress * ctrlY + progress * progress * pTo.sy;

            if (packetEl) {
              packetEl.setAttribute('cx', pktX.toFixed(1));
              packetEl.setAttribute('cy', pktY.toFixed(1));
              packetEl.setAttribute('opacity', (arcOpacity * 1.2).toFixed(2));
              (packetEl as SVGElement).style.display = 'block';
            }
          } else {
            if (arcEl) (arcEl as SVGElement).style.display = 'none';
            if (packetEl) (packetEl as SVGElement).style.display = 'none';
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Filter visible trajectories based on active UI filter mode
  const filteredTrajectories = useMemo(() => {
    return TRAJECTORIES.filter((t) => {
      if (filterMode === 'adversary') return t.type === 'adversarial';
      if (filterMode === 'telemetry') return t.type === 'telemetry' || t.type === 'audit';
      if (filterMode === 'defense') return t.type === 'defense';
      return true;
    });
  }, [filterMode]);

  // Selected or hovered node details
  const activeDetailNode = useMemo(() => {
    const idToFind = hoveredNodeId || selectedNodeId;
    if (!idToFind) return null;
    return COMMAND_CENTER_NODES.find((n) => n.id === idToFind) || null;
  }, [hoveredNodeId, selectedNodeId]);

  const isAttacking = attackStatus === 'TRANSMITTING' || attackStatus === 'DETECTED';
  const isMitigating = attackStatus === 'MITIGATING' || attackStatus === 'RETESTING';
  const isBlocked = attackStatus === 'BLOCKED';
  const isCommandCenter = activeTab === 'command_center';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Underlying 3D Rotating Canvas Atmosphere & Light Orbs */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 transition-opacity duration-1000"
      />

      {/* 2. Transparent SVG Overlay on top visualizing active adversarial ping points */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Intense Neon Glow Filters */}
          <filter id="glow-adversarial-ping" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-cyan-core" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-emerald-tap" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Trajectory Laser Gradients */}
          <linearGradient id="grad-adversarial-laser" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fb7185" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="grad-defense-laser" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="grad-telemetry-laser" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="grad-audit-laser" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* --- Laser Trajectory Arcs connecting adversarial and zero-trust nodes --- */}
        <g id="ping-trajectories-layer">
          {filteredTrajectories.map((traj) => {
            const isRedAttack = traj.isAdversarialVector;
            return (
              <g key={traj.id}>
                {/* Background soft glow path */}
                <path
                  id={`ping-arc-${traj.id}`}
                  fill="none"
                  stroke={traj.color}
                  strokeWidth={isRedAttack && isAttacking ? '2.4' : '1.4'}
                  strokeDasharray={isRedAttack ? '5 4' : '3 4'}
                  opacity="0.6"
                  strokeLinecap="round"
                />

                {/* Animated Photon Ping Packet traveling along the curve */}
                <circle
                  id={`ping-packet-${traj.id}`}
                  r={isRedAttack && isAttacking ? '3.8' : '2.6'}
                  fill={isRedAttack ? '#ffffff' : traj.color}
                  stroke={traj.color}
                  strokeWidth="1.2"
                  filter={isRedAttack ? 'url(#glow-adversarial-ping)' : 'url(#glow-cyan-core)'}
                  opacity="0"
                />
              </g>
            );
          })}
        </g>

        {/* --- 9 Zero-Trust Nodes & Active Adversarial Ping Points --- */}
        <g id="ping-nodes-layer">
          {COMMAND_CENTER_NODES.map((node) => {
            const isRedTeam = node.category === 'adversary';
            const isEnclave = node.category === 'enclave';
            const isSelected = selectedNodeId === node.id || hoveredNodeId === node.id;

            return (
              <g
                key={node.id}
                id={`ping-node-${node.id}`}
                className={`transition-transform duration-75 ${
                  isCommandCenter ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'
                }`}
                onMouseEnter={() => {
                  if (isCommandCenter) setHoveredNodeId(node.id);
                }}
                onMouseLeave={() => {
                  if (isCommandCenter) setHoveredNodeId(null);
                }}
                onClick={() => {
                  if (isCommandCenter) {
                    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
                  }
                }}
              >
                {/* 1. Radar Sonar Ping Expanding Ripples */}
                {/* Primary Ping Pulse */}
                <circle
                  cx="0"
                  cy="0"
                  r="4"
                  fill="none"
                  stroke={node.baseColor}
                  strokeWidth={isRedTeam && isAttacking ? '2' : '1.2'}
                  opacity="0.8"
                >
                  <animate
                    attributeName="r"
                    from="4"
                    to={isRedTeam && isAttacking ? '46' : '32'}
                    dur={isRedTeam && isAttacking ? '1.1s' : '2.2s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.9"
                    to="0"
                    dur={isRedTeam && isAttacking ? '1.1s' : '2.2s'}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Secondary Harmonic Wave */}
                <circle
                  cx="0"
                  cy="0"
                  r="4"
                  fill="none"
                  stroke={node.glowColor}
                  strokeWidth="1"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    from="4"
                    to={isRedTeam && isAttacking ? '32' : '22'}
                    dur={isRedTeam && isAttacking ? '1.1s' : '2.2s'}
                    begin={isRedTeam && isAttacking ? '0.5s' : '0.9s'}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.7"
                    to="0"
                    dur={isRedTeam && isAttacking ? '1.1s' : '2.2s'}
                    begin={isRedTeam && isAttacking ? '0.5s' : '0.9s'}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Enclave Special: Shield Containment Ring when Protected or Blocked */}
                {isEnclave && (isBlocked || isMitigating || isolationLevel >= 3) && (
                  <circle
                    cx="0"
                    cy="0"
                    r="15"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    opacity="0.75"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* 2. Tactical Reticle Brackets Framing the Node */}
                <path
                  d="M -7 -4 L -7 -7 L -4 -7"
                  stroke={node.baseColor}
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M 4 -7 L 7 -7 L 7 -4"
                  stroke={node.baseColor}
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M -7 4 L -7 7 L -4 7"
                  stroke={node.baseColor}
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M 4 7 L 7 7 L 7 4"
                  stroke={node.baseColor}
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.8"
                />

                {/* 3. Rotating Dashed Orbit Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r="9.5"
                  fill="none"
                  stroke={node.baseColor}
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                  opacity={isSelected ? '0.9' : '0.45'}
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur={isRedTeam ? '4s' : '12s'}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* 4. High-Intensity Glowing Core Pip */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? '5.2' : isRedTeam && isAttacking ? '4.8' : '3.6'}
                  fill={node.baseColor}
                  filter={isRedTeam ? 'url(#glow-adversarial-ping)' : 'url(#glow-cyan-core)'}
                />
                <circle cx="0" cy="0" r="1.6" fill="#ffffff" />

                {/* 5. Sleek Micro-HUD Label Tag */}
                {showLabels && (
                  <g transform="translate(14, -13)">
                    {/* Background Tag Chip */}
                    <rect
                      x="0"
                      y="0"
                      width={isRedTeam ? 88 : 78}
                      height="22"
                      rx="4"
                      fill="#030712"
                      fillOpacity="0.85"
                      stroke={node.baseColor}
                      strokeWidth="0.8"
                      strokeOpacity="0.6"
                    />

                    {/* Node Code */}
                    <text
                      x="6"
                      y="10"
                      fill="#f8fafc"
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.code}
                    </text>

                    {/* Live Ping Frequency or Status */}
                    <text
                      x="6"
                      y="18"
                      fill={isRedTeam && isAttacking ? '#fb7185' : '#94a3b8'}
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      {isRedTeam && isAttacking
                        ? 'SURGE: PROBING'
                        : `${node.nominalPingRate} PING`}
                    </text>

                    {/* Small Status Pip */}
                    <circle
                      cx={isRedTeam ? 80 : 70}
                      cy="7"
                      r="2"
                      fill={node.baseColor}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* 3. Floating Interactive HUD Inspection Card (when a node ping is hovered or clicked in Command Center) */}
      {isCommandCenter && activeDetailNode && (
        <div className="absolute top-20 right-6 pointer-events-auto max-w-sm w-80 rounded-2xl bg-[#030712]/92 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.18)] p-4 text-xs font-mono text-slate-200 z-30 transition-all animate-in fade-in slide-in-from-right-4 duration-200">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center border"
                style={{
                  backgroundColor: `${activeDetailNode.baseColor}18`,
                  borderColor: `${activeDetailNode.baseColor}55`,
                  color: activeDetailNode.baseColor,
                }}
              >
                {activeDetailNode.category === 'adversary' ? (
                  <Skull className="w-4 h-4 animate-pulse" />
                ) : activeDetailNode.category === 'enclave' ? (
                  <Shield className="w-4 h-4" />
                ) : activeDetailNode.category === 'telemetry' ? (
                  <Activity className="w-4 h-4" />
                ) : activeDetailNode.category === 'defense' ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : activeDetailNode.category === 'forensics' ? (
                  <FileCheck2 className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="text-[10px] text-cyan-400 font-bold tracking-wider">
                  [{activeDetailNode.code}] {activeDetailNode.tier}
                </div>
                <div className="font-bold text-white text-sm">
                  {activeDetailNode.label}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setHoveredNodeId(null);
                setSelectedNodeId(null);
              }}
              className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Node Diagnostics */}
          <div className="py-3 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Ping Telemetry RTT:</span>
              <span className="font-bold text-white">
                {activeDetailNode.category === 'adversary'
                  ? `${currentTelemetry.latencyMs.toFixed(1)} ms`
                  : `${activeDetailNode.nominalLatency} ms`}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Sampling Frequency:</span>
              <span className="text-cyan-300 font-bold">
                {activeDetailNode.nominalPingRate}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Security Status:</span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{
                  backgroundColor: `${activeDetailNode.baseColor}22`,
                  color: activeDetailNode.baseColor,
                }}
              >
                {activeDetailNode.category === 'adversary'
                  ? isAttacking
                    ? 'ACTIVE INJECTION SURGE'
                    : 'ROUTINE PROBING'
                  : isBlocked
                  ? 'AIRGAPPED / PROTECTED'
                  : 'HEALTHY NOMINAL'}
              </span>
            </div>

            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
              <span className="text-slate-500 block mb-0.5">Active Cipher & Bus:</span>
              <span className="text-slate-300 truncate block">
                {activeDetailNode.nominalCipher}
              </span>
            </div>

            {activeDetailNode.category === 'adversary' && (
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px]">
                <div className="font-bold flex items-center gap-1 mb-0.5">
                  <AlertTriangle className="w-3 h-3" /> Adversarial Vector:
                </div>
                <div>{activeAttack.name}</div>
                <div className="text-[9px] text-rose-400/80 mt-0.5">
                  Confidence: {activeAttack.confidence}% · Residual Leak: {leakageScore.total}%
                </div>
              </div>
            )}
          </div>

          {/* Jump to Command Center Topology */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                setActiveTab('command_center');
                setSelectedNodeId(null);
                setHoveredNodeId(null);
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Inspect in Command Center Topology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Sleek Tactical HUD Control Bar for the Adversarial Ping Overlay (Command Center only) */}
      {isCommandCenter && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-[#030712]/85 backdrop-blur-md border border-cyan-500/25 shadow-2xl text-xs font-mono text-slate-300 z-20">
          {/* Live Radar Ping Status */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
            <div className="relative flex items-center justify-center">
              <Radar
                className={`w-4 h-4 ${
                  isAttacking ? 'text-rose-400 animate-spin' : 'text-cyan-400'
                }`}
              />
              <span
                className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                  isAttacking
                    ? 'bg-rose-500 animate-ping'
                    : 'bg-emerald-400 animate-pulse'
                }`}
              />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">
                Adversarial Ping Mesh
              </div>
              <div className="text-[11px] font-bold text-white leading-none mt-0.5">
                {isAttacking ? (
                  <span className="text-rose-400 font-extrabold flex items-center gap-1">
                    <span>INTERCEPTING:</span> {activeAttack.id}
                  </span>
                ) : (
                  <span className="text-emerald-400">9 NODES SYNCHRONIZED</span>
                )}
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ALL (9)
            </button>
            <button
              onClick={() => setFilterMode('adversary')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'adversary'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Skull className="w-2.5 h-2.5" />
              ADVERSARIAL
            </button>
            <button
              onClick={() => setFilterMode('telemetry')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'telemetry'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-2.5 h-2.5" />
              TELEMETRY
            </button>
          </div>

          {/* Node Labels Toggle */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showLabels
                ? 'bg-slate-800/80 text-cyan-300 border-cyan-500/30'
                : 'bg-slate-900/50 text-slate-400 border-slate-800'
            }`}
            title="Toggle SVG Node HUD Labels"
          >
            {showLabels ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3" />}
            <span>{showLabels ? 'LABELS ON' : 'LABELS OFF'}</span>
          </button>

          {/* Threat Level indicator badge */}
          <div className="pl-2 border-l border-slate-800 hidden sm:flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500">THREAT:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                threatLevel === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : threatLevel === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {threatLevel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
