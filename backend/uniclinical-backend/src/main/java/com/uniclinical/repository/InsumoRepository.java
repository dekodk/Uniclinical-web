package com.uniclinical.repository;

import com.uniclinical.model.Insumo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsumoRepository extends JpaRepository<Insumo, Integer> {

    List<Insumo> findByAtivoTrue();
    
    List<Insumo> findByNomeInsumoContainingIgnoreCaseAndAtivoTrue(String nomeInsumo);
    
}
