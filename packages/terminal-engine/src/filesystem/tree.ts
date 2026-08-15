import { absolutePathSegments } from './path';
import type { VirtualDirectoryNode, VirtualFsNode } from './types';

/**
 * Operações puras e imutáveis sobre a árvore do filesystem virtual — toda
 * mutação é copy-on-write (nunca modifica `root` recebido; sempre retorna uma
 * nova referência). Nenhuma função aqui lança exceção para uma condição
 * esperada de uso (caminho inexistente, diretório duplicado etc.) — erros são
 * retornados como valor (`{ ok: false, reason }`), consistente com a regra
 * desta fatia de nunca lançar exceção no fluxo normal do aluno.
 */

/** Busca um nó pelo caminho absoluto. `'/'` sempre resolve para `root`. */
export function getNode(
  root: VirtualDirectoryNode,
  absolutePath: string,
): VirtualFsNode | undefined {
  let current: VirtualFsNode = root;
  for (const segment of absolutePathSegments(absolutePath)) {
    if (current.kind !== 'dir') {
      return undefined;
    }
    const next: VirtualFsNode | undefined = current.children[segment];
    if (next === undefined) {
      return undefined;
    }
    current = next;
  }
  return current;
}

export type ListDirectoryResult =
  | { readonly ok: true; readonly entries: readonly string[] }
  | { readonly ok: false; readonly reason: 'not-found' | 'not-directory' };

/** Lista os nomes dos filhos diretos de um diretório, em ordem alfabética (determinístico). */
export function listDirectory(
  root: VirtualDirectoryNode,
  absolutePath: string,
): ListDirectoryResult {
  const node = getNode(root, absolutePath);
  if (node === undefined) {
    return { ok: false, reason: 'not-found' };
  }
  if (node.kind !== 'dir') {
    return { ok: false, reason: 'not-directory' };
  }
  return { ok: true, entries: Object.keys(node.children).sort() };
}

export type CreateDirectoryResult =
  | { readonly ok: true; readonly root: VirtualDirectoryNode }
  | {
      readonly ok: false;
      readonly reason: 'already-exists' | 'parent-not-found' | 'parent-not-directory';
    };

/**
 * Reconstrói a árvore, copy-on-write, aplicando `updater` ao diretório
 * localizado em `segments` a partir de `dir`. Assume que o caminho até esse
 * diretório já foi validado pelo chamador (`createDirectory`); se não for o
 * caso, retorna `dir` inalterado em vez de lançar exceção.
 */
function updateDirectoryAtPath(
  dir: VirtualDirectoryNode,
  segments: readonly string[],
  updater: (target: VirtualDirectoryNode) => VirtualDirectoryNode,
): VirtualDirectoryNode {
  const [head, ...rest] = segments;
  if (head === undefined) {
    return updater(dir);
  }
  const existing = dir.children[head];
  if (existing === undefined || existing.kind !== 'dir') {
    return dir;
  }
  const updatedChild = updateDirectoryAtPath(existing, rest, updater);
  return {
    kind: 'dir',
    children: { ...dir.children, [head]: updatedChild },
  };
}

/**
 * Cria um diretório vazio em `absolutePath`. Nesta fatia mínima, `mkdir` NÃO
 * cria diretórios pai automaticamente (equivalente a `mkdir` sem `-p` — a
 * flag `-p` do currículo Fase 0 fica para uma fatia futura): se o diretório
 * pai não existir, retorna `parent-not-found`.
 */
export function createDirectory(
  root: VirtualDirectoryNode,
  absolutePath: string,
): CreateDirectoryResult {
  const segments = absolutePathSegments(absolutePath);
  const name = segments.at(-1);
  if (name === undefined) {
    // absolutePath === '/' — a raiz sempre existe.
    return { ok: false, reason: 'already-exists' };
  }

  const parentSegments = segments.slice(0, -1);
  const parentNode = getNode(root, '/' + parentSegments.join('/'));
  if (parentNode === undefined) {
    return { ok: false, reason: 'parent-not-found' };
  }
  if (parentNode.kind !== 'dir') {
    return { ok: false, reason: 'parent-not-directory' };
  }
  if (parentNode.children[name] !== undefined) {
    return { ok: false, reason: 'already-exists' };
  }

  const newRoot = updateDirectoryAtPath(root, parentSegments, (parentDir) => ({
    kind: 'dir',
    children: { ...parentDir.children, [name]: { kind: 'dir', children: {} } },
  }));
  return { ok: true, root: newRoot };
}

