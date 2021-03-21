type SliderId = "x" | "y" | "z" | "rotate-x" | "rotate-y" | "rotate-z" | "zoom" |
                "cam-radius" | "cam-theta" | "cam-phi";
const sliderIds: SliderId[] = ["x", "y", "z", "rotate-x", "rotate-y", "rotate-z", "zoom",
                "cam-radius", "cam-theta", "cam-phi"];

type Sliders = {
  [sliderId: string]: HTMLInputElement;
};
const sliders: Sliders = {};
type SliderIndicator = {
  [sliderId: string]: HTMLSpanElement;
};
const sliderIndicators: SliderIndicator = {};
type SliderDefaultValue = {
  [sliderId: string]: number;
};
const tSliderDefaultValues: SliderDefaultValue = {
  "x": 50,
  "y": 50,
  "z": 50,
  "rotate-x": 0,
  "rotate-y": 0,
  "rotate-z": 0,
  "zoom": 1,
};
const cSliderDefaultValues: SliderDefaultValue = {
  "cam-radius": 0,
  "cam-theta": 0,
  "cam-phi": 0,
};

sliderIds.forEach((sliderId) => {
  sliders[sliderId] = document.getElementById(sliderId) as HTMLInputElement;
  sliderIndicators[`${sliderId}-value`] = document.getElementById(
    `${sliderId}-value`,
  ) as HTMLSpanElement;
  sliderIndicators[`${sliderId}-value`].innerText = sliders[sliderId].value;
});

const getSlider = (sliderId: SliderId) => sliders[sliderId];

class SliderManager {
  static assignInputEvent(sliderId: SliderId, callback: Function) {
    const elmt = getSlider(sliderId);
    elmt.oninput = function () {
      const value = this.value;
      sliderIndicators[`${elmt.id}-value`].innerText = value;
      callback(value);
    };
  }

  static resetTransformSliderValue() {
    sliderIds.forEach((sliderId) => {
      if (tSliderDefaultValues.hasOwnProperty(sliderId)) {
        sliders[sliderId].value = tSliderDefaultValues[sliderId];
        sliders[sliderId].dispatchEvent(new Event("input"));
      }
    });
  }

  static resetCameraSliderValue() {
    sliderIds.forEach((sliderId) => {
      if (cSliderDefaultValues.hasOwnProperty(sliderId)) {
        sliders[sliderId].value = cSliderDefaultValues[sliderId];
        sliders[sliderId].dispatchEvent(new Event("input"));
      }
    });
  }
}
export default SliderManager;
export {sliderIds};
