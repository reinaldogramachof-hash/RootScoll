import type { TerminalFilesystemState } from '../filesystem/types';

/**
 * Nomes dos comandos suportados nesta fatia mínima. Lista fechada de propósito
 * — a Fase 0 completa tem 21 comandos + 3 operadores
 * (docs/product/curriculum-phase-0.md), mas esta fatia implementa
 * deliberadamente só 4, por decisão arquitetural explícita desta etapa.
 */
export type TerminalCommandName = 'pwd' | 'ls' | 'cd' | 'mkdir';

/**
 * Resultado de rodar um comando: novo estado do filesystem (pode ser o mesmo
 * objeto de entrada, se o comando não mutou nada — ex.: erro, ou `pwd`/`ls`)
 * mais a saída no formato de um terminal simulado. Nunca lança exceção para
 * uma condição esperada (comando desconhecido, caminho inexistente etc.) —
 * erros viram `stderr` + `exitCode !== 0`, nunca `throw`.
 */
export interface TerminalCommandOutcome {
  readonly filesystem: TerminalFilesystemState;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
}
