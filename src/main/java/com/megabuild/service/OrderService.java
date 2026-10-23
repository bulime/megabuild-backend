
package com.megabuild.service;

import com.megabuild.dto.AdminOrderResponse;
import com.megabuild.dto.OrderRequestDTO;
import com.megabuild.entity.Order;
import com.megabuild.entity.OrderItem;
import com.megabuild.entity.Product;
import com.megabuild.entity.ProductTranslation;
import com.megabuild.repository.OrderRepository;
import com.megabuild.repository.ProductRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    // =========================================================
    // TẠO ĐƠN HÀNG
    // =========================================================

    @Transactional
    public Long createOrder(OrderRequestDTO request) {

        if (request == null) {
            throw new RuntimeException("Thông tin đặt hàng không hợp lệ!");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng không được để trống!");
        }

        String customerEmail = request.getCustomerEmail();

        if (customerEmail == null || customerEmail.isBlank()) {
            throw new RuntimeException(
                    "Email khách hàng đang bị thiếu. Vui lòng đăng nhập lại hoặc nhập email!"
            );
        }

        customerEmail = customerEmail.trim();

        if (!customerEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new RuntimeException("Email khách hàng không hợp lệ!");
        }

        Order order = new Order();

        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(customerEmail);
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setNotes(request.getNotes());
        order.setStatus("PENDING");

        BigDecimal totalOrderAmount = BigDecimal.ZERO;

        for (OrderRequestDTO.CartItemDTO itemDTO : request.getItems()) {

            if (itemDTO.getProductId() == null) {
                throw new RuntimeException("Product ID không được để trống!");
            }

            if (itemDTO.getQuantity() == null || itemDTO.getQuantity() <= 0) {
                throw new RuntimeException(
                        "Số lượng sản phẩm phải lớn hơn 0!"
                );
            }

            Product product = productRepository
                    .findById(itemDTO.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Không tìm thấy sản phẩm với ID: "
                                            + itemDTO.getProductId()
                            )
                    );

            OrderItem item = new OrderItem();

            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(product.getPrice());

            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemDTO.getQuantity()));

            item.setTotalPrice(itemTotal);

            order.getItems().add(item);
            totalOrderAmount = totalOrderAmount.add(itemTotal);
        }

        order.setTotalAmount(totalOrderAmount);

        Order savedOrder = orderRepository.saveAndFlush(order);

        // Gửi email thông báo đơn hàng mới.
        // Nếu gửi email thất bại, đơn hàng đã lưu vẫn được giữ lại.
        sendPendingOrderEmail(savedOrder);

        return savedOrder.getId();
    }

    // =========================================================
    // GỬI EMAIL ĐƠN HÀNG MỚI - PENDING
    // =========================================================

    private void sendPendingOrderEmail(Order order) {
        String subject = "MegaBuild - Xác nhận đã nhận đơn hàng #"
                + order.getId();

        String body = """
                Xin chào %s,

                MegaBuild đã nhận được đơn hàng #%s của bạn.

                Tổng tiền: %s
                Trạng thái: Đang chờ xác nhận (PENDING)

                Chúng tôi sẽ thông báo cho bạn khi đơn hàng được xác nhận.

                Cảm ơn bạn đã mua hàng tại MegaBuild!
                """.formatted(
                safeText(order.getCustomerName()),
                order.getId(),
                order.getTotalAmount()
        );

        try {
            sendEmail(order.getCustomerEmail(), subject, body);
            System.out.println(
                    "Đã gửi email đơn hàng mới #" + order.getId()
            );
        } catch (Exception e) {
            System.err.println(
                    "Không gửi được email chờ xác nhận cho đơn hàng #"
                            + order.getId() + ": " + e.getMessage()
            );
        }
    }

    // =========================================================
    // GỬI EMAIL KHI ĐƠN ĐƯỢC XÁC NHẬN
    // =========================================================

    private void sendConfirmedOrderEmail(Order order) {
        String subject = "MegaBuild - Đơn hàng #" + order.getId()
                + " đã được xác nhận";

        String body = """
                Xin chào %s,

                Đơn hàng #%s của bạn đã được MegaBuild xác nhận.

                Tổng tiền: %s
                Trạng thái: Đã xác nhận (CONFIRMED)

                Cảm ơn bạn đã mua hàng tại MegaBuild!
                """.formatted(
                safeText(order.getCustomerName()),
                order.getId(),
                order.getTotalAmount()
        );

        try {
            sendEmail(order.getCustomerEmail(), subject, body);
            System.out.println(
                    "Đã gửi email xác nhận đơn hàng #" + order.getId()
            );
        } catch (Exception e) {
            System.err.println(
                    "Không gửi được email xác nhận đơn hàng #"
                            + order.getId() + ": " + e.getMessage()
            );
        }
    }

    // =========================================================
    // HÀM GỬI EMAIL DÙNG CHUNG
    // =========================================================

    private void sendEmail(
            String recipient,
            String subject,
            String body
    ) throws MessagingException {

        if (recipient == null || recipient.isBlank()) {
            throw new IllegalStateException(
                    "Đơn hàng chưa có email khách hàng."
            );
        }

        if (mailUsername == null || mailUsername.isBlank()) {
            throw new IllegalStateException(
                    "Chưa cấu hình spring.mail.username."
            );
        }

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(
                message,
                false,
                "UTF-8"
        );

        helper.setFrom(mailUsername);
        helper.setTo(recipient.trim());
        helper.setSubject(subject);
        helper.setText(body, false);

        mailSender.send(message);
    }

    private String safeText(String value) {
        return value == null || value.isBlank()
                ? "Khách hàng"
                : value.trim();
    }

    // =========================================================
    // LẤY TẤT CẢ ĐƠN HÀNG CHO ADMIN
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getAllOrders() {
        return orderRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapAdminOrder)
                .toList();
    }

    // =========================================================
    // LẤY CHI TIẾT MỘT ĐƠN HÀNG
    // =========================================================

    @Transactional(readOnly = true)
    public AdminOrderResponse getOrderById(Long id) {
        Order order = orderRepository
                .findWithItemsById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy đơn hàng với ID: " + id
                        )
                );

        return mapAdminOrder(order);
    }

    // =========================================================
    // ĐỔI TRẠNG THÁI ĐƠN HÀNG
    // =========================================================

    @Transactional
    public AdminOrderResponse updateOrderStatus(
            Long id,
            String status
    ) {

        if (status == null || status.isBlank()) {
            throw new RuntimeException(
                    "Trạng thái không được để trống!"
            );
        }

        String cleanStatus = status.trim().toUpperCase(Locale.ROOT);

        List<String> allowedStatuses = List.of(
                "PENDING",
                "CONFIRMED",
                "SHIPPING",
                "COMPLETED",
                "CANCELLED"
        );

        if (!allowedStatuses.contains(cleanStatus)) {
            throw new RuntimeException(
                    "Trạng thái không hợp lệ: " + status
            );
        }

        Order order = orderRepository
                .findWithItemsById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy đơn hàng với ID: " + id
                        )
                );

        String oldStatus = order.getStatus();

        order.setStatus(cleanStatus);

        Order savedOrder = orderRepository.saveAndFlush(order);

        // Chỉ gửi email khi chuyển từ PENDING sang CONFIRMED.
        if ("PENDING".equalsIgnoreCase(oldStatus)
                && "CONFIRMED".equals(cleanStatus)) {
            sendConfirmedOrderEmail(savedOrder);
        }

        return mapAdminOrder(savedOrder);
    }

    // =========================================================
    // MAP ORDER -> ADMIN DTO
    // =========================================================

    private AdminOrderResponse mapAdminOrder(Order order) {

        List<AdminOrderResponse.ItemResponse> items =
                order.getItems()
                        .stream()
                        .map(this::mapOrderItem)
                        .toList();

        return AdminOrderResponse.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .notes(order.getNotes())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }

    // =========================================================
    // MAP ORDER ITEM
    // =========================================================

    private AdminOrderResponse.ItemResponse mapOrderItem(
            OrderItem item
    ) {

        Product product = item.getProduct();

        String productName = "";

        if (product.getTranslations() != null
                && !product.getTranslations().isEmpty()) {

            ProductTranslation translation =
                    product.getTranslations()
                            .stream()
                            .filter(t ->
                                    "vi".equalsIgnoreCase(t.getLang())
                            )
                            .findFirst()
                            .orElse(product.getTranslations().get(0));

            productName = translation.getName();
        }

        return AdminOrderResponse.ItemResponse.builder()
                .productId(product.getId())
                .productName(productName)
                .image(product.getImageUrl())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }

    // =========================================================
    // LẤY ĐƠN HÀNG THEO EMAIL KHÁCH HÀNG
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getOrdersByCustomerEmail(
            String email
    ) {

        if (email == null || email.isBlank()) {
            throw new RuntimeException(
                    "Email khách hàng không được để trống!"
            );
        }

        return orderRepository
                .findByCustomerEmailOrderByCreatedAtDesc(email.trim())
                .stream()
                .map(this::mapAdminOrder)
                .toList();
    }
}
