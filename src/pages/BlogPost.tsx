import React from 'react';
import { Link, useParams } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import PublicFooter from '../components/PublicFooter';
import { useLanguage } from '../i18n/LanguageContext';
import blogPosts from '../data/blogPosts';
import LanguageToggle from '../components/LanguageToggle';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const lang = language as 'pt' | 'en';
  const post = blogPosts.find((p) => p.slug === slug);
  const categoryLabel = (category: string) => {
    const labels: Record<string, { pt: string; en: string }> = {
      Organização: { pt: 'Organização', en: 'Organisation' },
      Emergência: { pt: 'Emergência', en: 'Emergency' },
      Medicamentos: { pt: 'Medicamentos', en: 'Medications' },
      Documentos: { pt: 'Documentos', en: 'Documents' },
    };
    return labels[category]?.[lang] || category;
  };
  const readingTimeLabel = (readingTime: string) => {
    const minutes = readingTime.match(/\d+/)?.[0] || readingTime;
    return lang === 'en' ? `${minutes} min read` : `${minutes} min`;
  };

  if (!post) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-headline-xl mb-4">
            {lang === 'en' ? 'Guide not found' : 'Guia não encontrado'}
          </h1>
          <Link to="/blog" className="text-primary font-bold hover:underline">
            {lang === 'en' ? '← Back to guides' : '← Voltar aos guias'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[900px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-20">
          <Link to="/">
            <CuidarJuntosLogo variant="default" size="md" />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggle variant="light" />
            <Link to="/blog" className="text-primary font-bold hover:underline text-label-md">
              {lang === 'en' ? '← All guides' : '← Todos os guias'}
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-[780px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-fixed/20 text-primary rounded-full text-[11px] font-bold">
            {categoryLabel(post.category)}
          </span>
          <span className="text-[11px] text-on-surface-variant">{readingTimeLabel(post.readingTime)}</span>
        </div>

        <h1 className="text-headline-xl md:text-[40px] font-display italic text-on-surface mb-4">
          {post.title[lang]}
        </h1>

        <p className="text-body-lg text-on-surface-variant mb-12">
          {post.excerpt[lang]}
        </p>

        <article className="space-y-6 text-body-md text-on-surface leading-relaxed">
          {post.body[lang].map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={i} className="text-headline-md font-headline-md text-on-surface pt-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}

          <div className="mt-12 p-6 bg-cj-terra/10 rounded-2xl text-label-md text-on-surface-variant">
            {lang === 'en'
              ? 'This guide is informational and does not replace medical or legal advice.'
              : 'Este guia é informativo e não substitui aconselhamento médico ou jurídico.'}
          </div>
        </article>

        <div className="mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors"
          >
            {lang === 'en' ? '← Back to all guides' : '← Voltar a todos os guias'}
          </Link>
        </div>

        <div className="mt-16 bg-cj-grad-card rounded-3xl p-10 text-center soft-shadow">
          <h2 className="text-headline-lg font-display italic text-on-surface mb-4">
            {lang === 'en'
              ? "Ready to organise your family's care?"
              : 'Pronto para organizar os cuidados da sua família?'}
          </h2>
          <Link
            to="/dashboard"
            className="inline-block mt-6 px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all text-lg"
          >
            {lang === 'en' ? 'Start organising care' : 'Começar a organizar cuidados'}
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default BlogPost;
