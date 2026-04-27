import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameIntroOverlay } from './GameIntroOverlay';
import { useAppData } from '../context/AppDataContext';

const missions = [
  {
    id: 'steps-1',
    title: 'משימה 1: מתארגנים לבית הספר',
    subtitle: 'סדרו את הצעדים כך שהילד יתארגן בבוקר ויצא בזמן לבית הספר.',
    category: 'סדר הצעדים',
    reward: 40,
    hint: 'קודם מתלבשים, אחר כך נועלים נעליים, ורק בסוף יוצאים מהבית.',
    coachLine: 'יופי! בבוקר תמיד מתחילים מלהתארגן ורק אחר כך יוצאים.',
    accent: 'primary',
    steps: [
      { text: 'לובשים בגדים', icon: 'checkroom', tone: 'primary' },
      { text: 'שמים את המחברת בתיק', icon: 'backpack', tone: 'secondary' },
      { text: 'נועלים נעליים', icon: 'steps', tone: 'tertiary' },
      { text: 'יוצאים מהבית', icon: 'door_front', tone: 'primary' },
    ],
  },
  {
    id: 'steps-2',
    title: 'משימה 2: מכינים כריך',
    subtitle: 'סדרו את הצעדים כך שהכריך יהיה מוכן כמו שצריך.',
    category: 'סדר הצעדים',
    reward: 50,
    hint: 'אי אפשר לסגור כריך לפני שמורחים את הממרח.',
    coachLine: 'מצוין! אוכל טעים מתחיל בסדר נכון.',
    accent: 'secondary',
    steps: [
      { text: 'מוציאים שתי פרוסות לחם', icon: 'bakery_dining', tone: 'secondary' },
      { text: 'מורחים ממרח', icon: 'jamboard_kiosk', tone: 'primary' },
      { text: 'סוגרים את הכריך', icon: 'lunch_dining', tone: 'tertiary' },
      { text: 'שמים בצלחת', icon: 'restaurant', tone: 'secondary' },
    ],
  },
  {
    id: 'steps-3',
    title: 'משימה 3: מצחצחים שיניים',
    subtitle: 'סדרו את השלבים כך שהצחצוח יתבצע מסודר ונקי.',
    category: 'סדר הצעדים',
    reward: 60,
    hint: 'קודם שמים משחת שיניים, ורק אז מצחצחים.',
    coachLine: 'מעולה! סדר נכון שומר גם על ניקיון וגם על בריאות.',
    accent: 'tertiary',
    steps: [
      { text: 'לוקחים מברשת שיניים', icon: 'toothbrush', tone: 'primary' },
      { text: 'שמים משחת שיניים', icon: 'soap', tone: 'secondary' },
      { text: 'מצחצחים שיניים', icon: 'dentistry', tone: 'tertiary' },
      { text: 'שוטפים את הפה', icon: 'water_drop', tone: 'primary' },
      { text: 'מחזירים את המברשת למקום', icon: 'inventory_2', tone: 'secondary' },
    ],
  },
  {
    id: 'steps-4',
    title: 'משימה 4: מכינים תיק לחוג',
    subtitle: 'בחרו את הסדר הנכון כדי לצאת לחוג בלי לשכוח ציוד.',
    category: 'סדר הצעדים',
    reward: 70,
    hint: 'קודם פותחים את התיק, ואז מכניסים את הדברים אחד אחרי השני.',
    coachLine: 'נהדר! ככה יוצאים מסודרים ולא שוכחים שום דבר.',
    accent: 'primary',
    steps: [
      { text: 'פותחים את התיק', icon: 'backpack', tone: 'primary' },
      { text: 'מכניסים בקבוק מים', icon: 'water_bottle', tone: 'secondary' },
      { text: 'מכניסים מחברת', icon: 'menu_book', tone: 'tertiary' },
      { text: 'מכניסים קלמר', icon: 'stylus_note', tone: 'primary' },
      { text: 'סוגרים את התיק', icon: 'check_circle', tone: 'secondary' },
    ],
  },
  {
    id: 'steps-5',
    title: 'משימה 5: מתכוננים לשיעור בזום',
    subtitle: 'הכיתה עומדת להתחיל. סדרו את הצעדים כדי להצטרף לשיעור ברוגע.',
    category: 'סדר הצעדים',
    reward: 80,
    hint: 'המחשב נדלק לפני שפותחים את זום.',
    coachLine: 'מעולה! ככה מצטרפים לשיעור בלי לחץ ובלי בלבול.',
    accent: 'secondary',
    steps: [
      { text: 'מדליקים את המחשב', icon: 'computer', tone: 'primary' },
      { text: 'פותחים את זום', icon: 'videocam', tone: 'secondary' },
      { text: 'בוחרים את השיעור הנכון', icon: 'event_available', tone: 'tertiary' },
      { text: 'בודקים שהמיקרופון סגור', icon: 'mic_off', tone: 'primary' },
      { text: 'לוחצים על הצטרפות', icon: 'login', tone: 'secondary' },
    ],
  },
  {
    id: 'steps-6',
    title: 'משימה 6: שולחים הודעה למורה',
    subtitle: 'סדרו את הפעולות כדי לשלוח תמונה של שיעורי הבית.',
    category: 'סדר הצעדים',
    reward: 90,
    hint: 'קודם מצלמים, אחר כך פותחים את ההודעות, ובסוף שולחים.',
    coachLine: 'יופי! שליחה מסודרת חוסכת טעויות.',
    accent: 'tertiary',
    steps: [
      { text: 'מצלמים את שיעורי הבית', icon: 'photo_camera', tone: 'tertiary' },
      { text: 'פותחים את אפליקציית ההודעות', icon: 'chat', tone: 'primary' },
      { text: 'בוחרים את הצ׳אט של המורה', icon: 'forum', tone: 'secondary' },
      { text: 'מצרפים את התמונה', icon: 'attach_file', tone: 'primary' },
      { text: 'לוחצים על שליחה', icon: 'send', tone: 'tertiary' },
    ],
  },
  {
    id: 'steps-7',
    title: 'משימה 7: מחפשים סרטון מצחיק',
    subtitle: 'סדרו את הפעולות כך שהחיפוש יצליח ולא יתבלגן באמצע.',
    category: 'סדר הצעדים',
    reward: 110,
    hint: 'החיפוש עצמו מגיע רק אחרי שפותחים דפדפן ולוחצים על שורת החיפוש.',
    coachLine: 'מעולה! גם חיפוש פשוט עובד הכי טוב כשעושים אותו מסודר.',
    accent: 'primary',
    steps: [
      { text: 'פותחים דפדפן', icon: 'language', tone: 'primary' },
      { text: 'לוחצים על שורת החיפוש', icon: 'search', tone: 'secondary' },
      { text: 'כותבים מה רוצים לראות', icon: 'edit_note', tone: 'tertiary' },
      { text: 'לוחצים Enter', icon: 'keyboard_return', tone: 'primary' },
      { text: 'בוחרים סרטון מתאים', icon: 'smart_display', tone: 'secondary' },
      { text: 'לוחצים על Play', icon: 'play_circle', tone: 'tertiary' },
    ],
  },
  {
    id: 'steps-8',
    title: 'משימה 8: בוקר של תלמיד',
    subtitle: 'משימה ארוכה יותר. סדרו את כל הפעולות של בוקר רגיל לפי הסדר.',
    category: 'סדר הצעדים',
    reward: 130,
    hint: 'חשבו מה עושים מיד כשקמים, ומה קורה רק רגע לפני היציאה.',
    coachLine: 'אלופים! הצלחתם לסדר בוקר שלם כמו מקצוענים.',
    accent: 'secondary',
    steps: [
      { text: 'קמים מהמיטה', icon: 'bed', tone: 'primary' },
      { text: 'מתלבשים', icon: 'checkroom', tone: 'secondary' },
      { text: 'אוכלים ארוחת בוקר', icon: 'breakfast_dining', tone: 'tertiary' },
      { text: 'מצחצחים שיניים', icon: 'dentistry', tone: 'primary' },
      { text: 'לוקחים את התיק', icon: 'backpack', tone: 'secondary' },
      { text: 'נועלים נעליים', icon: 'steps', tone: 'tertiary' },
      { text: 'יוצאים לבית הספר', icon: 'school', tone: 'primary' },
    ],
  },
];

