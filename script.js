// --- 1. Funcionalidade do Modal de Checkout ---
const btnComprar = document.getElementById('btn-comprar');
const modal = document.getElementById('modal-checkout');
const fecharModal = document.getElementsByClassName('fechar-modal')[0];

// Quando o usuário clica no botão "COMPRAR AGORA"
btnComprar.onclick = function() {
  modal.style.display = "block";
  
  // (Efeito 2) Dispara o feedback de "Adicionado ao carrinho"
  mostrarConfirmacaoCarrinho();
}

// Quando o usuário clica no 'x'
fecharModal.onclick = function() {
  modal.style.display = "none";
}

// Quando o usuário clica em qualquer lugar fora do modal, ele fecha
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// --- 2. Animação de "Adicionar ao Carrinho" ---
function mostrarConfirmacaoCarrinho() {
    const confirmacao = document.getElementById('confirmacao-carrinho');
    
    // Mostra o pop-up de confirmação
    confirmacao.classList.add('mostrar-confirmacao');

    // Remove o pop-up após 3 segundos
    setTimeout(() => {
        confirmacao.classList.remove('mostrar-confirmacao');
    }, 3000);
}


// --- 3. Validação Básica de Campo de CEP ---
const campoCep = document.getElementById('cep');
const avisoCep = document.getElementById('aviso-cep');

campoCep.addEventListener('input', function() {
    // Remove todos os não-dígitos para validar o CEP
    const cepValor = campoCep.value.replace(/\D/g, ''); 

    if (cepValor.length === 8) {
        avisoCep.textContent = 'Frete calculado: R$ 15,90. Prazo: 5 dias úteis.';
        avisoCep.style.color = 'green';
    } else if (cepValor.length > 0 && cepValor.length < 8) {
        avisoCep.textContent = 'O CEP deve ter 8 dígitos.';
        avisoCep.style.color = 'red';
    } else {
        avisoCep.textContent = '';
    }
});