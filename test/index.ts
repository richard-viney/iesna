import IesLights from "../ies-lights";
import * as IESNA from "../src";

describe("IESNA", () => {
  it("parses all test documents", () => {
    for (const light of IesLights) {
      IESNA.parse(light.data);
    }
  });

  it("renders all test documents", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;

    for (const light of IesLights) {
      const iesData = IESNA.parse(light.data);
      IESNA.renderToCanvas({ iesData, canvas });
    }
  });
});
