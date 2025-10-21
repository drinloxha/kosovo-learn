// Kompetenca: Jetë/punë/mjedis (planifikim i burimeve mësimore)
// Rezultati i të nxënit: Strukturon planin javor sipas kompetencave dhe rezultateve për çdo lëndë
// Evidencë: Ruajtje e javës, rezultateve dhe shënimeve për çdo modul në localStorage

import { curriculum, gradeOptions } from '../data/curriculum';
import { curriculumPlanTemplate } from '../data/curriculumPlanTemplate';
import { CURRICULUM_PLAN_STORAGE_KEY } from './constants';

const clampWeek = (value) => {
  const weekNumber = Number.isFinite(Number(value)) ? Number(value) : 1;
  if (weekNumber < 1) {
    return 1;
  }
  if (weekNumber > 40) {
    return 40;
  }
  return Math.floor(weekNumber);
};

const emptyGradePlan = () => ({
  modules: {},
  lastUpdated: new Date().toISOString(),
});

export const createDefaultPlan = () =>
  gradeOptions.reduce((acc, grade) => {
    const gradePlan = emptyGradePlan();
    const gradeModules = curriculum[grade]?.modules ?? [];
    const templateGrade = curriculumPlanTemplate[grade] ?? {};
    const templateModules = templateGrade.modules ?? {};

    gradeModules.forEach((module) => {
      const templateEntry = templateModules[module.id] ?? {};
      gradePlan.modules[module.id] = {
        moduleId: module.id,
        week: clampWeek(templateEntry.week ?? module.week ?? 1),
        outcomes:
          Array.isArray(templateEntry.outcomes) && templateEntry.outcomes.length
            ? templateEntry.outcomes
            : module.outcomes ?? [],
        competencies:
          Array.isArray(templateEntry.competencies) && templateEntry.competencies.length
            ? templateEntry.competencies
            : module.competencies ?? [],
        notes: typeof templateEntry.notes === 'string' ? templateEntry.notes : '',
      };
    });

    gradePlan.lastUpdated = templateGrade.lastUpdated ?? new Date().toISOString();
    acc[grade] = gradePlan;
    return acc;
  }, {});

export const normalizePlan = (inputPlan) => {
  const defaultPlan = createDefaultPlan();
  if (!inputPlan || typeof inputPlan !== 'object') {
    return defaultPlan;
  }

  const normalized = {};
  gradeOptions.forEach((grade) => {
    const base = defaultPlan[grade];
    const incoming = inputPlan[grade] ?? {};
    const incomingModules = incoming.modules ?? {};

    const mergedModules = { ...base.modules };
    Object.keys(incomingModules).forEach((moduleId) => {
      const existing = base.modules[moduleId] ?? {};
      const incomingModule = incomingModules[moduleId];

      mergedModules[moduleId] = {
        moduleId,
        week: clampWeek(incomingModule.week ?? existing.week ?? 1),
        outcomes: Array.isArray(incomingModule.outcomes)
          ? incomingModule.outcomes
          : existing.outcomes ?? [],
        competencies: Array.isArray(incomingModule.competencies)
          ? incomingModule.competencies
          : existing.competencies ?? [],
        notes: typeof incomingModule.notes === 'string' ? incomingModule.notes : existing.notes ?? '',
      };
    });

    normalized[grade] = {
      modules: mergedModules,
      lastUpdated: incoming.lastUpdated ?? base.lastUpdated,
    };
  });

  return normalized;
};

export const loadCurriculumPlan = () => {
  if (typeof window === 'undefined') {
    return createDefaultPlan();
  }

  try {
    const raw = window.localStorage.getItem(CURRICULUM_PLAN_STORAGE_KEY);
    if (!raw) {
      return createDefaultPlan();
    }
    const parsed = JSON.parse(raw);
    return normalizePlan(parsed);
  } catch {
    return createDefaultPlan();
  }
};

export const saveCurriculumPlan = (plan) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(CURRICULUM_PLAN_STORAGE_KEY, JSON.stringify(plan));
  } catch {
    // swallow write errors silently
  }
};

export const getModulePlanEntry = (plan, grade, moduleId) =>
  plan?.[grade]?.modules?.[moduleId] ?? null;

export const getModuleWeekFromPlan = (plan, grade, moduleId, fallbackWeek = 1) => {
  const entry = getModulePlanEntry(plan, grade, moduleId);
  if (!entry) {
    return clampWeek(fallbackWeek);
  }
  return clampWeek(entry.week ?? fallbackWeek);
};

export const updateModuleWeekInPlan = (plan, grade, moduleId, week) => {
  const nextWeek = clampWeek(week);
  const basePlan = normalizePlan(plan);
  const gradePlan = basePlan[grade] ?? emptyGradePlan();
  const moduleEntry = gradePlan.modules[moduleId] ?? {
    moduleId,
    outcomes: [],
    competencies: [],
    notes: '',
  };

  gradePlan.modules[moduleId] = {
    ...moduleEntry,
    week: nextWeek,
  };
  gradePlan.lastUpdated = new Date().toISOString();

  return {
    ...basePlan,
    [grade]: gradePlan,
  };
};

export const updateModuleOutcomesInPlan = (plan, grade, moduleId, updates) => {
  const basePlan = normalizePlan(plan);
  const gradePlan = basePlan[grade] ?? emptyGradePlan();
  const moduleEntry = gradePlan.modules[moduleId] ?? {
    moduleId,
    week: 1,
    outcomes: [],
    competencies: [],
    notes: '',
  };

  gradePlan.modules[moduleId] = {
    ...moduleEntry,
    outcomes: Array.isArray(updates.outcomes) ? updates.outcomes : moduleEntry.outcomes,
    competencies: Array.isArray(updates.competencies)
      ? updates.competencies
      : moduleEntry.competencies,
    notes: typeof updates.notes === 'string' ? updates.notes : moduleEntry.notes,
  };
  gradePlan.lastUpdated = new Date().toISOString();

  return {
    ...basePlan,
    [grade]: gradePlan,
  };
};

export const getWeekOverview = (plan, grade) => {
  const gradePlan = plan?.[grade];
  if (!gradePlan) {
    return [];
  }

  const modules = Object.values(gradePlan.modules);
  const grouped = modules.reduce((acc, item) => {
    const week = clampWeek(item.week ?? 1);
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(item.moduleId);
    return acc;
  }, {});

  return Object.keys(grouped)
    .map((week) => ({
      week: Number(week),
      moduleIds: grouped[week],
    }))
    .sort((a, b) => a.week - b.week);
};
