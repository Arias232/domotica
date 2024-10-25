import './App.css';
import houseIcon from './image.png';
import loginIcon from './login-icon.png';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import DomoticaHomeManager from './agregar'; // Importamos solo una vez y con el nombre correcto

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinning(true);
    }, 3000);
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
            onClick={() => navigate('/login')} // Usar navigate
          />
        </div>
        <div className="content-container">
          <div className="house-icon">
            <img src={houseIcon} className={`App-logo ${isSpinning ? 'spin' : ''}`} alt="house" />
          </div>
          <div className="text-container">
            <h1>Bienvenido a la Casa Domótica</h1>
            <p>Este es el sistema de control de tu casa inteligente.</p>
            <button className="App-button"  onClick={() => window.location.href = 'inicio.html'}>
              Ver Plano de la Casa
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/agregar" element={<DomoticaHomeManager />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
