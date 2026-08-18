import { describe, it, expect } from 'vitest';
import { evaluateRule, evaluateRules } from './evaluator.js';
import type { ExecutionResult, ValidationRule } from '@codechat/types';

const mockExecutionResult = (overrides?: Partial<ExecutionResult>): ExecutionResult => ({
  origin: {
    executionRequestId: 'req-1',
    commandAttempt: { commandAttemptId: 'att-1' },
    environmentProfileId: 'linux',
  },
  command: 'pwd',
  stdout: '/home/aluno\n',
  stderr: '',
  exitCode: 0,
  durationMs: 5,
  adapterId: 'virtual-shell',
  filesystem: {
    cwd: '/home/aluno',
    entries: [
      { path: '/home/aluno/README.md', kind: 'file', content: '# Olá Mundo' },
      { path: '/home/aluno/src', kind: 'dir' },
    ],
  },
  completedAt: new Date().toISOString(),
  ...overrides,
});

describe('Evaluator Engine (apps/web)', () => {
  it('should evaluate exit-code rule', () => {
    const rule: ValidationRule = { kind: 'exit-code', value: 0 };
    expect(evaluateRule(rule, mockExecutionResult()).verdict).toBe('success');
    expect(evaluateRule(rule, mockExecutionResult({ exitCode: 1 })).verdict).toBe('failure');
  });

  it('should evaluate cwd rule', () => {
    const rule: ValidationRule = { kind: 'cwd', path: '/home/aluno' };
    expect(evaluateRule(rule, mockExecutionResult()).verdict).toBe('success');
    expect(evaluateRule(rule, mockExecutionResult({ filesystem: { cwd: '/home', entries: [] } })).verdict).toBe('failure');
  });

  it('should evaluate file-exists rule', () => {
    const rule: ValidationRule = { kind: 'file-exists', path: '/home/aluno/README.md', as: 'file' };
    expect(evaluateRule(rule, mockExecutionResult()).verdict).toBe('success');
  });

  it('should evaluate file-content rule', () => {
    const rule: ValidationRule = { kind: 'file-content', path: '/home/aluno/README.md', match: 'contains', value: 'Olá' };
    expect(evaluateRule(rule, mockExecutionResult()).verdict).toBe('success');
  });

  it('should evaluate output-contains rule', () => {
    const rule: ValidationRule = { kind: 'output-contains', text: '/home/aluno' };
    expect(evaluateRule(rule, mockExecutionResult()).verdict).toBe('success');
  });

  it('should evaluate composite AND rules via evaluateRules', () => {
    const rules: ValidationRule[] = [
      { kind: 'exit-code', value: 0 },
      { kind: 'cwd', path: '/home/aluno' },
      { kind: 'file-exists', path: '/home/aluno/README.md', as: 'file' },
    ];
    const outcome = evaluateRules(rules, mockExecutionResult());
    expect(outcome.verdict).toBe('success');
  });
});
