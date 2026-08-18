import React, { useEffect, useRef, type FormEvent } from 'react';
import type { TerminalOutputLine } from './useTerminalSession';

export interface TerminalScreenProps {
  readonly lines: readonly TerminalOutputLine[];
  readonly inputValue: string;
  readonly onInputChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly prompt: string;
}

/**
 * Auxiliar para renderizar inline markdown (`código`, **negrito**) nas linhas do terminal.
 */
function renderFormattedLineText(text: string): React.ReactNode {
  if (!text) return null;

  // Regex para capturar `código` ou **negrito**
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\**)/g);

  return tokens.map((token, idx) => {
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code key={idx} className="terminal-code-chip">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={idx} className="terminal-strong">
          {token.slice(2, -2)}
        </strong>
      );
    }
    return token;
  });
}

/**
 * Tela de terminal (linhas + linha de input) — extraída de
 * `TerminalApp.tsx` (Fase 1) para ser reutilizável por
 * `../learning-flow/LearningFlowApp.tsx`.
 * Suporta renderização de terminal contínuo com formato rico.
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
          {renderFormattedLineText(line.text)}
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

