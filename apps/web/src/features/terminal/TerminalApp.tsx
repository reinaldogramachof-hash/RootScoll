import { useEffect, useRef, type FormEvent } from 'react';
import '../../styles/app.css';
import { useTerminalSession } from './useTerminalSession';

/**
 * Primeira experiência executável local da Fase 0 (ver Implementation
 * Report): terminal fullscreen já aprovado (`docs/architecture` — protótipo
 * visual), agora ligado de verdade a `@codechat/terminal-engine` via
 * `useTerminalSession`. Mantém a mesma direção visual (janela de terminal
 * escura, prompt monoespaçado) — a única adição estrutural é uma barra fina
 * de lição entre a titlebar e a tela, sem competir com o terminal.
 */
function TerminalApp() {
  const {
    lines,
    inputValue,
    setInputValue,
    submitCommand,
    prompt,
    currentLesson,
    lessonStatus,
    hasNextLesson,
    advanceLesson,
    progress,
  } = useTerminalSession();

  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (screen) {
      screen.scrollTop = screen.scrollHeight;
    }
  }, [lines]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    submitCommand();
  }

  function focusInput(): void {
    inputRef.current?.focus();
  }

  return (
    <main
      className="terminal-app"
      aria-label="CodeChat terminal em tela cheia"
      onClick={focusInput}
    >
      <section className="terminal-window" aria-label="Terminal da aplicacao">
        <div className="terminal-titlebar" aria-hidden="true">
          <span />
          <span />
          <span />
          <strong>aluno@plena:~</strong>
        </div>

        {currentLesson !== undefined && (
          <div className="lesson-bar" aria-label="Licao atual">
            <span className="lesson-bar__progress">
              Lição {progress.current}/{progress.total}
            </span>
            <span className="lesson-bar__title">{currentLesson.title}</span>
            <span className="lesson-bar__objective">{currentLesson.objective}</span>
            <span className={`lesson-bar__status lesson-bar__status--${lessonStatus}`}>
              {lessonStatus === 'success' ? 'Concluída' : 'Em andamento'}
            </span>
            {lessonStatus === 'success' && hasNextLesson && (
              <button type="button" className="lesson-bar__next" onClick={advanceLesson}>
                Próxima lição →
              </button>
            )}
          </div>
        )}

        <div className="terminal-screen" ref={screenRef}>
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
              onChange={(event) => setInputValue(event.target.value)}
              aria-label="Digite um comando"
              autoFocus
            />
          </form>
        </div>
      </section>
    </main>
  );
}

export default TerminalApp;
