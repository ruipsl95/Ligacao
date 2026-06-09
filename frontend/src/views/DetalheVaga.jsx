import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function DetalheVaga() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // NOVO: Detetor de telemóvel
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [vaga, setVaga] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [aCarregar, setACarregar] = useState(true);

  // NOVO: Listener de redimensionamento
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch(`https://ligacao-backend.onrender.com/api/vagas/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) throw new Error(data.erro);
        setVaga(data);
        setACarregar(false);
      })
      .catch(erro => {
        setMensagem({ texto: 'Não foi possível encontrar esta oportunidade.', tipo: 'erro' });
        setACarregar(false);
      });
  }, [id]);

  const fazerCandidatura = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login', { state: { mensagemSucesso: 'Faça login ou crie conta para se candidatar a esta vaga.' } });
      return;
    }

    try {
      const resposta = await fetch('https://ligacao-backend.onrender.com/api/candidaturas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ vagaId: vaga._id })
      });

      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || 'Erro ao submeter candidatura.');

      setMensagem({ texto: 'Candidatura enviada com sucesso! A ONG irá contactá-lo brevemente.', tipo: 'sucesso' });
    } catch (error) {
      setMensagem({ texto: error.message, tipo: 'erro' });
    }
  };

  if (aCarregar) return <div style={{ textAlign: 'center', marginTop: '50px' }}>A carregar oportunidade...</div>;
  if (!vaga) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{mensagem.texto}</div>;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar (Adaptada) */}
      <nav style={{ padding: isMobile ? '16px 20px' : '20px 40px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ color: '#2563eb', margin: 0, fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: '800' }}>Lig<span style={{ color: '#111827' }}>Ação</span></h2>
        </Link>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
          ← Voltar
        </button>
      </nav>

      <main style={{ maxWidth: '1000px', margin: isMobile ? '20px auto' : '40px auto', padding: isMobile ? '0 16px' : '0 20px', width: '100%', boxSizing: 'border-box' }}>
        
        {mensagem.texto && (
          <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px', backgroundColor: mensagem.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2', color: mensagem.tipo === 'sucesso' ? '#166534' : '#991b1b' }}>
            {mensagem.texto}
          </div>
        )}

        {/* Layout Principal: 2 Colunas (Empilha em column no mobile) */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '24px' : '32px' }}>
          
          {/* Coluna da Esquerda */}
          <div style={{ flex: isMobile ? 'none' : '2 1 600px', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            {vaga.imagem ? (
              <img src={vaga.imagem} alt="Capa da vaga" style={{ width: '100%', height: isMobile ? '200px' : '300px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: isMobile ? '150px' : '150px', backgroundColor: '#dbeafe' }}></div>
            )}
            
            <div style={{ padding: isMobile ? '20px' : '32px' }}>
              <span style={{ display: 'inline-block', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '16px' }}>
                {vaga.causa}
              </span>
              <h1 style={{ margin: '0 0 16px 0', fontSize: isMobile ? '1.6rem' : '2rem', color: '#111827' }}>{vaga.titulo}</h1>
              
              <h3 style={{ color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginTop: isMobile ? '24px' : '32px', fontSize: isMobile ? '1.1rem' : '1.17em' }}>Descrição da Missão</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontSize: isMobile ? '0.95rem' : '1rem' }}>
                {vaga.descricaoCurta}
              </p>
            </div>
          </div>

          {/* Coluna da Direita (Adaptado: Perde o 'sticky' no telemóvel para não sobrepor nada) */}
          <div style={{ flex: isMobile ? 'none' : '1 1 300px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '20px' : '24px', border: '1px solid #e5e7eb', position: isMobile ? 'static' : 'sticky', top: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#111827', fontSize: isMobile ? '1.1rem' : '1.17em' }}>Resumo da Oportunidade</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div>
                  <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem' }}>📍 Localização</strong>
                  <span style={{ color: '#111827', fontWeight: '500', fontSize: isMobile ? '0.95rem' : '1rem' }}>{vaga.localizacao}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem' }}>⏰ Disponibilidade</strong>
                  <span style={{ color: '#111827', fontWeight: '500', fontSize: isMobile ? '0.95rem' : '1rem' }}>{vaga.disponibilidade}</span>
                </div>
              </div>

              <button 
                onClick={fazerCandidatura}
                disabled={mensagem.tipo === 'sucesso'}
                style={{ width: '100%', padding: '16px', borderRadius: '8px', border: 'none', backgroundColor: mensagem.tipo === 'sucesso' ? '#10b981' : '#2563eb', color: 'white', fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.1rem', cursor: mensagem.tipo === 'sucesso' ? 'default' : 'pointer', transition: 'background-color 0.2s' }}
              >
                {mensagem.tipo === 'sucesso' ? '✓ Candidatura Enviada' : 'Quero Candidatar-me'}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}