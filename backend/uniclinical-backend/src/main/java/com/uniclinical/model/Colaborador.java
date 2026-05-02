package com.uniclinical.model;

import jakarta.persistence.*;

@Entity
@Table(name = "colaborador")
public class Colaborador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUser")
    private Integer idUser;

    @Column(name = "idLogin")
    private String idLogin;

    @Column(name = "idSenha")
    private String idSenha;
    
    @Column(name = "nivel")
    private String nivel;
    
    @Column(name = "ativo")
    private Boolean ativo;
    
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