package com.megabuild.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
@Data
@Builder
public class ProductResponseDTO {
    private Long id;
    private String category;
    private String subCategory;
    private String brand;
    private BigDecimal price;
    private String unitKey;
    private Double rating;
    private Integer reviewsCount;
    private String image;
    private String name;
    private String description;
}