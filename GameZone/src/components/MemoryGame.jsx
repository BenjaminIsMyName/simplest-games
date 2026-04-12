import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mpgLogo from '../assets/mpg-logo.png';
import { useAppData } from '../context/AppDataContext';

const wordsList = [
  { key: 'File', value: 'קובץ', info: 'מסמך או אוסף נתונים שנשמרים במחשב.' },
  { key: 'Folder', value: 'תיקייה', info: 'מקום שבו שומרים ומארגנים קבצים.' },
  { key: 'Open', value: 'פתח', info: 'פעולה שמציגה קובץ או תוכנה על המסך.' },
  { key: 'Save', value: 'שמור', info: 'שמירת העבודה שביצענו כדי שלא תלך לאיבוד.' },
  { key: 'Delete', value: 'מחק', info: 'הסרה של קובץ, שורת קוד או מידע.' },
  { key: 'Rename', value: 'שנה שם', info: 'מתן שם חדש לקובץ או לתיקייה.' },
  { key: 'Copy', value: 'העתק', info: 'יצירת עותק נוסף של טקסט או קובץ.' },
  { key: 'Paste', value: 'הדבק', info: 'הכנסת התוכן שהועתק למקום חדש.' },
  { key: 'Run', value: 'הרץ', info: 'הפעלה של קוד או של תוכנה.' },
  { key: 'Code', value: 'קוד', info: 'הוראות שכתובות בשפת תכנות.' },
  { key: 'Function', value: 'פונקציה', info: 'בלוק קוד שמבצע משימה מסוימת.' },
  { key: 'Number', value: 'מספר', info: 'ערך מספרי שמופיע בתוכנית.' },
  { key: 'If', value: 'אם', info: 'תנאי שמחליט מתי הקוד יפעל.' },
  { key: 'While', value: 'כל עוד', info: 'לולאה שרצה כל עוד תנאי מתקיים.' },
  { key: 'Push', value: 'שלח', info: 'העלאת קוד למאגר מרוחק כמו GitHub.' },
  { key: 'Computer', value: 'מחשב', info: 'המכשיר שעליו אנחנו כותבים ומריצים קוד.' },
];

const levelOptions = [
  { id: 'beginner', label: '6 מילים' },
  { id: 'easy', label: '8 מילים' },
  { id: 'medium', label: '12 מילים' },
  { id: 'hard', label: 'כל המילים' },
];

const defaultMessage = 'מצאו זוגות תואמים כדי לצבור נקודות וללמוד מושגים חדשים.';

