package com.uniclinical.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "telefone")
public class Telefone {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idtelefone")
    private Integer idtelefone;

    @Column(name = "idCliente")
    private Integer idCliente;

    @Column(name = "foneCliente")
    private String foneCliente;

    @Column(name = "tipofoneCliente")
    private String tipofoneCliente;

    @Column(name = "descObsCliente")
    private String descObsCliente;

    @Column(name = "dataCadFoneCliente")
    private LocalDate dataCadFoneCliente;

    public Integer getIdtelefone() {
        return idtelefone;
    }

    public void setIdtelefone(Integer idtelefone) {
        this.idtelefone = idtelefone;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public String getFoneCliente() {
        return foneCliente;
    }

    public void setFoneCliente(String foneCliente) {
        this.foneCliente = foneCliente;
    }

    public String getTipofoneCliente() {
        return tipofoneCliente;
    }

    public void setTipofoneCliente(String tipofoneCliente) {
        this.tipofoneCliente = tipofoneCliente;
    }

    public String getDescObsCliente() {
        return descObsCliente;
    }

    public void setDescObsCliente(String descObsCliente) {
        this.descObsCliente = descObsCliente;
    }

    public LocalDate getDataCadFoneCliente() {
        return dataCadFoneCliente;
    }

    public void setDataCadFoneCliente(LocalDate dataCadFoneCliente) {
        this.dataCadFoneCliente = dataCadFoneCliente;
    }
    
    
}
