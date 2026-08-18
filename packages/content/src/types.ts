import type {
  LessonCatalogEntry,
  ChallengeCatalogEntry,
  ValidationRule,
} from '@codechat/types';

export interface LessonHint {
  readonly afterAttempts: number;
  readonly text: string;
  readonly revealsAnswer?: boolean;
}

export interface LessonCommonError {
  readonly trigger: 'command' | 'output';
  readonly pattern: string;
  readonly message: string;
}

export interface LessonSetupFile {
  readonly path: string;
  readonly content: string;
  readonly permissions?: string;
}

export interface LessonSetup {
  readonly cwd: string;
  readonly files?: readonly LessonSetupFile[];
}

export interface RichLessonStep {
  readonly stepNumber: number;
  readonly title?: string;
  readonly taskText: string;
  readonly successMessage: string;
  readonly validationRules: readonly ValidationRule[];
}

export interface RichLessonCatalogEntry extends LessonCatalogEntry {
  readonly briefing: string;
  readonly theoryMarkdown: string;
  readonly taskText: string;
  readonly workedExample?: string;
  readonly setup?: LessonSetup;
  readonly hints: readonly LessonHint[];
  readonly commonErrors?: readonly LessonCommonError[];
  readonly successMessage: string;
  readonly challenge: ChallengeCatalogEntry;
  readonly steps?: readonly RichLessonStep[];
}

