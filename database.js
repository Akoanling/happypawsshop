// Happy Paw Shop Database - Local Storage Based
const db = {
    // Initialize database
    init() {
        if (!localStorage.getItem('happyPawShop')) {
            localStorage.setItem('happyPawShop', JSON.stringify({
                users: [],
                orders: [],
                cart: [],
                favorites: []
            }));
        }
    },

    // Get all data
    getData() {
        return JSON.parse(localStorage.getItem('happyPawShop') || '{}');
    },

    // Save data
    saveData(data) {
        localStorage.setItem('happyPawShop', JSON.stringify(data));
    },

    // USER MANAGEMENT
    registerUser(email, password, name) {
        const data = this.getData();
        if (data.users.find(u => u.email === email)) {
            return { success: false, message: 'Email already exists' };
        }
        const user = {
            id: 'USER_' + Date.now(),
            email,
            password, // In production, NEVER store plain passwords
            name,
            createdAt: new Date().toISOString()
        };
        data.users.push(user);
        this.saveData(data);
        return { success: true, user };
    },

    loginUser(email, password) {
        const data = this.getData();
        const user = data.users.find(u => u.email === email && u.password === password);
        if (user) {
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    // CART MANAGEMENT
    addToCart(userId, productId, quantity = 1) {
        const data = this.getData();
        const cartItem = data.cart.find(c => c.userId === userId && c.productId === productId);
        
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            data.cart.push({
                userId,
                productId,
                quantity,
                addedAt: new Date().toISOString()
            });
        }
        this.saveData(data);
        return { success: true };
    },

    removeFromCart(userId, productId) {
        const data = this.getData();
        data.cart = data.cart.filter(c => !(c.userId === userId && c.productId === productId));
        this.saveData(data);
        return { success: true };
    },

    updateCartQuantity(userId, productId, quantity) {
        const data = this.getData();
        const cartItem = data.cart.find(c => c.userId === userId && c.productId === productId);
        if (cartItem) {
            cartItem.quantity = Math.max(1, quantity);
            this.saveData(data);
            return { success: true };
        }
        return { success: false };
    },

    getCart(userId) {
        const data = this.getData();
        return data.cart.filter(c => c.userId === userId);
    },

    clearCart(userId) {
        const data = this.getData();
        data.cart = data.cart.filter(c => c.userId !== userId);
        this.saveData(data);
        return { success: true };
    },

    // ORDERS MANAGEMENT
    createOrder(userId, items, shippingInfo, paymentInfo, total) {
        const data = this.getData();
        const order = {
            id: 'ORD_' + Date.now(),
            userId,
            items,
            shippingInfo,
            paymentInfo: {
                cardName: paymentInfo.cardName,
                cardLast4: paymentInfo.cardNumber.slice(-4),
                // Never store full card data in production!
            },
            total,
            status: 'processing',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.orders.push(order);
        this.saveData(data);
        return { success: true, order };
    },

    getOrdersByUserId(userId) {
        const data = this.getData();
        return data.orders.filter(o => o.userId === userId).sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    },

    getOrderById(orderId) {
        const data = this.getData();
        return data.orders.find(o => o.id === orderId);
    },

    updateOrderStatus(orderId, status) {
        const data = this.getData();
        const order = data.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
            this.saveData(data);
            return { success: true };
        }
        return { success: false };
    },

    getAllOrders() {
        const data = this.getData();
        return data.orders;
    },

    // FAVORITES MANAGEMENT
    addToFavorites(userId, productId) {
        const data = this.getData();
        if (!data.favorites.find(f => f.userId === userId && f.productId === productId)) {
            data.favorites.push({
                userId,
                productId,
                addedAt: new Date().toISOString()
            });
            this.saveData(data);
            return { success: true };
        }
        return { success: false, message: 'Already in favorites' };
    },

    removeFromFavorites(userId, productId) {
        const data = this.getData();
        data.favorites = data.favorites.filter(f => !(f.userId === userId && f.productId === productId));
        this.saveData(data);
        return { success: true };
    },

    getFavorites(userId) {
        const data = this.getData();
        return data.favorites.filter(f => f.userId === userId);
    },

    isFavorited(userId, productId) {
        const data = this.getData();
        return data.favorites.some(f => f.userId === userId && f.productId === productId);
    },

    // PRODUCTS
    getAllProducts() {
        return products;
    },

    searchProducts(query) {
        return products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );
    },

    // DATA EXPORT & CLEAR
    exportData() {
        return this.getData();
    },

    clearAllData() {
        if (confirm('Are you sure? This will delete all data!')) {
            this.init();
            return { success: true };
        }
        return { success: false };
    }
};

// Initialize database on load
db.init();