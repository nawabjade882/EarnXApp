import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uid(): string {
  return 'U' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function refCodeFromUid(id: string): string {
  return 'REF-' + id.slice(-4);
}

export function now(): string {
  return new Date().toISOString();
}
