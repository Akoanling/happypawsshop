let products = [];
let filteredProducts = [];
let currentFilter = 'all';

// ===== INITIALIZE PRODUCTS FROM LOCALSTORAGE =====
function initializeProducts() {
    const stored = localStorage.getItem('happyPawShopProducts');
    if (!stored) {
        // Load default products from seed data
        products = [
            { "id": 1, "name": "Premium Dog Food", "category": "dogs", "price": 899.99, "rating": 5, "reviews": 120, "stock": 45, "discount": "10% Off", "image_url": "https://via.placeholder.com/200?text=Dog+Food" },
            { "id": 2, "name": "Cat Litter Box", "category": "cats", "price": 1299.99, "rating": 4, "reviews": 85, "stock": 30, "discount": "New", "image_url": "https://via.placeholder.com/200?text=Cat+Litter" },
            { "id": 3, "name": "Bird Cage Deluxe", "category": "birds", "price": 2499.99, "rating": 5, "reviews": 45, "stock": 15, "discount": "15% Off", "image_url": "https://via.placeholder.com/200?text=Bird+Cage" },
            { "id": 4, "name": "Aquarium Filter System", "category": "fish", "price": 3499.99, "rating": 5, "reviews": 95, "stock": 20, "discount": "New", "image_url": "https://via.placeholder.com/200?text=Aquarium+Filter" },
            { "id": 5, "name": "Hamster Habitat", "category": "small-pets", "price": 599.99, "rating": 4, "reviews": 60, "stock": 50, "discount": "5% Off", "image_url": "https://via.placeholder.com/200?text=Hamster+Habitat" },
            { "id": 6, "name": "Reptile Heat Lamp", "category": "reptiles", "price": 799.99, "rating": 5, "reviews": 78, "stock": 25, "discount": "New", "image_url": "https://via.placeholder.com/200?text=Heat+Lamp" },
            { "id": 7, "name": "Dog Bed Comfort Deluxe", "category": "dogs", "price": 1499.99, "rating": 5, "reviews": 150, "stock": 60, "discount": "20% Off", "image_url": "https://via.placeholder.com/200?text=Dog+Bed" },
            { "id": 8, "name": "Cat Scratch Pole", "category": "cats", "price": 699.99, "rating": 4, "reviews": 92, "stock": 40, "discount": "New", "image_url": "https://via.placeholder.com/200?text=Scratch+Pole" },
            { "id": 9, "name": "Bird Seed Mix Premium", "category": "birds", "price": 399.99, "rating": 5, "reviews": 110, "stock": 100, "discount": "New", "image_url": "https://via.placeholder.com/200?text=Bird+Seed" },
            { "id": 10, "name": "Fish Tank Decorations", "category": "fish", "price": 499.99, "rating": 4, "reviews": 70, "stock": 55, "discount": "10% Off", "image_url": "https://via.placeholder.com/200?text=Tank+Decor" },
            { "id": 11, "name": "Small Pet Food Bundle", "category": "small-pets", "price": 799.99, "rating": 5, "reviews": 85, "stock": 75, "discount": "New", "image_url": "https://via.placeholder.com/200?text=Pet+Food" },
            { "id": 12, "name": "Reptile Enclosure Large", "category": "reptiles", "price": 4999.99, "rating": 5, "reviews": 52, "stock": 12, "discount": "25% Off", "image_url": "https://via.placeholder.com/200?text=Enclosure" }
        ];
        saveProductsToStorage();
    } else {
        products = JSON.parse(stored);
    }
}

// ===== SAVE PRODUCTS TO LOCALSTORAGE =====
function saveProductsToStorage() {
    localStorage.setItem('happyPawShopProducts', JSON.stringify(products));
}

// ===== MESSAGE =====
function showMessage(msg, type = 'success') {
    const msgEl = document.getElementById('message');
    msgEl.textContent = msg;
    msgEl.className = `message show ${type}`;
    setTimeout(() => msgEl.classList.remove('show'), 3500);
}

// ===== LOAD PRODUCTS =====
function loadProducts() {
    try {
        console.log('Loading products from localStorage...');
        filteredProducts = [...products];
        updateStats();
        displayLowStockAlert();
        displayProducts();
        console.log('Products loaded:', products);
    } catch (error) {
        console.error('Load error:', error);
        showMessage('Error loading products', 'error');
    }
}

