import './App.css';
import houseIcon from './image.png'; // Imagen de la casa
import loginIcon from './login-icon.png'; // Imagen para el botón de login
import { useEffect, useState } from 'react';

function App() {
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinning(true); 
    }, 3000); // 3000 ms = 3 segundos

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="login-container">
          <img 
            src={loginIcon} 
            alt="Login" 
            className="login-icon" 
            onClick={() => window.location.href = '/login.html'} 
          /> {/* Imagen de login que redirige al hacer clic */}
        </div>
        <div className="content-container">
          <div className="house-icon">
            <img src={houseIcon} className={`App-logo ${isSpinning ? 'spin' : ''}`} alt="house" />
          </div>
          <div className="text-container">
            <h1>Bienvenido a la Casa Domótica</h1>
            <p>Este es el sistema de control de tu casa inteligente.</p>
            <button className="App-button" onClick={() => window.location.href = '/plano.html'}>
              Ver Plano de la Casa
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
