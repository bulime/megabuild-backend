
/* ============================================================
   MEGABUILD - AUTHENTICATION
   Login / Register / Email OTP / Account / Logout
   ============================================================ */

const AUTH_API_URL = '/api/auth';

let pendingOtpEmail = '';
let otpAlreadySent = false;
let registerRequestInProgress = false;
let loginRequestInProgress = false;
let verifyRequestInProgress = false;
let resendRequestInProgress = false;

/* ============================================================
   TIỆN ÍCH
   ============================================================ */

async function readResponse(response) {
    const text = await response.text();
    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error('Máy chủ trả về dữ liệu không hợp lệ.');
    }

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message || `Yêu cầu thất bại (${response.status}).`
        );
    }

    return data;
}

function showAuthMessage(message, type = 'success') {
    if (typeof showToast === 'function') {
        showToast(message, type === 'error' ? 'error' : 'success');
    } else {
        alert((type === 'error' ? '❌ ' : '✅ ') + message);
    }
}

function setRegisterMessage(message, type = 'success') {
    const element = document.getElementById('registerMessage');

    if (!element) {
        showAuthMessage(message, type);
        return;
    }

    element.textContent = message;
    element.className =
        'text-sm ' + (type === 'error' ? 'text-red-600' : 'text-green-600');
}

function setButtonLoading(button, loading, loadingText, originalText) {
    if (!button) return;

    button.disabled = loading;
    button.textContent = loading ? loadingText : originalText;
}

function normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
}

/* ============================================================
   LOGIN MODAL
   ============================================================ */

