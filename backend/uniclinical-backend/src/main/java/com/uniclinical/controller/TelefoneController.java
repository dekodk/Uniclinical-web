package com.uniclinical.controller;

import com.uniclinical.model.Telefone;
import com.uniclinical.repository.TelefoneRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/telefones")
public class TelefoneController {
    
    private final TelefoneRepository repository;

    public TelefoneController(TelefoneRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/cliente/{idCliente}")
    public List<Telefone> buscarPorCliente(@PathVariable Integer idCliente) {
        return repository.findByIdCliente(idCliente);
    }

    @PostMapping
    public Telefone salvar(@RequestBody Telefone telefone) {
        if (telefone.getDataCadFoneCliente() == null) {
            telefone.setDataCadFoneCliente(LocalDate.now());
        }
        return repository.save(telefone);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Telefone> atualizar(@PathVariable Integer id, @RequestBody Telefone telefone) {
        return repository.findById(id)
                .map(telefoneExistente -> {
                    telefoneExistente.setIdCliente(telefone.getIdCliente());
                    telefoneExistente.setFoneCliente(telefone.getFoneCliente());
                    telefoneExistente.setTipofoneCliente(telefone.getTipofoneCliente());
                    telefoneExistente.setDescObsCliente(telefone.getDescObsCliente());

                    if (telefone.getDataCadFoneCliente() != null) {
                        telefoneExistente.setDataCadFoneCliente(telefone.getDataCadFoneCliente());
                    }

                    return ResponseEntity.ok(repository.save(telefoneExistente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
