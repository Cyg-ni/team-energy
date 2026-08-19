package com.teamenergy.billocr.repository;

import com.teamenergy.billocr.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
