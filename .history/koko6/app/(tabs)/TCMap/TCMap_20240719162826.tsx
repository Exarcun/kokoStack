import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import styles from './TCMapStyles';

const TCMap = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const handleRegionPress = (region: string) => {
    setActiveRegion(region === activeRegion ? null : region);
  };

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        {/* Simplified circular background */}
        <Circle cx="100" cy="100" r="98" fill="#E6E6E6" stroke="#CCCCCC" strokeWidth="4" />
        
        {/* Region 1 */}
        <TouchableOpacity onPress={() => handleRegionPress('region1')}>
          <Path
            d="M100 100 L100 2 A98 98 0 0 1 198 100 Z"
            fill={activeRegion === 'region1' ? '#FF6B6B' : '#FFD3D3'}
          />
        </TouchableOpacity>

        {/* Region 2 */}
        <TouchableOpacity onPress={() => handleRegionPress('region2')}>
          <Path
            d="M100 100 L198 100 A98 98 0 0 1 100 198 Z"
            fill={activeRegion === 'region2' ? '#4ECDC4' : '#C7F2ED'}
          />
        </TouchableOpacity>

        {/* Region 3 */}
        <TouchableOpacity onPress={() => handleRegionPress('region3')}>
          <Path
            d="M100 100 L100 198 A98 98 0 0 1 2 100 Z"
            fill={activeRegion === 'region3' ? '#45B7D1' : '#C5E7F1'}
          />
        </TouchableOpacity>

        {/* Region 4 */}
        <TouchableOpacity onPress={() => handleRegionPress('region4')}>
          <Path
            d="M100 100 L2 100 A98 98 0 0 1 100 2 Z"
            fill={activeRegion === 'region4' ? '#FFA07A' : '#FFD8C7'}
          />
        </TouchableOpacity>

        {/* Region 5 (Center) */}
        <TouchableOpacity onPress={() => handleRegionPress('region5')}>
          <Circle
            cx="100"
            cy="100"
            r="30"
            fill={activeRegion === 'region5' ? '#F9D56E' : '#FCE8B2'}
          />
        </TouchableOpacity>
      </Svg>
    </View>
  );
};

export default TCMap;