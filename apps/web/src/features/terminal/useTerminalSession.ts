import { useCallback, useMemo, useState } from 'react';
import { createInitialFilesystemState, runCommand } from '@codechat/terminal-engine';
import type { TerminalFilesystemState } from '@codechat/terminal-engine';
import { LESSONS } from '../lessons/lessons';
import type { Lesson, LessonStatus } from '../lessons/types';
import { promptLabel, splitLines } from './terminal-format';

export type TerminalLineKind = 'system' | 'comment' | 'prompt' | 'output' | 'error' | 'success';

export interface TerminalOutputLine {
  readonly id: number;
  readonly kind: TerminalLineKind;
  readonly text: string;
}

let lineIdCounter = 0;
function nextLineId(): number {
  lineIdCounter += 1;
  return lineIdCounter;
}

function lessonIntroLines(lesson: Lesson): TerminalOutputLine[] {
  return [
    { id: nextLineId(), kind: 'comment', text: `# ${lesson.title}` },
    { id: nextLineId(), kind: 'comment', text: `# Objetivo: ${lesson.objective}` },
  ];
}

function initialLines(): TerminalOutputLine[] {
  const lines: TerminalOutputLine[] = [
    { id: nextLineId(), kind: 'system', text: 'CodeChat Terminal — Fase 0' },
  ];
  const firstLesson = LESSONS[0];
  if (firstLesson !== undefined) {
    lines.push(...lessonIntroLines(firstLesson));
  }
  return lines;
}

/**
 * Sessão de terminal desta fatia: liga `@codechat/terminal-engine`
 * (`runCommand`/`createInitialFilesystemState`) ao ciclo de vida de uma
 * lição local (`../lessons`). Todo o estado vive em memória, no componente
 * React — sem `localStorage`/`sessionStorage`, sem backend, consistente com
 * `persistence: 'session'` do perfil `virtual-shell`
 * (`docs/architecture/runtime-requirements-v1.md`): a sessão dura enquanto a
 * página estiver aberta, nunca entre sessões.
 */
export function useTerminalSession() {
  const [filesystem, setFilesystem] = useState<TerminalFilesystemState>(() =>
    createInitialFilesystemState(),
  );
  const [lines, setLines] = useState<readonly TerminalOutputLine[]>(() => initialLines());
  const [inputValue, setInputValue] = useState('');
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lessonStatus, setLessonStatus] = useState<LessonStatus>('pending');

  const currentLesson = LESSONS[lessonIndex];
  const hasNextLesson = LESSONS[lessonIndex + 1] !== undefined;

  const submitCommand = useCallback(() => {
    const commandLine = inputValue;
    setInputValue('');

    setLines((prev) => [
      ...prev,
      { id: nextLineId(), kind: 'prompt', text: `${promptLabel(filesystem.cwd)} ${commandLine}` },
    ]);

    if (commandLine.trim().length === 0) {
      return;
    }

    const outcome = runCommand(filesystem, commandLine);
    setFilesystem(outcome.filesystem);

    const outputLines: TerminalOutputLine[] = [
      ...splitLines(outcome.stdout).map((text) => ({
        id: nextLineId(),
        kind: 'output' as const,
        text,
      })),
      ...splitLines(outcome.stderr).map((text) => ({
        id: nextLineId(),
        kind: 'error' as const,
        text,
      })),
    ];

    const justCompleted =
      lessonStatus === 'pending' &&
      currentLesson !== undefined &&
      currentLesson.isComplete(outcome.filesystem);

    if (justCompleted && currentLesson !== undefined) {
      setLessonStatus('success');
      outputLines.push({ id: nextLineId(), kind: 'success', text: currentLesson.successMessage });
    }

    if (outputLines.length > 0) {
      setLines((prev) => [...prev, ...outputLines]);
    }
  }, [inputValue, filesystem, currentLesson, lessonStatus]);

  const advanceLesson = useCallback(() => {
    const nextIndex = lessonIndex + 1;
    const nextLesson = LESSONS[nextIndex];
    if (nextLesson === undefined) {
      return;
    }
    setLessonIndex(nextIndex);
    setLessonStatus('pending');
    setLines((prev) => [
      ...prev,
      { id: nextLineId(), kind: 'system', text: '' },
      ...lessonIntroLines(nextLesson),
    ]);
  }, [lessonIndex]);

  const progress = useMemo(
    () => ({ current: lessonIndex + 1, total: LESSONS.length }),
    [lessonIndex],
  );

  return {
    lines,
    inputValue,
    setInputValue,
    submitCommand,
    cwd: filesystem.cwd,
    prompt: promptLabel(filesystem.cwd),
    currentLesson,
    lessonStatus,
    hasNextLesson,
    advanceLesson,
    progress,
  };
}
