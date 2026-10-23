package com.megabuild.security;

import com.megabuild.entity.User;
import com.megabuild.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminGuard {

    private final UserRepository userRepository;

    public User checkAdmin(Long userId) {

        if (userId == null) {
            throw new RuntimeException("Chưa đăng nhập!");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy người dùng!")
                );

        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException(
                    "Bạn không có quyền truy cập khu vực quản trị!"
            );
        }

        return user;
    }
}