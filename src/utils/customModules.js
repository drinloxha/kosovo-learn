// Kompetenca: Jetë/punë/mjedis (menaxhimi i burimeve mësimore të personalizuara)
// Rezultati i të nxënit: Lejon stafit të shtojë module të reja që sinkronizohen me planin dhe panelin e nxënësit
// Evidencë: Module të ruajtura në localStorage me metadata të nevojshme për kuize dhe planifikim

import { CUSTOM_MODULES_STORAGE_KEY } from './constants';

export const loadCustomModules = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CUSTOM_MODULES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((module) => module?.id && module?.grade);
  } catch {
    return [];
  }
};

export const saveCustomModules = (modules) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(CUSTOM_MODULES_STORAGE_KEY, JSON.stringify(modules ?? []));
  } catch {
    // ignore write errors
  }
};
