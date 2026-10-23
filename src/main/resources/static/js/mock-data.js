/**
 * MegaBuild Offline / Fallback Mock Database
 * Used when Spring Boot backend is unavailable or when browsing offline.
 */
const mockProducts = [
    // --- MÁY MÓC & THIẾT BỊ XÂY DỰNG (MACHINES & TOOLS) ---
    {
        id: 101,
        name: { vi: "Máy Khoan Động Lực Cầm Tay Bosch GSB 550 Professional", en: "Bosch GSB 550 Impact Drill", zh: "博世 GSB 550 冲击钻" },
        category: "machines",
        subCategory: { vi: "Máy khoan & Máy búa", en: "Drills & Hammers", zh: "电钻与电锤" },
        brand: "Bosch",
        price: 1250000,
        unitKey: "unitCái",
        rating: 4.9,
        reviewsCount: 312,
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Máy khoan động lực mạnh mẽ 550W, chuyên dụng khoan bê tông, tường gạch và gỗ. Thiết kế nhỏ gọn, tay cầm chống trượt.", en: "Powerful 550W impact drill, specialized for drilling concrete, brick walls and wood. Compact design.", zh: "强劲550W冲击钻，专门用于钻混凝土、砖墙和木材。结构紧凑。" }
    },
    {
        id: 102,
        name: { vi: "Máy Hàn Điện Tử Inverter Jasic ARC 200 (Chính Hãng)", en: "Jasic ARC 200 Inverter Arc Welder", zh: "佳士 ARC 200 逆变弧焊机" },
        category: "machines",
        subCategory: { vi: "Máy hàn điện tử", en: "Arc Welders", zh: "电焊机" },
        brand: "Jasic",
        price: 2650000,
        unitKey: "unitBộ",
        rating: 5.0,
        reviewsCount: 428,
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Máy hàn que công nghệ IGBT inverter tiết kiệm điện, hồ quang ổn định, dễ mồi lửa, hàn que 2.5mm - 3.2mm liên tục.", en: "IGBT inverter arc welder saves electricity, stable arc, easy ignition, welds 2.5mm - 3.2mm electrodes continuously.", zh: "IGBT逆变弧焊机节电，电弧稳定，易起弧，连续焊接2.5mm-3.2mm焊条。" }
    },
    {
        id: 103,
        name: { vi: "Máy Cắt Sắt Bàn Makita LW1400 (355mm - 2200W)", en: "Makita LW1400 Chop Saw (355mm - 2200W)", zh: "牧田 LW1400 切割机 (355mm - 2200W)" },
        category: "machines",
        subCategory: { vi: "Máy cắt sắt & Máy mài", en: "Cutters & Grinders", zh: "切割机与磨光机" },
        brand: "Makita",
        price: 3450000,
        unitKey: "unitCái",
        rating: 4.9,
        reviewsCount: 195,
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Máy cắt sắt bàn công suất cực mạnh 2200W, lưỡi cắt 355mm cắt nhanh thép hộp, thép ống, thép V chính xác cao.", en: "Powerful 2200W chop saw, 355mm blade quickly cuts steel tubes, boxes and V-angles with high precision.", zh: "功率强大的2200W台式切割机，355毫米锯片可快速精确切割方管、圆管和角钢。" }
    },
    {
        id: 104,
        name: { vi: "Máy Khoan Búa Đục Bê Tông Makita HR2470 (780W)", en: "Makita HR2470 Rotary Hammer Drill", zh: "牧田 HR2470 锤钻" },
        category: "machines",
        subCategory: { vi: "Máy khoan & Máy búa", en: "Drills & Hammers", zh: "电钻与电锤" },
        brand: "Makita",
        price: 2980000,
        unitKey: "unitCái",
        rating: 4.8,
        reviewsCount: 164,
        image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Máy khoan búa 3 chức năng: Khoan xoay, khoan búa và đục phá. Lực đập mạnh mẽ, độ bền vượt trội cho công trình.", en: "3-function rotary hammer: Rotation, hammer drilling and demolition. Powerful impact force and durability.", zh: "三功能电锤：旋转、锤钻和凿破。冲击力强，经久耐用。" }
    },
    {
        id: 105,
        name: { vi: "Máy Mài Góc Cầm Tay Total TG1091006 (1010W)", en: "Total TG1091006 Angle Grinder (1010W)", zh: "得锐 TG1091006 角磨机 (1010W)" },
        category: "machines",
        subCategory: { vi: "Máy cắt sắt & Máy mài", en: "Cutters & Grinders", zh: "切割机与磨光机" },
        brand: "Total",
        price: 680000,
        unitKey: "unitCái",
        rating: 4.7,
        reviewsCount: 210,
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Máy mài góc đa năng 100mm, dùng mài ba via, cắt gạch, cắt sắt xây dựng với động cơ dây đồng 100%.", en: "Versatile 100mm angle grinder, used for grinding burrs, cutting tiles and construction steel.", zh: "多功能100毫米角磨机，用于磨毛刺、切割瓷砖和建筑钢材。" }
    },

    // --- THÉP & KIM LOẠI (STEEL) ---
    {
        id: 1,
        name: { vi: "Thép Tròn Gân (Thép Vằn) D10 - D25 Hòa Phát", en: "Deformed Steel Bar D10 - D25 Hoa Phat", zh: "螺纹钢筋 D10 - D25 和发集团" },
        category: "steel",
        subCategory: { vi: "Thép tròn / Thép vằn", en: "Round / Deformed Steel", zh: "圆钢 / 螺纹钢" },
        brand: "Hòa Phát",
        price: 18500,
        unitKey: "unitKg",
        rating: 4.9,
        reviewsCount: 342,
        image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Thép tròn gân xây dựng chất lượng cao, độ giãn dài lớn, chịu lực cực tốt, đạt tiêu chuẩn TCVN, JIS. Phù hợp cốt thép móng, dầm, sàn.", en: "High quality construction deformed steel bar, high elongation, excellent load capacity, meeting TCVN and JIS standards.", zh: "优质建筑螺纹钢筋，延伸率高，承载力极佳，符合TCVN和JIS标准。" }
    },
    {
        id: 3,
        name: { vi: "Thép Hình H (H100 - H300) Posco", en: "H-Beam Steel (H100 - H300) Posco", zh: "H型钢 (H100 - H300) 浦项" },
        category: "steel",
        subCategory: { vi: "Thép hình (H, I, V, U)", en: "Structural Steel (H, I, V, U)", zh: "型钢 (H, I, V, U)" },
        brand: "Posco",
        price: 24500,
        unitKey: "unitKg",
        rating: 5.0,
        reviewsCount: 128,
        image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Thép hình chữ H chuyên dùng cho kết cấu nhà xưởng tiền chế, nhịp lớn, cầu đường, chịu tải trọng nặng.", en: "H-beam steel specialized for pre-engineered steel structures, large spans, bridges, heavy loads.", zh: "H型钢专门用于预制钢结构、大跨度、桥梁和重载工程。" }
    },
    {
        id: 6,
        name: { vi: "Thép Hộp Vuông & Chữ Nhật Mạ Kẽm (40x80, 50x50)", en: "Galvanized Square & Rectangular Steel Tube", zh: "镀锌方管与矩形管 (40x80, 50x50)" },
        category: "steel",
        subCategory: { vi: "Thép hộp & Ống", en: "Steel Tubes & Pipes", zh: "方管与管道" },
        brand: "Hoa Sen",
        price: 385000,
        unitKey: "unitCây",
        rating: 4.9,
        reviewsCount: 512,
        image: "https://images.unsplash.com/photo-1530124566582-a613bc26b5ab?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Thép hộp mạ kẽm nhúng nóng chống ăn mòn tuyệt hảo, dùng làm cổng cửa, khung mái che, hàng rào và lan can.", en: "Hot-dip galvanized steel box with excellent corrosion resistance, used for doors, roof frames, fences and railings.", zh: "热浸镀锌方管具有极佳的耐腐蚀性，用于门窗、屋顶框架、围栏和栏杆。" }
    },

    // --- GỖ & VÁN ÉP (WOOD) ---
    {
        id: 7,
        name: { vi: "Ván MDF Chống Ẩm Thái Lan 18mm (1.22m x 2.44m)", en: "Thailand Moisture-Resistant MDF 18mm", zh: "泰国防潮MDF板 18mm (1.22m x 2.44m)" },
        category: "wood",
        subCategory: { vi: "Ván gỗ công nghiệp", en: "Industrial Wood Boards", zh: "工业木板" },
        brand: "Thái Lan",
        price: 360000,
        unitKey: "unitTấm",
        rating: 4.8,
        reviewsCount: 230,
        image: "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Ván gỗ MDF lõi xanh chống ẩm mốc cao, bề mặt mịn sẵn sàng phủ melamine, sơn PU làm tủ bếp, tủ áo.", en: "Green core MDF wood board with high moisture resistance, smooth surface ready for melamine or PU paint.", zh: "绿芯MDF木板防潮性高，表面光滑，可随时贴三聚氰胺或喷PU漆做橱柜衣柜。" }
    },
    {
        id: 8,
        name: { vi: "Gỗ Thông Tự Nhiên Ghép Thanh (18mm x 1.2m x 2.4m)", en: "Natural Pine Finger-Joint Board (18mm)", zh: "天然松木指接板 (18mm x 1.2m x 2.4m)" },
        category: "wood",
        subCategory: { vi: "Gỗ tự nhiên ghép", en: "Natural Joined Wood", zh: "天然拼接木" },
        brand: "EcoWood",
        price: 620000,
        unitKey: "unitTấm",
        rating: 4.7,
        reviewsCount: 142,
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Gỗ thông tự nhiên đã qua tẩm sấy chống cong vênh mối mọt, vân gỗ đẹp tự nhiên làm bàn ghế, ốp tường.", en: "Natural pine wood treated against warping and termites, beautiful natural wood grain for tables and wall paneling.", zh: "天然松木经过防翘抗白蚁处理，天然木纹美观，用于桌椅和墙面装饰。" }
    },

    // --- SƠN & HÓA CHẤT (PAINT) ---
    {
        id: 10,
        name: { vi: "Sơn Nước Ngoại Thất Dulux Weathershield Bóng (18L)", en: "Dulux Weathershield Exterior Gloss Paint (18L)", zh: "多乐士外墙光泽乳胶漆 (18L)" },
        category: "paint",
        subCategory: { vi: "Sơn tường ngoại/nội thất", en: "Interior/Exterior Wall Paint", zh: "内外墙漆" },
        brand: "Dulux",
        price: 2450000,
        unitKey: "unitThùng",
        rating: 4.9,
        reviewsCount: 420,
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Công nghệ chống phai màu, chống rêu mốc và chịu nhiệt độ khắc nghiệt, bảo vệ tường nhà lên tới 10 năm.", en: "Anti-fade, anti-mold and extreme temperature resistance technology, protecting walls up to 10 years.", zh: "防褪色、防霉和耐极端温度技术，保护墙面长达10年。" }
    },
    {
        id: 12,
        name: { vi: "Bộ Lu Lô Lăn Sơn & Cọ Quét Cán Nhựa Chuyên Dụng", en: "Professional Paint Roller & Brush Set", zh: "专业油漆滚筒与刷子套装" },
        category: "paint",
        subCategory: { vi: "Dụng cụ thợ sơn & Lu lô", en: "Painting Tools & Rollers", zh: "油漆工具与滚筒" },
        brand: "Dragon",
        price: 125000,
        unitKey: "unitBộ",
        rating: 4.7,
        reviewsCount: 156,
        image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Bao gồm 1 rulo lông cừu mịn không để lại sợi vải, 1 cần gạt sơn và bộ 3 cọ quét sơn góc cạnh cao cấp.", en: "Includes 1 smooth sheepskin roller, 1 paint tray and a set of 3 high-end edge paint brushes.", zh: "包括1个光滑的羊皮毛滚筒、1个漆盘和3个高端边缘油漆刷。" }
    },

    // --- THIẾT BỊ ĐIỆN (ELECTRICAL) ---
    {
        id: 13,
        name: { vi: "Dây Cáp Điện Đơn Cadivi CV 4.0 mm² (Cuộn 100m)", en: "Cadivi Single Electrical Wire CV 4.0 mm² (100m)", zh: "加迪维单芯电线 CV 4.0 mm² (100米)" },
        category: "electrical",
        subCategory: { vi: "Dây cáp điện", en: "Electric Cables", zh: "电缆电线" },
        brand: "Cadivi",
        price: 890000,
        unitKey: "unitCuộn",
        rating: 5.0,
        reviewsCount: 610,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Ruột đồng nguyên chất 100%, vỏ cách điện PVC cao cấp chống cháy lan, dẫn điện tuyệt hảo cho hệ thống điện âm tường.", en: "100% pure copper core, high-grade flame-retardant PVC insulation, excellent conductivity for in-wall electrical systems.", zh: "100%纯铜芯，高级阻燃PVC绝缘外皮，为墙内电气系统提供卓越导电性。" }
    },
    {
        id: 14,
        name: { vi: "Ổ Cắm & Công Tắc Âm Tường Panasonic Full-Color", en: "Panasonic Full-Color Wall Switch & Socket", zh: "松下全彩墙壁开关与插座" },
        category: "electrical",
        subCategory: { vi: "Công tắc & Ổ cắm", en: "Switches & Sockets", zh: "开关与插座" },
        brand: "Panasonic",
        price: 65000,
        unitKey: "unitCái",
        rating: 4.9,
        reviewsCount: 480,
        image: "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Thiết kế sang trọng, tiếp điểm đồng chắc chắn không đánh lửa, tuổi thọ cắm rút lên tới 50.000 lần.", en: "Luxurious design, solid copper contacts without sparking, plug-in lifespan up to 50,000 times.", zh: "豪华设计，坚固铜触点不打火，插拔寿命高达50,000次。" }
    },

    // --- ỐNG NƯỚC & PHỤ KIỆN (PLUMBING) ---
    {
        id: 16,
        name: { vi: "Ống Nhựa Bình Minh uPVC Phi 60 (Cây 4m)", en: "Binh Minh uPVC Pipe Phi 60 (4m bar)", zh: "平明uPVC水管 直径60 (4米/根)" },
        category: "plumbing",
        subCategory: { vi: "Ống nhựa & Phụ kiện", en: "Plastic Pipes & Fittings", zh: "塑料管与配件" },
        brand: "Bình Minh",
        price: 165000,
        unitKey: "unitCây",
        rating: 4.8,
        reviewsCount: 195,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Ống nước uPVC chịu áp lực cao, không bị ăn mòn bởi hóa chất, chuyên dùng cho thoát nước thải và cấp nước sinh hoạt.", en: "High pressure uPVC water pipe, chemical resistant, specialized for drainage and domestic water supply.", zh: "高压uPVC水管，耐化学腐蚀，专门用于排水和生活供水。" }
    },

    // --- XI MĂNG & GẠCH ĐÁ (CEMENT) ---
    {
        id: 18,
        name: { vi: "Xi Măng Xây Pát Xây Tô Nghi Sơn (PCB40)", en: "Nghi Son Masonry & Plastering Cement (PCB40)", zh: "宜山砌筑抹灰水泥 (PCB40)" },
        category: "cement",
        subCategory: { vi: "Xi măng & Vữa", en: "Cement & Mortar", zh: "水泥与砂浆" },
        brand: "Nghi Sơn",
        price: 88000,
        unitKey: "unitBao",
        rating: 4.8,
        reviewsCount: 540,
        image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Xi măng chất lượng cao, độ dẻo cao, giữ nước tốt, giúp tường trát mịn không bị rạn nứt chân chim.", en: "High quality cement, high plasticity, good water retention, helping smooth plastered walls without cracking.", zh: "优质水泥，高可塑性，保水性好，帮助抹灰墙面平整不龟裂。" }
    },
    {
        id: 19,
        name: { vi: "Gạch Ống Tuynel 2 Lỗ Chống Nóng (8x8x18cm)", en: "Tuynel 2-Hole Clay Brick (8x8x18cm)", zh: "图内尔2孔空心红砖 (8x8x18cm)" },
        category: "cement",
        subCategory: { vi: "Gạch xây dựng", en: "Construction Bricks", zh: "建筑砖块" },
        brand: "Viglacera",
        price: 1200,
        unitKey: "unitViên",
        rating: 4.7,
        reviewsCount: 380,
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
        description: { vi: "Gạch đất nung Tuynel công nghệ cao, màu đỏ đều, cường độ chịu nén lớn, cách âm cách nhiệt hoàn hảo cho tường xây.", en: "High-tech Tuynel clay brick, even red color, high compressive strength, perfect sound and heat insulation for walls.", zh: "高科技图内尔粘土砖，颜色均匀，抗压强度大，是墙体隔音隔热的理想选择。" }
    }
];
