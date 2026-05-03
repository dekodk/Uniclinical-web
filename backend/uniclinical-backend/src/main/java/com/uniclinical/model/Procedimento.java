package com.uniclinical.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "procedimento")
public class Procedimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idProcedimento")
    private Integer idProcedimento;

    @NotBlank(message = "Nome do procedimento é obrigatório")
    @Column(name = "nomeProcedimento")
    private String nomeProcedimento;

    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser maior que zero")
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
