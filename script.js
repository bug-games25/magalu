document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dados dos Produtos (Com URLs de Imagem) ---
    const PRODUCTS = [
        { id: 1, name: "PlayStation 5 Slim (825GB) - Edição Digital", price: 3999.00, image: "https://images.samsung.com/is/image/samsung/p6pim/br/ps5-slim-digital/ps5-slim-digital-front-black-thumb.png?$lazy-webp$" },
        { id: 2, name: "Smart TV Samsung 50' 4K Crystal UHD", price: 2899.00, image: "https://images.samsung.com/is/image/samsung/br-uhd-au8000/dynamic-black-1.png?$lazy-webp$" },
        { id: 3, name: "Smartphone Samsung Galaxy S23 128GB", price: 3599.00, image: "https://images.samsung.com/is/image/samsung/p6pim/br/galaxy-s23/gallery/br-galaxy-s23-s911-sm-s911bzkgzto-thumb-534720641.png?$lazy-webp$" },
        { id: 4, name: "iPhone 15 Pro Max 256GB - Azul Titanium", price: 8499.00, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-blue-titanium-select?wid=940&hei=1112&fmt=png-alpha&.v=1693082269550" },
        { id: 5, name: "Home Theater JBL com Subwoofer 5.1 Canais", price: 1299.00, image: "https://images.unsplash.com/photo-1627885060868-b8f4f9f7d0a2?q=80&w=150&h=150&fit=crop&auto=format" },
        { id: 6, name: "Notebook Gamer Dell G15 Core i7", price: 6199.00, image: "https://m.media-amazon.com/images/I/71YyM-nJ+OL._AC_UF1000,1000_QL80_.jpg" }
    ];

    const productListContainer = document.getElementById('product-list');
    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

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
        // Lógica de adicionar ao carrinho e inicialização (omitida por brevidade, mas deve estar completa)
    };
    
    renderProducts();
});
