package com.uniclinical.controller;

import com.uniclinical.model.Insumo;
import com.uniclinical.repository.InsumoRepository;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/insumos")
public class InsumoController {

    private final InsumoRepository repository;

    public InsumoController(InsumoRepository repository) {
        this.repository = repository;
    }

    // 🔥 LISTAR
    @GetMapping
    public List<Insumo> listar() {
        return repository.findByAtivoTrue();
    }

    // 🔥 SALVAR
    @PostMapping
    public Insumo salvar(@RequestBody Insumo insumo) {
        if (insumo.getAtivo() == null) {
            insumo.setAtivo(true);
        }
        return repository.save(insumo);
    }

    // 🔥 ATUALIZAR
    @PutMapping("/{id}")
    public Insumo atualizar(@PathVariable Integer id, @RequestBody Insumo insumo) {
        insumo.setIdInsumo(id);
        return repository.save(insumo);
    }

    // 🔥 INATIVAR (soft delete)
    @DeleteMapping("/{id}")
    public void inativar(@PathVariable Integer id) {
        Insumo insumo = repository.findById(id).orElseThrow();
        insumo.setAtivo(false);
        repository.save(insumo);
    }

    // BUSCAR POR NOME
    @GetMapping("/buscar")
    public List<Insumo> buscarPorNome(@RequestParam String nome) {
        return repository.findByNomeInsumoContainingIgnoreCaseAndAtivoTrue(nome);
    }

}
