import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTons(quantity: number | string | undefined, unidade?: string) {
  const q = Number(quantity) || 0;
  if (!unidade) return q;
  return unidade.toString().toLowerCase() === 'kg' ? q / 1000 : q;
}
