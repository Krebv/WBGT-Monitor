import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import type { Measure } from '@/data/wbgtData';

interface MeasureCardProps {
  measure: Measure;
  riskLevel: string;
}

export function MeasureCard({ measure, riskLevel }: MeasureCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getIcon = () => {
    switch (measure.title.toLowerCase()) {
      case 'acclimatise':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'monitor wbgt':
        return <Info className="w-5 h-5" />;
      case 'drink':
        return <span className="text-lg">💧</span>;
      case 'reschedule':
        return <span className="text-lg">📅</span>;
      case 'rest & shade':
        return <span className="text-lg">⛱️</span>;
      case 'emergency response':
        return <AlertCircle className="w-5 h-5" />;
      case 'monitor worker':
        return <span className="text-lg">👥</span>;
      case 'ventilation':
        return <span className="text-lg">💨</span>;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const getBorderColor = () => {
    switch (riskLevel) {
      case 'low':
        return 'border-l-green-500';
      case 'moderate':
        return 'border-l-yellow-500';
      case 'high':
        return 'border-l-orange-500';
      case 'extreme':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getHeaderColor = () => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-50 text-green-800';
      case 'moderate':
        return 'bg-yellow-50 text-yellow-800';
      case 'high':
        return 'bg-orange-50 text-orange-800';
      case 'extreme':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <Card className={`border-l-4 ${getBorderColor()} overflow-hidden transition-all duration-300 hover:shadow-md`}>
      <CardHeader 
        className={`p-4 ${getHeaderColor()} cursor-pointer transition-colors`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/80 shadow-sm">
              {getIcon()}
            </div>
            <CardTitle className="text-lg font-semibold">{measure.title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-4 pt-3">
          <p className="text-gray-700 font-medium mb-2">{measure.requirement}</p>
          {measure.details && measure.details.length > 0 && (
            <ul className="space-y-1 mt-3">
              {measure.details.map((detail, idx) => (
                <li key={idx} className="text-sm text-gray-600 pl-4 relative">
                  <span className="absolute left-0 text-gray-400">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  );
}
