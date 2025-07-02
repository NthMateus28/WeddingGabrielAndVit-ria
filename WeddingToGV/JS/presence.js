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

let pessoasSelecionadas = {};

function carregarPessoas() {
  db.ref("pessoas").once("value").then(snapshot => {
    const pessoas = snapshot.val();
    const container = document.getElementById("lista-presenca");

    for (let id in pessoas) {
      const pessoa = pessoas[id];
      if (pessoa.status === "Confirmado") continue;

      const div = document.createElement("div");
      div.className = "person-item";
      div.innerHTML = `
        <label>
          <input type="checkbox" data-id="${id}" />
          ${pessoa.nome}
        </label>
        <input type="number" min="0" placeholder="Idade" disabled />
      `;
      container.appendChild(div);
    }

    adicionarListeners();
  }).catch(error => {
    console.error("Erro ao carregar pessoas do Firebase:", error);
  });
}

function adicionarListeners() {
  document.querySelectorAll('.person-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener("change", function () {
      const idadeInput = this.closest(".person-item").querySelector('input[type="number"]');
      idadeInput.disabled = !this.checked;
      if (!this.checked) idadeInput.value = "";
      calcularValor();
    });
  });

  document.querySelectorAll('.person-item input[type="number"]').forEach(input => {
    input.addEventListener("input", calcularValor);
  });

  document.getElementById("prosseguir").addEventListener("click", () => {
    const pessoas = [];
    document.querySelectorAll(".person-item").forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      const idadeInput = item.querySelector('input[type="number"]');

      if (checkbox.checked && idadeInput.value) {
        const idade = parseInt(idadeInput.value, 10);
        const nome = checkbox.parentElement.textContent.trim();
        let valor = 0;
        if (idade > 12) valor = 60;
        else if (idade >= 7) valor = 30;

        pessoas.push({ nome, idade, valor, id: checkbox.dataset.id });
      }
    });

    if (pessoas.length === 0) {
      alert("Selecione ao menos uma pessoa com idade.");
      return;
    }

    // Redirecionar para página de confirmação
    const dataEncoded = encodeURIComponent(JSON.stringify(pessoas));
    window.location.href = `../pages/confirmPresence.html?dados=${dataEncoded}`;
  });
}

function calcularValor() {
  let total = 0;
  document.querySelectorAll(".person-item").forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const idadeInput = item.querySelector('input[type="number"]');
    if (checkbox.checked && idadeInput.value) {
      const idade = parseInt(idadeInput.value, 10);
      if (idade > 12) total += 60;
      else if (idade >= 7) total += 30;
    }
  });

  document.getElementById("valor-total").textContent = `Valor Total: R$ ${total.toFixed(2)}`;
}

window.addEventListener("DOMContentLoaded", carregarPessoas);
