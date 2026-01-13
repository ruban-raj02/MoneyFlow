/**
 * Capitalizes the first letter of each word in a string
 */
export const capitalizeWords = (value: string): string => {
  return value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
