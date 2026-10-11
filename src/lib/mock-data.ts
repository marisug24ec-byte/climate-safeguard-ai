// Mock data generator simulating backend API responses

const CITIES: Record<string, { lat: number; lon: number; baseTemp: number }> = {
  Delhi: { lat: 28.61, lon: 77.23, baseTemp: 35 },
  Mumbai: { lat: 19.08, lon: 72.88, baseTemp: 30 },
  Chennai: { lat: 13.08, lon: 80.27, baseTemp: 32 },
  Bangalore: { lat: 12.97, lon: 77.59, baseTemp: 26 },
  Kolkata: { lat: 22.57, lon: 88.36, baseTemp: 31 },
  Hyderabad: { lat: 17.39, lon: 78.49, baseTemp: 33 },
  Pune: { lat: 18.52, lon: 73.86, baseTemp: 28 },
  Ahmedabad: { lat: 23.02, lon: 72.57, baseTemp: 34 },
  Jaipur: { lat: 26.91, lon: 75.79, baseTemp: 33 },
  Lucknow: { lat: 26.85, lon: 80.95, baseTemp: 32 },
};

const CONDITIONS = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Rain', 'Thunderstorm', 'Haze', 'Fog'];

function vary(base: number, range: number) {
  return +(base + (Math.random() - 0.5) * range).toFixed(1);
}

function randomCondition() {
  return CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
}

function generateTimestamp() {
  return new Date().toISOString();
}

function generate24hData(base: number, range: number) {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() - (23 - i) * 3600000);
    return {
      time: hour.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      value: vary(base + Math.sin(i / 3) * 3, range),
    };
  });
}

export function getClimateData(city: string) {
  const cityData = CITIES[city] || CITIES.Delhi;
  const bt = cityData.baseTemp;
  const condition = randomCondition();

  const localTemp = vary(bt, 2);
  const stationTemp = vary(bt, 1.5);
  const satelliteTemp = vary(bt, 2.5);
  const aiTemp = +((localTemp * 0.3 + stationTemp * 0.4 + satelliteTemp * 0.3)).toFixed(1);

  const humidity = vary(55, 20);
  const pressure = vary(1013, 10);
  const wind = vary(12, 8);
  const aqi = Math.floor(vary(120, 100));

  const local = {
    temp: localTemp,
    humidity: vary(humidity, 5),
    pressure: vary(pressure, 3),
    wind: vary(wind, 3),
    condition,
    timestamp: generateTimestamp(),
    source: 'IoT Ground Network',
    accuracy: 'Real-time',
  };

  const station = {
    temp: stationTemp,
    humidity: vary(humidity, 3),
    pressure: vary(pressure, 2),
    wind: vary(wind, 2),
    condition,
    timestamp: generateTimestamp(),
    source: 'IMD Official Station',
    accuracy: 'Verified',
    station_id: `IMD-${city.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
  };

  const satellite = {
    temp: satelliteTemp,
    humidity: vary(humidity, 8),
    pressure: vary(pressure, 5),
    wind: vary(wind, 4),
    condition,
    timestamp: generateTimestamp(),
    source: 'NOAA/OpenWeather Satellite',
    accuracy: 'Satellite Feed',
  };

  const variance = +Math.abs(localTemp - stationTemp).toFixed(1);

  const ai_prediction = {
    temp: aiTemp,
    condition,
    confidence: Math.floor(vary(92, 8)),
    variance,
    weights: { local: 30, station: 40, satellite: 30 },
    next3h: {
      temp: vary(aiTemp, 2),
      condition: randomCondition(),
    },
  };

  const risk_alerts = [];
  if (bt > 38) risk_alerts.push({ type: 'heatwave', message: `Temperature > ${Math.round(bt)}°C predicted`, severity: 'high' });
  if (humidity > 60) risk_alerts.push({ type: 'rain', message: 'Precipitation probability > 70%', severity: 'medium' });
  if (aqi > 150) risk_alerts.push({ type: 'pollution', message: `AQI ${aqi} - Unhealthy`, severity: 'high' });
  if (wind > 18) risk_alerts.push({ type: 'storm', message: `Wind speed ${wind.toFixed(0)} km/h`, severity: 'medium' });
  if (risk_alerts.length === 0) risk_alerts.push({ type: 'clear', message: 'All clear - Normal conditions', severity: 'low' });

  const temp24hLocal = generate24hData(bt, 3);
  const temp24hStation = generate24hData(bt - 0.5, 2);
  const temp24hSatellite = generate24hData(bt + 0.3, 4);
  const temp24hAI = generate24hData(aiTemp, 1);

  const charts = {
    temperature_24h: temp24hLocal.map((d, i) => ({
      time: d.time,
      local: d.value,
      station: temp24hStation[i].value,
      satellite: temp24hSatellite[i].value,
      ai: temp24hAI[i].value,
    })),
    humidity_24h: generate24hData(humidity, 10),
    aqi_current: [
      { source: 'Local', value: Math.floor(vary(aqi, 20)), fill: 'hsl(160, 84%, 39%)' },
      { source: 'Station', value: Math.floor(vary(aqi, 15)), fill: 'hsl(38, 92%, 50%)' },
      { source: 'Satellite', value: Math.floor(vary(aqi, 25)), fill: 'hsl(217, 91%, 60%)' },
    ],
  };

  const hash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const prevHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const verification = {
    status: 'pending' as const,
    data_hash: hash,
    previous_hash: prevHash,
    tx_id: null as string | null,
    block_number: null as number | null,
    gas_used: null as string | null,
    timestamp: generateTimestamp(),
  };

  const risks = {
    heatwave: { level: bt > 38 ? 'High' : bt > 32 ? 'Moderate' : 'Low', next24h: bt > 36 ? 'Elevated' : 'Stable', confidence: Math.floor(vary(88, 10)) },
    flood: { level: humidity > 65 ? 'Moderate' : 'Low', rainfall: vary(15, 20), drainageCapacity: 85, confidence: Math.floor(vary(82, 12)) },
    airQuality: { level: aqi > 150 ? 'Unhealthy' : aqi > 100 ? 'Moderate' : 'Good', aqi, prediction12h: Math.floor(vary(aqi, 30)), confidence: Math.floor(vary(85, 10)) },
    storm: { level: wind > 18 ? 'Moderate' : 'Low', windPrediction: vary(wind, 5), pressureDrop: vary(0, 5), confidence: Math.floor(vary(90, 8)) },
  };

  return { city, local, station, satellite, ai_prediction, risk_alerts, charts, verification, risks, cityData };
}

export function generateVerificationHistory() {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    dataHash: '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    status: i === 0 ? 'Pending' : Math.random() > 0.1 ? 'Verified' : 'Flagged',
    txId: i === 0 ? 'Pending...' : '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...',
  }));
}

export const CITY_LIST = Object.keys(CITIES);
