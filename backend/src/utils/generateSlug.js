export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const generateUniqueSlug = (text) => {
  return `${generateSlug(text)}-${Date.now().toString(36)}`;
};