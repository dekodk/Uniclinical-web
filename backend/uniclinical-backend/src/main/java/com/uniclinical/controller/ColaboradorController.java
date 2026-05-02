package com.uniclinical.controller;

import com.uniclinical.model.Colaborador;
import com.uniclinical.repository.ColaboradorRepository;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/colaboradores")
public class ColaboradorController {
    
    private final ColaboradorRepository repository;
    private final BCryptPasswordEncoder encoder;

    public ColaboradorController(ColaboradorRepository repository, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    @GetMapping
    public List<Colaborador> listar() {
        return repository.findByAtivoTrue();
    }

    @GetMapping("/buscar")
    public List<Colaborador> buscar(@RequestParam String nome) {
        return repository.findByNomeUserContainingIgnoreCaseAndAtivoTrue(nome);
    }

    @PostMapping
    public Colaborador salvar(@RequestBody Colaborador colaborador) {
        if (colaborador.getAtivo() == null) {
            colaborador.setAtivo(true);
        }

        if (colaborador.getIdSenha() != null && !colaborador.getIdSenha().isBlank()) {
            colaborador.setIdSenha(encoder.encode(colaborador.getIdSenha()));
        }

        return repository.save(colaborador);
    }

    @PutMapping("/{id}")
    public Colaborador atualizar(@PathVariable Integer id, @RequestBody Colaborador colaborador) {
        Colaborador existente = repository.findById(id).orElseThrow();

        existente.setIdLogin(colaborador.getIdLogin());
        existente.setNomeUser(colaborador.getNomeUser());
        existente.setNivel(colaborador.getNivel());
        existente.setAtivo(colaborador.getAtivo() == null ? true : colaborador.getAtivo());

        if (colaborador.getIdSenha() != null && !colaborador.getIdSenha().isBlank()) {
            existente.setIdSenha(encoder.encode(colaborador.getIdSenha()));
        }

        return repository.save(existente);
    }

    @DeleteMapping("/{id}")
    public void inativar(@PathVariable Integer id) {
        Colaborador colaborador = repository.findById(id).orElseThrow();
        colaborador.setAtivo(false);
        repository.save(colaborador);
    }
    
}
