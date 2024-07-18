import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width="100%" height={38} viewBox="0 0 170 38" fill="none" {...props}>
    <Path
      d="M170 19.2422C170 29.6018 131.944 38 85 38C38.0558 38 0 29.6018 0 19.2422C0 8.88253 38.0558 0.484375 85 0.484375C131.944 0.484375 170 8.88253 170 19.2422Z"
      fill="#3C1E1C"
    />
    <Rect x="60.6299" y="16.1162" width="43.986" height="7.03418" fill="#D9D9D9" />
    <Rect x="77.2725" y="6.7373" width="10.6993" height="25.792" fill="#D9D9D9" />
  </Svg>
);

export default SvgComponent;
