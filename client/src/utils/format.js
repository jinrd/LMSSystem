export const formatPhoneNumber = (value) => {
  if (!value) return "";
  const cleaned = ('' + value).replace(/\D/g, '');
  
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
};