function openLoginModal() {
    const modal = document.getElementById('loginModal');

    if (!modal) {
        console.error('Không tìm thấy loginModal trong index.html.');
        return;
    }

    closeRegisterModal();

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    setTimeout(() => {
        document.getElementById('loginEmail')?.focus();
    }, 100);
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function switchToLogin() {
    openLoginModal();
}

/* ============================================================
   REGISTER MODAL
   ============================================================ */

function openRegisterModal() {
    const modal = document.getElementById('registerModal');

    if (!modal) {
        console.error('Không tìm thấy registerModal trong index.html.');
        return;
    }

    closeLoginModal();

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    setTimeout(() => {
        document.getElementById('registerName')?.focus();
    }, 100);
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function switchToRegister() {
    openRegisterModal();
}

/* ============================================================
   ĐĂNG NHẬP
   ============================================================ */

async function handleLogin(event) {
    event?.preventDefault();

    if (loginRequestInProgress) return;

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const form = document.getElementById('loginForm');
    const button = form?.querySelector('button[type="submit"]');

    if (!emailInput || !passwordInput) {
        showAuthMessage('Không tìm thấy form đăng nhập.', 'error');
        return;
    }

    const email = normalizeEmail(emailInput.value);
    const password = passwordInput.value;

    if (!email || !password) {
        showAuthMessage('Vui lòng nhập email và mật khẩu.', 'error');
        return;
    }

    const originalText = button?.textContent || 'Đăng nhập';
    loginRequestInProgress = true;

    try {
        setButtonLoading(button, true, 'Đang đăng nhập...', originalText);

        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await readResponse(response);

        if (data.success === false) {
            throw new Error(data.message || 'Đăng nhập thất bại.');
        }

        const user = {
            userId: data.userId,
            name: data.name,
            email: data.email || email,
            role: data.role
        };

        localStorage.setItem('megabuild_user', JSON.stringify(user));

        closeLoginModal();
        form?.reset();
        updateAccountUI();

        showAuthMessage(
            `Đăng nhập thành công! Xin chào ${user.name || 'bạn'}.`,
            'success'
        );

        setTimeout(() => {
            if ((user.role || '').toUpperCase() === 'ADMIN') {
                window.location.href = '/admin.html';
            } else {
                window.location.href = '/account.html';
            }
        }, 500);

    } catch (error) {
        console.error('Login error:', error);
        showAuthMessage(error.message || 'Đăng nhập thất bại!', 'error');

    } finally {
        loginRequestInProgress = false;
        setButtonLoading(button, false, '', originalText);
    }
}

/* ============================================================
   HIỂN THỊ KHU VỰC OTP ĐĂNG KÝ
   ============================================================ */

function showRegisterOtp(email) {
    pendingOtpEmail = normalizeEmail(email);
    otpAlreadySent = true;

    const modal = document.getElementById('registerModal');
    const section = document.getElementById('registerOtpSection');
    const input = document.getElementById('registerOtpCode');
    const button = document.getElementById('registerButton');
    const emailInput = document.getElementById('registerEmail');
    const message = document.getElementById('registerOtpMessage');

    // Giữ cửa sổ đăng ký mở
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    // Hiện ô nhập OTP
    if (!section) {
        console.error('Không tìm thấy registerOtpSection trong index.html.');
        setRegisterMessage(
            'Không tìm thấy khu vực OTP. Hãy kiểm tra index.html.',
            'error'
        );
        return;
    }

    section.classList.remove('hidden');
    section.style.display = 'block';

    if (emailInput) {
        emailInput.value = pendingOtpEmail;
        emailInput.readOnly = true;
    }

    if (input) {
        input.value = '';
        input.focus();
    }

    if (button) {
        button.disabled = true;
        button.textContent = 'Đã gửi OTP';
        button.classList.add('opacity-60');
    }

    if (message) {
        message.textContent =
            `Mã xác minh đã gửi đến ${pendingOtpEmail}. ` +
            'Hãy nhập mã gồm 6 chữ số.';
    }
}

function resetRegisterOtp() {
    pendingOtpEmail = '';
    otpAlreadySent = false;

    const section = document.getElementById('registerOtpSection');
    if (section) {
        section.classList.add('hidden');
        section.style.display = '';
    }

    const emailInput = document.getElementById('registerEmail');
    if (emailInput) emailInput.readOnly = false;

    const button = document.getElementById('registerButton');
    if (button) {
        button.disabled = false;
        button.textContent = 'Gửi mã OTP';
        button.classList.remove('opacity-60');
    }

    const otpInput = document.getElementById('registerOtpCode');
    if (otpInput) otpInput.value = '';
}

/* ============================================================
   ĐĂNG KÝ - GỬI OTP
   ============================================================ */

async function handleRegister(event) {
    event?.preventDefault();

    if (registerRequestInProgress) return;

    if (otpAlreadySent) {
        const section = document.getElementById('registerOtpSection');

        if (section) {
            section.classList.remove('hidden');
            section.style.display = 'block';
        }

        document.getElementById('registerOtpCode')?.focus();

        setRegisterMessage(
            'Bạn đã gửi OTP. Hãy nhập mã để xác minh email.',
            'success'
        );
        return;
    }

    const name = document.getElementById('registerName')?.value.trim();
    const email = normalizeEmail(
        document.getElementById('registerEmail')?.value
    );
    const password = document.getElementById('registerPassword')?.value;

    const button = document.getElementById('registerButton');
    const originalText = button?.textContent || 'Gửi mã OTP';

    if (!name || !email || !password) {
        setRegisterMessage('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }

    if (password.length < 8) {
        setRegisterMessage(
            'Mật khẩu phải có ít nhất 8 ký tự!',
            'error'
        );
        return;
    }

    registerRequestInProgress = true;

    try {
        setButtonLoading(button, true, 'Đang gửi mã OTP...', originalText);

        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await readResponse(response);

        // Chỉ hiện OTP khi backend trả về đăng ký thành công
        showRegisterOtp(data.email || email);

        setRegisterMessage(
            data.message || 'Yêu cầu đăng ký thành công. Hãy kiểm tra email.',
            'success'
        );

    } catch (error) {
        console.error('Register error:', error);
        setRegisterMessage(
            error.message || 'Không thể gửi mã OTP!',
            'error'
        );

    } finally {
        registerRequestInProgress = false;

        if (!otpAlreadySent) {
            setButtonLoading(button, false, '', originalText);
        }
    }
}

/* ============================================================
   XÁC MINH OTP ĐĂNG KÝ
   ============================================================ */

async function handleVerifyRegisterOtp() {
    if (verifyRequestInProgress) return;

    const input = document.getElementById('registerOtpCode');
    const button = document.getElementById('verifyRegisterOtpBtn');
    const code = input?.value.trim() || '';

    if (!pendingOtpEmail) {
        setRegisterMessage('Vui lòng gửi mã OTP trước!', 'error');
        return;
    }

    if (!/^\d{6}$/.test(code)) {
        setRegisterMessage('Mã OTP phải gồm đúng 6 chữ số!', 'error');
        input?.focus();
        return;
    }

    const originalText = button?.textContent || 'Xác minh và đăng ký';
    verifyRequestInProgress = true;

    try {
        setButtonLoading(button, true, 'Đang xác minh...', originalText);

        const response = await fetch(`${AUTH_API_URL}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: pendingOtpEmail,
                code
            })
        });

        const data = await readResponse(response);
        const verifiedEmail = pendingOtpEmail;

        setRegisterMessage(
            data.message || 'Xác minh email thành công!',
            'success'
        );

        document.getElementById('registerForm')?.reset();
        resetRegisterOtp();
        closeRegisterModal();
        openLoginModal();

        const loginEmail = document.getElementById('loginEmail');
        if (loginEmail) loginEmail.value = verifiedEmail;

        showAuthMessage(
            'Xác minh email thành công. Hãy đăng nhập!',
            'success'
        );

    } catch (error) {
        console.error('Verify register OTP error:', error);

        setRegisterMessage(
            error.message || 'Xác minh OTP thất bại!',
            'error'
        );

    } finally {
        verifyRequestInProgress = false;

        if (button) {
            button.disabled = false;
            button.textContent = originalText;
        }
    }
}

/* ============================================================
   GỬI LẠI OTP
   ============================================================ */

async function handleResendRegisterOtp() {
    if (resendRequestInProgress) return;

    if (!pendingOtpEmail) {
        setRegisterMessage('Vui lòng gửi mã OTP trước!', 'error');
        return;
    }

    const button = document.getElementById('resendRegisterOtpBtn');
    const originalText = button?.textContent || 'Gửi lại mã OTP';

    resendRequestInProgress = true;

    try {
        setButtonLoading(button, true, 'Đang gửi lại...', originalText);

        const response = await fetch(`${AUTH_API_URL}/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: pendingOtpEmail })
        });

        const data = await readResponse(response);

        const input = document.getElementById('registerOtpCode');
        if (input) {
            input.value = '';
            input.focus();
        }

        setRegisterMessage(
            data.message || 'Đã gửi lại mã OTP!',
            'success'
        );

    } catch (error) {
        console.error('Resend register OTP error:', error);

        setRegisterMessage(
            error.message || 'Không gửi lại được OTP!',
            'error'
        );

    } finally {
        resendRequestInProgress = false;

        if (button) {
            button.disabled = false;
            button.textContent = originalText;
        }
    }
}

/* ============================================================
   TÀI KHOẢN / ĐĂNG XUẤT
   ============================================================ */

function handleAccountClick() {
    const user = getCurrentUser();

    if (!user) {
        openLoginModal();
        return;
    }

    window.location.href = '/account.html';
}

function getCurrentUser() {
    const userData = localStorage.getItem('megabuild_user');

    if (!userData) return null;

    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error('Dữ liệu tài khoản bị lỗi:', error);
        localStorage.removeItem('megabuild_user');
        return null;
    }
}

