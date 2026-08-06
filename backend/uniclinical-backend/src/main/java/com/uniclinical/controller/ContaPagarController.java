package com.uniclinical.controller;

import com.uniclinical.model.ContaPagar;
import com.uniclinical.repository.ContaPagarRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/contas-pagar")
public class ContaPagarController {

    private final ContaPagarRepository repository;

    public ContaPagarController(ContaPagarRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ContaPagar> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContaPagar> buscarPorId(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/emissao")
    public List<ContaPagar> buscarPorDataEmissao(
            @RequestParam String inicio,
            @RequestParam String fim
    ) {
        return repository.findByDataEmissaoBetween(LocalDate.parse(inicio), LocalDate.parse(fim));
    }

    @GetMapping("/lancamento")
    public List<ContaPagar> buscarPorDataLancamento(
            @RequestParam String inicio,
            @RequestParam String fim
    ) {
        return repository.findByDataLancamentoBetween(LocalDate.parse(inicio), LocalDate.parse(fim));
    }

    @GetMapping("/vencimento")
    public List<ContaPagar> buscarPorDataVencimento(
            @RequestParam String inicio,
            @RequestParam String fim
    ) {
        return repository.findByDataVencimentoBetween(LocalDate.parse(inicio), LocalDate.parse(fim));
    }

    @PostMapping
    public ContaPagar salvar(@RequestBody ContaPagar contaPagar) {
        return repository.save(contaPagar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContaPagar> atualizar(@PathVariable Integer id, @RequestBody ContaPagar contaPagar) {
        return repository.findById(id)
                .map(contaExistente -> {
                    contaExistente.setSituacao(contaPagar.getSituacao());
                    contaExistente.setFornecedor(contaPagar.getFornecedor());
                    contaExistente.setSerie(contaPagar.getSerie());
                    contaExistente.setNumeroNf(contaPagar.getNumeroNf());
                    contaExistente.setChaveNf(contaPagar.getChaveNf());
                    contaExistente.setValor(contaPagar.getValor());
                    contaExistente.setJuros(contaPagar.getJuros());
                    contaExistente.setValorTotal(contaPagar.getValorTotal());
                    contaExistente.setDataEmissao(contaPagar.getDataEmissao());
                    contaExistente.setDataLancamento(contaPagar.getDataLancamento());
                    contaExistente.setDataVencimento(contaPagar.getDataVencimento());
                    contaExistente.setDataPagamento(contaPagar.getDataPagamento());
                    contaExistente.setObservacao(contaPagar.getObservacao());

                    return ResponseEntity.ok(repository.save(contaExistente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
