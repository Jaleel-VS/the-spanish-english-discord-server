import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Headphones, Video, BookOpen, GraduationCap, MessageCircle, Music } from 'lucide-react';
import { ResourceTile } from '../../components/ResourceTile';

export const Route = createFileRoute('/resources/')({
  component: ResourcesIndex,
});

const resources = [
  { key: 'podcasts', to: '/resources/podcasts', icon: Headphones },
  { key: 'videos', to: '/resources/videos', icon: Video },
  { key: 'books', to: '/resources/books', icon: BookOpen },
  { key: 'courses', to: '/resources/courses', icon: GraduationCap },
  { key: 'conversation', to: '/resources/conversation', icon: MessageCircle },
  { key: 'music', to: '/resources/music', icon: Music },
] as const;

function ResourcesIndex() {
  const { t } = useTranslation('resources');

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('index.title')}</h1>
      <p className="text-slate-400 mb-10">{t('index.description')}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {resources.map(({ key, to, icon }) => (
          <ResourceTile
            key={key}
            to={to}
            icon={icon}
            title={t(`index.tiles.${key}`)}
          />
        ))}
      </div>
    </div>
  );
}
