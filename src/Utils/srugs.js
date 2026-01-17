export const toSlug = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")        
    .replace(/[^a-z0-9]+/g, "-")  
    .replace(/-+/g, "-")           
    .replace(/^-|-$/g, "");       