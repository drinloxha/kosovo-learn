// Kompetenca: Të mësuarit për të nxënë & Personal/Qytetare (monitorim progresi)
// Rezultati i të nxënit: Analizon evidencat e nxënësit për të planifikuar hapat e radhës dhe badge
// Evidencë: Regjistrime të arsyetimeve nga kuizet, badge të llogaritura dhe raporte të kompetencave në localStorage

import { curriculum } from '../data/curriculum';
import { SCHOOL_YEAR_START_DAY, SCHOOL_YEAR_START_MONTH } from './constants';
import { generateId } from './identifiers';
import { getModuleWeekFromPlan } from './curriculumPlan';

export const MIN_REASONING_LENGTH = 30;

const parseMinutes = (timeEstimate = '') => {
  const match = timeEstimate.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export const isReasoningSufficient = (reasoning, keywords = []) => {
  const trimmed = (reasoning ?? '').trim();
  if (trimmed.length < MIN_REASONING_LENGTH) {
    return false;
  }
  if (!Array.isArray(keywords) || !keywords.length) {
    return true;
  }
  const lower = trimmed.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
};

export const buildQuizEvidenceRecord = ({
  module,
  grade,
  reasoning,
  score,
  total,
  competency,
  outcome,
}) => {
  const timestamp = new Date().toISOString();
  return {
    id: generateId('evid'),
    type: 'quiz',
    moduleId: module.id,
    moduleTitle: module.topic,
    subject: module.subject,
    grade,
    competency:
      competency ??
      (Array.isArray(module.competencies) ? module.competencies[0] : 'Të menduarit (kritik/kreativ)'),
    outcome:
      outcome ??
      (Array.isArray(module.outcomes)
        ? module.outcomes[0]
        : 'Arsyeton zgjidhjet duke përdorur prova numerike.'),
    reasoning,
    reasoningValid: true,
    score,
    total,
    createdAt: timestamp,
  };
};

export const mergeEvidenceLog = (existingLog = [], entry) => [...existingLog, entry];

export const filterSubjectsByGrade = (library, grade) =>
  library.filter((subject) => subject.grades.includes(grade));

export const buildQuickLessons = (grade, library, weekLimit, plan) => {
  const modules = (curriculum[grade]?.modules ?? [])
    .map((module) => ({
      module,
      week: getModuleWeekFromPlan(plan ?? {}, grade, module.id, module.week ?? 1),
    }))
    .filter(({ week }) => (typeof weekLimit === 'number' ? week <= weekLimit : true))
    .sort((a, b) => a.week - b.week)
    .slice(0, 4);

  return modules.map(({ module }) => {
    const subject = library.find((entry) => entry.name === module.subject) ?? null;
    const hasSegmentReading = Array.isArray(module.segments)
      ? module.segments.some((segment) => segment?.content?.trim())
      : false;
    const totalPages = Array.isArray(module.segments) && module.segments.length
      ? module.segments.length
      : Array.isArray(module.reading)
      ? module.reading.length
      : 0;

    return {
      id: module.id,
      title: module.topic,
      summary: module.overview,
      timeEstimate: module.timeEstimate,
      subjectName: module.subject,
      icon: subject?.icon ?? '📘',
      color: subject?.color ?? '#eef2ff',
      hasReading:
        hasSegmentReading || (Array.isArray(module.reading) ? module.reading.length > 0 : false),
      totalPages,
      week: module.week ?? 1,
    };
  });
};

export const calculateProfileStats = (modules, progressMap) => {
  const stats = {
    totalModules: modules.length,
    completedModules: 0,
    inProgressModules: 0,
    perfectQuizzes: 0,
    totalAttempts: 0,
    totalQuestions: 0,
    studyMinutes: 0,
    readingItems: 0,
    readingCompleted: 0,
    activitiesItems: 0,
    activitiesCompleted: 0,
    timeline: [],
    badges: [],
    streakDays: 0,
    recommended: [],
    evidenceLog: [],
    evidenceCount: 0,
    competencySummary: {},
  };

  const activityByDate = new Set();
  const competencyCounter = {};

  modules.forEach((module) => {
    const moduleState = progressMap[module.id] ?? {};
    const readingTotal = module.reading.length;
    const activityTotal = module.activities.length;
    const readingDone = moduleState.readingDone?.length ?? 0;
    const activityDone = moduleState.activityDone?.length ?? 0;
    const quizTotal = module.quiz?.questions.length ?? 0;
    const attempts = moduleState.attempts ?? 0;
    const perfect =
      moduleState.quizPerfect ??
      (moduleState.total ? moduleState.score === moduleState.total : false);
    const completed =
      moduleState.completed ??
      (readingDone === readingTotal &&
        activityDone === activityTotal &&
        perfect &&
        quizTotal > 0);

    stats.totalQuestions += quizTotal;
    stats.totalAttempts += attempts;
    stats.readingItems += readingTotal;
    stats.readingCompleted += readingDone;
    stats.activitiesItems += activityTotal;
    stats.activitiesCompleted += activityDone;
    stats.studyMinutes += parseMinutes(module.timeEstimate);

    const evidenceLog = Array.isArray(moduleState.evidenceLog) ? moduleState.evidenceLog : [];
    evidenceLog.forEach((record) => {
      const entryDate = new Date(record.createdAt);
      activityByDate.add(entryDate.toISOString().slice(0, 10));
      stats.timeline.push({
        moduleId: module.id,
        evidenceId: record.id,
        title: module.topic,
        subject: module.subject,
        score: record.score ?? moduleState.score ?? 0,
        total: record.total ?? moduleState.total ?? quizTotal,
        completed,
        perfect,
        attempts,
        at: entryDate,
        competency: record.competency,
        outcome: record.outcome,
        reasoning: record.reasoning,
        evidenceType: record.type,
      });
      stats.evidenceLog.push({
        ...record,
        moduleId: module.id,
        title: module.topic,
        subject: module.subject,
      });
      if (record.competency) {
        competencyCounter[record.competency] = (competencyCounter[record.competency] ?? 0) + 1;
      }
    });

    if (!evidenceLog.length && moduleState.lastAttemptedAt) {
      const lastDate = new Date(moduleState.lastAttemptedAt);
      activityByDate.add(lastDate.toISOString().slice(0, 10));
      stats.timeline.push({
        moduleId: module.id,
        evidenceId: `${module.id}-attempt-${attempts}`,
        title: module.topic,
        subject: module.subject,
        score: moduleState.score ?? 0,
        total: moduleState.total ?? quizTotal,
        completed,
        perfect,
        attempts,
        at: lastDate,
      });
    }

    if (completed) {
      stats.completedModules += 1;
    } else if (attempts > 0 || readingDone > 0 || activityDone > 0) {
      stats.inProgressModules += 1;
    }

    if (perfect) {
      stats.perfectQuizzes += 1;
    }
  });

  stats.timeline.sort((a, b) => b.at - a.at);
  stats.evidenceCount = stats.evidenceLog.length;
  stats.competencySummary = competencyCounter;

  const completionPercent = stats.totalModules
    ? Math.round((stats.completedModules / stats.totalModules) * 100)
    : 0;
  stats.completionPercent = completionPercent;

  const readingPercent = stats.readingItems
    ? Math.round((stats.readingCompleted / stats.readingItems) * 100)
    : 0;
  const activityPercent = stats.activitiesItems
    ? Math.round((stats.activitiesCompleted / stats.activitiesItems) * 100)
    : 0;

  stats.readingPercent = readingPercent;
  stats.activityPercent = activityPercent;

  const uniqueDates = Array.from(activityByDate).sort().reverse();
  let streak = 0;
  let previousDate = null;
  uniqueDates.forEach((dateString) => {
    const currentDate = new Date(dateString);
    if (!previousDate) {
      streak = 1;
    } else {
      const diff =
        (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak += 1;
      }
    }
    previousDate = currentDate;
  });
  stats.streakDays = streak;

  if (completionPercent >= 80) {
    stats.badges.push({
      id: 'finisher',
      icon: '🏅',
      title: 'Kampion i përkushtimit',
      description: 'Ka përfunduar mbi 80% të planeve të klasës.',
    });
  }
  if (stats.perfectQuizzes >= 3) {
    stats.badges.push({
      id: 'quiz-master',
      icon: '🎯',
      title: 'Mjeshtër i kuizeve',
      description: 'Ka marrë pikët maksimale në të paktën 3 kuize.',
    });
  }
  if (stats.readingCompleted >= 10) {
    stats.badges.push({
      id: 'book-lover',
      icon: '📚',
      title: 'Dashamirës i leximit',
      description: 'Ka përfunduar mbi 10 njësi leximi.',
    });
  }
  if (stats.studyMinutes >= 300) {
    stats.badges.push({
      id: 'time-keeper',
      icon: '⏱️',
      title: 'Maratonist i dijes',
      description: 'Ka kaluar mbi 5 orë në ushtrime dhe lexime.',
    });
  }

  const criticalThinkingRecords = stats.evidenceLog.filter(
    (record) => record.competency === 'Të menduarit (kritik/kreativ)'
  );
  const criticalSubjects = new Set(criticalThinkingRecords.map((record) => record.subject));
  if (criticalThinkingRecords.length >= 5 && criticalSubjects.size >= 3) {
    stats.badges.push({
      id: 'critical-thinker',
      icon: '💡',
      title: 'Mendimtar kritik (Shkalla 3)',
      description:
        'Ka siguruar të paktën 5 evidenca arsyetimi në të paktën 3 lëndë të ndryshme.',
    });
  }

  const pendingModules = modules.filter(
    (module) => !(progressMap[module.id]?.completed ?? false)
  );

  stats.recommended = pendingModules.slice(0, 3).map((module) => ({
    moduleId: module.id,
    title: module.topic,
    subject: module.subject,
    reason:
      progressMap[module.id]?.attempts > 0
        ? 'Përfundo kuizin për të mbyllur temën.'
        : 'Nis mësimin për të mos mbetur prapa.',
  }));

  stats.engagementScore = Math.min(
    100,
    Math.round(
      completionPercent * 0.4 +
        readingPercent * 0.2 +
        activityPercent * 0.2 +
        Math.min(stats.perfectQuizzes * 10, 20)
    )
  );

  return stats;
};

export const buildEvidenceReport = (modules, progressMap) =>
  modules.reduce((acc, module) => {
    const moduleState = progressMap[module.id] ?? {};
    const evidenceLog = Array.isArray(moduleState.evidenceLog) ? moduleState.evidenceLog : [];
    evidenceLog.forEach((record) => {
      acc.push({
        ...record,
        moduleId: module.id,
        moduleTitle: module.topic,
        subject: module.subject,
      });
    });
    return acc;
  }, []);

export const getSchoolWeek = () => {
  const now = new Date();
  let start = new Date(now.getFullYear(), SCHOOL_YEAR_START_MONTH, SCHOOL_YEAR_START_DAY);
  if (now < start) {
    start = new Date(now.getFullYear() - 1, SCHOOL_YEAR_START_MONTH, SCHOOL_YEAR_START_DAY);
  }
  const diffMs = now.getTime() - start.getTime();
  const week = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)) + 1;
  return Math.max(1, Math.min(week, 40));
};

export const getWeekStartDate = (weekIndex) => {
  const now = new Date();
  let start = new Date(now.getFullYear(), SCHOOL_YEAR_START_MONTH, SCHOOL_YEAR_START_DAY);
  if (now < start) {
    start = new Date(now.getFullYear() - 1, SCHOOL_YEAR_START_MONTH, SCHOOL_YEAR_START_DAY);
  }
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() + (weekIndex - 1) * 7);
  return weekStart.toLocaleDateString('sq-AL', {
    day: '2-digit',
    month: 'short',
  });
};
