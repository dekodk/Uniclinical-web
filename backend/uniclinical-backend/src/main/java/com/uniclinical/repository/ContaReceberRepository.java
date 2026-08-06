package com.uniclinical.repository;

import com.uniclinical.model.ContaReceber;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContaReceberRepository extends JpaRepository<ContaReceber, Integer> {

    List<ContaReceber> findByIdCliente(Integer idCliente);

    List<ContaReceber> findByIdAgendamento(Integer idAgendamento);
}
