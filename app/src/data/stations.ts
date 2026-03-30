export interface Station {
  id: string;
  name: string;
  townCenter: string;
  latitude: string;
  longitude: string;
}

export const stations: Station[] = [
  { id: 'S124', name: 'Upper Changi Road North', townCenter: 'Changi Meteorological Station', latitude: '1.367770', longitude: '103.982262' },
  { id: 'S125', name: 'Woodlands Street 13', townCenter: 'Woodlands Stadium', latitude: '1.433789', longitude: '103.780731' },
  { id: 'S126', name: 'Old Chua Chu Kang Road', townCenter: 'Old Choa Chu Kang Road', latitude: '1.372566', longitude: '103.724358' },
  { id: 'S127', name: 'Stadium Road', townCenter: 'Kallang Practice Track', latitude: '1.305738', longitude: '103.878174' },
  { id: 'S128', name: 'Bishan Street', townCenter: 'Bishan Stadium', latitude: '1.354825', longitude: '103.852219' },
  { id: 'S129', name: 'Bedok North Street 2', townCenter: 'Bedok Stadium', latitude: '1.325746', longitude: '103.939691' },
  { id: 'S130', name: 'West Coast Road', townCenter: 'Clementi Stadium', latitude: '1.310524', longitude: '103.763426' },
  { id: 'S132', name: 'Jurong West Street 93', townCenter: 'Jurong West Stadium', latitude: '1.337859', longitude: '103.695383' },
  { id: 'S137', name: 'Sakra Road', townCenter: 'Sakra Road (Jurong Island)', latitude: '1.257100', longitude: '103.698000' },
  { id: 'S139', name: 'Tuas Terminal Gateway', townCenter: 'Tuas Terminal Gateway', latitude: '1.263757', longitude: '103.616417' },
  { id: 'S140', name: 'Choa Chu Kang Stadium', townCenter: 'Choa Chu Kang Stadium', latitude: '1.390524', longitude: '103.749664' },
  { id: 'S141', name: 'Yio Chu Kang Stadium', townCenter: 'Yio Chu Kang Stadium', latitude: '1.382564', longitude: '103.846190' },
  { id: 'S142', name: 'Sentosa Palawan Green', townCenter: 'Palawan Green (Sentosa)', latitude: '1.249504', longitude: '103.819178' },
  { id: 'S143', name: 'Punggol North', townCenter: 'Punggol North', latitude: '1.410469', longitude: '103.904965' },
  { id: 'S144', name: 'Upper Pickering Street', townCenter: 'Hong Lim Park', latitude: '1.286011', longitude: '103.846989' },
  { id: 'S149', name: 'Tampines Walk', townCenter: 'Tampines Central Park', latitude: '1.353835', longitude: '103.938823' },
  { id: 'S150', name: 'Evans Road', townCenter: 'MOE (Evans) Stadium', latitude: '1.321182', longitude: '103.819737' },
  { id: 'S153', name: 'Bukit Batok Street 22', townCenter: 'Bukit Batok Swimming Complex', latitude: '1.344713', longitude: '103.749078' },
  { id: 'S184', name: 'Sengkang East Avenue', townCenter: 'Sengkang East Avenue', latitude: '1.382559', longitude: '103.898526' },
  { id: 'S187', name: 'Bukit Timah (West)', townCenter: 'Coronation Road', latitude: '1.322506', longitude: '103.801390' },
];

export const getStationById = (id: string): Station | undefined => {
  return stations.find(s => s.id === id);
};

export const woodlandsStation = stations.find(s => s.id === 'S125')!;
