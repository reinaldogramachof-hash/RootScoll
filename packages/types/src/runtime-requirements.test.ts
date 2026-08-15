import { describe, expect, it } from 'vitest';
import type {
  ExecutionAdapterId,
  LearningSegment,
  RuntimeAdapterProfile,
  RuntimeFilesystemMutability,
  RuntimeNetworkAccess,
  RuntimePersistence,
  RuntimeProcessExecution,
  RuntimeSandboxIsolation,
} from './index';

// ---------------------------------------------------------------------------
// Fixtures — Runtime Requirements v1
//
// Este arquivo cobre o contrato de restrições conceituais por adapter
// aprovado nesta fase. Os perfis abaixo são fixtures de teste que espelham
// fielmente a tabela documentada em
// docs/architecture/runtime-requirements-v1.md ("Restrições conceituais por
// adapter") — não são dado exportado de @codechat/types (a decisão de
// roteamento/aplicação real pertence a execution-engine, fora de escopo).
// ---------------------------------------------------------------------------

const RUNTIME_ADAPTER_PROFILES: Record<ExecutionAdapterId, RuntimeAdapterProfile> = {
  'virtual-shell': {
    adapterId: 'virtual-shell',
    networkAccess: 'none',
    filesystemMutability: 'session-persistent',
    processExecution: 'simulated',
    persistence: 'session',
    sandboxIsolation: 'interpreter',
  },
  pyodide: {
    adapterId: 'pyodide',
    networkAccess: 'none',
    filesystemMutability: 'ephemeral',
    processExecution: 'sandboxed',
    persistence: 'none',
    sandboxIsolation: 'wasm',
  },
  webcontainer: {
    adapterId: 'webcontainer',
    networkAccess: 'restricted',
    filesystemMutability: 'session-persistent',
    processExecution: 'sandboxed',
    persistence: 'session',
    sandboxIsolation: 'browser-container',
  },
  'remote-runner': {
    adapterId: 'remote-runner',
    networkAccess: 'restricted',
    filesystemMutability: 'ephemeral',
    processExecution: 'delegated',
    persistence: 'none',
    sandboxIsolation: 'remote-service',
    telemetryHooksPlanned: ['execution-duration'],
  },
};

/**
 * Mapeamento segmento -> adapter recomendado — espelha a tabela publicada em
 * docs/product/learning-catalog-v1.md ("Tags de tecnologia, dificuldade e
 * runtime"). Fixture local, não exportada do pacote de tipos.
 */
const ADAPTER_BY_SEGMENT: Record<LearningSegment, ExecutionAdapterId> = {
  linux: 'virtual-shell',
  macos: 'virtual-shell',
  'windows-cmd': 'virtual-shell',
  powershell: 'virtual-shell',
  git: 'virtual-shell',
  html: 'webcontainer',
  css: 'webcontainer',
  javascript: 'webcontainer',
  python: 'pyodide',
  java: 'remote-runner',
  php: 'remote-runner',
  nodejs: 'remote-runner',
  database: 'remote-runner',
  deploy: 'remote-runner',
  testing: 'remote-runner',
  debugging: 'remote-runner',
  cybersecurity: 'remote-runner',
  'information-security': 'remote-runner',
  'secure-development': 'remote-runner',
  'digital-risk': 'remote-runner',
};

