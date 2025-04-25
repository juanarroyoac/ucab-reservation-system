// File: /pages/select-time.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import UcabHeader from '../components/UcabHeader';

// Generate time slots from 9am to 5pm
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour}:00-${hour+1}:00`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export default function SelectTime() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState(timeSlots);

  // Generate available dates (today + next 30 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          dateStr: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('es-ES', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
          })
        });
      }
    }
    return dates;
  };

  const availableDates = generateDates();
  
  // Set the default selected date to today
  useEffect(() => {
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0].dateStr);
    }
  }, [availableDates]);

  // Update available time slots based on selected duration
  useEffect(() => {
    // Filter time slots based on selected duration to ensure they don't go past 17:00
    const filteredSlots = timeSlots.filter(slot => {
      const startHour = parseInt(slot.split(':')[0]);
      return startHour + selectedDuration <= 17;
    });
    
    setAvailableTimeSlots(filteredSlots);
    
    // If current selected time is not valid with new duration, clear it
    if (selectedTime) {
      const startHour = parseInt(selectedTime.split(':')[0]);
      if (startHour + selectedDuration > 17) {
        setSelectedTime("");
      }
    }
  }, [selectedDuration, selectedTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedTime && selectedDate) {
      // Store selections in localStorage
      localStorage.setItem('selectedTime', selectedTime);
      localStorage.setItem('selectedDuration', selectedDuration.toString());
      localStorage.setItem('selectedDate', selectedDate);
      router.push('/reservation-form');
    } else {
      alert('Por favor, seleccione una fecha y hora de inicio.');
    }
  };

  return (
    <div>
      <Head>
        <title>Seleccionar Horario | Reserva de Cubículos</title>
      </Head>

      <UcabHeader />

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "2rem" }}>
              <label htmlFor="date" style={{ marginBottom: "1rem", display: "block" }}>Selecciona una fecha</label>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", 
                gap: "0.75rem",
                maxHeight: "220px",
                overflowY: "auto",
                padding: "0.5rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px"
              }}>
                {availableDates.map((date) => (
                  <div 
                    key={date.dateStr} 
                    className={`time-option ${selectedDate === date.dateStr ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(date.dateStr)}
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center",
                      justifyContent: "center",
                      height: "70px" 
                    }}
                  >
                    <div style={{ fontWeight: "600" }}>{date.display.split(', ')[0]}</div>
                    <div>{date.display.split(', ')[1]}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: "2rem" }}>
              <label htmlFor="duration">Duración (horas)</label>
              <div className="duration-selection">
                {[1, 2, 3].map((hours) => (
                  <div 
                    key={hours} 
                    className={`duration-option ${selectedDuration === hours ? 'selected' : ''}`}
                    onClick={() => setSelectedDuration(hours)}
                  >
                    {hours} {hours === 1 ? 'hora' : 'horas'}
                  </div>
                ))}
              </div>
              <p style={{ 
                fontSize: "0.875rem", 
                color: "#64748b", 
                marginTop: "0.5rem",
                fontStyle: "italic" 
              }}>
                {selectedDuration === 3 ? 'Horario máximo de inicio: 14:00' : 
                 selectedDuration === 2 ? 'Horario máximo de inicio: 15:00' : 
                 'Horario máximo de inicio: 16:00'}
              </p>
            </div>
            
            <div>
              <label htmlFor="timeSlot">Hora de inicio</label>
              <div className="time-selection">
                {availableTimeSlots.map((slot) => (
                  <div 
                    key={slot} 
                    className={`time-option ${selectedTime === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="btn-group" style={{ justifyContent: "space-between", marginTop: "2rem" }}>
              <button
                type="button"
                onClick={() => router.push('/')}
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