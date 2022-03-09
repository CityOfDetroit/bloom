import { MinMax } from "../units/types/min-max"

export function setMinMax(range: MinMax, value: number): MinMax {
  if (range === undefined) {
    return {
      min: value,
      max: value,
    }
  } else {
    range.min = Math.min(range.min, value)
    range.max = Math.max(range.max, value)

    return range
  }
}
