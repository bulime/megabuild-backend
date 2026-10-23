package com.megabuild.controller;

import com.megabuild.dto.AdminUserResponse;
import com.megabuild.dto.ProductAdminRequest;
import com.megabuild.entity.Product;
import com.megabuild.entity.User;
import com.megabuild.repository.UserRepository;
import com.megabuild.repository.OrderRepository;
import com.megabuild.repository.ProductRepository;
import com.megabuild.security.AdminGuard;
import com.megabuild.service.ProductService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminGuard adminGuard;
    private final UserRepository userRepository;
    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // =========================================================
    // KIỂM TRA QUYỀN ADMIN
    // =========================================================

    @GetMapping("/test")
    public ResponseEntity<?> testAdmin(
            @RequestParam Long userId
    ) {
        try {

            User admin = adminGuard.checkAdmin(userId);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Bạn có quyền ADMIN!",
                            "userId", admin.getId(),
                            "name", admin.getName(),
                            "role", admin.getRole()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(403).body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        }
    }


    // =========================================================
    // QUẢN LÝ NGƯỜI DÙNG
    // =========================================================

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam Long userId
    ) {
        try {

            // Kiểm tra người gọi có phải ADMIN không
            adminGuard.checkAdmin(userId);

            List<AdminUserResponse> users =
                    userRepository.findAll()
                            .stream()
                            .map(user -> new AdminUserResponse(
                                    user.getId(),
                                    user.getName(),
                                    user.getEmail(),
                                    user.getRole(),
                                    user.getStatus()
                            ))
                            .toList();

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "users", users
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(403).body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        }
    }


    // =========================================================
    // THÊM SẢN PHẨM
    // =========================================================

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(
            @RequestParam Long userId,
            @RequestBody ProductAdminRequest request
    ) {
        try {

            // Chỉ ADMIN mới được thêm sản phẩm
            adminGuard.checkAdmin(userId);

            Product product =
                    productService.createProduct(request);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Thêm sản phẩm thành công!",
                            "productId", product.getId()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        }
    }


    // =========================================================
    // SỬA SẢN PHẨM
    // =========================================================

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody ProductAdminRequest request
    ) {
        try {

            // Chỉ ADMIN mới được sửa sản phẩm
            adminGuard.checkAdmin(userId);

            Product product =
                    productService.updateProduct(id, request);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Cập nhật sản phẩm thành công!",
                            "productId", product.getId()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        }
    }


    // =========================================================
    // XÓA SẢN PHẨM
    // =========================================================

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        try {

            // Chỉ ADMIN mới được xóa sản phẩm
            adminGuard.checkAdmin(userId);

            productService.deleteProduct(id);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Xóa sản phẩm thành công!"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        }
    }

    // KHÓA / MỞ KHÓA TÀI KHOẢN
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam String status
    ) {
        try {
            User admin = adminGuard.checkAdmin(userId);

            User target = userRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Không tìm thấy người dùng!"));

            if (admin.getId().equals(target.getId())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Không thể tự khóa tài khoản Admin đang đăng nhập!"
                ));
            }

            if (!"ACTIVE".equalsIgnoreCase(status)
                    && !"INACTIVE".equalsIgnoreCase(status)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Trạng thái chỉ được là ACTIVE hoặc INACTIVE."
                ));
            }

            target.setStatus(status.toUpperCase());
            userRepository.save(target);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Cập nhật trạng thái thành công!",
                    "status", target.getStatus()
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "message", e.getMessage() == null
                            ? "Không thể cập nhật trạng thái."
                            : e.getMessage()
            ));
        }
    }

    // XÓA TÀI KHOẢN
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        try {
            User admin = adminGuard.checkAdmin(userId);

            if (admin.getId().equals(id)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Không thể tự xóa tài khoản Admin đang đăng nhập!"
                ));
            }

            User target = userRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Không tìm thấy người dùng!"));

            if ("ADMIN".equalsIgnoreCase(target.getRole())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Không hỗ trợ xóa tài khoản Admin bằng chức năng này."
                ));
            }

            // Không xóa cứng vì có thể ảnh hưởng lịch sử đơn hàng.
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Để giữ lịch sử mua hàng, hãy khóa tài khoản thay vì xóa cứng."
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "message", e.getMessage() == null
                            ? "Không thể xử lý tài khoản."
                            : e.getMessage()
            ));
        }
    }

    // =========================================================
