export function formatDate(date: Date | string): string {
  const dateObject = date instanceof Date ? date : new Date(date);
  return dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

