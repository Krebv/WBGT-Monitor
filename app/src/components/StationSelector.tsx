import { Check, ChevronDown, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { stations, woodlandsStation } from '@/data/stations';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StationSelectorProps {
  selectedStationId: string;
  onSelectStation: (stationId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
}

export function StationSelector({ 
  selectedStationId, 
  onSelectStation, 
  onRefresh,
  isRefreshing,
  lastUpdated,
}: StationSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const selectedStation = stations.find(s => s.id === selectedStationId);

  const formatLastUpdated = (date: Date | null | undefined) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-SG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="truncate">
                  {selectedStation ? selectedStation.townCenter : 'Select station...'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search station..." />
              <CommandList>
                <CommandEmpty>No station found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    key={woodlandsStation.id}
                    value={woodlandsStation.id}
                    onSelect={() => {
                      onSelectStation(woodlandsStation.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedStationId === woodlandsStation.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{woodlandsStation.townCenter}</span>
                      <span className="text-xs text-gray-500">{woodlandsStation.name} (Woodlands)</span>
                    </div>
                  </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Other Stations">
                  {stations
                    .filter(s => s.id !== 'S125')
                    .map(station => (
                      <CommandItem
                        key={station.id}
                        value={station.id}
                        onSelect={() => {
                          onSelectStation(station.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedStationId === station.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{station.townCenter}</span>
                          <span className="text-xs text-gray-500">{station.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh data"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </Button>
        )}
      </div>
      
      {lastUpdated && (
        <p className="text-xs text-gray-500 text-right">
          Last updated: {formatLastUpdated(lastUpdated)}
        </p>
      )}
    </div>
  );
}
