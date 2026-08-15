/**
 * Resolução de caminhos — funções puras, sem acesso ao filesystem (apenas
 * matemática de strings). Suporta o mínimo exigido nesta fatia: nomes simples
 * e `..`, generalizado para caminhos com múltiplos segmentos e caminhos
 * absolutos, porque a mesma lógica de split/push/pop já cobre esses casos sem
 * custo extra de complexidade. `~` (home) e `-` (diretório anterior) NÃO são
 * suportados nesta fatia — dependem de conceito de sessão/histórico que ainda
 * não existe (fora de escopo; ver docs/product/curriculum-phase-0.md, que já
 * previa esses casos para uma fase futura mais completa do parser).
 */

/** Divide um caminho em segmentos, descartando vazios e `.` (diretório atual). */
function splitSegments(path: string): string[] {
  return path.split('/').filter((segment) => segment.length > 0 && segment !== '.');
}

/**
 * Resolve `input` (relativo ou absoluto) contra `cwd` (sempre absoluto),
 * retornando um caminho absoluto normalizado. `..` na raiz é um no-op (não
 * lança erro, não sai da árvore) — mesmo comportamento de um shell real.
 */
export function resolvePath(cwd: string, input: string): string {
  const startSegments = input.startsWith('/') ? [] : splitSegments(cwd);
  const stack: string[] = [...startSegments];

  for (const segment of splitSegments(input)) {
    if (segment === '..') {
      stack.pop();
      continue;
    }
    stack.push(segment);
  }

  return '/' + stack.join('/');
}

/** Divide um caminho absoluto já resolvido em seus segmentos (uso interno de `./tree.ts`). */
export function absolutePathSegments(absolutePath: string): string[] {
  return splitSegments(absolutePath);
}
