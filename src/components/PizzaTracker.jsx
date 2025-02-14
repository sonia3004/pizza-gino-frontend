
import React, { useState, useEffect } from "react";
import connectCommandeWebSocket from "../services/socket";


const statuses = [
  "pending",
  "en préparation",
  "prepared",
  "livraison_en_cours",
  "delivered"
];


const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
    "Z"
  ].join(" ");
};

const PizzaTracker = () => {
  const [commande, setCommande] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0); 
  const duration = 10000; 

  // Connexion au WebSocket pour récupérer la dernière commande
  useEffect(() => {
    const ws = connectCommandeWebSocket();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Données WebSocket reçues (PizzaTracker):", data);

      if (Array.isArray(data) && data.length > 0) {
        // Sélectionne la commande ayant l'ID le plus élevé (la plus récente)
        const lastCommande = data.reduce(
          (max, cmd) => (cmd.id > max.id ? cmd : max),
          data[0]
        );
        console.log("🆕 Dernière commande détectée :", lastCommande);
        setCommande(lastCommande);
      }
    };

    return () => {
      console.log("🔌 Déconnexion WebSocket (PizzaTracker)");
      ws.close();
    };
  }, []);

  const lastPizzaName = localStorage.getItem("lastPizzaName") || "Inconnu";

  // Mise à jour de l'animation et du statut de la commande
  useEffect(() => {
    if (commande) {
      const status = commande.statut.toLowerCase();
      const step = statuses.indexOf(status);
      setCurrentStep(step !== -1 ? step : 0);

      if (status === "delivered") {
        setProgress(1);
      } else {
        setProgress(0);
        const startTime = Date.now();
        let animationId;
        const tick = () => {
          const elapsed = Date.now() - startTime;
          let newProgress = elapsed / duration;
          if (newProgress >= 1) {
            newProgress = 1;
          }
          setProgress(newProgress);
          if (newProgress < 1) {
            animationId = requestAnimationFrame(tick);
          }
        };
        animationId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationId);
      }
    }
  }, [commande]);

  // Paramètres pour le tracker SVG
  const size = 300;
  const center = size / 2;
  const radius = 130; // rayon du cercle
  const totalSegments = statuses.length;
  const anglePerSegment = 360 / totalSegments;

  return (
    <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
      <h3>🛵 Suivi de la dernière commande</h3>
      {commande ? (
        <div>
          <p><strong>Commande n°{commande.id}</strong></p>
          <p>🍕 Produit : {lastPizzaName}</p>
          <p>📦 Statut : <strong>{commande.statut}</strong></p>
          
          {/* Tracker graphique */}
          <div style={{ marginTop: "20px" }}>
            <svg width={size} height={size}>
              {statuses.map((status, index) => {
                const startAngle = index * anglePerSegment;
                const endAngle = (index + 1) * anglePerSegment;
                let bgColor = "#e0e0e0";
                let progressArc = null;

                if (commande.statut.toLowerCase() === "delivered") {
                  bgColor = "red";
                } else if (index < currentStep) {
                  bgColor = "red";
                } else if (index === currentStep) {
                  bgColor = "#e0e0e0";
                  progressArc = (
                    <path
                      d={describeArc(center, center, radius, startAngle, startAngle + progress * anglePerSegment)}
                      fill="red"
                    />
                  );
                }

                return (
                  <g key={index}>
                    <path
                      d={describeArc(center, center, radius, startAngle, endAngle)}
                      fill={bgColor}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    {index === currentStep && commande.statut.toLowerCase() !== "delivered" && progressArc}
                    {(() => {
                      const midAngle = startAngle + anglePerSegment / 2;
                      const textRadius = radius * 0.58;
                      const { x, y } = polarToCartesian(center, center, textRadius, midAngle);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#000"
                          fontSize="12"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                        >
                          {status}
                        </text>
                      );
                    })()}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      ) : (
        <p>⏳ En attente d'une commande...</p>
      )}
    </div>
  );
};

export default PizzaTracker;
