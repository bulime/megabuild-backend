
package com.megabuild.service;
import com.megabuild.entity.EmailOtp;
import com.megabuild.dto.LoginRequest;
import com.megabuild.dto.RegisterRequest;
import com.megabuild.entity.User;
import com.megabuild.repository.EmailOtpRepository;
import com.megabuild.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Value;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final EmailOtpRepository emailOtpRepository;
    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String senderEmail;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    private final SecureRandom secureRandom = new SecureRandom();

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email không được để trống!");
        }

        return email.trim().toLowerCase(Locale.ROOT);
    }

    // =====================================================
    // ĐĂNG KÝ VÀ GỬI OTP
    // =====================================================


    @Transactional
    public User register(RegisterRequest request) {
        if (request == null) {
            throw new RuntimeException("Dữ liệu đăng ký không hợp lệ!");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Tên không được để trống!");
        }

        String email = normalizeEmail(request.getEmail());

        if (request.getPassword() == null
                || request.getPassword().isBlank()) {
            throw new RuntimeException("Mật khẩu không được để trống!");
        }

        if (request.getPassword().length() < 8) {
            throw new RuntimeException("Mật khẩu phải có ít nhất 8 ký tự!");
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElse(null);
        System.out.println("DEBUG email = [" + email + "]");
        System.out.println("DEBUG tìm thấy user = " + (user != null));

        if (user != null) {
            System.out.println("DEBUG user ID = " + user.getId());
        }
        // Email đã xác minh: không cho đăng ký lại.
        if (user != null && Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("Email này đã được đăng ký!");
        }

        // Phân biệt tài khoản mới và tài khoản chờ xác minh.
        boolean existingUnverifiedUser = user != null;

        if (user == null) {
            user = new User();
            user.setEmail(email);
        }

        user.setName(request.getName().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setEmailVerified(false);

        user = userRepository.saveAndFlush(user);

        // Tài khoản mới gửi OTP ngay; tài khoản chờ xác minh
        // phải tuân thủ giới hạn gửi lại OTP.
        sendOtp(email, existingUnverifiedUser);

        return user;
    }

    // =====================================================
    // XÁC MINH OTP
    // =====================================================

    @Transactional
    public void verifyOtp(String rawEmail, String code) {
        String email = normalizeEmail(rawEmail);

        if (code == null || !code.matches("\\d{6}")) {
            throw new RuntimeException(
                    "Mã OTP phải gồm đúng 6 chữ số!");
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy tài khoản đăng ký!"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException(
                    "Email đã được xác minh!");
        }

        EmailOtp otp = emailOtpRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "Mã OTP không tồn tại. Vui lòng gửi lại mã!"));

        if (otp.getExpiresAt() == null
                || otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            emailOtpRepository.delete(otp);
            throw new RuntimeException(
                    "Mã OTP đã hết hạn. Vui lòng gửi lại!");
        }

        if (otp.getAttempts() >= 5) {
            emailOtpRepository.delete(otp);
            throw new RuntimeException(
                    "Bạn đã nhập sai quá 5 lần. Vui lòng gửi mã mới!");
        }

        if (!passwordEncoder.matches(code, otp.getOtpHash())) {
            otp.setAttempts(otp.getAttempts() + 1);
            emailOtpRepository.save(otp);

            throw new RuntimeException("Mã OTP không chính xác!");
        }

        user.setEmailVerified(true);
        userRepository.save(user);

        emailOtpRepository.delete(otp);
    }

    // =====================================================
    // GỬI LẠI OTP
    // =====================================================

    @Transactional
    public void resendOtp(String rawEmail) {
        String email = normalizeEmail(rawEmail);

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy tài khoản đăng ký!"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException(
                    "Email đã được xác minh!");
        }

        sendOtp(email, true);
    }

    // =====================================================
    // TẠO VÀ GỬI OTP QUA GMAIL
    // =====================================================

    private void sendOtp(String email, boolean checkCooldown) {
        LocalDateTime now = LocalDateTime.now();

        System.out.println("DEBUG OTP email = [" + email + "]");

        EmailOtp otp = emailOtpRepository.findByEmail(email)
                .orElse(null);

        System.out.println("DEBUG OTP tìm thấy = " + (otp != null));

        if (otp != null) {
            System.out.println("DEBUG OTP ID = " + otp.getId());
        }

        if (checkCooldown && otp != null
                && otp.getLastSentAt() != null
                && otp.getLastSentAt().plusSeconds(60).isAfter(now)) {
            throw new RuntimeException(
                    "Vui lòng đợi 60 giây giữa các lần gửi mã!");
        }

        String code = String.format(
                "%06d", secureRandom.nextInt(1_000_000));

        if (otp == null) {
            otp = new EmailOtp();
            otp.setEmail(email);
        }

        otp.setOtpHash(passwordEncoder.encode(code));
        otp.setExpiresAt(now.plusMinutes(5));
        otp.setAttempts(0);
        otp.setLastSentAt(now);

        emailOtpRepository.saveAndFlush(otp);

        String senderEmail = System.getenv("GMAIL_USERNAME");


        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(senderEmail);
            message.setTo(email);
            message.setSubject("MegaBuild - Ma xac minh email");
            message.setText(
                    "Xin chao!\n\n"
                            + "Ma OTP xac minh email MegaBuild cua ban la: "
                            + code + "\n\n"
                            + "Ma co hieu luc trong 5 phut.\n"
                            + "Khong chia se ma nay voi bat ky ai.");

            mailSender.send(message);

        } catch (Exception e) {
            // Ghi lỗi chi tiết vào Terminal để dễ tìm nguyên nhân.
            System.err.println(
                    "Loi gui email OTP: " + e.getMessage());

            throw new RuntimeException(
                    "Không gửi được email OTP. Hãy kiểm tra cấu hình Gmail và App Password!");
        }
    }

    // =====================================================
    // ĐĂNG NHẬP
    // =====================================================

    @Transactional
    public User login(LoginRequest request) {
        if (request == null) {
            throw new RuntimeException(
                    "Email hoặc mật khẩu không đúng!");
        }

        String email = normalizeEmail(request.getEmail());

        if (request.getPassword() == null
                || request.getPassword().isBlank()) {
            throw new RuntimeException(
                    "Email hoặc mật khẩu không đúng!");
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException(
                        "Email hoặc mật khẩu không đúng!"));

        String storedPassword = user.getPassword();
        boolean passwordMatches;

        if (storedPassword != null
                && (storedPassword.startsWith("$2a$")
                || storedPassword.startsWith("$2b$")
                || storedPassword.startsWith("$2y$"))) {

            passwordMatches = passwordEncoder.matches(
                    request.getPassword(), storedPassword);

        } else {
            // Hỗ trợ tài khoản cũ đang lưu mật khẩu dạng văn bản.
            passwordMatches = storedPassword != null
                    && storedPassword.equals(request.getPassword());

            if (passwordMatches) {
                user.setPassword(passwordEncoder.encode(
                        request.getPassword()));
            }
        }

        if (!passwordMatches) {
            throw new RuntimeException(
                    "Email hoặc mật khẩu không đúng!");
        }

        // Tài khoản chưa xác minh không được đăng nhập,
        // trừ admin hoặc tài khoản cũ có emailVerified = null.
        if (!"ADMIN".equalsIgnoreCase(user.getRole())
                && Boolean.FALSE.equals(user.getEmailVerified())) {
            throw new RuntimeException(
                    "Bạn cần xác minh email bằng mã OTP trước khi đăng nhập!");
        }

        if (user.getEmailVerified() == null) {
            user.setEmailVerified(true);
        }
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException(
                    "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!"
            );
        }
        return userRepository.save(user);
    }
}