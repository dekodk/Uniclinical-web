package com.uniclinical.controller;

import com.uniclinical.model.Endereco;
import com.uniclinical.repository.EnderecoRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/enderecos")
public class EnderecoController {
    
    private final EnderecoRepository repository;

    public EnderecoController(EnderecoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{idCliente}")
    public Endereco buscarPorCliente(@PathVariable Integer idCliente) {
        return repository.findById(idCliente).orElse(null);
    }

    @PostMapping
    public Endereco salvar(@Valid @RequestBody Endereco endereco) {
        return repository.save(endereco);
    }

    @PutMapping("/{idCliente}")
    public Endereco atualizar(@PathVariable Integer idCliente, @Valid @RequestBody Endereco endereco) {
        endereco.setIdCliente(idCliente);
        return repository.save(endereco);
    }
    
}
