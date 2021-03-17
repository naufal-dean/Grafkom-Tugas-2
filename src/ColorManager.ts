import {Shape} from "./shape/shape";

// COLOR
class ColorManager {
  private selectedShape: Shape | null = null;

  constructor(
    // ini variabel" kelasnya belom kepake tapi kyknya simpen aja siapa tau nanti kepake
    private colorRElmt: HTMLInputElement,
    private colorGElmt: HTMLInputElement,
    private colorBElmt: HTMLInputElement,
    private rgbSetBtn: HTMLButtonElement,
  ) {
    const rgbInputs = [colorRElmt, colorGElmt, colorBElmt];
    rgbInputs.forEach((rgbInput) => {
      rgbInput.value = "0";
      rgbInput.addEventListener("input", (event: Event) => {
        rgbSetBtn.style.backgroundColor = `rgb(${colorRElmt.value}, ${colorGElmt.value}, ${colorBElmt.value})`;
        const values: number[] = rgbInputs.map((el) => Number.parseInt(el.value));
        const rgbtotal = values.reduce((acc, curr) => acc + curr);
        if (rgbtotal < 383) {
          rgbSetBtn.style.color = "white";
        } else {
          rgbSetBtn.style.color = "black";
        }
      });
    });
    rgbSetBtn.style.backgroundColor = `rgb(${colorRElmt.value}, ${colorGElmt.value}, ${colorBElmt.value})`;
    rgbSetBtn.addEventListener("click", () => {
      const color: Color = [
        this.mapColor(colorRElmt.value),
        this.mapColor(colorGElmt.value),
        this.mapColor(colorBElmt.value),
      ];
      this.selectedShape?.setColor(color);
    });
  }

  public setSelectedShape(shape: Shape) {
    this.selectedShape = shape;
  }

  public removeSelectedShape() {
    this.selectedShape = null;
  }

  private mapColor(value: string | number) {
    let numval: number = typeof value == "string" ? Number.parseInt(value) : value;
    return ((numval - 0) * (1 - 0)) / (255 - 0) + 0;
  }
}

export default ColorManager;
