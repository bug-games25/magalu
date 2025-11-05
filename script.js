document.addEventListener('DOMContentLoaded', () => {
    // === 1. Dados dos Produtos (Simulação de uma API) ===
    const PRODUCTS = [
        { id: 1, name: "PlayStation 5 Slim 825GB - Edição Digital", price: 3999.00, oldPrice: 4299.00, image: "https://images.samsung.com/is/image/samsung/p6pim/br/ps5-slim-digital/ps5-slim-digital-front-black-thumb.png?$lazy-webp$" },
        { id: 2, name: "Smart TV Samsung 50' 4K Crystal UHD", price: 2899.00, oldPrice: 3199.00, image: "https://images.samsung.com/is/image/samsung/br-uhd-au8000/dynamic-black-1.png?$lazy-webp$" },
        { id: 3, name: "Smartphone Samsung Galaxy S23 128GB", price: 3599.00, oldPrice: 3999.00, image: "https://images.samsung.com/is/image/samsung/p6pim/br/galaxy-s23/gallery/br-galaxy-s23-s911-sm-s911bzkgzto-thumb-534720641.png?$lazy-webp$" },
        { id: 4, name: "Notebook Gamer Dell G15 Core i7", price: 6199.00, oldPrice: 6899.00, image: "https://m.media-amazon.com/images/I/71YyM-nJ+OL._AC_UF1000,1000_QL80_.jpg" },
        { id: 5, name: "Fritadeira Air Fryer Mondial 4L", price: 499.00, oldPrice: 599.00, image: "https://m.media-amazon.com/images/I/61r590-w5eL._AC_SL1500_.jpg" },
        { id: 6, name: "Fone de Ouvido Bluetooth JBL Tune 510BT", price: 249.00, oldPrice: 329.00, image: "https://m.media-amazon.com/images/I/61P9oNnf4cL._AC_SL1500_.jpg" }
    ];

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const productListContainer = document.getElementById('product-list');
    const carrinhoContador = document.getElementById('carrinho-contador');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalValue = document.getElementById('cart-total-value');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const noResultsMessage = document.getElementById('no-results');
    const pageMainTitle = document.getElementById('page-main-title');


    // --- 2. Funções Auxiliares ---

    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    const saveCart = () => {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        updateCartDisplay();
    };

    const showToast = (message) => {
        const toast = document.getElementById('toast-message');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };


    // --- 3. Renderização de Produtos na Tela Inicial ---

    const renderProductCard = (product) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price-box">
                <p class="old-price">${formatCurrency(product.oldPrice)}</p>
                <p class="current-price">${formatCurrency(product.price)}</p>
            </div>
            <button class="add-to-cart-button" data-id="${product.id}">Adicionar ao Carrinho</button>
        `;
        // Adiciona o evento de clique ao botão "Adicionar ao Carrinho"
        card.querySelector('.add-to-cart-button').addEventListener('click', (e) => {
            addToCart(product.id);
            showToast(`"${product.name.substring(0, 20)}..." adicionado!`);
        });

        productListContainer.appendChild(card);
    };

    const renderProducts = (productsToRender = PRODUCTS) => {
        productListContainer.innerHTML = '';
        noResultsMessage.style.display = 'none';

        if (productsToRender.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        }

        productsToRender.forEach(renderProductCard);
    };


    // --- 4. Funcionalidades do Carrinho ---

    const addToCart = (productId) => {
        const product = PRODUCTS.find(p => p.id === productId);
        const cartItem = carrinho.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            carrinho.push({ ...product, quantity: 1 });
        }
        saveCart();
    };

    const removeFromCart = (productId) => {
        carrinho = carrinho.filter(item => item.id !== productId);
        saveCart();
        renderCartItems();
    };

    const updateQuantity = (productId, change) => {
        const item = carrinho.find(i => i.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                renderCartItems();
            }
        }
    };

    const renderCartItems = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (carrinho.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #555;">Seu carrinho está vazio.</p>';
        }

        carrinho.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <div class="item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <p>${item.name.substring(0, 30)}...</p>
                        <p style="font-weight: 700;">${formatCurrency(item.price)} x ${item.quantity}</p>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
                    <button class="remove-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can" style="color: #cc0000;"></i></button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemEl);
        });

        cartTotalValue.textContent = formatCurrency(total);
        
        // Adiciona event listeners para botões de quantidade e remoção
        cartItemsContainer.querySelectorAll('.qty-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const change = parseInt(e.currentTarget.dataset.change);
                updateQuantity(id, change);
            });
        });

        cartItemsContainer.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                removeFromCart(id);
            });
        });
    };

    const updateCartDisplay = () => {
        const totalItems = carrinho.reduce((acc, item) => acc + item.quantity, 0);
        carrinhoContador.textContent = totalItems;
        renderCartItems();
    };


    // --- 5. Funcionalidade de Busca (Search) ---

    const handleSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        let filteredProducts = PRODUCTS;

        if (query) {
            // Filtra os produtos que incluem a query no nome
            filteredProducts = PRODUCTS.filter(p => p.name.toLowerCase().includes(query));
            pageMainTitle.textContent = `Resultados da Busca por "${query}"`;
        } else {
            pageMainTitle.textContent = '🔥 Ofertas Especiais do Dia';
        }

        renderProducts(filteredProducts);
    };

    // Event Listeners para a busca
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });


    // --- 6. Inicialização e Eventos do Modal ---

    // Abre Modal
    document.getElementById('open-cart-btn').addEventListener('click', () => {
        cartModal.style.display = 'block';
        renderCartItems();
    });

    // Fecha Modal
    document.getElementById('close-cart-btn').addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Fecha Modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Inicialização da Aplicação
    renderProducts();
    updateCartDisplay();
});
