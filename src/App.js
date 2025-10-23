import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { curriculum, gradeOptions } from './data/curriculum';
import AuthShell from './components/auth/AuthShell';
import Sidebar from './components/layout/Sidebar';
import ModeSwitch from './components/layout/ModeSwitch';
import GradeSwitcher from './components/layout/GradeSwitcher';
import StudentBar from './components/layout/StudentBar';
import StudentHome from './components/student/StudentHome';
import StudentSubjects from './components/student/StudentSubjects';
import StudentQuizzes from './components/student/StudentQuizzes';
import StudentProfile from './components/student/StudentProfile';
import StudentSetupModal from './components/student/StudentSetupModal';
import StudentReading from './components/student/StudentReading';
import StaffPanel from './components/staff/StaffPanel';
import StudentChat from './components/chat/StudentChat';
import StaffChatCenter from './components/chat/StaffChatCenter';
import {
  loadAccounts,
  loadChats,
  loadLibrary,
  loadProgress,
  loadSession,
} from './utils/storage';
import {
  ACCOUNT_STORAGE_KEY,
  CHAT_STORAGE_KEY,
  LIBRARY_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  STORAGE_KEY,
} from './utils/constants';
import {
  buildQuickLessons,
  buildQuizEvidenceRecord,
  calculateProfileStats,
  filterSubjectsByGrade,
  getSchoolWeek,
  isReasoningSufficient,
  mergeEvidenceLog,
} from './utils/student';
import { loadCustomModules, saveCustomModules } from './utils/customModules';
import {
  getModulePlanEntry,
  getModuleWeekFromPlan,
  loadCurriculumPlan,
  saveCurriculumPlan,
  updateModuleOutcomesInPlan,
  updateModuleWeekInPlan,
} from './utils/curriculumPlan';
import { countUnreadMessages, getAutoReply } from './utils/chat';
import { createUserRecord, hashPassword } from './utils/accounts';
import { avatarOptions } from './utils/avatars';
import { generateId, generateSalt } from './utils/identifiers';

const STUDENT_SECTION_LABELS = {
  home: 'Ballina',
  subjects: 'Lëndët',
  reading: 'Leximi',
  quizzes: 'Kuizet',
  chat: 'Chat',
  profile: 'Profili',
};

const STAFF_SECTION_LABELS = {
  overview: 'Përmbledhje',
  lessons: 'Mësimet',
  'add-subject': 'Shto lëndë',
  'add-lesson': 'Shto mësim',
  chats: 'Chats',
};

