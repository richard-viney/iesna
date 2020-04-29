import IesDocuments from "../ies-documents";
import * as IESNA from "../src";

class DemoApp {
  public run(): void {
    this.loadIESDocuments();
    this.addEventListeners();

    this.iesDocumentTextArea.value = IesDocuments[0].data;
    this.updateCanvas();
  }

  private loadIESDocuments(): void {
    for (const iesDocument of IesDocuments) {
      const option = document.createElement("option");
      option.innerHTML = iesDocument.name;
      option.value = IesDocuments.indexOf(iesDocument).toString();
      this.iesDocumentDropdown.appendChild(option);
    }
  }

  private addEventListeners(): void {
    const inputElements = [
      this.iesDocumentTextArea,
      this.distanceSlider,
      this.zoomSlider,
      this.brightnessSlider,
    ];

    for (const element of inputElements) {
      element.oninput = (): void => this.updateCanvas();
    }

    // Refresh everything when a new document is chosen
    this.iesDocumentDropdown.onchange = (): void => {
      this.iesDocumentTextArea.value = IesDocuments[this.iesDocumentDropdown.selectedIndex].data;
      this.updateCanvas();
    };
  }

  private updateCanvas(): void {
    const iesData = IESNA.parse(this.iesDocumentTextArea.value);
    const brightness = Number(this.brightnessSlider.value);

    IESNA.renderToCanvas({
      iesData,
      canvas: this.canvas,
      distance: Number(this.distanceSlider.value),
      zoom: Number(this.zoomSlider.value),
      convertSampleToRGB: (sample): [number, number, number] => [
        sample * brightness,
        sample * 0.89 * brightness,
        sample * 0.77 * brightness,
      ],
    });
  }

  private readonly canvas = document.getElementsByTagName("canvas")[0];
  private readonly iesDocumentDropdown = document.getElementById("document") as HTMLSelectElement;
  private readonly distanceSlider = document.getElementById("distance") as HTMLInputElement;
  private readonly zoomSlider = document.getElementById("zoom") as HTMLInputElement;
  private readonly brightnessSlider = document.getElementById("brightness") as HTMLInputElement;
  private readonly iesDocumentTextArea = document.getElementsByTagName("textarea")[0];
}

document.addEventListener("DOMContentLoaded", () => new DemoApp().run());
