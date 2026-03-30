import { AlertTriangle, CheckCircle, AlertOctagon, Flame } from 'lucide-react';
import type { WBGTRange } from '@/data/wbgtData';
import { riskLevelInfo } from '@/data/wbgtData';

interface RiskIndicatorProps {
  range: WBGTRange;
}

export function RiskIndicator({ range }: RiskIndicatorProps) {
  const info = riskLevelInfo[range.riskLevel];

  const getIcon = () => {
    switch (range.riskLevel) {
      case 'low':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'moderate':
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      case 'high':
        return <AlertOctagon className="w-8 h-8 text-orange-600" />;
      case 'extreme':
        return <Flame className="w-8 h-8 text-red-600" />;
    }
  };

  const getBgColor = () => {
    switch (range.riskLevel) {
      case 'low':
        return 'bg-green-100 border-green-300';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-300';
      case 'high':
        return 'bg-orange-100 border-orange-300';
      case 'extreme':
        return 'bg-red-100 border-red-300';
    }
  };

  return (
    <div className={`rounded-xl border-2 ${getBgColor()} p-4 mb-6`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-full shadow-sm">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold" style={{ 
              color: range.riskLevel === 'low' ? '#16a34a' : 
                     range.riskLevel === 'moderate' ? '#ca8a04' :
                     range.riskLevel === 'high' ? '#ea580c' : '#dc2626'
            }}>
              {info.label}
            </span>
            <span className="text-lg">{info.icon}</span>
          </div>
          <p className="text-gray-700 text-sm">{info.description}</p>
          <p className="text-gray-500 text-xs mt-1">Temperature Range: <span className="font-semibold">{range.label}</span></p>
        </div>
      </div>
    </div>
  );
}
