import { DateTime } from 'luxon';

const formatDate = (date: string) => {
  if (!date) {
    return null;
  }

  return DateTime.fromISO(date).toFormat('ff');
};

export { formatDate };
