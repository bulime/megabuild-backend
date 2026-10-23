package com.megabuild.repository;
import com.megabuild.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p " +
            "JOIN p.translations pt " +
            "JOIN p.category c " +
            "WHERE p.isActive = true " +
            "AND pt.lang = :lang " +
            "AND (:category IS NULL OR c.code = :category) " +
            "AND (:brand IS NULL OR p.brand = :brand) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (:keyword IS NULL OR LOWER(pt.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(pt.subCategory) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProducts(
            @Param("lang") String lang,
            @Param("category") String category,
            @Param("brand") String brand,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword);
}