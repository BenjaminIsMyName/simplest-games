import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameIntroOverlay } from './GameIntroOverlay';
import { RewardConfetti } from './RewardConfetti';
import { useAppData } from '../context/AppDataContext';
import { buildConfettiBurst } from '../utils/confetti';

const englishKeyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const hebrewKeyboardRows = [
  ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
  ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך'],
  ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ'],
];

const englishCodingWords = [
  'code',
  'debug',
  'loop',
  'array',
  'value',
  'input',
  'logic',
  'class',
  'react',
  'state',
  'stack',
  'string',
  'return',
  'object',
  'method',
  'binary',
  'python',
  'script',
  'compile',
  'syntax',
  'function',
  'boolean',
  'console',
  'variable',
];

const hebrewCodingWords = [
  'קוד',
  'באג',
  'קלט',
  'פלט',
  'מסך',
  'אתר',
  'שרת',
  'נתון',
  'מערך',
  'לולאה',
  'רובוט',
  'מחשב',
  'תגובה',
  'פונקציה',
  'משתנה',
  'מחלקה',
  'תחביר',
  'תנאי',
  'מסוף',
  'תיקון',
];

const languageOptions = [
  { id: 'english', label: 'אנגלית' },
  { id: 'hebrew', label: 'עברית' },
];

const languageConfigs = {
  english: {
    id: 'english',
    label: 'אנגלית',
    keyboardLabel: 'אנגלית',
    keyboardRows: englishKeyboardRows,
    initialMessage: 'מתחילים מהבסיס. מוצאים את F ואת J ומקלידים ברוגע.',
    restartMessage: 'מתחילים מחדש מהבסיס. קודם F ו-J, אחר כך כל השאר.',
    unsupportedKeyMessage: 'במשחק הזה מתרגלים אותיות באנגלית ורווחים בין מילים.',
    lessons: [
      {
        id: 'fj-basics',
        title: 'שיעור 1: F ו-J',
        subtitle: 'מוצאים את שתי האותיות עם הבליטות ומתרגלים תנועה בטוחה.',
        mode: 'letters',
        keys: ['F', 'J'],
        roundsRequired: 3,
        sequenceLength: 10,
        focusLabel: 'F / J',
      },
      {
        id: 'dk-balance',
        title: 'שיעור 2: D ו-K',
        subtitle: 'מוסיפים עוד זוג למרכז כדי להרגיש את שורת הבית.',
        mode: 'letters',
        keys: ['F', 'J', 'D', 'K'],
        roundsRequired: 3,
        sequenceLength: 12,
        focusLabel: 'D / K',
      },
      {
        id: 'sl-expand',
        title: 'שיעור 3: S ו-L',
        subtitle: 'הידיים זזות צעד אחד לצדדים ועדיין נשארות רגועות.',
        mode: 'letters',
        keys: ['F', 'J', 'D', 'K', 'S', 'L'],
        roundsRequired: 3,
        sequenceLength: 14,
        focusLabel: 'S / L',
      },
      {
        id: 'home-row',
        title: 'שיעור 4: כל שורת הבית',
        subtitle: 'מכניסים גם A, G ו-H ומשלימים את מרכז המקלדת.',
        mode: 'letters',
        keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        roundsRequired: 3,
        sequenceLength: 16,
        focusLabel: 'A / G / H',
      },
      {
        id: 'top-row',
        title: 'שיעור 5: עולים לשורה העליונה',
        subtitle: 'מוסיפים את QWERTYUIOP ומתחילים להרגיש את כל האזור העליון.',
        mode: 'letters',
        keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        roundsRequired: 3,
        sequenceLength: 18,
        focusLabel: 'Q / T / U / P',
      },
      {
        id: 'bottom-row',
        title: 'שיעור 6: השורה התחתונה',
        subtitle: 'מוסיפים את ZXCVBNM ומכירים את כל האותיות במקלדת.',
        mode: 'letters',
        keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        roundsRequired: 3,
        sequenceLength: 20,
        focusLabel: 'Z / X / C / V / B / N / M',
      },
      {
        id: 'easy-coding-words',
        title: 'שיעור 7: מילים קצרות של קוד',
        subtitle: 'עוברים מאותיות בודדות למילים פשוטות מעולם התכנות.',
        mode: 'words',
        keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        roundsRequired: 3,
        wordPool: ['code', 'loop', 'debug', 'input', 'logic', 'react', 'class', 'stack'],
        wordsPerRound: 3,
        focusLabel: 'code / loop / debug',
      },
      {
        id: 'medium-coding-words',
        title: 'שיעור 8: מילים ארוכות יותר',
        subtitle: 'מתאמנים על מושגים מרכזיים כמו array, string ו-return.',
        mode: 'words',
        keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        roundsRequired: 3,
        wordPool: ['array', 'value', 'string', 'return', 'object', 'method', 'state', 'script'],
        wordsPerRound: 3,
        focusLabel: 'array / string / return',
      },
      {
        id: 'advanced-coding-words',
        title: 'שיעור 9: מילים מתקדמות',
        subtitle: 'מגיעים למושגים ארוכים יותר כמו function ו-variable.',
        mode: 'words',
        keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        roundsRequired: 3,
        wordPool: ['function', 'boolean', 'console', 'compile', 'syntax', 'python', 'binary', 'variable'],
        wordsPerRound: 2,
        focusLabel: 'function / variable / syntax',
      },
      {
        id: 'coding-challenge',
        title: 'שיעור 10: אתגר ההקלדה',
        subtitle: 'כאן כבר מקלידים רצפים מלאים של מושגי תכנות ונשארים מדויקים.',
        mode: 'words',
        keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        roundsRequired: 999,
        wordPool: englishCodingWords,
        wordsPerRound: 4,
        focusLabel: 'אתגר חופשי של מילים מעולם הקוד',
      },
    ],
  },
  hebrew: {
    id: 'hebrew',
    label: 'עברית',
    keyboardLabel: 'עברית',
    keyboardRows: hebrewKeyboardRows,
    initialMessage: 'מתחילים מהבסיס. מוצאים את כ ואת ח ומקלידים ברוגע.',
    restartMessage: 'מתחילים מחדש מהבסיס. קודם כ ו-ח, אחר כך כל השאר.',
    unsupportedKeyMessage: 'במשחק הזה מתרגלים אותיות בעברית ורווחים בין מילים.',
    lessons: [
      {
        id: 'kah-het-basics',
        title: 'שיעור 1: כ ו-ח',
        subtitle: 'מוצאים את שתי האותיות שבמרכז שורת הבית ומתרגלים תנועה בטוחה.',
        mode: 'letters',
        keys: ['כ', 'ח'],
        roundsRequired: 3,
        sequenceLength: 10,
        focusLabel: 'כ / ח',
      },
      {
        id: 'gimel-lamed',
        title: 'שיעור 2: ג ו-ל',
        subtitle: 'מוסיפים עוד זוג קרוב למרכז ומתחילים להרגיש את שורת הבית.',
        mode: 'letters',
        keys: ['כ', 'ח', 'ג', 'ל'],
        roundsRequired: 3,
        sequenceLength: 12,
        focusLabel: 'ג / ל',
      },
      {
        id: 'dalet-final-kaf',
        title: 'שיעור 3: ד ו-ך',
        subtitle: 'הידיים זזות עוד צעד קטן לצדדים ועדיין שומרות על קצב רגוע.',
        mode: 'letters',
        keys: ['כ', 'ח', 'ג', 'ל', 'ד', 'ך'],
        roundsRequired: 3,
        sequenceLength: 14,
        focusLabel: 'ד / ך',
      },
      {
        id: 'home-row-hebrew',
        title: 'שיעור 4: כל שורת הבית',
        subtitle: 'מכניסים גם ש, ע ו-י ומשלימים את מרכז המקלדת בעברית.',
        mode: 'letters',
        keys: ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך'],
        roundsRequired: 3,
        sequenceLength: 16,
        focusLabel: 'ש / ע / י',
      },
      {
        id: 'top-row-hebrew',
        title: 'שיעור 5: עולים לשורה העליונה',
        subtitle: 'מוסיפים את ק, ר, א, ט, ו, ן, ם, פ ומרחיבים את אזור התרגול.',
        mode: 'letters',
        keys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך'],
        roundsRequired: 3,
        sequenceLength: 18,
        focusLabel: 'ק / ט / ו / פ',
      },
      {
        id: 'bottom-row-hebrew',
        title: 'שיעור 6: השורה התחתונה',
        subtitle: 'מוסיפים את ז, ס, ב, ה, נ, מ, צ ומכירים כמעט את כל המקלדת.',
        mode: 'letters',
        keys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ'],
        roundsRequired: 3,
        sequenceLength: 20,
        focusLabel: 'ז / ס / ב / ה / נ / מ / צ',
      },
      {
        id: 'easy-hebrew-words',
        title: 'שיעור 7: מילים קצרות',
        subtitle: 'עוברים מאותיות בודדות למילים פשוטות מהעולם הדיגיטלי.',
        mode: 'words',
        keys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ'],
        roundsRequired: 3,
        wordPool: ['קוד', 'באג', 'קלט', 'פלט', 'מסך', 'אתר', 'רובוט', 'מחשב'],
        wordsPerRound: 3,
        focusLabel: 'קוד / קלט / פלט',
      },
      {
        id: 'medium-hebrew-words',
        title: 'שיעור 8: מילים ארוכות יותר',
        subtitle: 'מתאמנים על מושגים שימושיים כמו משתנה, מערך ותגובה.',
        mode: 'words',
        keys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ'],
        roundsRequired: 3,
        wordPool: ['מערך', 'נתון', 'תגובה', 'שרת', 'לולאה', 'מסוף', 'תנאי', 'תחביר'],
        wordsPerRound: 3,
        focusLabel: 'מערך / תגובה / תנאי',
      },
      {
        id: 'advanced-hebrew-words',
        title: 'שיעור 9: מושגים מתקדמים',
        subtitle: 'מגיעים למילים ארוכות יותר כמו פונקציה, מחלקה ומשתנה.',
        mode: 'words',
        keys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ'],
        roundsRequired: 3,
        wordPool: ['פונקציה', 'משתנה', 'מחלקה', 'תחביר', 'תיקון', 'לולאה', 'מסוף', 'רובוט'],
        wordsPerRound: 2,
        focusLabel: 'פונקציה / משתנה / מחלקה',
      },
      {
        id: 'hebrew-challenge',
        title: 'שיעור 10: אתגר ההקלדה',
        subtitle: 'כאן כבר מקלידים רצפים מלאים של מילים בעברית ושומרים על דיוק.',
        mode: 'words',
        keys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', 'ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ'],
        roundsRequired: 999,
        wordPool: hebrewCodingWords,
        wordsPerRound: 4,
        focusLabel: 'אתגר חופשי של מילים בעברית',
      },
    ],
  },
};

