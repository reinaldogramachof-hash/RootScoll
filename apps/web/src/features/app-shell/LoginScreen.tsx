import { useState, type FormEvent } from 'react';
import logo from '../../images/logo.png';

export interface LoginScreenProps {
  readonly onLogin: () => void;
}

/**
 * Tela de acesso — login mock, sem autenticação real. Os campos existem
 * para dar a forma real de um login (o que o usuário vai eventualmente
 * encontrar), mas qualquer submit avança para o painel: não há verificação
 * de credenciais, sessão de servidor ou Supabase. Isso é dito explicitamente
 * na tela, não escondido do aluno-piloto.
 */
function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onLogin();
  }

  return (
    <main className="login-screen" aria-label="Acesso ao RootScoll">
      <form className="login-card" onSubmit={handleSubmit}>
        <img className="login-card__logo" src={logo} alt="" aria-hidden="true" />
        <h1 className="login-card__title">RootScoll</h1>
        <p className="login-card__subtitle">
          Acesso local de demonstração — sem autenticação real.
        </p>

        <label className="login-card__field">
          <span>E-mail</span>
          <input
            type="email"
            autoComplete="off"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="aluno@exemplo.com"
          />
        </label>

        <label className="login-card__field">
          <span>Senha</span>
          <input
            type="password"
            autoComplete="off"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </label>

        <button type="submit" className="login-card__submit">
          Entrar
        </button>

        <p className="login-card__note">
          Qualquer valor entra — este ambiente ainda não tem autenticação real.
        </p>
      </form>
    </main>
  );
}

export default LoginScreen;
