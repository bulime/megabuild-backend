/**
 * MegaBuild Multi-Language Dictionary & Localization System
 * Supports: Tiếng Việt (vi), English (en), 中文 (zh)
 */
const translations = {
    vi: {
        pageTitle: "MegaBuild - Siêu Thị Vật Liệu & Thiết Bị Xây Dựng",
        hotline: "Hotline dự án: 1900 8888",
        delivery247: "Giao hàng tận công trình 24/7",
        branchSystem: "Hệ thống chi nhánh",
        orderTracking: "Tra cứu đơn hàng",
        techSupport: "Hỗ trợ kỹ thuật",
        logoSub: "Vật liệu & Thiết bị xây dựng",
        searchPlaceholder: "Tìm kiếm máy khoan, máy hàn, thép, xi măng, sơn...",
        searchBtn: "Tìm kiếm",
        accountLabel: "Tài khoản",
        loginLabel: "Đăng nhập",
        cartLabel: "Giỏ hàng",
        aiConsultantNav: "AI Tư Vấn & Xây Nhà",
        catAll: "Tất cả danh mục",
        catMachines: "Máy móc & Thiết bị",
        catSteel: "Thép & Kim loại",
        catWood: "Gỗ & Ván ép",
        catPaint: "Sơn & Hóa chất",
        catElectrical: "Thiết bị điện",
        catPlumbing: "Ống nước & Phụ kiện",
        catCement: "Xi măng & Gạch đá",
        heroTag: "Siêu hội vật liệu & máy móc xây dựng",
        heroTitle: "Giải Pháp Toàn Diện Cho Mọi Công Trình",
        heroDesc: "Cung cấp đầy đủ máy khoan, máy hàn, máy cắt, sắt thép, xi măng và thiết bị điện nước chính hãng từ các thương hiệu hàng đầu.",
        heroBtnAi: "Hỏi AI: Xây nhà 20m² hết bao nhiêu?",
        heroBtn1: "Xem Thiết Bị & Máy Móc",
        filterTitle: "Bộ lọc danh mục",
        filterSubTitle: "Loại vật liệu & Thiết bị cụ thể",
        filterPriceTitle: "Khoảng giá (VNĐ)",
        priceFrom: "Từ",
        priceTo: "Đến",
        filterPriceBtn: "Lọc theo giá",
        filterBrandTitle: "Thương hiệu",
        aiCardTitle: "AI Tư Vấn Xây Dựng 24/7",
        aiCardDesc: "Bạn muốn xây nhà 20m², nhà cấp 4 hay tìm máy khoan, máy hàn phù hợp? Hỏi AI ngay lập tức.",
        aiCardBtn: "Trò chuyện với AI",
        estimatorCardTitle: "Dự toán vật tư online",
        estimatorCardDesc: "Nhập diện tích công trình để hệ thống tự tính số lượng thép, xi măng, sơn cần thiết.",
        estimatorCardBtn: "Dự toán ngay",
        showingText: "Hiển thị",
        productsText: "sản phẩm",
        sortLabel: "Sắp xếp:",
        sortDefault: "Mặc định",
        sortPriceAsc: "Giá: Thấp đến Cao",
        sortPriceDesc: "Giá: Cao đến Thấp",
        sortName: "Tên: A-Z",
        emptyTitle: "Không tìm thấy sản phẩm phù hợp",
        emptyDesc: "Hãy thử tìm kiếm với từ khóa khác hoặc bỏ chọn bộ lọc.",
        emptyBtn: "Xem tất cả sản phẩm",
        cartModalTitle: "Giỏ Hàng Dự Án",
        cartSubtotalLabel: "Tạm tính vật tư & máy móc:",
        cartShippingLabel: "Phí vận chuyển dự kiến:",
        cartShippingFree: "Miễn phí (Nội thành)",
        cartTotalLabel: "Tổng cộng thanh toán:",
        checkoutBtn: "Tiến Hành Đặt Hàng Ngay",
        estModalTitle: "Dự Toán Vật Tư Xây Dựng",
        estAreaLabel: "Diện tích xây dựng sàn (m²)",
        estFloorsLabel: "Số tầng nhà",
        estCalcBtn: "Tính Toán Định Mức",
        aiModalTitle: "MegaBuild AI - Trợ Lý Xây Dựng Thông Minh",
        aiModalSub: "Hỏi đáp vật tư, máy móc và dự toán chi phí xây nhà 24/7",
        aiWelcomeMsg: "Xin chào! Tôi là trợ lý AI của MegaBuild. Tôi có thể giúp gì cho công trình của bạn hôm nay? Ví dụ bạn có thể hỏi:",
        aiPlaceholder: "Nhập câu hỏi (VD: Xây nhà 20m2 hết bao nhiêu tiền?)...",
        aiSendBtn: "Gửi",
        footerDesc: "Hệ thống phân phối vật liệu xây dựng và thiết bị máy móc công trình lớn nhất toàn quốc theo tiêu chuẩn quốc tế.",
        footerCol1Title: "Máy Móc & Thiết Bị",
        footerCol1Item1: "Máy Khoan Động Lực & Búa",
        footerCol1Item2: "Máy Hàn Điện Tử Inverter",
        footerCol1Item3: "Máy Cắt Sắt Bàn & Cầm Tay",
        footerCol1Item4: "Thép Gân & Thép Hình",
        footerCol1Item5: "Xi Măng & Gạch Xây Tô",
        footerCol2Title: "Thiết Bị & Hoàn Thiện",
        footerCol2Item1: "Sơn Lót & Sơn Phủ Cao Cấp",
        footerCol2Item2: "Dây Cáp Điện & Ổ Cắm",
        footerCol2Item3: "Ống Nhựa PVC & Phụ Kiện Nước",
        footerCol2Item4: "Ván MDF & Gỗ Ghép Thanh",
        footerCol2Item5: "Thiết bị chiếu sáng LED",
        footerCol3Title: "Chính Sách & Hỗ Trợ",
        footerCol3Item1: "Chính sách giao hàng công trình",
        footerCol3Item2: "Chính sách kiểm định chất lượng",
        footerCol3Item3: "Chính sách bảo hành máy móc",
        footerCol3Item4: "Hóa đơn VAT & Chứng chỉ xuất xưởng",
        footerCopyright: "© 2026 MegaBuild Vietnam. Bản quyền thuộc về Công ty Cổ phần VLXD Quốc Tế.",
        footerLink1: "Điều khoản sử dụng",
        footerLink2: "Chính sách bảo mật",
        footerLink3: "Quy chế hoạt động sàn",
        addToCartBtn: "Thêm",
        viewDetails: "Xem chi tiết",
        toastSuccess: "Thành công!",
        unitKg: "kg",
        unitCây: "cây (6m)",
        unitTấm: "tấm",
        unitThùng: "thùng",
        unitBộ: "bộ",
        unitCuộn: "cuộn",
        unitCái: "cái",
        unitHộp: "hộp",
        unitBao: "bao (50kg)",
        unitViên: "viên"
    },
    en: {
        pageTitle: "MegaBuild - Construction Materials & Equipment Supermarket",
        hotline: "Project Hotline: 1900 8888",
        delivery247: "On-site delivery 24/7",
        branchSystem: "Branch Network",
        orderTracking: "Order Tracking",
        techSupport: "Technical Support",
        logoSub: "Building Materials & Equipment",
        searchPlaceholder: "Search drill, welder, steel, cement, paint...",
        searchBtn: "Search",
        accountLabel: "Account",
        loginLabel: "Sign In",
        cartLabel: "Cart",
        aiConsultantNav: "AI Advisor & House Building",
        catAll: "All Categories",
        catMachines: "Machines & Equipment",
        catSteel: "Steel & Metals",
        catWood: "Wood & Plywood",
        catPaint: "Paint & Chemicals",
        catElectrical: "Electrical Equipment",
        catPlumbing: "Plumbing & Fittings",
        catCement: "Cement & Bricks",
        heroTag: "Mega Building Materials & Tools Festival",
        heroTitle: "Comprehensive Solutions For Every Project",
        heroDesc: "Supplying genuine drills, welders, cutters, steel, cement, and plumbing equipment from top global brands.",
        heroBtnAi: "Ask AI: Cost for 20m² house?",
        heroBtn1: "View Equipment & Tools",
        filterTitle: "Category Filter",
        filterSubTitle: "Specific Material & Equipment Type",
        filterPriceTitle: "Price Range (VND)",
        priceFrom: "From",
        priceTo: "To",
        filterPriceBtn: "Filter by Price",
        filterBrandTitle: "Brand",
        aiCardTitle: "24/7 AI Construction Advisor",
        aiCardDesc: "Want to build a 20m² house or find the right drill and welder? Ask AI instantly.",
        aiCardBtn: "Chat with AI",
        estimatorCardTitle: "Online Materials Estimator",
        estimatorCardDesc: "Enter project area to automatically calculate required steel, cement, and paint quantities.",
        estimatorCardBtn: "Estimate Now",
        showingText: "Showing",
        productsText: "products",
        sortLabel: "Sort by:",
        sortDefault: "Default",
        sortPriceAsc: "Price: Low to High",
        sortPriceDesc: "Price: High to Low",
        sortName: "Name: A-Z",
        emptyTitle: "No matching products found",
        emptyDesc: "Try searching with different keywords or clearing filters.",
        emptyBtn: "View All Products",
        cartModalTitle: "Project Cart",
        cartSubtotalLabel: "Subtotal (Materials & Tools):",
        cartShippingLabel: "Estimated Shipping Fee:",
        cartShippingFree: "Free (Inner City)",
        cartTotalLabel: "Total Payment:",
        checkoutBtn: "Proceed to Checkout Now",
        estModalTitle: "Construction Materials Estimator",
        estAreaLabel: "Floor Area (m²)",
        estFloorsLabel: "Number of Floors",
        estCalcBtn: "Calculate Quota",
        aiModalTitle: "MegaBuild AI - Smart Construction Assistant",
        aiModalSub: "24/7 Q&A on materials, machines & house building cost estimation",
        aiWelcomeMsg: "Hello! I am MegaBuild's AI assistant. How can I help your project today? For example you can ask:",
        aiPlaceholder: "Enter question (e.g., How much to build a 20m2 house?)...",
        aiSendBtn: "Send",
        footerDesc: "The largest national distribution system for construction materials and machinery according to international standards.",
        footerCol1Title: "Machines & Equipment",
        footerCol1Item1: "Hammer & Impact Drills",
        footerCol1Item2: "Inverter Arc Welders",
        footerCol1Item3: "Table & Hand Metal Cutters",
        footerCol1Item4: "Deformed & Structural Steel",
        footerCol1Item5: "Cement & Masonry Bricks",
        footerCol2Title: "Equipment & Finishing",
        footerCol2Item1: "High-end Primers & Coatings",
        footerCol2Item2: "Electric Cables & Sockets",
        footerCol2Item3: "PVC Pipes & Water Fittings",
        footerCol2Item4: "MDF Boards & Joined Wood",
        footerCol2Item5: "LED Lighting Equipment",
        footerCol3Title: "Policies & Support",
        footerCol3Item1: "Construction Site Delivery Policy",
        footerCol3Item2: "Quality Inspection Policy",
        footerCol3Item3: "Machine Warranty Policy",
        footerCol3Item4: "VAT Invoice & Mill Test Certificate",
        footerCopyright: "© 2026 MegaBuild Vietnam. All rights reserved.",
        footerLink1: "Terms of Use",
        footerLink2: "Privacy Policy",
        footerLink3: "Platform Operating Regulations",
        addToCartBtn: "Add",
        viewDetails: "View Details",
        toastSuccess: "Success!",
        unitKg: "kg",
        unitCây: "bar (6m)",
        unitTấm: "sheet",
        unitThùng: "can",
        unitBộ: "set",
        unitCuộn: "roll",
        unitCái: "pcs",
        unitHộp: "box",
        unitBao: "bag (50kg)",
        unitViên: "piece"
    },
    zh: {
        pageTitle: "MegaBuild - 建筑材料与机械设备超市",
        hotline: "项目热线: 1900 8888",
        delivery247: "工地全天候24/7送货",
        branchSystem: "分公司网络",
        orderTracking: "订单查询",
        techSupport: "技术支持",
        logoSub: "建筑材料与设备",
        searchPlaceholder: "搜索电钻、电焊机、切割机、钢材、水泥...",
        searchBtn: "搜索",
        accountLabel: "账户",
        loginLabel: "登录",
        cartLabel: "购物车",
        aiConsultantNav: "AI 顾问与建房估算",
        catAll: "全部分类",
        catMachines: "机械与设备",
        catSteel: "钢材与金属",
        catWood: "木材与胶合板",
        catPaint: "油漆与化学品",
        catElectrical: "电气设备",
        catPlumbing: "水暖与配件",
        catCement: "水泥与砖块",
        heroTag: "超级建材与工具节",
        heroTitle: "每个工程的综合解决方案",
        heroDesc: "提供来自全球顶级品牌的正品电钻、电焊机、切割机、钢材、水泥及水电设备。",
        heroBtnAi: "问AI：建造20平米房子多少钱？",
        heroBtn1: "查看机械与工具",
        filterTitle: "分类筛选",
        filterSubTitle: "具体材料与设备类型",
        filterPriceTitle: "价格范围 (VND)",
        priceFrom: "从",
        priceTo: "到",
        filterPriceBtn: "按价格筛选",
        filterBrandTitle: "品牌",
        aiCardTitle: "24/7 AI 建筑顾问",
        aiCardDesc: "想建造20平米房屋或寻找合适的电钻、电焊机？立即向AI咨询。",
        aiCardBtn: "与AI对话",
        estimatorCardTitle: "在线建材预算",
        estimatorCardDesc: "输入工程面积，系统自动计算所需的钢材、水泥和油漆数量。",
        estimatorCardBtn: "立即预算",
        showingText: "显示",
        productsText: "个产品",
        sortLabel: "排序:",
        sortDefault: "默认",
        sortPriceAsc: "价格：从低到高",
        sortPriceDesc: "价格：从高到低",
        sortName: "名称：A-Z",
        emptyTitle: "未找到符合条件的产品",
        emptyDesc: "请尝试使用其他关键词搜索或清除筛选条件。",
        emptyBtn: "查看所有产品",
        cartModalTitle: "项目购物车",
        cartSubtotalLabel: "材料与机械小计:",
        cartShippingLabel: "预计运费:",
        cartShippingFree: "免费（市内）",
        cartTotalLabel: "总计付款:",
        checkoutBtn: "立即结算",
        estModalTitle: "建筑材料预算器",
        estAreaLabel: "建筑面积 (m²)",
        estFloorsLabel: "楼层数",
        estCalcBtn: "计算定额",
        aiModalTitle: "MegaBuild AI - 智能建筑助手",
        aiModalSub: "24/7解答材料、机械及建房成本估算",
        aiWelcomeMsg: "您好！我是 MegaBuild 的 AI 助手。今天有什么我可以帮您的？例如您可以问：",
        aiPlaceholder: "输入问题（例如：建造20平米房子需要多少钱？）...",
        aiSendBtn: "发送",
        footerDesc: "全国最大的建筑材料和机械设备分销系统。",
        footerCol1Title: "机械与设备",
        footerCol1Item1: "冲击钻与电锤",
        footerCol1Item2: "逆变弧焊机",
        footerCol1Item3: "台式与手持钢筋切割机",
        footerCol1Item4: "螺纹钢与型钢",
        footerCol1Item5: "水泥与砌筑砖",
        footerCol2Title: "设备与装修",
        footerCol2Item1: "高端底漆与面漆",
        footerCol2Item2: "电缆与插座",
        footerCol2Item3: "PVC水管与水暖配件",
        footerCol2Item4: "MDF板与拼接木",
        footerCol2Item5: "LED照明设备",
        footerCol3Title: "政策与支持",
        footerCol3Item1: "工地配送政策",
        footerCol3Item2: "质量检验政策",
        footerCol3Item3: "机械保修政策",
        footerCol3Item4: "增值税发票与出厂合格证",
        footerCopyright: "© 2026 MegaBuild Vietnam. 版权所有。",
        footerLink1: "使用条款",
        footerLink2: "隐私政策",
        footerLink3: "平台运营规章",
        addToCartBtn: "添加",
        viewDetails: "查看详情",
        toastSuccess: "成功！",
        unitKg: "公斤",
        unitCây: "根 (6m)",
        unitTấm: "张",
        unitThùng: "桶",
        unitBộ: "套",
        unitCuộn: "卷",
        unitCái: "个",
        unitHộp: "盒",
        unitBao: "包 (50kg)",
        unitViên: "块"
    }
};

