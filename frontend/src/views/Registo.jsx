import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { styles } from './Login'; 

export default function Registo() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('voluntario');
  const [erro, setErro] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.tipoInicial) {
      setTipo(location.state.tipoInicial);
    }
  }, [location]);

  const submeterRegisto = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const resposta = await fetch('/api/registo', {
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
    <div style={styles.page}>
      {/* Lado Esquerdo - Hero Completo */}
      <div style={styles.heroSide}>
        <div style={styles.heroContent}>
          <h1 style={styles.logo}>Lig<span style={styles.logoAccent}>Ação</span></h1>
          <p style={styles.heroTagline}>Junte-se à nossa comunidade hoje.</p>
          <p style={styles.heroDescription}>A plataforma que liga quem quer ajudar a quem precisa de ação.</p>
          <div style={styles.heroIcon}>🤝</div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div style={styles.formSide}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Criar Conta</h2>
          
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