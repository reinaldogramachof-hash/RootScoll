import type {
  ExecutionRequestRef,
  ExecutionResult,
  VirtualFileEntry,
  VirtualFileSystemSnapshot,
} from '@codechat/types';
import type { TerminalCommandOutcome } from '../commands/types';
import type { VirtualDirectoryNode } from '../filesystem/types';

/**
 * Ponte entre o filesystem interno de `terminal-engine` e o contrato
 * agnóstico `VirtualFileSystemSnapshot`/`ExecutionResult` (`@codechat/types`,
 * fatia mínima da Fase 1). Esta é a ÚNICA direção permitida — o filesystem
 * interno (`../filesystem`) não importa nada de `@codechat/types`; só este
 * arquivo faz a tradução, mantendo a regra de que `ExecutionResult` nunca
 * conhece `Challenge`/`ChallengeProgress`/`ValidationRule` nem detalhes
 * internos de representação do filesystem.
 */

function flattenEntries(node: VirtualDirectoryNode, basePath: string): VirtualFileEntry[] {
  const entries: VirtualFileEntry[] = [];
  for (const name of Object.keys(node.children).sort()) {
    const child = node.children[name];
    if (child === undefined) {
      continue;
    }
    const childPath = basePath === '/' ? `/${name}` : `${basePath}/${name}`;
    if (child.kind === 'dir') {
      entries.push({ path: childPath, kind: 'dir' });
      entries.push(...flattenEntries(child, childPath));
    } else {
      entries.push({ path: childPath, kind: 'file', content: child.content });
    }
  }
  return entries;
}

/**
 * Converte o estado interno do filesystem virtual num
 * `VirtualFileSystemSnapshot` (`@codechat/types`) — a raiz (`/`) em si não
 * vira uma entrada (é implícita); apenas seu conteúdo é listado,
 * recursivamente, em ordem alfabética por nível (determinístico).
 */
export function toFilesystemSnapshot(
  root: VirtualDirectoryNode,
  cwd: string,
): VirtualFileSystemSnapshot {
  return {
    cwd,
    entries: flattenEntries(root, '/'),
  };
}

/**
 * Monta um `ExecutionResult` (`@codechat/types`) a partir do resultado de
 * `runCommand` — usa sempre `adapterId: 'virtual-shell'`, único adapter
 * relevante para `terminal-engine` (ver
 * docs/architecture/runtime-requirements-v1.md). `origin`, `completedAt` e
 * `durationMs` são responsabilidade de quem chama (a sessão real de
 * terminal/execution-engine, ainda não implementada) — esta função é pura e
 * não gera timestamps nem ids.
 */
export function buildExecutionResult(
  origin: ExecutionRequestRef,
  commandLine: string,
  outcome: TerminalCommandOutcome,
  completedAt: string,
  durationMs: number,
): ExecutionResult {
  return {
    origin,
    command: commandLine,
    stdout: outcome.stdout,
    stderr: outcome.stderr,
    exitCode: outcome.exitCode,
    durationMs,
    adapterId: 'virtual-shell',
    filesystem: toFilesystemSnapshot(outcome.filesystem.root, outcome.filesystem.cwd),
    completedAt,
  };
}
