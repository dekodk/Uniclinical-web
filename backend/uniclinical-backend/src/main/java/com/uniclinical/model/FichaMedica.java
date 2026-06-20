package com.uniclinical.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "historico_medico")
public class FichaMedica {

    @Id
    @Column(name = "idCliente")
    public Integer idCliente;

    @Column(name = "cirurgia")
    public String cirurgia;

    @Column(name = "remedio")
    public String remedio;

    @Column(name = "anticoncepcional")
    public String anticoncepcional;

    @Column(name = "alergia_medicamento")
    public String alergiaMedicamento;

    @Column(name = "tratamento_medico")
    public String tratamentoMedico;

    @Column(name = "pressao_arterial")
    public String pressaoArterial;

    @Column(name = "outro_problema")
    public String outroProblema;

    @Column(name = "esta_gestante")
    public String estaGestante;

    @Column(name = "problema_rins_figado")
    public String problemaRinsFigado;

    @Column(name = "fumante")
    public String fumante;

    @Column(name = "hepatite")
    public String hepatite;

    @Column(name = "diabetes")
    public String diabetes;

    @Column(name = "asma")
    public String asma;

    @Column(name = "problema_cardiaco")
    public String problemaCardiaco;

    @Column(name = "convulsao")
    public String convulsao;

    @Column(name = "tontura")
    public String tontura;
}