export type InsertNodeResult =
  | { readonly ok: true; readonly root: VirtualDirectoryNode }
  | {
      readonly ok: false;
      readonly reason: 'already-exists' | 'parent-not-found' | 'parent-not-directory';
    };

/**
 * Insere `node` (arquivo ou diretório, com sua subárvore, se houver) em
 * `absolutePath`. Como a árvore é 100% imutável, "copiar"/"mover" um nó
 * significa apenas reutilizar a MESMA referência do nó de origem numa nova
 * posição — não é necessário clonar profundamente (nenhuma mutação futura
 * pode invalidar essa partilha estrutural). Usada por `createFile` (nó novo
 * vazio), e pelos comandos `cp`/`mv` (nó existente, copiado por referência).
 */
export function insertNode(
  root: VirtualDirectoryNode,
  absolutePath: string,
  node: VirtualFsNode,
  options: { readonly overwrite?: boolean } = {},
): InsertNodeResult {
  const segments = absolutePathSegments(absolutePath);
  const name = segments.at(-1);
  if (name === undefined) {
    // absolutePath === '/' — não é possível substituir a raiz nesta fatia.
    return { ok: false, reason: 'already-exists' };
  }

  const parentSegments = segments.slice(0, -1);
  const parentNode = getNode(root, '/' + parentSegments.join('/'));
  if (parentNode === undefined) {
    return { ok: false, reason: 'parent-not-found' };
  }
  if (parentNode.kind !== 'dir') {
    return { ok: false, reason: 'parent-not-directory' };
  }
  if (parentNode.children[name] !== undefined && options.overwrite !== true) {
    return { ok: false, reason: 'already-exists' };
  }

  const newRoot = updateDirectoryAtPath(root, parentSegments, (parentDir) => ({
    kind: 'dir',
    children: { ...parentDir.children, [name]: node },
  }));
  return { ok: true, root: newRoot };
}

export type CreateFileResult = InsertNodeResult;

/**
 * Cria um arquivo vazio em `absolutePath` (usado por `touch`). Não sobrescreve
 * um nó já existente por padrão — `touch` trata "já existe" como um caso à
 * parte (no-op bem-sucedido), não como sobrescrita.
 */
export function createFile(
  root: VirtualDirectoryNode,
  absolutePath: string,
  options: { readonly overwrite?: boolean } = {},
): CreateFileResult {
  return insertNode(root, absolutePath, { kind: 'file', content: '' }, options);
}

export type RemoveNodeResult =
  | { readonly ok: true; readonly root: VirtualDirectoryNode }
  | { readonly ok: false; readonly reason: 'not-found' };

/**
 * Remove o nó (arquivo ou diretório, com sua subárvore, se houver) em
 * `absolutePath`. Não valida se um diretório está vazio — essa regra é
 * responsabilidade do comando `rm` (ver `../commands/rm.ts`), que consulta a
 * árvore antes de chamar esta função. `mv` também usa esta função
 * internamente, para remover a origem depois de copiar para o destino.
 */
export function removeNode(root: VirtualDirectoryNode, absolutePath: string): RemoveNodeResult {
  const segments = absolutePathSegments(absolutePath);
  const name = segments.at(-1);
  if (name === undefined) {
    // absolutePath === '/' — a raiz nunca pode ser removida nesta fatia.
    return { ok: false, reason: 'not-found' };
  }

  const parentSegments = segments.slice(0, -1);
  const parentNode = getNode(root, '/' + parentSegments.join('/'));
  if (
    parentNode === undefined ||
    parentNode.kind !== 'dir' ||
    parentNode.children[name] === undefined
  ) {
    return { ok: false, reason: 'not-found' };
  }

  const newRoot = updateDirectoryAtPath(root, parentSegments, (parentDir) => {
    const remainingChildren = Object.fromEntries(
      Object.entries(parentDir.children).filter(([childName]) => childName !== name),
    );
    return { kind: 'dir', children: remainingChildren };
  });
  return { ok: true, root: newRoot };
}
