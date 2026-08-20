package com.uniclinical.controller;

import com.uniclinical.repository.ClienteRepository;
import com.uniclinical.repository.ColaboradorRepository;
import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
})
@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    private final DataSource dataSource;
    private final ClienteRepository clienteRepository;
    private final ColaboradorRepository colaboradorRepository;

    public RelatorioController(DataSource dataSource, ClienteRepository clienteRepository, ColaboradorRepository colaboradorRepository) {
        this.dataSource = dataSource;
        this.clienteRepository = clienteRepository;
        this.colaboradorRepository = colaboradorRepository;
    }

    @GetMapping("/clientes/pdf")
    public ResponseEntity<byte[]> gerarRelatorioClientesPdf() throws Exception {
        String caminhoRelatorio = "C:/UniClinical/Relatorios/clientes.jasper";

        File arquivo = new File(caminhoRelatorio);
        if (!arquivo.exists()) {
            throw new IllegalStateException("Relatório não encontrado em: " + caminhoRelatorio);
        }

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("REPORT_LOCALE", new java.util.Locale("pt", "BR"));

        try (Connection conexao = dataSource.getConnection();
             FileInputStream inputStream = new FileInputStream(arquivo)) {
            JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parametros, conexao);
            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "relatorio-clientes.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        }
    }

    @GetMapping("/colaboradores/pdf")
    public ResponseEntity<byte[]> gerarRelatorioColaboradoresPdf() throws Exception {
        String caminhoRelatorio = "C:/UniClinical/Relatorios/colaborador.jasper";

        File arquivo = new File(caminhoRelatorio);
        if (!arquivo.exists()) {
            throw new IllegalStateException("Relatório não encontrado em: " + caminhoRelatorio);
        }

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("REPORT_LOCALE", new java.util.Locale("pt", "BR"));

        try (Connection conexao = dataSource.getConnection();
             FileInputStream inputStream = new FileInputStream(arquivo)) {
            JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parametros, conexao);
            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "relatorio-colaboradores.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        }
    }

    @GetMapping("/insumos/pdf")
    public ResponseEntity<byte[]> gerarRelatorioInsumosPdf() throws Exception {
        String caminhoRelatorio = "C:/UniClinical/Relatorios/insumos.jasper";

        File arquivo = new File(caminhoRelatorio);
        if (!arquivo.exists()) {
            throw new IllegalStateException("Relatório não encontrado em: " + caminhoRelatorio);
        }

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("REPORT_LOCALE", new java.util.Locale("pt", "BR"));

        try (Connection conexao = dataSource.getConnection();
             FileInputStream inputStream = new FileInputStream(arquivo)) {
            JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parametros, conexao);
            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "relatorio-insumos.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        }
    }

    @GetMapping("/procedimentos/pdf")
    public ResponseEntity<byte[]> gerarRelatorioProcedimentosPdf() throws Exception {
        String caminhoRelatorio = "C:/UniClinical/Relatorios/Procedimentos.jasper";

        File arquivo = new File(caminhoRelatorio);
        if (!arquivo.exists()) {
            throw new IllegalStateException("Relatório não encontrado em: " + caminhoRelatorio);
        }

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("REPORT_LOCALE", new java.util.Locale("pt", "BR"));

        try (Connection conexao = dataSource.getConnection();
             FileInputStream inputStream = new FileInputStream(arquivo)) {
            JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parametros, conexao);
            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "relatorio-procedimentos.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        }
    }

    @GetMapping("/fichamedica/pdf")
    public ResponseEntity<byte[]> gerarRelatorioFichaMedicaPdf(@RequestParam Integer id_param) throws Exception {
        if (id_param == null) {
            throw new IllegalArgumentException("Parâmetro 'id_param' é obrigatório.");
        }

        String caminhoRelatorio = "C:/UniClinical/Relatorios/fichamedica2.jasper";

        File arquivo = new File(caminhoRelatorio);
        if (!arquivo.exists()) {
            throw new IllegalStateException("Relatório não encontrado em: " + caminhoRelatorio);
        }

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("REPORT_LOCALE", new java.util.Locale("pt", "BR"));
        parametros.put("id_param", id_param);

        try (Connection conexao = dataSource.getConnection();
             FileInputStream inputStream = new FileInputStream(arquivo)) {
            JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parametros, conexao);
            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "relatorio-fichamedica.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        }
    }

    @GetMapping("/aniversariantes/pdf")
    public ResponseEntity<byte[]> gerarRelatorioAniversariantesPdf(@RequestParam Integer mes) throws Exception {
        if (mes == null || mes < 1 || mes > 12) {
            throw new IllegalArgumentException("Parâmetro 'mes' deve ser um inteiro entre 1 e 12.");
        }

        String caminhoRelatorio = "C:/UniClinical/Relatorios/aniversariantes.jasper";

        File arquivo = new File(caminhoRelatorio);
        if (!arquivo.exists()) {
            throw new IllegalStateException("Relatório não encontrado em: " + caminhoRelatorio);
        }

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("REPORT_LOCALE", new java.util.Locale("pt", "BR"));
        parametros.put("mes", mes);

        try (Connection conexao = dataSource.getConnection();
             FileInputStream inputStream = new FileInputStream(arquivo)) {
            JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parametros, conexao);
            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "relatorio-aniversariantes.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        }
    }

    @GetMapping("/contas-receber/pdf")
    public ResponseEntity<byte[]> gerarRelatorioContasReceberPdf(
            @RequestParam String dataInicial,
            @RequestParam String dataFinal,
            @RequestParam String status
    ) throws Exception {
        if (dataInicial == null || dataInicial.isBlank()) {
            throw new IllegalArgumentException("ParÃ¢metro 'dataInicial' Ã© obrigatÃ³rio.");
        }

        if (dataFinal == null || dataFinal.isBlank()) {
            throw new IllegalArgumentException("ParÃ¢metro 'dataFinal' Ã© obrigatÃ³rio.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("ParÃ¢metro 'status' Ã© obrigatÃ³rio.");
        }

        String statusNormalizado = status.trim().toUpperCase();

        if (!statusNormalizado.equals("ABERTO")
                && !statusNormalizado.equals("FECHADO")
                && !statusNormalizado.equals("TODOS")) {
            throw new IllegalArgumentException("ParÃ¢metro 'status' deve ser ABERTO, FECHADO ou TODOS.");
        }

        String caminhoRelatorio = "C:/UniClinical/Relatorios/ContasReceber.jasper";

        File arquivo = new File(caminhoRelatorio);
        if (!arquivo.exists()) {
            throw new IllegalStateException("RelatÃ³rio nÃ£o encontrado em: " + caminhoRelatorio);
        }

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("REPORT_LOCALE", new java.util.Locale("pt", "BR"));
        parametros.put("dataInicial", java.sql.Date.valueOf(LocalDate.parse(dataInicial)));
        parametros.put("dataFinal", java.sql.Date.valueOf(LocalDate.parse(dataFinal)));
        parametros.put("status", statusNormalizado);

        try (Connection conexao = dataSource.getConnection();
             FileInputStream inputStream = new FileInputStream(arquivo)) {
            JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parametros, conexao);
            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "relatorio-contas-receber.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        }
    }

    @GetMapping("/contas-receber")
    public List<ContaReceberRelatorio> listarContasReceberRelatorio(
            @RequestParam String dataInicial,
            @RequestParam String dataFinal,
            @RequestParam String status
    ) throws Exception {
        validarParametrosContasReceber(dataInicial, dataFinal, status);

        String statusNormalizado = status.trim().toUpperCase();
        String sql = "SELECT " +
                "car.idCar, " +
                "car.idAgendamento, " +
                "car.idCliente, " +
                "c.nomeCliente, " +
                "t.foneCliente, " +
                "car.valor_final, " +
                "car.data_prevista, " +
                "car.data_pagamento, " +
                "car.forma_pagamento, " +
                "car.status, " +
                "car.origem " +
                "FROM contas_a_receber car " +
                "INNER JOIN cliente c ON c.idCliente = car.idCliente " +
                "LEFT JOIN ( " +
                "    SELECT idCliente, MIN(idTelefone) AS idTelefone " +
                "    FROM telefone " +
                "    GROUP BY idCliente " +
                ") tt ON tt.idCliente = c.idCliente " +
                "LEFT JOIN telefone t ON t.idTelefone = tt.idTelefone " +
                "WHERE car.data_prevista BETWEEN ? AND ? " +
                "AND (? = 'TODOS' OR car.status = ?) " +
                "ORDER BY car.data_prevista, c.nomeCliente";

        List<ContaReceberRelatorio> contas = new ArrayList<>();

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setDate(1, java.sql.Date.valueOf(LocalDate.parse(dataInicial)));
            stmt.setDate(2, java.sql.Date.valueOf(LocalDate.parse(dataFinal)));
            stmt.setString(3, statusNormalizado);
            stmt.setString(4, statusNormalizado);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    java.sql.Date dataPrevista = rs.getDate("data_prevista");
                    java.sql.Date dataPagamento = rs.getDate("data_pagamento");

                    contas.add(new ContaReceberRelatorio(
                            rs.getInt("idCar"),
                            rs.getInt("idAgendamento"),
                            rs.getInt("idCliente"),
                            rs.getString("nomeCliente"),
                            rs.getString("foneCliente"),
                            rs.getBigDecimal("valor_final"),
                            dataPrevista == null ? null : dataPrevista.toLocalDate(),
                            dataPagamento == null ? null : dataPagamento.toLocalDate(),
                            rs.getString("forma_pagamento"),
                            rs.getString("status"),
                            rs.getString("origem")
                    ));
                }
            }
        }

        return contas;
    }

    @GetMapping("/contas-pagar/pdf")
    public ResponseEntity<byte[]> gerarRelatorioContasPagarPdf(
            @RequestParam String dataInicial,
            @RequestParam String dataFinal,
            @RequestParam String status
    ) throws Exception {
        validarParametrosContasPagar(dataInicial, dataFinal, status);

        String statusNormalizado = status.trim().toUpperCase();
        String caminhoRelatorio = "C:/UniClinical/Relatorios/ContasPagar.jasper";

        File arquivo = new File(caminhoRelatorio);
        if (!arquivo.exists()) {
            throw new IllegalStateException("RelatÃ³rio nÃ£o encontrado em: " + caminhoRelatorio);
        }

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("REPORT_LOCALE", new java.util.Locale("pt", "BR"));
        parametros.put("dataInicial", java.sql.Date.valueOf(LocalDate.parse(dataInicial)));
        parametros.put("dataFinal", java.sql.Date.valueOf(LocalDate.parse(dataFinal)));
        parametros.put("status", statusNormalizado);

        try (Connection conexao = dataSource.getConnection();
             FileInputStream inputStream = new FileInputStream(arquivo)) {
            JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parametros, conexao);
            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "relatorio-contas-pagar.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        }
    }

    @GetMapping("/contas-pagar")
    public List<ContaPagarRelatorio> listarContasPagarRelatorio(
            @RequestParam String dataInicial,
            @RequestParam String dataFinal,
            @RequestParam String status
    ) throws Exception {
        validarParametrosContasPagar(dataInicial, dataFinal, status);

        String statusNormalizado = status.trim().toUpperCase();
        String sql = "SELECT " +
                "t.idCap, " +
                "t.situacao, " +
                "t.fornecedor, " +
                "t.serie, " +
                "t.numeroNf, " +
                "t.chaveNf, " +
                "t.valor, " +
                "t.juros, " +
                "t.valorTotal, " +
                "t.dataEmissao, " +
                "t.dataLancamento, " +
                "t.dataVencimento, " +
                "t.dataPagamento, " +
                "t.observacao " +
                "FROM contas_a_pagar t " +
                "WHERE t.dataVencimento BETWEEN ? AND ? " +
                "AND (? = 'TODOS' OR t.situacao = ?) " +
                "ORDER BY t.dataVencimento, t.fornecedor";

        List<ContaPagarRelatorio> contas = new ArrayList<>();

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setDate(1, java.sql.Date.valueOf(LocalDate.parse(dataInicial)));
            stmt.setDate(2, java.sql.Date.valueOf(LocalDate.parse(dataFinal)));
            stmt.setString(3, statusNormalizado);
            stmt.setString(4, statusNormalizado);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    java.sql.Date dataEmissao = rs.getDate("dataEmissao");
                    java.sql.Date dataLancamento = rs.getDate("dataLancamento");
                    java.sql.Date dataVencimento = rs.getDate("dataVencimento");
                    java.sql.Date dataPagamento = rs.getDate("dataPagamento");

                    contas.add(new ContaPagarRelatorio(
                            rs.getInt("idCap"),
                            rs.getString("situacao"),
                            rs.getString("fornecedor"),
                            rs.getString("serie"),
                            rs.getString("numeroNf"),
                            rs.getString("chaveNf"),
                            rs.getBigDecimal("valor"),
                            rs.getBigDecimal("juros"),
                            rs.getBigDecimal("valorTotal"),
                            dataEmissao == null ? null : dataEmissao.toLocalDate(),
                            dataLancamento == null ? null : dataLancamento.toLocalDate(),
                            dataVencimento == null ? null : dataVencimento.toLocalDate(),
                            dataPagamento == null ? null : dataPagamento.toLocalDate(),
                            rs.getString("observacao")
                    ));
                }
            }
        }

        return contas;
    }

    @GetMapping("/caixa")
    public CaixaRelatorio gerarRelatorioCaixa(
            @RequestParam String dataInicial,
            @RequestParam String dataFinal
    ) throws Exception {
        validarPeriodoCaixa(dataInicial, dataFinal);

        String sql = "SELECT " +
                "'ENTRADA' AS tipo, " +
                "car.data_pagamento AS dataPagamento, " +
                "'CONTAS A RECEBER' AS origem, " +
                "CONCAT('Cliente: ', c.nomeCliente, ' - Agendamento: ', car.idAgendamento) AS descricao, " +
                "car.valor_final AS valor " +
                "FROM contas_a_receber car " +
                "INNER JOIN cliente c ON c.idCliente = car.idCliente " +
                "WHERE car.data_pagamento BETWEEN ? AND ? " +
                "AND car.status = 'FECHADO' " +
                "UNION ALL " +
                "SELECT " +
                "'SAIDA' AS tipo, " +
                "t.dataPagamento AS dataPagamento, " +
                "'CONTAS A PAGAR' AS origem, " +
                "CONCAT('Fornecedor: ', COALESCE(t.fornecedor, ''), ' - NF: ', COALESCE(t.numeroNf, '')) AS descricao, " +
                "t.valorTotal AS valor " +
                "FROM contas_a_pagar t " +
                "WHERE t.dataPagamento BETWEEN ? AND ? " +
                "AND t.situacao = 'PAGO' " +
                "ORDER BY dataPagamento, tipo, descricao";

        List<MovimentoCaixa> movimentos = new ArrayList<>();
        BigDecimal entradas = BigDecimal.ZERO;
        BigDecimal saidas = BigDecimal.ZERO;

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setDate(1, java.sql.Date.valueOf(LocalDate.parse(dataInicial)));
            stmt.setDate(2, java.sql.Date.valueOf(LocalDate.parse(dataFinal)));
            stmt.setDate(3, java.sql.Date.valueOf(LocalDate.parse(dataInicial)));
            stmt.setDate(4, java.sql.Date.valueOf(LocalDate.parse(dataFinal)));

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    String tipo = rs.getString("tipo");
                    java.sql.Date dataPagamento = rs.getDate("dataPagamento");
                    BigDecimal valor = rs.getBigDecimal("valor");

                    if (valor == null) {
                        valor = BigDecimal.ZERO;
                    }

                    if ("ENTRADA".equals(tipo)) {
                        entradas = entradas.add(valor);
                    } else {
                        saidas = saidas.add(valor);
                    }

                    movimentos.add(new MovimentoCaixa(
                            tipo,
                            dataPagamento == null ? null : dataPagamento.toLocalDate(),
                            rs.getString("origem"),
                            rs.getString("descricao"),
                            valor
                    ));
                }
            }
        }

        return new CaixaRelatorio(
                entradas,
                saidas,
                entradas.subtract(saidas),
                movimentos
        );
    }

    private void validarParametrosContasReceber(String dataInicial, String dataFinal, String status) {
        if (dataInicial == null || dataInicial.isBlank()) {
            throw new IllegalArgumentException("ParÃ¢metro 'dataInicial' Ã© obrigatÃ³rio.");
        }

        if (dataFinal == null || dataFinal.isBlank()) {
            throw new IllegalArgumentException("ParÃ¢metro 'dataFinal' Ã© obrigatÃ³rio.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("ParÃ¢metro 'status' Ã© obrigatÃ³rio.");
        }

        String statusNormalizado = status.trim().toUpperCase();

        if (!statusNormalizado.equals("ABERTO")
                && !statusNormalizado.equals("FECHADO")
                && !statusNormalizado.equals("TODOS")) {
            throw new IllegalArgumentException("ParÃ¢metro 'status' deve ser ABERTO, FECHADO ou TODOS.");
        }
    }

    private void validarParametrosContasPagar(String dataInicial, String dataFinal, String status) {
        if (dataInicial == null || dataInicial.isBlank()) {
            throw new IllegalArgumentException("ParÃ¢metro 'dataInicial' Ã© obrigatÃ³rio.");
        }

        if (dataFinal == null || dataFinal.isBlank()) {
            throw new IllegalArgumentException("ParÃ¢metro 'dataFinal' Ã© obrigatÃ³rio.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("ParÃ¢metro 'status' Ã© obrigatÃ³rio.");
        }

        String statusNormalizado = status.trim().toUpperCase();

        if (!statusNormalizado.equals("TODOS")
                && !statusNormalizado.equals("ABERTO")
                && !statusNormalizado.equals("PAGO")
                && !statusNormalizado.equals("VENCIDO")) {
            throw new IllegalArgumentException("ParÃ¢metro 'status' deve ser TODOS, ABERTO, PAGO ou VENCIDO.");
        }
    }

    private void validarPeriodoCaixa(String dataInicial, String dataFinal) {
        if (dataInicial == null || dataInicial.isBlank()) {
            throw new IllegalArgumentException("Parametro 'dataInicial' e obrigatorio.");
        }

        if (dataFinal == null || dataFinal.isBlank()) {
            throw new IllegalArgumentException("Parametro 'dataFinal' e obrigatorio.");
        }
    }

    @GetMapping("/aniversariantes")
    public List<Aniversariante> listarAniversariantes(@RequestParam Integer mes) throws Exception {
        if (mes == null || mes < 1 || mes > 12) {
            throw new IllegalArgumentException("Parâmetro 'mes' deve ser um inteiro entre 1 e 12.");
        }

        String sql = "SELECT c.idCliente, c.nomeCliente, c.dtnCliente, t.foneCliente " +
                "FROM cliente c " +
                "LEFT JOIN (" +
                "    SELECT idCliente, MIN(idtelefone) AS idTelefone " +
                "    FROM telefone " +
                "    GROUP BY idCliente" +
                ") tt ON tt.idCliente = c.idCliente " +
                "LEFT JOIN telefone t ON t.idtelefone = tt.idTelefone " +
                "WHERE MONTH(c.dtnCliente) = ? " +
                "ORDER BY DAY(c.dtnCliente)";

        List<Aniversariante> aniversariantes = new ArrayList<>();

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setInt(1, mes);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Integer idCliente = rs.getInt("idCliente");
                    String nomeCliente = rs.getString("nomeCliente");
                    LocalDate dtnCliente = rs.getDate("dtnCliente").toLocalDate();
                    String foneCliente = rs.getString("foneCliente");
                    aniversariantes.add(new Aniversariante(idCliente, nomeCliente, dtnCliente, foneCliente));
                }
            }
        }

        return aniversariantes;
    }

    public static record Aniversariante(Integer idCliente, String nomeCliente, LocalDate dtnCliente, String foneCliente) {
    }

    public static record ContaReceberRelatorio(
            Integer idCar,
            Integer idAgendamento,
            Integer idCliente,
            String nomeCliente,
            String foneCliente,
            BigDecimal valorFinal,
            LocalDate dataPrevista,
            LocalDate dataPagamento,
            String formaPagamento,
            String status,
            String origem
    ) {
    }

    public static record ContaPagarRelatorio(
            Integer idCap,
            String situacao,
            String fornecedor,
            String serie,
            String numeroNf,
            String chaveNf,
            BigDecimal valor,
            BigDecimal juros,
            BigDecimal valorTotal,
            LocalDate dataEmissao,
            LocalDate dataLancamento,
            LocalDate dataVencimento,
            LocalDate dataPagamento,
            String observacao
    ) {
    }

    public static record MovimentoCaixa(
            String tipo,
            LocalDate dataPagamento,
            String origem,
            String descricao,
            BigDecimal valor
    ) {
    }

    public static record CaixaRelatorio(
            BigDecimal entradas,
            BigDecimal saidas,
            BigDecimal saldo,
            List<MovimentoCaixa> movimentos
    ) {
    }
}
