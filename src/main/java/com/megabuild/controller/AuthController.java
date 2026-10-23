package com.megabuild.controller;

import com.megabuild.dto.LoginRequest;
import com.megabuild.dto.RegisterRequest;
import com.megabuild.entity.User;
import com.megabuild.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã tạo tài khoản. Vui lòng kiểm tra Gmail để lấy mã OTP!",
                    "userId", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", safeMessage(e)
            ));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody Map<String, String> request) {
        try {
            authService.verifyOtp(
                    request.get("email"),
                    request.get("code")
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Xác minh email thành công! Bạn có thể đăng nhập."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", safeMessage(e)
            ));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(
            @RequestBody Map<String, String> request) {
        try {
            authService.resendOtp(request.get("email"));

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã gửi mã OTP mới. Vui lòng kiểm tra Gmail!"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", safeMessage(e)
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đăng nhập thành công!",
                    "userId", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", safeMessage(e)
            ));
        }
    }

    private String safeMessage(RuntimeException e) {
        if (e.getMessage() == null || e.getMessage().isBlank()) {
            return "Đã xảy ra lỗi. Vui lòng thử lại!";
        }
        return e.getMessage();
    }
}
