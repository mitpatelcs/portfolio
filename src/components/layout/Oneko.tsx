import Script from 'next/script';

/** The reference's pixel-cat easter egg (public/oneko). Elements marked
 *  data-oneko-dodge="true" are avoided by the cat. */
export default function Oneko() {
  return <Script src="/oneko/oneko.js" strategy="lazyOnload" />;
}
