const firebaseConfig = {
    apiKey: "AIzaSyBaMj4lQzmevuWwqio-udKGLtMT31hW5Bw",
    authDomain: "lista-presentes-casament-d2207.firebaseapp.com",
    databaseURL: "https://lista-presentes-casament-d2207-default-rtdb.firebaseio.com",
    projectId: "lista-presentes-casament-d2207",
    storageBucket: "lista-presentes-casament-d2207.appspot.com",
    messagingSenderId: "942457963760",
    appId: "1:942457963760:web:1c41d0e5f52c37b6e82e35"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("cards-container");
  
    db.ref("produtos").once("value").then(snapshot => {
      const produtos = snapshot.val();
  
      for (let id in produtos) {
        const produto = produtos[id];
        if (produto.status === "inativo") {
          const card = document.createElement("div");
          card.className = "card";
  
          card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p><strong>Presenteado por:</strong><br> ${produto.nomePessoas || "Nome não informado"}</p>
          `;
  
          container.appendChild(card);
        }
      }
    });
  });
  