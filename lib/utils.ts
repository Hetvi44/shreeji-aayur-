import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (paise: number): string =>
  `₹${(paise / 100).toLocaleString("en-IN")}`

/** Convert rupees (form input) to paise for DB storage */
export const rupeesToPaise = (rupees: number | string): number =>
  Math.round(Number(rupees) * 100)

export const paiseToRupees = (paise: number): number => paise / 100

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
