import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateNewUid = () => {
  return uuidv4();
};

export const capitalizeFirstLetter = (input: string) => {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
};
