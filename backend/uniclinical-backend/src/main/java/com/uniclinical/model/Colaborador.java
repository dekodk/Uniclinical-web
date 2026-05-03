package com.uniclinical.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "colaborador")
public class Colaborador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUser")
    private Integer idUser;

    @NotBlank(message = "Login é obrigatório")
    @Column(name = "idLogin")
    private String idLogin;

    @Column(name = "idSenha")
    private String idSenha;
    
    @NotBlank(message = "Nível é obrigatório")
    @Column(name = "nivel")
    private String nivel;
    
    @Column(name = "ativo")
    private Boolean ativo;
    
    @NotBlank(message = "Nome do colaborador é obrigatório")
    @Column(name = "nomeUser")
    private String nomeUser;

    public String getNomeUser() {
        return nomeUser;
    }

    public void setNomeUser(String nomeUser) {
        this.nomeUser = nomeUser;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Integer getIdUser() {
        return idUser;
    }

    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }

    public String getIdLogin() {
        return idLogin;
    }

    public void setIdLogin(String idLogin) {
        this.idLogin = idLogin;
    }

    public String getIdSenha() {
        return idSenha;
    }

    public void setIdSenha(String idSenha) {
        this.idSenha = idSenha;
    }
}