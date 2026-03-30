import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Thermometer, Minus, Plus, Radio, Edit3 } from 'lucide-react';
import { StationSelector } from './StationSelector';
import type { WBGTReading } from '@/hooks/useWBGTData';

interface TemperatureSelectorProps {
  value: number;
  onChange: (value: number) => void;
  liveReading?: WBGTReading | null;
  selectedStationId: string;
  onSelectStation: (stationId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
  useLiveData: boolean;
  onToggleLiveData: (useLive: boolean) => void;
}

export function TemperatureSelector({ 
  value, 
  onChange, 
  liveReading,
  selectedStationId,
  onSelectStation,
  onRefresh,
  isRefreshing,
  lastUpdated,
  useLiveData,
  onToggleLiveData,
}: TemperatureSelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= 25 && numValue <= 40) {
      onChange(numValue);
      onToggleLiveData(false);
    }
  };

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
    onToggleLiveData(false);
  };

  const decrement = () => {
    const newValue = Math.max(25, value - 0.5);
    onChange(newValue);
    onToggleLiveData(false);
  };

  const increment = () => {
    const newValue = Math.min(40, value + 0.5);
    onChange(newValue);
    onToggleLiveData(false);
  };

  const getTemperatureColor = (temp: number): string => {
    if (temp < 31) return 'text-green-600';
    if (temp < 32) return 'text-yellow-600';
    if (temp < 33) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBgColor = (temp: number): string => {
    if (temp < 31) return 'bg-green-100';
    if (temp < 32) return 'bg-yellow-100';
    if (temp < 33) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getHeatStressBadgeColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-200 text-green-800';
      case 'moderate':
        return 'bg-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={useLiveData ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggleLiveData(true)}
          className="flex-1"
        >
          <Radio className="w-4 h-4 mr-2" />
          Live Data
        </Button>
        <Button
          variant={!useLiveData ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggleLiveData(false)}
          className="flex-1"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Manual Entry
        </Button>
      </div>

      {/* Station Selector (only in live mode) */}
      {useLiveData && (
        <StationSelector
          selectedStationId={selectedStationId}
          onSelectStation={onSelectStation}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          lastUpdated={lastUpdated}
        />
      )}

      {/* Temperature Display */}
      <div className={`rounded-2xl ${getBgColor(value)} p-6 text-center transition-colors duration-300`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Thermometer className={`w-8 h-8 ${getTemperatureColor(value)}`} />
          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {useLiveData ? 'Live WBGT Reading' : 'Manual WBGT Entry'}
          </span>
        </div>
        <div className={`text-6xl font-bold ${getTemperatureColor(value)} transition-colors duration-300`}>
          {value.toFixed(1)}
          <span className="text-3xl ml-1">°C</span>
        </div>
        {liveReading && useLiveData && (
          <div className="mt-3">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHeatStressBadgeColor(liveReading.heatStress)}`}>
              {liveReading.heatStress} Heat Stress
            </span>
          </div>
        )}
      </div>

      {/* Manual Controls */}
      {!useLiveData && (
        <>
          {/* Quick Select Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { onChange(28); onToggleLiveData(false); }}
              className="text-xs border-green-300 hover:bg-green-50"
            >
              28°C
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { onChange(31); onToggleLiveData(false); }}
              className="text-xs border-yellow-300 hover:bg-yellow-50"
            >
              31°C
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { onChange(32); onToggleLiveData(false); }}
              className="text-xs border-orange-300 hover:bg-orange-50"
            >
              32°C
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { onChange(33); onToggleLiveData(false); }}
              className="text-xs border-red-300 hover:bg-red-50"
            >
              33°C
            </Button>
          </div>

          {/* Slider Control */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrement}
                className="shrink-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="flex-1">
                <Slider
                  value={[value]}
                  onValueChange={handleSliderChange}
                  min={25}
                  max={40}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>25°C</span>
                  <span>31°C</span>
                  <span>33°C</span>
                  <span>40°C</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={increment}
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Direct Input */}
          <div className="flex items-center gap-3 justify-center">
            <span className="text-sm text-gray-600">Enter exact value:</span>
            <Input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              min={25}
              max={40}
              step={0.1}
              className="w-24 text-center"
            />
            <span className="text-gray-600">°C</span>
          </div>
        </>
      )}
    </div>
  );
}
