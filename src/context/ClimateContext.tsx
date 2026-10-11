import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getClimateData, CITY_LIST } from '@/lib/mock-data';

type ClimateData = ReturnType<typeof getClimateData>;

interface ClimateContextType {
  city: string;
  setCity: (city: string) => void;
  data: ClimateData | null;
  loading: boolean;
  lastUpdated: Date | null;
  connected: boolean;
  refresh: () => void;
}

const ClimateContext = createContext<ClimateContextType | null>(null);

export function ClimateProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState('Delhi');
  const [data, setData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connected] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setData(getClimateData(city));
      setLastUpdated(new Date());
      setLoading(false);
    }, 600);
  }, [city]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <ClimateContext.Provider value={{ city, setCity, data, loading, lastUpdated, connected, refresh: fetchData }}>
      {children}
    </ClimateContext.Provider>
  );
}

export function useClimate() {
  const ctx = useContext(ClimateContext);
  if (!ctx) throw new Error('useClimate must be used within ClimateProvider');
  return ctx;
}

export { CITY_LIST };