let currentLang = localStorage.getItem('megabuildLang') || 'vi';

if (!['vi', 'en', 'zh'].includes(currentLang)) {
    currentLang = 'vi';
}
/**
 * Switch system language & update DOM
 * @param {string} lang - 'vi' | 'en' | 'zh'
 */
function changeLanguage(lang) {
    currentLang = ['vi', 'en', 'zh'].includes(lang) ? lang : 'vi';
    localStorage.setItem('megabuildLang', currentLang);
    lang = currentLang;
    const dict = translations[lang] || translations.vi;

    // Update document title
    const pageTitleEl = document.getElementById('pageTitle');
    if (pageTitleEl) pageTitleEl.innerText = dict.pageTitle;

    // Update i18n text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });

    // Update input placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
            el.placeholder = dict[key];
        }
    });

    // Re-render UI components with new language
    if (typeof updateSidebarFilters === 'function') {
        updateSidebarFilters(typeof currentCategory !== 'undefined' ? currentCategory : 'all');
    }
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
    if (typeof fetchProductsFromBackend === 'function') {
        fetchProductsFromBackend();
    } else if (typeof filterAndRenderProducts === 'function') {
        filterAndRenderProducts();
    }
}

(function initLanguage() {
    const savedLang = localStorage.getItem('megabuildLang') || 'vi';

    const lang = ['vi', 'en', 'zh'].includes(savedLang)
        ? savedLang
        : 'vi';

    const selector = document.getElementById('langSelector');

    if (selector) {
        selector.value = lang;
    }

    if (typeof changeLanguage === 'function') {
        changeLanguage(lang);
    }
})();