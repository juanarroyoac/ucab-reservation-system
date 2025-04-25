// File: /pages/confirmation.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Confirmation() {
  const router = useRouter();
  const [reservationDetails, setReservationDetails] = useState({
    time: '',
    duration: '',
    cubicle: '',
    date: '',
    name: '',
    email: '',
    userType: ''
  });

  useEffect(() => {
    // Redirect if terms not agreed to
    const agreedToTerms = localStorage.getItem('agreedToTerms');
    if (agreedToTerms !== 'true') {
      router.push('/terms');
      return;
    }
    
    // Get the reservation details
    const storedTime = localStorage.getItem('selectedTime');
    const storedDuration = localStorage.getItem('selectedDuration');
    const storedDate = localStorage.getItem('selectedDate');
    const userFormData = localStorage.getItem('userFormData');
    
    if (storedTime && storedDuration && storedDate && userFormData) {
      const userData = JSON.parse(userFormData);
      setReservationDetails({
        time: storedTime,
        duration: storedDuration,
        date: storedDate,
        cubicle: `Cubículo ${userData.cubicleId}`,
        name: userData.name,
        email: userData.email,
        userType: userData.userType
      });
    }
  }, [router]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <Head>
        <title>Reserva Confirmada | Reserva de Cubículos</title>
      </Head>

      <header className="header">
        <div className="container">
          <h1>RESERVA CONFIRMADA</h1>
        </div>
      </header>

      <main className="container">
        <div className="card" style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2>¡Tu reserva ha sido registrada con éxito!</h2>
          
          <div style={{ 
            margin: "2rem 0", 
            padding: "1.5rem", 
            backgroundColor: "#f8fafc", 
            borderRadius: "8px", 
            textAlign: "left", 
            border: "1px solid #e2e8f0" 
          }}>
            <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
              <h3 style={{ color: "#1e40af", marginBottom: "0.5rem", fontSize: "1.25rem" }}>Detalles de la Reserva</h3>
              <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                <strong>Solicitante:</strong> {reservationDetails.name} ({reservationDetails.userType})
              </p>
              <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "0.5rem" }}>
                <strong>Email:</strong> {reservationDetails.email}
              </p>
            </div>
            
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              <strong>Fecha:</strong> {formatDate(reservationDetails.date)}
            </p>
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              <strong>Horario:</strong> {reservationDetails.time}
            </p>
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              <strong>Duración:</strong> {reservationDetails.duration} {parseInt(reservationDetails.duration) === 1 ? 'hora' : 'horas'}
            </p>
            <p style={{ fontSize: "1.1rem" }}>
              <strong>Ubicación:</strong> {reservationDetails.cubicle} (Piso 4)
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: "#eff6ff", 
            padding: "1rem", 
            borderRadius: "8px", 
            marginBottom: "2rem",
            border: "1px solid #bfdbfe"
          }}>
            <p style={{ fontWeight: "500", color: "#1e40af", marginBottom: "0.5rem" }}>
              Instrucciones importantes:
            </p>
            <ul style={{ textAlign: "left", paddingLeft: "1.5rem", color: "#334155" }}>
              <li>Preséntese en la recepción del piso 4 con su carnet de estudiante/ID.</li>
              <li>Al finalizar, avise al encargado para que verifique el estado del cubículo.</li>
              <li>Recuerde que el cubículo es intransferible.</li>
            </ul>
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              onClick={() => router.push('/')}
              className="btn btn-primary"
            >
              Volver al Inicio
            </button>
            
            <button
              onClick={() => router.push('/availability')}
              className="btn btn-secondary"
            >
              Ver Disponibilidad
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}