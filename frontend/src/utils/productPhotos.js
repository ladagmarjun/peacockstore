// A product's photos in display order. `image_url`, when set, is the main
// photo and comes first; the color-tagged `images` follow (minus any copy of it).
export function productPhotos(p) {
  const images = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]');
  if (!p.image_url) return images;
  return [{ url: p.image_url }, ...images.filter(im => im.url !== p.image_url)];
}

export function coverOf(p) {
  return productPhotos(p)[0]?.url;
}
