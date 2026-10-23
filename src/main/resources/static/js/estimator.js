/**
 * MegaBuild Construction Materials Estimator
 * Calculates standard quotas for Steel, Cement, and Paint based on floor area & stories.
 */
function openEstimator() {
    const modal = document.getElementById('estimatorModal');
    if (modal) modal.classList.remove('hidden');
}

function closeEstimator() {
    const modal = document.getElementById('estimatorModal');
    if (modal) modal.classList.add('hidden');
}

function calculateEstimation() {
    const area = parseFloat(document.getElementById('estArea')?.value);
    const floors = parseFloat(document.getElementById('estFloors')?.value);
    const resEl = document.getElementById('estResult');

    if (!area || !floors || area <= 0 || floors <= 0) {
        showToast(
            currentLang === 'vi' ? 'Vui lòng nhập diện tích và số tầng hợp lệ!' : 'Please enter valid area and floor numbers!',
            'error'
        );
        return;
    }

    const totalArea = area * floors;
    const steelKg = Math.round(totalArea * 45);
    const cementBags = Math.round(totalArea * 1.5);
    const paintLiters = Math.round(totalArea * 0.35);

    if (resEl) {
        resEl.classList.remove('hidden');
        if (currentLang === 'vi') {
            resEl.innerHTML = `
                <h4 class="font-bold text-slate-900 mb-1">Kết quả dự toán cho tổng diện tích ${totalArea} m²:</h4>
                <ul class="space-y-1 text-slate-700">
                    <li>🔹 <strong>Thép xây dựng dự kiến:</strong> ~${steelKg.toLocaleString()} kg</li>
                    <li>🔹 <strong>Xi măng xây tô:</strong> ~${cementBags.toLocaleString()} bao (50kg)</li>
                    <li>🔹 <strong>Sơn nước & lót:</strong> ~${paintLiters.toLocaleString()} lít</li>
                </ul>
                <p class="text-[11px] text-slate-400 mt-2">* Định mức tham khảo tiêu chuẩn công trình dân dụng.</p>
            `;
        } else if (currentLang === 'en') {
            resEl.innerHTML = `
                <h4 class="font-bold text-slate-900 mb-1">Estimated quota for total area ${totalArea} m²:</h4>
                <ul class="space-y-1 text-slate-700">
                    <li>🔹 <strong>Estimated Construction Steel:</strong> ~${steelKg.toLocaleString()} kg</li>
                    <li>🔹 <strong>Masonry Cement:</strong> ~${cementBags.toLocaleString()} bags (50kg)</li>
                    <li>🔹 <strong>Primer & Paint:</strong> ~${paintLiters.toLocaleString()} liters</li>
                </ul>
                <p class="text-[11px] text-slate-400 mt-2">* Standard reference quota for civil engineering.</p>
            `;
        } else {
            resEl.innerHTML = `
                <h4 class="font-bold text-slate-900 mb-1">总建筑面积 ${totalArea} m² 的预算结果:</h4>
                <ul class="space-y-1 text-slate-700">
                    <li>🔹 <strong>预计建筑钢材:</strong> ~${steelKg.toLocaleString()} 公斤</li>
                    <li>🔹 <strong>砌筑水泥:</strong> ~${cementBags.toLocaleString()} 包 (50kg)</li>
                    <li>🔹 <strong>底漆与面漆:</strong> ~${paintLiters.toLocaleString()} 升</li>
                </ul>
                <p class="text-[11px] text-slate-400 mt-2">* 民用建筑参考标准。</p>
            `;
        }
    }
}
