    /**
 * MegaBuild Main Application Controller
 * Handles: Filtering, Searching, Sorting, Rendering, Product Details Modal, Toast notifications
 */

let products = [];
let currentCategory = 'all';
let currentSubCategory = 'all';
let selectedBrand = 'all';

/**
 * Utility: Extract localized text safely from string or i18n object
 */
function getLocalized(val, lang = currentLang) {
    if (!val) return '';
    if (typeof val === 'object') {
        return val[lang] || val.vi || Object.values(val)[0] || '';
    }
    return val;
}

/**
 * Utility: Format number to Vietnamese Dong currency string
 */
function formatVND(num) {
    if (isNaN(num)) return '0 đ';
    return Number(num).toLocaleString('vi-VN') + ' đ';
}

/**
 * Utility: Display floating toast notification
 */
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMsg');
    const iconEl = document.getElementById('toastIcon');
    if (!toast || !msgEl || !iconEl) return;

    msgEl.innerText = msg;
    if (type === 'error') {
        iconEl.className = 'fa-solid fa-circle-exclamation text-red-400 text-lg';
    } else {
        iconEl.className = 'fa-solid fa-circle-check text-emerald-400 text-lg';
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
}

/**
 * Filter by Main Category (from top navbar)
 * @param {string} category 
 */
function filterCategory(category) {
    currentCategory = category;
    currentSubCategory = 'all';
    selectedBrand = 'all';

    // Highlight active button in category bar
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-brand-600', 'text-white', 'shadow-sm');
        btn.classList.add('hover:bg-slate-800', 'text-slate-300');
    });

    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.remove('hover:bg-slate-800', 'text-slate-300');
        window.event.currentTarget.classList.add('bg-brand-600', 'text-white', 'shadow-sm');
    }

    if (typeof isBackendConnected !== 'undefined' && isBackendConnected) {
        fetchProductsFromBackend();
    } else {
        updateSidebarFilters(category);
        filterAndRenderProducts();
    }
}

/**
 * Re-render dynamic radio buttons for subcategories and brands in the sidebar
 * @param {string} category 
 */
function updateSidebarFilters(category) {
    const subContainer = document.getElementById('subCategoryFilters');
    const brandContainer = document.getElementById('brandFilters');
    if (!subContainer || !brandContainer) return;

    const sourceList = (products && products.length > 0) ? products : (typeof mockProducts !== 'undefined' ? mockProducts : []);
    const filtered = (category === 'all') ? sourceList : sourceList.filter(p => p.category === category);

    // Extract unique subcategories
    const subCategorySet = new Set();
    filtered.forEach(p => {
        const subName = getLocalized(p.subCategory);
        if (subName) subCategorySet.add(subName);
    });
    const subCategories = ['all', ...Array.from(subCategorySet)];

    const allTypesText = currentLang === 'vi' ? 'Tất cả loại' : (currentLang === 'en' ? 'All Types' : '所有类型');
    subContainer.innerHTML = subCategories.map(sub => `
        <label class="flex items-center gap-2 cursor-pointer hover:text-brand-600 transition text-xs sm:text-sm">
            <input type="radio" name="subCat" value="${sub}" ${sub === currentSubCategory ? 'checked' : ''} onchange="setSubCategory('${sub}')" class="text-brand-600 focus:ring-brand-500">
            <span class="capitalize">${sub === 'all' ? allTypesText : sub}</span>
        </label>
    `).join('');

    // Extract unique brands
    const brands = ['all', ...new Set(filtered.map(p => p.brand).filter(Boolean))];
    const allBrandsText = currentLang === 'vi' ? 'Tất cả thương hiệu' : (currentLang === 'en' ? 'All Brands' : '所有品牌');
    brandContainer.innerHTML = brands.map(brand => `
        <label class="flex items-center gap-2 cursor-pointer hover:text-brand-600 transition text-xs sm:text-sm">
            <input type="radio" name="brandFilter" value="${brand}" ${brand === selectedBrand ? 'checked' : ''} onchange="setBrand('${brand}')" class="text-brand-600 focus:ring-brand-500">
            <span>${brand === 'all' ? allBrandsText : brand}</span>
        </label>
    `).join('');
}

function setSubCategory(sub) {
    currentSubCategory = sub;
    if (typeof isBackendConnected !== 'undefined' && isBackendConnected) {
        fetchProductsFromBackend();
    } else {
        filterAndRenderProducts();
    }
}

