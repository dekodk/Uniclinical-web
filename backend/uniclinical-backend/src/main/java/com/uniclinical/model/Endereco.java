package com.uniclinical.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "endereco")
public class Endereco {
    
    @Id
    @NotNull
    @Column(name = "idCliente")
    private Integer idCliente;

    @NotBlank(message = "Logradouro é obrigatório")
    @Column(name = "lograEndereco")
    private String lograEndereco;

    @NotBlank(message = "Bairro é obrigatório")
    @Column(name = "bairroEndereco")
    private String bairroEndereco;

    @NotBlank(message = "Cidade é obrigatória")
    @Column(name = "cidadeEndereco")
    private String cidadeEndereco;

    @NotBlank(message = "Estado é obrigatório")
    @Column(name = "estadoEndereco")
    private String estadoEndereco;

    @NotBlank(message = "CEP é obrigatório")
    @Column(name = "cepEndereco")
    private String cepEndereco;

    @Column(name = "compleEndereco")
    private String compleEndereco;

    @Column(name = "numeroEndereco")
    private String numeroEndereco;

    @Column(name = "unidadeEndereco")
    private String unidadeEndereco;

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public String getLograEndereco() {
        return lograEndereco;
    }

    public void setLograEndereco(String lograEndereco) {
        this.lograEndereco = lograEndereco;
    }

    public String getBairroEndereco() {
        return bairroEndereco;
    }

    public void setBairroEndereco(String bairroEndereco) {
        this.bairroEndereco = bairroEndereco;
    }

    public String getCidadeEndereco() {
        return cidadeEndereco;
    }

    public void setCidadeEndereco(String cidadeEndereco) {
        this.cidadeEndereco = cidadeEndereco;
    }

    public String getEstadoEndereco() {
        return estadoEndereco;
    }

    public void setEstadoEndereco(String estadoEndereco) {
        this.estadoEndereco = estadoEndereco;
    }

    public String getCepEndereco() {
        return cepEndereco;
    }

    public void setCepEndereco(String cepEndereco) {
        this.cepEndereco = cepEndereco;
    }

    public String getCompleEndereco() {
        return compleEndereco;
    }

    public void setCompleEndereco(String compleEndereco) {
        this.compleEndereco = compleEndereco;
    }

    public String getNumeroEndereco() {
        return numeroEndereco;
    }

    public void setNumeroEndereco(String numeroEndereco) {
        this.numeroEndereco = numeroEndereco;
    }

    public String getUnidadeEndereco() {
        return unidadeEndereco;
    }

    public void setUnidadeEndereco(String unidadeEndereco) {
        this.unidadeEndereco = unidadeEndereco;
    }
    
    
}
