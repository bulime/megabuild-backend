package com.megabuild.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.megabuild.dto.ProductTranslationAIRequest;
import com.megabuild.dto.ProductTranslationAIResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class ProductTranslationAIService {

    @Value("${libretranslate.url:http://127.0.0.1:5000}")
    private String libreTranslateUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient =
            HttpClient.newHttpClient();

    public ProductTranslationAIResponse translateProduct(
            ProductTranslationAIRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Dữ liệu sản phẩm không được để trống!"
            );
        }

        String nameVi = safe(request.getNameVi());
        String subCategoryVi = safe(request.getSubCategoryVi());
        String descriptionVi = safe(request.getDescriptionVi());

        if (nameVi.isBlank()) {
            throw new RuntimeException(
                    "Tên sản phẩm tiếng Việt không được để trống!"
            );
        }

        String nameEn =
                translate(nameVi, "vi", "en");

        String subCategoryEn =
                translate(subCategoryVi, "vi", "en");

        String descriptionEn =
                translate(descriptionVi, "vi", "en");

        String nameZh =
                translate(nameVi, "vi", "zh-Hans");

        String subCategoryZh =
                translate(subCategoryVi, "vi", "zh-Hans");

        String descriptionZh =
                translate(descriptionVi, "vi", "zh-Hans");

        ProductTranslationAIResponse response =
                new ProductTranslationAIResponse();

        response.setNameEn(nameEn);
        response.setSubCategoryEn(subCategoryEn);
        response.setDescriptionEn(descriptionEn);

        response.setNameZh(nameZh);
        response.setSubCategoryZh(subCategoryZh);
        response.setDescriptionZh(descriptionZh);

        return response;
    }

    private String translate(
            String text,
            String source,
            String target
    ) {

        if (text == null || text.isBlank()) {
            return "";
        }

        try {

            String json =
                    objectMapper.writeValueAsString(
                            new TranslateRequest(
                                    text,
                                    source,
                                    target
                            )
                    );

            HttpRequest httpRequest =
                    HttpRequest.newBuilder()
                            .uri(
                                    URI.create(
                                            libreTranslateUrl
                                                    + "/translate"
                                    )
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(json)
                            )
                            .build();

            HttpResponse<String> httpResponse =
                    httpClient.send(
                            httpRequest,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (httpResponse.statusCode() != 200) {

                throw new RuntimeException(
                        "LibreTranslate trả về HTTP "
                                + httpResponse.statusCode()
                                + ": "
                                + httpResponse.body()
                );
            }

            JsonNode jsonNode =
                    objectMapper.readTree(
                            httpResponse.body()
                    );

            JsonNode translatedText =
                    jsonNode.get("translatedText");

            if (translatedText == null) {

                throw new RuntimeException(
                        "LibreTranslate không trả về translatedText!"
                );
            }

            return translatedText.asText();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Không thể kết nối LibreTranslate: "
                            + e.getMessage(),
                    e
            );
        }
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    private record TranslateRequest(
            String q,
            String source,
            String target
    ) {
    }
}