const buildLetterSequence = (keys, sequenceLength) => {
  const chars = [];

  for (let index = 0; index < sequenceLength; index += 1) {
    const nextKey = keys[Math.floor(Math.random() * keys.length)];

    if (chars.length >= 2 && chars[chars.length - 1] === nextKey && chars[chars.length - 2] === nextKey) {
      const fallbackIndex = (keys.indexOf(nextKey) + 1) % keys.length;
      chars.push(keys[fallbackIndex]);
    } else {
      chars.push(nextKey);
    }
  }

  return chars.join('');
};

const buildWordSequence = (wordPool, wordsPerRound) => {
  const words = [];

  for (let index = 0; index < wordsPerRound; index += 1) {
    words.push(wordPool[Math.floor(Math.random() * wordPool.length)]);
  }

  return words.join(' ');
};

const buildPromptForLesson = (lesson) => {
  if (lesson.mode === 'words') {
    return buildWordSequence(lesson.wordPool, lesson.wordsPerRound);
  }

  return buildLetterSequence(lesson.keys, lesson.sequenceLength);
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
};

const getMessageToneClass = (tone) => {
  if (tone === 'success') {
    return 'bg-green-100 text-green-800 shadow-[0_0_0_1px_rgba(34,197,94,0.18)] animate-pulse';
  }

  if (tone === 'keyboard-warning') {
    return 'bg-rose-100 text-rose-800 shadow-[0_0_0_1px_rgba(244,63,94,0.18)] ring-2 ring-rose-200';
  }

  if (tone === 'warning') {
    return 'bg-amber-100 text-amber-800';
  }

  return 'bg-primary-container/60 text-primary';
};

