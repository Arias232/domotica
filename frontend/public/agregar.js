import React, { useState, useEffect } from 'react';
import { Plus, Home, ChevronDown, ChevronUp } from 'lucide-react';
import './index.css';

const DomoticaHomeManager = () => {
  const [homes, setHomes] = useState(() => {
    const savedHomes = localStorage.getItem('homes');
    return savedHomes ? JSON.parse(savedHomes) : [
      { id: 1, name: 'Casa Principal', location: 'Calle 123, Ciudad', lastAccessed: '2024-02-19 15:30' },
      { id: 2, name: 'Casa de Verano', location: 'Playa del Sol', lastAccessed: '2024-01-05 10:15' },
    ];
  });
  
  const [showDevices, setShowDevices] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');
  const [newHomeLocation, setNewHomeLocation] = useState('');

  const addHome = () => {
    const newHome = {
      id: homes.length + 1,
      name: newHomeName || `Nueva Casa ${homes.length + 1}`,
      location: newHomeLocation || 'Ingrese ubicación',
      lastAccessed: new Date().toLocaleString(),
    };
    const updatedHomes = [...homes, newHome];
    setHomes(updatedHomes);
    localStorage.setItem('homes', JSON.stringify(updatedHomes));
    setNewHomeName('');
    setNewHomeLocation('');
  };

  // Función para eliminar una casa
  const deleteHome = (id) => {
    const updatedHomes = homes.filter(home => home.id !== id);
    setHomes(updatedHomes);
    localStorage.setItem('homes', JSON.stringify(updatedHomes));
  };

  useEffect(() => {
    localStorage.setItem('homes', JSON.stringify(homes));
  }, [homes]);

  return (
    <div className="bg-gray-100 p-6 max-w-2xl mx-auto rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Home className="mr-2" /> Gestionar Casas Domóticas
        </h1>
        <button onClick={addHome} className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center">
          <Plus className="mr-1" /> Agregar Casa
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Revise dónde se puede usar su cuenta y considere cambiar su contraseña para mayor seguridad.
        <a href="#" className="text-blue-500 hover:underline ml-1">Más información sobre casas domóticas.</a>
      </p>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Nombre de la casa" 
          value={newHomeName} 
          onChange={(e) => setNewHomeName(e.target.value)} 
          className="border p-2 rounded w-full mb-2"
        />
        <input 
          type="text" 
          placeholder="Ubicación de la casa" 
          value={newHomeLocation} 
          onChange={(e) => setNewHomeLocation(e.target.value)} 
          className="border p-2 rounded w-full"
        />
      </div>

      {homes.map(home => (
        <div key={home.id} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{home.name}</h2>
              <p className="text-sm text-gray-600">{home.location}</p>
              <p className="text-xs text-gray-500">Último acceso: {home.lastAccessed}</p>
            </div>
            <div className="flex items-center">
              <button className="bg-red-500 text-white px-3 py-1 rounded text-sm" onClick={() => deleteHome(home.id)}>Eliminar</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded text-sm ml-2">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      ))}
      
      <button 
        onClick={() => setShowDevices(!showDevices)}
        className="flex items-center text-blue-500 hover:underline"
      >
        {showDevices ? <ChevronUp className="mr-1" /> : <ChevronDown className="mr-1" />}
        {showDevices ? 'Ocultar dispositivos' : 'Mostrar dispositivos'}
      </button>

      {showDevices && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Dispositivos conectados:</h3>
          <ul className="list-disc list-inside">
            <li>Smart TV Samsung</li>
            <li>Termostato Nest</li>
            <li>Luces Phillips Hue</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DomoticaHomeManager;
