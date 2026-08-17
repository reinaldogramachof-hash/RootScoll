# Bloco 01: Segurança Cibernética, OWASP Top 10 & Hardening de API

---

## 1. Contexto

Escrever código que funciona não é suficiente; é necessário escrever código **seguro**. Falhas de segurança custam bilhões de dólares a empresas e expõem dados sensíveis de usuários. Neste módulo, você aplicará técnicas de Hardening e sanitização contra os ataques mais comuns catalogados na **OWASP Top 10** (como SQL Injection, Broken Access Control e Vazamento de Segredos).

---

## 2. Teoria Curta

### Ataques Frequentes & Mitigação Nível Raiz

```mermaid
graph TD
    Attack1["SQL Injection (Concatenação)"] --> Solution1["Prepared Statements / Parameterized Queries"]
    Attack2["Hardcoded API Keys"] --> Solution2["Variáveis de Ambiente (.env / process.env)"]
    Attack3["Cross-Site Scripting (XSS)"] --> Solution3["Sanitização e Content-Security-Policy (CSP)"]
```

1. **A01: Broken Access Control:** Impedir que um usuário comum acesse dados de administrador ou de outros usuários alterando o ID na URL.
2. **A03: Injection (SQL Injection):** Ocorre quando entradas do usuário são concatenadas diretamente em comandos SQL.
3. **A09: Security Logging and Monitoring Failures:** Falha em registrar tentativas de invasão e erros de autenticação em logs monitorados.

---

## 3. Exemplo Trabalhado

```javascript
// ❌ VULNERÁVEL A SQL INJECTION (NUNCA FAÇA ISSO):
// const query = `SELECT * FROM usuarios WHERE email = '${req.body.email}' AND senha = '${req.body.senha}'`;

// ✅ CÓDIGO SEGURO (Prepared Statements com parâmetros):
const querySegura = 'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1';
const resultado = await db.query(querySegura, [req.body.email]);

// Gestão Segura de Segredos
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('FATAL: A variável de ambiente JWT_SECRET não foi configurada!');
}
```

---

## 4. Prática Guiada

**Exercício de Fixação:**
1. A técnica que previne SQL Injection ao separar o comando SQL dos valores de entrada do usuário é chamada de `________ Statements` (Prepared Statements).
2. Arquivos contendo segredos como senhas e chaves de API nunca devem ser versionados no Git e devem estar listados no arquivo `.________`.
3. O projeto internacional que cataloga as 10 maiores vulnerabilidades de aplicações web é a `________` (OWASP).

---

## 5. Prática Independente (Projeto Hardening de API)

**Requisitos de Aceite:**
1. Crie a pasta `rootscoll/sandbox/cyber-hardening/`.
2. Crie o arquivo `.env.example` registrando as chaves de configuração necessárias sem exibir senhas reais.
3. Crie o arquivo `hardening.js` demonstrando a sanitização de entradas de formulário usando parâmetros seguros.

---

## 6. Erros Esperados

| Erro Comum | Causa Raiz | Solução |
| :--- | :--- | :--- |
| Enviar arquivo `.env` para o GitHub | Esquecer de incluir `.env` no `.gitignore`. | Sempre adicione `.env` ao `.gitignore` no momento da criação do projeto. |
| Confiar no controle de acesso do frontend | Validar permissões apenas no botão da tela. | Toda regra de permissão DEVE ser re-validada obrigatoriamente no Backend. |

---

## 7. Mentor (Dicas Progressivas)

- **💡 Nível 1:** Crie a pasta `rootscoll/sandbox/cyber-hardening` e os arquivos `.env.example` e `hardening.js`.
- **💡 Nível 2:** No `.env.example`, coloque `PORT=3000` e `DATABASE_URL=postgres://usuario:senha@localhost:5432/db`.
- **💡 Nível 3:** No `hardening.js`, garanta que exista referência ao uso de `process.env`.

---

## 8. Avaliação Objetiva

Execute o validador:

```bash
node rootscoll/scripts/run-validator.cjs rootscoll/tracks/06-cybersecurity/01-hardening-api
```

---

## 9. Reflexão

👉 [reflexao.md](file:///c:/Dev/CodeChat/rootscoll/tracks/06-cybersecurity/01-hardening-api/reflexao.md)
