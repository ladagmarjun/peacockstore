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

// Photo revealed when hovering a product card: the admin's "Hover image"
// (`hover_image_url`), otherwise the second photo. Never the cover itself.
export function hoverOf(p) {
  const photos = productPhotos(p);
  const cover  = photos[0]?.url;
  if (p.hover_image_url && p.hover_image_url !== cover) return p.hover_image_url;
  return photos[1]?.url;
}
