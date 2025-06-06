// Configuração do Firebase (SDK compat)
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

// Recupera os dados do localStorage (enviados da página anterior)
const params = new URLSearchParams(window.location.search);
const dados = params.get("dados");
const selecionados = dados ? JSON.parse(decodeURIComponent(dados)) : [];

const confirmList = document.getElementById("confirm-list");
const totalEl = document.getElementById("total-confirmado");

let valorTotal = 0;

function calcularValor(idade) {
  if (idade <= 6) return 0;
  if (idade <= 12) return 28;
  return 56;
}

function formatarValor(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Monta visualmente a lista de confirmação
selecionados.forEach(pessoa => {
  const item = document.createElement("div");
  item.classList.add("confirm-item");

  const valor = calcularValor(Number(pessoa.idade));
  valorTotal += valor;

  item.innerHTML = `
    <span><strong>${pessoa.nome}</strong> - ${pessoa.idade} anos</span>
    <span>${formatarValor(valor)}</span>
  `;
  confirmList.appendChild(item);
});

totalEl.textContent = `Total a pagar: ${formatarValor(valorTotal)}`;

// Ao clicar em "Confirmar"
document.getElementById("confirmar-presenca").addEventListener("click", () => {
  if (!selecionados.length) {
    alert("Nenhuma pessoa selecionada.");
    return;
  }

  const requests = selecionados.map(pessoa => {
    const updates = db.ref("pessoas/" + pessoa.id).update({
      status: "Confirmado",
      idade: pessoa.idade
    });

    const envioSheet = fetch("https://api.sheetmonkey.io/form/92197EnuN6suSyeBDRuYa5", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Nome: pessoa.nome,
        Idade: pessoa.idade,
        Valor: formatarValor(calcularValor(Number(pessoa.idade))),
        Status: "Confirmado",
        Created: "x-sheetmonkey-current-date-time"
      })
    });

    return Promise.all([updates, envioSheet]);
  });

  Promise.all(requests)
    .then(() => {
      alert("Presença confirmada com sucesso! 💖");
      localStorage.removeItem("confirmacaoPresenca");
      window.location.href = "../pages/presence.html";
    })
    .catch(err => {
      console.error("Erro ao confirmar:", err);
      alert("Ocorreu um erro. Tente novamente.");
    });
});
