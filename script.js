// API Base URL - Use static JSON file for GitHub Pages
const API_URL = './products.json';

// Products data (loaded from JSON)
let products = [];
let cart = []; // Local cart storage

// Global State
let currentUser = null;
let currentFilter = 'all';
let currentPage = 'home';

// DOM Elements
const userBtn = document.getElementById('userBtn');
const userPopup = document.getElementById('userPopup');
const closePopup = document.getElementById('closePopup');
const authModal = document.getElementById('authModal');
const closeAuth = document.getElementById('closeAuth');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const adminLoginForm = document.getElementById('adminLoginForm');
const loginLink = document.getElementById('loginLink');
const logoutBtn = document.getElementById('logoutBtn');
const productsGrid = document.getElementById('productsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const cartBtn = document.querySelector('.cart-btn');
const checkoutForm = document.getElementById('checkoutForm');

// ===== CART STORAGE FUNCTIONS =====
function getCart() {
    if (!currentUser) return [];
    const savedCart = localStorage.getItem(`cart_${currentUser.id}`);
    return savedCart ? JSON.parse(savedCart) : [];
}

function saveCart(cartData) {
    if (!currentUser) return;
    localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cartData));
}

function getOrders() {
    if (!currentUser) return [];
    const savedOrders = localStorage.getItem(`orders_${currentUser.id}`);
    return savedOrders ? JSON.parse(savedOrders) : [];
}

function saveOrders(ordersData) {
    if (!currentUser) return;
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(ordersData));
}

// ===== AUTH MODAL TAB SWITCHING =====
function switchAuthForm(formType) {
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (formType === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        signupForm.classList.add('active-form');
        switchToLogin.style.display = 'block';
        switchToSignup.style.display = 'none';
    } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginForm.classList.add('active-form');
        switchToSignup.style.display = 'block';
        switchToLogin.style.display = 'none';
    }
}

// ===== EVENT LISTENERS =====
if (userBtn) userBtn.addEventListener('click', toggleUserPopup);
if (closePopup) closePopup.addEventListener('click', closeUserPopup);
if (closeAuth) closeAuth.addEventListener('click', closeAuthModal);
if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (signupForm) signupForm.addEventListener('submit', handleSignup);
if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);

// Switch auth forms
document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchAuthForm('signup');
});

document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchAuthForm('login');
});

if (loginLink) loginLink.addEventListener('click', (e) => { 
    e.preventDefault(); 
    openAuthModal(); 
    closeUserPopup(); 
});

if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckout);

if (filterButtons) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderProducts();
        });
    });
}

if (categoryCards) {
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            currentFilter = category;
            if (filterButtons) {
                filterButtons.forEach(btn => {
                    if (btn.dataset.filter === category) {
                        filterButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    }
                });
            }
            renderProducts();
        });
    });
}

// ===== PRODUCTS API CALLS =====
async function loadProducts(category = 'all') {
    try {
        console.log('Loading products from:', API_URL);
        
        const response = await fetch(API_URL);
        const data = await response.json();
        
        console.log('Products loaded:', data);
        
        if (data.success) {
            products = data.data || [];
            console.log('Products array:', products);
            renderProducts();
        } else {
            console.error('API error:', data.message);
            showNotification('Error loading products', 'error');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Failed to load products: ' + error.message, 'error');
    }
}

function renderProducts() {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';

    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);

    console.log('Rendering products. Filter:', currentFilter, 'Count:', filteredProducts.length);

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });

    addProductEventListeners();
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Stock logic
    const stock = parseInt(product.stock) || 0;
    let stockBadgeColor = '#4CAF50'; // green
    let stockText = '✅ In Stock';
    if (stock === 0) {
        stockBadgeColor = '#EF4444'; // red
        stockText = '❌ Out of Stock';
    } else if (stock <= 10) {
        stockBadgeColor = '#FFC107'; // orange
        stockText = `⚠️ Only ${stock} Left`;
    } else {
        stockBadgeColor = '#4CAF50';
        stockText = `📦 ${stock} Available`;
    }

    // Show image if present
    const imageDisplay = product.image_url
        ? `<img src="${product.image_url}" alt="${product.name}" style="width:100%;height:150px;object-fit:cover;border-radius:8px;" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">`
        : `<div style="font-size:3rem;display:flex;align-items:center;justify-content:center;height:150px;">🐾</div>`;

    // Build card
    card.innerHTML = `
        <div class="product-image">
            ${imageDisplay}
            <span class="product-badge">${product.discount || 'New'}</span>
        </div>
        <div class="product-info">
            <div class="product-category">${product.category.replace('-', ' ')}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-rating">
                <span class="stars">${'⭐'.repeat(Math.floor(product.rating || 0))}</span>
                <span class="count">(${product.reviews || 0})</span>
            </div>
            <div class="product-price">
                <span class="product-current-price">₱${parseFloat(product.price).toFixed(2)}</span>
            </div>
            <div class="product-stock">
                <span class="stock-badge"
                    style="
                        display:inline-block;
                        padding:0.28em 0.85em;
                        margin:0.3em 0 0.7em 0;
                        color:#fff;
                        background-color:${stockBadgeColor};
                        border-radius:14px;
                        font-size:0.95em;
                        font-weight:600;
                        letter-spacing:0.02em;
                    ">
                    ${stockText}
                </span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart" data-product-id="${product.id}" ${stock === 0 ? "disabled" : ""}>
                    ${stock === 0 ? '<i class="fas fa-ban"></i> Out of Stock' : '<i class="fas fa-shopping-cart"></i> Add'}
                </button>
            </div>
        </div>
    `;
    return card;
}

function addProductEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.productId));
        });
    });

    document.querySelectorAll('.add-to-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWishlist(parseInt(btn.dataset.productId), btn);
        });
    });
}

// ===== AUTH API CALLS =====
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Create local user session
        currentUser = {
            id: 'user_' + Date.now(),
            email: email,
            name: email.split('@')[0]
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        updateUserPopup();
        closeAuthModal();
        loginForm.reset();
        updateCartCount();
        
        showNotification(`Welcome, ${currentUser.name}! 🐾`, 'success');
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    try {
        // Create local user session
        currentUser = {
            id: 'user_' + Date.now(),
            email: email,
            name: name
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        updateUserPopup();
        closeAuthModal();
        signupForm.reset();
        updateCartCount();
        
        showNotification(`Welcome, ${currentUser.name}! 🐾`, 'success');
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Registration error: ' + error.message, 'error');
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    if (!email || !password) {
        alert('Please fill in admin credentials');
        return;
    }

    // Check admin credentials
    if (email === 'admin@happypaw.com' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', email);
        window.location.href = 'admin.html';
    } else {
        alert('Invalid admin credentials');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    updateUserPopup();
    closeUserPopup();
    updateCartCount();
    goToPage('home');
    showNotification('Logged out successfully! 👋', 'info');
}

// ===== CART API CALLS =====
async function addToCart(productId) {
    if (!currentUser) {
        alert('Please login first');
        openAuthModal();
        return;
    }

    try {
        const product = products.find(p => p.id === productId);
        const cartItems = getCart();
        
        // Check if product already in cart
        const existingItem = cartItems.find(item => item.product_id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                product_id: productId,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                quantity: 1
            });
        }
        
        saveCart(cartItems);
        updateCartCount();
        showNotification(`${product.name} added to cart! 🛒`, 'success');
    } catch (error) {
        console.error('Cart error:', error);
    }
}

async function removeFromCart(productId) {
    if (!currentUser) return;

    try {
        let cartItems = getCart();
        cartItems = cartItems.filter(item => item.product_id !== productId);
        saveCart(cartItems);
        renderCart();
        updateCartCount();
    } catch (error) {
        console.error('Remove error:', error);
    }
}

async function updateQuantity(productId, newQuantity) {
    if (!currentUser || newQuantity < 1) return;

    try {
        const cartItems = getCart();
        const item = cartItems.find(i => i.product_id === productId);
        if (item) {
            if (newQuantity === 0) {
                removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                saveCart(cartItems);
                renderCart();
                updateCartCount();
            }
        }
    } catch (error) {
        console.error('Update error:', error);
    }
}

async function updateCartCount() {
    if (!currentUser) {
        document.querySelector('.cart-count').textContent = '0';
        return;
    }

    try {
        const cartItems = getCart();
        document.querySelector('.cart-count').textContent = cartItems.length;
    } catch (error) {
        console.error('Cart count error:', error);
    }
}

// ===== CART PAGE =====
async function renderCart() {
    if (!currentUser) {
        goToPage('home');
        return;
    }

    try {
        const cartItems = getCart();
        const cartEmpty = document.getElementById('cartEmpty');
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartSummary = document.getElementById('cartSummary');

        if (cartItems.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'flex';
            if (cartItemsContainer) cartItemsContainer.innerHTML = '';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';

        let subtotal = 0;

        cartItems.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            const itemTotal = price * quantity;
            
            subtotal += itemTotal;

            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <div class="cart-item-image">${item.image_url ? `<img src="${item.image_url}" style="width:100%; height:100%; object-fit:cover;">` : '🐾'}</div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">₱${price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.product_id}, ${quantity - 1})">-</button>
                    <input type="number" value="${quantity}" readonly>
                    <button onclick="updateQuantity(${item.product_id}, ${quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">₱${itemTotal.toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.product_id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            if (cartItemsContainer) cartItemsContainer.appendChild(cartItemEl);
        });

        const tax = subtotal * 0.1;
        const shipping = 5;
        const total = subtotal + tax + shipping;

        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const shippingEl = document.getElementById('shipping');
        const totalEl = document.getElementById('total');

        if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `₱${tax.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = `₱${shipping.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `₱${total.toFixed(2)}`;

    } catch (error) {
        console.error('Render cart error:', error);
        showNotification('Error loading cart', 'error');
    }
}

// ===== CHECKOUT =====
async function handleCheckout(e) {
    e.preventDefault();
    console.log('handleCheckout called');

    if (!currentUser) {
        showNotification('Please login first', 'error');
        goToPage('home');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Processing...';
    }

    try {
        const cartItems = getCart();

        if (!cartItems || cartItems.length === 0) {
            showNotification('Your cart is empty!', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';
            }
            return;
        }

        let subtotal = 0;
        cartItems.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const qty = parseInt(item.quantity) || 1;
            subtotal += price * qty;
        });

        console.log('Subtotal:', subtotal);

        const formData = new FormData(e.target);
        const shippingMethod = formData.get('shipping') || 'standard';
        
        let shippingCost = 5;
        if (shippingMethod === 'express') shippingCost = 15;
        
        const tax = subtotal * 0.1;
        const total = subtotal + tax + shippingCost;

        // Create order object
        const order = {
            id: 'ORD' + Date.now(),
            order_number: 'ORD' + Date.now(),
            user_id: currentUser.id,
            items: cartItems,
            first_name: formData.get('firstName') || 'Customer',
            last_name: formData.get('lastName') || '',
            email: formData.get('email') || currentUser.email,
            phone: formData.get('phone') || '',
            address: formData.get('address') || '',
            city: formData.get('city') || '',
            state: formData.get('state') || '',
            zip: formData.get('zip') || '',
            country: formData.get('country') || '',
            shipping_method: shippingMethod,
            shipping_cost: shippingCost,
            tax: tax,
            total: total,
            status: 'processing',
            created_at: new Date().toISOString()
        };

        // Save order
        const orders = getOrders();
        orders.push(order);
        saveOrders(orders);

        // Clear cart
        saveCart([]);

        const confirmOrderIdEl = document.getElementById('confirmOrderId');
        const confirmDateEl = document.getElementById('confirmDate');
        const confirmItemsEl = document.getElementById('confirmItems');
        const confirmTotalEl = document.getElementById('confirmTotal');

        if (confirmOrderIdEl) confirmOrderIdEl.textContent = order.order_number;
        if (confirmDateEl) confirmDateEl.textContent = new Date().toLocaleDateString();
        if (confirmItemsEl) confirmItemsEl.textContent = cartItems.length;
        if (confirmTotalEl) confirmTotalEl.textContent = `₱${total.toFixed(2)}`;

        goToPage('confirmation');
        updateCartCount();
        showNotification('✅ Order placed successfully!', 'success');
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('❌ Checkout error: ' + error.message, 'error');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';
        }
    }
}

