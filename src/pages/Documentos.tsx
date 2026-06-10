import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../i18n/LanguageContext';
import { useCareData, DocumentCategory } from '../context/CareDataContext';
import { documentCategories } from '../data/initialData';
import HelpTip from '../components/HelpTip';

const Documentos: React.FC = () => {
  const { data, addDocument, removeDocument } = useCareData();
  const { t } = useLanguage();
  const { documents } = data;
  const [filtro, setFiltro] = useState<DocumentCategory | 'Todos'>('Todos');
  const [busca, setBusca] = useState('');
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<DocumentCategory>('Outros');
  const [dataValidade, setDataValidade] = useState('');
  const [notas, setNotas] = useState('');
  const [erro, setErro] = useState('');

  const parseDateValue = (value: string) => {
    if (!value) return null;
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) return new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`);
    const brMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (brMatch) return new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const getValidity = (value: string) => {
    const date = parseDateValue(value);
    if (!date) return { label: 'Sem validade definida', color: 'bg-surface-container-high text-on-surface-variant' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { label: 'Expirado', color: 'bg-error-container text-on-error-container' };
    }
    if (diffDays <= 30) {
      return { label: 'A expirar', color: 'bg-cj-terra/15 text-cj-terra' };
    }
    return { label: 'Válido', color: 'bg-secondary-container text-on-secondary-container' };
  };

  const filtrados = documents
    .filter((d) => (filtro === 'Todos' ? true : d.categoria === filtro))
    .filter((d) =>
      [d.titulo, d.notas].some((field) => field.toLowerCase().includes(busca.toLowerCase()))
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nomeFicheiro = titulo.trim() || 'documento_novo.pdf';
    const ok = addDocument({
      titulo: nomeFicheiro.endsWith('.pdf') || nomeFicheiro.endsWith('.jpg') ? nomeFicheiro : `${nomeFicheiro}.pdf`,
      categoria,
      dataValidade,
      notas,
    });
    if (!ok) {
      setErro('Preencha o nome do ficheiro.');
      return;
    }
    setErro('');
    setTitulo('');
    setDataValidade('');
    setNotas('');
  };

  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative ">
        <DashboardPageHeader title={t('pages.documents.title')} showSearch={false} />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <HelpTip text={t('pages.documents.help') || 'nesta demo o upload é simulado. Na versão futura poderá guardar ficheiros reais com segurança.'} />
          <div className="grid gap-4 mb-stack-lg md:grid-cols-[2fr_1fr]">
            <div>
              <label className="text-label-sm text-on-surface-variant mb-2 inline-block">Pesquisar documentos</label>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Procure por nome ou notas"
                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFiltro('Todos')}
                className={`px-4 py-2 rounded-full text-label-md font-bold transition-colors ${
                  filtro === 'Todos'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Todos
              </button>
              {documentCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFiltro(cat)}
                  className={`px-4 py-2 rounded-full text-label-md font-medium transition-colors ${
                    filtro === cat
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {filtrados.length === 0 ? (
                <EmptyState message={t('pages.documents.empty')} icon="folder_open" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtrados.map((doc) => (
                    <div
                      key={doc.id}
                      className="glass-card p-5 rounded-2xl soft-shadow border border-white/40 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">
                          {doc.titulo.endsWith('.pdf') ? 'picture_as_pdf' : 'image'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <p className="text-label-md font-bold text-on-surface truncate">{doc.titulo}</p>
                              <span className="inline-block mt-1 px-2 py-0.5 bg-primary-fixed/20 text-primary rounded-full text-[10px] font-bold">
                                {doc.categoria}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(doc.id)}
                              className="p-1 rounded-full hover:bg-error-container/30 text-error transition-colors shrink-0"
                              aria-label="Remover documento"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                          <p className="text-label-sm text-on-surface-variant mt-2">
                            Adicionado {doc.dataAdicao.toLowerCase()}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${getValidity(doc.dataValidade).color}`}
                            >
                              {getValidity(doc.dataValidade).label}
                            </span>
                          </div>
                          {doc.dataValidade && (
                            <p className="text-label-sm text-on-surface-variant">
                              Validade: {doc.dataValidade}
                            </p>
                          )}
                          {doc.notas && (
                            <p className="text-label-sm text-on-surface-variant italic mt-1">{doc.notas}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center mb-6">
                <span className="material-symbols-outlined text-primary text-4xl mb-2">cloud_upload</span>
                <p className="text-label-md font-bold text-on-surface">Envio simulado</p>
                <p className="text-label-sm text-on-surface-variant">PDF, JPG ou PNG até 10 MB</p>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-4">Adicionar documento</h3>
              {erro && (
                <p className="text-label-sm text-error mb-4 p-3 bg-error-container/20 rounded-xl">{erro}</p>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Nome do ficheiro *</label>
                  <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Análises_Julho_2024.pdf"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as DocumentCategory)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {documentCategories.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Data de validade</label>
                  <input
                    value={dataValidade}
                    onChange={(e) => setDataValidade(e.target.value)}
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    type="date"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Notas</label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Descrição opcional..."
                    rows={2}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:opacity-90 transition-all"
                >
                  Guardar documento
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Documentos;
