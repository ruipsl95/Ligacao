import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DiretorioOngs() {
  const [ongs, setOngs] = useState([]);
  const [aCarregar, setACarregar] = useState(true);

  useEffect(() => {
    fetch('/api/ongs')
      .then(resposta => resposta.json())
      .then(dados => {
        setOngs(dados);
        setACarregar(false);
      })
      .catch(erro => {
        console.error("Erro ao carregar ONGs:", erro);
        setACarregar(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Barra de Navegação Pública */}
            <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ color: '#2563eb', margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Lig<span style={{ color: '#111827' }}>Ação</span></h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                     <Link to="/instituicoes" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600' }}>
  Diretório de ONGs
</Link>
                    <Link to="/login" state={{ modo: 'login' }} style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600' }}>
                        Sobre Nós
                    </Link>
                    <Link to="/login" state={{ modo: 'login' }} style={{ textDecoration: 'none', backgroundColor: '#111827', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold' }}>
                        Entrar / Registar
                    </Link>
                   
                </div>
            </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', width: '100%', flexGrow: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '16px', fontWeight: '800' }}>As nossas Instituições Parceiras</h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Conheça as organizações que trabalham todos os dias no terreno. Junte-se a elas e faça parte da mudança.
          </p>
        </div>

        {aCarregar ? (
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '1.2rem', marginTop: '40px' }}>A carregar diretório...</div>
        ) : ongs.length === 0 ? (
          <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ color: '#374151' }}>Ainda não há instituições registadas.</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {ongs.map(ong => (
              <div key={ong._id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                {/* Avatar gerado com a primeira letra do nome da ONG */}
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
                  {ong.nome.charAt(0).toUpperCase()}
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#111827' }}>{ong.nome}</h3>
                <p style={{ color: '#6b7280', margin: '0 0 20px 0', fontSize: '0.9rem' }}>✉️ {ong.email}</p>
                <Link 
  to={`/ong/${ong._id}`} 
  style={{ marginTop: 'auto', display: 'block', width: '100%', boxSizing: 'border-box', backgroundColor: '#f3f4f6', color: '#374151', textDecoration: 'none', padding: '10px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}
>
  Ver Oportunidades
</Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ padding: '30px', textAlign: 'center', backgroundColor: 'white', borderTop: '1px solid #e5e7eb', color: '#9ca3af', fontSize: '0.9rem' }}>
        LigAção © {new Date().getFullYear()} - O seu portal de voluntariado.
      </footer>
    </div>
  );
}