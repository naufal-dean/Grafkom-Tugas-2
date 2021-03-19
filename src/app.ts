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
    SliderManager.assignInputEvent("rotate-x", (val: number) => {
      changeRotateOf(X, val);
    });
    SliderManager.assignInputEvent("rotate-y", (val: number) => {
      changeRotateOf(Y, val);
    });
    SliderManager.assignInputEvent("rotate-z", (val: number) => {
      changeRotateOf(Z, val);
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
