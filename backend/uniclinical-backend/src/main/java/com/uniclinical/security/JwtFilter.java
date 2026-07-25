package com.uniclinical.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        if (path.equals("/login") || path.equals("/login/gerar-senha")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorization = request.getHeader("Authorization");
        System.out.println("[JwtFilter] path=" + path + " authorization=" + authorization);

        String token = null;
        if (authorization != null && authorization.startsWith("Bearer ")) {
            token = authorization.substring(7).trim();
            if (token.startsWith("\"") && token.endsWith("\"")) {
                token = token.substring(1, token.length() - 1);
            }
            token = token.replaceAll("\\r|\\n", "");
        }

        if ((token == null || token.isBlank()) && request.getParameter("token") != null) {
            token = request.getParameter("token").trim();
            if (token.startsWith("\"") && token.endsWith("\"")) {
                token = token.substring(1, token.length() - 1);
            }
            token = token.replaceAll("\\r|\\n", "");
            System.out.println("[JwtFilter] tokenFromParam=" + token);
        }

        if (token == null || token.isBlank()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token nao informado");
            return;
        }

        System.out.println("[JwtFilter] sanitizedToken=" + token);

        try {
            Claims claims = JwtUtil.validarToken(token);

            request.setAttribute("usuario", claims.getSubject());
            request.setAttribute("nivel", claims.get("nivel"));

            var authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                    claims.getSubject(),
                    null,
                    java.util.List.of()
            );

            org.springframework.security.core.context.SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            System.out.println("[JwtFilter] token validation failed: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token invalido ou expirado");
        }
    }

}
