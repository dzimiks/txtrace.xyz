import { DateTime } from 'luxon';

/**
 * Formats a given date string into a human-readable format.
 *
 * @param {string} date - The date string in ISO format.
 * @param {string} format - The format of the resulted date.
 * @returns {string | null} - The formatted date string in a human-readable format, or null if the input date is not provided.
 */
const formatDate = (date: string, format = 'fff'): string | null => {
  if (!date) {
    return null;
  }

  return DateTime.fromISO(date).toFormat(format);
};

export { formatDate };
