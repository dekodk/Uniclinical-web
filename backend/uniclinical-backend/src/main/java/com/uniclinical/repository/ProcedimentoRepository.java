package com.uniclinical.repository;

import com.uniclinical.model.Procedimento;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedimentoRepository extends JpaRepository<Procedimento, Integer> {
    List<Procedimento> findByAtivoTrue();
    List<Procedimento> findByNomeProcedimentoContainingIgnoreCaseAndAtivoTrue(String nome);
}
