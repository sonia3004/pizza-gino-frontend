import React from 'react';
import PizzaCards from '../components/PizzaCards';
import PizzaTracker from '../components/PizzaTracker';

const ClientHome = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Importation de la police Google Fonts */}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap');
      </style>

      <header style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Dancing Script', cursive", 
          fontSize: '3rem', 
          fontWeight: '700',
          color: '#D32F2F', 
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Bienvenue chez Pizza Gino
        </h1>
        <p>
          Commandez votre pizza et <strong>suivez votre commande en temps réel</strong> !
        </p>
      </header>

      {/* Section principale : Grille de pizzas et photo de Gino */}
      <section style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1100px',
          }}
        >
          {/* Grille des pizzas correctement centrée */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginLeft: '150px',
            }}
          >
            <PizzaCards />
          </div>

          {/* Photo de Gino bien positionnée */}
          <div style={{ marginLeft: '20px' }}>
            <img
              src="https://i.postimg.cc/PfvzpxgH/gino.webp"
              alt="Gino"
              style={{
                height: '750px',
                width: 'auto',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>
      </section>

      {/* Section du PizzaTracker : ALIGNÉ avec la grille */}
      <section style={{ marginTop: '40px' }}>
        <h2 style={{ textAlign: 'left', marginLeft: '200px' }}>Ma commande :</h2> {/* 🔥 Déplacé vers la droite */}
        <div style={{ width: '75vw', maxWidth: '1100px', margin: '0 auto', marginLeft: '130px' }}>
          <PizzaTracker />
        </div>
      </section>
    </div>
  );
};

export default ClientHome;
