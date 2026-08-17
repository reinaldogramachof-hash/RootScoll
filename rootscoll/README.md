# RootScoll — Currículo Pedagógico Modo Raiz "Zero to Junior"

Bem-vindo ao repositório pedagógico oficial do currículo **Zero to Junior** da RootScoll.

---

## 🎯 Visão Geral do Modo Raiz

A RootScoll forma o aluno através do aprendizado ativo: prática real, digitação autêntica, exposição ao erro e avaliação objetiva.

- **Público Alvo:** Iniciante absoluto (do zero).
- **Meta de Saída:** Prontidão para o mercado como Desenvolvedor Júnior.
- **Transversalidade:** Terminal, Git, Segurança (OWASP), Testes e Debugging integrados do primeiro ao último dia.

---

## 🗺️ As 6 Trilhas Macro & 14 Etapas de Competência

```
rootscoll/
├── global/
│   ├── policies/ai-usage.md        # Política de uso de IA (Bloqueio -> Auditado -> Auditoria)
│   └── validators-utils/           # Utilitários globais de testes e checagem cross-platform (.cjs)
├── scripts/
│   ├── run-validator.cjs           # CLI universal para executar o validador de qualquer módulo
│   └── setup-student-env.cjs       # Inicialização do workspace do aluno
└── tracks/
    ├── 01-terminal-os/             # Trilha 1: Terminal e Sistemas Operacionais
    │   └── 01-navegacao/
    ├── 02-git-github/              # Trilha 2: Git e GitHub
    │   └── 01-diario-de-bordo/
    ├── 03-web/                     # Trilha 3: Desenvolvimento Web (HTML/CSS semântico e acessível)
    │   └── 01-landing-page-acessivel/
    ├── 04-programming/             # Trilha 4: Programação (Sequência Estrita 4a -> 4e)
    │   ├── 4a-vanilla-js-1/        # 4a: Vanilla JS I (Lógica Pura & Funções Puras)
    │   ├── 4b-vanilla-js-2/        # 4b: Vanilla JS II (DOM & Projeto Terminal Tasker)
    │   ├── 4c-assincronismo-apis/   # 4c: Assincronismo & APIs (Dashboard Integrado)
    │   ├── 4d-react/               # 4d: React (UI Declarativa)
    │   └── 4e-typescript/          # 4e: TypeScript (Tipagem Estrita)
    ├── 05-professional-practice/   # Trilha 5: Prática Profissional (Backend Node, SQL & API Biblioteca)
    │   └── 01-api-rest-biblioteca/
    └── 06-cybersecurity/           # Trilha 6: Segurança Cibernética & Hardening OWASP
        └── 01-hardening-api/
```

---

## 🧩 O Modelo de Bloco Pedagógico (9 Estágios)

Cada módulo e aula segue rigorosamente os 9 estágios:

1. **Contexto:** Motivação e aplicação real do conceito.
2. **Teoria Curta:** Modelo mental claro com diagramas Mermaid.
3. **Exemplo Trabalhado:** Código comentado linha por linha.
4. **Prática Guiada:** Exercícios de fixação e preenchimento de lacunas.
5. **Prática Independente:** Desafio prático com critérios de aceite objetivos.
6. **Erro Esperado:** Tabela de erros comuns, causas raízes e como resolver.
7. **Mentor:** Dicas progressivas em 3 níveis (sem revelar a resposta final).
8. **Avaliação Objetiva:** Script executável que valida o estado real dos arquivos/código.
9. **Reflexão:** Diário metacognitivo obrigatório (`reflexao.md`).

---

## 🛠️ Como Executar os Validadores

### 1. Inicializar o Ambiente
```bash
node rootscoll/scripts/setup-student-env.cjs
```

### 2. Validar um Módulo Específico
```bash
node rootscoll/scripts/run-validator.cjs rootscoll/tracks/01-terminal-os/01-navegacao
```

---

## 📜 Política de Uso de IA

O uso de assistentes de Inteligência Artificial segue regras rigorosas conforme documentado em [`global/policies/ai-usage.md`](file:///c:/Dev/CodeChat/rootscoll/global/policies/ai-usage.md):
- **Trilhas 1 a 3:** Bloqueio Total (digitação manual obrigatória).
- **Trilha 4:** Uso restrito a dados fictícios (proibido para lógica principal).
- **Trilhas 5 e 6:** Auditoria de código de IA com bugs propositais.