class MemoryGameEngine {
  constructor(words, level = 'easy') {
    this.words = words;
    this.level = level;
    this.matches = 0;
    this.firstCard = null;
    this.secondCard = null;
    this.lockBoard = false;
    this.deck = [];
    this.levelConfig = {
      beginner: { pairs: 6, matchPoints: 10, winBonus: 40 },
      easy: { pairs: 8, matchPoints: 10, winBonus: 60 },
      medium: { pairs: 12, matchPoints: 15, winBonus: 120 },
      hard: { pairs: 0, matchPoints: 20, winBonus: 200 },
    };
    this.setLevel(level);
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  setLevel(level) {
    this.level = level;
    const config = this.levelConfig[level] || this.levelConfig.easy;
    this.config = {
      ...config,
      pairs: level === 'hard' ? this.words.length : config.pairs,
    };
    this.reset();
  }

  reset() {
    this.matches = 0;
    this.firstCard = null;
    this.secondCard = null;
    this.lockBoard = false;
    this.buildDeck();
  }

  buildDeck() {
    const chosenWords = this.shuffle([...this.words]).slice(0, this.config.pairs);
    this.deck = this.shuffle(
      chosenWords.flatMap((word) => [
        { id: `${word.key}-en`, pair: word.key, lang: 'en', text: word.key, flipped: false, matched: false },
        { id: `${word.key}-he`, pair: word.key, lang: 'he', text: word.value, flipped: false, matched: false },
      ]),
    );
  }

  getCard(cardId) {
    return this.deck.find((card) => card.id === cardId);
  }

  flip(cardId) {
    if (this.lockBoard) return null;

    const card = this.getCard(cardId);
    if (!card || card.flipped || card.matched) return null;

    card.flipped = true;

    if (!this.firstCard) {
      this.firstCard = card;
      return { status: 'first' };
    }

    this.secondCard = card;
    const isPairMatch = this.firstCard.pair === this.secondCard.pair;
    const isLanguageDiff = this.firstCard.lang !== this.secondCard.lang;

    if (isPairMatch && isLanguageDiff) {
      this.firstCard.matched = true;
      this.secondCard.matched = true;
      this.matches += 1;

      const finished = this.matches === this.config.pairs;
      const matchedWord = this.words.find((word) => word.key === this.firstCard.pair);
      const infoText = matchedWord?.info ? ` - ${matchedWord.info}` : '';

      this.firstCard = null;
      this.secondCard = null;

      return {
        status: 'match',
        matchPoints: this.config.matchPoints,
        winBonus: finished ? this.config.winBonus : 0,
        infoText,
        finished,
      };
    }

    this.lockBoard = true;
    return { status: 'mismatch' };
  }

  clearInvalidSelection() {
    if (this.firstCard) this.firstCard.flipped = false;
    if (this.secondCard) this.secondCard.flipped = false;
    this.firstCard = null;
    this.secondCard = null;
    this.lockBoard = false;
  }
}

export const MemoryGame = () => {
  const navigate = useNavigate();
  const { recordActivity } = useAppData();
  const [gameEngine, setGameEngine] = useState(() => new MemoryGameEngine(wordsList, 'easy'));
  const [deck, setDeck] = useState(gameEngine.deck);
  const [currentLevel, setCurrentLevel] = useState('easy');
  const [gameMessage, setGameMessage] = useState(defaultMessage);
  const [messageTone, setMessageTone] = useState('neutral');
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const syncedScoreRef = useRef(0);
  const sessionRecordedRef = useRef(false);

  const boardColumnsClass =
    currentLevel === 'beginner'
      ? 'grid-cols-3 sm:grid-cols-4 xl:grid-cols-6'
      : currentLevel === 'easy'
        ? 'grid-cols-4 xl:grid-cols-6'
        : 'grid-cols-4 lg:grid-cols-6';

  const handleCardClick = (cardId) => {
    const result = gameEngine.flip(cardId);
    if (!result) return;

    if (result.status === 'first') {
      setGameMessage('בחרו עכשיו את הקלף התואם.');
      setMessageTone('neutral');
      setDeck([...gameEngine.deck]);
      return;
    }

    if (result.status === 'match') {
      const newScore = score + result.matchPoints;

      if (result.finished) {
        setScore(newScore + result.winBonus);
        setGameMessage(`מעולה! סיימתם את המשחק וקיבלתם בונוס של ${result.winBonus} נקודות.`);
        setGameFinished(true);
      } else {
        setScore(newScore);
        setGameMessage(`זוג תואם! +${result.matchPoints} נקודות${result.infoText}`);
      }

      setMessageTone('success');
      setDeck([...gameEngine.deck]);
      return;
    }

    if (result.status === 'mismatch') {
      setGameMessage('לא תואם עדיין, נסו שוב.');
      setMessageTone('warning');
      setDeck([...gameEngine.deck]);

      setTimeout(() => {
        gameEngine.clearInvalidSelection();
        setDeck([...gameEngine.deck]);
      }, 900);
    }
  };

  const handleDifficultyChange = (level) => {
    const newEngine = new MemoryGameEngine(wordsList, level);
    setCurrentLevel(level);
    setGameEngine(newEngine);
    setDeck(newEngine.deck);
    setScore(0);
    setGameMessage(defaultMessage);
    setMessageTone('neutral');
    setGameFinished(false);
    syncedScoreRef.current = 0;
    sessionRecordedRef.current = false;
  };

  const handleReset = () => {
    gameEngine.reset();
    setDeck([...gameEngine.deck]);
    setScore(0);
    setGameMessage(defaultMessage);
    setMessageTone('neutral');
    setGameFinished(false);
    syncedScoreRef.current = 0;
    sessionRecordedRef.current = false;
  };

  useEffect(() => {
    if (score <= syncedScoreRef.current) {
      return;
    }

    const delta = score - syncedScoreRef.current;
    recordActivity({
      score: delta,
      game: 'memory',
      memoryBest: score,
      countSession: !sessionRecordedRef.current,
    });

    syncedScoreRef.current = score;
    sessionRecordedRef.current = true;
  }, [recordActivity, score]);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4 flex flex-col gap-4">
      <section className="rounded-[2rem] bg-white/95 border border-white px-4 py-4 md:px-6 md:py-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 shadow-sm self-start">
            <span className="font-bold text-on-surface">רמות קושי:</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 xl:flex-1">
            {levelOptions.map((level) => (
              <button
                key={level.id}
                onClick={() => handleDifficultyChange(level.id)}
                className={`rounded-full px-4 py-2 font-bold transition-all ${
                  currentLevel === level.id
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm self-start xl:self-auto">
            <span className="font-bold text-on-surface">נקודות: {score}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            className={`min-h-[3.5rem] flex-1 rounded-2xl px-4 py-3 text-center text-base font-bold md:text-lg transition-all ${
              messageTone === 'success'
                ? 'bg-green-100 text-green-800 shadow-[0_0_0_1px_rgba(34,197,94,0.2)] animate-pulse'
                : messageTone === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-primary-container/50 text-primary'
            }`}
          >
            {gameMessage}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3 font-bold text-on-primary shadow-[0_4px_0_0_#00497d] transition-all hover:scale-105 active:translate-y-1 active:shadow-none"
            >
              <span className="material-symbols-outlined">refresh</span>
              איפוס משחק
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-3 rounded-xl bg-surface-container-highest px-5 py-3 font-bold text-on-surface shadow-[0_4px_0_0_#c6c6c6] transition-all hover:scale-105 active:translate-y-1 active:shadow-none"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              חזרה לבית
            </button>
          </div>
        </div>

        {gameFinished && (
          <div className="mt-4 rounded-2xl bg-green-100 p-4 text-center text-lg font-bold text-on-surface md:text-xl">
            כל הכבוד! סיימתם את המשחק!
          </div>
        )}
      </section>

      <section className="rounded-[2.25rem] bg-surface-container-high p-4 md:p-5 shadow-inner border-4 border-white/50 overflow-hidden">
        <div className={`grid ${boardColumnsClass} gap-3 md:gap-4`}>
          {deck.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-[1.75rem] border-4 border-white shadow-lg transition-all duration-300 ${
                card.matched
                  ? 'bg-green-500 text-on-surface'
                  : card.flipped
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface hover:scale-[1.02] cursor-pointer'
              }`}
              disabled={card.matched}
            >
              <div className="flex h-full w-full items-center justify-center px-3">
                {card.flipped || card.matched ? (
                  <span className="text-center text-sm font-black leading-tight md:text-lg xl:text-xl break-words">
                    {card.text}
                  </span>
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary-container/90 shadow-inner md:h-16 md:w-16 xl:h-20 xl:w-20">
                    <img
                      src={mpgLogo}
                      alt="MPG logo"
                      className="h-10 w-10 object-contain md:h-12 md:w-12 xl:h-16 xl:w-16"
                    />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};
