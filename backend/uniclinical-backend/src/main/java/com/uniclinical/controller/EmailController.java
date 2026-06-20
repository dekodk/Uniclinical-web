package com.uniclinical.controller;

import com.uniclinical.model.Email;
import com.uniclinical.repository.EmailRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emails")
public class EmailController {
    
    private final EmailRepository repository;

    public EmailController(EmailRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/cliente/{idCliente}")
    public List<Email> buscarPorCliente(@PathVariable Integer idCliente) {
        return repository.findByIdCliente(idCliente);
    }

    @PostMapping
    public Email salvar(@RequestBody Email email) {
        if (email.getDataCadEmail() == null) {
            email.setDataCadEmail(LocalDate.now());
        }
        return repository.save(email);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Email> atualizar(@PathVariable Integer id, @RequestBody Email email) {
        return repository.findById(id)
                .map(emailExistente -> {
                    emailExistente.setIdCliente(email.getIdCliente());
                    emailExistente.setEmailCliente(email.getEmailCliente());
                    emailExistente.setTipoEmailCliente(email.getTipoEmailCliente());
                    emailExistente.setDescObsCliente(email.getDescObsCliente());

                    if (email.getDataCadEmail() != null) {
                        emailExistente.setDataCadEmail(email.getDataCadEmail());
                    }

                    return ResponseEntity.ok(repository.save(emailExistente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
