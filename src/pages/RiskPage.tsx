import { useClimate } from '@/context/ClimateContext';
import { Thermometer, CloudRain, Wind, ShieldAlert, Brain, Database, TrendingUp, Info } from 'lucide-react';

function RiskCard({ icon: Icon, title, level, next24h, confidence, details, color }: any) {
  const levelColors: Record<string, string> = {
    Low: 'text-safe border-safe/30 bg-safe/10',
    Moderate: 'text-warning border-warning/30 bg-warning/10',
    High: 'text-danger border-danger/30 bg-danger/10',
    Extreme: 'text-danger border-danger/50 bg-danger/20',
    Good: 'text-safe border-safe/30 bg-safe/10',
    Unhealthy: 'text-danger border-danger/30 bg-danger/10',
    Stable: 'text-safe border-safe/30 bg-safe/10',
    Elevated: 'text-warning border-warning/30 bg-warning/10',
  };

  return (
    <div className="glass-card-hover p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <h3 className="font-display font-bold text-lg">{title}</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Risk</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${levelColors[level] || 'text-muted-foreground'}`}>{level}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Next 24h</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${levelColors[next24h] || 'text-muted-foreground'}`}>{next24h}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">AI Confidence</span>
          <span className="text-sm font-semibold text-primary">{confidence}%</span>
        </div>
        {details && (
          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground space-y-1">
            {details.map((d: string, i: number) => (
              <div key={i}>• {d}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RiskPage() {
  const { data, loading, city } = useClimate();

  if (loading || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 h-52 animate-pulse">
              <div className="h-4 bg-secondary rounded w-1/2 mb-4" />
              <div className="h-3 bg-secondary rounded w-2/3 mb-2" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { risks } = data;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="section-title">Climate Risk Intelligence — <span className="gradient-text">{city}</span></h1>

      <div className="grid md:grid-cols-2 gap-5">
        <RiskCard
          icon={Thermometer}
          title="Heatwave Risk"
          level={risks.heatwave.level}
          next24h={risks.heatwave.next24h}
          confidence={risks.heatwave.confidence}
          color="text-danger"
          details={[`Base temp: ${data.ai_prediction.temp}°C`, 'Urban heat island factor applied']}
        />
        <RiskCard
          icon={CloudRain}
          title="Flood Risk"
          level={risks.flood.level}
          next24h={risks.flood.rainfall > 20 ? 'Elevated' : 'Stable'}
          confidence={risks.flood.confidence}
          color="text-info"
          details={[`Expected rainfall: ${risks.flood.rainfall.toFixed(1)}mm`, `Drainage capacity: ${risks.flood.drainageCapacity}%`]}
        />
        <RiskCard
          icon={ShieldAlert}
          title="Air Quality Risk"
          level={risks.airQuality.level}
          next24h={risks.airQuality.prediction12h > 150 ? 'Unhealthy' : risks.airQuality.prediction12h > 100 ? 'Moderate' : 'Good'}
          confidence={risks.airQuality.confidence}
          color="text-warning"
          details={[`Current AQI: ${risks.airQuality.aqi}`, `12h forecast: AQI ${risks.airQuality.prediction12h}`, 'Sensitive groups: masks recommended']}
        />
        <RiskCard
          icon={Wind}
          title="Storm / Extreme Weather"
          level={risks.storm.level}
          next24h={risks.storm.windPrediction > 18 ? 'Elevated' : 'Stable'}
          confidence={risks.storm.confidence}
          color="text-purple-400"
          details={[`Wind forecast: ${risks.storm.windPrediction.toFixed(1)} km/h`, `Pressure change: ${risks.storm.pressureDrop > 0 ? '+' : ''}${risks.storm.pressureDrop.toFixed(1)} hPa`]}
        />
      </div>

      {/* AI Model Explanation */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-lg">How We Predict</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Database className="w-4 h-4" /> Data Sources
            </div>
            <ul className="space-y-1 text-muted-foreground">
              <li>• IoT Ground Sensors (30% weight)</li>
              <li>• IMD Weather Stations (40% weight)</li>
              <li>• NOAA Satellite Feed (30% weight)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <TrendingUp className="w-4 h-4" /> Confidence Intervals
            </div>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Temperature: ±{data.ai_prediction.variance}°C</li>
              <li>• Humidity: ±5%</li>
              <li>• Wind Speed: ±3 km/h</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Info className="w-4 h-4" /> Model Info
            </div>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Algorithm: Ensemble (RF + LSTM)</li>
              <li>• Last training: 2026-03-12</li>
              <li>• Data points: 1.2M records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
