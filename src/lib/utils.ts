import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export function ellipsis(str: string){
  return str.slice(0, 4) + '...' + str.slice(-4);
};