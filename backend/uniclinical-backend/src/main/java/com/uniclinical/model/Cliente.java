package com.uniclinical.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

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
    private LocalDate dtnCliente;
    
    @Column (name = "sexoCliente")
    private String sexoCliente;

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

    public LocalDate getDtnCliente() {
        return dtnCliente;
    }

    public void setDtnCliente(LocalDate dtnCliente) {
        this.dtnCliente = dtnCliente;
    }

    public String getSexoCliente() {
        return sexoCliente;
    }

    public void setSexoCliente(String sexoCliente) {
        this.sexoCliente = sexoCliente;
    }
    
    

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    
    
}
