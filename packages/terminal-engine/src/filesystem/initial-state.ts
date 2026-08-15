import type { TerminalFilesystemState } from './types';

/**
 * Estado inicial do filesystem virtual desta fatia mínima. Alinhado ao setup
 * padrão documentado em `docs/product/curriculum-phase-0.md`, seção 3
 * ("Modelo do filesystem virtual"): usuário `aluno`, `cwd: /home/aluno`.
 *
 * Esta fatia não implementa o parser YAML de autoria de conteúdo (formato
 * `setup.fs` do currículo) — apenas fixa, em código, o único estado inicial
 * necessário para os 4 comandos desta fatia (`pwd`, `ls`, `cd`, `mkdir`).
 * Carregar um `setup` de lição arbitrário fica para uma fatia futura de
 * `lesson-engine`/`terminal-engine`.
 */
export function createInitialFilesystemState(): TerminalFilesystemState {
  return {
    root: {
      kind: 'dir',
      children: {
        home: {
          kind: 'dir',
          children: {
            aluno: { kind: 'dir', children: {} },
          },
        },
      },
    },
    cwd: '/home/aluno',
  };
}
