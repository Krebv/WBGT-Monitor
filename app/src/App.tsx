import { useState, useEffect, useCallback } from 'react';
import { TemperatureSelector } from '@/components/TemperatureSelector';
import { MeasureCard } from '@/components/MeasureCard';
import { RiskIndicator } from '@/components/RiskIndicator';
import { QuickReference } from '@/components/QuickReference';
import { getRangeForTemperature } from '@/data/wbgtData';
import { useWBGTData } from '@/hooks/useWBGTData';
import { woodlandsStation } from '@/data/stations';
import { Shield, Info, ExternalLink, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

function App() {
  const [temperature, setTemperature] = useState<number>(30);
  const [currentRange, setCurrentRange] = useState(getRangeForTemperature(30));
  const [selectedStationId, setSelectedStationId] = useState<string>(woodlandsStation.id);
  const [useLiveData, setUseLiveData] = useState<boolean>(true);
  
  const { 
    loading, 
    error, 
    lastFetched, 
    fetchData, 
    getReadingForStation 
  } = useWBGTData();

  const liveReading = getReadingForStation(selectedStationId);

  // Update temperature when live data changes
  useEffect(() => {
    if (useLiveData && liveReading) {
      setTemperature(liveReading.wbgt);
    }
  }, [liveReading, useLiveData]);

  // Update current range when temperature changes
  useEffect(() => {
    setCurrentRange(getRangeForTemperature(temperature));
  }, [temperature]);

  const handleToggleLiveData = useCallback((useLive: boolean) => {
    setUseLiveData(useLive);
    if (useLive && liveReading) {
      setTemperature(liveReading.wbgt);
    }
  }, [liveReading]);

  const handleSelectStation = useCallback((stationId: string) => {
    setSelectedStationId(stationId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">WBGT Heat Stress Safety Tool</h1>
              <p className="text-sm text-gray-500">Singapore Workplace Safety Guidelines</p>
            </div>
            <div className="flex items-center gap-2">
              {useLiveData ? (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  <Wifi className="w-3 h-3" /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  <WifiOff className="w-3 h-3" /> Manual
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Error Alert */}
        {error && useLiveData && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to fetch live data: {error}</span>
              <Button variant="outline" size="sm" onClick={() => setUseLiveData(false)}>
                Switch to Manual
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Temperature Selector Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">1</span>
            WBGT Temperature
          </h2>
          <TemperatureSelector 
            value={temperature} 
            onChange={setTemperature}
            liveReading={liveReading}
            selectedStationId={selectedStationId}
            onSelectStation={handleSelectStation}
            onRefresh={fetchData}
            isRefreshing={loading}
            lastUpdated={lastFetched}
            useLiveData={useLiveData}
            onToggleLiveData={handleToggleLiveData}
          />
        </section>

        {/* Risk Level & Measures Section */}
        {currentRange && (
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">2</span>
              Required Safety Measures
            </h2>
            
            <RiskIndicator range={currentRange} />

            <div className="space-y-4">
              {currentRange.measures.map((measure, index) => (
                <MeasureCard 
                  key={index}
                  measure={measure}
                  riskLevel={currentRange.riskLevel}
                />
              ))}
            </div>
          </section>
        )}

        {/* Quick Reference */}
        <QuickReference />

        {/* Info Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">About WBGT</h3>
              <p className="text-sm text-gray-600 mb-3">
                Wet Bulb Globe Temperature (WBGT) is a composite temperature used to estimate the effect of 
                temperature, humidity, wind speed, and solar radiation on humans. It is used as a guide 
                for managing heat stress in outdoor workplaces.
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Live data is sourced from the National Environment Agency (NEA) and updates every 15 minutes. 
                Woodlands station (S125) is selected by default.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <a 
                    href="https://www.mom.gov.sg/workplace-safety-and-health/wsh-regulations/approved-codes-of-practice" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    MOM Guidelines <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <a 
                    href="https://www.weather.gov.sg/heat-stress/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    NEA Heat Stress <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pb-6">
          <p>Based on Singapore Ministry of Manpower Workplace Safety Guidelines</p>
          <p className="mt-1">Data source: data.gov.sg (NEA) | Always follow on-site safety officer instructions</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
