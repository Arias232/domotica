import './App.css';
import houseIcon from './image.png'; // Imagen de la casa
import loginIcon from './login-icon.png'; // Imagen para el botón de login
import { useEffect, useState } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
//Autenticacion backend firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcVZ6qtAsUuZHnitq_jeNBaYwXXLzf9K4",
  authDomain: "domotica-9fed3.firebaseapp.com",
  projectId: "domotica-9fed3",
  storageBucket: "domotica-9fed3.appspot.com",
  messagingSenderId: "824937876965",
  appId: "1:824937876965:web:fbd71ff2f0e4d1887c330c",
  measurementId: "G-QR4K7HJHEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const history = useHistory();

// Registrar un nuevo usuario
const signUp = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario registrado:", user);
    })
    .catch((error) => {
      console.error("Error al registrar:", error.message);
    });
};

// Iniciar sesión de un usuario
const signIn = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario autenticado:", user);
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error.message);
    });
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario está autenticado");
  } else {
    console.log("Usuario no autenticado, redirigiendo...");
    history.push("/login"); // Redirige a la página de inicio de sesión si no está autenticado
  }
});




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
