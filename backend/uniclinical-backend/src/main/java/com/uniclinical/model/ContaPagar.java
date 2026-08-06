package com.uniclinical.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contas_a_pagar")
public class ContaPagar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCap")
    private Integer idCap;

    @Column(name = "situacao", length = 45)
    private String situacao;

    @Column(name = "fornecedor", length = 250)
    private String fornecedor;

    @Column(name = "serie", length = 45)
    private String serie;

    @Column(name = "numeroNf", length = 45)
    private String numeroNf;

    @Column(name = "chaveNf", length = 44)
    private String chaveNf;

    @Column(name = "valor")
    private BigDecimal valor;

    @Column(name = "juros")
    private BigDecimal juros;

    @Column(name = "valorTotal")
    private BigDecimal valorTotal;

    @Column(name = "dataEmissao")
    private LocalDate dataEmissao;

    @Column(name = "dataLancamento")
    private LocalDate dataLancamento;

    @Column(name = "dataVencimento")
    private LocalDate dataVencimento;

    @Column(name = "dataPagamento")
    private LocalDate dataPagamento;

    @Column(name = "observacao", length = 250)
    private String observacao;

    public Integer getIdCap() {
        return idCap;
    }

    public void setIdCap(Integer idCap) {
        this.idCap = idCap;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    public String getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(String fornecedor) {
        this.fornecedor = fornecedor;
    }

    public String getSerie() {
        return serie;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }

    public String getNumeroNf() {
        return numeroNf;
    }

    public void setNumeroNf(String numeroNf) {
        this.numeroNf = numeroNf;
    }

    public String getChaveNf() {
        return chaveNf;
    }

    public void setChaveNf(String chaveNf) {
        this.chaveNf = chaveNf;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public BigDecimal getJuros() {
        return juros;
    }

    public void setJuros(BigDecimal juros) {
        this.juros = juros;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public LocalDate getDataEmissao() {
        return dataEmissao;
    }

    public void setDataEmissao(LocalDate dataEmissao) {
        this.dataEmissao = dataEmissao;
    }

    public LocalDate getDataLancamento() {
        return dataLancamento;
    }

    public void setDataLancamento(LocalDate dataLancamento) {
        this.dataLancamento = dataLancamento;
    }

    public LocalDate getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDate dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public LocalDate getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDate dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
