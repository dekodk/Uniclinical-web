package com.uniclinical.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "procedimento")
public class Procedimento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idProcedimento")
    private Integer idProcedimento;
    
    @Column(name = "nomeProcedimento")
    private String nomeProcedimento;
    
    @Column(name = "valorProcedimento")
    private BigDecimal valorProcedimento;
    
    @Column(name = "ativo")
    private Boolean ativo;
    
    public Integer getIdProcedimento() {
        return idProcedimento;
    }

    public void setIdProcedimento(Integer idProcedimento) {
        this.idProcedimento = idProcedimento;
    }

    public String getNomeProcedimento() {
        return nomeProcedimento;
    }

    public void setNomeProcedimento(String nomeProcedimento) {
        this.nomeProcedimento = nomeProcedimento;
    }

    public BigDecimal getValorProcedimento() {
        return valorProcedimento;
    }

    public void setValorProcedimento(BigDecimal valorProcedimento) {
        this.valorProcedimento = valorProcedimento;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    
    
}
