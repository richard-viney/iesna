/**
 * Describes IES data that has been loaded from an IES document.
 */
export interface IesData {
  version: string; // IES version string

  headers: Record<string, string>; // IES headers

  tilt: string; // IES tilt string

  lamp: {
    lampCount: number;
    lumensPerLamp: number;
    multiplier: number; // Candela multiplying factor
  };

  units: number; // (1) Feet | (2) Meters

  // Luminous cavity dimensions
  dim: {
    width: number; // Opening width
    length: number; // Opening length
    height: number; // Cavity height
  };

  electricalData: {
    ballastFactor: number;
    ballastLampPhotometricFactor: number;
    inputWatts: number;
  };

  photometricData: {
    goniometerType: number; // (3) TypeA | (2) TypeB | (1) TypeC
    verticalAngles: number[];
    horizontalAngles: number[];
    candela: number[][]; // Candela values
  };
}
