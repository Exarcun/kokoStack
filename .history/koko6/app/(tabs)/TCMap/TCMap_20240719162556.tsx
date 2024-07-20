import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
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
        
        {/* Regions will be added here */}
      </Svg>
    </View>
  );
};

export default TCMap;