// ===== UPDATE STATS =====
function updateStats() {
    const total = products.length;
    const lowStock = products.filter(p => {
        const stock = parseInt(p.stock) || 0;
        return stock > 0 && stock <= 10;
    }).length;
    const outOfStock = products.filter(p => parseInt(p.stock) === 0).length;
    const totalValue = products.reduce((sum, p) => {
        return sum + (parseFloat(p.price) * parseInt(p.stock));
    }, 0);

    document.getElementById('totalProducts').textContent = total;
    document.getElementById('lowStockCount').textContent = lowStock;
    document.getElementById('outOfStockCount').textContent = outOfStock;
    document.getElementById('totalValue').textContent = '₱' + totalValue.toFixed(2);
}

// ===== DISPLAY LOW STOCK ALERT =====
function displayLowStockAlert() {
    const lowStockItems = products.filter(p => {
        const stock = parseInt(p.stock) || 0;
        return stock > 0 && stock <= 10;
    });

    console.log('Low stock items:', lowStockItems);

    const lowStockSection = document.getElementById('lowStockSection');
    const noLowStockSection = document.getElementById('noLowStockSection');
    const lowStockList = document.getElementById('lowStockList');
    const lowStockBadge = document.getElementById('lowStockBadge');

    if (lowStockItems.length === 0) {
        console.log('No low stock items');
        lowStockSection.style.display = 'none';
        noLowStockSection.style.display = 'block';
        return;
    }

    console.log('Showing low stock items:', lowStockItems.length);
    lowStockSection.style.display = 'block';
    noLowStockSection.style.display = 'none';
    lowStockList.innerHTML = '';
    lowStockBadge.textContent = lowStockItems.length;

    lowStockItems.forEach(item => {
        const stock = parseInt(item.stock) || 0;
        const stockPercent = (stock / 10) * 100;

        const card = document.createElement('div');
        card.className = 'stock-card';
        card.innerHTML = `
            <img src="${item.image_url || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(item.name)}" 
                 alt="${item.name}" class="stock-card-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            
            <div class="stock-card-name">${item.name}</div>
            <span class="stock-card-category">${item.category.toUpperCase()}</span>
            
            <div class="stock-info">
                <div class="stock-info-row">
                    <span>📦 Stock:</span>
                    <span style="color: #e65100; font-weight: 700;">${stock} units</span>
                </div>
                <div class="stock-info-row">
                    <span>💰 Price:</span>
                    <span>₱${parseFloat(item.price).toFixed(2)}</span>
                </div>
                <div class="stock-info-row">
                    <span>📊 Capacity:</span>
                    <span>${stockPercent.toFixed(0)}%</span>
                </div>
            </div>
            
            <div class="stock-warning">⚠️ Only ${stock} units left!</div>
            
            <button class="update-btn" onclick="openEditModal(${item.id})">
                📝 Update Stock
            </button>
        `;
        lowStockList.appendChild(card);
    });
}

// ===== DISPLAY PRODUCTS TABLE =====
function displayProducts() {
    const tbody = document.getElementById('productsList');
    const emptyState = document.getElementById('emptyState');

    if (filteredProducts.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    tbody.innerHTML = '';

    filteredProducts.forEach(product => {
        const stock = parseInt(product.stock) || 0;
        let stockBadge = 'badge-stock-good';
        let stockText = '✅ In Stock';

        if (stock === 0) {
            stockBadge = 'badge-stock-out';
            stockText = '❌ Out of Stock';
        } else if (stock <= 10) {
            stockBadge = 'badge-stock-low';
            stockText = '⚠️ Low Stock';
        }

        const stars = '⭐'.repeat(Math.floor(product.rating || 0));

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${product.image_url ? 
                    `<img src="${product.image_url}" class="product-img" alt="${product.name}" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'">` : 
                    '<div style="width:50px;height:50px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border-radius:6px;font-size:24px;">🐾</div>'}
            </td>
            <td>${product.name}</td>
            <td><span class="badge badge-category">${product.category}</span></td>
            <td><span class="badge badge-price">₱${parseFloat(product.price).toFixed(2)}</span></td>
            <td><span class="badge ${stockBadge}">${stock} ${stockText}</span></td>
            <td>${stars} (${product.reviews || 0})</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openEditModal(${product.id})" title="Edit">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})" title="Delete">🗑️ Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ===== ADD PRODUCT =====
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const originalPrice = document.getElementById('originalPrice').value;
    const discount = document.getElementById('discount').value;
    const rating = parseFloat(document.getElementById('rating').value) || 0;
    const reviews = parseInt(document.getElementById('reviews').value) || 0;
    
    // Get image URL or use placeholder
    let imageUrl = 'https://via.placeholder.com/200?text=' + encodeURIComponent(name);
    const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }
    
    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name,
        category,
        price,
        stock,
        original_price: originalPrice || 0,
        discount,
        rating,
        reviews,
        image_url: imageUrl
    };
    
    products.push(newProduct);
    saveProductsToStorage();
    
    showMessage('✅ Product added successfully!', 'success');
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    loadProducts();
});

