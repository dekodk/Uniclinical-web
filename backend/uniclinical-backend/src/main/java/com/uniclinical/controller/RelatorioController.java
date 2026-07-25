package com.uniclinical.controller;

import com.uniclinical.repository.ClienteRepository;
import com.uniclinical.repository.ColaboradorRepository;
import java.io.File;
import java.io.FileInputStream;
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

@CrossOrigin(origins = "http://localhost:5173")
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
}
