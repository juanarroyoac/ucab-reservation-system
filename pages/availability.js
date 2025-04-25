// File: /pages/availability.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Generate time slots from 9am to 5pm
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour}:00-${hour+1}:00`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const cubicles = [
  { id: 1, name: "Cubículo 1" },
  { id: 2, name: "Cubículo 2" },
  { id: 3, name: "Cubículo 3" },
  { id: 4, name: "Cubículo 4" },
];

export default function Availability() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Load reservations from localStorage on component mount
  useEffect(() => {
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  }, []);
  
  // Check if a cubicle is available at a specific time
  const isAvailable = (cubicleId, timeSlot) => {
    return !reservations.some(r => 
      r.cubicleId === cubicleId && r.timeSlot === timeSlot
    );
  };

  return (
    <div>
      <Head>
        <title>Disponibilidad | Reserva de Cubículos</title>
      </Head>

      <header className="header">
        <div className="container">
          <h1>DISPONIBILIDAD DE CUBÍCULOS</h1>
          <p style={{ textAlign: "center" }}>
            Fecha: {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </header>

      <main className="container">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2>Horarios Disponibles</h2>
            <div>
              <span className="available" style={{ padding: "0.5rem", borderRadius: "4px", marginRight: "1rem" }}>Disponible</span>
              <span className="occupied" style={{ padding: "0.5rem", borderRadius: "4px" }}>Ocupado</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="availability-table">
              <thead>
                <tr>
                  <th>Cubículo</th>
                  {timeSlots.map(slot => (
                    <th key={slot}>{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cubicles.map(cubicle => (
                  <tr key={cubicle.id}>
                    <td className="font-bold">{cubicle.name}</td>
                    {timeSlots.map(slot => (
                      <td 
                        key={`${cubicle.id}-${slot}`} 
                        className={isAvailable(cubicle.id, slot) ? 'available' : 'occupied'}
                      >
                        {isAvailable(cubicle.id, slot) ? 'Disponible' : 'Ocupado'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => router.push('/select-time')}
              className="btn btn-primary"
              style={{ marginRight: "1rem" }}
            >
              Reservar Ahora
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="btn btn-secondary"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}