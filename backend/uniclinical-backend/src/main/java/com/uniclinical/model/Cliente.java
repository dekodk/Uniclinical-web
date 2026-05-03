package com.uniclinical.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "cliente")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCliente")
    private Integer idCliente;

    @NotBlank(message = "Nome do cliente é obrigatório")
    @Column(name = "nomeCliente")
    private String nomeCliente;

    @NotBlank(message = "CPF é obrigatório")
    @Column(name = "cpfCliente")
    private String cpfCliente;

    @Column(name = "rgCliente")
    private String rgCliente;

    @Column(name = "dtnCliente")
    private String dtnCliente;

    @Column(name = "ativo")
    private Boolean ativo;

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getCpfCliente() {
        return cpfCliente;
    }

    public void setCpfCliente(String cpfCliente) {
        this.cpfCliente = cpfCliente;
    }

    public String getRgCliente() {
        return rgCliente;
    }

    public void setRgCliente(String rgCliente) {
        this.rgCliente = rgCliente;
    }

    public String getDtnCliente() {
        return dtnCliente;
    }

    public void setDtnCliente(String dtnCliente) {
        this.dtnCliente = dtnCliente;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    
    
}
