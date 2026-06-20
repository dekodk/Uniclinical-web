package com.uniclinical.repository;

import com.uniclinical.model.Telefone;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TelefoneRepository extends JpaRepository<Telefone, Integer> {

    List<Telefone> findByIdCliente(Integer idCliente);
    
}