// ===== ORDERS =====
async function renderOrders() {
    if (!currentUser) {
        goToPage('home');
        return;
    }

    try {
        const orders = getOrders();
        const ordersEmpty = document.getElementById('ordersEmpty');
        const ordersList = document.getElementById('ordersList');

        if (orders.length === 0) {
            if (ordersEmpty) ordersEmpty.style.display = 'flex';
            if (ordersList) ordersList.innerHTML = '';
            return;
        }

        if (ordersEmpty) ordersEmpty.style.display = 'none';
        if (ordersList) ordersList.innerHTML = '';

        orders.forEach(order => {
            const statusClass = `status-${order.status}`;
            const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            
            const canCancel = ['processing', 'pending'].includes(order.status);
            const cancelBtn = canCancel 
                ? `<button onclick="cancelOrder('${order.id}')" class="btn-cancel" title="Cancel this order">❌ Cancel</button>`
                : '';

            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.innerHTML = `
                <div class="order-header">
                    <div class="order-id">#${order.order_number}</div>
                    <div class="order-actions">
                        <span class="order-status ${statusClass}">${statusText}</span>
                        ${cancelBtn}
                    </div>
                </div>
                <div class="order-info">
                    <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                    <p><strong>Items:</strong> ${order.items.length}</p>
                    <p><strong>Total:</strong> <strong style="color: var(--primary);">₱${parseFloat(order.total).toFixed(2)}</strong></p>
                </div>
            `;
            if (ordersList) ordersList.appendChild(orderCard);
        });
    } catch (error) {
        console.error('Orders error:', error);
        showNotification('Error loading orders: ' + error.message, 'error');
    }
}

