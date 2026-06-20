package com.uniclinical.controller;

import com.uniclinical.model.FichaMedica;
import com.uniclinical.repository.FichaMedicaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fichas-medicas")
public class FichaMedicaController {

    private final FichaMedicaRepository repository;

    public FichaMedicaController(FichaMedicaRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{idCliente}")
    public ResponseEntity<FichaMedica> buscarPorCliente(@PathVariable Integer idCliente) {
        return repository.findById(idCliente)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{idCliente}")
    public FichaMedica salvar(@PathVariable Integer idCliente, @RequestBody FichaMedica ficha) {
        ficha.idCliente = idCliente;
        return repository.save(ficha);
    }
}
