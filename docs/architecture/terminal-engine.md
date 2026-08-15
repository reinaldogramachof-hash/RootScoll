# Terminal Engine

> Documento em construção. Atualizado nesta fatia apenas para refletir o que
> já existe em código — a arquitetura completa (parser com pipe/redirect,
> `TerminalSession`, histórico, autocomplete, perfis de SO) segue aguardando
> definição detalhada pelo Arquiteto.

## Escopo

Arquitetura de `packages/terminal-engine`: core, commands, filesystem, shell, profiles (linux, macos, windows-cmd, powershell), parser, autocomplete, history, events, errors, contracts, utils.

## Status

**Fase 1, duas fatias implementadas** (etapas aprovadas pelo Arquiteto): núcleo real de execução simulada para 11 comandos da Fase 0 sobre um filesystem virtual em memória.

1. **Shell Core / Terminal Engine Mínimo**: `pwd`, `ls`, `cd`, `mkdir`.
2. **Comandos de arquivos e manipulação básica**: `touch`, `cat`, `echo`, `cp`, `mv`, `rm`, `tree`.

- `src/filesystem`: árvore imutável do filesystem virtual (`TerminalFilesystemState`, `VirtualDirectoryNode`, `VirtualFileNode`), resolução de caminhos (nomes simples e `..`), criação/inserção/remoção de nós (`createDirectory`, `createFile`, `insertNode`, `removeNode`) — tudo função pura, copy-on-write. Como a árvore é imutável, "copiar" um nó (usado por `cp`/`mv`) reaproveita a mesma referência do nó de origem em vez de clonar profundamente.
- `src/commands`: `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`, `echo`, `cp`, `mv`, `rm`, `tree` — cada um uma função pura `(state, args) -> outcome`, nunca lança exceção para erro esperado do aluno.
- `src/parser`: tokenização simples por espaço em branco (sem aspas, `|`, `>`/`>>` ainda).
- `src/core`: dispatcher (`runCommand`) que tokeniza e roteia para o comando correspondente.
- `src/contracts`: ponte com `ExecutionResult`/`VirtualFileSystemSnapshot` (`@codechat/types`) — `buildExecutionResult`, sempre com `adapterId: 'virtual-shell'`.
- `src/history`, `src/autocomplete`, `src/events`, `src/errors`, `src/shell`, `src/utils`, `src/profiles`: ainda vazios (`.gitkeep`) — fora de escopo destas fatias.

**Decisões de escopo da fatia de manipulação de arquivos** (para referência rápida — detalhamento completo no Implementation Report da tarefa):

- `rm` remove arquivo ou diretório vazio apenas; diretório não-vazio é erro controlado (equivalente a `rm` sem `-r`/`-f`).
- `cp`/`mv` copiam/movem arquivo ou diretório (recursivamente, sem exigir flag `-r` — "diretório simples" não significa "só vazio"); se o destino já existir como diretório, o item é copiado/movido para dentro dele com o nome original.
- `echo` não exige argumento (comportamento real do bash — imprime linha vazia sem argumentos), diferente dos demais comandos desta fatia, que têm aridade fixa e retornam erro controlado se ausente/excedente.
- Sem suporte a pipe, redirecionamento (`>`/`>>`) ou permissões/`chmod` nestas fatias.

Aguardando definição arquitetural detalhada pelo Arquiteto para: os 10 comandos + 3 operadores restantes da Fase 0, `TerminalSession` real (histórico, autocomplete), perfis de SO diferenciados (`profiles/linux`, `profiles/macos`, etc. — estas fatias não diferenciam comportamento por perfil), e o parser completo com pipe/redirecionamento.
