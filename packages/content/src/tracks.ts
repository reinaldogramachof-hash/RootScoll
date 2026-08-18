import type { LearningTrack } from '@codechat/types';

export const TRACKS: readonly LearningTrack[] = [
  {
    trackId: 'terminal-os',
    name: 'Terminal e Sistemas Operacionais',
    description: 'Navegação por linha de comando, manipulação segura de arquivos e fundamentos de SO.',
    segments: ['linux', 'macos', 'windows-cmd', 'powershell'],
  },
  {
    trackId: 'git-github',
    name: 'Git e GitHub',
    description: 'Controle de versão local e colaboração profissional no GitHub.',
    segments: ['git'],
  },
  {
    trackId: 'web',
    name: 'Desenvolvimento Web Base',
    description: 'HTML5 semântico, CSS3 responsivo, acessibilidade e interatividade com DOM.',
    segments: ['html', 'css', 'javascript'],
  },
  {
    trackId: 'programming',
    name: 'Programação de Sistemas',
    description: 'Lógica, TypeScript, algoritmos, tratamento de exceções e estruturas de dados.',
    segments: ['javascript', 'nodejs', 'python', 'java', 'php'],
  },
  {
    trackId: 'professional-practice',
    name: 'Prática Profissional e Engenharia',
    description: 'Testes automatizados, banco de dados SQL, APIs HTTP, debugging e operação.',
    segments: ['database', 'deploy', 'testing', 'debugging'],
  },
  {
    trackId: 'cybersecurity',
    name: 'Segurança Cibernética Básica',
    description: 'Conceitos de OWASP, desenvolvimento seguro e higiene digital.',
    segments: ['cybersecurity', 'information-security', 'secure-development', 'digital-risk'],
  },
];

export function getTrackById(trackId: string): LearningTrack | undefined {
  return TRACKS.find((t) => t.trackId === trackId);
}
