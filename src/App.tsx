import { useState, useEffect, useRef } from "react";
import {
  MapPin, Bell, ChevronDown, Plus, Shield, Droplets,
  Lightbulb, Trash2, CheckCircle, Clock, TrendingUp,
  Users, Award, MessageSquare, Search, Settings, LogOut,
  User, X, Send, Camera, Upload, Mic, Sparkles, ArrowRight,
  Eye, ThumbsUp, Activity, Building2, AlertCircle,
  MoreHorizontal, Star, Zap, Filter, Download, Globe,
  Phone, Mail, Lock, Edit, Gift, BarChart2, FileText,
  Map, Home, Info, Target, RefreshCw, ChevronRight, Navigation,
  Layers, Flame, TreePine, CheckSquare, Cpu, Wind, Terminal
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { api } from "./lib/api";
import { firebaseConfigured } from "./lib/firebase";

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const STYLES = `
  * { font-family: 'Manrope', sans-serif; }
  .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
  .font-mono-data { font-family: 'JetBrains Mono', monospace; }

  @keyframes mapPulse {
    0% { transform: scale(1); opacity: 0.7; }
    100% { transform: scale(2.8); opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-7px); }
  }
  @keyframes blueGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(37,99,235,0.2), 0 8px 32px rgba(15,23,42,0.18); }
    50% { box-shadow: 0 0 48px rgba(37,99,235,0.45), 0 8px 32px rgba(15,23,42,0.22); }
  }
  @keyframes scanLine {
    0% { top: 4px; }
    100% { top: calc(100% - 4px); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmerBlue {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes bboxIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes pulseRing {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 0; transform: scale(1.6); }
  }
  @keyframes countNum {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes notifBounce {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(14deg); }
    40% { transform: rotate(-12deg); }
    60% { transform: rotate(7deg); }
    80% { transform: rotate(-5deg); }
  }
  @keyframes aiOrb {
    0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
    50% { box-shadow: 0 0 0 12px rgba(37,99,235,0); }
  }

  .glass {
    background: rgba(255,255,255,0.84);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.62);
  }
  .glass-sm {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.5);
  }
  .glass-dark {
    background: linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.94));
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(37,99,235,0.18);
  }
  .card-shadow {
    box-shadow: 0 1px 0 rgba(255,255,255,0.8) inset, 0 4px 24px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.06);
  }
  .card-shadow-deep {
    box-shadow: 0 1px 0 rgba(255,255,255,0.15) inset, 0 8px 40px rgba(15,23,42,0.22), 0 2px 8px rgba(15,23,42,0.15);
  }
  .blue-glow-anim { animation: blueGlow 3s ease-in-out infinite; }
  .float-anim { animation: float 4s ease-in-out infinite; }
  .slide-up { animation: slideUp 0.35s ease-out both; }
  .fade-in { animation: fadeIn 0.25s ease-out both; }
  .count-anim { animation: countNum 0.5s ease-out both; }

  .map-pulse-ring {
    position: absolute;
    border-radius: 50%;
    animation: pulseRing 2s ease-out infinite;
  }

  .scan-anim {
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #2563EB 40%, transparent);
    box-shadow: 0 0 10px rgba(37,99,235,0.8), 0 0 3px rgba(37,99,235,0.5);
    animation: scanLine 2.2s ease-in-out infinite alternate;
  }
  .shimmer-blue {
    background: linear-gradient(90deg, #2563EB, #60A5FA, #2563EB);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmerBlue 2.2s linear infinite;
  }
  .notif-bell-bounce { animation: notifBounce 0.6s ease-in-out; }
  .ai-orb { animation: aiOrb 2.5s ease-in-out infinite; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.18); border-radius: 4px; }

  .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(15,23,42,0.14); }

  .nav-pill-anim { transition: background 0.22s, color 0.22s; }
  .btn-primary {
    background: #0B1220;
    color: #FFFFFF;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  }
  .btn-primary:hover {
    background: #111827;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.3), 0 4px 16px rgba(15,23,42,0.25);
    transform: translateY(-1px);
  }
  .btn-blue {
    background: #2563EB;
    color: #FFFFFF;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .btn-blue:hover { background: #60A5FA; box-shadow: 0 0 16px rgba(37,99,235,0.45); }

  .progress-ring-track { fill: none; }
  .progress-ring-fill { fill: none; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }

  .bg-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  }

  .issue-card-border-critical { border-left: 3px solid #E35D4F; }
  .issue-card-border-active { border-left: 3px solid #3B82F6; }
  .issue-card-border-verified { border-left: 3px solid #0EA5E9; }
  .issue-card-border-resolved { border-left: 3px solid #2563EB; }
  .issue-card-border-progress { border-left: 3px solid #8B5CF6; }

  input:focus, textarea:focus { outline: none; }
`;

function svgDataUri(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createIssueVisual(category: "Water" | "Electricity" | "Waste" | "Roads" | "Drainage") {
  const visuals: Record<typeof category, string> = {
    Water: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none">
        <defs>
          <linearGradient id="bg" x1="120" y1="0" x2="1080" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#091120" />
            <stop offset="0.55" stop-color="#11264A" />
            <stop offset="1" stop-color="#2563EB" />
          </linearGradient>
          <linearGradient id="road" x1="0" y1="500" x2="1200" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#F8FAFC" />
            <stop offset="1" stop-color="#CBD5E1" />
          </linearGradient>
          <linearGradient id="leak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#7DD3FC" />
            <stop offset="1" stop-color="#0EA5E9" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" rx="48" fill="url(#bg)" />
        <circle cx="995" cy="140" r="220" fill="#60A5FA" opacity="0.08" />
        <circle cx="190" cy="180" r="180" fill="#93C5FD" opacity="0.08" />
        <rect x="0" y="540" width="1200" height="260" fill="url(#road)" />
        <path d="M0 548H1200" stroke="#94A3B8" stroke-opacity="0.25" stroke-width="6" />
        <path d="M126 584H1074" stroke="#E2E8F0" stroke-width="12" stroke-dasharray="82 52" />
        <path d="M0 660H1200" stroke="#CBD5E1" stroke-opacity="0.5" stroke-width="3" />
        <path d="M490 470C520 438 560 426 612 426C656 426 695 444 724 476L787 544H420L490 470Z" fill="#0F172A" opacity="0.85" />
        <path d="M612 224C576 308 552 366 540 404" stroke="#BAE6FD" stroke-width="20" stroke-linecap="round" />
        <path d="M612 224C576 308 552 366 540 404" stroke="#7DD3FC" stroke-width="10" stroke-linecap="round" />
        <path d="M556 348C520 348 492 378 492 414C492 450 520 480 556 480C592 480 620 450 620 414C620 378 592 348 556 348Z" fill="#0EA5E9" opacity="0.14" />
        <path d="M556 348C520 348 492 378 492 414C492 450 520 480 556 480C592 480 620 450 620 414C620 378 592 348 556 348Z" stroke="#38BDF8" stroke-width="8" />
        <path d="M760 356C760 332 778 314 802 314C826 314 844 332 844 356C844 382 822 402 802 432C782 402 760 382 760 356Z" fill="url(#leak)" />
        <path d="M840 392C856 392 870 406 870 422C870 442 852 452 840 470C828 452 810 442 810 422C810 406 824 392 840 392Z" fill="#38BDF8" opacity="0.9" />
        <path d="M366 462C402 430 438 416 476 414" stroke="#F8FAFC" stroke-width="6" stroke-linecap="round" opacity="0.5" />
        <rect x="162" y="160" width="150" height="190" rx="20" fill="#0F172A" opacity="0.45" />
        <rect x="186" y="182" width="34" height="40" rx="8" fill="#1D4ED8" opacity="0.7" />
        <rect x="230" y="182" width="34" height="40" rx="8" fill="#1D4ED8" opacity="0.48" />
        <rect x="186" y="236" width="78" height="28" rx="8" fill="#E2E8F0" opacity="0.26" />
        <rect x="978" y="180" width="118" height="150" rx="18" fill="#0F172A" opacity="0.38" />
        <rect x="1000" y="202" width="28" height="34" rx="8" fill="#2563EB" opacity="0.65" />
        <rect x="1036" y="202" width="28" height="34" rx="8" fill="#2563EB" opacity="0.45" />
      </svg>
    `),
    Electricity: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none">
        <defs>
          <linearGradient id="bg" x1="140" y1="0" x2="1060" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#050816" />
            <stop offset="0.55" stop-color="#0B1220" />
            <stop offset="1" stop-color="#1D4ED8" />
          </linearGradient>
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="#93C5FD" stop-opacity="0.9" />
            <stop offset="1" stop-color="#93C5FD" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="800" rx="48" fill="url(#bg)" />
        <circle cx="820" cy="180" r="210" fill="#2563EB" opacity="0.09" />
        <circle cx="310" cy="170" r="140" fill="#60A5FA" opacity="0.05" />
        <rect x="0" y="548" width="1200" height="252" fill="#0B1220" opacity="0.92" />
        <path d="M0 586H1200" stroke="#94A3B8" stroke-opacity="0.2" stroke-width="6" />
        <path d="M112 632H1088" stroke="#F8FAFC" stroke-width="10" stroke-dasharray="76 48" opacity="0.82" />
        <rect x="155" y="180" width="122" height="220" rx="20" fill="#E2E8F0" opacity="0.06" />
        <rect x="305" y="140" width="86" height="250" rx="18" fill="#E2E8F0" opacity="0.05" />
        <rect x="1028" y="168" width="90" height="190" rx="18" fill="#E2E8F0" opacity="0.06" />
        <path d="M600 168C570 212 546 262 526 324" stroke="#D4E8FF" stroke-width="18" stroke-linecap="round" opacity="0.8" />
        <path d="M600 168C570 212 546 262 526 324" stroke="#60A5FA" stroke-width="8" stroke-linecap="round" opacity="0.9" />
        <circle cx="600" cy="162" r="34" fill="#F8FAFC" opacity="0.12" />
        <circle cx="600" cy="162" r="18" fill="#F8FAFC" opacity="0.88" />
        <circle cx="600" cy="162" r="64" fill="url(#glow)" opacity="0.4" />
        <path d="M730 270L777 305L730 340" stroke="#93C5FD" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />
        <rect x="562" y="344" width="76" height="68" rx="20" fill="#2563EB" opacity="0.22" />
        <path d="M320 470C380 430 451 410 531 408C604 406 672 424 737 460L790 492H250L320 470Z" fill="#020617" opacity="0.9" />
        <path d="M354 438C380 454 401 472 416 496" stroke="#38BDF8" stroke-width="6" stroke-linecap="round" opacity="0.6" />
        <path d="M436 424C474 450 498 474 514 500" stroke="#0EA5E9" stroke-width="5" stroke-linecap="round" opacity="0.6" />
      </svg>
    `),
    Waste: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none">
        <defs>
          <linearGradient id="bg" x1="120" y1="0" x2="1080" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#F8FAFC" />
            <stop offset="0.55" stop-color="#E2E8F0" />
            <stop offset="1" stop-color="#CBD5E1" />
          </linearGradient>
          <linearGradient id="bin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0F172A" />
            <stop offset="1" stop-color="#334155" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" rx="48" fill="url(#bg)" />
        <circle cx="980" cy="150" r="200" fill="#2563EB" opacity="0.07" />
        <circle cx="220" cy="200" r="160" fill="#0EA5E9" opacity="0.05" />
        <rect x="0" y="538" width="1200" height="262" fill="#E5E7EB" />
        <path d="M120 592H1080" stroke="#94A3B8" stroke-width="9" stroke-dasharray="90 42" opacity="0.75" />
        <path d="M362 472C396 432 445 410 508 410C574 410 622 434 658 476L716 538H310L362 472Z" fill="#0F172A" opacity="0.18" />
        <rect x="466" y="250" width="250" height="228" rx="26" fill="url(#bin)" />
        <path d="M442 252H740" stroke="#94A3B8" stroke-width="28" stroke-linecap="round" />
        <rect x="500" y="308" width="168" height="132" rx="20" fill="#111827" />
        <path d="M486 284C504 274 518 268 540 266H650C675 268 689 274 706 284" stroke="#CBD5E1" stroke-width="10" stroke-linecap="round" />
        <path d="M550 222C538 200 530 184 522 168" stroke="#22C55E" stroke-width="8" stroke-linecap="round" />
        <path d="M596 220C598 194 604 178 614 160" stroke="#22C55E" stroke-width="8" stroke-linecap="round" />
        <path d="M646 224C658 202 670 184 686 170" stroke="#22C55E" stroke-width="8" stroke-linecap="round" />
        <circle cx="528" cy="144" r="22" fill="#16A34A" opacity="0.85" />
        <circle cx="588" cy="136" r="20" fill="#22C55E" opacity="0.8" />
        <circle cx="648" cy="146" r="22" fill="#4ADE80" opacity="0.78" />
        <path d="M590 368L632 420H548L590 368Z" fill="#F97316" opacity="0.9" />
        <path d="M710 382L748 428H676L710 382Z" fill="#0EA5E9" opacity="0.9" />
        <path d="M430 394L474 446H398L430 394Z" fill="#10B981" opacity="0.88" />
        <circle cx="792" cy="330" r="58" fill="#22C55E" opacity="0.12" />
        <path d="M786 306C768 314 762 330 762 344C762 364 778 380 798 380C820 380 836 364 836 342C836 330 828 316 812 308" stroke="#16A34A" stroke-width="8" stroke-linecap="round" />
      </svg>
    `),
    Roads: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none">
        <defs>
          <linearGradient id="bg" x1="100" y1="0" x2="1100" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#0B1220" />
            <stop offset="0.55" stop-color="#111827" />
            <stop offset="1" stop-color="#334155" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" rx="48" fill="url(#bg)" />
        <circle cx="1020" cy="170" r="180" fill="#2563EB" opacity="0.08" />
        <rect x="0" y="546" width="1200" height="254" fill="#0F172A" opacity="0.94" />
        <path d="M120 608H1080" stroke="#F8FAFC" stroke-width="10" stroke-dasharray="82 50" opacity="0.8" />
        <path d="M420 470L548 334C578 302 620 294 662 314L790 378L712 468L420 470Z" fill="#1E293B" />
        <path d="M478 432L552 364C572 346 598 342 622 352L724 396L682 446L478 432Z" fill="#0F172A" opacity="0.95" />
        <path d="M594 336L572 392L530 392L560 348L594 336Z" fill="#F59E0B" opacity="0.95" />
        <circle cx="596" cy="398" r="42" fill="#E35D4F" opacity="0.18" />
        <circle cx="596" cy="398" r="22" fill="#F97316" />
        <path d="M944 318L992 394H896L944 318Z" fill="#F59E0B" />
        <rect x="938" y="280" width="12" height="46" rx="6" fill="#F8FAFC" />
        <path d="M206 406C254 372 312 360 372 366" stroke="#60A5FA" stroke-width="8" stroke-linecap="round" opacity="0.4" />
      </svg>
    `),
    Drainage: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none">
        <defs>
          <linearGradient id="bg" x1="120" y1="0" x2="1080" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#08111E" />
            <stop offset="0.6" stop-color="#0F172A" />
            <stop offset="1" stop-color="#1E3A8A" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" rx="48" fill="url(#bg)" />
        <rect x="0" y="548" width="1200" height="252" fill="#0F172A" opacity="0.92" />
        <path d="M120 610H1080" stroke="#94A3B8" stroke-width="9" stroke-dasharray="78 44" opacity="0.72" />
        <circle cx="620" cy="410" r="120" fill="#38BDF8" opacity="0.12" />
        <circle cx="620" cy="410" r="62" fill="#0EA5E9" opacity="0.2" />
        <path d="M536 404C536 357 573 320 620 320C667 320 704 357 704 404C704 457 663 494 620 548C577 494 536 457 536 404Z" fill="#0EA5E9" opacity="0.92" />
        <path d="M604 336L570 440H620L596 520L670 400H622L646 336H604Z" fill="#F8FAFC" opacity="0.92" />
        <rect x="228" y="260" width="134" height="160" rx="20" fill="#1E293B" opacity="0.7" />
        <rect x="842" y="250" width="140" height="170" rx="22" fill="#1E293B" opacity="0.7" />
        <path d="M226 430C248 408 280 396 318 394C358 392 390 402 416 430" stroke="#38BDF8" stroke-width="8" stroke-linecap="round" opacity="0.7" />
        <path d="M812 448C842 414 878 396 924 394C968 392 1002 404 1036 434" stroke="#38BDF8" stroke-width="8" stroke-linecap="round" opacity="0.7" />
      </svg>
    `),
  };

  return visuals[category];
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const ISSUES = [
  {
    id: "KIN-2026-1801",
    title: "Water leakage near 12th Main",
    category: "Water",
    status: "Verified",
    severity: "High",
    location: "12th Main Road, Indiranagar",
    distance: "0.4 km",
    verifications: 18,
    time: "2h ago",
    authority: "Water Supply Board",
    color: "#2563EB",
    icon: Droplets,
    borderClass: "issue-card-border-verified",
    img: createIssueVisual("Water"),
  },
  {
    id: "KIN-2026-1788",
    title: "Streetlight not working on CMH Road",
    category: "Electricity",
    status: "Assigned",
    severity: "Medium",
    location: "CMH Road, Indiranagar",
    distance: "0.8 km",
    verifications: 7,
    time: "5h ago",
    authority: "BESCOM",
    color: "#3B82F6",
    icon: Lightbulb,
    borderClass: "issue-card-border-active",
    img: createIssueVisual("Electricity"),
  },
  {
    id: "KIN-2026-1774",
    title: "Garbage overflow beside Defence Colony Park",
    category: "Waste",
    status: "In Progress",
    severity: "Medium",
    location: "Defence Colony Park, Indiranagar",
    distance: "1.2 km",
    verifications: 12,
    time: "1d ago",
    authority: "BBMP",
    color: "#8B5CF6",
    icon: Trash2,
    borderClass: "issue-card-border-progress",
    img: createIssueVisual("Waste"),
  },
];

const NOTIFICATIONS = [
  { id: 1, text: "Your water leakage report was verified by 12 neighbours.", icon: ThumbsUp, color: "#0EA5E9", time: "10m ago", unread: true },
  { id: 2, text: "BBMP has marked your garbage report as In Progress.", icon: RefreshCw, color: "#8B5CF6", time: "1h ago", unread: true },
  { id: 3, text: "Kintsugi AI found a possible duplicate near your location.", icon: Sparkles, color: "#2563EB", time: "2h ago", unread: true },
  { id: 4, text: "You earned the Waste Watcher badge.", icon: Award, color: "#3B82F6", time: "Yesterday", unread: false },
  { id: 5, text: "Water Supply Board has been assigned to KIN-2026-1801.", icon: Building2, color: "#2563EB", time: "Yesterday", unread: false },
];

const BADGES = [
  { name: "First Reporter", icon: Star, earned: true, color: "#2563EB" },
  { name: "Water Warrior", icon: Droplets, earned: true, color: "#2563EB" },
  { name: "Waste Watcher", icon: Trash2, earned: true, color: "#0EA5E9" },
  { name: "Night Guardian", icon: Shield, earned: true, color: "#8B5CF6" },
  { name: "Verified Voice", icon: CheckCircle, earned: true, color: "#0EA5E9" },
  { name: "Streak Master", icon: Flame, earned: false, color: "#3B82F6" },
  { name: "Community Champion", icon: Users, earned: false, color: "#E35D4F" },
  { name: "AI Collaborator", icon: Cpu, earned: false, color: "#64748B" },
];

const LEADERBOARD = [
  { rank: 1, name: "Ananya Krishnan", ward: "Ward 108", points: 3840, avatar: "AK" },
  { rank: 2, name: "Rohan Mehta", ward: "Ward 108", points: 3210, avatar: "RM" },
  { rank: 3, name: "Srijan Jaiswal", ward: "Ward 108", points: 2480, avatar: "SJ", isYou: true },
  { rank: 4, name: "Priya Sharma", ward: "Ward 108", points: 2190, avatar: "PS" },
  { rank: 5, name: "Aditya Nair", ward: "Ward 108", points: 1920, avatar: "AN" },
];

const RESOLUTION_DATA = [
  { month: "Jan", reported: 65, resolved: 42 },
  { month: "Feb", reported: 72, resolved: 58 },
  { month: "Mar", reported: 68, resolved: 51 },
  { month: "Apr", reported: 85, resolved: 78 },
  { month: "May", reported: 98, resolved: 89 },
  { month: "Jun", reported: 112, resolved: 95 },
];

const CATEGORY_DATA = [
  { name: "Water", value: 28, color: "#2563EB" },
  { name: "Roads", value: 22, color: "#3B82F6" },
  { name: "Waste", value: 18, color: "#0EA5E9" },
  { name: "Lights", value: 16, color: "#2563EB" },
  { name: "Drainage", value: 10, color: "#8B5CF6" },
  { name: "Other", value: 6, color: "#64748B" },
];

const RESPONSE_DATA = [
  { category: "Waste", days: 1.9 },
  { category: "Water", days: 2.8 },
  { category: "Lights", days: 3.4 },
  { category: "Drainage", days: 4.1 },
  { category: "Roads", days: 5.2 },
];

const ADMIN_ISSUES = [
  { id: "KIN-2026-1801", category: "Water", severity: "High", location: "12th Main Rd", status: "Verified", verifications: 18, dept: "Water Supply Board", sla: "1d left", updated: "2h ago" },
  { id: "KIN-2026-1788", category: "Electricity", severity: "Medium", location: "CMH Road", status: "Assigned", verifications: 7, dept: "BESCOM", sla: "3d left", updated: "5h ago" },
  { id: "KIN-2026-1774", category: "Waste", severity: "Medium", location: "Defence Colony", status: "In Progress", verifications: 12, dept: "BBMP", sla: "2d left", updated: "1d ago" },
  { id: "KIN-2026-1765", category: "Roads", severity: "Critical", location: "100 Feet Road", status: "New", verifications: 3, dept: "BBMP Roads", sla: "Overdue", updated: "2d ago" },
  { id: "KIN-2026-1751", category: "Drainage", severity: "High", location: "Jeevan Bhima Nagar", status: "Assigned", verifications: 9, dept: "BWSSB", sla: "4d left", updated: "3d ago" },
];

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string; dot: string }> = {
    "Verified": { bg: "rgba(59,170,116,0.12)", text: "#1A7A52", dot: "#0EA5E9" },
    "Assigned": { bg: "rgba(37,99,235,0.12)", text: "#9A6F10", dot: "#2563EB" },
    "In Progress": { bg: "rgba(139,92,246,0.12)", text: "#5B3CB0", dot: "#8B5CF6" },
    "New": { bg: "rgba(230,155,58,0.12)", text: "#8B5010", dot: "#3B82F6" },
    "Critical": { bg: "rgba(227,93,79,0.12)", text: "#A02820", dot: "#E35D4F" },
    "Resolved": { bg: "rgba(79,159,232,0.12)", text: "#1A5F9E", dot: "#2563EB" },
    "Overdue": { bg: "rgba(227,93,79,0.15)", text: "#A02820", dot: "#E35D4F" },
  };
  const c = cfg[status] ?? { bg: "rgba(107,116,109,0.1)", text: "#64748B", dot: "#64748B" };
  return (
    <span style={{ background: c.bg, color: c.text }} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold">
      <span style={{ background: c.dot }} className="w-1.5 h-1.5 rounded-full inline-block" />
      {status}
    </span>
  );
}

function SeverityBadge({ level }: { level: string }) {
  const cfg: Record<string, string> = {
    Critical: "bg-[#E35D4F]/10 text-[#A02820]",
    High: "bg-[#3B82F6]/10 text-[#8B5010]",
    Medium: "bg-[#2563EB]/10 text-[#7A5A0A]",
    Low: "bg-[#0EA5E9]/10 text-[#1A7A52]",
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded ${cfg[level] ?? ""}`}>{level}</span>;
}

function Avatar({ initials, size = "md", dark = false }: { initials: string; size?: string; dark?: boolean }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold font-display`}
      style={{ background: dark ? "linear-gradient(135deg, #0B1220, #111827)" : "rgba(15,23,42,0.1)", color: dark ? "#EFF6FF" : "#0B1220" }}>
      {initials}
    </div>
  );
}

function ProgressRing({ value, max, size = 100, stroke = 8 }: { value: number; max: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r}
        stroke="#2563EB" strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: "drop-shadow(0 0 6px rgba(37,99,235,0.6))" }}
      />
    </svg>
  );
}

// ─── MAP CANVAS ──────────────────────────────────────────────────────────────
function MapCanvas({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#E5E7EB" }}>
      <svg viewBox="0 0 720 460" className="w-full h-full" style={{ display: "block" }}>
        <defs>
          <radialGradient id="userGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bgGrad" cx="40%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E5E7EB" />
          </radialGradient>
          <filter id="pinShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>
        {/* Background */}
        <rect width="720" height="460" fill="url(#bgGrad)" />
        {/* Block fills (slightly lighter) */}
        <rect x="0" y="0" width="120" height="100" fill="#FFFFFF" />
        <rect x="150" y="0" width="160" height="100" fill="#FFFFFF" />
        <rect x="340" y="0" width="140" height="90" fill="#FFFFFF" />
        <rect x="510" y="0" width="130" height="90" fill="#FFFFFF" />
        <rect x="660" y="0" width="60" height="100" fill="#FFFFFF" />
        <rect x="0" y="130" width="120" height="100" fill="#FFFFFF" />
        <rect x="150" y="130" width="160" height="90" fill="#FFFFFF" />
        <rect x="540" y="130" width="100" height="90" fill="#FFFFFF" />
        <rect x="660" y="130" width="60" height="100" fill="#FFFFFF" />
        <rect x="0" y="260" width="120" height="120" fill="#FFFFFF" />
        <rect x="150" y="260" width="80" height="120" fill="#FFFFFF" />
        <rect x="400" y="270" width="100" height="100" fill="#FFFFFF" />
        <rect x="540" y="270" width="100" height="100" fill="#FFFFFF" />
        <rect x="660" y="270" width="60" height="110" fill="#FFFFFF" />
        <rect x="0" y="390" width="180" height="70" fill="#FFFFFF" />
        <rect x="260" y="400" width="100" height="60" fill="#FFFFFF" />
        <rect x="400" y="400" width="270" height="60" fill="#FFFFFF" />
        {/* Roads (monochrome) */}
        {/* Horizontal */}
        <rect x="0" y="96" width="720" height="28" fill="#FFFFFF" opacity="0.85" />
        <rect x="0" y="226" width="720" height="28" fill="#FFFFFF" opacity="0.85" />
        <rect x="0" y="383" width="720" height="22" fill="#FFFFFF" opacity="0.85" />
        {/* Vertical */}
        <rect x="119" y="0" width="24" height="460" fill="#FFFFFF" opacity="0.85" />
        <rect x="306" y="0" width="24" height="460" fill="#FFFFFF" opacity="0.85" />
        <rect x="518" y="0" width="24" height="460" fill="#FFFFFF" opacity="0.85" />
        <rect x="652" y="0" width="22" height="460" fill="#FFFFFF" opacity="0.85" />
        {/* Diagonal boulevard */}
        <line x1="143" y1="0" x2="330" y2="254" stroke="#FFFFFF" strokeWidth="16" opacity="0.7" />
        {/* Parks */}
        <rect x="330" y="10" width="178" height="82" rx="6" fill="#DBEAFE" opacity="0.9" />
        <text x="419" y="52" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontFamily="Manrope, sans-serif" fontWeight="600">Cubbon Park</text>
        {/* Tree symbols in park */}
        {[360,385,410,435,460,480].map(x => (
          <circle key={x} cx={x} cy={44} r={6} fill="#93C5FD" opacity="0.7" />
        ))}
        <rect x="530" y="268" width="100" height="102" rx="6" fill="#DBEAFE" opacity="0.9" />
        <text x="580" y="320" textAnchor="middle" fill="#1D4ED8" fontSize="8" fontFamily="Manrope, sans-serif" fontWeight="600">Defence Colony Park</text>
        {/* Water */}
        <ellipse cx="655" cy="340" rx="30" ry="45" fill="#BFDBFE" opacity="0.75" />
        <text x="655" y="344" textAnchor="middle" fill="#1D4ED8" fontSize="7" fontFamily="Manrope, sans-serif">Lake</text>
        {/* Road labels */}
        <text x="60" y="114" fill="#64748B" fontSize="7.5" fontFamily="Manrope, sans-serif" fontWeight="600">12th Main Road</text>
        <text x="400" y="244" fill="#64748B" fontSize="7.5" fontFamily="Manrope, sans-serif" fontWeight="600">CMH Road</text>
        <text x="50" y="241" fill="#64748B" fontSize="7.5" fontFamily="Manrope, sans-serif" fontWeight="600">100 Feet Road</text>
        <text x="130" y="30" fill="#64748B" fontSize="7" fontFamily="Manrope, sans-serif" fontWeight="600" transform="rotate(90,130,30)">Defence Colony Rd</text>
        {/* User location */}
        <circle cx="370" cy="252" r="28" fill="url(#userGlow)" />
        <circle cx="370" cy="252" r="10" fill="#2563EB" opacity="0.18" />
        <circle cx="370" cy="252" r="6" fill="#2563EB" />
        <circle cx="370" cy="252" r="3" fill="#FFFFFF" />
        {/* Issue pins */}
        {/* Critical - red */}
        <g filter="url(#pinShadow)">
          <circle cx="200" cy="175" r="11" fill="#E35D4F" />
          <text x="200" y="179" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">!</text>
        </g>
        <circle cx="200" cy="175" r="18" fill="#E35D4F" opacity="0.0">
          <animate attributeName="r" values="11;22;11" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Verified - dark */}
        <g filter="url(#pinShadow)">
          <circle cx="420" cy="145" r="11" fill="#0EA5E9" />
          <text x="420" y="149" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">✓</text>
        </g>
        <circle cx="420" cy="145" r="18" fill="#0EA5E9" opacity="0.0">
          <animate attributeName="r" values="11;22;11" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* Active - amber */}
        <g filter="url(#pinShadow)">
          <circle cx="480" cy="310" r="10" fill="#3B82F6" />
          <text x="480" y="314" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">~</text>
        </g>
        <circle cx="480" cy="310" r="10" fill="#3B82F6" opacity="0.0">
          <animate attributeName="r" values="10;20;10" dur="2.2s" repeatCount="indefinite" begin="0.5s" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        {/* Resolved - blue */}
        <g filter="url(#pinShadow)">
          <circle cx="570" cy="170" r="10" fill="#2563EB" />
          <text x="570" y="174" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">✓</text>
        </g>
        {/* Active - amber 2 */}
        <g filter="url(#pinShadow)">
          <circle cx="260" cy="320" r="10" fill="#3B82F6" />
          <text x="260" y="324" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">~</text>
        </g>
      </svg>
      {/* Legend */}
      {!compact && (
        <div className="absolute bottom-3 left-3 glass-sm rounded-xl px-3 py-2 flex gap-3">
          {[["#E35D4F","Critical"],["#3B82F6","Active"],["#0EA5E9","Resolved"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              <span className="text-[10px] font-semibold" style={{ color: "#64748B" }}>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PAGE: OVERVIEW ──────────────────────────────────────────────────────────
function OverviewPage({ setPage }: { setPage: (p: string) => void }) {
  const [counted, setCounted] = useState(false);
  useEffect(() => { setTimeout(() => setCounted(true), 200); }, []);

  const stats = [
    { label: "Open Issues", value: "18", trend: "−12% from last week", trendPos: false, icon: AlertCircle, color: "#E35D4F", bg: "rgba(227,93,79,0.08)" },
    { label: "Verified Reports", value: "127", trend: "32 verified by community", trendPos: true, icon: CheckCircle, color: "#0EA5E9", bg: "rgba(59,170,116,0.08)" },
    { label: "Avg Resolution", value: "3.8d", trend: "1.2d faster than avg", trendPos: true, icon: Clock, color: "#2563EB", bg: "rgba(79,159,232,0.08)" },
    { label: "Civic Hours Saved", value: "18h", trend: "AI triage impact", trendPos: true, icon: Zap, color: "#2563EB", bg: "rgba(37,99,235,0.08)" },
  ];

  return (
    <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-8 space-y-8">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 slide-up">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#0EA5E9] inline-block" style={{ boxShadow: "0 0 0 0 rgba(59,170,116,0.4)", animation: "aiOrb 2s ease-in-out infinite" }} />
            <span className="text-xs font-semibold text-[#0EA5E9] tracking-wide uppercase">Live Community Pulse</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            Good morning, Srijan.
          </h1>
          <p className="text-slate-300 mt-1.5 text-base max-w-lg">
            Your neighbourhood is getting better. <span className="text-blue-300 font-semibold">3 issues</span> were resolved this week.
          </p>
        </div>
        <button
          onClick={() => setPage("report")}
          className="btn-primary flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm shrink-0"
        >
          <Plus size={16} />
          Report an issue
        </button>
      </div>

      {/* Map + Guardian */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Map Card */}
        <div className="md:col-span-2 glass rounded-2xl overflow-hidden card-shadow hover-lift" style={{ minHeight: 300 }}>
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <div>
              <h3 className="font-display font-bold text-[#0B0F19]">What's happening nearby</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Live issues within 2 km of you</p>
            </div>
            <button
              onClick={() => setPage("map")}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#0B1220] hover:text-[#2563EB] transition-colors"
            >
              Explore map <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ height: 260 }}>
            <MapCanvas compact />
          </div>
        </div>

        {/* Guardian Card */}
        <div className="glass-dark rounded-2xl p-6 card-shadow-deep blue-glow-anim relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)", transform: "translate(20px,-20px)" }} />
          <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)", transform: "translate(-14px,14px)" }} />
          {/* Kintsugi crack lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 240 320" preserveAspectRatio="none" style={{ opacity: 0.07 }}>
            <path d="M60,0 L90,80 L50,140 L110,200 L80,280" stroke="#2563EB" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M180,40 L150,100 L190,160 L160,240 L200,320" stroke="#2563EB" strokeWidth="1" fill="none" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} style={{ color: "#2563EB" }} />
              <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#2563EB" }}>Neighbourhood Guardian</span>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <ProgressRing value={2480} max={3000} size={80} stroke={7} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-bold text-sm text-white">Lv 8</span>
                </div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-white font-mono-data">2,480</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(239,246,255,0.7)" }}>Civic Points</div>
                <div className="text-xs mt-1" style={{ color: "#2563EB" }}>520 pts to Level 9</div>
              </div>
            </div>
            <div className="h-1.5 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div className="h-full rounded-full" style={{ width: "82.7%", background: "linear-gradient(90deg, #2563EB, #60A5FA)", boxShadow: "0 0 8px rgba(37,99,235,0.6)" }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame size={14} style={{ color: "#60A5FA" }} />
                <span className="text-xs font-semibold text-white">12 day streak</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gift size={14} style={{ color: "#2563EB" }} />
                <span className="text-xs" style={{ color: "rgba(239,246,255,0.7)" }}>Rewards available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="glass rounded-2xl p-5 card-shadow hover-lift count-anim" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={17} style={{ color: s.color }} />
              </div>
              <TrendingUp size={13} style={{ color: s.trendPos ? "#0EA5E9" : "#E35D4F", opacity: 0.7 }} />
            </div>
            <div className="font-display font-bold text-2xl text-[#0B0F19] font-mono-data">{s.value}</div>
            <div className="text-xs text-[#64748B] mt-1 leading-tight">{s.label}</div>
            <div className="text-xs mt-1.5 font-semibold" style={{ color: s.trendPos ? "#0EA5E9" : "#E35D4F" }}>{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Issue Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-white">Priority issues near you</h2>
          <button className="text-xs font-semibold text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-1">
            View all <ChevronRight size={13} />
          </button>
        </div>
        <div className="space-y-3">
          {ISSUES.map((issue, i) => (
            <IssueCard key={issue.id} issue={issue} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </div>
  );
}

function IssueCard({ issue, delay = 0 }: { issue: typeof ISSUES[0]; delay?: number }) {
  return (
    <div className={`glass rounded-2xl overflow-hidden card-shadow hover-lift slide-up ${issue.borderClass}`}
      style={{ animationDelay: `${delay}s` }}>
      <div className="flex gap-4 p-4">
        <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-[#F1F5F9]">
          <img src={issue.img} alt={issue.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${issue.color}18` }}>
                <issue.icon size={13} style={{ color: issue.color }} />
              </div>
              <span className="font-display font-semibold text-sm text-[#0B0F19] truncate">{issue.title}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <StatusPill status={issue.status} />
              <SeverityBadge level={issue.severity} />
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#64748B] mb-2.5">
            <span className="flex items-center gap-1"><MapPin size={11} />{issue.location}</span>
            <span>•</span>
            <span>{issue.distance}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><CheckCircle size={11} />{issue.verifications} verified</span>
            <span>•</span>
            <span>{issue.time}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <Building2 size={11} />
              <span>{issue.authority}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-[#0B1220] hover:bg-[#EFF6FF] transition-colors">
                <ThumbsUp size={11} /> Verify
              </button>
              <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-[#0B1220] hover:bg-[#EFF6FF] transition-colors">
                <Eye size={11} /> Track
              </button>
              <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-[#0B1220] hover:bg-[#EFF6FF] transition-colors">
                <Upload size={11} /> Evidence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: LIVE MAP ──────────────────────────────────────────────────────────
function LiveMapPage() {
  const [selected, setSelected] = useState<string | null>("KIN-2026-1801");
  const [activeFilter, setActiveFilter] = useState("All");
  const filterTypes = ["All", "Water", "Electricity", "Waste", "Roads", "Drainage"];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Filters sidebar */}
      <div className="w-64 shrink-0 glass border-r border-[rgba(15,23,42,0.08)] p-5 overflow-y-auto">
        <h3 className="font-display font-bold text-[#0B0F19] mb-4">Filters</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Issue type</label>
            <div className="space-y-1.5">
              {filterTypes.map(f => (
                <button key={f}
                  onClick={() => setActiveFilter(f)}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ background: activeFilter === f ? "#0B1220" : "transparent", color: activeFilter === f ? "#FFFFFF" : "#64748B" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Severity</label>
            {["Critical","High","Medium","Low"].map(s => (
              <label key={s} className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#0B1220]" />
                <span className="text-sm text-[#0B0F19]">{s}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 block">Distance</label>
            <input type="range" min="0.5" max="5" step="0.5" defaultValue="2" className="w-full accent-[#0B1220]" />
            <div className="flex justify-between text-xs text-[#64748B] mt-1">
              <span>0.5 km</span><span>2 km</span><span>5 km</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-[#0B1220]" />
              <span className="text-sm font-medium text-[#0B0F19]">Verified only</span>
            </label>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-primary text-sm font-semibold mt-2">
            <Layers size={14} /> Heatmap
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-[rgba(15,23,42,0.15)] text-[#0B1220] hover:bg-[#F1F5F9] transition-colors">
            <Sparkles size={14} /> AI Insights
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-3">
          <div className="flex-1 glass rounded-xl flex items-center gap-2 px-4 py-2.5 card-shadow">
            <Search size={16} style={{ color: "#64748B" }} />
            <input type="text" placeholder="Search an area, road, or issue..." className="bg-transparent flex-1 text-sm text-[#0B0F19] placeholder:text-[#64748B]" />
          </div>
        </div>
        <MapCanvas />
        {/* Clickable overlay pins */}
        {[
          { id: "KIN-2026-1801", x: "27%", y: "38%" },
          { id: "KIN-2026-1788", x: "58%", y: "31%" },
          { id: "KIN-2026-1774", x: "67%", y: "68%" },
        ].map(pin => (
          <button key={pin.id}
            onClick={() => setSelected(selected === pin.id ? null : pin.id)}
            className="absolute w-8 h-8 rounded-full cursor-pointer border-2 border-white"
            style={{ left: pin.x, top: pin.y, transform: "translate(-50%,-50%)", background: "transparent" }}
          />
        ))}
      </div>

      {/* Issue details drawer */}
      {selected && (
        <div className="w-80 shrink-0 glass border-l border-[rgba(15,23,42,0.08)] overflow-y-auto slide-up">
          {(() => {
            const issue = ISSUES.find(i => i.id === selected) ?? ISSUES[0];
            return (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <StatusPill status={issue.status} />
                  <button onClick={() => setSelected(null)} className="text-[#64748B] hover:text-[#0B0F19]"><X size={16} /></button>
                </div>
                <img src={issue.img} alt={issue.title} className="w-full h-36 object-cover rounded-xl mb-4 bg-[#F1F5F9]" loading="lazy" decoding="async" />
                <h3 className="font-display font-bold text-[#0B0F19] mb-1">{issue.title}</h3>
                <div className="flex items-center gap-2 text-xs text-[#64748B] mb-3">
                  <MapPin size={11} />{issue.location}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[["Severity", issue.severity],["Category",issue.category],["Verified by",`${issue.verifications} citizens`],["Authority",issue.authority]].map(([k,v]) => (
                    <div key={k} className="bg-[#F1F5F9] rounded-xl p-3">
                      <div className="text-xs text-[#64748B] mb-0.5">{k}</div>
                      <div className="text-sm font-semibold text-[#0B0F19]">{v}</div>
                    </div>
                  ))}
                </div>
                {/* Timeline */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">Timeline</h4>
                  {[["Reported","Citizen filed report","2h ago","#64748B"],["AI Categorised","Kintsugi AI","1h 50m ago","#2563EB"],["Community Verified","18 citizens","1h ago","#0EA5E9"],["Assigned","Water Supply Board","30m ago","#2563EB"]].map(([step,desc,time,color]) => (
                    <div key={step} className="flex gap-3 mb-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ background: color }} />
                        <div className="w-px flex-1 mt-1" style={{ background: "rgba(15,23,42,0.1)" }} />
                      </div>
                      <div className="pb-2">
                        <div className="text-sm font-semibold text-[#0B0F19]">{step}</div>
                        <div className="text-xs text-[#64748B]">{desc} · {time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <button className="w-full btn-primary py-2.5 rounded-xl text-sm font-semibold">Track this issue</button>
                  <button className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[rgba(15,23,42,0.15)] text-[#0B1220] hover:bg-[#F1F5F9] transition-colors">Add evidence</button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── PAGE: REPORT ISSUE ──────────────────────────────────────────────────────
function ReportIssuePage() {
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 5;

  const STEPS = ["Upload Evidence", "Confirm Location", "AI Analysis", "Community Visibility", "Submit"];

  const handleUpload = () => { setStep(3); setScanning(true); setTimeout(() => { setScanning(false); setScanned(true); }, 3500); };
  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center slide-up">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #0B1220, #111827)", boxShadow: "0 0 40px rgba(59,170,116,0.4)" }}>
          <CheckCircle size={36} className="text-[#EFF6FF]" />
        </div>
        <h2 className="font-display font-bold text-3xl text-[#0B0F19] mb-2">Report submitted</h2>
        <p className="text-[#64748B] mb-6">Your report is now visible to the community.</p>
        <div className="glass rounded-2xl p-5 card-shadow mb-6 text-left">
          <div className="text-xs text-[#64748B] mb-1">Tracking ID</div>
          <div className="font-mono-data font-bold text-lg text-[#0B1220] mb-3">KIN-2026-1842</div>
          <div className="flex items-center gap-2 py-2 px-3 rounded-xl" style={{ background: "rgba(37,99,235,0.1)" }}>
            <Star size={16} style={{ color: "#2563EB" }} />
            <span className="font-semibold text-sm" style={{ color: "#8A6010" }}>+80 Civic Points earned</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <button className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm">Track issue</button>
          <button className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-[rgba(15,23,42,0.15)] text-[#0B1220] hover:bg-[#F1F5F9] transition-colors">Share with neighbours</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{ background: i + 1 <= step ? "#2563EB" : "rgba(255,255,255,0.08)", color: i + 1 <= step ? "#FFFFFF" : "#94A3B8" }}>
                {i + 1 < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className="text-xs font-medium hidden md:block" style={{ color: i + 1 === step ? "#FFFFFF" : "#94A3B8" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px mx-2" style={{ background: i + 1 < step ? "#2563EB" : "rgba(255,255,255,0.16)" }} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="glass rounded-2xl p-6 card-shadow slide-up">
        {step === 1 && (
          <div>
            <h2 className="font-display font-bold text-xl text-[#0B0F19] mb-1">Upload evidence</h2>
            <p className="text-sm text-[#64748B] mb-6">Kintsugi AI will detect the issue type, urgency, and likely department.</p>
            <div className="border-2 border-dashed rounded-2xl p-10 text-center mb-6 hover:border-[#0B1220] hover:bg-[#F1F5F9]/40 transition-all cursor-pointer"
              style={{ borderColor: "rgba(15,23,42,0.2)" }}>
              <Upload size={36} className="mx-auto mb-3 text-[#0B1220] opacity-50" />
              <p className="font-semibold text-[#0B0F19] mb-1">Drop your file here</p>
              <p className="text-sm text-[#64748B]">or click to browse</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[[Camera,"Camera"],[Mic,"Voice Note"],[FileText,"Text"],[Upload,"Gallery"]].map(([Icon,label]) => (
                <button key={label as string} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[rgba(15,23,42,0.1)] hover:border-[#0B1220] hover:bg-[#F1F5F9] transition-all text-sm text-[#64748B] font-medium">
                  <Icon size={20} className="text-[#0B1220]" />
                  {label as string}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#0B0F19] block mb-2">Describe what you see</label>
              <textarea className="w-full bg-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-[#0B0F19] placeholder:text-[#64748B] resize-none border border-transparent focus:border-[rgba(15,23,42,0.2)] transition-colors" rows={3} placeholder="Water is gushing out from the pavement near 12th Main…" />
            </div>
            <button onClick={handleUpload} className="btn-primary w-full py-3 rounded-xl font-semibold">Continue to AI Analysis →</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display font-bold text-xl text-[#0B0F19] mb-1">AI is analysing your report</h2>
            <p className="text-sm text-[#64748B] mb-5">Kintsugi AI is detecting the issue type and routing it to the right authority.</p>
            <div className="relative rounded-2xl overflow-hidden mb-5 bg-[#0B1220]" style={{ height: 200 }}>
              <img src={ISSUES[0].img} alt="Issue" className="w-full h-full object-cover opacity-60" loading="lazy" decoding="async" />
              {scanning && <div className="scan-anim" />}
              {scanned && (
                <div className="absolute inset-3">
                  <div className="border-2 border-[#2563EB] rounded-xl w-2/5 h-3/5 absolute top-4 left-6" style={{ animation: "bboxIn 0.4s ease-out", boxShadow: "0 0 16px rgba(37,99,235,0.5)" }}>
                    <div className="absolute -top-5 left-0 text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#2563EB", color: "#FFFFFF" }}>Water Leakage</div>
                  </div>
                </div>
              )}
            </div>
            {scanned ? (
              <div className="space-y-3 mb-5">
                {[["Detected Issue","Water Leakage","#2563EB"],["Severity","High","#E35D4F"],["Confidence","94%","#0EA5E9"],["Suggested Dept","Water Supply Board","#0B1220"],["Duplicate Match","82% similar issue 0.3km away","#3B82F6"]].map(([k,v,c]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: `${c}0d` }}>
                    <span className="text-sm text-[#64748B]">{k}</span>
                    <span className="text-sm font-bold" style={{ color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-6 justify-center">
                <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-[#64748B]">Scanning with Gemini AI…</span>
              </div>
            )}
            {scanned && (
              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="btn-primary flex-1 py-3 rounded-xl font-semibold">Looks correct →</button>
                <button className="px-4 py-3 rounded-xl text-sm font-semibold border border-[rgba(15,23,42,0.15)] text-[#0B1220] hover:bg-[#F1F5F9] transition-colors"><Edit size={14} /></button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display font-bold text-xl text-[#0B0F19] mb-1">Confirm location</h2>
            <p className="text-sm text-[#64748B] mb-5">Drag the pin to the exact location of the issue.</p>
            <div className="rounded-2xl overflow-hidden mb-4" style={{ height: 220 }}>
              <MapCanvas compact />
            </div>
            <div className="flex items-center gap-3 bg-[#F1F5F9] rounded-xl px-4 py-3 mb-4">
              <MapPin size={16} className="text-[#0B1220] shrink-0" />
              <div>
                <div className="text-sm font-semibold text-[#0B0F19]">12th Main Road, Indiranagar</div>
                <div className="text-xs text-[#64748B]">Bengaluru, Karnataka 560008</div>
              </div>
              <button className="ml-auto text-xs font-semibold text-[#0B1220] hover:text-[#2563EB]">Edit</button>
            </div>
            <button onClick={() => setStep(3)} className="btn-primary w-full py-3 rounded-xl font-semibold">Confirm location →</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-display font-bold text-xl text-[#0B0F19] mb-1">Community visibility</h2>
            <p className="text-sm text-[#64748B] mb-6">Let your neighbours know and help verify the issue.</p>
            <div className="space-y-3 mb-6">
              {[["Public report","Visible to all residents and authorities",true],["Allow verification","Let neighbours confirm this issue",true],["Request urgent action","Flag as time-sensitive to BBMP",false]].map(([label,desc,checked]) => (
                <label key={label as string} className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(15,23,42,0.1)] cursor-pointer hover:bg-[#F1F5F9]/60 transition-colors">
                  <input type="checkbox" defaultChecked={checked as boolean} className="w-4 h-4 accent-[#0B1220]" />
                  <div>
                    <div className="text-sm font-semibold text-[#0B0F19]">{label as string}</div>
                    <div className="text-xs text-[#64748B]">{desc as string}</div>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={() => setStep(5)} className="btn-primary w-full py-3 rounded-xl font-semibold">Review & Submit →</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="font-display font-bold text-xl text-[#0B0F19] mb-1">Review & Submit</h2>
            <p className="text-sm text-[#64748B] mb-5">Everything looks good. Submit your report to the community.</p>
            <div className="space-y-2 mb-6">
              {[["Issue","Water Leakage"],["Location","12th Main Road, Indiranagar"],["Severity","High"],["AI Dept","Water Supply Board"],["Visibility","Public · Verification enabled"]].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2.5 border-b border-[rgba(15,23,42,0.07)]">
                  <span className="text-sm text-[#64748B]">{k}</span>
                  <span className="text-sm font-semibold text-[#0B0F19]">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5" style={{ background: "rgba(37,99,235,0.1)" }}>
              <Star size={16} style={{ color: "#2563EB" }} />
              <span className="text-sm font-semibold" style={{ color: "#8A6010" }}>You'll earn +80 Civic Points for this report</span>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full py-3 rounded-xl font-semibold text-base">Submit Report ✓</button>
          </div>
        )}
      </div>

      {step !== 3 && step < 5 && (
        <div className="flex justify-between mt-4">
          <button onClick={() => setStep(Math.max(1, step - 1))} className="text-sm text-slate-400 hover:text-white">← Back</button>
          <span className="text-xs text-slate-400">Step {step} of {totalSteps}</span>
        </div>
      )}
    </div>
  );
}

// ─── PAGE: COMMUNITY ─────────────────────────────────────────────────────────
function CommunityPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Community Verification</h1>
          <p className="text-sm text-slate-300 mt-1">Help verify issues reported by your neighbours</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EFF6FF]">
          <Users size={15} className="text-[#0B1220]" />
          <span className="text-sm font-semibold text-[#0B1220]">284 citizens verifying now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {ISSUES.map((issue) => (
          <div key={issue.id} className={`glass rounded-2xl p-5 card-shadow hover-lift ${issue.borderClass}`}>
            <div className="flex gap-3 mb-4">
              <img src={issue.img} alt={issue.title} className="w-24 h-18 rounded-xl object-cover bg-[#F1F5F9]" loading="lazy" decoding="async" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusPill status={issue.status} />
                  <SeverityBadge level={issue.severity} />
                </div>
                <h3 className="font-display font-semibold text-[#0B0F19] text-sm leading-snug">{issue.title}</h3>
                <div className="text-xs text-[#64748B] mt-1 flex items-center gap-1"><MapPin size={10} />{issue.location}</div>
              </div>
            </div>
            <div className="bg-[#F1F5F9] rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#0B1220]">AI Confidence</span>
                <span className="text-xs font-bold text-[#0B1220]">94%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[rgba(15,23,42,0.12)]">
                <div className="h-full rounded-full bg-[#0EA5E9]" style={{ width: "94%" }} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-3">
              <CheckCircle size={13} className="text-[#0EA5E9]" />
              <span className="text-xs text-[#64748B]">{issue.verifications} citizens have verified this</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#0B1220] text-[#FFFFFF] hover:bg-[#111827] transition-colors">
                <ThumbsUp size={12} /> I confirm this
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-[rgba(15,23,42,0.15)] text-[#0B1220] hover:bg-[#F1F5F9] transition-colors">
                <CheckSquare size={12} /> Resolved
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-[rgba(15,23,42,0.15)] text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                <MapPin size={12} /> Wrong location
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-[rgba(15,23,42,0.15)] text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                <Upload size={12} /> Add evidence
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust leaderboard */}
      <div className="glass rounded-2xl p-5 card-shadow">
        <h3 className="font-display font-bold text-[#0B0F19] mb-4">Trust Score Leaderboard</h3>
        <div className="space-y-3">
          {LEADERBOARD.slice(0, 4).map(l => (
            <div key={l.rank} className={`flex items-center gap-4 p-3 rounded-xl ${l.isYou ? "bg-[#F1F5F9]" : ""}`}>
              <span className="font-mono-data font-bold text-sm w-5 text-[#64748B]">{l.rank}</span>
              <Avatar initials={l.avatar} size="sm" dark={l.isYou} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#0B0F19]">{l.name} {l.isYou && <span className="text-xs text-[#0EA5E9] font-bold ml-1">(You)</span>}</div>
                <div className="text-xs text-[#64748B]">{l.ward}</div>
              </div>
              <div className="font-mono-data font-bold text-sm text-[#0B1220]">{l.points.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: IMPACT ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2.5 card-shadow text-xs">
      <div className="font-semibold text-[#0B0F19] mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

function ImpactPage() {
  const metrics = [
    { label: "Reports submitted", value: "1,284", icon: FileText, color: "#0B1220" },
    { label: "Community verified", value: "812", icon: Users, color: "#0EA5E9" },
    { label: "Issues resolved", value: "569", icon: CheckCircle, color: "#2563EB" },
    { label: "Faster via AI routing", value: "42%", icon: Zap, color: "#2563EB" },
    { label: "Citizens impacted", value: "18,400", icon: Globe, color: "#8B5CF6" },
    { label: "Civic hours saved", value: "320h", icon: Clock, color: "#3B82F6" },
  ];

  const insights = [
    { text: "Drainage complaints may spike near 100 Feet Road this weekend due to forecasted rainfall.", confidence: 87, action: "Alert BWSSB", impact: "High" },
    { text: "Garbage overflow reports increasing near Defence Colony Park. Escalation recommended.", confidence: 92, action: "Escalate to BBMP", impact: "High" },
    { text: "Streetlight outage cluster detected around CMH Road. Likely grid fault.", confidence: 78, action: "Inspect grid", impact: "Medium" },
    { text: "Proactive inspection suggested: 12th Main Road water pipeline shows stress patterns.", confidence: 83, action: "Schedule inspection", impact: "High" },
  ];

  return (
    <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-8 space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-white">Impact across Indiranagar</h1>
        <p className="text-slate-300 mt-1.5">Transparent civic progress powered by community reports and AI triage.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <div key={m.label} className="glass rounded-2xl p-4 card-shadow text-center hover-lift count-anim" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${m.color}15` }}>
              <m.icon size={18} style={{ color: m.color }} />
            </div>
            <div className="font-display font-bold text-xl text-[#0B0F19] font-mono-data">{m.value}</div>
            <div className="text-xs text-[#64748B] mt-0.5 leading-tight">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-5 card-shadow">
          <h3 className="font-display font-bold text-[#0B0F19] mb-4">Resolution trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={RESOLUTION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradReported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B1220" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0B1220" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="reported" name="Reported" stroke="#0B1220" strokeWidth={2} fill="url(#gradReported)" dot={false} />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#0EA5E9" strokeWidth={2} fill="url(#gradResolved)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5 card-shadow">
          <h3 className="font-display font-bold text-[#0B0F19] mb-4">Category breakdown</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={70} dataKey="value" strokeWidth={0}>
                  {CATEGORY_DATA.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {CATEGORY_DATA.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-[#0B0F19]">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold font-mono-data text-[#0B1220]">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 card-shadow md:col-span-2">
          <h3 className="font-display font-bold text-[#0B0F19] mb-4">Avg response time by category (days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={RESPONSE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="days" name="Days" radius={[6, 6, 0, 0]} fill="#0B1220" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} style={{ color: "#2563EB" }} />
          <h2 className="font-display font-bold text-xl text-white">AI Predictive Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins, i) => (
            <div key={i} className="glass rounded-2xl p-5 card-shadow hover-lift">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.12)" }}>
                  <Sparkles size={15} style={{ color: "#2563EB" }} />
                </div>
                <p className="text-sm text-[#0B0F19] leading-relaxed">{ins.text}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xs text-[#64748B]">Confidence <span className="font-bold font-mono-data text-[#0B1220]">{ins.confidence}%</span></div>
                  <SeverityBadge level={ins.impact} />
                </div>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-[#0B1220] hover:bg-[#EFF6FF] transition-colors">
                  {ins.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: REWARDS ───────────────────────────────────────────────────────────
function RewardsPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-8 space-y-8">
      {/* Profile hero */}
      <div className="glass-dark rounded-2xl p-6 md:p-8 card-shadow-deep blue-glow-anim relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)", transform: "translate(40px,-40px)" }} />
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 240" preserveAspectRatio="none" style={{ opacity: 0.07 }}>
          <path d="M0,80 L100,120 L60,180 L160,200 L120,240" stroke="#2563EB" strokeWidth="1.5" fill="none" />
          <path d="M300,0 L340,60 L280,100 L360,140 L300,200" stroke="#2563EB" strokeWidth="1" fill="none" />
          <path d="M600,20 L640,80 L580,140 L660,180" stroke="#2563EB" strokeWidth="1.2" fill="none" />
        </svg>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-2xl"
              style={{ background: "rgba(239,246,255,0.15)", color: "#EFF6FF", border: "2px solid rgba(37,99,235,0.3)" }}>SJ</div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold"
              style={{ background: "#2563EB", color: "#FFFFFF" }}>8</div>
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl text-white">Srijan Jaiswal</h2>
            <div className="flex items-center gap-2 mt-1">
              <Shield size={14} style={{ color: "#2563EB" }} />
              <span className="text-sm font-semibold" style={{ color: "#2563EB" }}>Neighbourhood Guardian</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(59,170,116,0.2)", color: "#0EA5E9" }}>Top 3%</span>
            </div>
            <div className="mt-3 flex items-center gap-6">
              <div>
                <div className="font-display font-bold text-3xl text-white font-mono-data">2,480</div>
                <div className="text-xs" style={{ color: "rgba(239,246,255,0.6)" }}>Civic Points</div>
              </div>
              <div>
                <div className="font-display font-bold text-3xl text-white">12</div>
                <div className="text-xs" style={{ color: "rgba(239,246,255,0.6)" }}>Day Streak</div>
              </div>
              <div>
                <div className="font-display font-bold text-3xl text-white">38</div>
                <div className="text-xs" style={{ color: "rgba(239,246,255,0.6)" }}>Reports Filed</div>
              </div>
            </div>
          </div>
          <div className="float-anim">
            <ProgressRing value={2480} max={3000} size={110} stroke={9} />
            <div className="absolute inset-0 flex items-center justify-center" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="font-display font-bold text-xl text-white mb-4">Badges & Achievements</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {BADGES.map((b) => (
            <div key={b.name} className={`glass rounded-2xl p-3 text-center card-shadow hover-lift ${b.earned ? "" : "opacity-45"}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${b.color}18`, border: b.earned ? `1.5px solid ${b.color}40` : "none" }}>
                <b.icon size={18} style={{ color: b.earned ? b.color : "#64748B" }} />
              </div>
              <div className="text-[9px] font-semibold text-[#64748B] leading-tight">{b.name}</div>
              {b.earned && <div className="text-[8px] text-[#0EA5E9] font-bold mt-0.5">Earned</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass rounded-2xl p-5 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-[#0B0F19]">Weekly Leaderboard · Indiranagar</h3>
          <span className="text-xs text-[#64748B]">Resets in 3 days</span>
        </div>
        <div className="space-y-2">
          {LEADERBOARD.map(l => (
            <div key={l.rank} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${l.isYou ? "bg-[#F1F5F9]" : "hover:bg-[#F1F5F9]"}`}>
              <span className="font-mono-data font-bold text-sm w-5 text-center" style={{ color: l.rank <= 3 ? "#2563EB" : "#64748B" }}>
                {l.rank <= 3 ? ["🥇","🥈","🥉"][l.rank - 1] : l.rank}
              </span>
              <Avatar initials={l.avatar} size="sm" dark={l.isYou} />
              <div className="flex-1">
                <span className="font-semibold text-sm text-[#0B0F19]">{l.name}</span>
                {l.isYou && <span className="text-xs text-[#0EA5E9] font-bold ml-1.5">You</span>}
              </div>
              <div className="h-1.5 flex-1 max-w-24 rounded-full bg-[rgba(15,23,42,0.08)]">
                <div className="h-full rounded-full bg-[#0B1220]" style={{ width: `${(l.points / 3840) * 100}%` }} />
              </div>
              <div className="font-mono-data font-bold text-sm text-[#0B1220] w-20 text-right">{l.points.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div>
        <h3 className="font-display font-bold text-xl text-white mb-4">Available Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([["Civic Champion Certificate","Official recognition from BBMP","500 pts",Award,"#0EA5E9"],["Partner Coupons","Local café & store discounts","750 pts",Gift,"#2563EB"],["Volunteer Event Invite","Exclusive civic action events","300 pts",Users,"#2563EB"]] as const).map(([title,desc,pts,Icon,color]) => (
            <div key={title as string} className="glass rounded-2xl p-5 card-shadow hover-lift">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h4 className="font-display font-semibold text-[#0B0F19] mb-1">{title as string}</h4>
              <p className="text-xs text-[#64748B] mb-3">{desc as string}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono-data" style={{ color }}>{pts as string}</span>
                <button className="btn-primary text-xs px-3 py-1.5 rounded-lg font-semibold">Redeem</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: ADMIN CONSOLE ─────────────────────────────────────────────────────
function AdminPage() {
  const [tab, setTab] = useState("queue");
  const adminStats = [
    { label: "Critical Queue", value: "4", color: "#E35D4F" },
    { label: "SLA Breaches", value: "2", color: "#E35D4F" },
    { label: "Assigned Today", value: "11", color: "#2563EB" },
    { label: "Resolved This Week", value: "38", color: "#0EA5E9" },
    { label: "Pending Verification", value: "23", color: "#64748B" },
    { label: "Duplicate Clusters", value: "5", color: "#8B5CF6" },
  ];
  const TABS = ["queue", "assignments", "analytics"];

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Admin Console</h1>
          <p className="text-sm text-slate-300 mt-0.5">Municipal dashboard · Ward 108 · Indiranagar</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold btn-primary">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Admin stat cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {adminStats.map(s => (
          <div key={s.label} className="glass rounded-xl p-3.5 card-shadow text-center">
            <div className="font-mono-data font-bold text-2xl" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#64748B] mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[rgba(15,23,42,0.06)] p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
            style={{ background: tab === t ? "#0B1220" : "transparent", color: tab === t ? "#FFFFFF" : "#64748B" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "queue" && (
        <div className="glass rounded-2xl card-shadow overflow-hidden">
          {/* Table header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-2 flex-1">
              <Search size={14} className="text-[#64748B]" />
              <input placeholder="Search issues…" className="bg-transparent text-sm text-[#0B0F19] placeholder:text-[#64748B]" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[rgba(15,23,42,0.12)] text-[#0B1220] hover:bg-[#F1F5F9] transition-colors">
              <Filter size={12} /> Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(15,23,42,0.06)]">
                  {["ID","Category","Severity","Location","Status","Verified","Assigned Dept","SLA","Updated","Action"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMIN_ISSUES.map((row, i) => (
                  <tr key={row.id} className="border-b border-[rgba(15,23,42,0.05)] hover:bg-[rgba(15,23,42,0.02)] transition-colors">
                    <td className="px-4 py-3 font-mono-data text-xs text-[#64748B]">{row.id}</td>
                    <td className="px-4 py-3 font-medium text-[#0B0F19] whitespace-nowrap">{row.category}</td>
                    <td className="px-4 py-3"><SeverityBadge level={row.severity} /></td>
                    <td className="px-4 py-3 text-[#0B0F19] whitespace-nowrap">{row.location}</td>
                    <td className="px-4 py-3"><StatusPill status={row.status} /></td>
                    <td className="px-4 py-3 font-mono-data text-[#0B1220] font-bold">{row.verifications}</td>
                    <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">{row.dept}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono-data text-xs font-semibold ${row.sla === "Overdue" ? "text-[#E35D4F]" : "text-[#64748B]"}`}>{row.sla}</span>
                    </td>
                    <td className="px-4 py-3 text-[#64748B] text-xs whitespace-nowrap">{row.updated}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B1220] transition-colors"><MoreHorizontal size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "assignments" && (
        <div className="glass rounded-2xl p-5 card-shadow">
          <h3 className="font-display font-bold text-[#0B0F19] mb-4">Department Assignments</h3>
          <div className="space-y-3">
            {([["Water Supply Board",8,"#2563EB"],["BBMP",12,"#0EA5E9"],["BESCOM",5,"#2563EB"],["BWSSB",6,"#8B5CF6"]] as const).map(([dept,count,color]) => (
              <div key={dept as string} className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(15,23,42,0.03)]">
                <Building2 size={18} style={{ color }} />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#0B0F19]">{dept as string}</div>
                  <div className="h-1.5 mt-2 rounded-full bg-[rgba(15,23,42,0.08)]">
                    <div className="h-full rounded-full" style={{ width: `${((count as number) / 12) * 100}%`, background: color }} />
                  </div>
                </div>
                <div className="font-mono-data font-bold" style={{ color }}>{count as number} active</div>
                <button className="btn-primary text-xs px-3 py-1.5 rounded-lg font-semibold">Assign</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div className="glass rounded-2xl p-5 card-shadow">
          <h3 className="font-display font-bold text-[#0B0F19] mb-4">SLA Performance · This Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={RESOLUTION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradAdmin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B1220" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0B1220" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#0B1220" strokeWidth={2.5} fill="url(#gradAdmin)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATION PANEL ──────────────────────────────────────────────────────
function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-12 w-88 glass rounded-2xl card-shadow slide-up z-50 overflow-hidden" style={{ width: 360 }}>
      <div className="px-5 py-4 border-b border-[rgba(15,23,42,0.08)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-[#0B0F19]">Notifications</h3>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#E35D4F", color: "white" }}>3</span>
        </div>
        <button onClick={onClose} className="text-[#64748B] hover:text-[#0B0F19]"><X size={16} /></button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        <div className="px-4 py-2">
          <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wide py-2">Today</div>
          {NOTIFICATIONS.filter((_, i) => i < 3).map(n => (
            <div key={n.id} className={`flex gap-3 py-3 border-b border-[rgba(15,23,42,0.06)] ${n.unread ? "" : "opacity-60"}`}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${n.color}15` }}>
                <n.icon size={15} style={{ color: n.color }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#0B0F19] leading-relaxed">{n.text}</p>
                <div className="text-[10px] text-[#64748B] mt-1">{n.time}</div>
              </div>
              {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />}
            </div>
          ))}
          <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wide py-2">Earlier</div>
          {NOTIFICATIONS.filter((_, i) => i >= 3).map(n => (
            <div key={n.id} className="flex gap-3 py-3 opacity-60">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${n.color}15` }}>
                <n.icon size={15} style={{ color: n.color }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#0B0F19] leading-relaxed">{n.text}</p>
                <div className="text-[10px] text-[#64748B] mt-1">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE DROPDOWN ────────────────────────────────────────────────────────
function ProfileDropdown({ onClose, setPage }: { onClose: () => void; setPage: (p: string) => void }) {
  return (
    <div className="absolute right-0 top-12 w-56 glass rounded-2xl card-shadow slide-up z-50 overflow-hidden">
      <div className="px-4 py-4 border-b border-[rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <Avatar initials="SJ" dark />
          <div>
            <div className="font-semibold text-sm text-[#0B0F19]">Srijan Jaiswal</div>
            <div className="text-xs" style={{ color: "#2563EB" }}>Neighbourhood Guardian</div>
            <div className="text-xs font-mono-data text-[#64748B] mt-0.5">2,480 pts</div>
          </div>
        </div>
      </div>
      <div className="py-2">
        {[[User,"View Profile","rewards"],[FileText,"My Reports","overview"],[Settings,"Settings","overview"],[Info,"Help","overview"]].map(([Icon, label, pg]) => (
          <button key={label as string}
            onClick={() => { setPage(pg as string); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#0B0F19] hover:bg-[rgba(15,23,42,0.05)] transition-colors">
            <Icon size={15} className="text-[#64748B]" />
            {label as string}
          </button>
        ))}
        <div className="border-t border-[rgba(15,23,42,0.08)] mt-1 pt-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E35D4F] hover:bg-[rgba(227,93,79,0.05)] transition-colors">
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function buildCopilotFallback(message: string) {
  const query = message.trim().toLowerCase();
  const topIssue = ISSUES[0];
  const secondIssue = ISSUES[1];
  const thirdIssue = ISSUES[2];

  if (query.includes("draft") || query.includes("message") || query.includes("escalat")) {
    return `Try this: "Citizen reports a recurring ${topIssue.category.toLowerCase()} issue at ${topIssue.location}. It has ${topIssue.verifications} community verifications and needs attention from ${topIssue.authority}. Please confirm assignment and share ETA."`;
  }

  if (query.includes("report") || query.includes("what should") || query.includes("next")) {
    return `Best next actions: focus on ${topIssue.title.toLowerCase()} first, then ${secondIssue.title.toLowerCase()}, and keep ${thirdIssue.title.toLowerCase()} on watch. ${topIssue.verifications} people have already verified the top item, so it is the strongest candidate for escalation.`;
  }

  if (query.includes("near me") || query.includes("summary") || query.includes("urgent")) {
    return `The most urgent live issue is ${topIssue.title} at ${topIssue.location}. It is marked ${topIssue.status.toLowerCase()}, has ${topIssue.verifications} verifications, and is assigned to ${topIssue.authority}. A close second is ${secondIssue.title}.`;
  }

  return `The live board currently points to ${topIssue.title} at ${topIssue.location} as the strongest priority. It is ${topIssue.status.toLowerCase()} with ${topIssue.verifications} verifications. I can also help draft an escalation note, summarize nearby reports, or suggest the next best issue to submit.`;
}

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────
function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi Srijan! I'm your civic copilot. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState<"live" | "fallback" | "idle">("idle");
  const suggestions = ["Summarize urgent issues near me","What should I report next?","Predict which issue may escalate","Draft a municipal escalation message"];

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setMessages(m => [...m, { from: "user", text: trimmed }]);
    setInput("");
    setSending(true);
    if (!firebaseConfigured && import.meta.env.DEV) {
      setMode("fallback");
      setMessages(m => [...m, { from: "ai", text: buildCopilotFallback(trimmed) }]);
      setSending(false);
      return;
    }
    try {
      const response = firebaseConfigured ? await api.chat(trimmed) : await api.chatPublic(trimmed);
      setMode("live");
      setMessages(m => [...m, { from: "ai", text: response.answer }]);
    } catch (firstError) {
      try {
        const response = await api.chatPublic(trimmed);
        setMode("live");
        setMessages(m => [...m, { from: "ai", text: response.answer }]);
      } catch {
        setMode("fallback");
        setMessages(m => [...m, { from: "ai", text: buildCopilotFallback(trimmed) }]);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="glass-dark rounded-2xl card-shadow-deep slide-up overflow-hidden" style={{ width: 340 }}>
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(37,99,235,0.15)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,99,235,0.2)" }}>
                <Sparkles size={14} style={{ color: "#2563EB" }} />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-white">Kintsugi AI</div>
                <div className="text-[10px]" style={{ color: "rgba(239,246,255,0.5)" }}>
                  Civic Copilot {mode === "live" ? "· Gemini live" : mode === "fallback" ? "· Local fallback" : ""}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-[rgba(239,246,255,0.5)] hover:text-white"><X size={15} /></button>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed max-w-[82%] ${m.from === "user"
                  ? "bg-[rgba(37,99,235,0.25)] text-white"
                  : "bg-[rgba(255,255,255,0.08)] text-[rgba(239,246,255,0.9)]"}`}>
                  {m.from === "ai" && <div className="shimmer-blue text-[10px] font-bold mb-1">Kintsugi AI</div>}
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-3 space-y-2">
            <div className="flex gap-1.5 flex-wrap">
              {suggestions.slice(0, 2).map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-[rgba(37,99,235,0.25)] text-[rgba(239,246,255,0.7)] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors disabled:opacity-40"
                  disabled={sending}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2 border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask your civic copilot…"
                className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white placeholder:text-[rgba(239,246,255,0.35)] disabled:opacity-60"
                disabled={sending}
              />
              <button onClick={() => sendMessage(input)} className="px-3 py-2.5 hover:opacity-80 transition-opacity disabled:opacity-40" style={{ color: "#2563EB" }} disabled={sending}>
                {sending ? <RefreshCw size={14} className="spin" /> : <Send size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-dark card-shadow-deep ai-orb float-anim"
        style={{ border: "1px solid rgba(37,99,235,0.3)" }}
      >
        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,99,235,0.2)" }}>
          <Sparkles size={15} style={{ color: "#2563EB" }} />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-white leading-none">Kintsugi AI</div>
          <div className="text-[10px] leading-none mt-0.5" style={{ color: "rgba(239,246,255,0.55)" }}>Ask your civic copilot</div>
        </div>
      </button>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "map", label: "Live Map", icon: Map },
  { id: "report", label: "Report Issue", icon: Plus },
  { id: "community", label: "Community", icon: Users },
  { id: "impact", label: "Impact", icon: BarChart2 },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "admin", label: "Admin", icon: Terminal },
];

function KintsugiLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <polygon points="16,2 29,9 29,23 16,30 3,23 3,9" fill="#0B1220" stroke="#2563EB" strokeWidth="1.5" />
        <text x="16" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" fontFamily="'Plus Jakarta Sans', sans-serif">K</text>
        <line x1="10" y1="16" x2="22" y2="16" stroke="#2563EB" strokeWidth="1" opacity="0.6" />
        <line x1="14" y1="10" x2="18" y2="22" stroke="#2563EB" strokeWidth="0.8" opacity="0.4" />
      </svg>
      <span className="font-display font-bold text-lg text-[#0B0F19] tracking-tight">Kintsugi</span>
    </div>
  );
}

function Navbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 glass border-b border-[rgba(15,23,42,0.08)] card-shadow">
      <div className="max-w-[1440px] mx-auto px-5 h-16 flex items-center gap-4">
        <button onClick={() => setPage("overview")} className="shrink-0">
          <KintsugiLogo />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_ITEMS.map(item => (
            <button key={item.id}
              onClick={() => setPage(item.id)}
              className="nav-pill-anim flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: page === item.id ? "#0B1220" : "transparent",
                color: page === item.id ? "#FFFFFF" : "#64748B",
                boxShadow: page === item.id ? "0 0 0 1px rgba(37,99,235,0.3)" : "none"
              }}>
              {item.id === "report" ? <Plus size={14} /> : null}
              {item.label}
              {page === item.id && item.id !== "report" && (
                <div className="w-1 h-1 rounded-full bg-[#2563EB]" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Location pill */}
          <button className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl glass-sm text-sm font-semibold text-[#0B0F19] hover:bg-[rgba(15,23,42,0.06)] transition-colors">
            <MapPin size={14} className="text-[#0B1220]" />
            <span className="hidden lg:inline">Indiranagar, Bengaluru</span>
            <ChevronDown size={13} className="text-[#64748B]" />
          </button>

          {/* Bell */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-9 h-9 rounded-xl glass-sm flex items-center justify-center text-[#64748B] hover:text-[#0B0F19] transition-colors"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E35D4F]" />
            </button>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #0B1220, #111827)", color: "#EFF6FF" }}
            >
              SJ
            </button>
            {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} setPage={setPage} />}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-[rgba(15,23,42,0.07)]">
        {NAV_ITEMS.slice(0, 5).map(item => (
          <button key={item.id}
            onClick={() => setPage(item.id)}
            className="flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-semibold transition-colors"
            style={{ color: page === item.id ? "#0B1220" : "#64748B" }}>
            <item.icon size={17} />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("overview");

  return (
    <div className="min-h-screen bg-[#05070B] bg-noise relative">
      <style>{STYLES}</style>

      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #0B1220 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #EFF6FF 0%, transparent 70%)", filter: "blur(60px)" }} />
        {/* Diagonal blue signal lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.025 }} preserveAspectRatio="xMidYMid slice">
          <line x1="0" y1="200" x2="400" y2="600" stroke="#2563EB" strokeWidth="1.5" />
          <line x1="200" y1="0" x2="900" y2="700" stroke="#2563EB" strokeWidth="1" />
          <line x1="600" y1="100" x2="1200" y2="800" stroke="#2563EB" strokeWidth="1.2" />
          <line x1="1000" y1="0" x2="1600" y2="600" stroke="#2563EB" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="relative z-10">
        <Navbar page={page} setPage={setPage} />
        <main className="overflow-y-auto" style={{ minHeight: "calc(100vh - 64px)" }}>
          {page === "overview" && <OverviewPage setPage={setPage} />}
          {page === "map" && <LiveMapPage />}
          {page === "report" && <ReportIssuePage />}
          {page === "community" && <CommunityPage />}
          {page === "impact" && <ImpactPage />}
          {page === "rewards" && <RewardsPage />}
          {page === "admin" && <AdminPage />}
        </main>
      </div>

      <AIAssistant />
    </div>
  );
}



