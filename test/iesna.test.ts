import { createCanvas } from "canvas";
import { describe, it } from "vitest";
import IesLights from "../ies-lights";
import * as IESNA from "../src";

describe("IESNA", () => {
  it("parses all test documents", () => {
    for (const light of IesLights) {
      IESNA.parse(light.data);
    }
  });

  it("renders all test documents", () => {
    const canvas = createCanvas(100, 100) as unknown as HTMLCanvasElement;

    for (const light of IesLights) {
      const iesData = IESNA.parse(light.data);
      IESNA.renderToCanvas({ iesData, canvas });
    }
  });
});
