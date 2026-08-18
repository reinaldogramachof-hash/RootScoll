export * from './types.js';
export * from './tracks.js';
export * from './courses/fundamentos-terminal.js';
export * from './lessons/mvp-blocks.js';

import { TRACKS } from './tracks.js';
import { COURSE_FUNDAMENTOS_TERMINAL, MODULES_FUNDAMENTOS_TERMINAL } from './courses/fundamentos-terminal.js';
import { MVP_LESSONS } from './lessons/mvp-blocks.js';
import type { RichLessonCatalogEntry } from './types.js';
import type { CourseCatalogEntry, ModuleCatalogEntry } from '@codechat/types';

export function getAllCourses(): readonly CourseCatalogEntry[] {
  return [COURSE_FUNDAMENTOS_TERMINAL];
}

export function getCourseById(courseId: string): CourseCatalogEntry | undefined {
  return getAllCourses().find((c) => c.courseId === courseId);
}

export function getCoursesByTrackId(trackId: string): readonly CourseCatalogEntry[] {
  return getAllCourses().filter((c) => c.trackId === trackId);
}

export function getModulesByCourseId(courseId: string): readonly ModuleCatalogEntry[] {
  return MODULES_FUNDAMENTOS_TERMINAL.filter((m) => m.courseId === courseId);
}

export function getModuleById(moduleId: string): ModuleCatalogEntry | undefined {
  return MODULES_FUNDAMENTOS_TERMINAL.find((m) => m.moduleId === moduleId);
}

export function getLessonsByModuleId(moduleId: string): readonly RichLessonCatalogEntry[] {
  const mod = getModuleById(moduleId);
  if (!mod) return [];
  return mod.lessonIds
    .map((id) => MVP_LESSONS.find((l) => l.lessonId === id))
    .filter((l): l is RichLessonCatalogEntry => l !== undefined);
}
