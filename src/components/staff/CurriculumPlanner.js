// Kompetenca: Jetë/punë/mjedis (menaxhimi i planit mësimor nga stafi)
// Rezultati i të nxënit: Organizon lëndët sipas javëve dhe përcakton rezultatet e matshme të të nxënit
// Evidencë: Ruajtje e javëve, rezultateve dhe shënimeve për çdo modul në planin kurrikular

import { useEffect, useMemo, useState } from 'react';
import { curriculum } from '../../data/curriculum';
import { coreCompetencies } from '../../data/competencies';
import {
  getModulePlanEntry,
  getModuleWeekFromPlan,
  getWeekOverview,
} from '../../utils/curriculumPlan';

const WEEKS = Array.from({ length: 40 }, (_, index) => index + 1);
function CurriculumPlanner({ grade, modules = [], plan, onChangeWeek, onChangeOutcomes }) {
  const [draftOutcomes, setDraftOutcomes] = useState({});
  const [draftNotes, setDraftNotes] = useState({});
  const [draftCompetencies, setDraftCompetencies] = useState({});

  const sortedModules = useMemo(() => {
    const annotated = modules.map((module) => {
      const week = getModuleWeekFromPlan(plan, grade, module.id, module.week ?? 1);
      return { module, week };
    });
    return annotated.sort((a, b) => {
      if (a.week !== b.week) {
        return a.week - b.week;
      }
      if (a.module.subject !== b.module.subject) {
        return a.module.subject.localeCompare(b.module.subject, 'sq');
      }
      return a.module.topic.localeCompare(b.module.topic, 'sq');
    });
  }, [modules, plan, grade]);

  const weekOverview = useMemo(() => getWeekOverview(plan, grade), [plan, grade]);

  useEffect(() => {
    const nextOutcomes = {};
    const nextNotes = {};
    const nextCompetencies = {};
    modules.forEach((module) => {
      const planEntry = getModulePlanEntry(plan, grade, module.id);
      const activeOutcomes =
        planEntry?.outcomes?.length > 0 ? planEntry.outcomes : module.outcomes ?? [];
      const activeCompetencies =
        planEntry?.competencies?.length > 0 ? planEntry.competencies : module.competencies ?? [];
      nextOutcomes[module.id] = activeOutcomes.join('\n');
      nextNotes[module.id] = planEntry?.notes ?? '';
      nextCompetencies[module.id] = activeCompetencies;
    });
    setDraftOutcomes(nextOutcomes);
    setDraftNotes(nextNotes);
    setDraftCompetencies(nextCompetencies);
  }, [modules, plan, grade]);

  const handleOutcomesChange = (moduleId, value) => {
    setDraftOutcomes((prev) => ({
      ...prev,
      [moduleId]: value,
    }));
  };

  const getOutcomeArray = (moduleId) =>
    (draftOutcomes[moduleId] ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  const persistModulePlan = (moduleId, overrides = {}) => {
    const outcomes = overrides.outcomes ?? getOutcomeArray(moduleId);
    const notes = overrides.notes ?? draftNotes[moduleId] ?? '';
    const competencies = overrides.competencies ?? draftCompetencies[moduleId] ?? [];
    onChangeOutcomes(grade, moduleId, {
      outcomes,
      competencies,
      notes,
    });
  };

  const handleOutcomesBlur = (moduleId) => {
    persistModulePlan(moduleId, { outcomes: getOutcomeArray(moduleId) });
  };

  const handleNotesChange = (moduleId, value) => {
    setDraftNotes((prev) => ({
      ...prev,
      [moduleId]: value,
    }));
  };

  const handleNotesBlur = (moduleId) => {
    persistModulePlan(moduleId, { notes: draftNotes[moduleId] ?? '' });
  };

  const handleToggleCompetency = (moduleId, competency) => {
    setDraftCompetencies((prev) => {
      const current = new Set(prev[moduleId] ?? []);
      if (current.has(competency)) {
        current.delete(competency);
      } else {
        current.add(competency);
      }
      const nextList = Array.from(current);
      persistModulePlan(moduleId, { competencies: nextList });
      return {
        ...prev,
        [moduleId]: nextList,
      };
    });
  };

  return (
    <section className="staff-plan">
      <header className="section-header">
        <div>
          <h2>Planifikimi i lëndëve</h2>
          <p>
            Cakto javët, rezultatet e të nxënit dhe shënimet për modulet e klasës {grade}. Ndryshimet
            ruhen automatikisht.
          </p>
        </div>
      </header>

      <div className="plan-summary">
        <h3>Pasqyra javore</h3>
        {weekOverview.length ? (
          <ul className="plan-week-list">
            {weekOverview.map((entry) => (
              <li key={`week-${entry.week}`}>
                <strong>Java {entry.week}</strong>
                <span>{entry.moduleIds.length} module</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Asnjë modul nuk është planifikuar ende për këtë klasë.</p>
        )}
      </div>

      <div className="plan-table-wrapper">
        <table className="plan-table">
          <thead>
            <tr>
              <th>Java</th>
              <th>Lënda / Tema</th>
              <th>Kompetenca</th>
              <th>Rezultatet e të nxënit</th>
              <th>Shënime</th>
            </tr>
          </thead>
          <tbody>
            {sortedModules.map(({ module, week }) => {
              const planEntry = getModulePlanEntry(plan, grade, module.id);
              const competencies =
                draftCompetencies[module.id] ??
                (planEntry?.competencies?.length > 0 ? planEntry.competencies : module.competencies);
              return (
                <tr key={module.id}>
                  <td>
                    <select
                      value={week}
                      onChange={(event) =>
                        onChangeWeek(grade, module.id, Number(event.target.value))
                      }
                    >
                      {WEEKS.map((option) => (
                        <option key={`${module.id}-week-${option}`} value={option}>
                          Java {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="plan-module">
                      <strong>{module.subject}</strong>
                      <span>{module.topic}</span>
                    </div>
                  </td>
                  <td>
                    <div className="plan-competency-grid">
                      {coreCompetencies.map((competencyOption) => {
                        const active = (competencies ?? []).includes(competencyOption);
                        return (
                          <button
                            key={`${module.id}-competency-${competencyOption}`}
                            type="button"
                            className={`plan-competency-toggle ${
                              active ? 'plan-competency-toggle-active' : ''
                            }`}
                            onClick={() => handleToggleCompetency(module.id, competencyOption)}
                          >
                            {competencyOption}
                          </button>
                        );
                      })}
                    </div>
                    {(!competencies || competencies.length === 0) && (
                      <span className="plan-empty">Zgjidh të paktën një kompetencë.</span>
                    )}
                  </td>
                  <td>
                    <textarea
                      value={draftOutcomes[module.id] ?? ''}
                      onChange={(event) => handleOutcomesChange(module.id, event.target.value)}
                      onBlur={() => handleOutcomesBlur(module.id)}
                      rows={4}
                      placeholder="Shkruaj një rezultat për çdo rresht..."
                    />
                  </td>
                  <td>
                    <textarea
                      value={draftNotes[module.id] ?? ''}
                      onChange={(event) => handleNotesChange(module.id, event.target.value)}
                      onBlur={() => handleNotesBlur(module.id)}
                      rows={3}
                      placeholder="Shënime, evidenca ose burime shtesë..."
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CurriculumPlanner;
