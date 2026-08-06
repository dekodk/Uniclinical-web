package com.uniclinical.controller;

import com.uniclinical.model.Agendamento;
import com.uniclinical.model.ContaReceber;
import com.uniclinical.repository.AgendamentoRepository;
import com.uniclinical.repository.ContaReceberRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoRepository repository;
    private final ContaReceberRepository contaReceberRepository;

    public AgendamentoController(AgendamentoRepository repository, ContaReceberRepository contaReceberRepository) {
        this.repository = repository;
        this.contaReceberRepository = contaReceberRepository;
    }

    @GetMapping
    public List<Agendamento> listarTodos() {
        return repository.findAll();
    }

    @GetMapping("/data/{data}")
    public List<Agendamento> listarPorData(@PathVariable String data) {
        LocalDate dataConvertida = LocalDate.parse(data);
        return repository.findByDataAgendamentoOrderByHoraAgendamentoAsc(dataConvertida);
    }

    @PostMapping
    @Transactional
    public Agendamento salvar(@RequestBody Agendamento agendamento) {
        if (agendamento.getSituacao() == null) {
            agendamento.setSituacao(true);
        }

        Agendamento agendamentoSalvo = repository.save(agendamento);
        criarContaReceber(agendamentoSalvo);

        return agendamentoSalvo;
    }

    @PutMapping("/{id}")
    public Agendamento atualizar(@PathVariable Integer id, @RequestBody Agendamento agendamento) {
        agendamento.setIdAgendamento(id);
        agendamento.setUltimaAtt(LocalDateTime.now());

        if (agendamento.getSituacao() == null) {
            agendamento.setSituacao(true);
        }

        return repository.save(agendamento);
    }

    private void criarContaReceber(Agendamento agendamento) {
        ContaReceber contaReceber = new ContaReceber();

        contaReceber.setIdAgendamento(agendamento.getIdAgendamento());
        contaReceber.setIdCliente(agendamento.getIdCliente());
        contaReceber.setValorBase(agendamento.getValorProcedimento());
        contaReceber.setDescontoAcrescimo(agendamento.getValorAdicional());
        contaReceber.setValorFinal(definirValorFinal(agendamento));
        contaReceber.setDataPrevista(agendamento.getDataAgendamento());
        contaReceber.setStatus("ABERTO");
        contaReceber.setOrigem("AUTOMATICA");

        contaReceberRepository.save(contaReceber);
    }

    private BigDecimal definirValorFinal(Agendamento agendamento) {
        if (agendamento.getValorTotal() != null) {
            return agendamento.getValorTotal();
        }

        BigDecimal valorProcedimento = agendamento.getValorProcedimento() == null
                ? BigDecimal.ZERO
                : agendamento.getValorProcedimento();
        BigDecimal valorAdicional = agendamento.getValorAdicional() == null
                ? BigDecimal.ZERO
                : agendamento.getValorAdicional();

        return valorProcedimento.add(valorAdicional);
    }
}
