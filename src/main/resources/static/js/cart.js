/**
 * MegaBuild Shopping Cart Module
 * Handles: adding items, quantity updates, cart drawer slide-out, checkout modal
 */
let cart = [];

/**
 * Add a product to the cart by its ID
 * @param {number} id 
 * @param {number} qty 
 */
function addToCart(id, qty = 1) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }

    updateCartUI();

    const dict = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : {};
    const unitText = dict[product.unitKey] || '';
    const productName = typeof product.name === 'object' ? (product.name[currentLang] || product.name.vi) : product.name;

    const msg = currentLang === 'vi' ? `Đã thêm ${qty} ${unitText} "${productName}" vào giỏ hàng.` :
        currentLang === 'en' ? `Added ${qty} ${unitText} "${productName}" to cart.` :
            `已将 ${qty} ${unitText} "${productName}" 添加到购物车。`;

    showToast(msg);
}

/**
 * Re-render the Cart Drawer and Header Badges
 */
function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

    const badgeEl = document.getElementById('cartBadge');
    if (badgeEl) badgeEl.innerText = totalCount;

    const countHeaderEl = document.getElementById('cartCountHeader');
    if (countHeaderEl) countHeaderEl.innerText = totalCount;

    const dict = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : {};
    const listEl = document.getElementById('cartItemsList');
    if (!listEl) return;

    if (cart.length === 0) {
        listEl.innerHTML = `
            <div class="text-center py-12">
                <i class="fa-solid fa-cart-shopping text-4xl text-slate-300 mb-2"></i>
                <p class="text-slate-500 text-sm">
                    ${currentLang === 'vi' ? 'Giỏ hàng dự án đang trống' : currentLang === 'en' ? 'Project cart is empty' : '购物车为空'}
                </p>
            </div>
        `;
        const subtotalEl = document.getElementById('cartSubtotal');
        if (subtotalEl) subtotalEl.innerText = '0 đ';
        const totalEl = document.getElementById('cartTotal');
        if (totalEl) totalEl.innerText = '0 đ';
        return;
    }

    let subtotal = 0;
    listEl.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        const itemName = typeof item.name === 'object' ? (item.name[currentLang] || item.name.vi) : item.name;
        const unitText = dict[item.unitKey] || '';

        return `
            <div class="py-4 flex gap-4 items-center">
                <img src="${item.image}" alt="${itemName}" class="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0">
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-900 text-sm truncate">${itemName}</h4>
                    <div class="text-xs text-brand-600 font-semibold mt-0.5">
                        ${formatVND(item.price)} / ${unitText}
                    </div>
                    <div class="flex items-center gap-3 mt-2">
                        <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <button onclick="updateCartQty(${index}, -1)" class="px-2 py-1 text-slate-600 hover:bg-slate-100">
                                <i class="fa-solid fa-minus text-[10px]"></i>
                            </button>
                            <span class="w-8 text-center text-xs font-bold">${item.qty}</span>
                            <button onclick="updateCartQty(${index}, 1)" class="px-2 py-1 text-slate-600 hover:bg-slate-100">
                                <i class="fa-solid fa-plus text-[10px]"></i>
                            </button>
                        </div>
                        <button onclick="removeCartItem(${index})" class="text-slate-400 hover:text-red-600 text-xs transition">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                <div class="text-right font-bold text-sm text-slate-900">
                    ${formatVND(itemTotal)}
                </div>
            </div>
        `;
    }).join('');

    const subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) subtotalEl.innerText = formatVND(subtotal);

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.innerText = formatVND(subtotal);
}

/**
 * Increment / Decrement quantity in cart
 * @param {number} index 
 * @param {number} delta 
 */
function updateCartQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

/**
 * Remove an item from the cart
 * @param {number} index 
 */
function removeCartItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

/**
 * Toggle the Slide-over Cart Drawer
 */
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.classList.toggle('hidden');
}

/**
 * Open Checkout Information Modal
 */
function checkout() {
    if (cart.length === 0) {
        showToast(currentLang === 'vi' ? 'Giỏ hàng của bạn đang trống!' : 'Your cart is empty!', 'error');
        return;
    }
    toggleCart(); // Close cart drawer
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) checkoutModal.classList.remove('hidden');
}

/**
 * Close Checkout Information Modal
 */
function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) checkoutModal.classList.add('hidden');
}
