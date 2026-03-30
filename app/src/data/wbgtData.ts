export interface Measure {
  title: string;
  requirement: string;
  details?: string[];
}

export interface WBGTRange {
  min: number;
  max: number;
  label: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  color: string;
  bgColor: string;
  borderColor: string;
  measures: Measure[];
}

export const wbgtRanges: WBGTRange[] = [
  {
    min: 0,
    max: 31,
    label: 'Below 31°C',
    riskLevel: 'low',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    measures: [
      {
        title: 'Acclimatise',
        requirement: 'Acclimatise workers new to Singapore or returning from prolonged leave of more than a week.',
        details: [
          'Gradually increase workers\' daily heat exposure over at least 7 days'
        ]
      },
      {
        title: 'Monitor WBGT',
        requirement: 'Monitor WBGT every hour during work hours, especially during hotter periods.',
        details: [
          'On-site WBGT meters required for:',
          '• Construction sites with contract sum of $5 million or more',
          '• Shipyards',
          '• Process industry',
          'For other workplaces, refer to NEA\'s myENV app'
        ]
      },
      {
        title: 'Drink',
        requirement: 'Ensure workers rehydrate regularly.',
        details: [
          'Provide cool or cold drinking water supply near work areas'
        ]
      },
      {
        title: 'Rest & Shade',
        requirement: 'Ensure workers get adequate rest under shade for recovery from heat.',
        details: [
          'Provide rest areas near work areas, where feasible'
        ]
      },
      {
        title: 'Emergency Response',
        requirement: 'Establish emergency response plan and implement reporting procedures.',
        details: []
      },
      {
        title: 'Monitor Worker',
        requirement: 'Identify workers vulnerable to heat stress and make re-deployment arrangements where required.',
        details: []
      }
    ]
  },
  {
    min: 31,
    max: 32,
    label: '31°C to below 32°C',
    riskLevel: 'moderate',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    measures: [
      {
        title: 'Acclimatise',
        requirement: 'Acclimatise workers new to Singapore or returning from prolonged leave of more than a week.',
        details: [
          'Gradually increase workers\' daily heat exposure over at least 7 days'
        ]
      },
      {
        title: 'Monitor WBGT',
        requirement: 'Monitor WBGT every hour during work hours, especially during hotter periods.',
        details: [
          'On-site WBGT meters required for:',
          '• Construction sites with contract sum of $5 million or more',
          '• Shipyards',
          '• Process industry',
          'For other workplaces, refer to NEA\'s myENV app'
        ]
      },
      {
        title: 'Drink',
        requirement: 'Ensure workers rehydrate at least hourly.',
        details: [
          'Recommended intake: 300ml per hour or more depending on work intensity',
          'Provide cool or cold drinking water supply near work areas'
        ]
      },
      {
        title: 'Reschedule',
        requirement: 'Reschedule outdoor physical work to cooler parts of the day where feasible.',
        details: []
      },
      {
        title: 'Rest & Shade',
        requirement: 'Ensure workers get adequate rest under shade for recovery from heat.',
        details: [
          'Rest areas to be provided near work areas, where feasible'
        ]
      },
      {
        title: 'Emergency Response',
        requirement: 'Establish emergency response plan and implement reporting procedures.',
        details: []
      },
      {
        title: 'Monitor Worker',
        requirement: 'Identify workers vulnerable to heat stress and make re-deployment arrangements where required.',
        details: [
          'Close monitoring of worker\'s health condition, particularly for vulnerable workers',
          'Implement a buddy system - workers should look out for each other'
        ]
      },
      {
        title: 'Ventilation',
        requirement: 'Provide workers with cool rest and work areas.',
        details: [
          'Use fans, air coolers, etc.',
          'Provide loose-fitting and light-coloured clothing'
        ]
      }
    ]
  },
  {
    min: 32,
    max: 33,
    label: '32°C to below 33°C',
    riskLevel: 'high',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    measures: [
      {
        title: 'Acclimatise',
        requirement: 'Acclimatise workers new to Singapore or returning from prolonged leave of more than a week.',
        details: [
          'Gradually increase workers\' daily heat exposure over at least 7 days'
        ]
      },
      {
        title: 'Monitor WBGT',
        requirement: 'Monitor WBGT every hour during work hours, especially during hotter periods.',
        details: [
          'On-site WBGT meters required for:',
          '• Construction sites with contract sum of $5 million or more',
          '• Shipyards',
          '• Process industry',
          'For other workplaces, refer to NEA\'s myENV app'
        ]
      },
      {
        title: 'Drink',
        requirement: 'Ensure workers rehydrate at least hourly.',
        details: [
          'Recommended intake: 300ml per hour or more depending on work intensity',
          'Provide cool or cold drinking water supply near work areas'
        ]
      },
      {
        title: 'Reschedule',
        requirement: 'Reschedule outdoor physical work to cooler parts of the day where feasible.',
        details: []
      },
      {
        title: 'Rest & Shade',
        requirement: 'Provide hourly rest breaks of a minimum of 10 minutes for heavy physical work activity.',
        details: [
          'Rest areas to be provided near work areas, where feasible'
        ]
      },
      {
        title: 'Emergency Response',
        requirement: 'Establish emergency response plan and implement reporting procedures.',
        details: []
      },
      {
        title: 'Monitor Worker',
        requirement: 'Identify workers vulnerable to heat stress and make re-deployment arrangements where required.',
        details: [
          'Close monitoring of worker\'s health condition, particularly for vulnerable workers',
          'Implement a buddy system - workers should look out for each other'
        ]
      },
      {
        title: 'Ventilation',
        requirement: 'Provide workers with cool rest and work areas.',
        details: [
          'Use fans, air coolers, etc.',
          'Provide loose-fitting and light-coloured clothing'
        ]
      }
    ]
  },
  {
    min: 33,
    max: 50,
    label: '33°C and above',
    riskLevel: 'extreme',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    measures: [
      {
        title: 'Acclimatise',
        requirement: 'Acclimatise workers new to Singapore or returning from prolonged leave of more than a week.',
        details: [
          'Gradually increase workers\' daily heat exposure over at least 7 days'
        ]
      },
      {
        title: 'Monitor WBGT',
        requirement: 'Monitor WBGT every hour during work hours, especially during hotter periods.',
        details: [
          'On-site WBGT meters required for:',
          '• Construction sites with contract sum of $5 million or more',
          '• Shipyards',
          '• Process industry',
          'For other workplaces, refer to NEA\'s myENV app'
        ]
      },
      {
        title: 'Drink',
        requirement: 'Ensure workers rehydrate at least hourly.',
        details: [
          'Recommended intake: 300ml per hour or more depending on work intensity',
          'Provide cool or cold drinking water supply near work areas'
        ]
      },
      {
        title: 'Reschedule',
        requirement: 'Reschedule outdoor physical work to cooler parts of the day, where feasible.',
        details: []
      },
      {
        title: 'Rest & Shade',
        requirement: 'Provide hourly rest breaks of a minimum of 15 minutes for heavy physical work activity.',
        details: [
          'Longer rest periods as WBGT increases',
          'Rest areas to be provided near work areas, where feasible'
        ]
      },
      {
        title: 'Emergency Response',
        requirement: 'Establish emergency response plan and implement reporting procedures.',
        details: [
          'Standby cold water, ice packs, water spray and cooler boxes for emergencies'
        ]
      },
      {
        title: 'Monitor Worker',
        requirement: 'Close monitoring of worker\'s health condition, particularly for vulnerable workers.',
        details: [
          'Implement a buddy system - workers to look out for each other',
          'Redeploy vulnerable workers to non-outdoor work'
        ]
      },
      {
        title: 'Ventilation',
        requirement: 'Provide workers with cool rest and work areas.',
        details: [
          'Use fans, air coolers, etc.',
          'Provide loose-fitting and light-coloured clothing'
        ]
      }
    ]
  }
];

export const getRangeForTemperature = (temp: number): WBGTRange | null => {
  for (const range of wbgtRanges) {
    if (temp >= range.min && temp < range.max) {
      return range;
    }
  }
  if (temp >= 33) {
    return wbgtRanges[3];
  }
  return null;
};

export const riskLevelInfo = {
  low: {
    label: 'Low Risk',
    description: 'Standard heat stress precautions apply',
    icon: '✓'
  },
  moderate: {
    label: 'Moderate Risk',
    description: 'Enhanced precautions required',
    icon: '⚠'
  },
  high: {
    label: 'High Risk',
    description: 'Mandatory rest breaks required',
    icon: '⚠'
  },
  extreme: {
    label: 'Extreme Risk',
    description: 'Maximum precautions - consider work stoppage',
    icon: '🚨'
  }
};
