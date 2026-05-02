package com.uniclinical.repository;

import com.uniclinical.model.Agendamento;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {

    List<Agendamento> findByDataAgendamentoOrderByHoraAgendamentoAsc(LocalDate dataAgendamento);

}
