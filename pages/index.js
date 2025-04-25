// File: /pages/index.js
import { useRouter } from 'next/router';
import Head from 'next/head';
import UcabHeader from '../components/UcabHeader';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Reserva de Cubículos | Biblioteca UCAB</title>
        <meta name="description" content="Sistema de reserva de cubículos de estudio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UcabHeader />

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="card" style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2>Sistema de Reservas</h2>
          <p style={{ marginBottom: "2rem", fontSize: "0.95rem" }}>
            Reserva un cubículo de estudio en la biblioteca universitaria de manera rápida y sencilla.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button
              onClick={() => router.push('/select-time')}
              className="btn btn-primary"
              style={{ padding: "0.8rem 1.5rem" }}
            >
              Reservar Cubículo
            </button>
            
            <button
              onClick={() => router.push('/availability')}
              className="btn btn-secondary"
              style={{ padding: "0.8rem 1.5rem" }}
            >
              Ver Disponibilidad
            </button>
          </div>
        </div>
        
        <div className="card" style={{ maxWidth: "700px", margin: "2rem auto", textAlign: "center" }}>
          <h2>Información</h2>
          <div style={{ textAlign: "left", fontSize: "0.9rem" }}>
            <p style={{ marginBottom: "0.75rem" }}><strong>Horario de servicio:</strong> 9:00 - 17:00 hrs.</p>
            <p style={{ marginBottom: "0.75rem" }}><strong>Duración máxima:</strong> 3 horas por reserva</p>
            <p style={{ marginBottom: "0.75rem" }}><strong>Cubículos disponibles:</strong> 4</p>
            <p><strong>Requisitos:</strong> Presentar carnet estudiantil al momento de ocupar el cubículo</p>
          </div>
        </div>
      </main>
    </div>
  );
}