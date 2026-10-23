/**
 * MegaBuild API Service
 * Handles communication with Spring Boot REST Controllers:
 * - GET /api/products
 * - POST /api/orders
 */
const API_BASE_URL = window.location.origin.includes('8080') ? '/api' : 'http://localhost:8080/api';
let isBackendConnected = false;

/**
 * Fetch product list from Spring Boot backend with filters
 */
async function fetchProductsFromBackend() {
    try {
        const queryParams = new URLSearchParams({
            lang: typeof currentLang !== 'undefined' ? currentLang : 'vi'
        });

        if (typeof currentCategory !== 'undefined' && currentCategory !== 'all') {
            queryParams.append('category', currentCategory);
        }
        if (typeof selectedBrand !== 'undefined' && selectedBrand !== 'all') {
            queryParams.append('brand', selectedBrand);
        }

        const keyword = document.getElementById('searchInput')?.value.trim();
        if (keyword) queryParams.append('q', keyword);

        const minP = document.getElementById('minPrice')?.value;
        const maxP = document.getElementById('maxPrice')?.value;
        if (minP) queryParams.append('minPrice', minP);
        if (maxP) queryParams.append('maxPrice', maxP);

        const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        isBackendConnected = true;
        products = data;

        // Apply client-side subCategory and sorting if present
        let displayList = [...products];
        if (typeof currentSubCategory !== 'undefined' && currentSubCategory !== 'all') {
            displayList = displayList.filter(p => {
                const sub = typeof p.subCategory === 'object' ? p.subCategory[currentLang] : p.subCategory;
                return sub === currentSubCategory;
            });
        }

        const sortBy = document.getElementById('sortBy')?.value || 'default';
        if (sortBy === 'price-asc') displayList.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') displayList.sort((b, a) => b.price - a.price);
        if (sortBy === 'name') {
            displayList.sort((a, b) => {
                const nameA = typeof a.name === 'object' ? a.name[currentLang] : a.name;
                const nameB = typeof b.name === 'object' ? b.name[currentLang] : b.name;
                return (nameA || '').localeCompare(nameB || '');
            });
        }

        if (typeof renderProducts === 'function') {
            renderProducts(displayList);
        }
        if (typeof updateSidebarFilters === 'function') {
            updateSidebarFilters(currentCategory);
        }

    } catch (err) {
        console.warn("Spring Boot Backend chưa khởi động hoặc không kết nối được. Sử dụng dữ liệu dự phòng (Mock Data).", err);
        isBackendConnected = false;

        // Fallback to local mock database
        if (typeof mockProducts !== 'undefined') {
            products = [...mockProducts];
            if (typeof filterAndRenderProducts === 'function') {
                filterAndRenderProducts();
            }
        }
    }
}

/**
 * Handle checkout submission to /api/orders
 * @param {Event} e
 */

async function submitOrder(e) {
    e.preventDefault();

    if (!cart || cart.length === 0) {
        showToast(
            currentLang === 'vi' ? 'Giỏ hàng đang trống!' : 'Cart is empty!',
            'error'
        );
        return;
    }

    const btn = document.getElementById('btnSubmitOrder');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang xử lý...';

    try {
        // Lấy email tài khoản đã đăng nhập
        const user = JSON.parse(
            localStorage.getItem('megabuild_user') || '{}'
        );

        // Ưu tiên email tài khoản, nếu không có thì lấy từ ô nhập email
        const customerEmail =
            user.email ||
            document.getElementById('custEmail')?.value.trim() ||
            '';

        if (!customerEmail) {
            showToast(
                currentLang === 'vi'
                    ? 'Không tìm thấy email. Vui lòng đăng nhập lại!'
                    : 'Email not found. Please log in again!',
                'error'
            );
            return;
        }

        const payload = {
            customerName: document.getElementById('custName')?.value.trim() || '',
            customerEmail: customerEmail,
            phone: document.getElementById('custPhone')?.value.trim() || '',
            address: document.getElementById('custAddress')?.value.trim() || '',
            notes: document.getElementById('custNotes')?.value.trim() || '',
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.qty
            }))
        };

        console.log('Dữ liệu gửi đơn hàng:', payload);

        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
            throw new Error(data.message || `HTTP error ${response.status}`);
        }

        closeCheckoutModal();
        cart = [];
        updateCartUI();

        const orderCode = data.orderId
            ? `#${data.orderId}`
            : '#MB' + Math.floor(100000 + Math.random() * 900000);

        showToast(
            currentLang === 'vi'
                ? `Đặt hàng thành công! Mã đơn: ${orderCode}`
                : `Order successful! Order: ${orderCode}`
        );

    } catch (err) {
        console.error('Đặt hàng thất bại:', err);

        showToast(
            currentLang === 'vi'
                ? 'Đặt hàng thất bại. Vui lòng thử lại!'
                : 'Order failed. Please try again!',
            'error'
        );

    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ===============================
// ADMIN - PRODUCT MANAGEMENT
// ===============================

function getAdminUserId() {
    const user = JSON.parse(localStorage.getItem('megabuild_user'));

    if (!user || user.role !== 'ADMIN') {
        throw new Error('Bạn không có quyền ADMIN!');
    }

    return user.userId;
}


// Lấy danh sách sản phẩm
async function adminGetProducts() {

    const response = await fetch(
        `${API_BASE_URL}/products?lang=vi`
    );

    if (!response.ok) {
        throw new Error('Không thể tải danh sách sản phẩm');
    }

    return await response.json();
}


// Thêm sản phẩm
async function adminCreateProduct(product) {

    const userId = getAdminUserId();

    const response = await fetch(
        `${API_BASE_URL}/admin/products?userId=${userId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Thêm sản phẩm thất bại');
    }

    return data;
}


// Sửa sản phẩm
async function adminUpdateProduct(id, product) {

    const userId = getAdminUserId();

    const response = await fetch(
        `${API_BASE_URL}/admin/products/${id}?userId=${userId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Cập nhật sản phẩm thất bại');
    }

    return data;
}


// Xóa sản phẩm
async function adminDeleteProduct(id) {

    const userId = getAdminUserId();

    const response = await fetch(
        `${API_BASE_URL}/admin/products/${id}?userId=${userId}`,
        {
            method: 'DELETE'
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Xóa sản phẩm thất bại');
    }

    return data;
}