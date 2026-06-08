import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login({ setUtilizador }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  
  // NOVO: Estado que deteta se o ecrã é de telemóvel (mobile)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const navigate = useNavigate();
  const location = useLocation();

  // NOVO: Listener que atualiza o estado quando a janela muda de tamanho
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.state && location.state.mensagemSucesso) {
      setMensagem({ texto: location.state.mensagemSucesso, tipo: 'sucesso' });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const submeterLogin = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    try {
      const resposta = await fetch('https://ligacao-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const dados = await resposta.json();

      if (!resposta.ok) throw new Error(dados.erro || 'Erro ao fazer login.');

      localStorage.setItem('token', dados.token);
      localStorage.setItem('utilizador', JSON.stringify(dados.utilizador));
      setUtilizador(dados.utilizador);
      
      if (dados.utilizador.tipo === 'ong') {
        navigate('/dashboard-ong');
      } else {
        navigate('/dashboard-voluntario');
      }

    } catch (error) {
      setMensagem({ texto: error.message, tipo: 'erro' });
    }
  };

  return (
    // ADAPTADO: Muda de row para column se for mobile
    <div style={{ ...styles.page, flexDirection: isMobile ? 'column' : 'row' }}>
      
      {/* Lado Esquerdo - Hero */}
      <div style={{ 
        ...styles.heroSide, 
        flex: isMobile ? 'none' : '1 1 55%', 
        padding: isMobile ? '40px 20px' : '60px',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <div style={{ ...styles.heroContent, margin: isMobile ? '0 auto' : '0' }}>
          <h1 style={{ ...styles.logo, fontSize: isMobile ? '2.5rem' : '3rem' }}>Lig<span style={styles.logoAccent}>Ação</span></h1>
          <p style={{ ...styles.heroTagline, fontSize: isMobile ? '1.5rem' : '2rem' }}>Mude o mundo, uma conexão de cada vez.</p>
          
          {/* Esconde a descrição extra e o ícone no telemóvel para poupar espaço */}
          {!isMobile && (
            <>
              <p style={styles.heroDescription}>A plataforma que liga quem quer ajudar a quem precisa de ação.</p>
              <div style={styles.heroIcon}>🤝</div>
            </>
          )}
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div style={{ 
        ...styles.formSide, 
        flex: isMobile ? '1' : '1 1 45%',
        padding: isMobile ? '40px 20px' : '0',
        alignItems: isMobile ? 'flex-start' : 'center'
      }}>
        <div style={styles.formCard}>
          <h2 style={{ ...styles.formTitle, textAlign: isMobile ? 'center' : 'left' }}>Bem-vindo de volta</h2>
          
          {mensagem.texto && (
            <div style={{ ...styles.message, backgroundColor: mensagem.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2', color: mensagem.tipo === 'sucesso' ? '#166534' : '#991b1b' }}>
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={submeterLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
            </div>
            
            <button type="submit" style={styles.submitBtn}>Entrar</button>
          </form>

          <div style={styles.toggleText}>
            Ainda não tem conta? <Link to="/registo" style={styles.toggleLink}>Registe-se aqui.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ADAPTADO: Substitui 'height' por 'minHeight' para o telemóvel conseguir fazer scroll se precisar
export const styles = {
  page: { display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#f9fafb', margin: 0, padding: 0 },
  heroSide: { background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' },
  heroContent: { maxWidth: '500px' },
  logo: { fontWeight: '800', margin: '0 0 16px 0' },
  logoAccent: { color: '#ffffff' },
  heroTagline: { fontWeight: '700', margin: '0 0 20px 0' },
  heroDescription: { fontSize: '1rem', color: '#e0f2fe', margin: '0 0 40px 0' },
  heroIcon: { fontSize: '6rem', textAlign: 'center', opacity: '0.8' },
  formSide: { display: 'flex', justifyContent: 'center', backgroundColor: 'white' },
  formCard: { width: '100%', maxWidth: '400px' },
  formTitle: { fontSize: '1.8rem', fontWeight: '700', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.875rem', fontWeight: '600' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', outline: 'none' },
  submitBtn: { padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  message: { padding: '12px', marginBottom: '20px', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid transparent' },
  toggleText: { marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' },
  toggleLink: { color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' }
};