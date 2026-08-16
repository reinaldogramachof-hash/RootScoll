import { useEffect, useRef, type FormEvent } from 'react';
import type { TerminalOutputLine } from './useTerminalSession';

export interface TerminalScreenProps {
  readonly lines: readonly TerminalOutputLine[];
  readonly inputValue: string;
  readonly onInputChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly prompt: string;
}

/**
 * Tela de terminal (linhas + linha de input) — extraída de
 * `TerminalApp.tsx` (Fase 1) para ser reutilizável por
 * `../learning-flow/LearningFlowApp.tsx`, que só a renderiza nas etapas
 * `practice`/`assessment` (ver Implementation Report desta fatia, "Decisões
 * técnicas": "o terminal só deve ficar ativo na etapa prática/avaliação
 * prática"). Puramente apresentacional — toda a mecânica de sessão continua
 * em `useTerminalSession`.
 */
function TerminalScreen({
  lines,
  inputValue,
  onInputChange,
  onSubmit,
  prompt,
}: TerminalScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (screen) {
      screen.scrollTop = screen.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit();
  }

  function focusInput(): void {
    inputRef.current?.focus();
  }

  return (
    <div className="terminal-screen" ref={screenRef} onClick={focusInput}>
      {lines.map((line) => (
        <p className={`terminal-line terminal-line--${line.kind}`} key={line.id}>
          {line.text}
        </p>
      ))}

      <form className="terminal-input-line" onSubmit={handleSubmit}>
        <label className="terminal-input-line__prompt" htmlFor="terminal-command-input">
          {prompt}
        </label>
        <input
          id="terminal-command-input"
          ref={inputRef}
          className="terminal-input-line__input"
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          aria-label="Digite um comando"
          autoFocus
        />
      </form>
    </div>
  );
}

export default TerminalScreen;
