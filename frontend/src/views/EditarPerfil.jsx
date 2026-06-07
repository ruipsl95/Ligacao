import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditarPerfil() {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [aCarregar, setACarregar] = useState(true);
  
  // O estado do nosso formulário
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    biografia: '',
    fotografia: '',
    tipo: ''
  });

  const token = localStorage.getItem('token');

  // Vai buscar os dados mal a página carrega
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('https://ligacao-backend.onrender.com/api/perfil', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.erro) throw new Error(data.erro);
        setDados({
          nome: data.nome || '',
          email: data.email || '',
          biografia: data.biografia || '',
          fotografia: data.fotografia || '',
          tipo: data.tipo || ''
        });
        setACarregar(false);
      })
      .catch(erro => {
        setMensagem({ texto: 'Erro ao carregar os seus dados.', tipo: 'erro' });
        setACarregar(false);
      });
  }, [navigate, token]);

  // Função para gravar as alterações
  const guardarAlteracoes = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch('https://ligacao-backend.onrender.com/api/perfil', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dados)
      });

      const data = await resposta.json();
      if (!resposta.ok) throw new Error(data.erro || 'Erro ao atualizar.');

      setMensagem({ texto: 'Definições guardadas com sucesso!', tipo: 'sucesso' });
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      setMensagem({ texto: error.message, tipo: 'erro' });
    }
  };
  
  if (aCarregar) return <div style={{ textAlign: 'center', marginTop: '50px' }}>A carregar perfil...</div>;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      

      <nav style={{ padding: '20px 40px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#2563eb', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Lig<span style={{ color: '#111827' }}>Ação</span></h2>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: 'bold' }}>
          ← Voltar à Dashboard
        </button>
      </nav>

      <main style={{ maxWidth: '600px', margin: '40px auto', width: '100%', padding: '0 20px' }}>
        
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e5e7eb', margin: '0 auto 16px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              {dados.fotografia ? (
                <img src={dados.fotografia} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2.5rem', color: '#9ca3af', fontWeight: 'bold' }}>{dados.nome.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h1 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '1.8rem' }}>Definições de Conta</h1>
            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Conta de {dados.tipo}
            </span>
          </div>

          {mensagem.texto && (
            <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px', backgroundColor: mensagem.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2', color: mensagem.tipo === 'sucesso' ? '#166534' : '#991b1b', textAlign: 'center', fontWeight: '500' }}>
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={guardarAlteracoes} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Nome ou Organização</label>
              <input type="text" value={dados.nome} onChange={e => setDados({...dados, nome: e.target.value})} required style={estiloInput} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Endereço de Email</label>
              <input type="email" value={dados.email} onChange={e => setDados({...dados, email: e.target.value})} required style={estiloInput} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>URL da Fotografia de Perfil (Opcional)</label>
              <input type="url" value={dados.fotografia} onChange={e => setDados({...dados, fotografia: e.target.value})} placeholder="https://site.com/foto.jpg" style={estiloInput} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Biografia / Sobre a Instituição</label>
              <textarea value={dados.biografia} onChange={e => setDados({...dados, biografia: e.target.value})} rows="4" placeholder="Fale um pouco sobre si ou sobre a missão da sua organização..." style={estiloInput}></textarea>
            </div>

            <button type="submit" style={{ backgroundColor: '#111827', color: 'white', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', marginTop: '12px' }}>
              Guardar Alterações
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}

const estiloInput = { padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' };