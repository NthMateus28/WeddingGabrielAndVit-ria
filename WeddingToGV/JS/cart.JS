// Configuração e inicialização do Firebase diretamente neste arquivo
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

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const itemName = urlParams.get('item');
  const itemImg = urlParams.get('img');
  const itemId = urlParams.get('id');

  if (itemName && itemImg) {
    document.getElementById("item-name").textContent = itemName;
    document.getElementById("item-image").src = itemImg;
    document.getElementById("item-image").alt = itemName;
  }

  const form = document.querySelector('.gift-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    if (!nome || !itemName) {
      alert('Por favor, preencha seu nome.');
      return;
    }

    const data = {
      Nome: nome,
      Presente: itemName,
      Created: 'x-sheetmonkey-current-date-time'
    };

    fetch('https://api.sheetmonkey.io/form/92197EnuN6suSyeBDRuYa5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          if (itemId) {
            desativarPresentePorId(itemId, nome)
              .then(() => {
                alert('Presente registrado com sucesso! Obrigado 💖');
                form.reset();
                window.location.href = "../pages/giftList.html";
              })
              .catch(error => {
                console.error("Erro ao atualizar Firebase:", error);
                alert('Presente registrado, mas ocorreu um erro ao atualizar o status.');
              });
          } else {
            console.warn("ID do produto não encontrado na URL.");
            alert('Presente registrado com sucesso! Obrigado 💖');
            form.reset();
            window.location.href = "../pages/giftList.html";
          }
        } else {
          alert('Erro ao registrar. Tente novamente.');
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        alert('Erro de conexão. Tente mais tarde.');
      });
  });

  function desativarPresentePorId(id, nomePessoa) {
    const ref = firebase.database().ref("produtos/" + id);
    console.log("🔧 Atualizando:", ref.toString());

    return ref.update({
      status: "inativo",
      nomePessoas: nomePessoa
    })
    .then(() => console.log("✅ Status e nome atualizados com sucesso!"))
    .catch(err => {
      console.error("❌ Erro ao atualizar Firebase:", err);
      throw err;
    });
  }
});