function setBrand(brand) {
    selectedBrand = brand;
    if (typeof isBackendConnected !== 'undefined' && isBackendConnected) {
        fetchProductsFromBackend();
    } else {
        filterAndRenderProducts();
    }
}

/**
 * Filter and render products locally (offline or client-side mode)
 */
function filterAndRenderProducts() {
    const sourceList = (products && products.length > 0) ? products : (typeof mockProducts !== 'undefined' ? mockProducts : []);
    let result = [...sourceList];

    if (currentCategory !== 'all') {
        result = result.filter(p => p.category === currentCategory);
    }
    if (currentSubCategory !== 'all') {
        result = result.filter(p => getLocalized(p.subCategory) === currentSubCategory);
    }
    if (selectedBrand !== 'all') {
        result = result.filter(p => p.brand === selectedBrand);
    }

    const minP = parseFloat(document.getElementById('minPrice')?.value);
    const maxP = parseFloat(document.getElementById('maxPrice')?.value);
    if (!isNaN(minP)) result = result.filter(p => p.price >= minP);
    if (!isNaN(maxP)) result = result.filter(p => p.price <= maxP);

    const sortBy = document.getElementById('sortBy')?.value || 'default';
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((b, a) => b.price - a.price);
    if (sortBy === 'name') {
        result.sort((a, b) => getLocalized(a.name).localeCompare(getLocalized(b.name)));
    }

    renderProducts(result);
}

function applyPriceFilter() {
    if (typeof isBackendConnected !== 'undefined' && isBackendConnected) {
        fetchProductsFromBackend();
    } else {
        filterAndRenderProducts();
    }
}

function sortProducts() {
    if (typeof isBackendConnected !== 'undefined' && isBackendConnected) {
        fetchProductsFromBackend();
    } else {
        filterAndRenderProducts();
    }
}

function handleSearch() {
    if (typeof isBackendConnected !== 'undefined' && isBackendConnected) {
        fetchProductsFromBackend();
    } else {
        const query = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
        const sourceList = (products && products.length > 0) ? products : (typeof mockProducts !== 'undefined' ? mockProducts : []);
        if (!query) {
            filterAndRenderProducts();
            return;
        }
        const result = sourceList.filter(p =>
            getLocalized(p.name).toLowerCase().includes(query) ||
            getLocalized(p.description).toLowerCase().includes(query) ||
            getLocalized(p.subCategory).toLowerCase().includes(query) ||
            (p.brand && p.brand.toLowerCase().includes(query))
        );
        renderProducts(result);
    }
}

function resetFilters() {
    const searchEl = document.getElementById('searchInput');
    if (searchEl) searchEl.value = '';
    const minPEl = document.getElementById('minPrice');
    if (minPEl) minPEl.value = '';
    const maxPEl = document.getElementById('maxPrice');
    if (maxPEl) maxPEl.value = '';

    currentCategory = 'all';
    currentSubCategory = 'all';
    selectedBrand = 'all';

    document.querySelectorAll('.cat-btn').forEach((btn, idx) => {
        if (idx === 0) {
            btn.classList.add('bg-brand-600', 'text-white', 'shadow-sm');
            btn.classList.remove('hover:bg-slate-800', 'text-slate-300');
        } else {
            btn.classList.remove('bg-brand-600', 'text-white', 'shadow-sm');
            btn.classList.add('hover:bg-slate-800', 'text-slate-300');
        }
    });

    if (typeof isBackendConnected !== 'undefined' && isBackendConnected) {
        fetchProductsFromBackend();
    } else {
        updateSidebarFilters('all');
        renderProducts(products && products.length > 0 ? products : (typeof mockProducts !== 'undefined' ? mockProducts : []));
    }
}

/**
 * Render product cards in the grid
 * @param {Array} list 
 */
