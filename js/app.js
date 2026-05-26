const main = document.querySelector("main");
let ans = document.getElementById("ans");
let subTitle = document.getElementById("sub-title");
let emptyImg = document.getElementById("ans-img-empty");
let notas = JSON.parse(localStorage.getItem("notas")) || [];
document.getElementById("create-item").addEventListener("click", () => abrirModal("criar"));

// Abrir formulário

function abrirModal(modo, cardObj = null, cardElement = null) {
   // Modificações no body

   document.body.style.overflow = "hidden";

   // Criação do formulário

   let createNote = document.createElement("div");
   createNote.id = "create-note";
    main.appendChild(createNote);

   let blur = document.createElement("div");
   blur.classList.add("blur");
    main.appendChild(blur);

   createNote.innerHTML = `
      <span id="list-close-wrapper">
         <button id="list-close"></button>
      </span>
      <form id="form">
         <span id="ipt-title-wrapper">
            <label id="ipt-title-label" for="ipt-title">Titulo</label>
            <input id="ipt-title" type="text" required>
         </span>
         <span id="ipt-text-wrapper">
            <label id="ipt-text-label" for="ipt-text">
               Anotação
               <textarea id="ipt-text" cols="30" rows="10" required></textarea>
            </label>
         </span>
      </form>
      <span id="cl-se-btn-wrapper">
         <input id="clean" class="btn" type="reset" value="Limpar" form="form">
         <button id="send" class="btn" type="submit" form="form">Enviar</button>
      </span>
   `
   const iptTitle = document.getElementById("ipt-title");
   const iptText = document.getElementById("ipt-text");

   const listClose = document.getElementById("list-close");
   const form = document.getElementById("form");

   listClose.addEventListener("click", () => fecharModal());
   blur.addEventListener("click", () => fecharModal());
   // Enivar formulário

   form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (modo === "criar") {
         const novaNota = {
            id: Date.now(),
            titulo: iptTitle.value,
            texto: iptText.value,
            data: new Date().toLocaleDateString("pt-BR"),
         };
         criarCard(novaNota);
      } else {
         e.preventDefault();
         cardElement.querySelector(".card-title").textContent = iptTitle.value;
         cardElement.querySelector(".card-text").textContent = iptText.value;
         cardElement.querySelector(".card-date").textContent = new Date().toLocaleDateString("pt-BR");

         const index = notas.findIndex(nota => nota.id === cardObj.id);
         if (index !== -1) {
            notas[index].titulo = iptTitle.value;
            notas[index].texto = iptText.value;
            notas[index].data = new Date().toLocaleDateString("pt-BR");
            salvarNotas();
         };
      };
      fecharModal();
   });

   if (modo === "editar" && cardObj) {
      iptTitle.value = cardElement.querySelector(".card-title").textContent;
      iptText.value = cardElement.querySelector(".card-text").textContent;
   };

   // Fechar formulário

   function fecharModal() {
      document.body.style.overflow = "auto";
      createNote.remove();
      blur.remove();
   };
};

// Criar card 

function criarCard(cardObj, salvar = true) {
   if (salvar) {
      notas.unshift(cardObj);
      salvarNotas();
   }

   const card = document.createElement("div");
    card.classList.add("card");

   // Top wrapper

   const topWrapper = document.createElement("span");
    topWrapper.classList.add("card-top-wrapper");

   const title = document.createElement("h1");
    title.classList.add("card-title");
    title.textContent = cardObj.titulo;

   const hr = document.createElement("hr");

   const text = document.createElement("p");
    text.classList.add("card-text");
    text.textContent = cardObj.texto;

   topWrapper.appendChild(title);
   topWrapper.appendChild(hr);
   topWrapper.appendChild(text);

   // Bottom wrapper

   const bottomWrapper = document.createElement("span");
    bottomWrapper.classList.add("card-bottom-wrapper");

   bottomWrapper.innerHTML = `
      <p class="card-date">${cardObj.data}</p>
      <span class="CardBtnsWrapper">
      <button class="btn card-btn-edt">Editar</button>
         <button class="btn card-btn-del">Deletar</button>
      </span>
   `
   let deleteBtn =  bottomWrapper.querySelector('.card-btn-del');
   let editBtn = bottomWrapper.querySelector('.card-btn-edt');

   deleteBtn.addEventListener("click", () => confirmaDelete(card, cardObj));

   editBtn.addEventListener("click", () => abrirModal("editar", cardObj, card));

   card.appendChild(topWrapper);
   card.appendChild(bottomWrapper);
   ans.prepend(card);
   verificaCards();
};

// Confirma o delete do card

function confirmaDelete(card, cardObj) {
   const modal = document.createElement("div");
    modal.id = "confirm-modal";
    main.appendChild(modal);

   const blur = document.createElement("div");
    blur.classList.add("blur");
    main.appendChild(blur);

   modal.innerHTML = `
      <span id="list-close-wrapper">
         <button id="list-close"></button>
      </span>
      <p id="confirm-msg">Deseja mesmo deletar esta nota ?</p>
      <span id="confirm-btns-wrapper">
         <button class="btn" id="confirm-yes">Deletar</button>
         <button class="btn" id="confirm-no">Cancelar</button>
      </span>
   `;

   const confirmYes = modal.querySelector("#confirm-yes");
   const confirmNo = modal.querySelector("#confirm-no");

   function fecharConfirm() {
      modal.remove();
      blur.remove();
   };

   confirmYes.addEventListener("click", () => {
      notas = notas.filter(nota => nota.id !== cardObj.id);

      card.remove();
      salvarNotas();
      verificaCards();
      fecharConfirm();
   });

   confirmNo.addEventListener("click", () => fecharConfirm());
   blur.addEventListener("click", () => fecharConfirm());
   modal.querySelector("#list-close").addEventListener("click", () => fecharConfirm());
};

// Salvar cards

function salvarNotas() {
   localStorage.setItem("notas", JSON.stringify(notas));
}

function carregarNotas() {
   [...notas].reverse().forEach(nota => criarCard(nota, false));
}

// Verificar a existencia de cards

function verificaCards() {
   if (ans.children.length === 0) {
      subTitle.style.display = "none";
      emptyImg.style.display = "flex";

   } else {
      subTitle.style.display = "flex";
      emptyImg.style.display = "none";
   };
};
carregarNotas();
verificaCards();

