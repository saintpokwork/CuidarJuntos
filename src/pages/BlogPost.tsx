import React from 'react';
import { Link, useParams } from 'react-router-dom';
import CuidarJuntosLogo from '../components/brand/CuidarJuntosLogo';
import { useLanguage } from '../i18n/LanguageContext';
import blogPosts from '../data/blogPosts';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const lang = language as 'pt' | 'en';
  const post = blogPosts.find((p) => p.slug === slug);

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
          <Link to="/blog" className="text-primary font-bold hover:underline text-label-md">
            {lang === 'en' ? '← All guides' : '← Todos os guias'}
          </Link>
        </nav>
      </header>

      <main className="max-w-[780px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-fixed/20 text-primary rounded-full text-[11px] font-bold">
            {post.category}
          </span>
          <span className="text-[11px] text-on-surface-variant">{post.readingTime}</span>
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
      </main>
    </div>
  );
};

export default BlogPost;