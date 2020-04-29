import type { IesData } from "./ies-data";

function linearInterpolate(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Returns the light intensity in the IES volume at the given coordinate
 * relative to the light. The resulting intensity is found by bilinear
 * interpolation of nearby samples.
 */
export function sample({
  iesData,
  x,
  y,
  z,
}: {
  iesData: IesData;
  x: number;
  y: number;
  z: number;
}): number {
  // Convert cartesian coordinate to polar coordinates
  const distance = Math.sqrt(x * x + y * y + z * z);
  const azimuth = radiansToDegrees(Math.atan2(z, x)) + 180;
  const inclination = radiansToDegrees(Math.acos(y / distance));

  // Find the horizontal index to use
  let horizontalIndex: number | undefined = undefined;
  for (
    let i = 0;
    i < iesData.photometricData.horizontalAngles.length - 1;
    i++
  ) {
    if (
      azimuth >= iesData.photometricData.horizontalAngles[i] &&
      azimuth < iesData.photometricData.horizontalAngles[i + 1]
    ) {
      horizontalIndex = i;
      break;
    }
  }

  // Find the vertical index to use
  let verticalIndex: number | undefined = undefined;
  for (let i = 0; i < iesData.photometricData.verticalAngles.length - 1; i++) {
    if (
      inclination >= iesData.photometricData.verticalAngles[i] &&
      inclination < iesData.photometricData.verticalAngles[i + 1]
    ) {
      verticalIndex = i;
      break;
    }
  }

  // Check for out of range
  if (horizontalIndex === undefined || verticalIndex === undefined) {
    return 0;
  }

  // Get the four samples to use for bilinear interpolation
  const a = iesData.photometricData.candela[horizontalIndex][verticalIndex];
  const b = iesData.photometricData.candela[horizontalIndex + 1][verticalIndex];
  const c = iesData.photometricData.candela[horizontalIndex][verticalIndex + 1];
  const d =
    iesData.photometricData.candela[horizontalIndex + 1][verticalIndex + 1];

  // Calculate fractions in each direction between the relevant samples
  const horizontalFraction =
    (azimuth - iesData.photometricData.horizontalAngles[horizontalIndex]) /
    (iesData.photometricData.horizontalAngles[horizontalIndex + 1] -
      iesData.photometricData.horizontalAngles[horizontalIndex]);
  const verticalFraction =
    (inclination - iesData.photometricData.verticalAngles[verticalIndex]) /
    (iesData.photometricData.verticalAngles[verticalIndex + 1] -
      iesData.photometricData.verticalAngles[verticalIndex]);

  // Sample candela value, with bilinear interpolation
  const rawSample = linearInterpolate(
    linearInterpolate(a, b, horizontalFraction),
    linearInterpolate(c, d, horizontalFraction),
    verticalFraction,
  );

  // Calculate attenuation
  const attenuation = 1.0 / (distance * distance);

  return (
    rawSample *
    iesData.lamp.multiplier *
    iesData.electricalData.ballastFactor *
    iesData.electricalData.ballastLampPhotometricFactor *
    attenuation
  );
}
