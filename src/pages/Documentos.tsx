import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardPageHeader from '../components/DashboardPageHeader';
import { documents, documentCategories } from '../data/mockData';

const Documentos: React.FC = () => {
  return (
    <DashboardLayout>
      <main className="flex-1 w-full relative pb-24 lg:pb-8">
        <DashboardPageHeader
          title="Documentos"
          showSearch={false}
          action={
            <button
              type="button"
              className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined">upload</span>
              <span className="text-label-md">Enviar</span>
            </button>
          }
        />

        <div className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
          <div className="flex flex-wrap gap-2 mb-stack-lg">
            <button
              type="button"
              className="px-4 py-2 bg-primary text-on-primary rounded-full text-label-md font-bold"
            >
              Todos
            </button>
            {documentCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-full text-label-md font-medium hover:bg-surface-container-high transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card p-5 rounded-2xl soft-shadow border border-white/40 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      {doc.titulo.endsWith('.pdf') ? 'picture_as_pdf' : 'image'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-label-md font-bold text-on-surface truncate">{doc.titulo}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary-fixed/20 text-primary rounded-full text-[10px] font-bold">
                        {doc.categoria}
                      </span>
                      <p className="text-label-sm text-on-surface-variant mt-2">
                        Adicionado {doc.dataAdicao.toLowerCase()}
                      </p>
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

            <div className="glass-card rounded-[24px] p-6 soft-shadow border border-white/40 h-fit">
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center mb-6">
                <span className="material-symbols-outlined text-primary text-4xl mb-2">cloud_upload</span>
                <p className="text-label-md font-bold text-on-surface">Arrastar ficheiro ou clicar</p>
                <p className="text-label-sm text-on-surface-variant">PDF, JPG ou PNG até 10 MB</p>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-4">Enviar documento</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Título</label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Ex: Análises de julho"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Categoria</label>
                  <select className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none">
                    {documentCategories.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">
                    Data de validade
                  </label>
                  <input
                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    type="date"
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Notas</label>
                  <textarea
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
