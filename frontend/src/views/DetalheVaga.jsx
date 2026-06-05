import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function DetalheVaga() {
  const { id } = useParams(); // Vai buscar o ID ao URL (ex: /vaga/123)
  const navigate = useNavigate();
  
  const [vaga, setVaga] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [aCarregar, setACarregar] = useState(true);

  // Carrega os dados desta vaga específica
  useEffect(() => {
    fetch(`/api/vagas/${id}`)
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

  // Função para formalizar a candidatura
  const fazerCandidatura = async () => {
    const token = localStorage.getItem('token');
    
    // Se não estiver logado, manda para o login com um aviso
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
      
      {/* Navbar Simples */}
      <nav style={{ padding: '20px 40px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ color: '#2563eb', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Lig<span style={{ color: '#111827' }}>Ação</span></h2>
        </Link>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: 'bold' }}>
          ← Voltar atrás
        </button>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', width: '100%' }}>
        
        {/* Alertas */}
        {mensagem.texto && (
          <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px', backgroundColor: mensagem.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2', color: mensagem.tipo === 'sucesso' ? '#166534' : '#991b1b' }}>
            {mensagem.texto}
          </div>
        )}

        {/* Layout Principal: 2 Colunas */}
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          
          {/* Coluna da Esquerda (Detalhes e Texto) */}
          <div style={{ flex: '2 1 600px', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            {vaga.imagem ? (
              <img src={vaga.imagem} alt="Capa da vaga" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '150px', backgroundColor: '#dbeafe' }}></div>
            )}
            
            <div style={{ padding: '32px' }}>
              <span style={{ display: 'inline-block', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '16px' }}>
                {vaga.causa}
              </span>
              <h1 style={{ margin: '0 0 16px 0', fontSize: '2rem', color: '#111827' }}>{vaga.titulo}</h1>
              
              <h3 style={{ color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginTop: '32px' }}>Descrição da Missão</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {vaga.descricaoCurta}
              </p>
            </div>
          </div>

          {/* Coluna da Direita (Cartão de Conversão) */}
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', position: 'sticky', top: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#111827' }}>Resumo da Oportunidade</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div>
                  <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem' }}>📍 Localização</strong>
                  <span style={{ color: '#111827', fontWeight: '500' }}>{vaga.localizacao}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem' }}>⏰ Disponibilidade</strong>
                  <span style={{ color: '#111827', fontWeight: '500' }}>{vaga.disponibilidade}</span>
                </div>
              </div>

              <button 
                onClick={fazerCandidatura}
                disabled={mensagem.tipo === 'sucesso'}
                style={{ width: '100%', padding: '16px', borderRadius: '8px', border: 'none', backgroundColor: mensagem.tipo === 'sucesso' ? '#10b981' : '#2563eb', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: mensagem.tipo === 'sucesso' ? 'default' : 'pointer', transition: 'background-color 0.2s' }}
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