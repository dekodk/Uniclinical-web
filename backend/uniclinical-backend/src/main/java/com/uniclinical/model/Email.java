package com.uniclinical.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "email")
public class Email {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idemail")
    private Integer idemail;

    @Column(name = "idCliente")
    private Integer idCliente;

    @Column(name = "emailCliente")
    private String emailCliente;

    @Column(name = "tipoEmailCliente")
    private String tipoEmailCliente;

    @Column(name = "descObsCliente")
    private String descObsCliente;

    @Column(name = "dataCadEmail")
    private LocalDate dataCadEmail;

    public Integer getIdemail() {
        return idemail;
    }

    public void setIdemail(Integer idemail) {
        this.idemail = idemail;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public String getEmailCliente() {
        return emailCliente;
    }

    public void setEmailCliente(String emailCliente) {
        this.emailCliente = emailCliente;
    }

    public String getTipoEmailCliente() {
        return tipoEmailCliente;
    }

    public void setTipoEmailCliente(String tipoEmailCliente) {
        this.tipoEmailCliente = tipoEmailCliente;
    }

    public String getDescObsCliente() {
        return descObsCliente;
    }

    public void setDescObsCliente(String descObsCliente) {
        this.descObsCliente = descObsCliente;
    }

    public LocalDate getDataCadEmail() {
        return dataCadEmail;
    }

    public void setDataCadEmail(LocalDate dataCadEmail) {
        this.dataCadEmail = dataCadEmail;
    }
    
    
}
