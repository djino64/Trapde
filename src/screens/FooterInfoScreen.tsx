import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const pageSlugs = [
  'about',
  'careers',
  'press',
  'partners',
  'help',
  'terms',
  'privacy',
  'cookies',
  'sitemap',
  'offers',
  'jobs',
  'marketplace',
  'travel',
  'rentals',
] as const;

const sitemapLinks = [
  ['/accommodation', 'footer.accommodation'],
  ['/marketplace', 'footer.marketplace'],
  ['/travel', 'footer.activities'],
  ['/rentals', 'footer.cars'],
  ['/jobs', 'navbar.jobs'],
  ['/offers', 'footer.offers'],
  ['/about', 'footer.aboutUs'],
  ['/careers', 'footer.careers'],
  ['/press', 'footer.press'],
  ['/partners', 'footer.partners'],
  ['/help', 'footer.help'],
  ['/terms', 'footer.terms'],
  ['/privacy', 'footer.privacy'],
  ['/cookies', 'footer.cookies'],
  ['/sitemap', 'footer.sitemap'],
] as const;

const FooterInfoScreen: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  const page = pageSlugs.find((candidate) => candidate === slug) ?? 'about';
  const key = `footerPages.${page}`;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900">{t(`${key}.title`)}</h1>
          <p className="mt-5 text-base leading-7 text-gray-700">{t(`${key}.description`)}</p>

          {page === 'sitemap' ? (
            <nav aria-label={t(`${key}.title`)} className="mt-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {sitemapLinks.map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="text-blue-700 underline hover:text-blue-900">
                      {t(label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <div className="mt-8 rounded-lg bg-blue-50 p-5">
              <h2 className="font-semibold text-gray-900">{t(`${key}.contactTitle`)}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-700">{t(`${key}.contactText`)}</p>
              <a href="mailto:contact@trapde.tech" className="mt-3 inline-block font-medium text-blue-700 underline">
                contact@trapde.tech
              </a>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default FooterInfoScreen;
