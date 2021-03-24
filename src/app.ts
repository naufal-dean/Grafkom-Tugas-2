import Shape from "./shapes/shape";
import SliderManager from "./SliderManager";

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
      this.shape.setTransformation("scale", [val, val, val]);
    };
    const changeCameraPositionOf = (cameraSettingType: CameraSetting, newValue: number) => {
      this.shape?.setCamera(cameraSettingType, newValue);
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
      changeZoomOf(val);
    });
    SliderManager.assignInputEvent("cam-radius", (val: number) => {
      changeCameraPositionOf("radius", val);
    });
    SliderManager.assignInputEvent("cam-theta", (val: number) => {
      changeCameraPositionOf("theta", val);
    });
    SliderManager.assignInputEvent("cam-phi", (val: number) => {
      changeCameraPositionOf("phi", val);
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

  resetShape() {
    SliderManager.resetTransformSliderValue();
  }

  resetCamera() {
    SliderManager.resetCameraSliderValue();
  }

  resetAll() {
    this.resetShape();
    this.resetCamera();
  }

  setShapeProjection(projectionType: Projection) {
    this.shape?.setProjection(projectionType);
  }

  toogleShading() {
    this.shape?.toggleShading();
  }
}

export default App;
