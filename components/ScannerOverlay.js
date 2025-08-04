// components/ScannerOverlay.js

import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const SCANNER_FRAME_SIZE = 250;
const BORDER_RADIUS = 20;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - SCANNER_FRAME_SIZE / 2,
    height / 2 - SCANNER_FRAME_SIZE / 2 - 80,
    SCANNER_FRAME_SIZE,
    SCANNER_FRAME_SIZE
  ),
  BORDER_RADIUS,
  BORDER_RADIUS
);

const ScannerOverlay = () => {
  return (
    <Canvas
      style={StyleSheet.absoluteFill}
    >
      <DiffRect 
        inner={inner} 
        outer={outer} 
        color="rgba(0, 0, 0, 0.6)" // Cor escura semi-transparente
      />
    </Canvas>
  );
};

export default ScannerOverlay;