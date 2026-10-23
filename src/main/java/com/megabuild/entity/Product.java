package com.megabuild.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;
import jakarta.persistence.Column;
@Entity
@Table(name = "products")
@Getter @Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Column(nullable = false, length = 100)
    private String brand;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;
    @Column(name = "unit_key", nullable = false, length = 50)
    private String unitKey;
    private Double rating;
    @Column(name = "reviews_count")
    private Integer reviewsCount;
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<ProductTranslation> translations;
}