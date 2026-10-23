package com.megabuild.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductAdminRequest {

    private Long id;

    private String category;

    private String brand;

    private BigDecimal price;

    private String unitKey;

    private Double rating;

    private Integer reviewsCount;

    private String imageUrl;

    private List<TranslationRequest> translations;

    @Getter
    @Setter
    public static class TranslationRequest {

        private String lang;

        private String name;

        private String subCategory;

        private String description;
    }
}