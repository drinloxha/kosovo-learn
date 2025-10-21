// Kompetenca: Jetë/punë/mjedis për planifikimin e burimeve mësimore
// Rezultati i të nxënit: Strukturon bibliotekën sipas javëve dhe kompetencave për lëndët
// Evidencë: Secili mësim ruan javën, kompetencat dhe kriteret për log-jet në localStorage

import { curriculum } from './curriculum';

const subjectMeta = {
  Matematikë: { icon: '🧮', color: '#eef2ff' },
  'Gjuha shqipe': { icon: '📚', color: '#fef3c7' },
  'Gjuhë shqipe': { icon: '📚', color: '#fef3c7' },
  Shkencë: { icon: '🔬', color: '#dbeafe' },
  Biologji: { icon: '🌿', color: '#dcfce7' },
  Fizikë: { icon: '⚛️', color: '#ede9fe' },
  Kimi: { icon: '🧪', color: '#fee2e2' },
  Letërsi: { icon: '✍️', color: '#fae8ff' },
  'Letërsi': { icon: '✍️', color: '#fae8ff' },
  Astronomi: { icon: '🌌', color: '#e0f2fe' },
};

const normalizeSubjectKey = (name) =>
  name
    .toLowerCase()
    .replace(/ë/g, 'e')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-');

const libraryMap = new Map();

Object.entries(curriculum).forEach(([grade, plan]) => {
  plan.modules.forEach((module) => {
    const key = normalizeSubjectKey(module.subject);
    const meta =
      subjectMeta[module.subject] ??
      subjectMeta[module.subject.trim()] ?? {
        icon: '📘',
        color: '#e5e7eb',
      };

    if (!libraryMap.has(key)) {
      libraryMap.set(key, {
        id: key,
        name: module.subject,
        icon: meta.icon,
        color: meta.color,
        grades: new Set(),
        lessons: [],
        description: plan.focusNote ?? '',
      });
    }

    const subject = libraryMap.get(key);
    subject.grades.add(grade);
    subject.lessons.push({
      id: module.id,
      title: module.topic,
      grade,
      summary: module.overview,
      timeEstimate: module.timeEstimate,
      activities: module.activities.length,
      quizQuestions: module.quiz?.questions.length ?? 0,
      week: module.week ?? 1,
      competencies: module.competencies ?? [],
      outcomes: module.outcomes ?? [],
      assessmentCriteria: module.assessmentCriteria ?? [],
    });
  });
});

export const defaultLibrary = Array.from(libraryMap.values()).map((subject) => ({
  ...subject,
  grades: Array.from(subject.grades).sort(),
  lessons: subject.lessons,
}));
