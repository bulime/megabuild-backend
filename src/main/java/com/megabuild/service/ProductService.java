 package com.megabuild.service;

import com.megabuild.dto.ProductAdminRequest;
import com.megabuild.dto.ProductResponseDTO;
import com.megabuild.dto.ProductTranslationAIRequest;
import com.megabuild.dto.ProductTranslationAIResponse;
import com.megabuild.entity.Category;
import com.megabuild.entity.Product;
import com.megabuild.entity.ProductTranslation;
import com.megabuild.repository.CategoryRepository;
import com.megabuild.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductTranslationAIService translationAIService;

    // =========================================================
    // LẤY DANH SÁCH SẢN PHẨM
    // =========================================================

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProducts(
            String lang,
            String category,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String keyword) {

        String cleanCategory =
                category != null
                        && !category.isBlank()
                        && !category.equalsIgnoreCase("all")
                        ? category.trim()
                        : null;

        String cleanBrand =
                brand != null
                        && !brand.isBlank()
                        && !brand.equalsIgnoreCase("all")
                        ? brand.trim()
                        : null;

        String cleanKeyword =
                keyword != null && !keyword.isBlank()
                        ? keyword.trim()
                        : null;

        String cleanLang = normalizeLang(lang);

        List<Product> products = productRepository.searchProducts(
                cleanLang,
                cleanCategory,
                cleanBrand,
                minPrice,
                maxPrice,
                cleanKeyword
        );

        return products.stream()
                .map(product -> mapToDTO(product, cleanLang))
                .collect(Collectors.toList());
    }

    // =========================================================
    // LẤY CHI TIẾT SẢN PHẨM
    // =========================================================

    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id, String lang) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sản phẩm với ID: " + id
                        )
                );

        return mapToDTO(product, normalizeLang(lang));
    }

    // =========================================================
    // THÊM SẢN PHẨM
    // =========================================================

    @Transactional
    public Product createProduct(ProductAdminRequest request) {

        validateRequest(request);

        Category category = categoryRepository
                .findByCode(request.getCategory().trim())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy danh mục: "
                                        + request.getCategory()
                        )
                );

        ProductTranslation vietnamese =
                getVietnameseTranslation(request);

        // Dịch VI sang EN và ZH.
        List<ProductTranslation> translations =
                generateTranslations(vietnamese);

        // Bảo đảm danh sách chỉ có một bản dịch cho mỗi ngôn ngữ.
        translations = uniqueTranslations(translations);

        Product product = new Product();

        product.setCategory(category);
        product.setBrand(request.getBrand().trim());
        product.setPrice(request.getPrice());
        product.setUnitKey(request.getUnitKey().trim());

        product.setRating(
                request.getRating() != null
                        ? request.getRating()
                        : 0.0
        );

        product.setReviewsCount(
                request.getReviewsCount() != null
                        ? request.getReviewsCount()
                        : 0
        );

        product.setImageUrl(safe(request.getImageUrl()));

        product.setTranslations(new ArrayList<>());

        for (ProductTranslation translation : translations) {
            translation.setProduct(product);
            product.getTranslations().add(translation);
        }

        return productRepository.save(product);
    }

    // =========================================================
    // SỬA SẢN PHẨM
    // =========================================================

    @Transactional
    public Product updateProduct(
            Long id,
            ProductAdminRequest request) {

        validateRequest(request);

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sản phẩm với ID: " + id
                        )
                );

        Category category = categoryRepository
                .findByCode(request.getCategory().trim())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy danh mục: "
                                        + request.getCategory()
                        )
                );

        ProductTranslation vietnamese =
                getVietnameseTranslation(request);

        List<ProductTranslation> newTranslations =
                uniqueTranslations(generateTranslations(vietnamese));

        product.setCategory(category);
        product.setBrand(request.getBrand().trim());
        product.setPrice(request.getPrice());
        product.setUnitKey(request.getUnitKey().trim());
        product.setImageUrl(safe(request.getImageUrl()));

        if (request.getRating() != null) {
            product.setRating(request.getRating());
        }

        if (request.getReviewsCount() != null) {
            product.setReviewsCount(request.getReviewsCount());
        }

        /*
         * Cập nhật các bản dịch hiện có theo ngôn ngữ.
         * Không clear toàn bộ rồi insert lại, tránh xung đột
         * khóa unique (product_id, lang) khi Hibernate flush.
         */
        if (product.getTranslations() == null) {
            product.setTranslations(new ArrayList<>());
        }

        Map<String, ProductTranslation> existingByLang =
                new LinkedHashMap<>();

        for (ProductTranslation existing : product.getTranslations()) {
            String lang = normalizeLang(existing.getLang());

            if (!existingByLang.containsKey(lang)) {
                existingByLang.put(lang, existing);
            }
        }

        List<String> retainedLanguages = new ArrayList<>();

        for (ProductTranslation incoming : newTranslations) {
            String lang = normalizeLang(incoming.getLang());

            ProductTranslation existing = existingByLang.get(lang);

            if (existing != null) {
                // Cập nhật ngay bản ghi cũ.
                existing.setLang(lang);
                existing.setName(safe(incoming.getName()));
                existing.setSubCategory(
                        safe(incoming.getSubCategory())
                );
                existing.setDescription(
                        safe(incoming.getDescription())
                );

                retainedLanguages.add(lang);
            } else {
                // Chỉ thêm bản dịch khi ngôn ngữ đó chưa tồn tại.
                incoming.setLang(lang);
                incoming.setProduct(product);
                product.getTranslations().add(incoming);

                retainedLanguages.add(lang);
            }
        }

        /*
         * Xóa những ngôn ngữ không còn sử dụng.
         * Giữ lại bản dịch VI, EN và ZH vừa cập nhật.
         */
        product.getTranslations().removeIf(translation ->
                !retainedLanguages.contains(
                        normalizeLang(translation.getLang())
                )
        );

        return productRepository.save(product);
    }

    // =========================================================
    // TẠO BẢN DỊCH VI / EN / ZH
    // =========================================================

    private List<ProductTranslation> generateTranslations(
            ProductTranslation vietnamese) {

        ProductTranslationAIRequest aiRequest =
                new ProductTranslationAIRequest();

        aiRequest.setNameVi(vietnamese.getName());
        aiRequest.setSubCategoryVi(vietnamese.getSubCategory());
        aiRequest.setDescriptionVi(vietnamese.getDescription());

        ProductTranslationAIResponse aiResponse =
                translationAIService.translateProduct(aiRequest);

        if (aiResponse == null) {
            throw new RuntimeException(
                    "Không nhận được kết quả dịch sản phẩm!"
            );
        }

        List<ProductTranslation> result = new ArrayList<>();

        // Tiếng Việt.
        result.add(createTranslation(
                "vi",
                vietnamese.getName(),
                vietnamese.getSubCategory(),
                vietnamese.getDescription()
        ));

        // Tiếng Anh.
        result.add(createTranslation(
                "en",
                aiResponse.getNameEn(),
                aiResponse.getSubCategoryEn(),
                aiResponse.getDescriptionEn()
        ));

        // Tiếng Trung.
        result.add(createTranslation(
                "zh",
                aiResponse.getNameZh(),
                aiResponse.getSubCategoryZh(),
                aiResponse.getDescriptionZh()
        ));

        return result;
    }

    // =========================================================
    // LOẠI BỎ BẢN DỊCH TRÙNG NGÔN NGỮ
    // =========================================================

    private List<ProductTranslation> uniqueTranslations(
            List<ProductTranslation> translations) {

        Map<String, ProductTranslation> unique =
                new LinkedHashMap<>();

        for (ProductTranslation translation : translations) {
            String lang = normalizeLang(translation.getLang());

            if (unique.containsKey(lang)) {
                throw new RuntimeException(
                        "Phát hiện bản dịch trùng ngôn ngữ: " + lang
                );
            }

            translation.setLang(lang);
            unique.put(lang, translation);
        }

        return new ArrayList<>(unique.values());
    }

    // =========================================================
    // LẤY DỮ LIỆU TIẾNG VIỆT TỪ REQUEST
    // =========================================================

    private ProductTranslation getVietnameseTranslation(
            ProductAdminRequest request) {

        if (request.getTranslations() == null
                || request.getTranslations().isEmpty()) {

            throw new RuntimeException(
                    "Thiếu dữ liệu tên và mô tả để dịch sản phẩm!"
            );
        }

        ProductAdminRequest.TranslationRequest vietnamese =
                request.getTranslations()
                        .stream()
                        .filter(item ->
                                item.getLang() != null
                                        && item.getLang()
                                        .trim()
                                        .equalsIgnoreCase("vi")
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Thiếu dữ liệu nguồn tiếng Việt "
                                                + "để tự động dịch!"
                                )
                        );

        if (vietnamese.getName() == null
                || vietnamese.getName().isBlank()) {

            throw new RuntimeException(
                    "Tên sản phẩm không được để trống!"
            );
        }

        ProductTranslation translation = new ProductTranslation();

        translation.setLang("vi");
        translation.setName(vietnamese.getName().trim());
        translation.setSubCategory(
                safe(vietnamese.getSubCategory())
        );
        translation.setDescription(
                safe(vietnamese.getDescription())
        );

        return translation;
    }

    // =========================================================
    // TẠO PRODUCT TRANSLATION
    // =========================================================

    private ProductTranslation createTranslation(
            String lang,
            String name,
            String subCategory,
            String description) {

        ProductTranslation translation = new ProductTranslation();

        translation.setLang(normalizeLang(lang));
        translation.setName(safe(name));
        translation.setSubCategory(safe(subCategory));
        translation.setDescription(safe(description));

        return translation;
    }

    // =========================================================
    // KIỂM TRA REQUEST
    // =========================================================

    private void validateRequest(ProductAdminRequest request) {

        if (request == null) {
            throw new RuntimeException(
                    "Dữ liệu sản phẩm không được để trống!"
            );
        }

        if (request.getCategory() == null
                || request.getCategory().isBlank()) {
            throw new RuntimeException(
                    "Vui lòng chọn danh mục sản phẩm!"
            );
        }

        if (request.getBrand() == null
                || request.getBrand().isBlank()) {
            throw new RuntimeException(
                    "Vui lòng nhập thương hiệu!"
            );
        }

        if (request.getPrice() == null
                || request.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException(
                    "Giá sản phẩm không hợp lệ!"
            );
        }

        if (request.getUnitKey() == null
                || request.getUnitKey().isBlank()) {
            throw new RuntimeException(
                    "Vui lòng nhập đơn vị sản phẩm!"
            );
        }

        if (request.getImageUrl() == null
                || request.getImageUrl().isBlank()) {
            throw new RuntimeException(
                    "Vui lòng nhập URL hình ảnh sản phẩm!"
            );
        }
    }

    // =========================================================
    // CHUẨN HÓA NGÔN NGỮ
    // =========================================================

    private String normalizeLang(String lang) {

        if (lang == null || lang.isBlank()) {
            return "vi";
        }

        String normalized = lang.trim().toLowerCase(Locale.ROOT);

        if (normalized.equals("zh-cn")
                || normalized.equals("zh-tw")
                || normalized.equals("zh-hans")
                || normalized.equals("zh-hant")) {
            return "zh";
        }

        if (normalized.equals("vi")
                || normalized.equals("en")
                || normalized.equals("zh")) {
            return normalized;
        }

        return normalized;
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    // =========================================================
    // XÓA SẢN PHẨM
    // =========================================================

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sản phẩm với ID: " + id
                        )
                );

        product.setActive(false);
        productRepository.save(product);
    }
    // =========================================================
    // ENTITY -> DTO
    // =========================================================

    private ProductResponseDTO mapToDTO(
            Product product,
            String lang) {

        String cleanLang = normalizeLang(lang);

        List<ProductTranslation> translations =
                product.getTranslations() != null
                        ? product.getTranslations()
                        : new ArrayList<>();

        ProductTranslation translation =
                translations.stream()
                        .filter(t ->
                                t.getLang() != null
                                        && normalizeLang(t.getLang())
                                        .equals(cleanLang)
                        )
                        .findFirst()
                        .orElseGet(() ->
                                translations.stream()
                                        .filter(t ->
                                                "vi".equals(
                                                        normalizeLang(
                                                                t.getLang()
                                                        )
                                                )
                                        )
                                        .findFirst()
                                        .orElse(
                                                translations.stream()
                                                        .findFirst()
                                                        .orElse(null)
                                        )
                        );

        return ProductResponseDTO.builder()
                .id(product.getId())
                .category(product.getCategory().getCode())
                .subCategory(
                        translation != null
                                ? safe(translation.getSubCategory())
                                : ""
                )
                .brand(product.getBrand())
                .price(product.getPrice())
                .unitKey(product.getUnitKey())
                .rating(product.getRating())
                .reviewsCount(product.getReviewsCount())
                .image(product.getImageUrl())
                .name(
                        translation != null
                                ? safe(translation.getName())
                                : ""
                )
                .description(
                        translation != null
                                ? safe(translation.getDescription())
                                : ""
                )
                .build();
    }
}