const toneStyles = {
  primary: {
    badge: 'bg-primary-container text-primary',
    iconBox: 'bg-primary-container text-primary',
  },
  secondary: {
    badge: 'bg-secondary-container text-secondary',
    iconBox: 'bg-secondary-container text-secondary',
  },
  tertiary: {
    badge: 'bg-tertiary-container text-tertiary',
    iconBox: 'bg-tertiary-container text-tertiary',
  },
};

const accentButtonStyles = {
  primary: 'bg-primary text-on-primary shadow-[0_6px_0_0_#00497d] hover:shadow-[0_4px_0_0_#00497d]',
  secondary: 'bg-secondary text-on-secondary shadow-[0_6px_0_0_#5b4300] hover:shadow-[0_4px_0_0_#5b4300]',
  tertiary: 'bg-tertiary text-on-tertiary shadow-[0_6px_0_0_#005313] hover:shadow-[0_4px_0_0_#005313]',
};

const confettiColors = ['#0061a4', '#fabd00', '#78dc77', '#9ecaff', '#ffdf9e', '#94f990'];

const shuffleArray = (items) => {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }

  return copy;
};

const tutorialSteps = [
  {
    icon: 'format_list_numbered',
    title: 'קוראים את המשימה',
    description: 'בראש המסך כתוב מה צריך לסדר. תמיד חושבים מה קורה ראשון, מה קורה אחר כך, ומה קורה בסוף.',
  },
  {
    icon: 'drag_indicator',
    title: 'מסדרים את הכרטיסים',
    description: 'אפשר לגרור את הכרטיסים או להשתמש בחצים הקטנים כדי להזיז כל שלב למעלה או למטה.',
  },
  {
    icon: 'task_alt',
    title: 'לוחצים בדיקה',
    description: 'כשכל הסדר נכון מקבלים ניקוד, קונפטי קטן, ועוברים למשימה הבאה.',
  },
];

