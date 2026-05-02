package com.uniclinical.controller;

import com.uniclinical.model.Colaborador;
import com.uniclinical.repository.ColaboradorRepository;
import com.uniclinical.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private ColaboradorRepository repository;

    @PostMapping
    public String login(@RequestBody Colaborador colaborador) {

        Colaborador user = repository.findByIdLogin(colaborador.getIdLogin());

        if (user != null && encoder.matches(colaborador.getIdSenha(), user.getIdSenha())) {
            String token = JwtUtil.gerarToken(user.getIdLogin(), user.getNivel());
            return token;
        } else {
            return "ERRO";
        }
    }

    @Autowired
    private BCryptPasswordEncoder encoder;

    @GetMapping("/gerar-senha")
    public String gerarSenha() {
        return encoder.encode("025507");
    }
}