// THỐNG KÊ DASHBOARD
// =========================================================


    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "30") int days
    ) {
        // Kiểm tra quyền riêng, không gộp lỗi database vào lỗi 403
        try {
            adminGuard.checkAdmin(userId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "message", e.getMessage() == null
                            ? "Bạn không có quyền ADMIN."
                            : e.getMessage()
            ));
        }

        try {
            if (days != 7 && days != 30 && days != 90) {
                days = 30;
            }

            LocalDate today = LocalDate.now();
            LocalDate startDate = today.minusDays(days - 1L);

            var allOrders = orderRepository.findAllByOrderByCreatedAtDesc();

            var filteredOrders = allOrders.stream()
                    .filter(order -> order.getCreatedAt() != null)
                    .filter(order -> {
                        LocalDate date = order.getCreatedAt().toLocalDate();
                        return !date.isBefore(startDate)
                                && !date.isAfter(today);
                    })
                    .toList();

            long totalOrders = allOrders.size();

            long completedOrders = allOrders.stream()
                    .filter(order -> "COMPLETED".equalsIgnoreCase(
                            order.getStatus()))
                    .count();

            long pendingOrders = allOrders.stream()
                    .filter(order -> "PENDING".equalsIgnoreCase(
                            order.getStatus()))
                    .count();

            long cancelledOrders = allOrders.stream()
                    .filter(order -> "CANCELLED".equalsIgnoreCase(
                            order.getStatus()))
                    .count();

            BigDecimal totalRevenue = allOrders.stream()
                    .filter(order -> "COMPLETED".equalsIgnoreCase(
                            order.getStatus()))
                    .map(order -> order.getTotalAmount() == null
                            ? BigDecimal.ZERO
                            : order.getTotalAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal periodRevenue = filteredOrders.stream()
                    .filter(order -> "COMPLETED".equalsIgnoreCase(
                            order.getStatus()))
                    .map(order -> order.getTotalAmount() == null
                            ? BigDecimal.ZERO
                            : order.getTotalAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Doanh thu theo ngày, bao gồm cả ngày không phát sinh đơn
            Map<String, BigDecimal> revenueByDate = new LinkedHashMap<>();

            for (int i = 0; i < days; i++) {
                String date = startDate.plusDays(i).toString();
                revenueByDate.put(date, BigDecimal.ZERO);
            }

            filteredOrders.stream()
                    .filter(order -> "COMPLETED".equalsIgnoreCase(
                            order.getStatus()))
                    .forEach(order -> {
                        String date = order.getCreatedAt()
                                .toLocalDate().toString();

                        BigDecimal amount = order.getTotalAmount() == null
                                ? BigDecimal.ZERO
                                : order.getTotalAmount();

                        revenueByDate.merge(date, amount, BigDecimal::add);
                    });

            // Đếm tài khoản có email khác nhau
            long totalCustomers = userRepository.findAll().stream()
                    .map(User::getEmail)
                    .filter(email -> email != null && !email.isBlank())
                    .map(email -> email.trim().toLowerCase(
                            java.util.Locale.ROOT))
                    .distinct()
                    .count();

            long totalProducts = productRepository.count();

            Map<String, Long> ordersByStatus = allOrders.stream()
                    .collect(Collectors.groupingBy(
                            order -> order.getStatus() == null
                                    ? "UNKNOWN"
                                    : order.getStatus().toUpperCase(
                                    java.util.Locale.ROOT),
                            LinkedHashMap::new,
                            Collectors.counting()
                    ));

            // Đơn hàng mới nhất
            var recentOrders = allOrders.stream()
                    .limit(5)
                    .map(order -> {
                        Map<String, Object> item = new LinkedHashMap<>();
                        item.put("id", order.getId());
                        item.put("customerName",
                                order.getCustomerName() == null
                                        ? "" : order.getCustomerName());
                        item.put("totalAmount",
                                order.getTotalAmount() == null
                                        ? BigDecimal.ZERO
                                        : order.getTotalAmount());
                        item.put("status",
                                order.getStatus() == null
                                        ? "UNKNOWN" : order.getStatus());
                        item.put("createdAt",
                                order.getCreatedAt() == null
                                        ? "" : order.getCreatedAt().toString());
                        return item;
                    })
                    .toList();

            Map<String, Object> summary = new LinkedHashMap<>();
            summary.put("totalRevenue", totalRevenue);
            summary.put("periodRevenue", periodRevenue);
            summary.put("totalOrders", totalOrders);
            summary.put("completedOrders", completedOrders);
            summary.put("pendingOrders", pendingOrders);
            summary.put("cancelledOrders", cancelledOrders);
            summary.put("totalCustomers", totalCustomers);
            summary.put("totalProducts", totalProducts);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("success", true);
            result.put("summary", summary);
            result.put("revenueByDate", revenueByDate);
            result.put("ordersByStatus", ordersByStatus);
            result.put("recentOrders", recentOrders);
            result.put("days", days);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Không thể tải thống kê. Vui lòng kiểm tra log backend."
            ));
        }
    }
}