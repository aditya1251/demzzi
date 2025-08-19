export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")      // spaces → dashes
    .replace(/[^\w\-]+/g, "")  // remove non-word
    .replace(/\-\-+/g, "-");   // collapse multiple dashes
}
