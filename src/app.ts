import Shape from "./shapes/shape";
import SliderManager, {sliderIds} from "./SliderManager";

const X = 0;
const Y = 1;
const Z = 2;

class App {
  private shape: Shape | null = null;

  constructor() {}
  initSliders() {
    if (!this.shape) {
      return;
    }
    const changeRotateOf = (index: number, degree: number) => {
      if (!this.shape) {
        return;
      }
      const rotation = this.shape.getTransformation("rotate");
      rotation[index] = degree;
      this.shape.setTransformation("rotate", rotation);
    };
    const changeTranslateOf = (index: number, val: number) => {
      if (!this.shape) {
        return;
      }
      const new_val = this.shape?.getTransformation("translate");
      new_val[index] = (val - 50) / 100;
      this.shape?.setTransformation("translate", new_val);
    };
    SliderManager.assignInputEvent("rotate-x", (val: number) => {
      changeRotateOf(X, val);
    });
    SliderManager.assignInputEvent("rotate-y", (val: number) => {
      changeRotateOf(Y, val);
    });
    SliderManager.assignInputEvent("rotate-z", (val: number) => {
      changeRotateOf(Z, val);
    });
    SliderManager.assignInputEvent("x", (val: number) => {
      changeTranslateOf(X, val);
    });
    SliderManager.assignInputEvent("y", (val: number) => {
      changeTranslateOf(Y, val);
    });
    SliderManager.assignInputEvent("z", (val: number) => {
      changeTranslateOf(Z, val);
    });
    SliderManager.assignInputEvent("zoom", (val: number) => {
      if (!this.shape) {
        return;
      }
      let new_scale = this.shape.getTransformation("scale");
      const zoomVal = val / 10;
      new_scale = [zoomVal, zoomVal, 0];
      this.shape?.setTransformation("scale", new_scale);
    });
  }

  start() {
    if (!this.shape) {
      throw "No shape defined!";
    }
    this.initSliders();
    const loop = (time: number) => {
      this.shape?.draw();
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  }

  setShape(shape: Shape) {
    this.shape = shape;
  }
}

export default App;
