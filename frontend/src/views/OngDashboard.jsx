import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function OngDashboard({ fazerLogout }) {
  // Estados de Navegação e Interface
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('visao-geral'); // 'visao-geral', 'candidaturas', 'causas'
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  
  // Estados de Dados (Backend)
  const [vagas, setVagas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]); 
  const [causas, setCausas] = useState([]); // NOVO: Guarda as causas
  
  // Estados do Formulário de Vagas
  const [idEdicao, setIdEdicao] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricaoCurta, setDescricaoCurta] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [disponibilidade, setDisponibilidade] = useState('');
  const [causa, setCausa] = useState('');
  const [imagem, setImagem] = useState('');
  const [vagasTotais, setVagasTotais] = useState(1); 

  // Estado do Formulário de Causas
  const [novaCausaNome, setNovaCausaNome] = useState('');

  const token = localStorage.getItem('token');

  // =====================================
  // CARREGAMENTO DE DADOS
  // =====================================
  const carregarVagas = () => {
    fetch('https://ligacao-backend.onrender.com/api/vagas')
      .then(res => res.json())
      .then(data => setVagas(data))
      .catch(erro => console.error("Erro ao carregar vagas:", erro));
  };

  const carregarCandidaturas = async () => {
    try {
      const resposta = await fetch('https://ligacao-backend.onrender.com/api/candidaturas/minhas-vagas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resposta.ok) {
        const data = await resposta.json();
        setCandidaturas(data);
      }
    } catch (error) {
      console.error("Erro ao carregar candidaturas:", error);
    }
  };

  const carregarCausas = async () => {
    try {
      const res = await fetch('https://ligacao-backend.onrender.com/api/causas');
      const data = await res.json();
      setCausas(data);
    } catch (erro) {
      console.error("Erro ao carregar causas:", erro);
    }
  };

  useEffect(() => {
    carregarVagas();
    carregarCandidaturas();
    carregarCausas(); // Carrega as causas logo ao início
  }, []);


  // =====================================
  // AÇÕES DAS CAUSAS
  // =====================================
  const submeterNovaCausa = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch('https://ligacao-backend.onrender.com/api/causas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nome: novaCausaNome })
      });
      const data = await resposta.json();
      if (!resposta.ok) throw new Error(data.erro);
      
      setMensagem({ texto: 'Causa adicionada com sucesso!', tipo: 'sucesso' });
      setNovaCausaNome('');
      carregarCausas(); // Atualiza a lista
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      setMensagem({ texto: error.message, tipo: 'erro' });
    }
  };

  const removerCausa = async (id) => {
    if (!window.confirm('Tem a certeza que deseja remover esta causa?')) return;
    try {
      await fetch(`/api/causas/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      carregarCausas();
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================
  // AÇÕES DAS VAGAS E CANDIDATURAS
  // =====================================
  const mudarEstadoCandidatura = async (id, novoEstado) => {
    try {
      const resposta = await fetch(`/api/candidaturas/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        // A CORREÇÃO ESTÁ AQUI (enviar "novoEstado" como propriedade):
        body: JSON.stringify({ novoEstado: novoEstado }) 
      });

      if (!resposta.ok) throw new Error('Erro ao atualizar candidatura');
      
      // Atualiza a lista na hora, e a barra vai descer magicamente!
      carregarCandidaturas(); 
      setMensagem({ texto: `Candidatura ${novoEstado} com sucesso!`, tipo: 'sucesso' });
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      setMensagem({ texto: 'Erro ao processar decisão.', tipo: 'erro' });
    }
  };

  const guardarVaga = async (e) => {
    e.preventDefault();
    const metodo = idEdicao ? 'PUT' : 'POST';
    const url = idEdicao ? `/api/vagas/${idEdicao}` : '/api/vagas';

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ titulo, descricaoCurta, localizacao, disponibilidade, causa, imagem, vagasTotais })
      });
      if (!resposta.ok) throw new Error('Erro ao guardar.');
      
      setMensagem({ texto: idEdicao ? 'Atualizada!' : 'Publicada!', tipo: 'sucesso' });
      carregarVagas();
      setTimeout(() => fecharFormulario(), 1500);
    } catch (error) {
      setMensagem({ texto: error.message, tipo: 'erro' });
    }
  };

  const removerVaga = async (id) => {
    if (!window.confirm('Remover esta oportunidade?')) return;
    try {
      await fetch(`/api/vagas/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      setVagas(vagas.filter(v => v._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const iniciarEdicao = (vaga) => {
    setTitulo(vaga.titulo); setDescricaoCurta(vaga.descricaoCurta); setLocalizacao(vaga.localizacao);
    setDisponibilidade(vaga.disponibilidade); setCausa(vaga.causa); setImagem(vaga.imagem || '');
    setVagasTotais(vaga.vagasTotais || 1);
    setIdEdicao(vaga._id); setMostrarFormulario(true);
  };

  const fecharFormulario = () => {
    setTitulo(''); setDescricaoCurta(''); setLocalizacao(''); setDisponibilidade(''); setCausa(''); setImagem(''); setVagasTotais(1);
    setIdEdicao(null); setMostrarFormulario(false);
  };

  // CÁLCULOS DINÂMICOS PARA OS KPIs
  const kpiVagasAtivas = vagas.length;
  const kpiVoluntariosNecessarios = vagas.reduce((soma, v) => soma + (v.vagasTotais || 1), 0);
  const kpiCandidaturasPendentes = candidaturas.filter(c => c.estado === 'pendente').length;
  const kpiCandidaturasAceites = candidaturas.filter(c => c.estado === 'aceite').length;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* CABEÇALHO */}
      <nav style={{ backgroundColor: '#111827', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white', margin: 0, fontWeight: '800' }}>Lig<span style={{ color: '#3b82f6' }}>Ação</span> <span style={{fontSize: '1rem', fontWeight: '400', color: '#9ca3af'}}>| Portal ONG</span></h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/perfil" style={{ color: '#9ca3af', textDecoration: 'none', fontWeight: '600' }}>
            Definições de Conta
          </Link>
          <button onClick={fazerLogout} style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Terminar Sessão
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ color: '#111827', margin: '0 0 8px 0' }}>Gestão de Oportunidades</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Administre as suas vagas e aprove voluntários.</p>
          </div>
          <button onClick={mostrarFormulario ? fecharFormulario : () => setMostrarFormulario(true)} style={{ backgroundColor: mostrarFormulario ? '#4b5563' : '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {mostrarFormulario ? 'Voltar para as Listas' : '+ Criar Nova Vaga'}
          </button>
        </div>

        {/* MENSAGENS DE SUCESSO/ERRO */}
        {mensagem.texto && (
          <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px', backgroundColor: mensagem.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2', color: mensagem.tipo === 'sucesso' ? '#166534' : '#991b1b', border: `1px solid ${mensagem.tipo === 'sucesso' ? '#bbf7d0' : '#fecaca'}` }}>
            {mensagem.texto}
          </div>
        )}

        {/* NAVEGAÇÃO DOS SEPARADORES (Só aparece se o formulário estiver fechado) */}
        {!mostrarFormulario && (
          <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', marginBottom: '32px' }}>
            <button 
              onClick={() => setAbaAtiva('visao-geral')} 
              style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: abaAtiva === 'visao-geral' ? '3px solid #2563eb' : '3px solid transparent', color: abaAtiva === 'visao-geral' ? '#2563eb' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginBottom: '-2px' }}>
              Visão Geral
            </button>
            <button 
              onClick={() => setAbaAtiva('candidaturas')} 
              style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: abaAtiva === 'candidaturas' ? '3px solid #2563eb' : '3px solid transparent', color: abaAtiva === 'candidaturas' ? '#2563eb' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginBottom: '-2px' }}>
              Gestão de Candidaturas
            </button>
            <button 
              onClick={() => setAbaAtiva('causas')} 
              style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: abaAtiva === 'causas' ? '3px solid #2563eb' : '3px solid transparent', color: abaAtiva === 'causas' ? '#2563eb' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginBottom: '-2px' }}>
              Gestão de Causas
            </button>
          </div>
        )}


        {/* =========================================
            FORMULÁRIO DE NOVA/EDITAR VAGA
        ========================================= */}
        {mostrarFormulario ? (
           <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
           <h2 style={{ marginBottom: '24px', color: '#111827' }}>{idEdicao ? '✏️ Editar Oportunidade' : '📋 Nova Oportunidade'}</h2>
           <form onSubmit={guardarVaga} style={{ display: 'grid', gap: '20px' }}>
             
             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Título</label>
                 <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required style={estiloInput} />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Nº de Voluntários</label>
                 <input type="number" min="1" value={vagasTotais} onChange={e => setVagasTotais(parseInt(e.target.value) || 1)} required style={estiloInput} />
               </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Causa</label>
                 <select value={causa} onChange={e => setCausa(e.target.value)} required style={estiloInput}>
                   <option value="">Selecione...</option>
                   {/* MAPA DINÂMICO DE CAUSAS DO BACKEND */}
                   {causas.map(c => (
                     <option key={c._id} value={c.nome}>{c.nome}</option>
                   ))}
                 </select>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Localização</label>
                 <input type="text" value={localizacao} onChange={e => setLocalizacao(e.target.value)} required style={estiloInput} />
               </div>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Disponibilidade</label>
                 <input type="text" value={disponibilidade} onChange={e => setDisponibilidade(e.target.value)} required style={estiloInput} />
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>URL da Imagem de Capa (Opcional)</label>
               <input type="url" value={imagem} onChange={e => setImagem(e.target.value)} placeholder="Ex: https://site.com/foto.jpg" style={estiloInput} />
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Descrição</label>
               <textarea value={descricaoCurta} onChange={e => setDescricaoCurta(e.target.value)} required rows="3" style={estiloInput}></textarea>
             </div>
             
             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
               <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                 {idEdicao ? 'Atualizar Vaga' : 'Publicar Vaga'}
               </button>
             </div>
           </form>
         </div>
        ) : (
          <>
            {/* =========================================
                ABA 1: VISÃO GERAL (KPIs e Lista de Vagas)
            ========================================= */}
            {abaAtiva === 'visao-geral' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
                  <KpiCard titulo="Vagas Ativas" valor={kpiVagasAtivas} cor="#3b82f6" onClick={() => setAbaAtiva('visao-geral')} />
                  <KpiCard titulo="Voluntários Precisos" valor={kpiVoluntariosNecessarios} cor="#10b981" onClick={() => setAbaAtiva('visao-geral')} />
                  <KpiCard titulo="Por Rever" valor={kpiCandidaturasPendentes} cor="#f59e0b" alert={kpiCandidaturasPendentes > 0} onClick={() => setAbaAtiva('candidaturas')} />
                  <KpiCard titulo="Aceites" valor={kpiCandidaturasAceites} cor="#8b5cf6" onClick={() => setAbaAtiva('candidaturas')} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>As Suas Vagas Ativas</h3>
                  {vagas.length === 0 ? (
                     <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px', border: '1px solid #e5e7eb', textAlign: 'center' }}><h3 style={{ color: '#374151' }}>Ainda não tem vagas ativas</h3></div>
                  ) : (
                    vagas.map(vaga => (
                      <div key={vaga._id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ margin: '0 0 4px 0', color: '#111827' }}>{vaga.titulo}</h3>
                          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>📍 {vaga.localizacao} | 👥 Precisa de {vaga.vagasTotais || 1} pessoas</div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button onClick={() => iniciarEdicao(vaga)} style={{ backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Editar</button>
                          <button onClick={() => removerVaga(vaga._id)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Remover</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* =========================================
                ABA 2: GESTÃO DE CANDIDATURAS
            ========================================= */}
            {abaAtiva === 'candidaturas' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>Gestão de Candidaturas</h3>
                {candidaturas.length === 0 ? (
                  <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px dashed #d1d5db', textAlign: 'center' }}>
                    <p style={{ color: '#6b7280', margin: 0 }}>Nenhuma candidatura recebida ainda.</p>
                  </div>
                ) : (
                  candidaturas.map(cand => (
                    <div key={cand._id} style={{ backgroundColor: cand.estado === 'pendente' ? '#fffbeb' : 'white', borderRadius: '12px', padding: '20px', border: cand.estado === 'pendente' ? '1px solid #fde68a' : '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      
                      <div>
                        {cand.estado === 'pendente' && <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#d97706', textTransform: 'uppercase', letterSpacing: '1px' }}>A Aguardar Resposta</span>}
                        {cand.estado === 'aceite' && <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px' }}>Voluntário Aceite</span>}
                        {cand.estado === 'rejeitada' && <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '1px' }}>Rejeitada</span>}
                        
                        <h4 style={{ margin: '8px 0 4px 0', color: '#1f2937', fontSize: '1.1rem' }}>👤 {cand.voluntarioId?.nome}</h4>
                        <p style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: '0.9rem' }}>✉️ {cand.voluntarioId?.email}</p>
                        <span style={{ fontSize: '0.85rem', color: '#374151', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                          Inscrito em: <b>{cand.vagaId?.titulo || 'Vaga Removida'}</b>
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {cand.estado === 'pendente' ? (
                          <>
                            <button onClick={() => mudarEstadoCandidatura(cand._id, 'rejeitada')} style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Recusar</button>
                            <button onClick={() => mudarEstadoCandidatura(cand._id, 'aceite')} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Aceitar</button>
                          </>
                        ) : (
                          <a href={`mailto:${cand.voluntarioId?.email}`} style={{ textDecoration: 'none', backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            Enviar Email
                          </a>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* =========================================
                ABA 3: GESTÃO DE CAUSAS
            ========================================= */}
            {abaAtiva === 'causas' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                
                {/* Formulário para adicionar nova */}
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', height: 'fit-content' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#111827' }}>Adicionar Nova Causa</h3>
                  <form onSubmit={submeterNovaCausa} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input 
                      type="text" 
                      value={novaCausaNome} 
                      onChange={e => setNovaCausaNome(e.target.value)} 
                      placeholder="Ex: Combate à Fome" 
                      required 
                      style={estiloInput} 
                    />
                    <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      + Guardar Causa
                    </button>
                  </form>
                </div>

                {/* Lista das causas existentes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#374151' }}>Causas Disponíveis na Plataforma</h3>
                  {causas.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>Nenhuma causa registada ainda.</p>
                  ) : (
                    causas.map(c => (
                      <div key={c._id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{c.nome}</span>
                        <button onClick={() => removerCausa(c._id)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          Remover
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </main>
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================
function KpiCard({ titulo, valor, cor, alert, onClick }) {
  return (
    <div 
      onClick={onClick} 
      style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', borderTop: `4px solid ${cor}`, position: 'relative', cursor: 'pointer', transition: 'transform 0.2s' }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {alert && <span style={{ position: 'absolute', top: '10px', right: '10px', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>}
      <h3 style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.85rem', textTransform: 'uppercase' }}>{titulo}</h3>
      <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827' }}>{valor}</div>
    </div>
  );
}

const estiloInput = { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', fontSize: '0.95rem', fontFamily: 'inherit' };