function updateAccountUI() {
    const accountText = document.getElementById('accountLoginText');
    if (!accountText) return;

    const user = getCurrentUser();

    accountText.textContent = user
        ? (user.name || 'Tài khoản')
        : 'Đăng nhập';
}

function logout() {
    localStorage.removeItem('megabuild_user');

    const path = window.location.pathname;

    if (
        path.endsWith('/account.html') ||
        path.endsWith('account.html') ||
        path.endsWith('/admin.html') ||
        path.endsWith('admin.html')
    ) {
        window.location.href = '/';
        return;
    }

    updateAccountUI();
    showAuthMessage('Đã đăng xuất tài khoản.', 'success');
}

/* ============================================================
   KHỞI TẠO
   Lưu ý: form đã có onsubmit trong HTML nên không gắn submit
   listener lần thứ hai, tránh gọi API đăng ký/đăng nhập 2 lần.
   ============================================================ */

function initializeAuth() {
    updateAccountUI();

    const accountButton = document.getElementById('accountButton');
    if (accountButton && !accountButton.dataset.authBound) {
        accountButton.addEventListener('click', handleAccountClick);
        accountButton.dataset.authBound = 'true';
    }

    const verifyButton = document.getElementById('verifyRegisterOtpBtn');
    if (verifyButton && !verifyButton.dataset.authBound) {
        verifyButton.addEventListener('click', handleVerifyRegisterOtp);
        verifyButton.dataset.authBound = 'true';
    }

    const resendButton = document.getElementById('resendRegisterOtpBtn');
    if (resendButton && !resendButton.dataset.authBound) {
        resendButton.addEventListener('click', handleResendRegisterOtp);
        resendButton.dataset.authBound = 'true';
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton && !logoutButton.dataset.authBound) {
        logoutButton.addEventListener('click', logout);
        logoutButton.dataset.authBound = 'true';
    }
}

document.addEventListener('click', function (event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    // Không đóng modal khi người dùng bấm bên trong nội dung
    if (loginModal && event.target === loginModal) {
        closeLoginModal();
    }

    if (registerModal && event.target === registerModal) {
        closeRegisterModal();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    closeLoginModal();
    closeRegisterModal();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}
