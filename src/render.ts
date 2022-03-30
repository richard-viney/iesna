import type { IesData } from "./ies-data";
import { sample } from "./sample";

/**
 * Renders IESNA data into an HTML canvas. The entire canvas is rendered into by this function.
 * The distance parameter sets the distance from the plane of the samples being taken.
 */
export function renderToCanvas({
  iesData,
  canvas,
  distance = 1,
  zoom = 1,
  convertSampleToRGB = (value: number): [number, number, number] => [value, value, value],
}: {
  iesData: IesData;
  canvas: HTMLCanvasElement;
  distance?: number;
  zoom?: number;
  convertSampleToRGB?: (value: number) => [number, number, number];
}): void {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw Error("iesna: renderToCanvas() failed getting context for canvas");
  }

  const width = canvas.width;
  const height = canvas.height;
  const imageData = context.getImageData(0, 0, width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const s = sample({
        iesData,
        x: (x - width / 2 - 0.5) / zoom,
        y: (y - height / 2 - 0.5) / zoom,
        z: distance,
      });

      const [r, g, b] = convertSampleToRGB(s);

      const index = (y * width + x) * 4;
      imageData.data[index] = Math.min(r * 255, 255);
      imageData.data[index + 1] = Math.min(g * 255, 255);
      imageData.data[index + 2] = Math.min(b * 255, 255);
      imageData.data[index + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);
}
