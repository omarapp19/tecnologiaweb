export interface LinearModel {
  slope: number;
  intercept: number;
  r2: number;
  n: number;
}

/** Ajuste por mínimos cuadrados ordinarios de y = slope·x + intercept. */
export function fitLinear(points: Array<{ x: number; y: number }>): LinearModel | null {
  const n = points.length;
  if (n < 3) return null;

  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const { x, y } of points) {
    sx += x;
    sy += y;
    sxx += x * x;
    sxy += x * y;
  }

  const denom = n * sxx - sx * sx;
  if (denom === 0) return null; // todas las x iguales

  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;

  const meanY = sy / n;
  let ssTot = 0, ssRes = 0;
  for (const { x, y } of points) {
    ssTot += (y - meanY) ** 2;
    ssRes += (y - (slope * x + intercept)) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { slope, intercept, r2, n };
}

export function predict(model: LinearModel, x: number): number {
  return model.slope * x + model.intercept;
}
