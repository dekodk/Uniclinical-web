package com.uniclinical.controller;

import com.uniclinical.model.Cliente;
import com.uniclinical.repository.ClienteRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/clientes")
public class ClienteController {
    
    private final ClienteRepository repository;

    public ClienteController(ClienteRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Cliente> listar() {
        return repository.findByAtivoTrue();
    }

    @GetMapping("/buscar")
    public List<Cliente> buscar(@RequestParam String nome) {
        return repository.findByNomeClienteContainingIgnoreCaseAndAtivoTrue(nome);
    }

    @PostMapping
    public Cliente salvar(@Valid @RequestBody Cliente cliente) {
        if (cliente.getAtivo() == null) {
            cliente.setAtivo(true);
        }

        return repository.save(cliente);
    }

    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable Integer id, @Valid @RequestBody Cliente cliente) {
        cliente.setIdCliente(id);

        if (cliente.getAtivo() == null) {
            cliente.setAtivo(true);
        }

        return repository.save(cliente);
    }

    @DeleteMapping("/{id}")
    public void inativar(@PathVariable Integer id) {
        Cliente cliente = repository.findById(id).orElseThrow();
        cliente.setAtivo(false);
        repository.save(cliente);
    }
    
}
