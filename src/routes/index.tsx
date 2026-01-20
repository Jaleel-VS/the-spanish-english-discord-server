import { createFileRoute, Link } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation(['home', 'common']);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="space-y-8 max-w-2xl mx-auto text-center flex flex-col items-center justify-center min-h-[60vh] py-4">
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative px-10 py-5 bg-[#fb923c] text-slate-950 font-bold text-lg rounded-full transition-all duration-300 hover:bg-[#f97316] hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          {t('home:cta.join')}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
          >
            <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
          <Link to="/coming-soon" className="hover:text-[#fb923c] transition-colors duration-200">
            {t('common:links.newToDiscord')}
          </Link>
          <span className="text-slate-700">•</span>
          <Link to="/coming-soon" className="hover:text-[#fb923c] transition-colors duration-200">
            {t('common:links.guidelines')}
          </Link>
          <span className="text-slate-700">•</span>
          <Link to="/resources" className="hover:text-[#fb923c] transition-colors duration-200">
            {t('common:links.resources')}
          </Link>
          <span className="text-slate-700">•</span>
          <Link to="/coming-soon" className="hover:text-[#fb923c] transition-colors duration-200">
            {t('common:links.support')}
          </Link>
        </div>
      </div>
    </section>
  );
}
