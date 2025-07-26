// GitHub repository details
const REPO_OWNER = 'apkingamit';
const REPO_NAME = 'angel-store-data';
const CATEGORIES_FILE = 'categories.json';
const PRODUCTS_FILE = 'products.json';
const TOKEN = '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'; // Create a GitHub personal access token

// DOM Elements
const categoryNameInput = document.getElementById('category-name');
const categoryImageInput = document.getElementById('category-image');
const addCategoryBtn = document.getElementById('add-category');
const categoriesContainer = document.getElementById('categories-container');
const productCategorySelect = document.getElementById('product-category');
const productNameInput = document.getElementById('product-name');
const productDescInput = document.getElementById('product-desc');
const productPriceInput = document.getElementById('product-price');
const productImageInput = document.getElementById('product-image');
const affiliateLinkInput = document.getElementById('affiliate-link');
const addProductBtn = document.getElementById('add-product');
const productsContainer = document.getElementById('products-container');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
});

// Load categories from GitHub
async function loadCategories() {
    try {
        const response = await fetch(
            `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${CATEGORIES_FILE}`
        );
        
        if (!response.ok) throw new Error('Failed to load categories');
        
        const categories = await response.json();
        renderCategories(categories);
        populateCategoryDropdown(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
        categoriesContainer.innerHTML = '<p>Error loading categories. Please try again later.</p>';
    }
}

// Render categories to the UI
function renderCategories(categories) {
    categoriesContainer.innerHTML = '';
    
    if (categories.length === 0) {
        categoriesContainer.innerHTML = '<p>No categories added yet.</p>';
        return;
    }
    
    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <span>${category.name}</span>
            <button class="delete-btn" data-id="${category.id}">Delete</button>
        `;
        categoriesContainer.appendChild(categoryItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-id');
            deleteCategory(categoryId);
        });
    });
}

// Populate category dropdown
function populateCategoryDropdown(categories) {
    productCategorySelect.innerHTML = '<option value="">Select Category</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        productCategorySelect.appendChild(option);
    });
}

// Add new category
addCategoryBtn.addEventListener('click', async () => {
    const name = categoryNameInput.value.trim();
    const image = categoryImageInput.value.trim();
    
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    try {
        const categories = await fetchCategories();
        const newCategory = {
            id: Date.now().toString(),
            name,
            image
        };
        
        categories.push(newCategory);
        await saveCategories(categories);
        
        categoryNameInput.value = '';
        categoryImageInput.value = '';
        renderCategories(categories);
        populateCategoryDropdown(categories);
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Failed to add category. Please try again.');
    }
});

// Delete category
async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        const categories = await fetchCategories();
        const filteredCategories = categories.filter(cat => cat.id !== categoryId);
        await saveCategories(filteredCategories);
        renderCategories(filteredCategories);
        populateCategoryDropdown(filteredCategories);
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
    }
}

// Load products from GitHub
async function loadProducts() {
    try {
        const response = await fetch(
            `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${PRODUCTS_FILE}`
        );
        
        if (!response.ok) throw new Error('Failed to load products');
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

// Render products to the UI
function renderProducts(products) {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products added yet.</p>';
        return;
    }
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <div>
                <strong>${product.name}</strong> (₹${product.price})
                <p>${product.description || 'No description'}</p>
            </div>
            <button class="delete-btn" data-id="${product.id}">Delete</button>
        `;
        productsContainer.appendChild(productItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

// Add new product
addProductBtn.addEventListener('click', async () => {
    const categoryId = productCategorySelect.value;
    const name = productNameInput.value.trim();
    const description = productDescInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const image = productImageInput.value.trim();
    const affiliateLink = affiliateLinkInput.value.trim();
    
    if (!categoryId || !name || isNaN(price) || !affiliateLink) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        const products = await fetchProducts();
        const newProduct = {
            id: Date.now().toString(),
            categoryId,
            name,
            description,
            price,
            image,
            affiliateLink
        };
        
        products.push(newProduct);
        await saveProducts(products);
        
        // Reset form
        productNameInput.value = '';
        productDescInput.value = '';
        productPriceInput.value = '';
        productImageInput.value = '';
        affiliateLinkInput.value = '';
        
        renderProducts(products);
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
    }
});

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const products = await fetchProducts();
        const filteredProducts = products.filter(prod => prod.id !== productId);
        await saveProducts(filteredProducts);
        renderProducts(filteredProducts);
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
    }
}

// Fetch categories from GitHub
async function fetchCategories() {
    const response = await fetch(
        `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${CATEGORIES_FILE}`
    );
    return await response.json();
}

// Save categories to GitHub
async function saveCategories(categories) {
    const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CATEGORIES_FILE}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update categories',
                content: btoa(JSON.stringify(categories, null, 2)),
                sha: await getFileSha(CATEGORIES_FILE)
            })
        }
    );
    
    if (!response.ok) throw new Error('Failed to save categories');
}

// Fetch products from GitHub
async function fetchProducts() {
    const response = await fetch(
        `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${PRODUCTS_FILE}`
    );
    return await response.json();
}

// Save products to GitHub
async function saveProducts(products) {
    const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PRODUCTS_FILE}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update products',
                content: btoa(JSON.stringify(products, null, 2)),
                sha: await getFileSha(PRODUCTS_FILE)
            })
        }
    );
    
    if (!response.ok) throw new Error('Failed to save products');
}

// Get file SHA for updating
async function getFileSha(filename) {
    const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`,
        {
            headers: {
                'Authorization': `token ${TOKEN}`
            }
        }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.sha;
          }
