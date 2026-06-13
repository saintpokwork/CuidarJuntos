import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://cuidarjuntos.pt';
const DEFAULT_TITLE = 'CuidarJuntos — Organize os cuidados da sua família';
const DEFAULT_DESCRIPTION =
  'CuidarJuntos ajuda famílias portuguesas a organizar medicamentos, consultas, documentos, tarefas e contactos de emergência.';

const routeMeta: Record<string, { title: string; description: string; index?: boolean }> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/como-funciona': {
    title: 'Como funciona — CuidarJuntos',
    description: 'Veja como organizar cuidados familiares, medicamentos, documentos, tarefas e contactos no CuidarJuntos.',
  },
  '/blog': {
    title: 'Guias para cuidadores — CuidarJuntos',
    description: 'Guias práticos para famílias e cuidadores em Portugal.',
  },
  '/guia': {
    title: 'Guia rápido — CuidarJuntos',
    description: 'Guia rápido para começar a organizar medicamentos, consultas, tarefas, documentos e contactos de emergência.',
  },
  '/privacidade': {
    title: 'Política de Privacidade — CuidarJuntos',
    description: 'Como o CuidarJuntos recolhe, utiliza e protege dados pessoais.',
  },
  '/termos': {
    title: 'Termos de Utilização — CuidarJuntos',
    description: 'Termos de utilização do CuidarJuntos.',
  },
  '/cookies': {
    title: 'Política de Cookies — CuidarJuntos',
    description: 'Como o CuidarJuntos usa armazenamento essencial, sessão e análise técnica.',
  },
  '/cancelamento': {
    title: 'Cancelamento e Reembolsos — CuidarJuntos',
    description: 'Como funcionam os 14 dias grátis, a cobrança, o cancelamento e pedidos de apoio.',
  },
  '/seguranca': {
    title: 'Segurança dos Dados — CuidarJuntos',
    description: 'Como protegemos contas, documentos, família, pagamentos e dados de cuidado.',
  },
  '/contacto': {
    title: 'Contacto — CuidarJuntos',
    description: 'Contacte o suporte CuidarJuntos para conta, faturação, privacidade, documentos ou convites.',
  },
  '/entrar': {
    title: 'Entrar — CuidarJuntos',
    description: 'Entre na sua conta CuidarJuntos.',
    index: false,
  },
  '/criar-conta': {
    title: 'Criar conta — CuidarJuntos',
    description: 'Crie a sua conta CuidarJuntos.',
    index: false,
  },
  '/recuperar-password': {
    title: 'Recuperar password — CuidarJuntos',
    description: 'Recupere o acesso à sua conta CuidarJuntos.',
    index: false,
  },
  '/atualizar-password': {
    title: 'Atualizar password — CuidarJuntos',
    description: 'Defina uma nova password para a sua conta CuidarJuntos.',
    index: false,
  },
  '/aceitar-convite': {
    title: 'Aceitar convite — CuidarJuntos',
    description: 'Aceite um convite para colaborar num círculo de cuidado.',
    index: false,
  },
};

const setMeta = (selector: string, attr: 'content' | 'href', value: string) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attr, value);
};

const RouteMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const isDashboard = pathname.startsWith('/dashboard');
    const isBlogPost = pathname.startsWith('/blog/');
    const meta = isDashboard
      ? {
          title: 'Painel — CuidarJuntos',
          description: 'Painel privado de organização familiar no CuidarJuntos.',
          index: false,
        }
      : isBlogPost
        ? {
            title: 'Guia CuidarJuntos',
            description: 'Guia prático CuidarJuntos para famílias e cuidadores.',
          }
        : routeMeta[pathname] || {
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
            index: false,
          };

    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);
    setMeta('link[rel="canonical"]', 'href', canonical);

    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', meta.index === false ? 'noindex,nofollow' : 'index,follow');
  }, [location.pathname]);

  return null;
};

export default RouteMeta;
