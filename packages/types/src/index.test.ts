import { describe, expect, it } from 'vitest';
import type {
  CommandAttemptRef,
  ExecutionRequestRef,
  ExecutionResult,
  ValidationOutcome,
  ValidationRule,
  VirtualFileSystemSnapshot,
} from './index';

describe('@codechat/types — fatia mínima Fase 1', () => {
  it('permite construir um ExecutionResult completo e engine-agnóstico', () => {
    const commandAttempt: CommandAttemptRef = { commandAttemptId: 'cmd-1' };
    const origin: ExecutionRequestRef = {
      executionRequestId: 'req-1',
      commandAttempt,
      environmentProfileId: 'linux',
    };
    const filesystem: VirtualFileSystemSnapshot = {
      cwd: '/home/aluno',
      entries: [
        { path: '/home/aluno/src', kind: 'dir' },
        { path: '/home/aluno/src/index.js', kind: 'file', content: 'console.log(1);' },
      ],
    };
    const result: ExecutionResult = {
      origin,
      command: 'mkdir src',
      stdout: '',
      stderr: '',
      exitCode: 0,
      durationMs: 12,
      adapterId: 'virtual-shell',
      filesystem,
      completedAt: '2026-08-15T00:00:00.000Z',
    };

    expect(result.origin.commandAttempt.commandAttemptId).toBe('cmd-1');
    expect(result.filesystem.entries).toHaveLength(2);
    // Regra de negócio (engine-contracts-v1.md, seção 2): ExecutionResult nunca
    // referencia Challenge/ChallengeProgress/ValidationRule.
    expect(Object.keys(result)).not.toContain('challenge');
    expect(Object.keys(result)).not.toContain('validationRule');
  });

  it('cobre cada tipo de validador definido em validation-grammar-v1.md', () => {
    const rules: ValidationRule[] = [
      { kind: 'file-exists', path: '/home/aluno/src', as: 'dir' },
      { kind: 'file-not-exists', path: '/home/aluno/temp.txt' },
      { kind: 'file-count', path: '/home/aluno/logs', glob: '*.log', min: 3, max: 3 },
      { kind: 'file-content', path: '/home/aluno/notas.txt', match: 'contains', value: 'plena' },
      {
        kind: 'file-content',
        path: '/home/aluno/notas.txt',
        match: 'equals',
        value: 'linha unica',
      },
      { kind: 'file-content', path: '/home/aluno/notas.txt', match: 'regex', pattern: '^erro:' },
      { kind: 'line-count', path: '/home/aluno/saida.txt', min: 2 },
      { kind: 'cwd', path: '/home/aluno/projeto' },
      { kind: 'permission', path: '/home/aluno/script.sh', mode: '755' },
      { kind: 'output-contains', text: 'aluno', lastCommandOnly: true },
      { kind: 'exit-code', value: 0 },
      { kind: 'command-executed', pattern: '^man\\s+ls', minTimes: 1 },
      {
        kind: 'any',
        rules: [
          { kind: 'file-content', path: '/home/aluno/a.txt', match: 'contains', value: 'ok' },
          { kind: 'file-content', path: '/home/aluno/b.txt', match: 'contains', value: 'ok' },
        ],
      },
      {
        kind: 'none',
        rules: [{ kind: 'file-exists', path: '/home/aluno/rascunho.txt', as: 'file' }],
      },
    ];

    expect(rules).toHaveLength(14);
    expect(rules.every((rule) => typeof rule.kind === 'string')).toBe(true);
  });

  it('modela o veredito de validação como sucesso, falha ou parcial', () => {
    const outcomes: ValidationOutcome[] = [
      { verdict: 'success' },
      { verdict: 'failure', message: 'arquivo não encontrado' },
      { verdict: 'partial', message: '2 de 3 validadores passaram' },
    ];

    expect(outcomes.map((outcome) => outcome.verdict)).toEqual(['success', 'failure', 'partial']);
  });
});
