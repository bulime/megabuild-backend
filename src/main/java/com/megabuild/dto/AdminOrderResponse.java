package com.megabuild.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class AdminOrderResponse {

    private Long id;

    private String customerName;

    private String phone;

    private String address;

    private String notes;

    private BigDecimal totalAmount;

    private String status;

    private LocalDateTime createdAt;

    private List<ItemResponse> items;


    @Getter
    @Builder
    public static class ItemResponse {

        private Long productId;

        private String productName;

        private String image;

        private Integer quantity;

        private BigDecimal unitPrice;

        private BigDecimal totalPrice;
    }
}