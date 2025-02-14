import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    orders: 0,
    revenue: 0,
    stock: 0,
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [isWebSocketActive, setIsWebSocketActive] = useState(false);

  // Fonction pour récupérer les métriques courantes
  const fetchMetrics = async () => {
    if (isWebSocketActive) return; 
    try {
      const response = await fetch('http://localhost:8000/api/metrics/');
      if (!response.ok) throw new Error('Erreur API');
      const data = await response.json();
      console.log("📊 API - Metrics reçues :", data);
      setMetrics(data);
    } catch (error) {
      console.error('❌ Erreur API metrics :', error);
    }
  };

  // Fonction pour récupérer les données historiques
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/metrics/historical/');
      if (!response.ok) throw new Error('Erreur API Historical');
      const data = await response.json();
      console.log("📊 API - Données historiques reçues :", data);
      setHistoricalData(data);
    } catch (error) {
      console.error('❌ Erreur API historical :', error);
    }
  };

  // Chargement initial et mise à jour périodique des métriques et des historiques
  useEffect(() => {
    fetchMetrics();
    fetchHistoricalData();

    // Intervalle pour actualiser les historiques toutes les 5 secondes
    const historicalInterval = setInterval(() => {
      fetchHistoricalData();
    }, 5000);

    return () => clearInterval(historicalInterval);
  }, [isWebSocketActive]);

  // WebSocket pour mises à jour en temps réel
  useEffect(() => {
    let ws;
    let reconnectInterval = null;

    const connectWebSocket = () => {
      console.log("📡 Connexion WebSocket...");
      ws = new WebSocket('ws://localhost:8000/ws/metrics/');

      ws.onopen = () => {
        console.log('✅ WebSocket connecté !');
        setIsWebSocketActive(true);
        if (reconnectInterval) {
          clearInterval(reconnectInterval);
          reconnectInterval = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📡 WebSocket - Données reçues :", data);

          if ('orders' in data && 'revenue' in data && 'stock' in data) {
            console.log("✅ WebSocket - Mise à jour des métriques !");
            setMetrics(data);
          } else {
            console.warn("⚠️ WebSocket - Données inattendues :", data);
          }
        } catch (error) {
          console.error('❌ WebSocket - Erreur parsing JSON', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket - Erreur :', error);
      };

      ws.onclose = () => {
        console.log('❌ WebSocket déconnecté. Tentative de reconnexion...');
        setIsWebSocketActive(false);
        if (!reconnectInterval) {
          reconnectInterval = setInterval(connectWebSocket, 3000);
        }
      };
    };

    setTimeout(connectWebSocket, 1000);

    return () => {
      if (ws) ws.close();
      if (reconnectInterval) clearInterval(reconnectInterval);
    };
  }, []);

  // Affichage dans la console pour vérifier la mise à jour des métriques
  useEffect(() => {
    console.log("🔄 Dashboard mis à jour avec :", metrics);
  }, [metrics]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>📊 Dashboard des Métriques</h2>
      
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '40px' }}>
        <p>🛒 Nombre de commandes passées : <span style={{ color: '#007bff' }}>{metrics.orders}</span></p>
        <p>💰 Recettes : <span style={{ color: '#28a745' }}>{metrics.revenue} €</span></p>
        <p>📦 Unités de pizzas en stock : <span style={{ color: '#dc3545' }}>{metrics.stock}</span></p>
      </div>

      {/* Conteneur pour afficher les deux graphiques côte à côte */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', marginTop: '20px' }}>
        {/* Graphique Revenu quotidien */}
        <div>
          <h3>📈 Revenu quotidien</h3>
          <LineChart
            width={500}
            height={300}
            data={historicalData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </div>

        {/* Graphique Commandes quotidiennes */}
        <div>
          <h3>📊 Commandes quotidiennes</h3>
          <LineChart
            width={500}
            height={300}
            data={historicalData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
