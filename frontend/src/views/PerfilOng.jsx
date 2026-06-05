import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function PerfilOng() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ong, setOng] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [aCarregar, setACarregar] = useState(true);

  useEffect(() => {
  
    Promise.all([
      fetch(`/api/ongs/${id}`).then(res => res.json()),
      fetch(`/api/ongs/${id}/vagas`).then(res => res.json())
    ])
    .then(([dadosOng, dadosVagas]) => {
      setOng(dadosOng);
      setVagas(dadosVagas);
      setACarregar(false);
    })
    .catch(erro => {
      console.error("Erro ao carregar perfil:", erro);
      setACarregar(false);
    });
  }, [id]);

  if (aCarregar) return <div style={{ textAlign: 'center', marginTop: '50px' }}>A carregar perfil...</div>;
  if (ong.erro) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Instituição não encontrada.</div>;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <nav style={{ padding: '20px 40px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ color: '#2563eb', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Lig<span style={{ color: '#111827' }}>Ação</span></h2>
        </Link>
        <button onClick={() => navigate('/instituicoes')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: 'bold' }}>
          ← Voltar ao Diretório
        </button>
      </nav>

      {/* Cabeçalho da ONG */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: 'bold', margin: '0 auto 24px auto' }}>
          {ong.nome.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 12px 0', color: '#111827' }}>{ong.nome}</h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: '0' }}>✉️ {ong.email}</p>
      </header>

      {/* Grelha de Vagas Ativas */}
      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', width: '100%', flexGrow: 1 }}>
        <h2 style={{ color: '#111827', marginBottom: '24px' }}>Oportunidades Ativas ({vagas.length})</h2>

        {vagas.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', margin: 0 }}>Esta instituição não tem vagas abertas de momento.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {vagas.map(vaga => (
              <div key={vaga._id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1d4ed8', backgroundColor: '#dbeafe', padding: '4px 10px', borderRadius: '12px', alignSelf: 'flex-start', marginBottom: '16px' }}>
                  {vaga.causa}
                </span>
                <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>{vaga.titulo}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1 }}>
                  📍 {vaga.localizacao}
                </p>
                <Link to={`/vaga/${vaga._id}`} style={{ textAlign: 'center', textDecoration: 'none', backgroundColor: '#f3f4f6', color: '#374151', padding: '10px', borderRadius: '8px', fontWeight: '600' }}>
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}