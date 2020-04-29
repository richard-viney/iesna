import IesDocuments from "../ies-documents";
import * as IESNA from "../src";

describe("IESNA", () => {
  it("parses all test documents", () => {
    for (const document of IesDocuments) {
      IESNA.parse(document.data);
    }
  });

  it("renders all test documents", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;

    for (const document of IesDocuments) {
      const iesData = IESNA.parse(document.data);
      IESNA.renderToCanvas({ iesData, canvas });
    }
  });
});
