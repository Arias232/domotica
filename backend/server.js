//Firebase admin
const admin = require('firebase-admin');
const serviceAccount = require('path/to/your/firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const express = require('express');
const app = express();
const cors = require('cors');
const admin = require('firebase-admin');
const port = 5000;

// Middleware para verificar el token de autenticación
app.use(async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(403).send('No se ha proporcionado un token');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send('Token inválido');
  }
});

// Ejemplo de ruta protegida
app.get('/protected', (req, res) => {
  res.send(`Hola ${req.user.email}, estás autenticado`);
});

app.listen(5000, () => {
  console.log('Servidor escuchando en el puerto 5000');
});

// Middleware para parsear JSON
app.use(cors());
app.use(express.json());

// Middleware para permitir CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Estados iniciales
let ledStatus = Array(10).fill('off'); // 10 LEDs apagados por defecto
let ventanaStatus = 'v_off';
let puertaStatus = 'p_off';

let sensorStatus = {
  gas: 0,
  agua: 0,
  ldr: 0
};

// Ruta para controlar LEDs individualmente
app.post('/control-led', (req, res) => {
  const { index, action } = req.body;
  if (index >= 0 && index < ledStatus.length && (action === 'on' || action === 'off')) {
    ledStatus[index] = action;
    console.log(`LED ${index + 1} ${action}`);
    res.send({ message: `LED ${index + 1} ${action}`, status: ledStatus });
  } else {
    res.status(400).send({ error: 'Índice o acción no válida' });
  }
});

// Ruta para encender/apagar todos los LEDs
app.post('/control-todos-leds', (req, res) => {
  const { action } = req.body;
  if (action === 'on' || action === 'off') {
    ledStatus = ledStatus.map(() => action);
    console.log(`Todos los LEDs ${action}`);
    res.send({ message: `Todos los LEDs ${action}`, status: ledStatus });
  } else {
    res.status(400).send({ error: 'Acción no válida para los LEDs' });
  }
});

// Rutas para controlar la ventana
app.post('/control-ventana', (req, res) => {
  const { action } = req.body;
  if (action === 'v' || action === 'v_off') {
    ventanaStatus = action;
    console.log(`Ventana ${action === 'v' ? 'abierta' : 'cerrada'}`);
    res.send({ message: `Ventana ${action === 'v' ? 'abierta' : 'cerrada'}`, status: ventanaStatus });
  } else {
    res.status(400).send({ error: 'Acción no válida para la ventana' });
  }
});

// Rutas para controlar la puerta
app.post('/control-puerta', (req, res) => {
  const { action } = req.body;
  if (action === 'p' || action === 'p_off') {
    puertaStatus = action;
    console.log(`Puerta ${action === 'p' ? 'abierta' : 'cerrada'}`);
    res.send({ message: `Puerta ${action === 'p' ? 'abierta' : 'cerrada'}`, status: puertaStatus });
  } else {
    res.status(400).send({ error: 'Acción no válida para la puerta' });
  }
});


// Ruta para actualizar el estado de los sensores
app.post('/estado-sensores', (req, res) => {
  const { gas, agua, ldr } = req.body;
  if (gas !== undefined && agua !== undefined && ldr !== undefined) {
    sensorStatus = { gas, agua, ldr };
    console.log('Estado de los sensores actualizado:', sensorStatus);
    res.send({ message: 'Estado de los sensores actualizado', status: sensorStatus });
  } else {
    res.status(400).send({ error: 'Datos de sensores inválidos' });
  }
});



// Rutas opcionales para consultar estados
app.get('/estado-led', (req, res) => res.send({ status: ledStatus }));
app.get('/estado-ventana', (req, res) => res.send({ status: ventanaStatus }));
app.get('/estado-puerta', (req, res) => res.send({ status: puertaStatus }));
app.get('/estado-sensores', (req, res) => {res.send({ status: sensorStatus });});


app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://134.209.219.161:${port}`);
});