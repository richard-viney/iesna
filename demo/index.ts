import IesLights from "../ies-lights";
import * as IESNA from "../src";

class DemoApp {
  public run(): void {
    this.loadLights();
    this.addEventListeners();

    this.iesLightTextArea.value = IesLights[0].data;
    this.updateCanvas();
  }

  private loadLights(): void {
    for (const light of IesLights) {
      const option = document.createElement("option");
      option.innerHTML = light.name;
      option.value = IesLights.indexOf(light).toString();
      this.iesLightDropdown.appendChild(option);
    }
  }

  private addEventListeners(): void {
    const inputElements = [
      this.iesLightTextArea,
      this.distanceSlider,
      this.zoomSlider,
      this.brightnessSlider,
    ];

    for (const element of inputElements) {
      element.oninput = (): void => this.updateCanvas();
    }

    // Refresh everything when a new light is chosen
    this.iesLightDropdown.onchange = (): void => {
      this.iesLightTextArea.value =
        IesLights[this.iesLightDropdown.selectedIndex].data;
      this.updateCanvas();
    };
  }

  private updateCanvas(): void {
    const iesData = IESNA.parse(this.iesLightTextArea.value);
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
  private readonly iesLightDropdown = document.getElementById(
    "light",
  ) as HTMLSelectElement;
  private readonly distanceSlider = document.getElementById(
    "distance",
  ) as HTMLInputElement;
  private readonly zoomSlider = document.getElementById(
    "zoom",
  ) as HTMLInputElement;
  private readonly brightnessSlider = document.getElementById(
    "brightness",
  ) as HTMLInputElement;
  private readonly iesLightTextArea =
    document.getElementsByTagName("textarea")[0];
}

document.addEventListener("DOMContentLoaded", () => new DemoApp().run());
