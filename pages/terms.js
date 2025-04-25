// File: /pages/terms.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Terms() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    date: '',
    time: '',
    duration: ''
  });

  useEffect(() => {
    const storedTime = localStorage.getItem('selectedTime');
    const storedDuration = localStorage.getItem('selectedDuration');
    const storedDate = localStorage.getItem('selectedDate');
    
    if (storedTime && storedDuration && storedDate) {
      setReservationDetails({
        time: storedTime,
        duration: storedDuration,
        date: storedDate
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!agreed) {
      alert('Debe aceptar las normativas para continuar.');
      return;
    }
    
    // Store that user agreed to terms
    localStorage.setItem('agreedToTerms', 'true');
    
    // Navigate to confirmation
    router.push('/confirmation');
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
        <title>Términos y Condiciones | Reserva de Cubículos</title>
      </Head>

      <header className="header">
        <div className="container">
          <h1>TÉRMINOS Y CONDICIONES</h1>
          {reservationDetails.date && (
            <p style={{ textAlign: "center" }}>
              {formatDate(reservationDetails.date)} • {reservationDetails.time} • {reservationDetails.duration} {parseInt(reservationDetails.duration) === 1 ? 'hora' : 'horas'}
            </p>
          )}
        </div>
      </header>

      <main className="container">
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "1.5rem", color: "#1e40af" }}>NORMATIVAS DE USO DE LOS CUBÍCULOS DE ESTUDIO INDIVIDUAL</h2>
            
            <div style={{ 
              maxHeight: "400px", 
              overflowY: "auto", 
              padding: "1.5rem",
              marginBottom: "1.5rem",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <ol style={{ 
                listStyleType: "decimal", 
                paddingLeft: "1.5rem",
                lineHeight: "1.8"
              }}>
                <li>La reserva de cubículos de estudio individual se realiza a través de la página de la Biblioteca: <a href="https://biblioteca.ucab.edu.ve/colecciones/cubiculos-de-studio-individual/reserva-e/" style={{ color: "#2563eb" }}>https://biblioteca.ucab.edu.ve/colecciones/cubiculos-de-studio-individual/reserva-e/</a> ó de su canal en Instagram: @bibliotecaucab.</li>
                <li>Una vez que reciba la aprobación, deberán pasar por la recepción del piso 4 para verificar su reserva. Con la entrega de su carnet de estudiante se le asigna el cubículo. Al retirarse, debe dirigirse nuevamente a la recepción para que el encargado de la biblioteca verifique el buen estado del cubículo, lo cierre y le devuelve el carnet. Bajo ningún motivo deberán retirarse sin avisar al encargado.</li>
                <li>Los cubículos son individuales e intransferibles.</li>
                <li>El solicitante de este servicio debe estar solvente con sus deberes en la biblioteca.</li>
                <li>Al igual que en todas las áreas de servicios de la Biblioteca, no está permitido fumar o vapear, ni ingerir alimentos y/o bebidas.</li>
                <li>Los cubículos no poseen equipos, pero sí hay conexión wifi, por lo que deben traer sus computadores.</li>
                <li>Dichos cubículos son excelentes para los que elaboran tesis y necesitan un espacio de tranquilidad.</li>
                <li>Los préstamos se realizaran en horario de oficina de 9:00 am a 5:00 pm. Su uso será entre 1 y 3 hrs por cada usuario.</li>
                <li>Al entregar el cubículo, el personal de la Biblioteca ratificará al usuario las condiciones de uso del mismo. Igualmente, al retirarse revisará e informará sobre el buen estado del espacio y el mobiliario.</li>
                <li>Cada usuario se compromete a preservar el orden e integridad de todos los recursos disponibles en el cubículo. Por tanto, después de hacer uso del cubículo, es importante dejarlo organizado y limpio. El deterioro intencional de los bienes de la Biblioteca es considerado una grave violación a las normas institucionales.</li>
                <li>No nos hacemos responsables de objetos o pertenencias abandonadas en el cubículo.</li>
                <li>Los pasillos del piso 4 no son un sitio de espera, por tanto, procure llegar a la recepción a la hora que corresponda su ingreso al cubículo.</li>
                <li>En caso de incurrir en alguna falta, se aplican todas las normativas disciplinarias de la Biblioteca y de la Universidad.</li>
              </ol>
            </div>
            
            <div style={{ marginBottom: "2rem" }}>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  style={{ 
                    marginRight: "0.75rem", 
                    width: "1.25rem", 
                    height: "1.25rem" 
                  }}
                />
                <span style={{ fontWeight: "500" }}>
                  He leído y acepto las normativas de uso de los cubículos de estudio individual.
                </span>
              </label>
            </div>
            
            <div className="btn-group" style={{ justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={() => router.push('/reservation-form')}
                className="btn btn-secondary"
              >
                Volver
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!agreed}
                style={{ 
                  opacity: agreed ? 1 : 0.5, 
                  cursor: agreed ? 'pointer' : 'not-allowed' 
                }}
              >
                Confirmar Reserva
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}