import { useClimate } from '@/context/ClimateContext';
import { Radio, Building2, Satellite, Brain, AlertTriangle, CloudRain, Wind, Thermometer, Droplets, Gauge, Eye, TrendingUp, ShieldAlert, CloudLightning } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

function DataCard({ icon: Icon, title, source, accuracy, data, color }: any) {
  return (
    <div className="glass-card-hover p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="font-display font-bold text-lg">{title}</h3>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
          accuracy === 'Real-time' ? 'border-safe/30 text-safe bg-safe/10' :
          accuracy === 'Verified' ? 'border-info/30 text-info bg-info/10' :
          'border-warning/30 text-warning bg-warning/10'
        }`}>{accuracy}</span>
      </div>
      <div className="text-4xl font-bold font-display">{data.temp}°C</div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Droplets className="w-3.5 h-3.5" /> {data.humidity}%
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Gauge className="w-3.5 h-3.5" /> {data.pressure} hPa
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Wind className="w-3.5 h-3.5" /> {data.wind} km/h
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Eye className="w-3.5 h-3.5" /> {data.condition}
        </div>
      </div>
      <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground space-y-1">
        <div>Source: {source}</div>
        {data.station_id && <div>Station: {data.station_id}</div>}
        <div>Updated: {format(new Date(data.timestamp), 'HH:mm:ss')}</div>
      </div>
    </div>
  );
}

function AIPredictionPanel({ prediction }: any) {
  return (
    <div className="glass-card p-6 border-primary/20 space-y-5">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="font-display font-bold text-lg">AI Consensus Prediction</h3>
      </div>
      <div className="text-center space-y-2">
        <div className="text-5xl font-bold font-display gradient-text">{prediction.temp}°C</div>
        <div className="text-muted-foreground">{prediction.condition}</div>
        <div className="text-sm text-primary font-medium">AI Confidence: {prediction.confidence}%</div>
      </div>
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium mb-2">Data Fusion Weights</div>
        {Object.entries(prediction.weights).map(([key, val]: any) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16 capitalize">{key}</span>
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${val}%` }} />
            </div>
            <span className="text-xs text-foreground w-8">{val}%</span>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground space-y-1">
        <div>Variance: ±{prediction.variance}°C</div>
        <div>Next 3h: {prediction.next3h.temp}°C — {prediction.next3h.condition}</div>
      </div>
    </div>
  );
}

function AlertPanel({ alerts }: { alerts: any[] }) {
  const iconMap: Record<string, any> = {
    heatwave: Thermometer,
    rain: CloudRain,
    pollution: ShieldAlert,
    storm: CloudLightning,
    clear: Eye,
  };
  const colorMap: Record<string, string> = {
    high: 'border-danger/30 bg-danger/10 text-danger',
    medium: 'border-warning/30 bg-warning/10 text-warning',
    low: 'border-safe/30 bg-safe/10 text-safe',
  };

  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="font-display font-bold text-lg">Climate Risk Alerts</h3>
      </div>
      <div className="space-y-2">
        {alerts.map((a, i) => {
          const Icon = iconMap[a.type] || AlertTriangle;
          return (
            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${colorMap[a.severity]}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{a.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const chartTooltipStyle = {
  contentStyle: { backgroundColor: 'hsl(217, 33%, 17%)', border: '1px solid hsl(217, 33%, 25%)', borderRadius: '8px', fontSize: '12px' },
  labelStyle: { color: 'hsl(215, 20%, 55%)' },
};

export default function DashboardPage() {
  const { data, loading, city } = useClimate();

  if (loading || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 h-64 animate-pulse">
              <div className="h-4 bg-secondary rounded w-1/2 mb-4" />
              <div className="h-10 bg-secondary rounded w-1/3 mb-6" />
              <div className="space-y-2">
                <div className="h-3 bg-secondary rounded w-2/3" />
                <div className="h-3 bg-secondary rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="section-title">Climate Dashboard — <span className="gradient-text">{city}</span></h1>
      </div>

      {/* 3 data source cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <DataCard icon={Radio} title="Local Sensor" source={data.local.source} accuracy={data.local.accuracy} data={data.local} color="text-safe" />
        <DataCard icon={Building2} title="Weather Station" source={data.station.source} accuracy={data.station.accuracy} data={data.station} color="text-info" />
        <DataCard icon={Satellite} title="Satellite Data" source={data.satellite.source} accuracy={data.satellite.accuracy} data={data.satellite} color="text-warning" />
      </div>

      {/* AI Prediction + Alerts */}
      <div className="grid md:grid-cols-2 gap-5">
        <AIPredictionPanel prediction={data.ai_prediction} />
        <AlertPanel alerts={data.risk_alerts} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Temperature */}
        <div className="glass-card p-5 space-y-3">
          <h3 className="font-display font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Temperature 24h</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.charts.temperature_24h}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 25%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} interval={5} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} domain={['auto', 'auto']} />
              <Tooltip {...chartTooltipStyle} />
              <Line type="monotone" dataKey="local" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} name="Local" />
              <Line type="monotone" dataKey="station" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={false} name="Station" />
              <Line type="monotone" dataKey="satellite" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="Satellite" />
              <Line type="monotone" dataKey="ai" stroke="hsl(280, 70%, 60%)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="AI" />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity */}
        <div className="glass-card p-5 space-y-3">
          <h3 className="font-display font-bold flex items-center gap-2"><Droplets className="w-4 h-4 text-info" /> Humidity 24h</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.charts.humidity_24h}>
              <defs>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 25%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} interval={5} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip {...chartTooltipStyle} />
              <Area type="monotone" dataKey="value" stroke="hsl(217, 91%, 60%)" fill="url(#humGrad)" strokeWidth={2} name="Humidity %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AQI */}
        <div className="glass-card p-5 space-y-3">
          <h3 className="font-display font-bold flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-warning" /> Air Quality Index</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.charts.aqi_current}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 25%)" />
              <XAxis dataKey="source" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} name="AQI">
                {data.charts.aqi_current.map((entry: any, index: number) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