export const StepOrderGame = () => {
  const navigate = useNavigate();
  const { recordActivity } = useAppData();
  const [missionIndex, setMissionIndex] = useState(0);
  const [orderedSteps, setOrderedSteps] = useState(() => shuffleArray(missions[0].steps));
  const [message, setMessage] = useState('סדרו את הכרטיסים לפי מה שקורה ראשון, שני, שלישי וכן הלאה.');
  const [messageTone, setMessageTone] = useState('neutral');
  const [sessionScore, setSessionScore] = useState(0);
  const [revealedHint, setRevealedHint] = useState(false);
  const [checkedPositions, setCheckedPositions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [confettiBursts, setConfettiBursts] = useState([]);
  const dragIndexRef = useRef(null);
  const sessionRecordedRef = useRef(false);
  const confettiIdRef = useRef(0);

  const mission = missions[missionIndex];
  const progress = Math.round(((missionIndex + 1) / missions.length) * 100);
  const correctCount = checkedPositions.filter(Boolean).length;
  const scorePercent = Math.min(100, Math.round((sessionScore / 700) * 100));

  const loadMission = (nextMissionIndex) => {
    const nextMission = missions[nextMissionIndex];
    setMissionIndex(nextMissionIndex);
    setOrderedSteps(shuffleArray(nextMission.steps));
    setMessage(`המשימה: ${nextMission.title}. חשבו מה קורה קודם ומה קורה אחר כך.`);
    setMessageTone('neutral');
    setRevealedHint(false);
    setCheckedPositions([]);
  };

  const moveStep = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex === null || toIndex === null) {
      return;
    }

    setOrderedSteps((current) => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDragStart = (index) => {
    dragIndexRef.current = index;
  };

  const handleDrop = (index) => {
    moveStep(dragIndexRef.current, index);
    dragIndexRef.current = null;
  };

  const handleMove = (index, direction) => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= orderedSteps.length) {
      return;
    }

    moveStep(index, nextIndex);
  };

  const handleShuffle = () => {
    setOrderedSteps(shuffleArray(mission.steps));
    setCheckedPositions([]);
    setMessage('הכרטיסים התערבבו מחדש. עכשיו אפשר לנסות לסדר אותם שוב בשקט ובסבלנות.');
    setMessageTone('neutral');
  };

  const handleHint = () => {
    setRevealedHint(true);
    setMessage(`רמז: ${mission.hint}`);
    setMessageTone('neutral');
  };

  const launchConfetti = () => {
    const burstId = confettiIdRef.current + 1;
    confettiIdRef.current = burstId;

    const pieces = Array.from({ length: 26 }, (_, index) => ({
      id: `${burstId}-${index}`,
      left: 8 + Math.random() * 84,
      delay: Math.random() * 0.18,
      duration: 1 + Math.random() * 0.65,
      drift: -95 + Math.random() * 190,
      rotate: -180 + Math.random() * 360,
      color: confettiColors[index % confettiColors.length],
      size: 9 + Math.random() * 10,
    }));

    setConfettiBursts((current) => [...current, { id: burstId, pieces }]);

    window.setTimeout(() => {
      setConfettiBursts((current) => current.filter((burst) => burst.id !== burstId));
    }, 1900);
  };

  const handleSuccess = () => {
    if (!completedMissions.includes(mission.id)) {
      setCompletedMissions((current) => [...current, mission.id]);
      setSessionScore((current) => current + mission.reward);
      launchConfetti();
      recordActivity({
        score: mission.reward,
        game: 'step-order',
        countSession: !sessionRecordedRef.current,
      });
      sessionRecordedRef.current = true;
    }

    setCheckedPositions(mission.steps.map(() => true));
    setMessage(`מעולה. סידרתם את המשימה נכון וקיבלתם ${mission.reward} נקודות.`);
    setMessageTone('success');

    window.setTimeout(() => {
      if (missionIndex < missions.length - 1) {
        loadMission(missionIndex + 1);
      } else {
        setMessage('אלופים. סיימתם את כל משימות סדר הצעדים.');
        setMessageTone('success');
      }
    }, 1000);
  };

  const handleCheck = () => {
    const nextChecked = orderedSteps.map((step, index) => step.text === mission.steps[index].text);
    setCheckedPositions(nextChecked);

    if (nextChecked.every(Boolean)) {
      handleSuccess();
      return;
    }

    setMessage(`יש ${nextChecked.filter(Boolean).length} צעדים במקום הנכון. נסו להזיז רק את הכרטיסים שעדיין לא יושבים טוב.`);
    setMessageTone('warning');
  };

  const feedbackCardTone =
    messageTone === 'success'
      ? 'bg-green-100 text-green-800'
      : messageTone === 'warning'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-surface-container-highest text-on-surface';

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-4 flex flex-col gap-5 relative overflow-hidden">
      {showTutorial && (
        <GameIntroOverlay
          title="סדר צעדים"
          subtitle="לפני שמתחילים, הנה הסבר קצר שיעזור להבין בדיוק איך משחקים."
          steps={tutorialSteps}
          accent="primary"
          onClose={() => setShowTutorial(false)}
        />
      )}
      <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
        {confettiBursts.map((burst) =>
          burst.pieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute top-16 rounded-sm shadow-[0_2px_8px_rgba(15,23,42,0.18)]"
              style={{
                left: `${piece.left}%`,
                width: `${piece.size}px`,
                height: `${Math.max(6, piece.size * 0.65)}px`,
                backgroundColor: piece.color,
                animation: `step-order-confetti ${piece.duration}s ease-out forwards`,
                animationDelay: `${piece.delay}s`,
                ['--confetti-drift']: `${piece.drift}px`,
                ['--confetti-drop']: `${140 + Math.random() * 70}px`,
                ['--confetti-rotate']: `${piece.rotate}deg`,
              }}
            />
          )),
        )}
      </div>
      <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,223,158,0.28),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(244,249,255,0.96))] border border-white px-5 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-3 rounded-full px-5 py-2 font-bold ${toneStyles[mission.accent].badge}`}>
              <span className="material-symbols-outlined">format_list_numbered</span>
              {mission.category}
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg ${toneStyles[mission.accent].iconBox}`}>
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  checklist
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-on-surface">{mission.title}</h1>
                <p className="text-on-surface-variant font-medium max-w-3xl mt-2">{mission.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] bg-surface-container-lowest px-5 py-4 text-center shadow-[0_6px_0_0_rgba(0,97,164,0.08)]">
              <div className="text-sm font-bold text-on-surface-variant">שלב</div>
              <div className="text-3xl font-black text-primary mt-1">{missionIndex + 1}/{missions.length}</div>
            </div>
            <div className="rounded-[1.5rem] bg-surface-container-lowest px-5 py-4 text-center shadow-[0_6px_0_0_rgba(0,110,28,0.08)]">
              <div className="text-sm font-bold text-on-surface-variant">ניקוד סשן</div>
              <div className="text-3xl font-black text-tertiary mt-1">{sessionScore}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-5">
        <div className="rounded-[2rem] bg-surface-container-low p-5 md:p-6 shadow-[0_10px_30px_rgba(0,97,164,0.08)] border border-primary/10 space-y-4">
          <div className="flex justify-between items-end gap-3 mb-2">
            <div>
              <div className="text-xs font-bold text-outline uppercase tracking-[0.2em]">רשימת הפעולות</div>
              <div className="text-sm text-on-surface-variant font-medium mt-1">גררו את הכרטיסים או השתמשו בחצים כדי לסדר מה קורה ראשון ועד אחרון.</div>
            </div>
            <span className="material-symbols-outlined text-outline text-3xl">drag_indicator</span>
          </div>

          <div className="space-y-4">
            {orderedSteps.map((step, index) => {
              const isChecked = checkedPositions[index] !== undefined;
              const isCorrect = checkedPositions[index];
              const rotationClass = index % 2 === 0 ? '-rotate-1 hover:rotate-0' : 'rotate-1 hover:rotate-0';

              return (
                <div
                  key={`${mission.id}-${step.text}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className={`group bg-surface-container-lowest p-5 md:p-6 rounded-[1.75rem] shadow-sm border-2 transition-all cursor-grab active:cursor-grabbing flex items-center gap-4 md:gap-6 ${rotationClass} ${
                    isChecked
                      ? isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-amber-200 bg-amber-50'
                      : 'border-transparent hover:border-primary-container'
                  }`}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 ${toneStyles[step.tone].iconBox}`}>
                    <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xl md:text-2xl font-bold text-on-surface">{step.text}</div>
                    <div className="text-sm text-on-surface-variant font-medium mt-1">שלב {index + 1}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface disabled:opacity-40 active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-base">keyboard_arrow_up</span>
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === orderedSteps.length - 1}
                      className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface disabled:opacity-40 active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-base">keyboard_arrow_down</span>
                    </button>
                    <div className="hidden md:block mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-outline">drag_handle</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="relative bg-surface-container-highest rounded-[2rem] p-6 pt-20 mt-16 shadow-sm">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-primary-container shadow-[0_10px_30px_rgba(0,97,164,0.16)] border-4 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
            </div>
            <div className="text-center space-y-3">
              <p className="text-lg font-bold text-on-surface leading-snug">"{revealedHint ? mission.hint : mission.coachLine}"</p>
            </div>
          </div>

          <div className={`rounded-[1.5rem] px-4 py-4 text-center font-bold text-base md:text-lg transition-all ${feedbackCardTone}`}>
            {message}
          </div>

          <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm space-y-6 border border-surface-variant">
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">ניקוד</span>
                <span className="text-3xl font-black text-secondary font-headline">{sessionScore}</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">שלב</span>
                <span className="text-xl font-bold text-on-surface">{missionIndex + 1} מתוך {missions.length}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>התקדמות במשימות</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-8 bg-primary-container rounded-full overflow-hidden relative">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 text-xl" style={{ right: `calc(${100 - progress}% - 12px)` }}>
                  🤖
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>כרטיסים במקום הנכון</span>
                <span>{correctCount} / {mission.steps.length}</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${(correctCount / mission.steps.length) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>ניקוד כללי במשחק</span>
                <span>{scorePercent}%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary rounded-full transition-all duration-500" style={{ width: `${scorePercent}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm space-y-4 border border-surface-variant">
            <div className="text-lg font-black text-on-surface">מה צריך לעשות?</div>
            <div className="rounded-[1.25rem] bg-surface-container-low p-4">
              <div className="text-sm font-bold text-outline mb-2">מטרת המשימה</div>
              <div className="text-on-surface font-medium leading-relaxed">{mission.subtitle}</div>
            </div>
            <div className="rounded-[1.25rem] bg-surface-container-low p-4">
              <div className="text-sm font-bold text-outline mb-2">ההוראה</div>
              <div className="text-on-surface font-medium leading-relaxed">
                הכרטיס העליון הוא מה שקורה ראשון. הכרטיס האחרון למטה הוא מה שקורה בסוף.
              </div>
            </div>
            {revealedHint && (
              <div className="rounded-[1.25rem] bg-secondary-container p-4 text-on-secondary-container font-bold">
                רמז: {mission.hint}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheck}
              className={`w-full py-5 rounded-xl text-xl font-black font-headline active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3 ${accentButtonStyles[mission.accent]}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              בדיקה
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleShuffle}
                className="bg-surface-container-highest text-on-surface-variant py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors border-2 border-transparent active:scale-95"
              >
                <span className="material-symbols-outlined">shuffle</span>
                ערבוב מחדש
              </button>
              <button
                onClick={handleHint}
                className="bg-secondary-container text-on-secondary-container py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_4px_0_0_#5b4300] active:shadow-none active:translate-y-1 transition-all"
              >
                <span className="material-symbols-outlined">lightbulb</span>
                רמז
              </button>
            </div>

            <button
              onClick={() => navigate('/')}
              className="bg-white text-on-surface py-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-surface-variant active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              חזרה לתפריט
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
