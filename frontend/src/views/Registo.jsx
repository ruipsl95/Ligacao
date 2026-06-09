import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { styles } from './Login'; // Importa os estilos que já ajustámos no Login

export default function Registo() {
  // NOVO: Detetor de telemóvel
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('voluntario');
  const [erro, setErro] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // NOVO: Listener que atualiza o estado quando a janela muda de tamanho
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.state && location.state.tipoInicial) {
      setTipo(location.state.tipoInicial);
    }
  }, [location]);

  const submeterRegisto = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const resposta = await fetch('https://ligacao-backend.onrender.com/api/registo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password, tipo })
      });

      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || 'Erro ao criar conta.');

      navigate('/login', { state: { mensagemSucesso: '🎉 Conta criada com sucesso! Faça login abaixo.' } });

    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    // ADAPTADO: Muda a direção para 'column' se for telemóvel
    <div style={{ ...styles.page, flexDirection: isMobile ? 'column' : 'row' }}>
      
      {/* Lado Esquerdo - Hero Completo */}
      <div style={{ 
        ...styles.heroSide, 
        flex: isMobile ? 'none' : '1 1 55%', 
        padding: isMobile ? '40px 20px' : '60px',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <div style={{ ...styles.heroContent, margin: isMobile ? '0 auto' : '0' }}>
          <h1 style={{ ...styles.logo, fontSize: isMobile ? '2.5rem' : '3rem' }}>Lig<span style={styles.logoAccent}>Ação</span></h1>
          <p style={{ ...styles.heroTagline, fontSize: isMobile ? '1.5rem' : '2rem' }}>Junte-se à nossa comunidade hoje.</p>
          
          {/* Esconde a descrição e o emoji no telemóvel para o formulário aparecer mais rápido */}
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
          <h2 style={{ ...styles.formTitle, textAlign: isMobile ? 'center' : 'left' }}>Criar Conta</h2>
          
          {erro && (
            <div style={{ ...styles.message, backgroundColor: '#fee2e2', color: '#991b1b' }}>
              {erro}
            </div>
          )}

          <form onSubmit={submeterRegisto} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={styles.input} placeholder={tipo === 'voluntario' ? "O seu nome completo" : "Nome da Instituição"} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Eu quero...</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={styles.input}>
                <option value="voluntario">Fazer Voluntariado</option>
                <option value="ong">Registar uma Instituição</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
            </div>
            
            <button type="submit" style={styles.submitBtn}>Registar</button>
          </form>

          <div style={styles.toggleText}>
            Já tem uma conta? <Link to="/login" style={styles.toggleLink}>Faça Login.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}