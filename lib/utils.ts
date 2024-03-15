import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const ITEMS_COUNT = 15

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fromArrayBufferToBuffer(data: ArrayBuffer) {
  const newBuffer = Buffer.alloc(data.byteLength)
  const view = new Uint8Array(data)
  for (let i = 0; i < newBuffer.length; ++i) {
    newBuffer[i] = view[i]
  }
  return newBuffer;
}

export function convertBytesName(size: number): string {
  const KILO = 1024
  const MEGA = 1024 * 1024
  const GIGA = 1024 * 1024 * 1024
  let a = size / GIGA
  if (a < 1) {
    a = size / MEGA
    if (a < 1) {
      a = size / KILO
      if (a < 1) {
        return `${a.toFixed(2)} Байт`
      } else {
        return `${a.toFixed(2)} КБ`
      }
    } else {
      return `${a.toFixed(2)} МБ`
    }
  } else {
    return `${a.toFixed(2)} ГБ`
  }
  return ''
}