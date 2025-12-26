import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full hover:bg-slate-700/50 transition-all duration-200 text-sm font-medium"
      aria-label="Toggle language"
    >
      <span className={`transition-colors duration-200 ${language === 'en' ? 'text-slate-50' : 'text-slate-500'}`}>
        EN
      </span>
      <div className="w-px h-4 bg-slate-600"></div>
      <span className={`transition-colors duration-200 ${language === 'es' ? 'text-slate-50' : 'text-slate-500'}`}>
        ES
      </span>
    </button>
  );
};
