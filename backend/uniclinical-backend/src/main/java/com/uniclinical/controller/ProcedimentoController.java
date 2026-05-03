package com.uniclinical.controller;

import com.uniclinical.model.Procedimento;
import com.uniclinical.repository.ProcedimentoRepository;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/procedimentos")
public class ProcedimentoController {
    
    private final ProcedimentoRepository repository;
    public ProcedimentoController(ProcedimentoRepository repository) {
        this.repository = repository;
    }
    @GetMapping
    public List<Procedimento> listar() {
        return repository.findByAtivoTrue();
    }
    @PostMapping
    public Procedimento salvar(@Valid @RequestBody Procedimento p){
        if (p.getAtivo() == null) {
            p.setAtivo(true);
        }
        return repository.save(p);
    }
    @PutMapping("/{id}")
    public Procedimento atualizar(@PathVariable Integer id, @RequestBody Procedimento p) {
        p.setIdProcedimento(id);
        return repository.save(p);
    }
    @DeleteMapping("/{id}")
    public void inativar(@PathVariable Integer id) {
        Procedimento p = repository.findById(id).orElseThrow();
        p.setAtivo(false);
        repository.save(p);
    }
    @GetMapping("/buscar")
    public List<Procedimento> buscar(@RequestParam String nome) {
        return repository.findByNomeProcedimentoContainingIgnoreCaseAndAtivoTrue(nome);
    }
    
}
