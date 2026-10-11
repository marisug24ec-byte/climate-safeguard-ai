import { Link } from 'react-router-dom';
import { Globe, Satellite, Brain, Shield, ArrowRight, Activity } from 'lucide-react';
import { useClimate } from '@/context/ClimateContext';
import { format } from 'date-fns';

const FEATURES = [
  {
    icon: Satellite,
    title: 'Multi-Source Data',
    desc: 'Aggregates local IoT sensors, IMD weather stations, and NOAA satellite feeds for comprehensive coverage.',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: Brain,
    title: 'AI Prediction Engine',
    desc: 'Machine learning algorithms cross-reference 3 data sources for superior weather accuracy.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Blockchain Verification',
    desc: 'Immutable climate records stored on-chain ensuring tamper-proof environmental data.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
];

export default function HomePage() {
  const { connected, lastUpdated } = useClimate();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-info/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 pt-20 pb-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 text-xs font-medium text-primary">
              <Activity className="w-3 h-3" />
              AI-Powered Climate Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight">
              <span className="gradient-text">ClimateForge</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real-time environmental monitoring with blockchain verification.
              Multi-source data fusion powered by artificial intelligence.
            </p>
            <div className="pt-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:opacity-90 hover:gap-3 shadow-lg shadow-primary/25"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-card-hover p-6 space-y-4">
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold font-display">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`status-dot ${connected ? 'bg-safe' : 'bg-danger'}`} />
              API Status: {connected ? 'Online' : 'Offline'}
            </div>
            <span>|</span>
            <span>Last update: {lastUpdated ? format(lastUpdated, 'HH:mm:ss') : '—'}</span>
          </div>
          <span>© 2026 ClimateForge — Blockchain Secured AI Climate Sentinel</span>
        </div>
      </footer>
    </div>
  );
}