const buildTutorialSteps = (languageConfig) => [
  {
    icon: 'keyboard',
    title: 'מסתכלים על האות המודגשת',
    description: 'בכל רגע יש אות או רווח שצריך להקליד. המקלדת הוויזואלית וההדגשה הגדולה באמצע מראות בדיוק מה הבא בתור.',
  },
  {
    icon: 'spellcheck',
    title: 'משלימים שורת תרגול',
    description: 'כשמסיימים את כל הרצף של האותיות או המילים, מקבלים נקודות, קונפטי קטן, וממשיכים לסבב הבא.',
  },
  {
    icon: 'language',
    title: `בודקים שהמקלדת על ${languageConfig.keyboardLabel}`,
    description: `לפני שמתחילים, חשוב לוודא שהמקלדת במחשב על ${languageConfig.keyboardLabel}. אם היא על שפה אחרת המשחק יבקש להחליף.`,
  },
  {
    icon: 'restart_alt',
    title: 'טעות מתחילה את התרגול מחדש',
    description: 'אם טועים מתחילים את השורה מחדש, ולכן חשוב להקליד לאט ובדיוק.',
  },
];

const isHebrewCharacter = (value) => /[\u0590-\u05FF]/.test(value);
const isEnglishCharacter = (value) => /^[A-Za-z]$/.test(value);

