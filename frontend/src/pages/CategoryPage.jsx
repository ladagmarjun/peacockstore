import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar       from '../components/Navbar';
import Footer       from '../components/Footer';
import ProductCard  from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { api, assetUrl } from '../services/api';
import { coverOf } from '../utils/productPhotos';
import { fitsGender, genderName, isGenderCategory } from '../utils/gender';

// /category/:slug lists one category. /men and /women (optionally with a
// category, e.g. /men/coin-purse) list that gender's products, unisex included.
export default function CategoryPage({ gender = null }) {
  const { slug } = useParams();
  const gName    = genderName(gender);
  // Where a category link goes: kept inside the gender menu when there is one.
  const catPath  = (c) => gender ? `/${gender}/${c.slug}` : `/category/${c.slug}`;
  const [categories, setCategories] = useState(null);
  const [products,   setProducts]   = useState(null);
  const [selected,   setSelected]   = useState(null);

  useEffect(() => {
    api.getCategories().then(cs => setCategories(cs.filter(c => c.slug !== 'all'))).catch(() => setCategories([]));
    api.getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const loading  = !categories || !products;
  const category = slug ? categories?.find(c => c.slug === slug) : null;
  const parent   = category && categories.find(c => c.id === category.parent_id);
  const children = category
    ? categories.filter(c => c.parent_id === category.id && (!gender || !c.genders || c.genders.includes(gender)))
    : [];
  // A bare /men or /women page has no category; it lists all of that gender.
  const found    = category || (gender && !slug);
  const title    = category ? (gName ? `${gName}'s ${category.name}` : category.name) : (gName || 'Category');

  // The category's own slug plus every descendant's, so a parent (e.g. Men)
  // also lists products filed under its children (e.g. Wallet).
  const shown = (() => {
    if (!found || !products) return []; // products may still be loading
    if (!category) return products.filter(p => fitsGender(p, gender));
    const slugs = new Set([category.slug]);
    for (let grew = true; grew;) {
      grew = false;
      for (const c of categories) {
        const p = categories.find(x => x.id === c.parent_id);
        if (p && slugs.has(p.slug) && !slugs.has(c.slug)) { slugs.add(c.slug); grew = true; }
      }
    }
    return products.filter(p => slugs.has(p.category?.slug) && fitsGender(p, gender));
  })();

  // Banner photo: the category's own image, else its parent's, else the
  // first product's photo; the plain gradient shows if none exist.
  const bannerImg = category?.image_url || parent?.image_url || (shown[0] && coverOf(shown[0]));

  return (
    <>
      <Navbar />

      <section
        className={`lhero${bannerImg ? ' lhero-photo' : ''}`}
        style={bannerImg ? { backgroundImage: `url("${assetUrl(bannerImg)}")` } : undefined}
      >
        <div className="lhero-inner story-hero">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {gName && (category
              ? <><span>/</span><Link to={`/${gender}`}>{gName}</Link></>
              : <><span>/</span><span aria-current="page">{gName}</span></>)}
            {parent && !(gender && isGenderCategory(parent)) && <><span>/</span><Link to={catPath(parent)}>{parent.name}</Link></>}
            {category && <><span>/</span><span aria-current="page">{category.name}</span></>}
          </nav>
          <h1>{title}</h1>
          {!loading && found && (
            <p>{shown.length} product{shown.length === 1 ? '' : 's'}</p>
          )}
        </div>
      </section>

      <section className="section wrap">
        {children.length > 0 && (
          <div className="filters cat-sub">
            <Link className="chip active" to={catPath(category)}>All {category.name}</Link>
            {children.map(c => (
              <Link key={c.slug} className="chip" to={catPath(c)}>{c.name}</Link>
            ))}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading products…</div>
        ) : !found ? (
          <div className="empty">
            Category not found. <Link to="/#shop" style={{ textDecoration: 'underline' }}>Browse all products</Link>
          </div>
        ) : shown.length === 0 ? (
          <div className="empty">No products {category ? 'in this category' : `for ${gName}`} yet.</div>
        ) : (
          <div className="grid">
            {shown.map(p => <ProductCard key={p.id} product={p} onClick={setSelected} />)}
          </div>
        )}
      </section>

      <Footer />
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
