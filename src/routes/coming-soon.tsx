import { createFileRoute, Link } from '@tanstack/react-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/coming-soon')({
  component: ComingSoonPage,
});

function ComingSoonPage() {
  const { t } = useTranslation(['comingSoon', 'common']);

  return (
    <section className="space-y-8 max-w-2xl">
      {/* Coming Soon Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-400">
        <div className="w-2 h-2 bg-[#fb923c] rounded-full animate-pulse"></div>
        {t('comingSoon:badge.text')}
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">
        {t('comingSoon:hero.title')} <span className="italic text-[#fb923c]">{t('comingSoon:hero.titleHighlight')}</span>
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
        {t('comingSoon:hero.description')}
      </p>

      {/* CTA Button */}
      <div className="pt-6 flex flex-col items-center justify-center gap-6">
        <a
          href="https://discord.gg/spanish-english"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative px-10 py-5 bg-[#fb923c] text-slate-950 font-bold text-lg rounded-full transition-all duration-300 hover:bg-[#f97316] hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          {t('comingSoon:cta.join')}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </a>

        {/* Back to Home Link */}
        <Link to="/" className="text-sm text-slate-400 hover:text-[#fb923c] transition-colors duration-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          {t('comingSoon:cta.backToHome')}
        </Link>
      </div>
    </section>
  );
}
