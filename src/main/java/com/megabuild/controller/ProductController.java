
package com.megabuild.controller;

import com.megabuild.dto.ProductResponseDTO;
import com.megabuild.entity.Product;
import com.megabuild.repository.ProductRepository;
import com.megabuild.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts(
            @RequestParam(defaultValue = "vi") String lang,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String q) {

        List<ProductResponseDTO> list = productService.getProducts(
                lang, category, brand, minPrice, maxPrice, q
        );

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(
            @PathVariable Long id,
            @RequestParam(defaultValue = "vi") String lang) {

        boolean active = productRepository.findById(id)
                .filter(Product::isActive)
                .isPresent();

        if (!active) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                productService.getProductById(id, lang)
        );
    }
}
