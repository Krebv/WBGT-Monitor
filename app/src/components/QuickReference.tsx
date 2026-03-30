import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Thermometer } from 'lucide-react';
import { wbgtRanges } from '@/data/wbgtData';

export function QuickReference() {
  const [isExpanded, setIsExpanded] = useState(false);

  const getColorClass = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'high':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'extreme':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-800';
      case 'moderate':
        return 'text-yellow-800';
      case 'high':
        return 'text-orange-800';
      case 'extreme':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  const getBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-200 text-green-800';
      case 'moderate':
        return 'bg-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-orange-200 text-orange-800';
      case 'extreme':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <Card className="mt-6 border-gray-200">
      <CardHeader 
        className="p-4 bg-gray-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-base font-semibold text-gray-800">
              Quick Reference: All Temperature Ranges
            </CardTitle>
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
        <CardContent className="p-4">
          <div className="space-y-3">
            {wbgtRanges.map((range, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getColorClass(range.riskLevel)} transition-colors cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold ${getTextColor(range.riskLevel)}`}>
                    {range.label}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColor(range.riskLevel)}`}>
                    {range.riskLevel.charAt(0).toUpperCase() + range.riskLevel.slice(1)} Risk
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Key measures:</span>{' '}
                  {range.measures.slice(0, 3).map(m => m.title).join(', ')}
                  {range.measures.length > 3 && ` +${range.measures.length - 3} more`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
