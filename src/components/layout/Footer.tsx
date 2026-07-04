import { useTranslation } from 'react-i18next';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin 
} from 'react-icons/fa';
import { 
  MdEmail, 
  MdPhone, 
  MdLocationOn,
  MdLanguage 
} from 'react-icons/md';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/src/assets/images/TRAPDELOGO.png" alt="TRAPDE" className="h-8 w-auto brightness-0 invert" />
              <span className="text-xl font-bold text-white">TRAPDE</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              {t('footer.about')}
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <MdLocationOn size={16} />
                <span>Cap-Haitien, Haiti</span>
              </div>
              <div className="flex items-center gap-2">
                <MdPhone size={16} />
                <span>+509 4130 0944</span>
              </div>
              <div className="flex items-center gap-2">
                <MdEmail size={16} />
                <span>contact@trapde.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Explorer */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">{t('footer.explorer')}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/accommodation" className="hover:text-secondary transition">{t('footer.accommodation')}</Link></li>
              <li><Link to="/marketplace" className="hover:text-secondary transition">{t('footer.marketplace')}</Link></li>
              <li><Link to="/rentals" className="hover:text-secondary transition">{t('footer.cars')}</Link></li>
              <li><Link to="/travel" className="hover:text-secondary transition">{t('footer.activities')}</Link></li>
              <li><Link to="/offers" className="hover:text-secondary transition">{t('footer.offers')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Informations */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">{t('footer.information')}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-secondary transition">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/careers" className="hover:text-secondary transition">{t('footer.careers')}</Link></li>
              <li><Link to="/press" className="hover:text-secondary transition">{t('footer.press')}</Link></li>
              <li><Link to="/partners" className="hover:text-secondary transition">{t('footer.partners')}</Link></li>
              <li><Link to="/help" className="hover:text-secondary transition">{t('footer.help')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Politiques */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">{t('footer.policies')}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/terms" className="hover:text-secondary transition">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="hover:text-secondary transition">{t('footer.privacy')}</Link></li>
              <li><Link to="/cookies" className="hover:text-secondary transition">{t('footer.cookies')}</Link></li>
              <li><Link to="/sitemap" className="hover:text-secondary transition">{t('footer.sitemap')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/20 py-8 mb-8 text-center">
          <h4 className="text-xl font-semibold mb-4 text-white">{t('footer.newsletter')}</h4>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder={t('footer.yourEmail')}
              className="flex-1 px-4 py-3 rounded-full text-gray-900 outline-none focus:ring-2 focus:ring-secondary"
            />
            <button className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary-dark transition">
              {t('footer.subscribe')}
            </button>
          </div>
        </div>

        {/* Bottom Bar avec année automatique */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/20 text-sm text-white/60">
          <div>© {currentYear} TRAPDE. {t('footer.rights')}</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-secondary transition"><FaFacebook size={18} /></a>
            <a href="#" className="hover:text-secondary transition"><FaTwitter size={18} /></a>
            <a href="#" className="hover:text-secondary transition"><FaInstagram size={18} /></a>
            <a href="#" className="hover:text-secondary transition"><FaLinkedin size={18} /></a>
          </div>
          <div className="flex items-center gap-2">
            <MdLanguage size={16} />
            <span>HAITI (HT) - {t('footer.currency')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;