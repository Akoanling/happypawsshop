// API Base URL
const API_URL = 'http://localhost/happy-paw-shop/api';

// Products data (loaded from API)
let products = [];

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
        const url = category === 'all' 
            ? `${API_URL}/products.php?action=list`
            : `${API_URL}/products.php?action=list&category=${category}`;
        
        console.log('Loading products from:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Products loaded:', data);
        
        if (data.success) {
            products = data.data || [];
            console.log('Products array:', products);
            renderProducts();
        } else {
            console.error('API error:', data.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
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
        ? `<img src="${product.image_url}" alt="${product.name}" style="width:100%;height:150px;object-fit:cover;border-radius:8px;">`
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
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/auth.php?action=login`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();

        if (data.success) {
            currentUser = data.data;
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            updateUserPopup();
            closeAuthModal();
            loginForm.reset();
            updateCartCount();
            
            showNotification(`Welcome, ${currentUser.name}! 🐾`, 'success');
        } else {
            alert(data.message);
        }
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
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/auth.php?action=register`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();

        if (data.success) {
            currentUser = data.data;
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            updateUserPopup();
            closeAuthModal();
            signupForm.reset();
            updateCartCount();
            
            showNotification(`Welcome, ${currentUser.name}! 🐾`, 'success');
        } else {
            showNotification(data.message || 'Registration failed', 'error');
        }
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

    // For demo purposes - check for hardcoded admin credentials
    // In production, this should be handled by a backend admin auth endpoint
    if (email === 'admin@happypaw.com' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
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
        const formData = new FormData();
        formData.append('user_id', currentUser.id);
        formData.append('product_id', productId);

        const response = await fetch(`${API_URL}/cart.php?action=add`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();

        if (data.success) {
            const product = products.find(p => p.id === productId);
            updateCartCount();
            showNotification(`${product.name} added to cart! 🛒`, 'success');
        }
    } catch (error) {
        console.error('Cart error:', error);
    }
}

async function removeFromCart(productId) {
    if (!currentUser) return;

    try {
        const formData = new FormData();
        formData.append('user_id', currentUser.id);
        formData.append('product_id', productId);

        const response = await fetch(`${API_URL}/cart.php?action=remove`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();

        if (data.success) {
            renderCart();
            updateCartCount();
        }
    } catch (error) {
        console.error('Remove error:', error);
    }
}

async function updateQuantity(productId, newQuantity) {
    if (!currentUser || newQuantity < 1) return;

    try {
        const formData = new FormData();
        formData.append('user_id', currentUser.id);
        formData.append('product_id', productId);
        formData.append('quantity', newQuantity);

        const response = await fetch(`${API_URL}/cart.php?action=update`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();

        if (data.success) {
            renderCart();
            updateCartCount();
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
        const response = await fetch(`${API_URL}/cart.php?action=get&user_id=${currentUser.id}`);
        const data = await response.json();

        if (data.success) {
            document.querySelector('.cart-count').textContent = data.data.length;
        }
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
        const response = await fetch(`${API_URL}/cart.php?action=get&user_id=${currentUser.id}`);
        const data = await response.json();

        console.log('Cart data:', data);

        if (!data.success) {
            console.error('Cart error:', data.message);
            return;
        }

        const cart = data.data || [];
        const cartEmpty = document.getElementById('cartEmpty');
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartSummary = document.getElementById('cartSummary');

        if (cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'flex';
            if (cartItemsContainer) cartItemsContainer.innerHTML = '';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';

        let subtotal = 0;

        cart.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            const itemTotal = price * quantity;
            
            subtotal += itemTotal;

            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <div class="cart-item-image">${item.image || '🐾'}</div>
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
        console.log('Fetching cart for user:', currentUser.id);
        const cartResponse = await fetch(`${API_URL}/cart.php?action=get&user_id=${currentUser.id}`);
        const cartData = await cartResponse.json();

        console.log('Cart response:', cartData);

        if (!cartData.success || !cartData.data || cartData.data.length === 0) {
            showNotification('Your cart is empty!', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';
            }
            return;
        }

        let subtotal = 0;
        cartData.data.forEach(item => {
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

        console.log('Order totals:', {
            subtotal: subtotal,
            tax: tax,
            shipping: shippingCost,
            total: total
        });

        const orderData = new FormData();
        orderData.append('user_id', currentUser.id);
        orderData.append('first_name', formData.get('firstName') || 'Customer');
        orderData.append('last_name', formData.get('lastName') || '');
        orderData.append('email', formData.get('email') || currentUser.email);
        orderData.append('phone', formData.get('phone') || '');
        orderData.append('address', formData.get('address') || '');
        orderData.append('city', formData.get('city') || '');
        orderData.append('state', formData.get('state') || '');
        orderData.append('zip', formData.get('zip') || '');
        orderData.append('country', formData.get('country') || '');
        orderData.append('shipping_method', shippingMethod);
        orderData.append('shipping_cost', shippingCost);
        orderData.append('tax', tax);
        orderData.append('total', total);

        console.log('Sending order to API...');
        
        const orderResponse = await fetch(`${API_URL}/orders.php?action=create`, {
            method: 'POST',
            body: orderData
        });

        console.log('Order response status:', orderResponse.status);
        
        const responseText = await orderResponse.text();
        console.log('Raw response:', responseText);

        let orderResult;
        try {
            orderResult = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response was:', responseText);
            showNotification('❌ Server error: Invalid response format', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';
            }
            return;
        }

        console.log('Parsed order result:', orderResult);

        if (orderResult.success) {
            const confirmOrderIdEl = document.getElementById('confirmOrderId');
            const confirmDateEl = document.getElementById('confirmDate');
            const confirmItemsEl = document.getElementById('confirmItems');
            const confirmTotalEl = document.getElementById('confirmTotal');

            console.log('Updating confirmation elements...');

            if (confirmOrderIdEl) confirmOrderIdEl.textContent = orderResult.data.order_number;
            if (confirmDateEl) confirmDateEl.textContent = new Date().toLocaleDateString();
            if (confirmItemsEl) confirmItemsEl.textContent = cartData.data.length;
            if (confirmTotalEl) confirmTotalEl.textContent = `₱${total.toFixed(2)}`;

            console.log('Going to confirmation page...');
            goToPage('confirmation');
            updateCartCount();
            showNotification('✅ Order placed successfully!', 'success');
        } else {
            showNotification('❌ ' + (orderResult.message || 'Checkout failed'), 'error');
            console.error('Order error:', orderResult);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';
            }
        }
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
        const response = await fetch(`${API_URL}/orders.php?action=list&user_id=${currentUser.id}`);
        const data = await response.json();

        if (!data.success) return;

        const orders = data.data;
        const ordersEmpty = document.getElementById('ordersEmpty');
        const ordersList = document.getElementById('ordersList');

        if (orders.length === 0) {
            ordersEmpty.style.display = 'flex';
            ordersList.innerHTML = '';
            return;
        }

        ordersEmpty.style.display = 'none';
        ordersList.innerHTML = '';

        orders.forEach(order => {
            const statusClass = `status-${order.status}`;
            const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            
            const canCancel = ['processing', 'pending'].includes(order.status);
            const cancelBtn = canCancel 
                ? `<button onclick="cancelOrder(${order.id})" class="btn-cancel" title="Cancel this order">❌ Cancel</button>`
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
                    <p><strong>Total:</strong> <strong style="color: var(--primary);">₱${parseFloat(order.total).toFixed(2)}</strong></p>
                </div>
            `;
            ordersList.appendChild(orderCard);
        });
    } catch (error) {
        console.error('Orders error:', error);
        showNotification('Error loading orders: ' + error.message, 'error');
    }
}

async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?\n\nStock will be restored to inventory.')) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('user_id', currentUser.id);
        formData.append('order_id', orderId);

        const response = await fetch(`${API_URL}/orders.php?action=cancel`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('✅ ' + data.message, 'success');
            renderOrders();
        } else {
            showNotification('❌ ' + (data.message || 'Cancel failed'), 'error');
        }
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
        const formData = new FormData();
        formData.append('user_id', currentUser.id);
        formData.append('product_id', productId);

        const action = isFav ? 'remove' : 'add';
        const response = await fetch(`${API_URL}/favorites.php?action=${action}`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            if (isFav) {
                btn.classList.remove('favorited');
                showNotification('Removed from favorites!', 'info');
            } else {
                btn.classList.add('favorited');
                showNotification('Added to favorites! ❤️', 'success');
            }
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
        const response = await fetch(`${API_URL}/favorites.php?action=list&user_id=${currentUser.id}`);
        const data = await response.json();

        if (!data.success) return;

        const favorites = data.data;
        const favoritesEmpty = document.getElementById('favoritesEmpty');
        const favoritesGrid = document.getElementById('favoritesGrid');

        if (favorites.length === 0) {
            favoritesEmpty.style.display = 'flex';
            favoritesGrid.innerHTML = '';
            return;
        }

        favoritesEmpty.style.display = 'none';
        favoritesGrid.innerHTML = '';

        favorites.forEach(product => {
            const card = createProductCard(product);
            favoritesGrid.appendChild(card);
        });

        addProductEventListeners();
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
        const response = await fetch(`${API_URL}/products.php?action=search&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success) {
            products = data.data;
            renderProducts();
        }
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
    switchAuthForm('login'); // Reset to login form
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
            // (Optional: auto-scroll)
            adminLoginSection.scrollIntoView({ behavior: 'smooth' });
            logoClicks = 0; // reset
        }
        // reset counter if too slow
        setTimeout(() => { logoClicks = 0; }, 2500);
    });
}


// [FEATURE 1: Add to Home Screen Mobile Prompt (place at end of script.js or in its own <script>)]

let deferredPrompt = null;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');

// Only show on mobile screens
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
// [END FEATURE 1]

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
