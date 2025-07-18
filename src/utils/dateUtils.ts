// Utility functions for date conversion between Date objects and HTML5 date strings

export const dateToInputValue = (date: Date | undefined): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

export const inputValueToDate = (value: string): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value + 'T00:00:00');
  return isNaN(date.getTime()) ? undefined : date;
};

export const formatDateForDisplay = (date: Date | undefined): string => {
  if (!date) return '';
  return date.toLocaleDateString();
};

export const isValidDate = (date: Date | undefined): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};