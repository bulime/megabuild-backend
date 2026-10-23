/**
 * MegaBuild AI Construction & Machine Consultant Chatbot
 */
function openAiConsultant() {
    const modal = document.getElementById('aiModal');
    if (modal) modal.classList.remove('hidden');
}

function closeAiConsultant() {
    const modal = document.getElementById('aiModal');
    if (modal) modal.classList.add('hidden');
}

function sendAiPreset(question) {
    const inputEl = document.getElementById('aiInput');
    if (inputEl) {
        inputEl.value = question;
        handleAiSend();
    }
}

function handleAiSend() {
    const inputEl = document.getElementById('aiInput');
    const query = inputEl?.value.trim();
    if (!query) return;

    const chatBox = document.getElementById('aiChatBox');
    if (!chatBox) return;

    // User bubble
    chatBox.innerHTML += `
        <div class="flex items-start justify-end gap-3">
            <div class="bg-orange-600 text-white p-4 rounded-2xl shadow-sm max-w-[85%] text-sm">
                ${query}
            </div>
            <div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                <i class="fa-solid fa-user"></i>
            </div>
        </div>
    `;
    inputEl.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate AI Thinking & Responding
    setTimeout(() => {
        let aiReply = "";
        const qLower = query.toLowerCase();

        if (qLower.includes('20m2') || qLower.includes('20m²') || (qLower.includes('xây') && qLower.includes('nhà')) || qLower.includes('house') || qLower.includes('建房')) {
            if (currentLang === 'vi') {
                aiReply = `
                    <strong>📊 Phân tích & Bóc tách chi phí AI cho nhà cấp 4 diện tích 20m²:</strong><br><br>
                    🔹 <strong>1. Định mức vật tư thô & hoàn thiện dự kiến:</strong>
                    <ul class="list-disc pl-4 mt-1 space-y-1">
                        <li><strong>Thép xây dựng (Hòa Phát):</strong> ~900 kg (~16.650.000 đ)</li>
                        <li><strong>Xi măng xây tô (Nghi Sơn):</strong> ~30 bao (~2.640.000 đ)</li>
                        <li><strong>Gạch ống Tuynel:</strong> ~3.000 viên (~3.600.000 đ)</li>
                        <li><strong>Sơn nước & chống thấm (Dulux):</strong> 2 thùng (~4.900.000 đ)</li>
                        <li><strong>Thiết bị điện & ống nước:</strong> ~3.500.000 đ</li>
                    </ul><br>
                    🔹 <strong>2. Thiết bị máy móc hỗ trợ thi công:</strong>
                    <ul class="list-disc pl-4 mt-1 space-y-1">
                        <li>Máy khoan Bosch GSB 550 & Máy cắt sắt cầm tay: ~1.930.000 đ</li>
                    </ul><br>
                    🔹 <strong>3. Tổng dự toán chi phí (Vật tư + Nhân công thô):</strong>
                    <br>Khoảng <strong>45.000.000 đ – 65.000.000 đ</strong> tùy thuộc vào vật liệu hoàn thiện bạn chọn.<br>
                    <span class="text-orange-600 font-semibold">💡 Bạn có thể bấm chọn các sản phẩm trên để thêm trực tiếp vào Giỏ hàng dự án!</span>
                `;
            } else if (currentLang === 'en') {
                aiReply = `
                    <strong>📊 AI Cost Estimation for a 20m² 1-Storey House:</strong><br><br>
                    🔹 <strong>1. Estimated Raw & Finishing Materials:</strong>
                    <ul class="list-disc pl-4 mt-1 space-y-1">
                        <li><strong>Steel bars (Hoa Phat):</strong> ~900 kg (~$670)</li>
                        <li><strong>Cement (Nghi Son):</strong> ~30 bags (~$105)</li>
                        <li><strong>Tuynel bricks:</strong> ~3,000 pcs (~$150)</li>
                        <li><strong>Waterproof primer & paint (Dulux):</strong> 2 cans (~$200)</li>
                        <li><strong>Electrical & Plumbing:</strong> ~$140</li>
                    </ul><br>
                    🔹 <strong>2. Estimated Total Cost:</strong> Around <strong>$2,000 – $2,800</strong> depending on the finishing quality.
                `;
            } else {
                aiReply = `
                    <strong>📊 20平米平房 AI 成本预算分析:</strong><br><br>
                    🔹 <strong>1. 预计原材料定额:</strong>
                    <ul class="list-disc pl-4 mt-1 space-y-1">
                        <li><strong>建筑钢筋 (和发):</strong> ~900 公斤</li>
                        <li><strong>水泥 (宜山):</strong> ~30 包</li>
                        <li><strong>红砖:</strong> ~3,000 块</li>
                        <li><strong>防水漆 (多乐士):</strong> 2 桶</li>
                    </ul><br>
                    🔹 <strong>2. 预估总成本:</strong> 约 <strong>15,000 - 20,000 人民币</strong>。
                `;
            }
        } else if (qLower.includes('máy khoan') || qLower.includes('máy hàn') || qLower.includes('máy cắt') || qLower.includes('drill') || qLower.includes('welder') || qLower.includes('电钻') || qLower.includes('电焊机')) {
            aiReply = `
                <strong>⚡ Tư vấn thiết bị công trình chuyên nghiệp từ MegaBuild AI:</strong><br>
                <ul class="list-disc pl-4 mt-1 space-y-1">
                    <li><strong>Máy khoan:</strong> Đề xuất <em>Bosch GSB 550</em> (1.250.000 đ) chuyên khoan tường/bê tông gia đình và công trình nhỏ.</li>
                    <li><strong>Máy hàn:</strong> Đề xuất <em>Jasic ARC 200</em> (2.650.000 đ) công nghệ Inverter siêu bền, mồi lửa cực nhạy cho thợ cơ khí.</li>
                    <li><strong>Máy cắt sắt:</strong> Đề xuất <em>Makita LW1400</em> (3.450.000 đ) công suất 2200W cắt thép hộp, thép V cực nhanh và chuẩn xác.</li>
                </ul>
            `;
        } else {
            aiReply = currentLang === 'vi'
                ? `Cảm ơn câu hỏi của bạn! Với yêu cầu "${query}", MegaBuild cung cấp đầy đủ các dòng vật tư chính hãng (thép, xi măng, sơn, thiết bị điện nước) và máy móc cầm tay (máy khoan, máy hàn, máy cắt) với giá sỉ tốt nhất. Bạn vui lòng liên hệ Hotline 1900 8888 hoặc sử dụng tính năng "Dự toán online" để được báo giá chi tiết nhé!`
                : `Thank you for asking! For "${query}", MegaBuild provides all genuine materials (steel, cement, paint, electrical, plumbing) and equipment with the best wholesale prices. Please call Hotline 1900 8888 or use our "Online Estimator" for assistance!`;
        }

        chatBox.innerHTML += `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    <i class="fa-solid fa-robot"></i>
                </div>
                <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 max-w-[85%] text-slate-700 space-y-2">
                    <p>${aiReply}</p>
                </div>
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
}