function App() {
  const initialAccounts = useMemo(() => loadAccounts(), []);
  const initialSession = useMemo(
    () => loadSession(initialAccounts),
    [initialAccounts]
  );
  const initialProgress = useMemo(
    () => loadProgress(initialAccounts),
    [initialAccounts]
  );
  const initialCurriculumPlan = useMemo(() => loadCurriculumPlan(), []);
  const initialCustomModules = useMemo(() => loadCustomModules(), []);

  const [accounts, setAccounts] = useState(initialAccounts);
  const [session, setSession] = useState(initialSession);
  const [progress, setProgress] = useState(initialProgress);
  const [library, setLibrary] = useState(() => loadLibrary());
  const [chats, setChats] = useState(() => loadChats(initialAccounts));
  const [curriculumPlan, setCurriculumPlan] = useState(initialCurriculumPlan);
  const [customModules, setCustomModules] = useState(initialCustomModules);
  const [mode, setMode] = useState('student');
  const [studentSection, setStudentSection] = useState('home');
  const [staffSection, setStaffSection] = useState('overview');
  const [studentHistory, setStudentHistory] = useState(['home']);
  const [staffHistory, setStaffHistory] = useState(['overview']);
  const [selectedGrade, setSelectedGrade] = useState(
    initialAccounts.find((account) => account.id === initialSession?.userId)?.grade ??
      gradeOptions[0]
  );
  const [activeStudentId, setActiveStudentId] = useState(initialSession?.userId ?? null);
  const [activeQuizModuleId, setActiveQuizModuleId] = useState(null);
  const [activeReadingModuleId, setActiveReadingModuleId] = useState(null);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [activeChatStudentId, setActiveChatStudentId] = useState(() =>
    initialAccounts.find((account) => account.role === 'student')?.id ?? null
  );
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const [typingStatus, setTypingStatus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const audioContextRef = useRef(null);

  const playTone = useCallback((frequency) => {
    if (typeof window === 'undefined') {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.35);
    } catch {
      // ignore audio errors (e.g. autoplay restrictions)
    }
  }, []);

  const playSendSound = useCallback(() => playTone(720), [playTone]);
  const playReceiveSound = useCallback(() => playTone(520), [playTone]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const updateViewport = () => {
      const mobile = window.innerWidth <= 960;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }
    const originalOverflow = document.body.style.overflow;
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobile, isSidebarOpen]);

  const goToStudentSection = useCallback(
    (section, options = {}) => {
      const { replaceAll = false, replaceTop = false, clearReading = false, clearQuiz = false } =
        options;

      setStudentHistory((prev) => {
        if (replaceAll) {
          return [section];
        }

        if (replaceTop && prev.length) {
          const updated = [...prev];
          updated[updated.length - 1] = section;
          return updated;
        }

        const current = prev[prev.length - 1];
        if (current === section) {
          return prev;
        }

        return [...prev, section];
      });

      setStudentSection(section);

      if (clearReading) {
        setActiveReadingModuleId(null);
      }
      if (clearQuiz) {
        setActiveQuizModuleId(null);
      }
    },
    [setStudentSection, setActiveReadingModuleId, setActiveQuizModuleId]
  );

  const resetStudentSection = useCallback(
    (section = 'home') => {
      setStudentHistory([section]);
      setStudentSection(section);
      setActiveReadingModuleId(null);
      setActiveQuizModuleId(null);
    },
    [setStudentSection, setActiveReadingModuleId, setActiveQuizModuleId]
  );

  const handleStudentBack = useCallback(() => {
    setStudentHistory((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      const newStack = prev.slice(0, -1);
      const previousSection = newStack[newStack.length - 1];
      setStudentSection(previousSection);
      if (previousSection !== 'reading') {
        setActiveReadingModuleId(null);
      }
      if (previousSection !== 'quizzes') {
        setActiveQuizModuleId(null);
      }
      return newStack;
    });
  }, [setStudentSection, setActiveReadingModuleId, setActiveQuizModuleId]);

  const goToStaffSection = useCallback(
    (section, options = {}) => {
      const { replaceAll = false, replaceTop = false } = options;
      setStaffHistory((prev) => {
        if (replaceAll) {
          return [section];
        }
        if (replaceTop && prev.length) {
          const updated = [...prev];
          updated[updated.length - 1] = section;
          return updated;
        }
        const current = prev[prev.length - 1];
        if (current === section) {
          return prev;
        }
        return [...prev, section];
      });
      setStaffSection(section);
    },
    [setStaffSection]
  );

  const resetStaffSection = useCallback(
    (section = 'overview') => {
      setStaffHistory([section]);
      setStaffSection(section);
    },
    [setStaffSection]
  );

  const handleStaffBack = useCallback(() => {
    setStaffHistory((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      const newStack = prev.slice(0, -1);
      setStaffSection(newStack[newStack.length - 1]);
      return newStack;
    });
  }, [setStaffSection]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [mode]);

  const handleSidebarSelect = useCallback(
    (itemId) => {
      if (mode === 'student') {
        goToStudentSection(itemId);
      } else {
        goToStaffSection(itemId);
      }
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    },
    [mode, goToStudentSection, goToStaffSection, isMobile]
  );

  const currentUser = useMemo(
    () => accounts.find((account) => account.id === session?.userId) ?? null,
    [accounts, session]
  );

  useEffect(() => {
    window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    saveCurriculumPlan(curriculumPlan);
  }, [curriculumPlan]);

  useEffect(() => {
    saveCustomModules(customModules);
  }, [customModules]);

  useEffect(() => {
    if (session?.userId) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session]);

  useEffect(() => {
    setChats((prev) => {
      const next = {};
      accounts
        .filter((account) => account.role === 'student')
        .forEach((account) => {
          next[account.id] = prev[account.id] ?? [];
        });

      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(next);

      if (
        prevKeys.length === nextKeys.length &&
        prevKeys.every((key) => nextKeys.includes(key))
      ) {
        return prev;
      }

      return next;
    });
  }, [accounts]);

  useEffect(() => {
    if (!currentUser) {
      setActiveStudentId(null);
      setSelectedGrade(gradeOptions[0]);
      setMode('student');
      resetStudentSection('home');
      resetStaffSection('overview');
      setIsChatWidgetOpen(false);
      return;
    }

    if (currentUser.role === 'student') {
      setActiveStudentId(currentUser.id);
      setSelectedGrade(currentUser.grade);
      setMode('student');
      resetStudentSection('home');
    } else {
      setActiveStudentId((prev) => {
        if (prev && accounts.some((acc) => acc.id === prev && acc.role === 'student')) {
          return prev;
        }
        const firstStudent = accounts.find((acc) => acc.role === 'student');
        return firstStudent?.id ?? currentUser.id;
      });
      setSelectedGrade((prev) => prev ?? currentUser.grade ?? gradeOptions[0]);
    }
  }, [currentUser, accounts, resetStudentSection, resetStaffSection]);

  useEffect(() => {
    const studentList = accounts.filter((account) => account.role === 'student');
    if (!studentList.length) {
      if (activeChatStudentId !== null) {
        setActiveChatStudentId(null);
      }
      return;
    }

    if (!activeChatStudentId || !studentList.some((acc) => acc.id === activeChatStudentId)) {
      setActiveChatStudentId(studentList[0].id);
    }
  }, [accounts, activeChatStudentId]);

  useEffect(() => {
    if (!selectedGrade) {
      return;
    }

    const modules = curriculum[selectedGrade]?.modules ?? [];
    setActiveQuizModuleId((prev) =>
      modules.some((module) => module.id === prev) ? prev : modules[0]?.id ?? null
    );
  }, [selectedGrade]);

  const students = accounts.filter((account) => account.role === 'student');
  const activeStudent =
    accounts.find((account) => account.id === activeStudentId) ?? currentUser;
  const isStaff = currentUser?.role === 'staff';

  useEffect(() => {
    if (!isStaff && mode !== 'student') {
      setMode('student');
    }
  }, [isStaff, mode]);

  const updateReadingProgress = (studentId, gradeId, moduleId, updater) => {
    const gradeKey = String(gradeId);
    setProgress((prev) => {
      const studentProgress = prev[studentId] ?? {};
      const gradeProgress = studentProgress[gradeKey] ?? {};
      const moduleState = gradeProgress[moduleId] ?? {};
      const nextModuleState = updater(moduleState);

      return {
        ...prev,
        [studentId]: {
          ...studentProgress,
          [gradeKey]: {
            ...gradeProgress,
            [moduleId]: nextModuleState,
          },
        },
      };
    });
  };

  const defaultGradeModules = useMemo(
    () => curriculum[selectedGrade]?.modules ?? [],
    [selectedGrade]
  );
  const customModulesForGrade = useMemo(
    () => customModules.filter((module) => module.grade === selectedGrade),
    [customModules, selectedGrade]
  );
  const gradeModules = useMemo(
    () => [...defaultGradeModules, ...customModulesForGrade],
    [defaultGradeModules, customModulesForGrade]
  );

  useEffect(() => {
    if (
      activeReadingModuleId &&
      !gradeModules.some((module) => module.id === activeReadingModuleId)
    ) {
      setActiveReadingModuleId(null);
    }
  }, [activeReadingModuleId, gradeModules]);
  const studentProgress = useMemo(
    () => (activeStudent ? progress[activeStudent.id] ?? {} : {}),
    [activeStudent, progress]
  );
  const gradeProgress = useMemo(
    () => studentProgress[selectedGrade] ?? {},
    [studentProgress, selectedGrade]
  );
  const getPlannedWeek = useCallback(
    (module) =>
      getModuleWeekFromPlan(curriculumPlan, selectedGrade, module.id, module.week ?? 1),
    [curriculumPlan, selectedGrade]
  );
  const currentWeek = useMemo(() => getSchoolWeek(), []);
  const gatingEnabled = currentUser?.role !== 'staff';
  const unlockedModules = useMemo(
    () =>
      gatingEnabled
        ? gradeModules.filter((module) => getPlannedWeek(module) <= currentWeek)
        : gradeModules,
    [gradeModules, gatingEnabled, currentWeek, getPlannedWeek]
  );
  const lockedModules = useMemo(
    () =>
      gatingEnabled
        ? gradeModules.filter((module) => getPlannedWeek(module) > currentWeek)
        : [],
    [gradeModules, gatingEnabled, currentWeek, getPlannedWeek]
  );
  const modulesForStats = gatingEnabled ? unlockedModules : gradeModules;
  const profileStats = useMemo(
    () => calculateProfileStats(modulesForStats, gradeProgress),
    [modulesForStats, gradeProgress]
  );
  const modulesForDisplay = gatingEnabled ? unlockedModules : gradeModules;
  const activeReadingModule = gradeModules.find((module) => module.id === activeReadingModuleId) ?? null;
  const activeReadingProgressEntry = activeReadingModule
    ? gradeProgress[activeReadingModule.id] ?? {}
    : null;
  const quickLockedCount = gatingEnabled ? lockedModules.length : 0;
  const studentChatMessages = activeStudent ? chats[activeStudent.id] ?? [] : [];
  const studentUnread = activeStudent
    ? countUnreadMessages(studentChatMessages, 'student')
    : 0;
  const totalStaffUnread = students.reduce(
    (sum, student) => sum + countUnreadMessages(chats[student.id] ?? [], 'staff'),
    0
  );
  const studentSelfMessages =
    currentUser?.role === 'student' ? chats[currentUser.id] ?? [] : [];
  const studentSelfUnread =
    currentUser?.role === 'student'
      ? countUnreadMessages(studentSelfMessages, 'student')
      : 0;

  const subjectsForGrade = filterSubjectsByGrade(library, selectedGrade);
  const quickLessons = buildQuickLessons(
    selectedGrade,
    library,
    gatingEnabled ? currentWeek : undefined,
    curriculumPlan
  );
  const nextLesson = useMemo(() => {
    for (const module of modulesForDisplay) {
      const week = getPlannedWeek(module);
      if (gatingEnabled && week > currentWeek) {
        continue;
      }
      const moduleProgressEntry = gradeProgress[module.id] ?? {};
      const totalPages = Array.isArray(module.segments) && module.segments.length
        ? module.segments.length
        : Array.isArray(module.reading)
        ? module.reading.length
        : 0;
      const readingDone = Array.isArray(moduleProgressEntry.readingDone)
        ? moduleProgressEntry.readingDone.length
        : 0;
      const subjectMeta = library.find((subject) => subject.name === module.subject);
      const digest = {
        id: module.id,
        title: module.topic,
        summary: module.overview,
        subjectName: module.subject,
        icon: subjectMeta?.icon ?? '📘',
        color: subjectMeta?.color ?? '#eef2ff',
        hasReading: totalPages > 0,
        timeEstimate: module.timeEstimate,
        totalPages,
        week,
      };

      if (totalPages > 0 && readingDone < totalPages) {
        return digest;
      }

      const quizComplete = moduleProgressEntry.completed || moduleProgressEntry.quizPerfect;
      if (totalPages === 0 && !quizComplete) {
        return digest;
      }
    }
    return null;
  }, [
    modulesForDisplay,
    gatingEnabled,
    currentWeek,
    gradeProgress,
    getPlannedWeek,
    library,
  ]);
  const activeQuizModule =
    gradeModules.find((module) => module.id === activeQuizModuleId) ??
    gradeModules[0] ??
    null;

  const handleLogin = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = accounts.find(
      (user) => user.email.toLowerCase() === normalizedEmail
    );

    if (!account) {
      throw new Error('Kombinimi email / fjalëkalim nuk është i saktë.');
    }

    const attemptHash = hashPassword(password, account.salt);
    if (attemptHash !== account.passwordHash) {
      throw new Error('Kombinimi email / fjalëkalim nuk është i saktë.');
    }

    setSession({ userId: account.id });
  };

  const handleLogout = () => {
    setSession(null);
    setMode('student');
    resetStudentSection('home');
    resetStaffSection('overview');
  };

  const registerStudent = (
    { name, email, grade, avatarId, password },
    { autoLogin } = { autoLogin: true }
  ) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      throw new Error('Emri është i detyrueshëm.');
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      throw new Error('Shkruaj një email të vlefshëm.');
    }
    if (trimmedPassword.length < 6) {
      throw new Error('Fjalëkalimi duhet të ketë të paktën 6 karaktere.');
    }
    if (!gradeOptions.includes(grade)) {
      throw new Error('Zgjidh një klasë të vlefshme.');
    }
    if (
      accounts.some((account) => account.email.toLowerCase() === trimmedEmail)
    ) {
      throw new Error('Ky email është tashmë i regjistruar.');
    }

    const user = createUserRecord({
      name: trimmedName,
      email: trimmedEmail,
      grade,
      avatarId: avatarId ?? avatarOptions[0].id,
      password: trimmedPassword,
    });

    setAccounts((prev) => [...prev, user]);
    setProgress((prev) => ({
      ...prev,
      [user.id]: {},
    }));
    setChats((prev) => ({
      ...prev,
      [user.id]: [],
    }));

    if (autoLogin) {
      setSession({ userId: user.id });
    }

    return user;
  };

  const handleStudentRegistration = (payload, options) =>
    registerStudent(payload, options);

  const handleCreateStudent = (payload) => {
    const user = registerStudent(payload, { autoLogin: false });
    return user;
  };

  const handleUpdateStudent = (userId, payload) => {
    setAccounts((prev) =>
      prev.map((account) => {
        if (account.id !== userId) {
          return account;
        }

        const next = { ...account, ...payload, updatedAt: new Date().toISOString() };

        if (payload.password) {
          const salt = generateSalt();
          next.salt = salt;
          next.passwordHash = hashPassword(payload.password, salt);
        }

        delete next.password;
        return next;
      })
    );
  };

  const handleNameChangeRequest = (userId, desiredName, reason) => {
    const trimmedName = desiredName.trim();
    if (!trimmedName) {
      throw new Error('Shkruaj emrin e ri për kërkesën.');
    }

    setAccounts((prev) =>
      prev.map((account) =>
        account.id === userId
          ? {
              ...account,
              pendingNameRequest: {
                desiredName: trimmedName,
                reason: reason.trim(),
                submittedAt: new Date().toISOString(),
              },
            }
          : account
      )
    );
  };

  const handleAddSubject = (subjectData) => {
    setLibrary((prev) => {
      const exists = prev.some(
        (subject) =>
          subject.name.toLowerCase() === subjectData.name.trim().toLowerCase()
      );
      if (exists) {
        return prev;
      }

      return [
        ...prev,
        {
          id: generateId('subj'),
          name: subjectData.name.trim(),
          description: subjectData.description?.trim() ?? '',
          icon: subjectData.icon,
          color: subjectData.color,
          grades: subjectData.grades.sort(),
          lessons: [],
        },
      ];
    });
  };

  const handleAddLesson = (subjectId, lessonData) => {
    const subjectEntry = library.find((subject) => subject.id === subjectId);
    const moduleId = generateId('mod');

    const preparedQuestions = (lessonData.quizQuestions ?? []).map((question) => {
      const options = (question.options ?? []).map((option) => option.trim()).filter((option) => option);
      return {
        id: generateId('q'),
        prompt: question.prompt?.trim() ?? '',
        options: options.length ? options : ['Opsioni A', 'Opsioni B'],
        answerIndex:
          Number.isInteger(question.answerIndex) && question.answerIndex >= 0
            ? Math.min(question.answerIndex, Math.max(options.length - 1, 0))
            : 0,
        explanation: question.explanation?.trim() ?? '',
      };
    });

    setLibrary((prev) =>
      prev.map((subject) => {
        if (subject.id !== subjectId) {
          return subject;
        }

        const grades = new Set(subject.grades);
        grades.add(lessonData.grade);

        return {
          ...subject,
          grades: Array.from(grades).sort(),
          lessons: [
            ...subject.lessons,
            {
              id: generateId('lesson'),
              moduleId,
              title: lessonData.title,
              grade: lessonData.grade,
              summary: lessonData.summary,
              timeEstimate: lessonData.timeEstimate,
              activities: lessonData.activityDetails.length,
              quizQuestions: preparedQuestions.length,
              segments: lessonData.segments,
              readingPages: lessonData.reading,
              activityDetails: lessonData.activityDetails,
            },
          ],
        };
      })
    );

    if (!subjectEntry) {
      return;
    }

    const customModule = {
      id: moduleId,
      subjectId: subjectEntry.id,
      subject: subjectEntry.name,
      topic: lessonData.title,
      timeEstimate: lessonData.timeEstimate || '20 min',
      overview: lessonData.summary,
      grade: lessonData.grade,
      reading: lessonData.reading ?? [],
      segments: lessonData.segments ?? [],
      activities: lessonData.activityDetails ?? [],
      week: lessonData.week ?? 1,
      outcomes: lessonData.outcomes ?? [],
      competencies: lessonData.competencies ?? [],
      planNotes: lessonData.planNotes ?? '',
      quiz: {
        questions: preparedQuestions,
      },
      source: 'custom',
    };

    setCustomModules((prev) => [...prev, customModule]);
    setCurriculumPlan((prev) => {
      let updated = updateModuleWeekInPlan(prev, lessonData.grade, moduleId, lessonData.week ?? 1);
      updated = updateModuleOutcomesInPlan(updated, lessonData.grade, moduleId, {
        outcomes:
          lessonData.outcomes?.length > 0
            ? lessonData.outcomes
            : [`Përfundon temën “${lessonData.title}”`],
        competencies: lessonData.competencies ?? [],
        notes: lessonData.planNotes ?? '',
      });
      return updated;
    });
  };

  const handleUpdateCustomModule = ({
    moduleId,
    subjectId,
    moduleUpdates = {},
    planUpdates = {},
    lessonUpdates = {},
  }) => {
    const target = customModules.find((module) => module.id === moduleId);
    if (!target) {
      return;
    }
    const prepareQuizQuestions = (questions, existingQuestions = []) => {
      const existingMap = (existingQuestions ?? []).reduce((acc, question) => {
        acc[question.id] = question;
        return acc;
      }, {});

      return (questions ?? [])
        .map((question) => {
          const trimmedPrompt = question.prompt?.trim() ?? '';
          const options = (question.options ?? []).map((option) => option.trim()).filter(Boolean);
          if (!trimmedPrompt || options.length < 2) {
            return null;
          }
          const base = existingMap[question.id] ?? {};
          const answerIndex = Math.min(
            Math.max(Number(question.answerIndex) || 0, 0),
            options.length - 1
          );
          return {
            id: question.id ?? base.id ?? generateId('q'),
            prompt: trimmedPrompt,
            options,
            answerIndex,
            explanation: question.explanation?.trim() ?? base.explanation ?? '',
          };
        })
        .filter(Boolean);
    };

    const gradeKey = target.grade;
    const updatedModule = {
      ...target,
      topic: moduleUpdates.topic ?? target.topic,
      overview: moduleUpdates.overview ?? target.overview,
      timeEstimate: moduleUpdates.timeEstimate ?? target.timeEstimate,
      reading: Array.isArray(moduleUpdates.reading) ? moduleUpdates.reading : target.reading,
      segments: Array.isArray(moduleUpdates.segments) ? moduleUpdates.segments : target.segments,
      activities: Array.isArray(moduleUpdates.activities)
        ? moduleUpdates.activities
        : target.activities,
      outcomes: planUpdates.outcomes ?? target.outcomes ?? [],
      competencies: planUpdates.competencies ?? target.competencies ?? [],
      planNotes: planUpdates.notes ?? target.planNotes ?? '',
      week: planUpdates.week ?? target.week,
      quiz: {
        questions: prepareQuizQuestions(moduleUpdates.quizQuestions, target.quiz?.questions ?? []),
      },
    };

    setCustomModules((prev) =>
      prev.map((module) => (module.id === moduleId ? updatedModule : module))
    );

    setCurriculumPlan((prev) => {
      let updated = prev;
      updated = updateModuleWeekInPlan(updated, gradeKey, moduleId, updatedModule.week ?? 1);
      updated = updateModuleOutcomesInPlan(updated, gradeKey, moduleId, {
        outcomes: updatedModule.outcomes,
        competencies: updatedModule.competencies,
        notes: updatedModule.planNotes,
      });
      return updated;
    });

    if (subjectId) {
      setLibrary((prev) =>
        prev.map((subject) => {
          if (subject.id !== subjectId) {
            return subject;
          }
          return {
            ...subject,
            lessons: subject.lessons.map((lesson) => {
              if (lesson.moduleId !== moduleId) {
                return lesson;
              }
              const quizCount = updatedModule.quiz?.questions?.length ?? lesson.quizQuestions;
              return {
                ...lesson,
                title: lessonUpdates.title ?? updatedModule.topic,
                summary: lessonUpdates.summary ?? updatedModule.overview,
                timeEstimate: lessonUpdates.timeEstimate ?? updatedModule.timeEstimate,
                activities: updatedModule.activities?.length ?? lesson.activities ?? 0,
                quizQuestions: quizCount,
                segments: updatedModule.segments ?? lesson.segments,
                readingPages: updatedModule.reading ?? lesson.readingPages,
                activityDetails: updatedModule.activities ?? lesson.activityDetails,
              };
            }),
          };
        })
      );
    }
  };

  const handleSendChatMessage = (studentId, sender, text, subject) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const message = {
      id: generateId('msg'),
      sender,
      text: trimmed,
      subject: subject || 'Mbështetje',
      timestamp: new Date().toISOString(),
      readByStudent: sender === 'student',
      readByStaff: sender === 'staff',
    };

    setChats((prev) => {
      const previousMessages = prev[studentId] ?? [];
      return {
        ...prev,
        [studentId]: [...previousMessages, message],
      };
    });
  };

  const handleMarkChatRead = (studentId, role) => {
    setChats((prev) => {
      const messagesList = prev[studentId];
      if (!messagesList || !messagesList.length) {
        return prev;
      }

      let changed = false;
      const updated = messagesList.map((message) => {
        if (role === 'student' && message.sender === 'staff' && !message.readByStudent) {
          changed = true;
          return { ...message, readByStudent: true };
        }

        if (role === 'staff' && message.sender === 'student' && !message.readByStaff) {
          changed = true;
          return { ...message, readByStaff: true };
        }

        return message;
      });

      if (!changed) {
        return prev;
      }

      return {
        ...prev,
        [studentId]: updated,
      };
    });
  };

  const handleStudentChatSend = (studentId, text, subject) => {
    handleSendChatMessage(studentId, 'student', text, subject);
    setTypingStatus((prev) => ({
      ...prev,
      [studentId]: true,
    }));

    const replyDelay = 1400;
    setTimeout(() => {
      handleSendChatMessage(studentId, 'staff', getAutoReply(subject), subject);
      setTypingStatus((prev) => ({
        ...prev,
        [studentId]: false,
      }));
    }, replyDelay);
  };

  const handleStaffChatSend = (studentId, text, subject) => {
    setTypingStatus((prev) => ({
      ...prev,
      [studentId]: false,
    }));
    handleSendChatMessage(studentId, 'staff', text, subject);
    handleMarkChatRead(studentId, 'staff');
  };

  const handleModuleSelect = (moduleId) => {
    setActiveQuizModuleId(moduleId);
  };

  const handleOpenQuizzes = (moduleId) => {
    if (moduleId) {
      setActiveQuizModuleId(moduleId);
    }
    setActiveReadingModuleId(null);
    const replaceTop = studentHistory[studentHistory.length - 1] === 'reading';
    goToStudentSection('quizzes', { replaceTop, clearReading: true });
  };

  const handleContinueLesson = (lesson) => {
    if (!lesson) {
      return;
    }
    if (lesson.hasReading) {
      handleStartReading(lesson.id);
    } else {
      handleOpenQuizzes(lesson.id);
    }
  };

  const handleStartReading = (moduleId) => {
    const targetModule = gradeModules.find((module) => module.id === moduleId);
    if (!targetModule) {
      return;
    }
    const hasReading = Array.isArray(targetModule.reading) && targetModule.reading.length > 0;
    if (!hasReading) {
      handleOpenQuizzes(moduleId);
      return;
    }
    setActiveReadingModuleId(moduleId);
    goToStudentSection('reading');
  };

  const handleGradeChange = (grade) => {
    if (!isStaff && currentUser && currentUser.grade !== grade) {
      setSelectedGrade(currentUser.grade);
      return;
    }
    setSelectedGrade(grade);
  };

  const handleModuleWeekChange = (grade, moduleId, week) => {
    setCurriculumPlan((prev) => updateModuleWeekInPlan(prev, grade, moduleId, week));
  };

  const handleModuleOutcomesChange = (grade, moduleId, updates) => {
    setCurriculumPlan((prev) => updateModuleOutcomesInPlan(prev, grade, moduleId, updates));
  };

  const handleReadingPageComplete = (moduleId, moduleGrade, pageIndex, totalPages) => {
    if (!activeStudent) {
      return;
    }
    const gradeKey = String(moduleGrade ?? selectedGrade);
    updateReadingProgress(activeStudent.id, gradeKey, moduleId, (moduleState) => {
      const readingDoneSet = new Set(moduleState.readingDone ?? []);
      readingDoneSet.add(pageIndex);
      const readingDone = Array.from(readingDoneSet).sort((a, b) => a - b);
      return {
        ...moduleState,
        readingDone,
        readingCompleted: readingDone.length >= totalPages,
        lastReadAt: new Date().toISOString(),
      };
    });
  };

  const handleReadingModuleComplete = (moduleId, moduleGrade, totalPages) => {
    if (!activeStudent) {
      return;
    }
    const gradeKey = String(moduleGrade ?? selectedGrade);
    const allIndexes = Array.from({ length: totalPages }, (_, index) => index);
    updateReadingProgress(activeStudent.id, gradeKey, moduleId, (moduleState) => ({
      ...moduleState,
      readingDone: allIndexes,
      readingCompleted: true,
      lastReadAt: new Date().toISOString(),
    }));
    setActiveQuizModuleId(moduleId);
    setActiveReadingModuleId(null);
    goToStudentSection('quizzes', { replaceTop: true, clearReading: true });
  };

  const handleQuizComplete = (studentId, moduleId, quizResult) => {
    const score = Number(quizResult?.score ?? 0);
    const total = Number(quizResult?.total ?? 0);
    const targetStudent = accounts.find((account) => account.id === studentId);
    if (!targetStudent) {
      return;
    }

    const moduleDefinition = curriculum[selectedGrade]?.modules.find(
      (module) => module.id === moduleId
    );
    if (!moduleDefinition) {
      return;
    }

    const trimmedReasoning = (quizResult?.reasoning ?? '').trim();
    const reasoningKeywords =
      moduleDefinition.reasoningKeywords ??
      (Array.isArray(moduleDefinition.outcomes) ? moduleDefinition.outcomes : []);
    const reasoningValid =
      trimmedReasoning.length === 0
        ? true
        : isReasoningSufficient(trimmedReasoning, reasoningKeywords);
    const planEntry = getModulePlanEntry(curriculumPlan, selectedGrade, moduleId);
    const augmentedModule = {
      ...moduleDefinition,
      competencies:
        planEntry?.competencies?.length > 0 ? planEntry.competencies : moduleDefinition.competencies,
      outcomes:
        planEntry?.outcomes?.length > 0 ? planEntry.outcomes : moduleDefinition.outcomes,
    };
    const evidenceEntry =
      reasoningValid && total > 0
        ? buildQuizEvidenceRecord({
            module: augmentedModule,
            grade: selectedGrade,
            reasoning: trimmedReasoning || 'Kuizi u dorëzua pa arsyetim të shtuar.',
            score,
            total,
            competency: quizResult?.competency,
            outcome: quizResult?.outcome,
          })
        : null;

    setProgress((prev) => {
      const previousStudentProgress = prev[studentId] ?? {};
      const previousGradeProgress = previousStudentProgress[selectedGrade] ?? {};
      const previousModuleState = previousGradeProgress[moduleId] ?? {};
      const attempts = previousModuleState?.attempts ?? 0;
      const nextModuleStateBase = {
        ...previousModuleState,
        score,
        total,
        attempts: attempts + 1,
        quizPerfect: score === total,
        lastAttemptedAt: new Date().toISOString(),
        lastReasoning: trimmedReasoning,
        lastReasoningValid: reasoningValid,
      };

      if (evidenceEntry) {
        nextModuleStateBase.evidenceLog = mergeEvidenceLog(previousModuleState.evidenceLog, {
          ...evidenceEntry,
          answers: quizResult?.answers ?? [],
        });
      }

      return {
        ...prev,
        [studentId]: {
          ...previousStudentProgress,
          [selectedGrade]: {
            ...previousGradeProgress,
            [moduleId]: {
              ...nextModuleStateBase,
              completed: score === total && reasoningValid,
            },
          },
        },
      };
    });
  };

  if (!currentUser) {
    return (
      <div className="auth-shell">
        <AuthShell
          onLogin={(credentials) => handleLogin(credentials)}
          onRegister={(payload) => handleStudentRegistration(payload)}
        />
      </div>
    );
  }

  const canManageStudents = isStaff;
  const studentsForBar = isStaff ? students : students.filter((s) => s.id === currentUser.id);
  const studentBackTarget =
    studentHistory.length > 1 ? studentHistory[studentHistory.length - 2] : null;
  const staffBackTarget =
    staffHistory.length > 1 ? staffHistory[staffHistory.length - 2] : null;
  const canGoBack = mode === 'student' ? studentHistory.length > 1 : staffHistory.length > 1;
  const backTarget = mode === 'student' ? studentBackTarget : staffBackTarget;
  const backDictionary = mode === 'student' ? STUDENT_SECTION_LABELS : STAFF_SECTION_LABELS;
  const previousLabel =
    backTarget && backDictionary[backTarget] ? backDictionary[backTarget] : null;
  const backText = previousLabel ? (isMobile ? previousLabel : `Kthehu te ${previousLabel}`) : 'Kthehu';
  const handleBack = mode === 'student' ? handleStudentBack : handleStaffBack;

  return (
    <div className="app-root">
      {isMobile && isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Mbyll menynë kryesore"
        />
      )}
      <Sidebar
        mode={mode}
        isStaff={isStaff}
        activeItem={mode === 'student' ? studentSection : staffSection}
        onSelect={handleSidebarSelect}
        studentChatUnread={studentUnread}
        staffChatUnread={totalStaffUnread}
        isMobile={isMobile}
        isOpen={isMobile ? isSidebarOpen : true}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="main-panel">
        <div className="top-toolbar">
          <div className="toolbar-left">
            {isMobile && (
              <button
                type="button"
                className="menu-button"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Hap menynë kryesore"
              >
                <span className="menu-icon" aria-hidden="true" />
              </button>
            )}
            {canGoBack && (
              <button type="button" className="back-button" onClick={handleBack}>
                <span className="back-icon" aria-hidden="true">
                  ←
                </span>
                <span className="back-label">{backText}</span>
              </button>
            )}
            <ModeSwitch
              mode={mode}
              onChange={(nextMode) => {
                if (!isStaff && nextMode === 'staff') {
                  return;
                }
                setMode(nextMode);
              }}
              canAccessStaff={isStaff}
            />
          </div>
          <div className="toolbar-actions">
            {isStaff ? (
              <GradeSwitcher
                grade={selectedGrade}
                onChange={handleGradeChange}
                disabled={false}
              />
            ) : (
              <div className="grade-lock">
                Klasa jote: <span>Klasa {currentUser.grade}</span>
              </div>
            )}
            <button type="button" className="logout-button" onClick={handleLogout}>
              Çkyçu
            </button>
          </div>
        </div>

        {mode === 'student' ? (
          <>
            <StudentBar
              students={studentsForBar}
              activeStudentId={activeStudentId}
              onSelect={(studentId) => setActiveStudentId(studentId)}
              onRequestAdd={() => setIsStudentFormOpen(true)}
              canManage={canManageStudents}
            />

            <div className="content-area">
              {activeStudent ? (
                <>
                  {studentSection === 'home' && (
                    <StudentHome
                      student={activeStudent}
                      subjects={subjectsForGrade}
                      quickLessons={quickLessons}
                      modules={modulesForDisplay}
                      grade={selectedGrade}
                      canBrowseGrades={isStaff}
                      lockedCount={quickLockedCount}
                      nextLesson={nextLesson}
                      progress={gradeProgress}
                      currentWeek={currentWeek}
                      onOpenSubjects={() => goToStudentSection('subjects')}
                      onOpenQuizzes={handleOpenQuizzes}
                      onOpenChat={() => goToStudentSection('chat')}
                      onOpenReading={(moduleId) => handleStartReading(moduleId)}
                      onContinueLesson={handleContinueLesson}
                    />
                  )}

                  {studentSection === 'subjects' && (
                    <StudentSubjects
                      subjects={subjectsForGrade}
                      grade={selectedGrade}
                      modules={modulesForDisplay}
                      plan={curriculumPlan}
                      progress={gradeProgress}
                      onStartReading={handleStartReading}
                      onOpenQuizzes={handleOpenQuizzes}
                    />
                  )}

                  {studentSection === 'reading' && activeReadingModule && (
                    <StudentReading
                      module={activeReadingModule}
                      grade={activeReadingModule.grade ?? selectedGrade}
                      progressEntry={activeReadingProgressEntry}
                      onCompletePage={(pageIndex, totalPages) =>
                        handleReadingPageComplete(
                          activeReadingModule.id,
                          activeReadingModule.grade ?? selectedGrade,
                          pageIndex,
                          totalPages
                        )
                      }
                      onCompleteModule={(totalPages) =>
                        handleReadingModuleComplete(
                          activeReadingModule.id,
                          activeReadingModule.grade ?? selectedGrade,
                          totalPages
                        )
                      }
                      onExit={() => {
                        resetStudentSection('home');
                      }}
                    />
                  )}

                  {studentSection === 'reading' && !activeReadingModule && (
                    <div className="quick-empty">
                      Zgjidh një temë nga lista e kuizeve ose nga “Shto së shpejti” për të nisur
                      leximin.
                    </div>
                  )}

                  {studentSection === 'quizzes' && (
                    <StudentQuizzes
                      grade={selectedGrade}
                      plan={curriculumPlan}
                      modules={modulesForDisplay}
                      activeModule={activeQuizModule}
                      progress={gradeProgress}
                      onSelectModule={handleModuleSelect}
                      onCompleteQuiz={(moduleId, quizResult) =>
                        handleQuizComplete(activeStudent.id, moduleId, quizResult)
                      }
                      onStartReading={handleStartReading}
                    />
                  )}

                  {studentSection === 'chat' && (
                    <StudentChat
                      student={activeStudent}
                      subjects={subjectsForGrade}
                      messages={studentChatMessages}
                      onSendMessage={(text, subject) =>
                        handleStudentChatSend(activeStudent.id, text, subject)
                      }
                      onMarkRead={() => handleMarkChatRead(activeStudent.id, 'student')}
                      typing={Boolean(typingStatus[activeStudent.id])}
                      onPlaySend={playSendSound}
                      onPlayReceive={playReceiveSound}
                    />
                  )}

                  {studentSection === 'profile' && (
                    <StudentProfile
                      student={activeStudent}
                      stats={profileStats}
                      isStaff={isStaff}
                      onUpdate={handleUpdateStudent}
                      onRequestNameChange={handleNameChangeRequest}
                    />
                  )}
                </>
              ) : (
                <div className="quick-empty">
                  Nuk ka nxënës të zgjedhur. Shto një nxënës të ri ose zgjidh nga lista.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="content-area">
            {staffSection === 'chats' ? (
              <StaffChatCenter
                students={students}
                chats={chats}
                activeStudentId={activeChatStudentId}
                onSelectStudent={setActiveChatStudentId}
                onSendMessage={(studentId, text, subject) =>
                  handleStaffChatSend(studentId, text, subject)
                }
                onMarkRead={(studentId) => handleMarkChatRead(studentId, 'staff')}
                typingStatus={typingStatus}
                onPlaySend={playSendSound}
                onPlayReceive={playReceiveSound}
              />
            ) : (
              <StaffPanel
                section={staffSection}
                library={library}
                grade={selectedGrade}
                modules={gradeModules}
                plan={curriculumPlan}
                customModules={customModules}
                onAddSubject={handleAddSubject}
                onAddLesson={handleAddLesson}
                onUpdateModuleWeek={handleModuleWeekChange}
                onUpdateModuleOutcomes={handleModuleOutcomesChange}
                onUpdateCustomModule={handleUpdateCustomModule}
              />
            )}
          </div>
        )}
      </main>

      {isStaff && isStudentFormOpen && (
        <StudentSetupModal
          onClose={() => setIsStudentFormOpen(false)}
          onSubmit={handleCreateStudent}
        />
      )}

      {currentUser && (
        <div className={`chat-widget ${isChatWidgetOpen ? 'chat-widget-open' : ''}`}>
          <button
            type="button"
            className={`chat-widget-toggle ${isChatWidgetOpen ? 'chat-widget-toggle-open' : ''}`}
            onClick={() => setIsChatWidgetOpen((prev) => !prev)}
            aria-expanded={isChatWidgetOpen}
            aria-label={isChatWidgetOpen ? 'Mbyll chatin e ndihmës' : 'Hap chatin e ndihmës'}
          >
            <span className="chat-widget-label">
              <span className="chat-widget-icon" role="img" aria-hidden="true">
                🛟
              </span>
              <span>Ndihmë</span>
            </span>
            {!isChatWidgetOpen &&
              (currentUser.role === 'staff' ? totalStaffUnread : studentSelfUnread) > 0 && (
                <span className="chat-widget-badge">
                  {currentUser.role === 'staff' ? totalStaffUnread : studentSelfUnread}
                </span>
              )}
            {isChatWidgetOpen && (
              <span className="chat-widget-close-icon" aria-hidden="true">
                ×
              </span>
            )}
          </button>
          {isChatWidgetOpen && (
            <div className="chat-widget-panel">
              {currentUser.role === 'staff' ? (
                <StaffChatCenter
                  students={students}
                  chats={chats}
                  activeStudentId={activeChatStudentId}
                  onSelectStudent={setActiveChatStudentId}
                  onSendMessage={(studentId, text, subject) =>
                    handleStaffChatSend(studentId, text, subject)
                  }
                  onMarkRead={(studentId) => handleMarkChatRead(studentId, 'staff')}
                  variant="widget"
                  onClose={() => setIsChatWidgetOpen(false)}
                  typingStatus={typingStatus}
                  onPlaySend={playSendSound}
                  onPlayReceive={playReceiveSound}
                />
              ) : (
                <StudentChat
                  student={currentUser}
                  subjects={subjectsForGrade}
                  messages={studentSelfMessages}
                  onSendMessage={(text, subject) =>
                    handleStudentChatSend(currentUser.id, text, subject)
                  }
                  onMarkRead={() => handleMarkChatRead(currentUser.id, 'student')}
                  variant="widget"
                  onClose={() => setIsChatWidgetOpen(false)}
                  typing={Boolean(typingStatus[currentUser.id])}
                  onPlaySend={playSendSound}
                  onPlayReceive={playReceiveSound}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
