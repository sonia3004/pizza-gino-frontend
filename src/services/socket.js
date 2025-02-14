
const connectCommandeWebSocket = () => {
    let socket = new WebSocket("ws://127.0.0.1:8000/ws/commandes/");
  
    socket.onopen = () => console.log("✅ WebSocket Commandes connecté !");
    
    socket.onmessage = (event) => console.log("📩 Nouvelle commande reçue :", event.data);
    
    socket.onerror = (error) => console.error("🚨 Erreur WebSocket (commandes) :", error);
    
    socket.onclose = (event) => {
        console.warn("❌ WebSocket Commandes déconnecté ! Code :", event.code);
        // 🕒 Attendre 2s avant de tenter une reconnexion
        setTimeout(() => {
            console.log("♻️ Tentative de reconnexion WebSocket Commandes...");
            connectCommandeWebSocket(); // Reconnecter
        }, 2000);
    };
  
    return socket;
  };
  
  export default connectCommandeWebSocket;
  