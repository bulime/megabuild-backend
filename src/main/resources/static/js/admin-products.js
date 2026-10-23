
// ==========================================
// ADMIN PRODUCT MANAGEMENT
// ==========================================

let editingProductId = null;

// ==========================================
// SAVE PRODUCT
// ==========================================

async function saveAdminProduct() {
    try {
        const category = document.getElementById('productCategory').value.trim();
        const brand = document.getElementById('productBrand').value.trim();
        const price = document.getElementById('productPrice').value;
        const unitKey = document.getElementById('productUnitKey').value.trim();
        const imageUrl = document.getElementById('productImage').value.trim();

        const nameVi = document.getElementById('productNameVi').value.trim();
        const subCategoryVi = document.getElementById('productSubCategoryVi').value.trim();
        const descriptionVi = document.getElementById('productDescriptionVi').value.trim();

        if (!category) {
            alert('Vui lòng chọn danh mục!');
            return;
        }

        if (!brand) {
            alert('Vui lòng nhập thương hiệu!');
            return;
        }

        if (!price || !Number.isFinite(Number(price)) || Number(price) <= 0) {
            alert('Giá sản phẩm không hợp lệ!');
            return;
        }

        if (!imageUrl) {
            alert('Vui lòng nhập URL hình ảnh!');
            return;
        }

        if (!nameVi) {
            alert('Vui lòng nhập tên sản phẩm tiếng Việt!');
            return;
        }

        const product = {
            category,
            brand,
            price: Number(price),
            unitKey: unitKey || 'unit',
            rating: 0,
            reviewsCount: 0,
            imageUrl,
            translations: [
                {
                    lang: 'vi',
                    name: nameVi,
                    subCategory: subCategoryVi,
                    description: descriptionVi
                }
            ]
        };

        let result;

        if (editingProductId !== null) {
            result = await adminUpdateProduct(editingProductId, product);
            alert('Cập nhật sản phẩm thành công!');
        } else {
            result = await adminCreateProduct(product);
            alert('Thêm sản phẩm thành công!' +
                (result?.productId ? ' ID: ' + result.productId : ''));
        }

        resetAdminProductForm();
        await loadAdminProducts();

    } catch (error) {
        console.error('Lỗi lưu sản phẩm:', error);
        alert(error.message || 'Lưu sản phẩm thất bại!');
    }
}

// ==========================================
// RESET FORM
// ==========================================

function resetAdminProductForm() {
    editingProductId = null;

    document.getElementById('productFormTitle').innerText = 'Thêm sản phẩm';
    document.getElementById('productId').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productBrand').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productUnitKey').value = 'unit';
    document.getElementById('productImage').value = '';

    document.getElementById('productNameVi').value = '';
    document.getElementById('productSubCategoryVi').value = '';
    document.getElementById('productDescriptionVi').value = '';

    const optionalFields = [
        'productNameEn',
        'productSubCategoryEn',
        'productDescriptionEn'
    ];

    optionalFields.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
}

// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadAdminProducts() {
    const container = document.getElementById('adminProductsList');
    if (!container) return;

    container.innerHTML = '<p>Đang tải sản phẩm...</p>';

    try {
        const products = await adminGetProducts();

        if (!Array.isArray(products) || products.length === 0) {
            container.innerHTML = '<p>Chưa có sản phẩm.</p>';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="admin-product-item">
                <img
                    src="${escapeHtml(product.image || product.imageUrl || '')}"
                    alt="${escapeHtml(product.name || '')}"
                    style="width:80px;height:80px;object-fit:cover;"
                >

                <div style="flex:1">
                    <strong>${escapeHtml(product.name || '')}</strong>
                    <div>ID: ${escapeHtml(String(product.id ?? ''))}</div>
                    <div>${escapeHtml(product.brand || '')}</div>
                    <div>${Number(product.price || 0).toLocaleString('vi-VN')} đ</div>
                </div>

                <div>
                    <button type="button"
                        onclick="editAdminProduct(${Number(product.id)})">
                        ✏️ Sửa
                    </button>

                    <button type="button"
                        onclick="deleteAdminProduct(${Number(product.id)})">
                        🗑️ Ngừng kinh doanh
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
        container.innerHTML =
            '<p>Không thể tải danh sách sản phẩm: ' +
            escapeHtml(error.message || 'Lỗi không xác định') +
            '</p>';
    }
}

// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ==========================================
// EDIT PRODUCT
// ==========================================

async function editAdminProduct(id) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/products/${encodeURIComponent(id)}?lang=vi`
        );

        if (!response.ok) {
            throw new Error(
                response.status === 404
                    ? 'Không tìm thấy sản phẩm hoặc sản phẩm đã bị ẩn.'
                    : 'Không thể tải sản phẩm. HTTP ' + response.status
            );
        }

        const product = await response.json();

        editingProductId = product.id;

        document.getElementById('productFormTitle').innerText =
            'Chỉnh sửa sản phẩm';

        document.getElementById('productId').value = product.id;
        document.getElementById('productCategory').value =
            product.category || '';
        document.getElementById('productBrand').value =
            product.brand || '';
        document.getElementById('productPrice').value =
            product.price ?? '';
        document.getElementById('productUnitKey').value =
            product.unitKey || 'unit';
        document.getElementById('productImage').value =
            product.image || product.imageUrl || '';

        document.getElementById('productNameVi').value =
            product.name || '';
        document.getElementById('productSubCategoryVi').value =
            product.subCategory || '';
        document.getElementById('productDescriptionVi').value =
            product.description || '';

        document.getElementById('productNameVi').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

    } catch (error) {
        console.error('Lỗi tải sản phẩm để sửa:', error);
        alert(error.message || 'Không thể tải sản phẩm!');
    }
}

// ==========================================
// SOFT DELETE PRODUCT
// ==========================================

async function deleteAdminProduct(id) {
    const confirmed = confirm(
        `Bạn có chắc muốn ngừng kinh doanh sản phẩm ID ${id} không?`
    );

    if (!confirmed) return;

    try {
        // Hàm này phải gọi API backend chuyển isActive thành false.
        await adminDeleteProduct(id);

        alert('Đã ngừng kinh doanh sản phẩm thành công!');
        await loadAdminProducts();

    } catch (error) {
        console.error('Lỗi ngừng kinh doanh sản phẩm:', error);
        alert(error.message || 'Ngừng kinh doanh sản phẩm thất bại!');
    }
}

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    loadAdminProducts();
});
