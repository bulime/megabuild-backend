
package com.megabuild.controller;

import com.megabuild.dto.AdminOrderResponse;
import com.megabuild.security.AdminGuard;
import com.megabuild.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminGuard adminGuard;
    private final OrderService orderService;
    private final JdbcTemplate jdbcTemplate;

    // Lấy danh sách đơn hàng
    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestParam Long userId
    ) {
        try {
            adminGuard.checkAdmin(userId);

            List<AdminOrderResponse> orders =
                    orderService.getAllOrders();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "orders", orders
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "message", messageOf(e)
            ));
        }
    }

    // Lấy chi tiết đơn hàng
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        try {
            adminGuard.checkAdmin(userId);

            AdminOrderResponse order =
                    orderService.getOrderById(id);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "order", order
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "message", messageOf(e)
            ));
        }
    }

    // Cập nhật trạng thái đơn hàng
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam String status
    ) {
        try {
            adminGuard.checkAdmin(userId);

            AdminOrderResponse order =
                    orderService.updateOrderStatus(id, status);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Cập nhật trạng thái thành công!",
                    "order", order
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", messageOf(e)
            ));
        }
    }

    // Reset doanh thu: chỉ lưu mốc thời gian, không xóa đơn hàng
    @PostMapping("/reset-revenue")
    public ResponseEntity<?> resetRevenue(
            @RequestParam Long userId
    ) {
        try {
            adminGuard.checkAdmin(userId);

            // Tạo bảng lưu mốc reset nếu chưa tồn tại.
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS revenue_reset (
                    id BIGINT PRIMARY KEY,
                    reset_at DATETIME NOT NULL
                )
                """);

            LocalDateTime resetAt = LocalDateTime.now();

            // Ghi đè mốc reset gần nhất.
            jdbcTemplate.update("""
                INSERT INTO revenue_reset (id, reset_at)
                VALUES (1, ?)
                ON DUPLICATE KEY UPDATE reset_at = VALUES(reset_at)
                """, Timestamp.valueOf(resetAt));

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã đặt lại mốc thống kê doanh thu.",
                    "resetAt", resetAt.toString()
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", messageOf(e)
            ));
        }
    }

    // Đọc mốc reset để trang thống kê biết cần tính doanh thu từ khi nào
    @GetMapping("/reset-revenue/time")
    public ResponseEntity<?> getRevenueResetTime(
            @RequestParam Long userId
    ) {
        try {
            adminGuard.checkAdmin(userId);

            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS revenue_reset (
                    id BIGINT PRIMARY KEY,
                    reset_at DATETIME NOT NULL
                )
                """);

            List<Timestamp> results = jdbcTemplate.query(
                    "SELECT reset_at FROM revenue_reset WHERE id = 1",
                    (rs, rowNum) -> rs.getTimestamp("reset_at")
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "resetAt", results.isEmpty()
                            ? ""
                            : results.get(0).toLocalDateTime().toString()
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", messageOf(e)
            ));
        }
    }

    private String messageOf(RuntimeException e) {
        return e.getMessage() == null
                ? "Đã xảy ra lỗi khi xử lý yêu cầu."
                : e.getMessage();
    }
}
