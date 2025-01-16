import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const getStatusColor = (status) => {
  switch (status) {
    case 'interested':
      return 'text-blue-600';
    case 'rejected':
      return 'text-red-500';
    case 'approved':
      return 'text-green-500';
    default:
      return 'text-gray-600';
  }
};