import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login({ setUtilizador }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  
  const navigate = useNavigate();
  const location = useLocation();

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
      const resposta = await fetch('http://127.0.0.1:3001/api/login', {
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
    <div style={styles.page}>
      {/* Lado Esquerdo - Hero Completo */}
      <div style={styles.heroSide}>
        <div style={styles.heroContent}>
          <h1 style={styles.logo}>Lig<span style={styles.logoAccent}>Ação</span></h1>
          <p style={styles.heroTagline}>Mude o mundo, uma conexão de cada vez.</p>
          <p style={styles.heroDescription}>A plataforma que liga quem quer ajudar a quem precisa de ação.</p>
          <div style={styles.heroIcon}>🤝</div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div style={styles.formSide}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Bem-vindo de volta</h2>
          
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

export const styles = {
  page: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#f9fafb', margin: 0, padding: 0 },
  heroSide: { flex: '1 1 55%', background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '60px' },
  heroContent: { maxWidth: '500px' },
  logo: { fontSize: '3rem', fontWeight: '800', margin: '0 0 16px 0' },
  logoAccent: { color: '#ffffff' },
  heroTagline: { fontSize: '2rem', fontWeight: '700', margin: '0 0 20px 0' },
  heroDescription: { fontSize: '1rem', color: '#e0f2fe', margin: '0 0 40px 0' },
  heroIcon: { fontSize: '6rem', textAlign: 'center', opacity: '0.8' },
  formSide: { flex: '1 1 45%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
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