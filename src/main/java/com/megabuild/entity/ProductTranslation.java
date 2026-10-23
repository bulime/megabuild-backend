package com.megabuild.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(name = "product_translations")
@Getter @Setter
public class ProductTranslation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(nullable = false, length = 5)
    private String lang;
    @Column(nullable = false, length = 255)
    private String name;
    @Column(name = "sub_category", nullable = false, length = 150)
    private String subCategory;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
}