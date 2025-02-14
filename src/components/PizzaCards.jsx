
import React, { useState, useEffect } from 'react';

const PizzaCards = () => {
  const [produits, setProduits] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduits = async () => {
    try {
      console.log("🔄 Récupération des produits...");
      const response = await fetch('http://127.0.0.1:8000/api/produits/');
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      // Tri explicite par id pour garantir l'ordre
      const sortedData = data.sort((a, b) => a.id - b.id);
      console.log("✅ Produits reçus et triés :", sortedData);
      setProduits(sortedData);
      setLoading(false);  
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des produits:", error);
      setError(error);
      setLoading(false);
    }
  };

  //  Fonction pour récupérer les commandes
  const fetchCommandes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/commandes/');
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const commandesData = await response.json();
      setCommandes(commandesData);
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes:", err);
    }
  };

  // Chargement initial des produits et commandes
  useEffect(() => {
    fetchProduits();
    fetchCommandes();
    const interval = setInterval(fetchCommandes, 3000); // Vérifie les commandes toutes les 3s
    return () => clearInterval(interval);
  }, []);

  // Surveillance des commandes et mise à jour des produits si une commande est livrée
  useEffect(() => {
    if (commandes.some(cmd => cmd.statut === "delivered")) {
      console.log("📦 Une commande est livrée, mise à jour des produits...");
      fetchProduits(); // Met à jour la liste des produits après livraison
    }
  }, [commandes]);

  //  Fonction pour commander une pizza
  const handleCommander = async (produit) => {
    const commandeEnCours = commandes.some(
      cmd => cmd.produit === produit.id && cmd.statut !== "delivered"
    );

    if (commandeEnCours) {
      alert(`🚨 Une commande pour ${produit.nom} est déjà en cours. Veuillez attendre la livraison.`);
      return;
    }

    if (produit.quantite_disponible === 0) {
      alert(`🚫 Rupture de stock pour ${produit.nom} !`);
      return;
    }

    try {
      const commandeData = { produit: produit.id, quantite: 1, statut: "pending" };

      const response = await fetch("http://127.0.0.1:8000/api/commandes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commandeData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          alert("🚨 Stock insuffisant pour passer la commande.");
        } else {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return;
      }

      const newCommande = await response.json();
      console.log("✅ Commande créée :", newCommande);
      alert(`✅ Commande pour ${produit.nom} créée avec succès !`);

      // Stocker le nom de la pizza dans le localStorage
      localStorage.setItem("lastPizzaName", produit.nom);

      fetchCommandes(); 

    } catch (err) {
      console.error("❌ Erreur lors de la création de la commande:", err);
      alert("❌ Erreur lors de la création de la commande.");
    }
  };

  if (loading) return <p>⏳ Chargement des produits...</p>;
  if (error) return <p>❌ Erreur: {error.message}</p>;
  if (produits.length === 0) return <p>⚠️ Aucun produit disponible.</p>;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      justifyContent: 'center'
    }}>
      {produits.map(produit => {
        const commandeEnCours = commandes.some(
          cmd => cmd.produit === produit.id && cmd.statut !== "delivered"
        );

        return (
          <div
            key={produit.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              width: '200px',
            }}
          >
            <img
              src={produit.image_url}
              alt={produit.nom}
              style={{ width: '100%', borderRadius: '8px' }}
              onError={(e) => { e.target.src = '/images/default.jpg'; }} 
            />

            <h3>{produit.nom}</h3>
            <p>
              {produit.quantite_disponible > 0 
                ? `Disponible : ${produit.quantite_disponible}` 
                : `🚫 Rupture de stock`}
            </p>
            <button 
              onClick={() => handleCommander(produit)}
              disabled={produit.quantite_disponible === 0 || commandeEnCours}
              style={{
                backgroundColor: produit.quantite_disponible === 0 || commandeEnCours ? '#ccc' : '#007bff',
                color: 'white',
                cursor: produit.quantite_disponible === 0 || commandeEnCours ? 'not-allowed' : 'pointer',
              }}
            >
              {produit.quantite_disponible === 0 
                ? "Commander" 
                : commandeEnCours 
                  ? "Commande en cours..." 
                  : "Commander"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PizzaCards;
