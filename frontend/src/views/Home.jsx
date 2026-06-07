import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

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

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌍</div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#111827', margin: '0 0 24px 0', maxWidth: '800px', lineHeight: '1.1' }}>
                    Transforme a sua vontade de ajudar em <span style={{ color: '#2563eb' }}>impacto real.</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
                    A maior rede de solidariedade. Junte-se a milhares de voluntários e centenas de instituições que todos os dias fazem a diferença.
                </p>

                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* ENVIA PARA O REGISTO DE VOLUNTÁRIO */}
                    <Link
                        to="/registo"
                        state={{ tipoInicial: 'voluntario' }}
                        style={{ textDecoration: 'none', backgroundColor: '#2563eb', color: 'white', padding: '16px 32px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                        Quero ser Voluntário
                    </Link>

                    {/* ENVIA PARA O REGISTO DE ONG */}
                    <Link
                        to="/registo"
                        state={{ tipoInicial: 'ong' }}
                        style={{ textDecoration: 'none', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '16px 32px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                        Registar Instituição
                    </Link>

                    
                </div>
            </main>

            <footer style={{ padding: '30px', textAlign: 'center', backgroundColor: 'white', borderTop: '1px solid #e5e7eb', color: '#9ca3af', fontSize: '0.9rem' }}>
                LigAção © {new Date().getFullYear()} - O seu portal de voluntariado.
            </footer>
        </div>
    );
}