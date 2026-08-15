import './styles/app.css';

const terminalLines = [
  { kind: 'system', text: 'CodeChat Terminal - Fase 0 / Licao 01' },
  { kind: 'comment', text: '# Objetivo: descubra onde voce esta e liste o conteudo da pasta.' },
  { kind: 'prompt', text: 'aluno@plena:~$ pwd' },
  { kind: 'output', text: '/home/aluno' },
  { kind: 'prompt', text: 'aluno@plena:~$ ls' },
  { kind: 'output', text: 'documentos  downloads  leiame.txt' },
  { kind: 'success', text: '[ok] pwd mostra o caminho atual. ls mostra o que existe ali.' },
  { kind: 'comment', text: '# Proxima acao: continue digitando no terminal para avancar.' },
];

function App() {
  return (
    <main className="terminal-app" aria-label="CodeChat terminal em tela cheia">
      <section className="terminal-window" aria-label="Terminal da aplicacao">
        <div className="terminal-titlebar" aria-hidden="true">
          <span />
          <span />
          <span />
          <strong>aluno@plena:~</strong>
        </div>

        <div className="terminal-screen">
          {terminalLines.map((line, index) => (
            <p
              className={`terminal-line terminal-line--${line.kind}`}
              key={`${line.text}-${index}`}
            >
              {line.text}
            </p>
          ))}

          <p className="terminal-line terminal-line--prompt">
            aluno@plena:~$ <span className="terminal-cursor">_</span>
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
