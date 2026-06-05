import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function VoluntarioDashboard({ fazerLogout }) {
  const [abaAtiva, setAbaAtiva] = useState('explorar'); // 'explorar', 'guardadas' ou 'minhas-candidaturas'
  const [vagas, setVagas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  
  // Estados para os Favoritos
  const [vagasGuardadasDados, setVagasGuardadasDados] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]);
  
  // Estados para os Filtros do Wireframe
  const [filtroLocalizacao, setFiltroLocalizacao] = useState('');
  const [filtroCausa, setFiltroCausa] = useState('');
  const [filtroDisponibilidade, setFiltroDisponibilidade] = useState('');
  
  const [aCarregar, setACarregar] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:3001/api/vagas').then(res => res.json()),
      fetch('http://127.0.0.1:3001/api/candidaturas/minhas', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),
      fetch('http://127.0.0.1:3001/api/favoritos', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json())
    ])
    .then(([dadosVagas, dadosCandidaturas, dadosFavoritos]) => {
      setVagas(dadosVagas);
      setCandidaturas(dadosCandidaturas);
      
      const favsArray = Array.isArray(dadosFavoritos) ? dadosFavoritos : [];
      setVagasGuardadasDados(favsArray);
      setFavoritosIds(favsArray.map(f => f._id));
      
      setACarregar(false);
    })
    .catch(erro => {
      console.error("Erro ao carregar dados da dashboard:", erro);
      setACarregar(false);
    });
  }, [token]);

  const alternarFavorito = async (vagaId) => {
    try {
      const resposta = await fetch('http://127.0.0.1:3001/api/favoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ vagaId })
      });
      if (resposta.ok) {
        const novaListaIds = await resposta.json();
        setFavoritosIds(novaListaIds);
        
        const resFavs = await fetch('http://127.0.0.1:3001/api/favoritos', { headers: { 'Authorization': `Bearer ${token}` } });
        const dataFavs = await resFavs.json();
        setVagasGuardadasDados(Array.isArray(dataFavs) ? dataFavs : []);
      }
    } catch (erro) {
      console.error("Erro ao atualizar favoritos:", erro);
    }
  };

  // Lógica de Filtragem Corrigida
  const vagasFiltradas = vagas.filter(vaga => {
    // 1. Se a vaga estiver explicitamente desativada, esconde. Se for undefined/antiga, mostra!
    if (vaga.ativa === false) return false;
    
    // 2. Filtros de Pesquisa (ignora maiúsculas/minúsculas e espaços extra por segurança)
    if (filtroLocalizacao && (!vaga.localizacao || vaga.localizacao.trim().toLowerCase() !== filtroLocalizacao.toLowerCase())) return false;
    
    if (filtroCausa && (!vaga.causa || vaga.causa.trim().toLowerCase() !== filtroCausa.toLowerCase())) return false;
    
    if (filtroDisponibilidade && (!vaga.disponibilidade || vaga.disponibilidade.trim().toLowerCase() !== filtroDisponibilidade.toLowerCase())) return false;
    
    return true;
  });

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* CABEÇALHO */}
      <header style={{ backgroundColor: '#111827', color: 'white', padding: '0' }}>
        <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '1.8rem' }}>Lig<span style={{ color: '#3b82f6' }}>Ação</span></h1>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>Portal do Voluntário</p>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/perfil" style={{ color: '#d1d5db', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
              ⚙️ Definições de Conta
            </Link>
            <button onClick={fazerLogout} style={{ backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Terminar Sessão
            </button>
          </div>
        </div>

        {/* Menu de Separadores */}
        <div style={{ display: 'flex', gap: '10px', padding: '0 40px', backgroundColor: '#1f2937' }}>
          <TabButton ativa={abaAtiva === 'explorar'} onClick={() => setAbaAtiva('explorar')}>
            🔍 Explorar Oportunidades
          </TabButton>
          <TabButton ativa={abaAtiva === 'guardadas'} onClick={() => setAbaAtiva('guardadas')}>
            ❤️ Vagas Guardadas ({favoritosIds.length})
          </TabButton>
          <TabButton ativa={abaAtiva === 'minhas-candidaturas'} onClick={() => setAbaAtiva('minhas-candidaturas')}>
            📋 As Minhas Candidaturas ({candidaturas.length})
          </TabButton>
        </div>
      </header>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {aCarregar ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#6b7280' }}>A carregar a sua área...</div>
        ) : (
          <>
            {/* =========================================
                ABA 1: EXPLORAR VAGAS
            ========================================= */}
            {abaAtiva === 'explorar' && (
              <>
                <h2 style={{ color: '#111827', marginBottom: '24px' }}>Oportunidades de Voluntariado</h2>
                
                {/* BARRA DE FILTROS DO WIREFRAME */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '40px', backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: '200px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: '#4b5563' }}>Onde?</label>
                    <select value={filtroLocalizacao} onChange={e => setFiltroLocalizacao(e.target.value)} style={estiloSelect}>
                      <option value="">Localização</option>
                      <option value="Lisboa">Lisboa</option>
                      <option value="Porto">Porto</option>
                      <option value="Braga">Braga</option>
                      <option value="Faro">Faro</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: '200px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: '#4b5563' }}>Qual a Causa?</label>
                    <select value={filtroCausa} onChange={e => setFiltroCausa(e.target.value)} style={estiloSelect}>
                      <option value="">Causa</option>
                      <option value="Ambiente">Ambiente</option>
                      <option value="Animais">Animais</option>
                      <option value="Educação">Educação</option>
                      <option value="Apoio Social">Apoio Social</option>
                      <option value="Saúde">Saúde</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: '200px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: '#4b5563' }}>Disponibilidade</label>
                    <select value={filtroDisponibilidade} onChange={e => setFiltroDisponibilidade(e.target.value)} style={estiloSelect}>
                      <option value="">Disponibilidade</option>
                      <option value="Fim de Semana">Fim de Semana</option>
                      <option value="Dias Úteis">Dias Úteis</option>
                    </select>
                  </div>

                  <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0 32px', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', height: '48px' }}>
                    Procurar
                  </button>
                </div>

                {/* GRELHA DE VAGAS FILTRADAS */}
                {vagasFiltradas.length === 0 ? (
                  <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <p style={{ color: '#6b7280', margin: 0 }}>Nenhuma oportunidade encontrada com esses filtros.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {vagasFiltradas.map(vaga => (
                      <div key={vaga._id} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        
                        {/* BOTÃO DE CORAÇÃO DOS FAVORITOS */}
                        <button 
                          onClick={() => alternarFavorito(vaga._id)}
                          style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '1.2rem', zIndex: 10 }}
                        >
                          {favoritosIds.includes(vaga._id) ? '❤️' : '🤍'}
                        </button>

                        <div style={{ height: '140px', backgroundImage: `url(${vaga.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#f3f4f6' }}></div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1d4ed8', backgroundColor: '#dbeafe', padding: '4px 10px', borderRadius: '12px', alignSelf: 'flex-start', marginBottom: '12px' }}>
                            {vaga.causa}
                          </span>
                          <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>{vaga.titulo}</h3>
                          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1 }}>📍 {vaga.localizacao}</p>
                          {/* LÓGICA DA BARRA DE PROGRESSO */}
{(() => {
  const preenchidas = vaga.vagasPreenchidas || 0;
  const totais = vaga.vagasTotais || 1; // Previne divisão por zero
  const percentagem = Math.min((preenchidas / totais) * 100, 100);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px', fontWeight: 'bold' }}>
        <span>Progresso: {preenchidas}/{totais} vagas</span>
        <span>{Math.round(percentagem)}%</span>
      </div>
      <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
        <div style={{ 
          width: `${percentagem}%`, 
          backgroundColor: percentagem === 100 ? '#10b981' : '#3b82f6', // Verde se cheio, azul se em progresso
          height: '100%', 
          transition: 'width 0.3s ease' 
        }}></div>
      </div>
    </div>
  );
})()}
                          <Link to={`/vaga/${vaga._id}`} style={{ textAlign: 'center', textDecoration: 'none', backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>
                            Ver Detalhes
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* =========================================
                ABA 2: VAGAS GUARDADAS
            ========================================= */}
            {abaAtiva === 'guardadas' && (
              <>
                <h2 style={{ color: '#111827', marginBottom: '24px' }}>As Suas Vagas Guardadas</h2>
                
                {vagasGuardadasDados.length === 0 ? (
                  <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <p style={{ color: '#6b7280', margin: 0 }}>Ainda não tem vagas guardadas. Navegue na aba "Explorar" e clique no coração para guardar!</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {vagasGuardadasDados.map(vaga => (
                      <div key={vaga._id} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        
                        <button 
                          onClick={() => alternarFavorito(vaga._id)}
                          style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '1.2rem', zIndex: 10 }}
                        >
                  
                        </button>

                        <div style={{ height: '140px', backgroundImage: `url(${vaga.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#f3f4f6' }}></div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1d4ed8', backgroundColor: '#dbeafe', padding: '4px 10px', borderRadius: '12px', alignSelf: 'flex-start', marginBottom: '12px' }}>
                            {vaga.causa}
                          </span>
                          <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>{vaga.titulo}</h3>
                          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1 }}>📍 {vaga.localizacao}</p>
                          
                          <Link to={`/vaga/${vaga._id}`} style={{ textAlign: 'center', textDecoration: 'none', backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>
                            Ver Detalhes
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* =========================================
                ABA 3: AS MINHAS CANDIDATURAS
            ========================================= */}
            {abaAtiva === 'minhas-candidaturas' && (
              <>
                <h2 style={{ color: '#111827', marginBottom: '24px' }}>Estado das suas Candidaturas</h2>
                
                {candidaturas.length === 0 ? (
                  <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <p style={{ color: '#6b7280', margin: 0 }}>Ainda não se candidatou a nenhuma oportunidade.</p>
                    <button onClick={() => setAbaAtiva('explorar')} style={{ marginTop: '16px', backgroundColor: '#111827', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Explorar Vagas</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {candidaturas.map(cand => (
                      <div key={cand._id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        
                        <div>
                          <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>{cand.vagaId?.titulo || 'Vaga Removida'}</h3>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                            📍 {cand.vagaId?.localizacao || 'N/A'} | Enviada a: {new Date(cand.data).toLocaleDateString('pt-PT')}
                          </p>
                        </div>

                        <div style={{ padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem',
                          backgroundColor: cand.estado === 'pendente' ? '#fef3c7' : cand.estado === 'aceite' ? '#dcfce7' : '#fee2e2',
                          color: cand.estado === 'pendente' ? '#d97706' : cand.estado === 'aceite' ? '#166534' : '#991b1b',
                          border: `1px solid ${cand.estado === 'pendente' ? '#fde68a' : cand.estado === 'aceite' ? '#bbf7d0' : '#fecaca'}`
                        }}>
                          {cand.estado === 'pendente' && '⏳ Em Análise'}
                          {cand.estado === 'aceite' && '🎉 Aceite!'}
                          {cand.estado === 'rejeitada' && '❌ Não Selecionado'}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </>
        )}
      </main>
    </div>
  );
}

// Componentes Auxiliares
function TabButton({ children, ativa, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: '16px 24px', backgroundColor: 'transparent', border: 'none', borderBottom: ativa ? '4px solid #3b82f6' : '4px solid transparent', color: ativa ? 'white' : '#9ca3af', fontSize: '1rem', fontWeight: ativa ? 'bold' : '600', cursor: 'pointer', transition: 'all 0.2s' }}>
      {children}
    </button>
  );
}

const estiloSelect = {
  padding: '12px 16px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  backgroundColor: '#f9fafb',
  fontSize: '0.95rem',
  color: '#374151',
  outline: 'none',
  height: '48px',
  cursor: 'pointer'
};