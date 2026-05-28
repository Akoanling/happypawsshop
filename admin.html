<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Happy Paw Shop</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8f9fa;
            color: #333;
        }

        .admin-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Header */
        .admin-header {
            background: linear-gradient(135deg, #FF6B9D 0%, #845EC2 100%);
            color: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
        }

        .admin-header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .admin-header p {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        .back-link {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }

        .back-link:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .stats-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .stat-box {
            background: rgba(255, 255, 255, 0.15);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-number {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 13px;
            opacity: 0.85;
        }

        /* Message */
        .message {
            padding: 16px;
            margin-bottom: 20px;
            border-radius: 8px;
            display: none;
            animation: slideDown 0.3s ease;
        }

        .message.show {
            display: block;
        }

        .message.success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }

        .message.error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #f5c6cb;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Low Stock Section */
        .low-stock-section {
            background: linear-gradient(135deg, #fff5e6, #ffe0b2);
            border-left: 4px solid #ff9800;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2);
        }

        .low-stock-section h3 {
            color: #e65100;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
        }

        .low-stock-badge {
            background: #ff9800;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
        }

        .low-stock-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
        }

        .stock-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #ff9800;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
        }

        .stock-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .stock-card-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 6px;
            margin-bottom: 12px;
        }

        .stock-card-name {
            font-weight: 700;
            color: #333;
            margin-bottom: 8px;
            font-size: 15px;
        }

        .stock-card-category {
            display: inline-block;
            background: #e3f2fd;
            color: #1976d2;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .stock-info {
            display: grid;
            gap: 8px;
            font-size: 13px;
            color: #666;
            margin-bottom: 12px;
        }

        .stock-info-row {
            display: flex;
            justify-content: space-between;
        }

        .stock-warning {
            background: #fff3cd;
            color: #856404;
            padding: 8px;
            border-radius: 4px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 10px;
            font-size: 12px;
        }

        .update-btn {
            width: 100%;
            padding: 10px;
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            transition: all 0.3s;
        }

        .update-btn:hover {
            background: #e68900;
        }

        .no-low-stock {
            text-align: center;
            padding: 30px;
            color: #4caf50;
        }

        .no-low-stock i {
            font-size: 48px;
            margin-bottom: 10px;
        }

        /* Control Bar */
        .control-bar {
            display: grid;
            grid-template-columns: 1fr 1fr auto auto auto;
            gap: 15px;
            margin-bottom: 25px;
            align-items: center;
        }

        .search-box {
            position: relative;
        }

        .search-box input {
            width: 100%;
            padding: 12px 40px 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
        }

        .search-box input:focus {
            outline: none;
            border-color: #FF6B9D;
            box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
        }

        .search-box i {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
            pointer-events: none;
        }

        .filter-btn {
            padding: 10px 16px;
            border: 2px solid #e0e0e0;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.3s;
        }

        .filter-btn:hover {
            border-color: #FF6B9D;
            color: #FF6B9D;
        }

        .filter-btn.active {
            background: #FF6B9D;
            color: white;
            border-color: #FF6B9D;
        }

        /* Section */
        .form-section {
            background: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .form-section h2 {
            font-size: 22px;
            margin-bottom: 25px;
            color: #333;
        }

        /* Form */
        .form-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }

        .form-row.full {
            grid-template-columns: 1fr;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
            font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #FF6B9D;
            box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
        }

        .img-preview {
            max-width: 100%;
            max-height: 200px;
            border-radius: 6px;
            margin-top: 10px;
        }

        /* Button */
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #FF6B9D, #845EC2);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 157, 0.3);
        }

        .btn-secondary {
            background: #f0f0f0;
            color: #333;
            border: 1px solid #e0e0e0;
        }

        .btn-secondary:hover {
            background: #e8e8e8;
        }

        /* Table */
        .products-table {
            width: 100%;
            border-collapse: collapse;
        }

        .products-table thead {
            background: #f5f5f5;
        }

        .products-table th {
            padding: 15px;
            text-align: left;
            font-weight: 700;
            color: #333;
            border-bottom: 2px solid #e0e0e0;
            font-size: 13px;
            text-transform: uppercase;
        }

        .products-table td {
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
        }

        .products-table tr:hover {
            background: #fafafa;
        }

        .product-img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 6px;
        }

        .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .badge-category {
            background: #e3f2fd;
            color: #1976d2;
        }

        .badge-price {
            background: linear-gradient(135deg, #FF6B9D, #845EC2);
            color: white;
        }

        .badge-stock-good {
            background: #c8e6c9;
            color: #2e7d32;
        }

        .badge-stock-low {
            background: #ffe0b2;
            color: #e65100;
        }

        .badge-stock-out {
            background: #ffcdd2;
            color: #c62828;
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .btn-edit, .btn-delete {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .btn-edit {
            background: #2196F3;
            color: white;
        }

        .btn-edit:hover {
            background: #1976d2;
        }

        .btn-delete {
            background: #f44336;
            color: white;
        }

        .btn-delete:hover {
            background: #da190b;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }

        .modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .close-modal {
            float: right;
            font-size: 28px;
            cursor: pointer;
            color: #999;
        }

        .close-modal:hover {
            color: #333;
        }

        .modal-content h2 {
            margin-bottom: 20px;
            color: #333;
            clear: both;
        }

        .modal-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }

        .empty-state i {
            font-size: 60px;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }

            .control-bar {
                grid-template-columns: 1fr;
            }

            .stats-row {
                grid-template-columns: 1fr;
            }

            .low-stock-grid {
                grid-template-columns: 1fr;
            }

            .admin-header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <!-- Header -->
        <div class="admin-header">
            <h1>🐾 Admin Panel - Happy Paw Shop</h1>
            <p>Manage products and inventory</p>
            <div class="stats-row">
                <div class="stat-box">
                    <div class="stat-number" id="totalProducts">0</div>
                    <div class="stat-label">Total Products</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number" id="lowStockCount">0</div>
                    <div class="stat-label">Low Stock Items</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number" id="outOfStockCount">0</div>
                    <div class="stat-label">Out of Stock</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number" id="totalValue">₱0</div>
                    <div class="stat-label">Inventory Value</div>
                </div>
            </div>
            <br>
            <a href="index.html" class="back-link"><i class="fas fa-arrow-left"></i> Back to Shop</a>
        </div>

        <!-- Messages -->
        <div id="message" class="message"></div>

        <!-- Low Stock Alert -->
        <div id="lowStockSection" class="low-stock-section" style="display: none;">
            <h3>
                <i class="fas fa-exclamation-triangle"></i>
                Low Stock Alert
                <span class="low-stock-badge" id="lowStockBadge">0</span>
            </h3>
            <div id="lowStockList" class="low-stock-grid"></div>
        </div>

        <div id="noLowStockSection" class="low-stock-section" style="display: none; background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border-left-color: #4caf50;">
            <div class="no-low-stock">
                <i class="fas fa-check-circle" style="color: #4caf50;"></i>
                <p style="color: #2e7d32; font-weight: 700;">✅ All products are well stocked!</p>
                <p style="color: #558b2f; font-size: 13px;">No items are running low at the moment.</p>
            </div>
        </div>

        <!-- Add Product -->
        <div class="form-section">
            <h2><i class="fas fa-plus-circle"></i> Add New Product</h2>
            <form id="productForm" enctype="multipart/form-data">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Product Name *</label>
                        <input type="text" id="name" name="name" placeholder="Enter product name" required>
                    </div>
                    <div class="form-group">
                        <label for="category">Category *</label>
                        <select id="category" name="category" required>
                            <option value="">-- Select Category --</option>
                            <option value="dogs">🐕 Dogs</option>
                            <option value="cats">🐈 Cats</option>
                            <option value="birds">🦜 Birds</option>
                            <option value="fish">🐠 Fish</option>
                            <option value="small-pets">🐹 Small Pets</option>
                            <option value="reptiles">🐢 Reptiles</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="price">Price (₱) *</label>
                        <input type="number" id="price" name="price" placeholder="0.00" step="0.01" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="stock">Stock *</label>
                        <input type="number" id="stock" name="stock" placeholder="0" min="0" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="originalPrice">Original Price</label>
                        <input type="number" id="originalPrice" name="original_price" placeholder="0.00" step="0.01">
                    </div>
                    <div class="form-group">
                        <label for="discount">Discount</label>
                        <input type="text" id="discount" name="discount" placeholder="e.g., 20% off">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="rating">Rating</label>
                        <input type="number" id="rating" name="rating" placeholder="4.5" step="0.1" min="0" max="5">
                    </div>
                    <div class="form-group">
                        <label for="reviews">Reviews</label>
                        <input type="number" id="reviews" name="reviews" placeholder="0" min="0">
                    </div>
                </div>
                <div class="form-row full">
                    <div class="form-group">
                        <label for="image">Product Image</label>
                        <input type="file" id="image" name="image" accept="image/*">
                        <img id="imagePreview" class="img-preview" style="display: none;">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Add Product
                </button>
            </form>
        </div>

        <!-- Search & Filter -->
        <div class="control-bar">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="🔍 Search products...">
                <i class="fas fa-search"></i>
            </div>
            <div></div>
            <button class="filter-btn active" onclick="filterProducts('all')">All</button>
            <button class="filter-btn" onclick="filterProducts('low')">⚠️ Low Stock</button>
            <button class="filter-btn" onclick="filterProducts('out')">❌ Out</button>
        </div>

        <!-- Products Table -->
        <div class="form-section">
            <h2><i class="fas fa-list"></i> All Products</h2>
            <div id="emptyState" class="empty-state" style="display: none;">
                <i class="fas fa-inbox"></i>
                <p>No products found</p>
            </div>
            <table class="products-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="productsList"></tbody>
            </table>
        </div>
    </div>

    <!-- Edit Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <span class="close-modal" onclick="closeEditModal()">&times;</span>
            <h2>✏️ Edit Product</h2>
            <form id="editForm">
                <input type="hidden" id="editId">
                <div class="form-group">
                    <label for="editName">Name</label>
                    <input type="text" id="editName" required>
                </div>
                <div class="form-group">
                    <label for="editCategory">Category</label>
                    <select id="editCategory" required>
                        <option value="dogs">🐕 Dogs</option>
                        <option value="cats">🐈 Cats</option>
                        <option value="birds">🦜 Birds</option>
                        <option value="fish">🐠 Fish</option>
                        <option value="small-pets">🐹 Small Pets</option>
                        <option value="reptiles">🐢 Reptiles</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editPrice">Price</label>
                    <input type="number" id="editPrice" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="editStock">Stock</label>
                    <input type="number" id="editStock" min="0" required>
                </div>
                <div class="form-group">
                    <label for="editOriginalPrice">Original Price</label>
                    <input type="number" id="editOriginalPrice" step="0.01">
                </div>
                <div class="form-group">
                    <label for="editDiscount">Discount</label>
                    <input type="text" id="editDiscount">
                </div>
                <div class="form-group">
                    <label for="editRating">Rating</label>
                    <input type="number" id="editRating" step="0.1" min="0" max="5">
                </div>
                <div class="form-group">
                    <label for="editReviews">Reviews</label>
                    <input type="number" id="editReviews" min="0">
                </div>
                <div class="form-group">
                    <label for="editImage">Image</label>
                    <input type="file" id="editImage" accept="image/*">
                    <img id="editImagePreview" class="img-preview" style="display: none;">
                </div>
                <div class="modal-buttons">
                    <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    </div>

    <script src="admin-script.js"></script>
</body>
</html>
