package com.teamenergy.billocr.repository;

import com.teamenergy.billocr.entity.BillEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillEventRepository extends JpaRepository<BillEvent, Long> {

    List<BillEvent> findByBillIdOrderByOccurredAtAsc(Long billId);
}