function renderProducts(list) {
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('productCount');
    if (!grid) return;

    if (countEl) countEl.innerText = list ? list.length : 0;

    const dict = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : {};

    if (!list || list.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = list.map(p => {
        const pName = getLocalized(p.name);
        const pSubCat = getLocalized(p.subCategory);
        const pDesc = getLocalized(p.description);
        const unitName = dict[p.unitKey] || '';
        const listPriceLabel = currentLang === 'vi' ? 'Giá niêm yết' : (currentLang === 'en' ? 'List Price' : '标牌价');
        const addToCartText = dict.addToCartBtn || (currentLang === 'vi' ? 'Thêm' : 'Add');

        return `
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                <div class="relative bg-slate-100 overflow-hidden aspect-[4/3] cursor-pointer" onclick="openDetail(${p.id})">
                    <img src="${p.image}" alt="${pName}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        ${p.brand}
                    </span>
                    <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow">
                        ⭐ ${p.rating || 5.0} (${p.reviewsCount || 100})
                    </div>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <span class="text-xs font-semibold text-brand-600 uppercase tracking-wide">${pSubCat}</span>
                        <h3 onclick="openDetail(${p.id})" class="font-bold text-slate-900 mt-1 line-clamp-2 hover:text-brand-600 transition cursor-pointer text-sm sm:text-base">
                            ${pName}
                        </h3>
                        <p class="text-xs text-slate-500 mt-2 line-clamp-2">${pDesc}</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                            <span class="text-xs text-slate-400 block">${listPriceLabel}</span>
                            <span class="text-base sm:text-lg font-black text-brand-600">${formatVND(p.price)} <span class="text-xs font-normal text-slate-500">/ ${unitName}</span></span>
                        </div>
                        <button onclick="addToCart(${p.id})" class="p-3 bg-slate-900 hover:bg-brand-600 text-white rounded-xl transition shadow-md flex items-center justify-center gap-1.5 text-xs font-semibold">
                            <i class="fa-solid fa-cart-plus"></i> <span class="hidden sm:inline">${addToCartText}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Product Detail Modal Handler
 * @param {number} id 
 */
function openDetail(id) {
    const sourceList = (products && products.length > 0) ? products : (typeof mockProducts !== 'undefined' ? mockProducts : []);
    const p = sourceList.find(item => item.id === id);
    if (!p) return;

    const dict = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : {};
    const content = document.getElementById('detailModalContent');
    if (!content) return;

    const pName = getLocalized(p.name);
    const pDesc = getLocalized(p.description);
    const unitName = dict[p.unitKey] || '';
    const reviewsLabel = currentLang === 'vi' ? 'đánh giá' : (currentLang === 'en' ? 'reviews' : '条评价');
    const unitPriceLabel = currentLang === 'vi' ? 'Đơn giá tiêu chuẩn' : (currentLang === 'en' ? 'Standard Unit Price' : '标准单价');
    const addToCartLabel = currentLang === 'vi' ? 'Thêm Vào Giỏ' : (currentLang === 'en' ? 'Add To Cart' : '加入购物车');

    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div class="rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
                <img src="${p.image}" alt="${pName}" class="w-full h-full object-cover">
            </div>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold rounded-lg uppercase">${p.brand}</span>
                    <span class="text-xs text-slate-500 font-medium">⭐ ${p.rating || 5.0} (${p.reviewsCount || 100} ${reviewsLabel})</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900">${pName}</h2>
                <p class="text-sm text-slate-600 leading-relaxed">${pDesc}</p>
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span class="text-xs text-slate-400 block">${unitPriceLabel}</span>
                    <div class="text-2xl font-black text-brand-600 mt-0.5">${formatVND(p.price)} <span class="text-xs font-normal text-slate-500">/ ${unitName}</span></div>
                </div>
                <div class="flex items-center gap-4 pt-2">
                    <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <button onclick="adjustModalQty(-1)" class="px-3 py-2 text-slate-600 hover:bg-slate-100 transition"><i class="fa-solid fa-minus text-xs"></i></button>
                        <input type="number" id="modalQty" value="1" min="1" class="w-12 text-center text-sm font-bold focus:outline-none">
                        <button onclick="adjustModalQty(1)" class="px-3 py-2 text-slate-600 hover:bg-slate-100 transition"><i class="fa-solid fa-plus text-xs"></i></button>
                    </div>
                    <button onclick="addToCartFromModal(${p.id})" class="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 text-sm">
                        <i class="fa-solid fa-cart-plus"></i> ${addToCartLabel}
                    </button>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.remove('hidden');
}

function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.add('hidden');
}

function adjustModalQty(val) {
    const input = document.getElementById('modalQty');
    if (!input) return;
    let current = parseInt(input.value) || 1;
    current += val;
    if (current < 1) current = 1;
    input.value = current;
}

function addToCartFromModal(id) {
    const input = document.getElementById('modalQty');
    const qty = parseInt(input?.value) || 1;
    addToCart(id, qty);
    closeDetailModal();
}

/**
 * Initialize App on DOM Loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Attempt fetching from backend (will auto-fallback to mock data if offline)
    if (typeof fetchProductsFromBackend === 'function') {
        fetchProductsFromBackend();
    } else if (typeof mockProducts !== 'undefined') {
        products = [...mockProducts];
        renderProducts(products);
        updateSidebarFilters('all');
    }

    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
});
