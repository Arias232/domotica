import React, { useState, useEffect } from 'react';
import '../styles/MainLayout.css';
import logo from '../imagen/logo.png';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Usuarios', '1', <UserOutlined />),
  getItem('Subsistemas', 'sub1', <SettingOutlined />, [
    getItem('Mecidion Area GPS', '3'),
    getItem('Frecuencia Cardíaca', '4'),
    getItem('Niveles de alcohol', '5'),
    getItem('Monitorio velocidad', '6'),
    getItem('Automatización Hogar', '7'),
  ])
];

export const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [targetTime, setTargetTime] = useState(null);

  useEffect(() => {
    const interval = setInterval(checkAndExecute, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  function toggleLight(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      if (button.classList.contains('off')) {
        button.classList.remove('off');
        button.classList.add('on');
        button.innerHTML = '<i class="fas fa-lightbulb"></i> Encendida';
      } else {
        button.classList.remove('on');
        button.classList.add('off');
        button.innerHTML = '<i class="fas fa-lightbulb"></i> Apagada';
      }
    }
  }

  function toggleDoor(buttonId) {
    const doorButton = document.getElementById(buttonId);
    if (doorButton) {
      if (doorButton.classList.contains('door-closed')) {
        doorButton.classList.remove('door-closed');
        doorButton.classList.add('door-open');
        doorButton.innerHTML = '<i class="fas fa-door-open"></i> Abierta';
      } else {
        doorButton.classList.remove('door-open');
        doorButton.classList.add('door-closed');
        doorButton.innerHTML = '<i class="fas fa-door-closed"></i> Cerrada';
      }
    }
  }

  function sendPostRequest() {
    fetch('http://134.209.219.161:5000/control-todos-leds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'off' })
    })
      .then(response => {
        if (response.ok) {
          console.log('Todas las luces encendidas.');
          const button1 = document.getElementById('button1');
          if (button1) {
            button1.textContent = 'Encendida';
            button1.classList.remove('off');
            button1.classList.add('on');
          }
          return response.json();
        } else {
          throw new Error('Error al encender las luces: ' + response.statusText);
        }
      })
      .then(data => {
        console.log('Respuesta del servidor:', data);
      })
      .catch(error => {
        console.error('Error de red:', error);
      });
  }

  function sendPostRequest7() {
    const button = document.getElementById('button7');
    if (button) {
      const currentState = button.classList.contains('off') ? 'off' : 'on';
      const newState = currentState === 'off' ? 'on' : 'off';
      button.textContent = newState === 'off' ? 'Apagada' : 'Encendida';
      button.classList.toggle('off');
      button.classList.toggle('on');

      fetch('http://134.209.219.161:5000/control-led', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index: 7, action: newState })
      })
        .then(response => {
          if (response.ok) {
            console.log(`LED 7 ${newState === 'on' ? 'encendida.' : 'apagada.'}`);
            return response.json();
          } else {
            throw new Error('Error al cambiar el estado de la LED: ' + response.statusText);
          }
        })
        .then(data => {
          console.log('Respuesta del servidor:', data);
        })
        .catch(error => {
          console.error('Error en la solicitud:', error);
        });
    }
  }

  function setTime() {
    const timePicker = document.getElementById('timePicker');
    if (timePicker) {
      setTargetTime(timePicker.value);
      console.log('Hora establecida para encender las luces:', timePicker.value);
    }
  }

  function getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  function checkAndExecute() {
    const currentTime = getCurrentTime();
    if (targetTime && currentTime === targetTime) {
      sendPostRequest();
      console.log('Se ha ejecutado sendPostRequest() a las ' + currentTime);
      setTargetTime(null);
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" >
          <img src={logo} alt="Logo-Empresa" className='logo-image' />
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header className="main-layout-header" />
        <Content className="main-layout-content">
          
          <div className="main-layout-inner-content">
            
            
            <svg viewBox="0 0 1000 650">
              {/* Bloque 1 */}
              <rect className="room" x="50" y="150" width="150" height="150" />
              <text x="120" y="220">1</text>
              <foreignObject x="70" y="220" width="100" height="50">
                <button id="button1" className="control-button off" onClick={sendPostRequest}>
                  <i className="fas fa-lightbulb"></i> Apagada
                </button>
              </foreignObject>

              {/* Bloque 2 */}
              <rect className="room" x="50" y="300" width="150" height="250" />
              <text x="120" y="500">2</text>
              <foreignObject x="75" y="460" width="100" height="50">
                <button id="button2" className="control-button off" onClick={() => toggleLight('button2')}>
                  <i className="fas fa-lightbulb"></i> Apagada
                </button>
              </foreignObject>

              {/* Bloque 3 */}
              <rect className="room" x="200" y="50" width="180" height="500" />
              <text x="300" y="200">3</text>
              <foreignObject x="250" y="150" width="100" height="50">
                <button id="button3" className="control-button off" onClick={() => toggleLight('button3')}>
                  <i className="fas fa-lightbulb"></i> Apagada
                </button>
              </foreignObject>
              <foreignObject x="250" y="430" width="100" height="50">
                <button id="button3b" className="control-button off" onClick={() => toggleLight('button3b')}>
                  <i className="fas fa-lightbulb"></i> Apagada
                </button>
              </foreignObject>

              {/* Bloque 4 */}
              <rect className="room" x="380" y="50" width="500" height="200" />
              <text x="540" y="150">4</text>
              <foreignObject x="550" y="150" width="100" height="50">
                <button id="button4" className="control-button off" onClick={() => toggleLight('button4')}>
                  <i className="fas fa-lightbulb"></i> Apagada
                </button>
              </foreignObject>

              {/* Bloque 5 */}
              <rect className="room" x="380" y="250" width="500" height="100" />
              <text x="560" y="300">5</text>
              <foreignObject x="600" y="280" width="100" height="50">
                <button id="button5" className="control-button off" onClick={() => toggleLight('button5')}>
                  <i className="fas fa-lightbulb"></i> Apagada
                </button>
              </foreignObject>

              <foreignObject x="850" y="280" width="100" height="50">
                <button id="doorButton" className="control-button off" onClick={() => toggleDoor('doorButton')}>
                  <i className="fas fa-door-open"></i> Cerrada
                </button>
              </foreignObject>

              {/* Bloque 6 */}
              <rect className="room" x="380" y="350" width="150" height="200" />
              <text x="420" y="500">6</text>
              <foreignObject x="420" y="450" width="100" height="50">
                <button id="button6" className="control-button off" onClick={() => toggleLight('button6')}>
                  <i className="fas fa-lightbulb"></i> Apagada
                </button>
              </foreignObject>

              {/* Bloque 7 */}
              <rect className="room" x="530" y="350" width="400" height="270" />
              <text x="650" y="480">7</text>
              <foreignObject x="680" y="480" width="100" height="50">
                <button id="button7" className="control-button off" onClick={sendPostRequest7}>
                  <i className="fas fa-lightbulb"></i> Apagada
                </button>
              </foreignObject>

              {/* Bloque 8 */}
              <rect className="room" x="50" y="280" width="150" height="100" />
              <text x="120" y="340">8</text>
              <foreignObject x="75" y="310" width="100" height="50">
                <button id="button8" className="control-button off" onClick={() => toggleLight('button8')}>
                  <i className="fas fa-lightbulb"></i> Apagada
                </button>
              </foreignObject>
            </svg>

            {/* Selector de hora */}
            <div>
              <label htmlFor="timePicker">Selecciona la hora (HH:MM):</label>
              <input type="time" id="timePicker" defaultValue="14:00" />
              <button id="setTimeButton" onClick={setTime}>Establecer hora</button>
            </div>
          </div>
        </Content>
        <Footer className="main-layout-footer">
          Ant Design ©{new Date().getFullYear()} Created Daneri
        </Footer>
      </Layout>
    </Layout>
  );
};