// ===== DELETE PRODUCT =====
window.deleteProduct = function(id) {
    if (!confirm('⚠️ Are you sure? This cannot be undone.')) return;

    products = products.filter(p => p.id !== id);
    saveProductsToStorage();
    
    showMessage('✅ Product deleted!', 'success');
    loadProducts();
};

// ===== OPEN EDIT MODAL =====
window.openEditModal = function(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;

    const modal = document.getElementById('editModal');
    document.getElementById('editId').value = product.id;
    document.getElementById('editName').value = product.name;
    document.getElementById('editCategory').value = product.category;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editStock').value = product.stock;
    document.getElementById('editOriginalPrice').value = product.original_price || '';
    document.getElementById('editDiscount').value = product.discount || '';
    document.getElementById('editRating').value = product.rating || '';
    document.getElementById('editReviews').value = product.reviews || '';

    if (product.image_url) {
        document.getElementById('editImagePreview').src = product.image_url;
        document.getElementById('editImagePreview').style.display = 'block';
    } else {
        document.getElementById('editImagePreview').style.display = 'none';
    }

    modal.classList.add('show');
};

// ===== CLOSE EDIT MODAL =====
function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

// ===== IMAGE PREVIEW =====
document.getElementById('image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('imagePreview').src = event.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('editImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('editImagePreview').src = event.target.result;
            document.getElementById('editImagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// ===== EDIT PRODUCT =====
document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = parseInt(document.getElementById('editId').value);
    const product = products.find(p => p.id === id);
    
    if (!product) return;
    
    product.name = document.getElementById('editName').value;
    product.category = document.getElementById('editCategory').value;
    product.price = parseFloat(document.getElementById('editPrice').value);
    product.stock = parseInt(document.getElementById('editStock').value);
    product.original_price = document.getElementById('editOriginalPrice').value;
    product.discount = document.getElementById('editDiscount').value;
    product.rating = parseFloat(document.getElementById('editRating').value) || 0;
    product.reviews = parseInt(document.getElementById('editReviews').value) || 0;

    const imageInput = document.getElementById('editImage');
    if (imageInput.files.length > 0) {
        product.image_url = URL.createObjectURL(imageInput.files[0]);
    }

    saveProductsToStorage();
    
    showMessage('✅ Product updated successfully!', 'success');
    closeEditModal();
    loadProducts();
});

// ===== SEARCH =====
document.getElementById('searchInput').addEventListener('keyup', function(e) {
    const query = e.target.value.toLowerCase();
    applyFilters(query);
});

// ===== FILTER =====
window.filterProducts = function(filter) {
    currentFilter = filter;
    const query = document.getElementById('searchInput').value.toLowerCase();
    applyFilters(query);

    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

function applyFilters(query) {
    if (currentFilter === 'all') {
        filteredProducts = [...products];
    } else if (currentFilter === 'low') {
        filteredProducts = products.filter(p => {
            const stock = parseInt(p.stock) || 0;
            return stock > 0 && stock <= 10;
        });
    } else if (currentFilter === 'out') {
        filteredProducts = products.filter(p => parseInt(p.stock) === 0);
    }

    if (query) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }

    displayProducts();
}

// ===== CLOSE MODAL =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEditModal();
});

document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target.id === 'editModal') closeEditModal();
});

// ===== INIT =====
initializeProducts();
loadProducts();
