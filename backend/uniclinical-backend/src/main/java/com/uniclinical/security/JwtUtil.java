package com.uniclinical.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

public class JwtUtil {
    
    private static final String SECRET = "uniclinical-chave-super-secreta-123456";
    private static final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public static String gerarToken(String login, String nivel) {

        return Jwts.builder()
                .setSubject(login)
                .claim("nivel", nivel)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hora
                .signWith(key)
                .compact();
    }

    public static Claims validarToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
