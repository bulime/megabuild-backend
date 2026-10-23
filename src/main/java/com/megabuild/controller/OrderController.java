package com.megabuild.controller;

import com.megabuild.dto.OrderRequestDTO;
import com.megabuild.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Tạo đơn hàng
    @PostMapping
    public ResponseEntity<?> placeOrder(
            @RequestBody OrderRequestDTO request
    ) {
        Long orderId = orderService.createOrder(request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đặt hàng thành công!",
                "orderId", orderId
        ));
    }

    // Lấy đơn hàng theo email tài khoản
    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "orders", orderService.getOrdersByCustomerEmail(email)
                )
        );
    }
}