const normalizeKeyByLanguage = (rawKey, language) => {
  if (rawKey.length !== 1) {
    return rawKey;
  }

  return language === 'english' ? rawKey.toUpperCase() : rawKey;
};

const isSupportedTypingKey = (rawKey, language) => {
  if (rawKey === ' ') {
    return true;
  }

  return language === 'english' ? isEnglishCharacter(rawKey) : isHebrewCharacter(rawKey);
};

const isWrongKeyboardKey = (rawKey, language) => {
  return language === 'english' ? isHebrewCharacter(rawKey) : isEnglishCharacter(rawKey);
};

const getDisplayPromptChar = (char, language) => {
  if (char === ' ') {
    return '';
  }

  return language === 'english' ? char.toUpperCase() : char;
};

export const TouchTypingGame = () => {
  const navigate = useNavigate();
  const { recordActivity } = useAppData();
  const inputRef = useRef(null);
  const syncedScoreRef = useRef(0);
  const sessionRecordedRef = useRef(false);
  const confettiIdRef = useRef(0);

  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lessonRound, setLessonRound] = useState(0);
  const [promptText, setPromptText] = useState(() => buildPromptForLesson(languageConfigs.english.lessons[0]));
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [message, setMessage] = useState(languageConfigs.english.initialMessage);
  const [messageTone, setMessageTone] = useState('neutral');
  const [typedValue, setTypedValue] = useState('');
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [correctKeys, setCorrectKeys] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);
  const [score, setScore] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [confettiBursts, setConfettiBursts] = useState([]);

  const languageConfig = languageConfigs[selectedLanguage];
  const lessons = languageConfig.lessons;
  const keyboardRows = languageConfig.keyboardRows;
  const tutorialSteps = useMemo(() => buildTutorialSteps(languageConfig), [languageConfig]);
  const lesson = lessons[lessonIndex];
  const promptChars = useMemo(() => promptText.split(''), [promptText]);
  const expectedKey = promptChars[currentCharIndex] ?? promptChars[promptChars.length - 1] ?? '';
  const displayedExpectedKey = getDisplayPromptChar(expectedKey, selectedLanguage);
  const accuracy = totalKeys === 0 ? 100 : Math.round((correctKeys / totalKeys) * 100);
  const wordsTyped = correctKeys / 5;
  const minutesPlayed = Math.max(elapsedSeconds / 60, 1 / 60);
  const wpm = Math.round(wordsTyped / minutesPlayed);
  const totalRounds = lessons.reduce((sum, item) => sum + Math.min(item.roundsRequired, 3), 0);
  const progressUnits = completedRounds + (promptChars.length === 0 ? 0 : currentCharIndex / promptChars.length);
  const robotProgress = Math.min(100, Math.round((progressUnits / totalRounds) * 100));
  const lessonRoundDisplay = lesson.roundsRequired > 50 ? 'חופשי' : `${lessonRound + 1} / ${lesson.roundsRequired}`;

  useEffect(() => {
    const timerId = window.setInterval(() => {
      if (startedAt) {
        setElapsedSeconds((Date.now() - startedAt) / 1000);
      }
    }, 250);

    return () => window.clearInterval(timerId);
  }, [startedAt]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedLanguage, lessonIndex, lessonRound, currentCharIndex]);

  useEffect(() => {
    if (score <= syncedScoreRef.current) {
      return;
    }

    const delta = score - syncedScoreRef.current;
    recordActivity({
      score: delta,
      game: 'typing',
      typingBestWpm: wpm,
      countSession: !sessionRecordedRef.current,
    });

    syncedScoreRef.current = score;
    sessionRecordedRef.current = true;
  }, [recordActivity, score, wpm]);

  const launchConfetti = () => {
    const burstId = confettiIdRef.current + 1;
    confettiIdRef.current = burstId;
    setConfettiBursts((current) => [...current, buildConfettiBurst(burstId)]);
    window.setTimeout(() => {
      setConfettiBursts((current) => current.filter((burst) => burst.id !== burstId));
    }, 1900);
  };

  const resetGameState = (languageId = selectedLanguage) => {
    const nextConfig = languageConfigs[languageId];
    const nextLessons = nextConfig.lessons;

    setLessonIndex(0);
    setLessonRound(0);
    setPromptText(buildPromptForLesson(nextLessons[0]));
    setCurrentCharIndex(0);
    setMessage(nextConfig.restartMessage);
    setMessageTone('neutral');
    setTypedValue('');
    setStartedAt(null);
    setElapsedSeconds(0);
    setCorrectKeys(0);
    setTotalKeys(0);
    setScore(0);
    setCompletedRounds(0);
    syncedScoreRef.current = 0;
    sessionRecordedRef.current = false;
    inputRef.current?.focus();
  };

  const startLessonRound = (nextLessonIndex, nextRound, customMessage, tone = 'success') => {
    const nextLesson = lessons[nextLessonIndex];
    setLessonIndex(nextLessonIndex);
    setLessonRound(nextRound);
    setPromptText(buildPromptForLesson(nextLesson));
    setCurrentCharIndex(0);
    setTypedValue('');
    setMessage(customMessage);
    setMessageTone(tone);
  };

  const restartCurrentPrompt = () => {
    setCurrentCharIndex(0);
    setTypedValue('');
  };

  const restartGame = () => {
    resetGameState(selectedLanguage);
  };

  const changeLanguage = (languageId) => {
    if (languageId === selectedLanguage) {
      return;
    }

    setSelectedLanguage(languageId);
    setShowTutorial(true);
    setConfettiBursts([]);
    resetGameState(languageId);
  };

  const handleSuccessfulRound = () => {
    launchConfetti();
    const roundBonus = lesson.mode === 'words' ? 30 : 20;
    setCompletedRounds((current) => current + 1);
    setScore((current) => current + roundBonus);

    if (lessonRound + 1 < lesson.roundsRequired) {
      startLessonRound(
        lessonIndex,
        lessonRound + 1,
        'מעולה! סיימתם עוד סבב. ממשיכים לעוד תרגול באותו השלב.',
      );
      return;
    }

    if (lessonIndex < lessons.length - 1) {
      startLessonRound(
        lessonIndex + 1,
        0,
        `אלופים! פתחתם את ${lessons[lessonIndex + 1].title}. ${lessons[lessonIndex + 1].subtitle}`,
      );
      return;
    }

    startLessonRound(
      lessonIndex,
      lessonRound,
      'אלופים! סיימתם עוד סבב אתגר. ממשיכים לעוד מילים ותרגול.',
    );
  };

  const handleKeyDown = (event) => {
    const rawKey = event.key;
    const normalizedKey = normalizeKeyByLanguage(rawKey, selectedLanguage);

    if (rawKey === 'Tab') {
      return;
    }

    event.preventDefault();

    if (isWrongKeyboardKey(rawKey, selectedLanguage)) {
      setMessage(`יש לשנות את המקלדת ל${languageConfig.keyboardLabel} כדי להמשיך בתרגול.`);
      setMessageTone('keyboard-warning');
      window.setTimeout(() => setTypedValue(''), 120);
      return;
    }

    if (!isSupportedTypingKey(rawKey, selectedLanguage)) {
      setMessage(languageConfig.unsupportedKeyMessage);
      setMessageTone('warning');
      return;
    }

    if (!startedAt) {
      setStartedAt(Date.now());
    }

    setTypedValue(rawKey === ' ' ? 'space' : normalizedKey);
    setTotalKeys((current) => current + 1);

    const expectedNormalizedKey = normalizeKeyByLanguage(expectedKey, selectedLanguage);
    const typedKey = rawKey === ' ' ? ' ' : normalizedKey;

    if (typedKey === expectedNormalizedKey) {
      const nextIndex = currentCharIndex + 1;
      setCorrectKeys((current) => current + 1);

      if (nextIndex >= promptChars.length) {
        handleSuccessfulRound();
      } else {
        const nextExpected = promptChars[nextIndex];
        setCurrentCharIndex(nextIndex);
        setMessage(
          nextExpected === ' '
            ? 'נהדר! עכשיו לחצו על רווח.'
            : `מצוין! ממשיכים עם האות ${getDisplayPromptChar(nextExpected, selectedLanguage)}.`,
        );
        setMessageTone('success');
      }

      window.setTimeout(() => setTypedValue(''), 120);
      return;
    }

    setMessage(
      expectedKey === ' '
        ? 'אופס, כאן היה צריך רווח. מתחילים את התרגול מההתחלה.'
        : `אופס, חיפשנו את ${displayedExpectedKey}. מתחילים את התרגול מההתחלה.`,
    );
    setMessageTone('warning');
    restartCurrentPrompt();
    window.setTimeout(() => setTypedValue(''), 180);
  };

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-3 md:py-4 flex flex-col gap-4 relative z-10 min-h-[calc(100vh-5.5rem)]">
      {showTutorial && (
        <GameIntroOverlay
          title="הקלדה עיוורת"
          subtitle="לפני שמתחילים לתרגל, הנה כמה צעדים קטנים שיעזרו להבין את המשחק."
          steps={tutorialSteps}
          accent="secondary"
          onClose={() => setShowTutorial(false)}
        />
      )}
      <RewardConfetti bursts={confettiBursts} />
      <div className="fixed inset-0 paper-grain pointer-events-none" />

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-surface-container-lowest p-4 rounded-[1.5rem] shadow-[0_6px_0_0_rgba(0,97,164,0.08)] flex items-center justify-between border-2 border-primary/10">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-500">מהירות</span>
            <span className="text-2xl xl:text-3xl font-black text-primary font-headline tracking-tight">
              {wpm} <small className="text-base xl:text-lg">WPM</small>
            </span>
          </div>
          <div className="w-10 h-10 xl:w-12 xl:h-12 bg-primary-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl xl:text-3xl">speed</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-[1.5rem] shadow-[0_6px_0_0_rgba(120,89,0,0.08)] flex items-center justify-between border-2 border-secondary/10">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-500">דיוק</span>
            <span className="text-2xl xl:text-3xl font-black text-secondary font-headline tracking-tight">{accuracy}%</span>
          </div>
          <div className="w-10 h-10 xl:w-12 xl:h-12 bg-secondary-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-2xl xl:text-3xl">target</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-[1.5rem] shadow-[0_6px_0_0_rgba(0,110,28,0.08)] flex items-center justify-between border-2 border-tertiary/10">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-500">זמן</span>
            <span className="text-2xl xl:text-3xl font-black text-tertiary font-headline tracking-tight">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="w-10 h-10 xl:w-12 xl:h-12 bg-tertiary-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-2xl xl:text-3xl">timer</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-[1.5rem] shadow-[0_6px_0_0_rgba(0,97,164,0.08)] flex flex-col gap-3 border-2 border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-500">נקודות</span>
              <span className="text-2xl xl:text-3xl font-black text-primary font-headline tracking-tight">{score}</span>
            </div>
            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-primary-container rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl xl:text-3xl">stars</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500">שפת תרגול</span>
            <div className="grid grid-cols-2 gap-2">
              {languageOptions.map((option) => {
                const isActive = option.id === selectedLanguage;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => changeLanguage(option.id)}
                    className={`rounded-full px-3 py-2 text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-[0_4px_0_0_#00497d]'
                        : 'bg-primary-container/55 text-primary hover:bg-primary-container'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low p-4 md:p-5 rounded-[1.75rem] relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">התקדמות התלמיד</span>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm">
            {lesson.title}
          </span>
          <span className="rounded-full bg-secondary-container px-4 py-2 text-sm font-bold text-secondary shadow-sm">
            סבב: {lessonRoundDisplay}
          </span>
        </div>
        <p className="text-on-surface-variant font-medium mb-4 text-sm md:text-base">{lesson.subtitle}</p>
        <div className="h-8 md:h-9 w-full bg-surface-container-highest rounded-full relative shadow-inner overflow-visible">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${robotProgress}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 bg-white p-1.5 rounded-full border-[3px] border-primary shadow-lg scale-100 z-20 transition-all duration-500"
            style={{ right: `${Math.max(4, 100 - robotProgress)}%` }}
          >
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              smart_toy
            </span>
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">sports_score</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 flex-1">
        <div className="bg-surface-container-lowest p-5 md:p-7 rounded-[1.75rem] shadow-xl border-2 border-surface-variant text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className={`w-full max-w-4xl rounded-[1.5rem] px-4 py-3 text-center font-bold text-base md:text-lg transition-all ${getMessageToneClass(messageTone)}`}>
              {message}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="rounded-full bg-primary-container px-4 py-2 text-primary font-bold shadow-sm text-sm md:text-base">
                אותיות התרגול עכשיו: {lesson.focusLabel}
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-on-surface font-bold shadow-sm text-sm md:text-base">
                טעות? מתחילים את התרגול מההתחלה
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 font-headline text-2xl md:text-4xl xl:text-5xl font-extrabold tracking-tight dir-ltr" dir="ltr">
              {promptChars.map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  className={
                    char === ' '
                      ? index < currentCharIndex
                        ? 'w-4 md:w-6 border-b-4 border-green-600'
                        : index === currentCharIndex
                          ? 'w-8 md:w-10 border-b-8 border-primary rounded-sm animate-pulse'
                          : 'w-4 md:w-6 border-b-4 border-outline-variant'
                      : index < currentCharIndex
                        ? 'text-green-600'
                        : index === currentCharIndex
                          ? 'text-primary border-b-8 border-primary rounded-sm animate-pulse'
                          : 'text-outline-variant'
                  }
                >
                  {getDisplayPromptChar(char, selectedLanguage)}
                </span>
              ))}
            </div>

            <div className="w-full max-w-md">
              <input
                ref={inputRef}
                autoFocus
                value={typedValue}
                onChange={() => {}}
                onBlur={() => inputRef.current?.focus()}
                onKeyDown={handleKeyDown}
                className="w-full text-center py-4 px-6 rounded-[1.25rem] bg-surface-container-high border-none focus:ring-4 focus:ring-primary/20 text-xl md:text-2xl font-body transition-all shadow-inner"
                placeholder="התחילו להקליד כאן..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-3 text-secondary font-bold text-base md:text-lg animate-pulse" dir="ltr">
              <span className="material-symbols-outlined">keyboard</span>
              <span>
                {expectedKey === ' ' ? 'לחצו על מקש הרווח' : 'הקישו על האות'}
                {expectedKey !== ' ' && (
                  <span className="text-2xl font-headline bg-secondary-container px-3 py-1 rounded-lg mx-2">
                    {displayedExpectedKey}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-high p-3 md:p-4 rounded-[1.75rem] border-b-8 border-slate-300 hidden lg:block">
          <div className="flex flex-col gap-2 max-w-4xl mx-auto dir-ltr" dir="ltr">
            {keyboardRows.map((row, rowIndex) => (
              <div
                key={row.join('')}
                className={`flex justify-center gap-2 ${rowIndex === 1 ? 'ml-4' : ''} ${rowIndex === 2 ? 'ml-8' : ''}`}
              >
                {row.map((key) => {
                  const isTarget = key === displayedExpectedKey;
                  const isLessonKey = lesson.keys.includes(key);

                  return (
                    <div
                      key={key}
                      className={`keyboard-key w-10 h-10 xl:w-12 xl:h-12 rounded-lg flex items-center justify-center font-bold text-sm xl:text-base ${
                        isTarget
                          ? 'bg-primary text-white shadow-[0_4px_0_0_#00497d] scale-110 ring-4 ring-primary-container ring-offset-2'
                          : isLessonKey
                            ? 'bg-tertiary-container text-tertiary shadow-[0_4px_0_0_rgba(0,110,28,0.18)]'
                            : 'bg-white shadow-[0_4px_0_0_#cbd5e1]'
                      }`}
                    >
                      {key}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="flex justify-center mt-2">
              <div
                className={`keyboard-key w-64 xl:w-80 h-10 xl:h-12 rounded-lg ${
                  expectedKey === ' '
                    ? 'bg-primary text-white shadow-[0_4px_0_0_#00497d] ring-4 ring-primary-container ring-offset-2'
                    : 'bg-white shadow-[0_4px_0_0_#cbd5e1]'
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center justify-center gap-3 mt-1">
        <button
          onClick={restartGame}
          className="flex items-center gap-3 bg-secondary text-on-secondary px-7 py-3 rounded-xl font-bold text-lg shadow-[0_4px_0_0_#5b4300] hover:translate-y-1 hover:shadow-none transition-all"
        >
          <span className="material-symbols-outlined">refresh</span>
          הפעלה מחדש
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 bg-surface-container-highest text-on-surface px-7 py-3 rounded-xl font-bold text-lg border-b-4 border-slate-300 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
          חזרה לתפריט
        </button>
      </section>
    </main>
  );
};
