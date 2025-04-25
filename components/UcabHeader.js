// components/UcabHeader.js
import { useRouter } from 'next/router';

export default function UcabHeader() {
  const router = useRouter();
  
  return (
    <header>
      <div className="ucab-header">
        <div className="ucab-header-content">
          <div className="ucab-logo">
            <img 
              src="/ucab-logo.png" 
              alt="Biblioteca UCAB" 
              width="50" 
              height="50"
            />
            <div className="ucab-logo-text">BIBLIOTECA UCAB</div>
          </div>
          <nav className="ucab-nav">
            <a href="#" onClick={() => router.push('/')}>INICIO</a>
            <a href="#" onClick={() => router.push('/availability')}>DISPONIBILIDAD</a>
            <a href="https://biblioteca.ucab.edu.ve" target="_blank" rel="noopener noreferrer">
              BIBLIOTECA
            </a>
          </nav>
        </div>
      </div>
      <div className="page-title">
        <div className="container">
          <h1>RESERVA DE CUBÍCULOS DE ESTUDIO</h1>
        </div>
      </div>
    </header>
  );
}