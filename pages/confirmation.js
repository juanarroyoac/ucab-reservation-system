// File: /pages/confirmation.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import UcabHeader from '../components/UcabHeader';
// Import emailjs only on client-side using dynamic import
import dynamic from 'next/dynamic';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_0nwlu2d';
const EMAILJS_TEMPLATE_ID = 'template_4q4sz3o'; // Replace with your actual template ID
const EMAILJS_PUBLIC_KEY = 'xXSxh9PKOaltlrGeo'; // Replace with your actual public key

export default function Confirmation() {
  const router = useRouter();
  const [reservationDetails, setReservationDetails] = useState({
    time: '',
    duration: '',
    cubicle: '',
    date: '',
    name: '',
    email: '',
    userType: '',
    id: '',
    phone: '',
    school: '',
    motive: ''
  });
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(null);

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
      const details = {
        time: storedTime,
        duration: storedDuration,
        date: storedDate,
        cubicle: `Cubículo ${userData.cubicleId}`,
        name: userData.name,
        email: userData.email,
        userType: userData.userType,
        id: userData.id,
        phone: userData.phone,
        school: userData.school,
        motive: userData.motive
      };
      
      setReservationDetails(details);
      
      // Send confirmation email
      if (details.email) {
        sendEmail(details);
      }
    }
  }, [router]);

  // Send email function (safer implementation)
  const sendEmail = async (details) => {
    try {
      // Safely import emailjs only on client-side
      const emailjs = await import('@emailjs/browser');
      
      // Format date for email
      const formattedDate = formatDate(details.date);
      
      // Prepare template parameters
      const templateParams = {
        to_name: details.name,
        from_name: 'Biblioteca UCAB',
        to_email: details.email,
        reservation_date: formattedDate,
        reservation_time: details.time,
        reservation_duration: `${details.duration} ${parseInt(details.duration) === 1 ? 'hora' : 'horas'}`,
        cubicle: details.cubicle,
        user_type: details.userType,
        motive: details.motive,
        user_id: details.id,
        user_phone: details.phone,
        user_school: details.school
      };

      // Initialize EmailJS (safer)
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Send the email
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      setEmailSent(true);
    } catch (error) {
      console.error('Failed to send email:', error);
      setEmailError('Error al enviar el correo de confirmación. Su reserva ha sido registrada exitosamente de todas formas.');
    }
  };

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
        <title>Reserva Confirmada | Biblioteca UCAB</title>
      </Head>

      <UcabHeader />

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="card" style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2>¡Tu reserva ha sido registrada con éxito!</h2>
          
          {emailSent && (
            <p style={{ color: "var(--ucab-green)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
              Se ha enviado un correo de confirmación a {reservationDetails.email}
            </p>
          )}
          
          {emailError && (
            <p style={{ color: "#dc2626", marginTop: "0.5rem", fontSize: "0.9rem" }}>
              {emailError}
            </p>
          )}
          
          <div style={{ 
            margin: "2rem 0", 
            padding: "1.5rem", 
            backgroundColor: "#f8fafc", 
            borderRadius: "8px", 
            textAlign: "left", 
            border: "1px solid #e2e8f0" 
          }}>
            <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
              <h3 style={{ color: "var(--ucab-blue)", marginBottom: "0.5rem", fontSize: "1.25rem" }}>Detalles de la Reserva</h3>
              <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                <strong>Solicitante:</strong> {reservationDetails.name} ({reservationDetails.userType})
              </p>
              <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "0.5rem" }}>
                <strong>Email:</strong> {reservationDetails.email}
              </p>
            </div>
            
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              <strong>Fecha:</strong> {formatDate(reservationDetails.date)}
            </p>
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              <strong>Horario:</strong> {reservationDetails.time}
            </p>
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              <strong>Duración:</strong> {reservationDetails.duration} {parseInt(reservationDetails.duration) === 1 ? 'hora' : 'horas'}
            </p>
            <p style={{ fontSize: "1rem" }}>
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
            <p style={{ fontWeight: "500", color: "var(--ucab-blue)", marginBottom: "0.5rem" }}>
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