// Configuração do Firebase (usando compat)
const firebaseConfig = {
    apiKey: "AIzaSyAFDeiAptyKrAnMLrq93GAE1ayzXz3wDj4",
    authDomain: "lista-presentes-casament-d2207.firebaseapp.com",
    databaseURL: "https://lista-presentes-casament-d2207-default-rtdb.firebaseio.com",
    projectId: "lista-presentes-casament-d2207",
    storageBucket: "lista-presentes-casament-d2207.firebasestorage.app",
    messagingSenderId: "942457963760",
    appId: "1:942457963760:web:1c41d0e5f52c37b6e82e35"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  function carregarProdutos() {
    db.ref("produtos").once("value").then(snapshot => {
      const produtos = snapshot.val();
      const secoes = {};
  
      for (let id in produtos) {
        const p = produtos[id];
        if (p.status !== "ativo") continue;
  
        if (!secoes[p.categoria]) secoes[p.categoria] = [];
        secoes[p.categoria].push(`
          <div class="gift-item">
            <img src="${p.imagem}" alt="${p.nome}">
            <a class="btn" href="cart.html?item=${encodeURIComponent(p.nome)}&img=${encodeURIComponent(p.imagem)}&id=${id}">${p.nome}</a>
          </div>
        `);       
      }
  
      const container = document.createElement("div");
      for (let categoria in secoes) {
        container.innerHTML += `
          <section class="gift-section">
            <h3>${categoria}</h3>
            <div class="grid">
              ${secoes[categoria].join("")}
            </div>
          </section>
        `;
      }
  
      document.body.appendChild(container);
    });
  }
  
  window.addEventListener("DOMContentLoaded", carregarProdutos);
  
