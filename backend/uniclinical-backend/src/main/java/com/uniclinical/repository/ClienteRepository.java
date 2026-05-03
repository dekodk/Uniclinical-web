package com.uniclinical.repository;

import com.uniclinical.model.Cliente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    List<Cliente> findByAtivoTrue();

    List<Cliente> findByNomeClienteContainingIgnoreCaseAndAtivoTrue(String nomeCliente);
}
