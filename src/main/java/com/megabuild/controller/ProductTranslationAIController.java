package com.megabuild.controller;

import com.megabuild.dto.ProductTranslationAIRequest;
import com.megabuild.dto.ProductTranslationAIResponse;
import com.megabuild.service.ProductTranslationAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/admin/ai", "/api/ai"})
@RequiredArgsConstructor
public class ProductTranslationAIController {

    private final ProductTranslationAIService translationService;

    @PostMapping("/translate-product")
    public ResponseEntity<?> translateProduct(
            @RequestBody ProductTranslationAIRequest request
    ) {

        try {

            ProductTranslationAIResponse response =
                    translationService.translateProduct(request);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Dịch sản phẩm thành công!",
                            "translation",
                            response
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}