async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }

    try {
        let orders = getOrders();
        orders = orders.map(order => {
            if (order.id === orderId) {
                order.status = 'cancelled';
            }
            return order;
        });
        saveOrders(orders);
        showNotification('✅ Order cancelled successfully!', 'success');
        renderOrders();
    } catch (error) {
        console.error('Cancel error:', error);
        showNotification('❌ Error cancelling order: ' + error.message, 'error');
    }
}

// ===== FAVORITES =====
async function toggleWishlist(productId, btn) {
    if (!currentUser) {
        alert('Please login first');
        openAuthModal();
        return;
    }

    try {
        const isFav = btn.classList.contains('favorited');
        if (isFav) {
            btn.classList.remove('favorited');
            showNotification('Removed from favorites!', 'info');
        } else {
            btn.classList.add('favorited');
            showNotification('Added to favorites! ❤️', 'success');
        }
    } catch (error) {
        console.error('Favorites error:', error);
    }
}

async function renderFavorites() {
    if (!currentUser) {
        goToPage('home');
        return;
    }

    try {
        const favoritesEmpty = document.getElementById('favoritesEmpty');
        const favoritesGrid = document.getElementById('favoritesGrid');

        if (favoritesEmpty) favoritesEmpty.style.display = 'flex';
        if (favoritesGrid) favoritesGrid.innerHTML = '';
    } catch (error) {
        console.error('Favorites error:', error);
    }
}

// ===== SEARCH =====
async function searchProducts() {
    const query = document.getElementById('searchInput').value;
    if (!query.trim()) {
        loadProducts();
        return;
    }

    try {
        const filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );
        
        const tempProducts = [...products];
        products = filteredProducts;
        renderProducts();
        products = tempProducts;
    } catch (error) {
        console.error('Search error:', error);
    }
}

// ===== PAGE NAVIGATION =====
function goToPage(page) {
    currentPage = page;
    
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(page + 'Page').style.display = 'block';
    window.scrollTo(0, 0);
    
    if (page === 'cart') renderCart();
    if (page === 'orders') renderOrders();
    if (page === 'favorites') renderFavorites();
    if (page === 'home') loadProducts();
}

// ===== UI FUNCTIONS =====
function toggleUserPopup() {
    if (userPopup) userPopup.classList.toggle('active');
}

function closeUserPopup() {
    if (userPopup) userPopup.classList.remove('active');
}

function openAuthModal() {
    if (authModal) authModal.classList.add('active');
    switchAuthForm('login');
}

function closeAuthModal() {
    if (authModal) authModal.classList.remove('active');
}

function updateUserPopup() {
    const userInfo = document.getElementById('userInfo');
    const userActions = document.getElementById('userActions');

    if (!userInfo || !userActions) return;

    if (currentUser) {
        userInfo.style.display = 'none';
        userActions.style.display = 'flex';
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
    } else {
        userInfo.style.display = 'block';
        userActions.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(135deg, #FF6B9D, #845EC2);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'error') {
        notification.style.background = '#EF4444';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// [Feature: Secret admin reveal]
let logoClicks = 0;
const adminLoginSection = document.getElementById('adminLoginSection');
const logoClicker = document.getElementById('logoClicker');
if (logoClicker) {
    logoClicker.addEventListener('click', () => {
        logoClicks++;
        if (logoClicks >= 3) {
            if (adminLoginSection) adminLoginSection.style.display = 'block';
            adminLoginSection.scrollIntoView({ behavior: 'smooth' });
            logoClicks = 0;
        }
        setTimeout(() => { logoClicks = 0; }, 2500);
    });
}

let deferredPrompt = null;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');

if (window.matchMedia('(max-width: 820px)').matches) {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installPrompt) installPrompt.style.display = 'block';
    });
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    showNotification('🐾 App added to your home screen!', 'success');
                    installPrompt.style.display = 'none';
                }
                deferredPrompt = null;
            }
        });
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐾 Initializing Happy Paw Shop...');
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('User restored:', currentUser.name);
        } catch (e) {
            console.error('Error loading user:', e);
        }
    }
    
    updateUserPopup();
    loadProducts();
    updateCartCount();
});

// Refresh products every 10 seconds
setInterval(() => {
    if (currentPage === 'home' && !document.getElementById('searchInput').value) {
        loadProducts();
    }
}, 10000);
