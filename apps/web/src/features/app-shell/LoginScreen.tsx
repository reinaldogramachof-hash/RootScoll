import { useState, type FormEvent, useEffect, useRef } from 'react';
import logo from '../../images/logo.svg';

export interface LoginScreenProps {
  readonly onLogin: () => void;
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
 * Tela de acesso mock. Qualquer submit avanca para o painel porque ainda nao
 * existe autenticacao real, sessao de servidor ou Supabase nesta fatia.
 */
function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'aluno' | 'professor' | 'parceiros'>('aluno');
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
    const characters = '0101<>_$/\\{}[]+=*-;:!?#@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        columns = Math.floor(width / fontSize) + 1;
        const newDrops: number[] = [];
        for (let x = 0; x < columns; x++) {
          newDrops[x] = rainDrops[x] !== undefined ? (rainDrops[x] as number) : Math.random() * -100;
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
        if (y > canvas.height && Math.random() > 0.985) { rainDrops[i] = 0; }
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
      if (index >= fullText.length) { clearInterval(interval); return; }
      current += fullText[index];
      setTerminalText(current);
      index++;
    }, 30);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onLogin();
  }

  return (
    <main className="login-screen" aria-label="Acesso ao RootScoll">
      <section className="login-welcome" aria-label="Boas-vindas ao RootScoll">
        <p className="login-welcome__eyebrow">Escola Raiz</p>
        <div className="login-welcome__logo-row">
          <img className="login-welcome__logo" src={logo} alt="RootScoll" />
          <span className="login-welcome__wordmark">RootScoll</span>
        </div>
        <h1 className="login-welcome__headline">Do zero a prontidao<br />profissional.</h1>
        <p className="login-welcome__tagline">No Modo Raiz.</p>
        <ul className="login-welcome__features" aria-label="Diferenciais">
          <li className="login-welcome__feature-item">
            <span className="login-welcome__feature-icon" aria-hidden="true">&lt;/&gt;</span>
            <div><strong>Aprendizado pratico</strong><span>Mao na massa desde o inicio</span></div>
          </li>
          <li className="login-welcome__feature-item">
            <span className="login-welcome__feature-icon" aria-hidden="true">[=]</span>
            <div><strong>Projetos reais</strong><span>Portfolio que gera impacto</span></div>
          </li>
          <li className="login-welcome__feature-item">
            <span className="login-welcome__feature-icon" aria-hidden="true">&gt;_</span>
            <div><strong>Prontidao profissional</strong><span>Do zero a entrega com confianca</span></div>
          </li>
        </ul>
        <div className="login-welcome__terminal" aria-live="polite">
          <div className="login-welcome__terminal-dots" aria-hidden="true">
            <span /><span /><span />
          </div>
          <pre className="login-welcome__terminal-body">{terminalText}<span className="login-welcome__terminal-cursor" aria-hidden="true">|</span></pre>
        </div>
      </section>

      <div className="login-arena">
        <canvas ref={canvasRef} className="login-arena__rain" aria-hidden="true" />
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <img className="login-card__logo" src={logo} alt="RootScoll" />
          <div className="login-card__session-picker" aria-label="Sessões de acesso">
            <span className="login-card__session-label">Sessões</span>
            <div className="login-card__tabs" role="tablist" aria-label="Sessões de acesso">
              <button type="button" className={`login-card__tab ${role === 'aluno' ? 'login-card__tab--active' : ''}`} onClick={() => { setRole('aluno'); setEmail(''); }}>Aluno</button>
              <button type="button" className={`login-card__tab ${role === 'professor' ? 'login-card__tab--active' : ''}`} onClick={() => { setRole('professor'); setEmail(''); }}>Professor</button>
              <button type="button" className={`login-card__tab ${role === 'parceiros' ? 'login-card__tab--active' : ''}`} onClick={() => { setRole('parceiros'); setEmail(''); }}>Parceiros</button>
            </div>
          </div>
          <div className="login-card__header">
            <h2 className="login-card__title">
              {role === 'aluno' && 'Acesso do Aluno'}
              {role === 'professor' && 'Acesso do Professor'}
              {role === 'parceiros' && 'Acesso de Parceiros'}
            </h2>
            <p className="login-card__subtitle">Ambiente local de demonstracao</p>
          </div>
          <label className="login-card__field">
            <span>E-mail</span>
            <input type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'aluno' ? 'aluno@exemplo.com' : role === 'professor' ? 'professor@exemplo.com' : 'parceiro@exemplo.com'}
              required />
          </label>
          <label className="login-card__field">
            <span>Senha</span>
            <div className="login-card__password-wrapper">
              <input type={showPassword ? 'text' : 'password'} autoComplete="off" value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" className="login-card__password-toggle" onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </label>
          <div className="login-card__extra">
            <label className="login-card__checkbox"><input type="checkbox" /><span>Lembrar-me</span></label>
            <button type="button" className="login-card__forgot" onClick={(e) => { e.preventDefault(); alert('Recuperacao de senha nao disponivel.'); }}>Esqueceu a senha?</button>
          </div>
          <button type="submit" className="login-card__submit">Entrar no painel</button>
          <p className="login-card__note">Qualquer valor entra neste prototipo; credenciais reais entram em outra etapa.</p>
        </form>
      </div>
    </main>
  );
}

export default LoginScreen;
