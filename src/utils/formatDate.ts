export const formatDateTime = (dateTimeString: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateTimeString) {
    return 'No time';
  }

  const date = dateTimeString instanceof Date ? dateTimeString : new Date(dateTimeString);

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    ...options, // Allow overriding or adding more options
  });
};

export const formatDate = (dateString: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) {
    return '';
  }
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', ...options });
};

export const formatTime = (timeString: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string => {
  if (!timeString) {
    return '';
  }
  const date = timeString instanceof Date ? timeString : new Date(timeString);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric', ...options });
};