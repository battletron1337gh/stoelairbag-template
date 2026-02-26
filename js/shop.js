/**
 * StoelAirbag Shop - Winkelwagen Functionaliteit
 * Uitgebreide winkelwagen met localStorage, checkout flow, en Shopify integratie
 */

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.bindEvents();
        this.initShopify();
    }

    // ===== LOCALSTORAGE =====
    loadCart() {
        const saved = localStorage.getItem('stoelairbag_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('stoelairbag_cart', JSON.stringify(this.items));
        this.updateCartUI();
        this.updateCartCount();
    }

    // ===== CART OPERATIONS =====
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || '../images/product-placeholder.jpg',
                quantity: product.quantity || 1,
                variant: product.variant || null
            });
        }
        
        this.saveCart();
        this.showNotification(`${product.name} toegevoegd aan winkelwagen`);
        this.openCart();
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // ===== UI UPDATES =====
    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Uw winkelwagen is leeg</p>
                    <a href="webshop.html" class="btn btn-secondary">Verder winkelen</a>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">€${item.price.toFixed(2)}</p>
                        ${item.variant ? `<p class="cart-item-variant">${item.variant}</p>` : ''}
                    </div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        if (cartTotal) {
            cartTotal.textContent = `€${this.getTotal().toFixed(2)}`;
        }

        this.updateCartCount();
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    // ===== EVENT BINDING =====
    bindEvents() {
        // Cart toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-btn') || e.target.closest('#cartOpen')) {
                this.openCart();
            }
            if (e.target.closest('#cartClose') || e.target.closest('#cartOverlay')) {
                this.closeCart();
            }
        });

        // Cart item interactions
        document.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.cart-item-remove');
            if (removeBtn) {
                const id = parseInt(removeBtn.dataset.id);
                this.removeItem(id);
            }

            const qtyMinus = e.target.closest('.qty-minus');
            if (qtyMinus) {
                const id = parseInt(qtyMinus.dataset.id);
                const item = this.items.find(i => i.id === id);
                if (item) this.updateQuantity(id, item.quantity - 1);
            }

            const qtyPlus = e.target.closest('.qty-plus');
            if (qtyPlus) {
                const id = parseInt(qtyPlus.dataset.id);
                const item = this.items.find(i => i.id === id);
                if (item) this.updateQuantity(id, item.quantity + 1);
            }
        });

        // Checkout button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-checkout')) {
                e.preventDefault();
                this.proceedToCheckout();
            }
        });
    }

    openCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===== SHOPIFY INTEGRATIE =====
    initShopify() {
        // Shopify store configuration
        this.shopifyConfig = {
            domain: 'stoelairbag.myshopify.com', // Vervang door jouw Shopify domein
            storefrontAccessToken: 'YOUR_STOREFRONT_ACCESS_TOKEN', // Vervang door je token
            apiVersion: '2024-01'
        };
    }

    // Converteer winkelwagen naar Shopify checkout
    async proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Uw winkelwagen is leeg', 'error');
            return;
        }

        // Optie 1: Shopify Cart API (directe redirect)
        const shopifyCartUrl = this.buildShopifyCartUrl();
        
        // Optie 2: Shopify AJAX API (voor embedded carts)
        // await this.createShopifyCheckout();

        // Voor nu: redirect naar Shopify cart
        window.location.href = shopifyCartUrl;
    }

    buildShopifyCartUrl() {
        // Bouw Shopify cart URL met producten
        const baseUrl = `https://${this.shopifyConfig.domain}/cart`;
        const items = this.items.map(item => `${item.id}:${item.quantity}`).join(',');
        return `${baseUrl}/${items}`;
    }

    // Shopify Storefront API - GraphQL checkout creatie
    async createShopifyCheckout() {
        const lineItems = this.items.map(item => ({
            variantId: btoa(`gid://shopify/ProductVariant/${item.id}`),
            quantity: item.quantity
        }));

        const query = `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
                checkoutCreate(input: $input) {
                    checkout {
                        id
                        webUrl
                    }
                    checkoutUserErrors {
                        field
                        message
                    }
                }
            }
        `;

        try {
            const response = await fetch(`https://${this.shopifyConfig.domain}/api/${this.shopifyConfig.apiVersion}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': this.shopifyConfig.storefrontAccessToken
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        input: { lineItems }
                    }
                })
            });

            const data = await response.json();
            
            if (data.data.checkoutCreate.checkout) {
                window.location.href = data.data.checkoutCreate.checkout.webUrl;
            } else {
                console.error('Checkout errors:', data.data.checkoutCreate.checkoutUserErrors);
                this.showNotification('Er is iets misgegaan. Probeer het opnieuw.', 'error');
            }
        } catch (error) {
            console.error('Shopify checkout error:', error);
            this.showNotification('Er is iets misgegaan. Probeer het opnieuw.', 'error');
        }
    }

    // ===== NOTIFICATIONS =====
    showNotification(message, type = 'success') {
        // Verwijder bestaande notifications
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== GLOBAL FUNCTIONS =====

// Add to cart from product cards
function addToCart(id, name, price, image = null) {
    const cart = window.shoppingCart || new ShoppingCart();
    window.shoppingCart = cart;
    
    cart.addItem({
        id,
        name,
        price,
        image: image || `../images/product-${id}.jpg`,
        quantity: 1
    });
}

// Quick view modal
function quickView(productId) {
    // Product data - in productie zou dit uit een database/API komen
    const products = {
        1: {
            name: 'Airbag Module Volkswagen Golf 6/7',
            price: 149.95,
            description: 'Originele kwaliteit airbag module geschikt voor Volkswagen Golf 6 en 7. Plug & play installatie.',
            image: '../images/product-airbag-vw.jpg',
            specs: ['Geschikt voor: Golf 6 & 7', 'Originele kwaliteit', 'Plug & play', '12 maanden garantie']
        },
        2: {
            name: 'Universele Stoelhoes - Zwart Leerlook',
            price: 39.95,
            description: 'Hoogwaardige universele stoelhoes in zwart lederlook. Waterafstotend en slijtvast.',
            image: '../images/product-hoes-universal.jpg',
            specs: ['Universele pasvorm', 'Waterafstotend', 'Eenvoudige montage', 'Set van 2 voorstoelen']
        }
        // ... meer producten
    };

    const product = products[productId];
    if (!product) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quickview-modal';
    modal.innerHTML = `
        <div class="quickview-overlay" onclick="closeQuickView()"></div>
        <div class="quickview-content">
            <button class="quickview-close" onclick="closeQuickView()">
                <i class="fas fa-times"></i>
            </button>
            <div class="quickview-grid">
                <div class="quickview-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quickview-details">
                    <h2>${product.name}</h2>
                    <p class="quickview-price">€${product.price.toFixed(2)}</p>
                    <p class="quickview-description">${product.description}</p>
                    <ul class="quickview-specs">
                        ${product.specs.map(spec => `<li><i class="fas fa-check"></i> ${spec}</li>`).join('')}
                    </ul>
                    <div class="quickview-actions">
                        <div class="quantity-selector">
                            <button class="qty-btn" onclick="updateQuickViewQty(-1)">-</button>
                            <input type="number" value="1" min="1" id="quickViewQty" readonly>
                            <button class="qty-btn" onclick="updateQuickViewQty(1)">+</button>
                        </div>
                        <button class="btn btn-primary btn-large" onclick="addToCartFromQuickView(${productId}, '${product.name}', ${product.price}, '${product.image}')">
                            <i class="fas fa-shopping-cart"></i> In winkelwagen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Store current product for quick view
    window.currentQuickViewProduct = product;
}

function closeQuickView() {
    const modal = document.querySelector('.quickview-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function updateQuickViewQty(change) {
    const input = document.getElementById('quickViewQty');
    if (input) {
        let value = parseInt(input.value) + change;
        if (value < 1) value = 1;
        input.value = value;
    }
}

function addToCartFromQuickView(id, name, price, image) {
    const qty = parseInt(document.getElementById('quickViewQty')?.value || 1);
    addToCart(id, name, price, image);
    closeQuickView();
}

// ===== INITIALISATIE =====
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
    
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `€${e.target.value}`;
        });
    }

    // Kenteken zoek functionaliteit
    const kentekenSearch = document.getElementById('kentekenSearchBtn');
    const kentekenInput = document.getElementById('kentekenInput');
    const kentekenResult = document.getElementById('kentekenResult');

    if (kentekenSearch && kentekenInput) {
        kentekenSearch.addEventListener('click', () => {
            const kenteken = kentekenInput.value.trim();
            if (kenteken) {
                searchByLicensePlate(kenteken);
            }
        });

        kentekenInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                kentekenSearch.click();
            }
        });
    }

    function searchByLicensePlate(kenteken) {
        // Simuleer API call - in productie zou dit naar RDW API gaan
        kentekenResult.style.display = 'block';
        kentekenResult.innerHTML = `
            <div class="kenteken-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Kenteken wordt gecontroleerd...</p>
            </div>
        `;

        setTimeout(() => {
            // Simuleer resultaat
            const mockResult = {
                merk: 'Volkswagen',
                model: 'Golf',
                type: '1.6 TDI Comfortline',
                bouwjaar: '2018',
                brandstof: 'Diesel'
            };

            kentekenResult.innerHTML = `
                <div class="kenteken-success">
                    <div class="vehicle-info">
                        <h3><i class="fas fa-car"></i> ${mockResult.merk} ${mockResult.model}</h3>
                        <p>${mockResult.type} | ${mockResult.bouwjaar} | ${mockResult.brandstof}</p>
                    </div>
                    <div class="compatible-products">
                        <h4>Geschikte producten voor uw auto:</h4>
                        <div class="compatible-list">
                            <a href="#" class="compatible-item">
                                <span class="compatible-name">Airbag Module ${mockResult.merk} ${mockResult.model}</span>
                                <span class="compatible-price">€149,95</span>
                            </a>
                            <a href="#" class="compatible-item">
                                <span class="compatible-name">Maatwerk Stoelhoes ${mockResult.merk}</span>
                                <span class="compatible-price">€89,95</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }, 1500);
    }
});
