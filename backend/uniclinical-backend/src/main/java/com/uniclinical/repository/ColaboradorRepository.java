package com.uniclinical.repository;

import com.uniclinical.model.Colaborador;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ColaboradorRepository extends JpaRepository<Colaborador, Integer> {

    Colaborador findByIdLogin(String idLogin);
    
    List<Colaborador> findByAtivoTrue();

    List<Colaborador> findByNomeUserContainingIgnoreCaseAndAtivoTrue(String nomeUser);

}
