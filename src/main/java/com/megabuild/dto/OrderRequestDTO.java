package com.megabuild.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {

    private String customerName;
    private String customerEmail;
    private String phone;
    private String address;
    private String notes;
    private List<CartItemDTO> items;

    @Data
    public static class CartItemDTO {
        private Long productId;
        private Integer quantity;
    }
}
