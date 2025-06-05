// Configuração do Firebase (usando compat)
const firebaseConfig = {
  apiKey: "AIzaSyBaMj4lQzmevuWwqio-udKGLtMT31hW5Bw",
  authDomain: "lista-presentes-casament-d2207.firebaseapp.com",
  databaseURL: "https://lista-presentes-casament-d2207-default-rtdb.firebaseio.com",
  projectId: "lista-presentes-casament-d2207",
  storageBucket: "lista-presentes-casament-d2207.appspot.com",
  messagingSenderId: "942457963760",
  appId: "1:942457963760:web:1c41d0e5f52c37b6e82e35"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

window.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-pessoas");

  db.ref("pessoas").once("value").then(snapshot => {
    const pessoas = snapshot.val();

    for (let id in pessoas) {
      const pessoa = pessoas[id];

      if (pessoa.status === "Confirmado") {
        const li = document.createElement("li");
        li.className = "pessoa-item";

        const nome = document.createElement("span");
        nome.className = "pessoa-nome";
        nome.textContent = pessoa.nome;

        const pagamento = document.createElement("div");
        pagamento.className = "pessoa-pagamento";

        if (pessoa.pagamento === "Confirmado") {
          pagamento.innerHTML = `<span class="pago">✅ Pago</span>`;
        } else {
          const btn = document.createElement("button");
          btn.textContent = "Confirmar Pagamento";

          btn.addEventListener("click", () => {
            db.ref("pessoas/" + id).update({ pagamento: "Confirmado" })
              .then(() => {
                pagamento.innerHTML = `<span class="pago">✅ Pago</span>`;
              })
              .catch(err => {
                console.error("Erro ao confirmar pagamento:", err);
                alert("Erro ao confirmar o pagamento. Tente novamente.");
              });
          });

          pagamento.appendChild(btn);
        }

        li.appendChild(nome);
        li.appendChild(pagamento);
        lista.appendChild(li);
      }
    }
  }).catch(error => {
    console.error("Erro ao carregar pessoas:", error);
    alert("Erro ao carregar lista de pessoas.");
  });
});
