package com.uniclinical.repository;

import com.uniclinical.model.Colaborador;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ColaboradorRepository extends JpaRepository<Colaborador, Integer> {

    Colaborador findByIdLogin(String idLogin);

}
