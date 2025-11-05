document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dados dos Produtos (Simulação de Banco de Dados) ---
    const PRODUCTS = [
        { id: 1, name: "PlayStation 5 Slim (825GB) - Edição Digital", price: 3999.00, image: "https://via.placeholder.com/250x150?text=PS5+Slim" },
        { id: 2, name: "Smart TV Samsung 50' 4K Crystal UHD", price: 2899.00, image: "https://via.placeholder.com/250x150?text=TV+50+4K" },
        { id: 3, name: "Smartphone Samsung Galaxy S23 128GB", price: 3599.00, image: "https://via.placeholder.com/250x150?text=S23+128GB" },
        { id: 4, name: "iPhone 15 Pro Max 256GB - Azul Titanium", price: 8499.00, image: "https://via.placeholder.com/250x150?text=iPhone+15" },
        { id: 5, name: "Home Theater JBL com Subwoofer 5.1 Canais", price: 1299.00, image: "https://via.placeholder.com/250x150?text=JBL+Home+Theater" },
        { id: 6, name: "Notebook Gamer Dell G15 Core i7", price: 6199.00, image: "https://via.placeholder.com/250x150?text=Notebook+Gamer" }
    ];

    // --- 2. Variáveis do DOM e Utilidades ---
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const openCartBtn = document.getElementById('open-cart-btn');
    const cartContainer = document.getElementById('cart-items-container');
    const productListContainer = document.getElementById('product-list');
    const btnGotoCheckout = document.getElementById('btn-goto-checkout');
    const btnBackToShop = document.getElementById('btn-back-to-shop');
    const copyPixButton = document.getElementById('copy-pix');
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');

    const getCart = () => JSON.parse(localStorage.getItem('magaluCart')) || [];
    const saveCart = (cart) => localStorage.setItem('magaluCart', JSON.stringify(cart));
    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    // --- 3. Funções de Interface ---
    
    // Função para mostrar a mensagem de sucesso
    const showToast = (message) => {
        const toastMessage = document.getElementById('toast-message');
        toastMessage.innerHTML = `<i class="fa-solid fa-check"></i> ${message}`;
        toastMessage.classList.add('show');
        setTimeout(() => toastMessage.classList.remove('show'), 3000);
    };

    // Função que atualiza o contador do carrinho no cabeçalho
    const updateCartCount = () => {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + 1, 0); 
        
        document.getElementById('carrinho-contador').textContent = count;
        document.getElementById('carrinho-contador').style.display = count > 0 ? 'inline' : 'none';
        
        if (document.getElementById('cart-item-count-modal')) {
             document.getElementById('cart-item-count-modal').textContent = count;
        }
    };
    
    // Função para abrir e fechar modais
    const openModal = (modalElement) => modalElement.style.display = 'block';
    const closeModal = (modalElement) => modalElement.style.display = 'none';

    // --- 4. Lógica da Loja (Renderização de Produtos) ---
    
    const renderProducts = () => {
        if (!productListContainer) return; 

        PRODUCTS.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${formatCurrency(product.price)}</p>
                <button class="add-to-cart-button" data-id="${product.id}">Adicionar ao Carrinho</button>
            `;
            productListContainer.appendChild(card);
        });

        document.querySelectorAll('.add-to-cart-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            });
        });
    };

    // --- 5. Lógica do Carrinho ---
    
    const addToCart = (productId) => {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const product = PRODUCTS.find(p => p.id === productId);
            if (product) {
                cart.push({ ...product, quantity: 1 });
            }
        }

        saveCart(cart);
        updateCartCount();
        showToast('Produto adicionado ao carrinho!');
    };

    const removeFromCart = (productId) => {
        let cart = getCart();
        // Remove completamente o item do carrinho
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        renderCart(); // Renderiza novamente
        updateCartCount();
        showToast('Item removido.');
    };
    
    const renderCart = () => {
        const cart = getCart();
        cartContainer.innerHTML = '';
        let subtotal = 0;
        
        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }

        emptyMessage.style.display = 'none';
        cartSummary.style.display = 'block';

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Qtd: ${item.quantity}</p>
                </div>
                <div class="item-price">${formatCurrency(itemTotal)}</div>
                <i class="fa-solid fa-trash remove-button" data-id="${item.id}"></i>
            `;
            cartContainer.appendChild(cartItem);
        });
        
        // Atualiza o total
        document.getElementById('total-final').textContent = formatCurrency(subtotal);

        // Adiciona listener para remover item
        document.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                removeFromCart(productId);
            });
        });
    };

    // --- 6. Lógica de Checkout PIX ---
    
    const setupCheckout = () => {
        const cart = getCart();
        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Aplica o desconto de 5% (simulado) para PIX
        const totalPix = total * 0.95; 
        
        document.getElementById('pix-total').textContent = formatCurrency(totalPix);
    };

    // --- 7. Event Listeners ---
    
    // Abrir o Modal do Carrinho
    openCartBtn.addEventListener('click', () => {
        renderCart();
        openModal(cartModal);
    });

    // Fechar Modais (usando o 'x')
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = e.target.dataset.modal;
            closeModal(document.getElementById(modalId));
        });
    });

    // Finalizar Compra -> Abrir Modal de Checkout
    btnGotoCheckout.addEventListener('click', () => {
        closeModal(cartModal);
        setupCheckout();
        openModal(checkoutModal);
    });
    
    // Copiar Chave PIX
    copyPixButton.addEventListener('click', () => {
        const pixKeyInput = document.getElementById('pix-key');
        pixKeyInput.select();
        document.execCommand('copy');
        showToast('Chave PIX copiada!');
    });
    
    // Voltar à Loja do Checkout (simula a conclusão)
    btnBackToShop.addEventListener('click', () => {
        // Zera o carrinho após simular o pagamento
        localStorage.removeItem('magaluCart');
        updateCartCount();
        closeModal(checkoutModal);
        showToast('Compra finalizada com sucesso! Seu carrinho foi zerado.');
    });


    // --- 8. Inicialização ---
    updateCartCount();
    renderProducts();
});
