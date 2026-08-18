import { describe, it, expect } from 'vitest';
import {
  TRACKS,
  MVP_LESSONS,
  COURSE_FUNDAMENTOS_TERMINAL,
  MODULES_FUNDAMENTOS_TERMINAL,
  getAllCourses,
  getCoursesByTrackId,
  getModulesByCourseId,
  getLessonsByModuleId,
  getLessonById,
} from './index.js';

describe('Learning Content Repository (@codechat/content)', () => {
  it('should export 6 strategic learning tracks', () => {
    expect(TRACKS).toHaveLength(6);
    expect(TRACKS.map((t) => t.trackId)).toEqual([
      'terminal-os',
      'git-github',
      'web',
      'programming',
      'professional-practice',
      'cybersecurity',
    ]);
  });

  it('should contain the 20 MVP blocks', () => {
    expect(MVP_LESSONS).toHaveLength(20);
  });

  it('should resolve courses by track', () => {
    const terminalCourses = getCoursesByTrackId('terminal-os');
    expect(terminalCourses).toHaveLength(1);
    expect(terminalCourses[0]?.courseId).toBe('fundamentos-terminal');
  });

  it('should resolve modules by course', () => {
    const modules = getModulesByCourseId('fundamentos-terminal');
    expect(modules).toHaveLength(3);
  });

  it('should resolve lessons by module with zero orphan IDs', () => {
    for (const mod of MODULES_FUNDAMENTOS_TERMINAL) {
      const lessons = getLessonsByModuleId(mod.moduleId);
      expect(lessons.length).toBeGreaterThan(0);
      expect(lessons.length).toBe(mod.lessonIds.length);
    }
  });

  it('should ensure all MVP lessons have valid challenges and validation rules', () => {
    for (const lesson of MVP_LESSONS) {
      expect(lesson.challenge).toBeDefined();
      expect(lesson.challenge.validationRules.length).toBeGreaterThan(0);
      expect(lesson.theoryMarkdown).toBeTruthy();
      expect(lesson.briefing).toBeTruthy();
      expect(lesson.taskText).toBeTruthy();
    }
  });

  it('should correctly look up individual lesson by ID', () => {
    const lesson = getLessonById('03-onde-estou');
    expect(lesson).toBeDefined();
    expect(lesson?.title).toBe('Onde estou?');
  });
});
