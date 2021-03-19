type SliderId = "x" | "y" | "z" | "rotate-x" | "rotate-y" | "rotate-z" | "zoom";
const sliderIds: SliderId[] = ["x", "y", "z", "rotate-x", "rotate-y", "rotate-z", "zoom"];

type Sliders = {
  [sliderId: string]: HTMLInputElement;
};
const sliders: Sliders = {};

sliderIds.forEach((sliderId) => {
  sliders[sliderId] = document.getElementById(sliderId) as HTMLInputElement;
});

const getSlider = (sliderId: SliderId) => sliders[sliderId];

class SliderManager {
  static assignInputEvent(sliderId: SliderId, callback: Function) {
    const elmt = getSlider(sliderId);
    elmt.oninput = function () {
      const value = this.value;
      callback(value);
    };
  }
}
export default SliderManager;
export {sliderIds};
