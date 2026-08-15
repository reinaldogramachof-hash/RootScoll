# Terminal Engine

> Documento em construção. Atualizado nesta fatia apenas para refletir o que
> já existe em código — a arquitetura completa (parser com pipe/redirect,
> `TerminalSession`, histórico, autocomplete, perfis de SO) segue aguardando
> definição detalhada pelo Arquiteto.

## Escopo

Arquitetura de `packages/terminal-engine`: core, commands, filesystem, shell, profiles (linux, macos, windows-cmd, powershell), parser, autocomplete, history, events, errors, contracts, utils.

## Status

**Fatia mínima implementada** (Shell Core / Terminal Engine Mínimo — Etapa aprovada pelo Arquiteto): núcleo real de execução simulada para 4 comandos da Fase 0 (`pwd`, `ls`, `cd`, `mkdir`) sobre um filesystem virtual em memória.

- `src/filesystem`: árvore imutável do filesystem virtual (`TerminalFilesystemState`, `VirtualDirectoryNode`, `VirtualFileNode`), resolução de caminhos (nomes simples e `..`), criação de diretório — tudo função pura, copy-on-write.
- `src/commands`: `pwd`, `ls`, `cd`, `mkdir` — cada um uma função pura `(state, args) -> outcome`, nunca lança exceção para erro esperado do aluno.
- `src/parser`: tokenização simples por espaço em branco (sem aspas, `|`, `>`/`>>` ainda).
- `src/core`: dispatcher (`runCommand`) que tokeniza e roteia para o comando correspondente.
- `src/contracts`: ponte com `ExecutionResult`/`VirtualFileSystemSnapshot` (`@codechat/types`) — `buildExecutionResult`, sempre com `adapterId: 'virtual-shell'`.
- `src/history`, `src/autocomplete`, `src/events`, `src/errors`, `src/shell`, `src/utils`, `src/profiles`: ainda vazios (`.gitkeep`) — fora de escopo desta fatia.

Aguardando definição arquitetural detalhada pelo Arquiteto para: os 17 comandos + 3 operadores restantes da Fase 0, `TerminalSession` real (histórico, autocomplete), perfis de SO diferenciados (`profiles/linux`, `profiles/macos`, etc. — esta fatia não diferencia comportamento por perfil), e o parser completo com pipe/redirecionamento.
