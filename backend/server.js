const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Configuración de PostgreSQL
const pool = new Pool({
  user: 'doadmin',
  host: 'db-postgresql-nyc1-78611-do-user-12658703-0.k.db.ondigitalocean.com',
  database: 'defaultdb',
  port: 25060,
  ssl: { rejectUnauthorized: false }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Variables de estado
let ledStatus = Array(10).fill('off'); // Estado inicial de 10 LEDs apagados
let ldrState = 0;
let gasState = 0;
let humidityState = 0;
let waterLevelState = 0;

// Conexión a la base de datos
pool.connect()
  .then(client => {
    console.log('Conectado a la base de datos PostgreSQL');
    client.release();
  })
  .catch(err => console.error('Error al conectar a la base de datos', err));

  app.post('/control-led', async (req, res) => {
    const { index, action } = req.body;
    if (index >= 0 && index < ledStatus.length && (action === 'on' || action === 'off')) {
      ledStatus[index] = action;
      console.log(`LED ${index + 1} ${action}`);
  
      // Guardar el nuevo estado en la base de datos
      const timestamp = new Date();
      try {
        const queryText = 'INSERT INTO led_status (led_index, estado, fecha_hora) VALUES ($1, $2, $3)';
        const values = [index, action, timestamp];
        await pool.query(queryText, values);
      } catch (err) {
        console.error('Error al registrar el estado del LED en la base de datos', err);
      }
  
      res.send({ message: `LED ${index + 1} ${action}`, status: ledStatus });
    } else {
      res.status(400).send({ error: 'Índice o acción no válida' });
    }
  });

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

app.get('/estado-led-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM led_status ORDER BY fecha_hora DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener el estado de los LEDs desde la base de datos', err);
    res.status(500).send('Error al obtener el estado de los LEDs');
  }
});

app.get('/bitacora', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bitacora ORDER BY fecha_hora DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener la bitácora');
  }
});



app.post('/configurar-led', async (req, res) => {
  const { pin, action } = req.body; // Recibe el pin y la acción ('asignar' o 'liberar')
  
  if (typeof pin === 'number' && (action === 'asignar' || action === 'liberar')) {
    try {
      // Configuración del ESP8266: envía solicitud HTTP para configurar el pin
      const response = await axios.post(`http://<ESP8266_IP>/configurar-pin`, {
        pin: pin,
        action: action
      });

      res.status(200).json({ message: response.data });
    } catch (error) {
      console.error('Error al configurar el pin:', error);
      res.status(500).send('Error al configurar el pin en el ESP8266');
    }
  } else {
    res.status(400).send({ error: 'Datos inválidos para la configuración del pin' });
  }
});

// Rutas para los sensores
app.post('/sensores', (req, res) => {
  ldrState = req.body.ldrValue;
  gasState = req.body.gasValue;
  humidityState = req.body.humidityValue;
  waterLevelState = req.body.waterLevelValue;

  console.log(`Valores recibidos - LDR: ${ldrState}, Gas: ${gasState}, Humedad: ${humidityState}, Nivel de Agua: ${waterLevelState}`);
  res.send('Valores de sensores recibidos');
});

app.get('/sensores', (req, res) => {
  res.json({
    ldrState,
    gasState,
    humidityState,
    waterLevelState
  });
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://134.209.219.161:${port}`);
});