describe('Runtime Requirements v1', () => {
  it('declara um RuntimeAdapterProfile completo para os 4 ExecutionAdapterId', () => {
    const adapterIds: ExecutionAdapterId[] = [
      'virtual-shell',
      'pyodide',
      'webcontainer',
      'remote-runner',
    ];
    for (const adapterId of adapterIds) {
      const profile = RUNTIME_ADAPTER_PROFILES[adapterId];
      expect(profile.adapterId).toBe(adapterId);
      expect(profile.networkAccess).toBeDefined();
      expect(profile.filesystemMutability).toBeDefined();
      expect(profile.processExecution).toBeDefined();
      expect(profile.persistence).toBeDefined();
      expect(profile.sandboxIsolation).toBeDefined();
    }
  });

  it('preserva Terminal/SO como virtual-shell, sem acesso de rede e execucao simulada', () => {
    const terminalSegments: LearningSegment[] = [
      'linux',
      'macos',
      'windows-cmd',
      'powershell',
      'git',
    ];
    for (const segment of terminalSegments) {
      expect(ADAPTER_BY_SEGMENT[segment]).toBe('virtual-shell');
    }
    const profile = RUNTIME_ADAPTER_PROFILES['virtual-shell'];
    expect(profile.networkAccess).toBe('none');
    expect(profile.processExecution).toBe('simulated');
    expect(profile.sandboxIsolation).toBe('interpreter');
  });

  it('preserva Python inicial como pyodide, isolado em WASM e sem persistencia', () => {
    expect(ADAPTER_BY_SEGMENT.python).toBe('pyodide');
    const profile = RUNTIME_ADAPTER_PROFILES.pyodide;
    expect(profile.sandboxIsolation).toBe('wasm');
    expect(profile.networkAccess).toBe('none');
    expect(profile.persistence).toBe('none');
  });

  it('preserva HTML/CSS/JavaScript como webcontainer, sandboxed em container de navegador', () => {
    const webSegments: LearningSegment[] = ['html', 'css', 'javascript'];
    for (const segment of webSegments) {
      expect(ADAPTER_BY_SEGMENT[segment]).toBe('webcontainer');
    }
    const profile = RUNTIME_ADAPTER_PROFILES.webcontainer;
    expect(profile.processExecution).toBe('sandboxed');
    expect(profile.sandboxIsolation).toBe('browser-container');
  });

  it(
    'preserva Java/PHP/Node.js, banco, deploy, testes, debugging e a familia de seguranca ' +
      'como remote-runner enquanto nao houver runtime local seguro definido',
    () => {
      const remoteRunnerSegments: LearningSegment[] = [
        'java',
        'php',
        'nodejs',
        'database',
        'deploy',
        'testing',
        'debugging',
        'cybersecurity',
        'information-security',
        'secure-development',
        'digital-risk',
      ];
      for (const segment of remoteRunnerSegments) {
        expect(ADAPTER_BY_SEGMENT[segment]).toBe('remote-runner');
      }
      const profile = RUNTIME_ADAPTER_PROFILES['remote-runner'];
      expect(profile.processExecution).toBe('delegated');
      expect(profile.sandboxIsolation).toBe('remote-service');
    },
  );

  it('nenhum adapter declara acesso de rede irrestrito ou persistencia durável nesta fase', () => {
    // Guarda de regressão: 'full' (rede) e 'durable' (persistência) não são
    // usados por nenhum adapter nesta fase (ver
    // docs/architecture/runtime-requirements-v1.md). Uma mudança futura que
    // afrouxe essa restrição deve tocar este teste e, com ele, a decisão
    // arquitetural correspondente — não deve acontecer silenciosamente.
    for (const profile of Object.values(RUNTIME_ADAPTER_PROFILES)) {
      expect(profile.networkAccess).not.toBe('full');
      expect(profile.persistence).not.toBe('durable');
    }
  });

  it(
    'o piso minimo de remote-runner nao e suficiente sozinho para Ciberseguranca ' +
      '(exige politica etica e isolamento adicional antes de exercicios praticos)',
    () => {
      // Este teste apenas fixa o piso mínimo atual de `remote-runner` — a
      // trilha `cybersecurity` está mapeada para ele hoje, mas
      // docs/architecture/runtime-requirements-v1.md explicita que isso não
      // autoriza, por si só, nenhum exercício prático de segurança. Nenhuma
      // Lesson/Challenge executável de cybersecurity existe nesta fase.
      const cybersecuritySegments: LearningSegment[] = [
        'cybersecurity',
        'information-security',
        'secure-development',
        'digital-risk',
      ];
      const baseline = RUNTIME_ADAPTER_PROFILES['remote-runner'];
      for (const segment of cybersecuritySegments) {
        expect(ADAPTER_BY_SEGMENT[segment]).toBe('remote-runner');
      }
      expect(baseline.networkAccess).toBe('restricted');
      expect(baseline.persistence).toBe('none');
      expect(baseline.filesystemMutability).toBe('ephemeral');
    },
  );

  it('tipos de apoio aceitam apenas os valores declarados nesta fase', () => {
    const networkAccessValues: RuntimeNetworkAccess[] = ['none', 'restricted', 'full'];
    const filesystemValues: RuntimeFilesystemMutability[] = [
      'none',
      'ephemeral',
      'session-persistent',
    ];
    const processValues: RuntimeProcessExecution[] = ['simulated', 'sandboxed', 'delegated'];
    const persistenceValues: RuntimePersistence[] = ['none', 'session', 'durable'];
    const isolationValues: RuntimeSandboxIsolation[] = [
      'interpreter',
      'wasm',
      'browser-container',
      'remote-service',
    ];

    expect(networkAccessValues).toHaveLength(3);
    expect(filesystemValues).toHaveLength(3);
    expect(processValues).toHaveLength(3);
    expect(persistenceValues).toHaveLength(3);
    expect(isolationValues).toHaveLength(4);
  });
});
