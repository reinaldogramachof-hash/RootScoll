import { useCallback, useState } from 'react';
import { createInitialFilesystemState, runCommand } from '@codechat/terminal-engine';
import type { TerminalCommandOutcome, TerminalFilesystemState } from '@codechat/terminal-engine';
import { promptLabel, splitLines } from './terminal-format';

export type TerminalLineKind = 'system' | 'comment' | 'prompt' | 'output' | 'error' | 'success';

export interface TerminalOutputLine {
  readonly id: number;
  readonly kind: TerminalLineKind;
  readonly text: string;
}

let lineIdCounter = 0;
function nextLineId(): number {
  lineIdCounter += 1;
  return lineIdCounter;
}

/**
 * Mecânica de terminal desta fatia: liga `@codechat/terminal-engine`
 * (`runCommand`/`createInitialFilesystemState`) ao ciclo de vida de uma
 * sessão de linhas em memória — sem `localStorage`/`sessionStorage`, sem
 * backend, consistente com `persistence: 'session'` do perfil
 * `virtual-shell` (`docs/architecture/runtime-requirements-v1.md`).
 *
 * Deliberadamente agnóstico de lição/bloco pedagógico (ver Implementation
 * Report, "Decisões técnicas"): antes desta fatia (Fase 1), este hook
 * conhecia `LESSONS` diretamente; agora ele só executa comandos e expõe o
 * resultado — quem decide o que fazer com o resultado (avaliação, dicas do
 * mentor, avanço de etapa) é `../learning-flow/useLearningFlow.ts`, que
 * compõe este hook chamando `submitCommand()` e inspecionando o retorno, em
 * vez de este hook aceitar um callback injetado (evita a dependência
 * circular "hook precisa do próprio retorno de outro hook").
 */
export function useTerminalSession() {
  const [filesystem, setFilesystem] = useState<TerminalFilesystemState>(() =>
    createInitialFilesystemState(),
  );
  const [lines, setLines] = useState<readonly TerminalOutputLine[]>(() => [
    { id: nextLineId(), kind: 'system', text: 'RootScoll Terminal — Modo Raiz' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const pushLine = useCallback((kind: TerminalLineKind, text: string) => {
    setLines((prev) => [...prev, { id: nextLineId(), kind, text }]);
  }, []);

  const submitCommand = useCallback((): TerminalCommandOutcome | undefined => {
    const commandLine = inputValue;
    setInputValue('');

    setLines((prev) => [
      ...prev,
      { id: nextLineId(), kind: 'prompt', text: `${promptLabel(filesystem.cwd)} ${commandLine}` },
    ]);

    if (commandLine.trim().length === 0) {
      return undefined;
    }

    const outcome = runCommand(filesystem, commandLine);
    setFilesystem(outcome.filesystem);

    const outputLines: TerminalOutputLine[] = [
      ...splitLines(outcome.stdout).map((text) => ({
        id: nextLineId(),
        kind: 'output' as const,
        text,
      })),
      ...splitLines(outcome.stderr).map((text) => ({
        id: nextLineId(),
        kind: 'error' as const,
        text,
      })),
    ];

    if (outputLines.length > 0) {
      setLines((prev) => [...prev, ...outputLines]);
    }

    return outcome;
  }, [inputValue, filesystem]);

  return {
    lines,
    inputValue,
    setInputValue,
    submitCommand,
    pushLine,
    cwd: filesystem.cwd,
    prompt: promptLabel(filesystem.cwd),
    filesystem,
  };
}
