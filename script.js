document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dados dos Produtos (Simulação de Banco de Dados) ---
    const PRODUCTS = [
        { id: 1, name: "PlayStation 5 Slim (825GB) - Edição Digital", price: 3999.00, image: "https://via.placeholder.com/250x150?text=PS5+Slim", category: "Console" },
        { id: 2, name: "Smart TV Samsung 50' 4K Crystal UHD", price: 2899.00, image: "https://via.placeholder.com/250x150?text=TV+50+4K", category: "TV" },
        { id: 3, name: "Smartphone Samsung Galaxy S23 128GB", price: 3599.00, image: "https://via.placeholder.com/250x150?text=S23+128GB", category: "Celular" },
        { id: 4, name: "iPhone 15 Pro Max 256GB - Azul Titanium", price: 8499.00, image: "https://via.placeholder.com/250x150?text=iPhone+15", category: "Celular" },
        { id: 5, name: "Home Theater JBL com Subwoofer 5.1 Canais", price: 1299.00, image: "https://via.placeholder.com/250x150?text=JBL+Home+Theater", category: "Áudio" },
        { id: 6, name: "Notebook Gamer Dell G15 Core i7", price: 6199.00, image: "https://via.placeholder.com/250x150?text=Notebook+Gamer", category: "Informática" }
    ];

    // --- 2. Funções de Utilidade (Carrinho e LocalStorage) ---
    const getCart = () => JSON.parse(localStorage.getItem('magaluCart')) || [];
    const saveCart = (cart) => localStorage.setItem('magaluCart', JSON.stringify(cart));
    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    // --- 3. Funções de Interface ---
    const updateCartCount = () => {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + 1, 0); // Conta itens únicos
        const counterElement = document.getElementById('carrinho-contador');
        
        if (counterElement) {
            counterElement.textContent = count;
            counterElement.style.display = count > 0 ? 'inline' : 'none';
        }
    };

    const showToast = (message) => {
        const toastMessage = document.getElementById('toast-message');
        if (toastMessage) {
            toastMessage.innerHTML = `<i class="fa-solid fa-check"></i> ${message}`;
            toastMessage.classList.add('show');
            setTimeout(() => toastMessage.classList.remove('show'), 3000);
        }
    };

    // --- 4. Lógica de Adicionar Produto (Para index.html) ---
    const renderProducts = () => {
        const productListContainer = document.getElementById('product-list');
        if (!productListContainer) return; // Só executa na index.html

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

        // Adiciona listener ao botão de compra
        document.querySelectorAll('.add-to-cart-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            });
        });
    };

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

    // --- 5. Lógica do Carrinho (Para carrinho.html) ---
    const renderCart = () => {
        const cartContainer = document.getElementById('cart-items-container');
        const cartSummary = document.getElementById('cart-summary');
        const emptyMessage = document.getElementById('empty-cart-message');

        if (!cartContainer) return; // Só executa na carrinho.html

        const cart = getCart();
        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }

        emptyMessage.style.display = 'none';
        cartSummary.style.display = 'block';

        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Quantidade: ${item.quantity}</p>
                </div>
                <div class="item-price">${formatCurrency(itemTotal)}</div>
                <i class="fa-solid fa-trash remove-button" data-id="${item.id}"></i>
            `;
            cartContainer.appendChild(cartItem);
        });

        // Atualiza o resumo
        const finalTotal = subtotal; // Frete Grátis na simulação
        document.getElementById('subtotal').textContent = formatCurrency(subtotal);
        document.getElementById('total-final').textContent = formatCurrency(finalTotal);

        // Adiciona listener para remover item
        document.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                removeFromCart(productId);
            });
        });
        
        // Listener para Finalizar Compra
        document.getElementById('btn-finalizar').addEventListener('click', () => {
            // Guarda o total no localStorage para ser usado no checkout
            localStorage.setItem('checkoutTotal', finalTotal);
            window.location.href = 'checkout.html';
        });
    };

    const removeFromCart = (productId) => {
        let cart = getCart();
        // Remove completamente o item do carrinho
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        renderCart(); // Renderiza novamente
        updateCartCount();
        showToast('Item removido do carrinho.');
    };

    // --- 6. Lógica de Checkout (Para checkout.html) ---
    const setupCheckout = () => {
        const pixTotalElement = document.getElementById('pix-total');
        const copyPixButton = document.getElementById('copy-pix');

        if (!pixTotalElement) return; // Só executa no checkout.html

        const total = parseFloat(localStorage.getItem('checkoutTotal')) || 0;
        
        // Aplica o desconto de 5% (simulado) para PIX
        const totalPix = total * 0.95; 
        
        pixTotalElement.textContent = formatCurrency(totalPix);
        
        // Lógica de Copiar Chave PIX
        copyPixButton.addEventListener('click', () => {
            const pixKeyInput = document.getElementById('pix-key');
            pixKeyInput.select();
            pixKeyInput.setSelectionRange(0, 99999);
            document.execCommand('copy');
            showToast('Chave PIX copiada!');
        });
        
        // Limpa o carrinho após o checkout
        localStorage.removeItem('magaluCart');
        localStorage.removeItem('checkoutTotal');
    };

    // --- 7. Inicialização ---
    updateCartCount();
    renderProducts();
    renderCart();
    setupCheckout();
});