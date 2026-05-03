package com.uniclinical.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "insumo")
public class Insumo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idInsumo")
    private Integer idInsumo;

    @NotBlank(message = "Nome do insumo é obrigatório")
    @Column(name = "nomeInsumo")
    private String nomeInsumo;

    @Column(name = "ativo")
    private Boolean ativo;

    public Integer getIdInsumo() {
        return idInsumo;
    }

    public void setIdInsumo(Integer idInsumo) {
        this.idInsumo = idInsumo;
    }

    public String getNomeInsumo() {
        return nomeInsumo;
    }

    public void setNomeInsumo(String nomeInsumo) {
        this.nomeInsumo = nomeInsumo;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }    
}
