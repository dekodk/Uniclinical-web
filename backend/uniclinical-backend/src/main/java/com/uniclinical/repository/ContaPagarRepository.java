package com.uniclinical.repository;

import com.uniclinical.model.ContaPagar;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContaPagarRepository extends JpaRepository<ContaPagar, Integer> {

    List<ContaPagar> findByDataEmissaoBetween(LocalDate dataInicial, LocalDate dataFinal);

    List<ContaPagar> findByDataLancamentoBetween(LocalDate dataInicial, LocalDate dataFinal);

    List<ContaPagar> findByDataVencimentoBetween(LocalDate dataInicial, LocalDate dataFinal);
}
