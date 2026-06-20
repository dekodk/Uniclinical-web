package com.uniclinical.repository;

import com.uniclinical.model.Email;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailRepository extends JpaRepository<Email, Integer> {

    List<Email> findByIdCliente(Integer idCliente);
    
}
