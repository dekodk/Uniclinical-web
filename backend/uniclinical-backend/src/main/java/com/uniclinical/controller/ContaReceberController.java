package com.uniclinical.controller;

import com.uniclinical.model.ContaReceber;
import com.uniclinical.repository.ContaReceberRepository;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
})
@RestController
@RequestMapping("/contas-receber")
public class ContaReceberController {

    private final ContaReceberRepository repository;

    public ContaReceberController(ContaReceberRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ContaReceber> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContaReceber> buscarPorId(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{idCliente}")
    public List<ContaReceber> buscarPorCliente(@PathVariable Integer idCliente) {
        return repository.findByIdCliente(idCliente);
    }

    @GetMapping("/agendamento/{idAgendamento}")
    public List<ContaReceber> buscarPorAgendamento(@PathVariable Integer idAgendamento) {
        return repository.findByIdAgendamento(idAgendamento);
    }

    @PostMapping
    public ContaReceber salvar(@RequestBody ContaReceber contaReceber) {
        return repository.save(contaReceber);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContaReceber> atualizar(@PathVariable Integer id, @RequestBody ContaReceber contaReceber) {
        return repository.findById(id)
                .map(contaExistente -> {
                    contaExistente.setIdAgendamento(contaReceber.getIdAgendamento());
                    contaExistente.setIdCliente(contaReceber.getIdCliente());
                    contaExistente.setValorBase(contaReceber.getValorBase());
                    contaExistente.setDescontoAcrescimo(contaReceber.getDescontoAcrescimo());
                    contaExistente.setJuros(contaReceber.getJuros());
                    contaExistente.setValorFinal(contaReceber.getValorFinal());
                    contaExistente.setDataPrevista(contaReceber.getDataPrevista());
                    contaExistente.setDataPagamento(contaReceber.getDataPagamento());
                    contaExistente.setFormaPagamento(contaReceber.getFormaPagamento());
                    contaExistente.setStatus(contaReceber.getStatus());
                    contaExistente.setObservacao(contaReceber.getObservacao());
                    contaExistente.setOrigem(contaReceber.getOrigem());

                    return ResponseEntity.ok(repository.save(contaExistente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
