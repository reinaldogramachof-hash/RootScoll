import { getNode } from '@codechat/terminal-engine';
import type { TerminalFilesystemState } from '@codechat/terminal-engine';
import type { ValidationRule } from '@codechat/types';
import { MVP_LESSONS } from '@codechat/content';
import type { RichLessonCatalogEntry } from '@codechat/content';
import type { LearningBlock, PracticeStep } from './types';

/**
 * Valida um conjunto de regras contra o estado atual do sistema de arquivos virtual.
 */
export function evaluateRules(rules: readonly ValidationRule[], filesystem: TerminalFilesystemState): boolean {
  return rules.every((rule) => {
    if (rule.kind === 'file-exists') {
      const node = getNode(filesystem.root, rule.path);
      return node !== undefined && node.kind === rule.as;
    }
    if (rule.kind === 'file-not-exists') {
      return getNode(filesystem.root, rule.path) === undefined;
    }
    if (rule.kind === 'file-content') {
      const node = getNode(filesystem.root, rule.path);
      if (!node || node.kind !== 'file') return false;
      if (rule.match === 'contains') return node.content.includes(rule.value);
      if (rule.match === 'equals') return node.content.trim() === rule.value.trim();
      return true;
    }
    if (rule.kind === 'cwd') {
      return filesystem.cwd === rule.path;
    }
    return true;
  });
}

/**
 * Converte uma RichLessonCatalogEntry do pacote @codechat/content em um LearningBlock
 * executável pelo componente de Sala Terminal (LearningFlowApp).
 */
export function convertRichLessonToBlock(lesson: RichLessonCatalogEntry): LearningBlock {
  const steps: PracticeStep[] = lesson.steps && lesson.steps.length > 0
    ? lesson.steps.map((s) => ({
        id: `${lesson.lessonId}-step-${s.stepNumber}`,
        stepNumber: s.stepNumber,
        title: s.title,
        objective: s.taskText,
        successMessage: s.successMessage,
        isComplete: (filesystem) => evaluateRules(s.validationRules, filesystem),
      }))
    : [
        {
          id: `${lesson.lessonId}-step-1`,
          stepNumber: 1,
          objective: lesson.taskText,
          successMessage: lesson.successMessage,
          isComplete: (filesystem) => evaluateRules(lesson.challenge.validationRules, filesystem),
        },
      ];

  return {
    id: lesson.lessonId,
    title: `${lesson.order}. ${lesson.title}`,
    theory: {
      title: lesson.title,
      paragraphs: [
        lesson.briefing,
        ...lesson.theoryMarkdown
          .split('\n\n')
          .map((p) => p.trim())
          .filter((p) => p.length > 0 && !p.startsWith('#')),
      ],
    },
    practice: {
      objective: lesson.taskText,
      suggestedCommands: lesson.hints.map((h) => h.text),
    },
    steps,
    assessment: {
      successMessage: lesson.successMessage,
      isComplete: (filesystem) => evaluateRules(lesson.challenge.validationRules, filesystem),
    },
    mentorHints: lesson.hints.map((h) => ({
      afterAttempts: h.afterAttempts,
      text: h.text,
    })),
  };
}

/**
 * Os 20 blocos MVP provenientes do pacote oficial @codechat/content.
 */
export const LEARNING_BLOCKS: readonly LearningBlock[] = MVP_LESSONS.map(convertRichLessonToBlock);

