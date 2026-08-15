/**
 * Parser simples desta fatia: apenas tokenização por espaço em branco. Sem
 * suporte a aspas, `|`, `>`/`>>` — a Fase 0 trava a decisão de que o parser
 * "nasce com pipeline e redirecionamento" quando implementado
 * (docs/product/curriculum-phase-0.md, seção 2, "Operadores"), mas essa
 * implementação completa fica para a fatia em que os comandos de nível 2+
 * forem adicionados; esta fatia cobre apenas os 4 comandos aprovados, todos
 * sem necessidade de composição.
 */
export function tokenizeCommandLine(commandLine: string): readonly string[] {
  return commandLine
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0);
}
