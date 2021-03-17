type AbstractConstructorHelper<T> = (new (...args: any) => {[x: string]: any}) & T;
type AbstractContructorParameters<T> = ConstructorParameters<AbstractConstructorHelper<T>>;

type Point = [number, number];
type Color = [number, number, number];

type LineInstance = {
  p0: Point;
  p1: Point;
  color: Color;
};

type SquareInstance = {
  p: Point;
  size: number;
  color: Color;
};

type PolygonInstance = {
  points: Point[];
  color: Color;
};

type ShapeInstance =
  | {
      type: "line";
      object: LineInstance;
    }
  | {
      type: "square";
      object: SquareInstance;
    }
  | {
      type: "polygon";
      object: PolygonInstance;
    };

type AppInstance = {
  shapes: ShapeInstance[];
};

type MouseState = {
  bef: Point;
  pos: Point;
  pressed: {
    pos: Point | null;
  };
  shapeId: number;
};

type RGBInput = {
  name: string;
  elmt: HTMLInputElement;
};
