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
      const newRotation = this.shape.getTransformation("rotate");
      newRotation[index] = degree;
      this.shape.setTransformation("rotate", newRotation);
    };
    const changeTranslateOf = (index: number, val: number) => {
      if (!this.shape) {
        return;
      }
      const newVal = this.shape.getTransformation("translate");
      newVal[index] = (val - 50) / 100;
      this.shape.setTransformation("translate", newVal);
    };
    const changeZoomOf = (val: number) => {
      if (!this.shape) {
        return;
      }
      let newScale = this.shape.getTransformation("scale");
      const zoomVal = val / 10;
      newScale = [zoomVal, zoomVal, zoomVal];
      this.shape.setTransformation("scale", newScale);
    }

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
      changeZoomOf(val);
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
