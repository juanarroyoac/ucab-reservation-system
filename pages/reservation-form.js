// File: /pages/reservation-form.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import UcabHeader from '../components/UcabHeader';

// Data for the form
const standardMotives = [
  "Estudio Individual",
  "Proyecto en Grupo",
  "Investigación",
  "Trabajo de Tesis",
  "Clase Online",
  "Preparación de Examen",
  "Otro"
];

const userTypes = [
  "Estudiante de Pregrado",
  "Estudiante de Postgrado",
  "Investigador de la UCAB",
  "Investigador externo con tesis inscrita en la UCAB",
  "Profesor invitado"
];

export default function ReservationForm() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    id: '',
    phone: '',
    school: '',
    cubicleId: 1, // Default to first cubicle
    motive: '',
    userType: ''
  });

  // Load the selected time and duration from localStorage
  useEffect(() => {
    const storedTime = localStorage.getItem('selectedTime');
    const storedDuration = localStorage.getItem('selectedDuration');
    const storedDate = localStorage.getItem('selectedDate');
    
    if (storedTime) setSelectedTime(storedTime);
    if (storedDuration) setSelectedDuration(parseInt(storedDuration));
    if (storedDate) setSelectedDate(storedDate);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset email error when email field changes
    if (name === 'email') {
      setEmailError('');
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = () => {
    const { email, userType } = formData;
    
    // Only "Profesor invitado" can use non-UCAB emails
    if (userType !== "Profesor invitado") {
      if (!email.endsWith('@ucab.edu.ve')) {
        setEmailError('El correo electrónico debe terminar con @ucab.edu.ve');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail()) {
      return;
    }
    
    // Get existing reservations or initialize empty array
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // Create new reservations for the duration
    const startHourStr = selectedTime.split(':')[0];
    const startHour = parseInt(startHourStr);
    
    for (let hour = startHour; hour < startHour + selectedDuration; hour++) {
      if (hour >= 17) break; // Don't create reservations past closing time
      
      const timeSlot = `${hour}:00-${hour+1}:00`;
      existingReservations.push({
        ...formData,
        timeSlot,
        date: selectedDate
      });
    }
    
    // Save back to localStorage
    localStorage.setItem('reservations', JSON.stringify(existingReservations));
    localStorage.setItem('userFormData', JSON.stringify(formData));
    
    // Navigate to terms page
    router.push('/terms');
  };

  // Get the formatted date for display
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
        <title>Formulario de Reserva | Reserva de Cubículos</title>
      </Head>

      <UcabHeader />

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          {selectedDate && selectedTime && (
            <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              {formatDate(selectedDate)} • {selectedTime} • {selectedDuration} {selectedDuration === 1 ? 'hora' : 'horas'}
            </p>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="userType">Tipo de Solicitante *</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="block w-full rounded-md"
                required
              >
                <option value="">Seleccione su tipo</option>
                {userTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label htmlFor="name">Nombre Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              
              <div>
                <label htmlFor="email">Correo Electrónico Institucional *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={formData.userType === "Profesor invitado" ? "ejemplo@email.com" : "ejemplo@ucab.edu.ve"}
                />
                {emailError && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {emailError}
                  </p>
                )}
                {formData.userType && formData.userType !== "Profesor invitado" && (
                  <p style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.25rem" }}>
                    Debe ser un correo con dominio @ucab.edu.ve
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="id">Cédula de Identidad *</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 12345678"
                />
              </div>
              
              <div>
                <label htmlFor="phone">Teléfono *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Ej: (0212) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="school">Facultad / Escuela *</label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Facultad de Ingeniería"
                />
              </div>
              
              <div>
                <label htmlFor="motive">Motivo de la Reserva *</label>
                <select
                  id="motive"
                  name="motive"
                  value={formData.motive}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un motivo</option>
                  {standardMotives.map(motive => (
                    <option key={motive} value={motive}>{motive}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="btn-group" style={{ justifyContent: "space-between", marginTop: "2rem" }}>
              <button
                type="button"
                onClick={() => router.push('/select-time')}
                className="btn btn-secondary"
              >
                Volver
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}