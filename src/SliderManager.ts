type SliderId = "x" | "y" | "z" | "rotate-x" | "rotate-y" | "rotate-z" | "zoom";
const sliderIds: SliderId[] = ["x", "y", "z", "rotate-x", "rotate-y", "rotate-z", "zoom"];

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
const sliderDefaultValues: SliderDefaultValue = {
  "x": 50,
  "y": 50,
  "z": 50,
  "rotate-x": 0,
  "rotate-y": 0,
  "rotate-z": 0,
  "zoom": 1,
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

  static resetSliderValue() {
    sliderIds.forEach((sliderId) => {
      sliders[sliderId].value = sliderDefaultValues[sliderId];
      sliders[sliderId].dispatchEvent(new Event("input"));
    });
  }
}
export default SliderManager;
export {sliderIds};
