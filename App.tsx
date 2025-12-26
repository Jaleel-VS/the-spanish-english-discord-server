
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from './components/StatusBadge';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const App: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);


  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-[#fb923c] selection:text-white">
      {/* Navigation / Header */}
      <header className="w-full max-w-5xl px-6 py-6 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="text-base sm:text-lg md:text-xl font-bold tracking-tight">
            {t('common:header.title')}<span className="text-[#fb923c]">{t('common:header.titleDot')}</span>{t('common:header.titleSuffix')}
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <LanguageSwitcher />
            <StatusBadge />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl px-6 flex flex-col items-center justify-center py-12 text-center">
        {/* Header Image Container
        <div className="relative w-full aspect-[21/9] mb-12 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <img
            src="https://spanishmama.com/wp-content/uploads/2018/09/Spanish-Classrooms1.jpg"
            alt="Language Exchange Community"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
        </div> */}

        {/* Content Section */}
        <section className="space-y-8 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">
            {t('home:hero.title')} <br />
            <span className="italic text-[#fb923c]">{t('home:hero.titleHighlight')}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
            {t('home:hero.description')}
          </p>

          <div className="pt-6 flex flex-col items-center justify-center gap-6">
            <a
              href="https://discord.gg/spanish-english"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-10 py-5 bg-[#fb923c] text-slate-950 font-bold text-lg rounded-full transition-all duration-300 hover:bg-[#f97316] hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              {t('home:cta.join')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </a>

            <div className="flex flex-wrap items-center [&>span]:text-slate-700 [&>a]:hover:text-[#fb923c] [&>a]:transition-colors [&>a]:duration-200 justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <a href="/coming-soon.html">{t('common:links.newToDiscord')}</a>
              <span>•</span>
              <a href="/coming-soon.html">{t('common:links.guidelines')}</a>
              <span>•</span>
              <a href="/coming-soon.html">{t('common:links.resources')}</a>
              <span>•</span>
              <a href="/coming-soon.html">{t('common:links.support')}</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl px-6 py-12 border-t border-slate-800 flex justify-center items-center text-slate-500 text-sm">
        <p>{t('common:footer.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
};

export default App;
