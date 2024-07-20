import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import styles from './TCMapStyles';

const TCMap = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const handleRegionPress = (region: string) => {
    setActiveRegion(region === activeRegion ? null : region);
  };

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 400 400">
        {/* Background will be added here */}
        {/* Region SVGs will be added here */}
      </Svg>
    </View>
  );
};

export default TCMap;