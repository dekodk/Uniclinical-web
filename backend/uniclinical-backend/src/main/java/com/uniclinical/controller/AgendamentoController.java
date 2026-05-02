package com.uniclinical.controller;

import com.uniclinical.model.Agendamento;
import com.uniclinical.repository.AgendamentoRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoRepository repository;

    public AgendamentoController(AgendamentoRepository repository) {
        this.repository = repository;
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
    public Agendamento salvar(@RequestBody Agendamento agendamento) {
        if (agendamento.getSituacao() == null) {
            agendamento.setSituacao(true);
        }

        return repository.save(agendamento);
    }
}
