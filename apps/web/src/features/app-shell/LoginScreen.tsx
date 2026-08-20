import { useState, type FormEvent, useEffect, useRef } from 'react';
import logo from '../../images/logo.svg';
import type { UserRole } from './types';

export interface LoginScreenProps {
  readonly onLogin: (role?: UserRole) => void;
}

const TERMINAL_LINES = [
  'root@rootscoll:~$ skills --list',
  '  [ok] terminal',
  '  [ok] git',
  '  [ok] programming',
  '  [ok] web',
  '  [ok] security',
  '  [ok] debugging',
  '  [ok] deploy',
  'root@rootscoll:~$ _',
];

/**
 * Tela de acesso mock com seletor de sessões (Aluno, Professor, Parceiro).
 * Qualquer submit avanca para o painel do papel escolhido.
 */
function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'aluno' | 'professor' | 'parceiro'>('aluno');
  const [showPassword, setShowPassword] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let columns = 0;
    let rainDrops: number[] = [];
    const fontSize = 14;
    const characters =
      '0101<>_$/\\{}[]+=*-;:!?#@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        columns = Math.floor(width / fontSize) + 1;
        const newDrops: number[] = [];
        for (let x = 0; x < columns; x++) {
          newDrops[x] =
            rainDrops[x] !== undefined ? (rainDrops[x] as number) : Math.random() * -100;
        }
        rainDrops = newDrops;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 8, 17, 0.14)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < rainDrops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillStyle = i % 2 === 0 ? '#36e6a5' : '#3ab8ff';
        const x = i * fontSize;
        const y = rainDrops[i]! * fontSize;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.985) {
          rainDrops[i] = 0;
        }
        rainDrops[i] = rainDrops[i]! + 0.35;
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const fullText = TERMINAL_LINES.join('\n');
    let index = 0;
    let current = '';
    const interval = setInterval(() => {
      if (index >= fullText.length) {
        clearInterval(interval);
        return;
      }
      current += fullText[index];
      setTerminalText(current);
      index++;
    }, 30);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onLogin(role);
  }

  return (
    <main className="login-screen" aria-label="Acesso ao RootScoll">
      <section className="login-welcome" aria-label="Boas-vindas ao RootScoll">
        <p className="login-welcome__eyebrow">Escola Raiz</p>
        <div className="login-welcome__logo-row">
          <img className="login-welcome__logo" src={logo} alt="RootScoll" />
          <span className="login-welcome__wordmark">RootScoll</span>
        </div>
        <h1 className="login-welcome__headline">
          Do zero à prontidão
          <br />
          profissional.
        </h1>
        <p className="login-welcome__tagline">No Modo Raiz.</p>
        <ul className="login-welcome__features" aria-label="Diferenciais">
          <li className="login-welcome__feature-item">
            <span className="login-welcome__feature-icon" aria-hidden="true">
              &lt;/&gt;
            </span>
            <div>
              <strong>Aprendizado prático</strong>
              <span>Mão na massa desde o início</span>
            </div>
          </li>
          <li className="login-welcome__feature-item">
            <span className="login-welcome__feature-icon" aria-hidden="true">
              [=]
            </span>
            <div>
              <strong>Projetos reais</strong>
              <span>Portfólio que gera impacto</span>
            </div>
          </li>
          <li className="login-welcome__feature-item">
            <span className="login-welcome__feature-icon" aria-hidden="true">
              &gt;_
            </span>
            <div>
              <strong>Prontidão profissional</strong>
              <span>Do zero à entrega com confiança</span>
            </div>
          </li>
        </ul>
        <div className="login-welcome__terminal" aria-live="polite">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div className="login-welcome__terminal-dots" aria-hidden="true" style={{ margin: 0 }}>
              <span />
              <span />
              <span />
            </div>
            {/* intencional: este bloco fica dentro de .login-welcome__terminal, que tem
                fundo fixo #0d1117 (chrome de terminal, sempre escuro por design,
                independente do tema do app) — por isso as cores aqui usam valores fixos
                claros (iguais ao texto do terminal, .login-welcome__terminal-body) em vez
                de var(--text-primary)/var(--text-muted): esses tokens ficam escuros no
                light mode e desapareceriam sobre este fundo sempre-escuro. Ver docs/frontend.md */}
            <span
              style={{
                fontSize: '11px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#c9d1d9',
              }}
              title="Para melhor experiência e imersão reativa, utilize a plataforma em Tela Cheia (F11)"
            >
              <kbd style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#c9d1d9', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '10px' }}>F11</kbd>
              Imersão Reativa
            </span>
          </div>
          <pre className="login-welcome__terminal-body">
            {terminalText}
            <span className="login-welcome__terminal-cursor" aria-hidden="true">
              |
            </span>
          </pre>
        </div>
      </section>

      <div className="login-arena">
        <canvas ref={canvasRef} className="login-arena__rain" aria-hidden="true" />
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <img className="login-card__logo" src={logo} alt="RootScoll" />
          <div className="login-card__session-picker" aria-label="Sessões de acesso">
            <span className="login-card__session-label">Sessões</span>
            <div className="login-card__tabs" role="tablist" aria-label="Sessões de acesso">
              <button
                type="button"
                className={`login-card__tab ${role === 'aluno' ? 'login-card__tab--active' : ''}`}
                onClick={() => {
                  setRole('aluno');
                  setEmail('');
                }}
              >
                Aluno
              </button>
              <button
                type="button"
                className={`login-card__tab ${role === 'professor' ? 'login-card__tab--active' : ''}`}
                onClick={() => {
                  setRole('professor');
                  setEmail('');
                }}
              >
                Professor
              </button>
              <button
                type="button"
                className={`login-card__tab ${role === 'parceiro' ? 'login-card__tab--active' : ''}`}
                onClick={() => {
                  setRole('parceiro');
                  setEmail('');
                }}
              >
                Parceiros (RH)
              </button>
            </div>
          </div>
          <div className="login-card__header">
            <h2 className="login-card__title">
              {role === 'aluno' && 'Acesso do Aluno'}
              {role === 'professor' && 'Gestão Didática (Professor)'}
              {role === 'parceiro' && 'Portal de Talentos (Parceiros RH)'}
            </h2>
            <p className="login-card__subtitle">
              {role === 'aluno' && 'Prática terminal e trilhas de aprendizagem'}
              {role === 'professor' && 'Cockpit de turmas, progresso e gargalos pedagógicos'}
              {role === 'parceiro' && 'Mapeamento e busca ativa de talentos júnior'}
            </p>
          </div>
          <label className="login-card__field">
            <span>E-mail</span>
            <input
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                role === 'aluno'
                  ? 'aluno@exemplo.com'
                  : role === 'professor'
                    ? 'professor@rootscoll.edu'
                    : 'rh@empresa.com'
              }
              required
            />
          </label>
          <label className="login-card__field">
            <span>Senha</span>
            <div className="login-card__password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="login-card__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </label>
          <div className="login-card__extra">
            <label className="login-card__checkbox">
              <input type="checkbox" />
              <span>Lembrar-me</span>
            </label>
            <button
              type="button"
              className="login-card__forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Recuperação de senha não disponível.');
              }}
            >
              Esqueceu a senha?
            </button>
          </div>
          <button type="submit" className="login-card__submit">
            {role === 'aluno' && 'Entrar na Sala do Aluno'}
            {role === 'professor' && 'Acessar Cockpit de Gestão'}
            {role === 'parceiro' && 'Acessar Banco de Talentos'}
          </button>
          <p className="login-card__note">
            Protótipo de demonstração local com dados pedagógicos mockados.
          </p>
        </form>
      </div>
    </main>
  );
}

export default LoginScreen;
