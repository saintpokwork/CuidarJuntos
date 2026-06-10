import React from 'react';
import { Link } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import PublicFooter from '../components/PublicFooter';
import { useLanguage } from '../i18n/LanguageContext';
import blogPosts from '../data/blogPosts';

const Blog: React.FC = () => {
  const { language } = useLanguage();
  const lang = language as 'pt' | 'en';

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="border-b border-cj-border bg-cj-branco/90 backdrop-blur-md">
        <nav className="max-w-[1200px] mx-auto flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-20">
          <Link to="/">
            <CuidarJuntosLogo variant="default" size="md" />
          </Link>
          <Link to="/" className="text-primary font-bold hover:underline text-label-md">
            {lang === 'en' ? 'Home' : 'Início'}
          </Link>
        </nav>
      </header>

      <main className="max-w-[900px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-16">
        <h1 className="text-headline-xl md:text-[48px] font-display italic text-on-surface mb-4">
          {lang === 'en' ? 'Guides for caregiving families' : 'Guias para famílias cuidadoras'}
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-12 max-w-2xl">
          {lang === 'en'
            ? 'Practical content to help families in Portugal organise care, medications, appointments and important information.'
            : 'Conteúdos práticos para ajudar famílias em Portugal a organizar cuidados, medicamentos, consultas e informação importante.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary-fixed/20 text-primary rounded-full text-[11px] font-bold">
                  {post.category}
                </span>
                <span className="text-[11px] text-on-surface-variant">{post.readingTime}</span>
              </div>
              <h2 className="text-headline-md font-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">
                {post.title[lang]}
              </h2>
              <p className="text-label-md text-on-surface-variant" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.excerpt[lang]}
              </p>
              <span className="inline-block mt-4 text-label-sm font-bold text-primary">
                {lang === 'en' ? 'Read guide →' : 'Ler guia →'}
              </span>
            </Link>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 bg-cj-grad-card rounded-3xl p-10 text-center soft-shadow">
          <h2 className="text-headline-lg font-display italic text-on-surface mb-4">
            {lang === 'en'
              ? "Want to organise your family's care in one place?"
              : 'Quer organizar os cuidados da sua família num só lugar?'}
          </h2>
          <Link
            to="/dashboard"
            className="inline-block mt-6 px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all text-lg"
          >
            {lang === 'en' ? 'Start for free' : 'Começar gratuitamente'}
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Blog;