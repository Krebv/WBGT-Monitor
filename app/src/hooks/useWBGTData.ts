import { useState, useEffect, useCallback } from 'react';
import type { Station } from '@/data/stations';

export interface WBGTReading {
  station: Station;
  wbgt: number;
  heatStress: string;
}

export interface WBGTData {
  datetime: string;
  readings: WBGTReading[];
  updatedTimestamp: string;
}

interface ApiResponse {
  code: number;
  data?: {
    records: Array<{
      datetime: string;
      item: {
        isStationData: boolean;
        readings: Array<{
          station: {
            id: string;
            name: string;
            townCenter: string;
          };
          location?: {
            latitude: string;
            longitude: string;
          };
          wbgt: string;
          heatStress: string;
        }>;
        type: string;
      };
      updatedTimestamp: string;
    }>;
  };
  errorMsg?: string;
}

export function useWBGTData() {
  const [data, setData] = useState<WBGTData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api-open.data.gov.sg/v2/real-time/api/weather?api=wbgt');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.code !== 0 || !result.data) {
        throw new Error(result.errorMsg || 'Failed to fetch WBGT data');
      }
      
      const record = result.data.records[0];
      
      const readings: WBGTReading[] = record.item.readings.map(r => ({
        station: {
          id: r.station.id,
          name: r.station.name,
          townCenter: r.station.townCenter,
          latitude: r.location?.latitude || '',
          longitude: r.location?.longitude || '',
        },
        wbgt: parseFloat(r.wbgt),
        heatStress: r.heatStress,
      }));
      
      setData({
        datetime: record.datetime,
        readings,
        updatedTimestamp: record.updatedTimestamp,
      });
      
      setLastFetched(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount and every 15 minutes
  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 15 * 60 * 1000); // 15 minutes
    
    return () => clearInterval(interval);
  }, [fetchData]);

  const getReadingForStation = useCallback((stationId: string): WBGTReading | undefined => {
    return data?.readings.find(r => r.station.id === stationId);
  }, [data]);

  return {
    data,
    loading,
    error,
    lastFetched,
    fetchData,
    getReadingForStation,
  };
}
