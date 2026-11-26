// Men and Women menus. Products carry a gender (men, women or unisex) and
// categories list the menus they have products for in `genders`, so one
// unisex product shows under both menus without duplicate categories.
export const GENDER_MENUS = [
  { key: 'men',   name: 'Men' },
  { key: 'women', name: 'Women' },
];

export const genderName = (key) => GENDER_MENUS.find(g => g.key === key)?.name || '';

// Older API versions don't send `genders`; the menu then falls back to the
// category tree so the shop keeps working until the API is updated.
export const hasGenderMenus = (categories) => categories.some(c => Array.isArray(c.genders));

// Categories to list under a gender menu, in the API's tree order. Old
// "Men" / "Women" categories are skipped: the menus replace them, and their
// subcategories are listed on their own.
const GENDER_SLUGS = new Set(GENDER_MENUS.map(g => g.key));
export const isGenderCategory = (category) => GENDER_SLUGS.has(category?.slug);
export const categoriesFor = (categories, gender) =>
  categories.filter(c => c.genders?.includes(gender) && !isGenderCategory(c));

// Men and Women each include unisex products. A product without a gender
// (older API) counts as unisex.
export const fitsGender = (product, gender) =>
  !gender || !product.gender || product.gender === gender || product.gender === 'unisex';
