
package com.megabuild.repository;

import com.megabuild.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Lấy tất cả đơn hàng, tải items và product trước.
    // Không fetch translations đồng thời để tránh MultipleBagFetchException.
    @EntityGraph(attributePaths = {
            "items",
            "items.product"
    })
    List<Order> findAllByOrderByCreatedAtDesc();

    // Lấy chi tiết một đơn hàng.
    @EntityGraph(attributePaths = {
            "items",
            "items.product"
    })
    Optional<Order> findWithItemsById(Long id);

    // Lấy đơn hàng của khách theo email, mới nhất trước.
    @EntityGraph(attributePaths = {
            "items",
            "items.product"
    })
    List<Order> findByCustomerEmailOrderByCreatedAtDesc(String email);
}