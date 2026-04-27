import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameIntroOverlay } from './GameIntroOverlay';
import { RewardConfetti } from './RewardConfetti';
import { useAppData } from '../context/AppDataContext';
import { buildConfettiBurst } from '../utils/confetti';

const directions = ['N', 'E', 'S', 'W'];

const levels = [
  {
    id: 'maze-1',
    title: 'שלב 1: להגיע אל הדגל',
    subtitle: 'בוחרים כמה פקודות פשוטות כדי לעזור לרובוט להגיע אל היעד בלי להיתקע בדרך.',
    hint: 'הרובוט מתחיל כשהוא מסתכל ימינה. קודם חושבים על הכיוון, ואז סופרים כמה צעדים קדימה צריך.',
    gridSize: 5,
    start: { row: 4, col: 0, dir: 'E' },
    goal: { row: 1, col: 4 },
    walls: [
      [3, 1],
      [3, 2],
      [2, 2],
      [1, 2],
    ],
    maxCommands: 8,
    reward: 45,
  },
  {
    id: 'maze-2',
    title: 'שלב 2: סיבוב חכם',
    subtitle: 'עכשיו צריך גם לפנות בזמן הנכון וגם לבחור מסלול שלא יפגיש את הרובוט עם קיר.',
    hint: 'כשיש קיר מול הרובוט, לפעמים הפתרון הוא קודם להסתובב במקום ורק אחר כך להתקדם.',
    gridSize: 6,
    start: { row: 5, col: 1, dir: 'N' },
    goal: { row: 0, col: 4 },
    walls: [
      [4, 1],
      [3, 1],
      [2, 1],
      [2, 2],
      [2, 3],
      [4, 3],
      [4, 4],
    ],
    maxCommands: 12,
    reward: 65,
  },
  {
    id: 'maze-3',
    title: 'שלב 3: חושבים כמה צעדים קדימה',
    subtitle: 'בשלב הזה כבר כדאי לתכנן מסלול שלם לפני שמריצים את הרובוט.',
    hint: 'נסו לדמיין את הרובוט מתקדם על הלוח, צעד אחרי צעד, ורק אז לבנות את התור.',
    gridSize: 7,
    start: { row: 6, col: 0, dir: 'E' },
    goal: { row: 0, col: 6 },
    walls: [
      [5, 0],
      [5, 1],
      [5, 2],
      [3, 2],
      [2, 2],
      [1, 2],
      [1, 3],
      [1, 4],
      [3, 4],
      [4, 4],
      [5, 4],
      [3, 5],
    ],
    maxCommands: 14,
    reward: 85,
  },
  {
    id: 'maze-4',
    title: 'שלב 4: המסדרון הארוך',
    subtitle: 'כאן מחכה מסלול ארוך יותר, אז חשוב לספור צעדים ולא להתבלבל בדרך.',
    hint: 'לפעמים הדרך הכי טובה היא להתקדם כמעט עד הסוף ורק אז לבצע את הסיבוב.',
    gridSize: 6,
    start: { row: 5, col: 0, dir: 'E' },
    goal: { row: 0, col: 5 },
    walls: [
      [4, 2],
      [3, 2],
      [2, 2],
      [1, 2],
      [1, 3],
      [1, 4],
      [3, 4],
      [4, 4],
    ],
    maxCommands: 12,
    reward: 95,
  },
  {
    id: 'maze-5',
    title: 'שלב 5: מתחילים מהצד השני',
    subtitle: 'הפעם הרובוט יוצא מהפינה הימנית, ולכן צריך לחשוב גם על כיוון ההתחלה.',
    hint: 'לפני שמתקדמים, שימו לב לאן הרובוט כבר מסתכל. אולי בכלל לא צריך להסתובב בהתחלה.',
    gridSize: 7,
    start: { row: 6, col: 6, dir: 'W' },
    goal: { row: 0, col: 1 },
    walls: [
      [5, 5],
      [4, 5],
      [3, 5],
      [3, 4],
      [3, 3],
      [1, 1],
      [1, 2],
      [1, 3],
      [5, 2],
      [4, 2],
    ],
    maxCommands: 13,
    reward: 110,
  },
  {
    id: 'maze-6',
    title: 'שלב 6: ירידה ארוכה ואז פנייה',
    subtitle: 'הרובוט מתחיל מלמעלה, ולכן צריך קודם לרדת עמוק לתוך המבוך לפני שמחליפים כיוון.',
    hint: 'אם תמהרו לפנות מוקדם מדי, תיתקעו. נסו להגיע כמעט עד תחתית המסלול.',
    gridSize: 7,
    start: { row: 0, col: 0, dir: 'S' },
    goal: { row: 6, col: 5 },
    walls: [
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [4, 2],
      [4, 3],
      [2, 3],
      [2, 4],
      [2, 5],
      [5, 4],
    ],
    maxCommands: 13,
    reward: 125,
  },
  {
    id: 'maze-7',
    title: 'שלב 7: המבוך הרחב',
    subtitle: 'הלוח גדל, והמסלול דורש דיוק וסבלנות כדי לא לבזבז פקודות מיותרות.',
    hint: 'חפשו נתיב נקי וארוך, גם אם הוא נראה בהתחלה מסביב למבוך.',
    gridSize: 8,
    start: { row: 7, col: 0, dir: 'E' },
    goal: { row: 0, col: 7 },
    walls: [
      [6, 1],
      [5, 1],
      [4, 1],
      [3, 1],
      [3, 2],
      [3, 3],
      [5, 3],
      [6, 3],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 5],
      [5, 5],
      [6, 5],
    ],
    maxCommands: 16,
    reward: 145,
  },
  {
    id: 'maze-8',
    title: 'שלב 8: הדרך חזרה לפינה',
    subtitle: 'עכשיו יוצאים מהפינה הימנית העליונה יחסית וצריכים להגיע עד הפינה השמאלית הרחוקה.',
    hint: 'אם אתם רואים דרך ארוכה וישרה, כנראה שזה סימן טוב. אחר כך מגיע הסיבוב החשוב.',
    gridSize: 8,
    start: { row: 7, col: 7, dir: 'N' },
    goal: { row: 0, col: 0 },
    walls: [
      [6, 6],
      [5, 6],
      [4, 6],
      [4, 5],
      [4, 4],
      [2, 5],
      [2, 4],
      [2, 3],
      [5, 2],
      [4, 2],
      [3, 2],
      [2, 1],
    ],
    maxCommands: 16,
    reward: 160,
  },
  {
    id: 'maze-9',
    title: 'שלב 9: סיבוב כבר מההתחלה',
    subtitle: 'בשלב הזה הפתרון מתחיל בהחלטה נכונה כבר בצעד הראשון.',
    hint: 'לפעמים הפעולה הראשונה היא לא קדימה. בדקו אם כדאי קודם לשנות כיוון.',
    gridSize: 8,
    start: { row: 4, col: 0, dir: 'E' },
    goal: { row: 0, col: 7 },
    walls: [
      [3, 1],
      [2, 1],
      [1, 1],
      [1, 2],
      [1, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [5, 4],
      [5, 5],
      [3, 5],
      [2, 5],
      [1, 5],
      [6, 6],
    ],
    maxCommands: 17,
    reward: 180,
  },
  {
    id: 'maze-10',
    title: 'שלב 10: האתגר הגדול',
    subtitle: 'זהו הלוח הגדול ביותר עד עכשיו, ודורש מסלול מדויק וארוך כמעט בלי טעויות.',
    hint: 'נסו לחלק את המסלול בראש לשניים: קודם קו ארוך, אחר כך סיבוב אחד והרבה ריכוז.',
    gridSize: 9,
    start: { row: 8, col: 0, dir: 'E' },
    goal: { row: 0, col: 8 },
    walls: [
      [7, 1],
      [6, 1],
      [5, 1],
      [4, 1],
      [3, 1],
      [3, 2],
      [3, 3],
      [5, 3],
      [6, 3],
      [7, 3],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 5],
      [5, 5],
      [6, 5],
      [2, 6],
      [2, 7],
      [7, 7],
      [6, 7],
      [5, 7],
    ],
    maxCommands: 19,
    reward: 220,
  },
];

const commandOptions = [
  {
    id: 'forward',
    label: 'זוז קדימה',
    shortLabel: 'קדימה',
    icon: 'north',
    color: 'primary',
    description: 'הרובוט זז משבצת אחת לכיוון שאליו הוא מסתכל.',
  },
  {
    id: 'left',
    label: 'סובב שמאלה',
    shortLabel: 'שמאלה',
    icon: 'rotate_90_degrees_ccw',
    color: 'secondary',
    description: 'הרובוט מסתובב שמאלה במקום, בלי לעבור משבצת.',
  },
  {
    id: 'right',
    label: 'סובב ימינה',
    shortLabel: 'ימינה',
    icon: 'rotate_90_degrees_cw',
    color: 'tertiary',
    description: 'הרובוט מסתובב ימינה במקום, בלי לעבור משבצת.',
  },
];

const directionLabels = {
  N: 'למעלה',
  E: 'ימינה',
  S: 'למטה',
  W: 'שמאלה',
};

const getRotation = (dir) => {
  switch (dir) {
    case 'N':
      return 'rotate-0';
    case 'E':
      return 'rotate-90';
    case 'S':
      return 'rotate-180';
    default:
      return '-rotate-90';
  }
};

const getArrowRotation = (dir) => {
  switch (dir) {
    case 'N':
      return '-rotate-90';
    case 'E':
      return 'rotate-0';
    case 'S':
      return 'rotate-90';
    default:
      return 'rotate-180';
  }
};

const moveForward = ({ row, col, dir }) => {
  if (dir === 'N') return { row: row - 1, col };
  if (dir === 'E') return { row, col: col + 1 };
  if (dir === 'S') return { row: row + 1, col };
  return { row, col: col - 1 };
};

const rotateDirection = (dir, turn) => {
  const index = directions.indexOf(dir);
  const delta = turn === 'left' ? -1 : 1;
  return directions[(index + delta + directions.length) % directions.length];
};

const isWall = (level, row, col) =>
  level.walls.some(([wallRow, wallCol]) => wallRow === row && wallCol === col);

const isInsideBoard = (level, row, col) => row >= 0 && col >= 0 && row < level.gridSize && col < level.gridSize;

const tutorialSteps = [
  {
    icon: 'smart_toy',
    title: 'היעד הוא להגיע לדגל',
    description: 'בכל שלב יש רובוט, קירות ודגל. המטרה היא לבנות לו מסלול שיביא אותו אל היעד בלי להיתקע.',
  },
  {
    icon: 'format_list_numbered',
    title: 'בונים תור פקודות',
    description: 'בוחרים פקודות כמו קדימה, שמאלה וימינה. כל פקודה נכנסת לתור לפי הסדר שבחרתם.',
  },
  {
    icon: 'play_arrow',
    title: 'מריצים ובודקים',
    description: 'לוחצים הרץ מסלול ורואים מה קורה. כשהרובוט מגיע לדגל מקבלים נקודות וקונפטי קטן.',
  },
];

const RobotToken = ({ dir, compact = false }) => (
  <div className={`relative ${compact ? 'w-12 h-12' : 'w-16 h-16'} ${getRotation(dir)}`}>
    <div className="absolute inset-0 rounded-[1.4rem] bg-gradient-to-br from-sky-400 via-primary to-blue-700 shadow-[0_10px_24px_rgba(0,97,164,0.35)] border-2 border-white/70" />
    <div className="absolute left-1/2 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-300 border border-white/70" />
    <div className="absolute left-1/2 top-[0.55rem] -translate-x-1/2 w-0.5 h-4 bg-white/90 rounded-full" />
    <div className="absolute inset-x-2 top-3 h-6 rounded-2xl bg-slate-900/90 border border-white/30 flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(125,211,252,0.9)]" />
      <span className="w-2 h-2 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(125,211,252,0.9)]" />
    </div>
    <div className="absolute inset-x-3 bottom-2 h-3 rounded-full bg-white/85" />
    <div className="absolute left-1/2 -top-2 -translate-x-1/2 text-white drop-shadow-md">
      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
        navigation
      </span>
    </div>
  </div>
);

export const RobotMazeGame = () => {
  const navigate = useNavigate();
  const { recordActivity } = useAppData();
  const [levelIndex, setLevelIndex] = useState(0);
  const [robot, setRobot] = useState(levels[0].start);
  const [commands, setCommands] = useState([]);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('בוחרים פקודות שיעזרו לרובוט להגיע אל הדגל. כל פקודה נכנסת לתור לפי הסדר.');
  const [messageTone, setMessageTone] = useState('neutral');
  const [sessionScore, setSessionScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [confettiBursts, setConfettiBursts] = useState([]);
  const sessionRecordedRef = useRef(false);
  const confettiIdRef = useRef(0);

  const level = levels[levelIndex];
  const showFirstLevelForwardHint =
    levelIndex === 0 &&
    !running &&
    robot.row === level.start.row &&
    robot.col === level.start.col &&
    robot.dir === level.start.dir &&
    commands.length === 0;

  const cells = useMemo(() => Array.from({ length: level.gridSize * level.gridSize }, (_, index) => index), [level.gridSize]);

  const resetLevelState = (nextLevelIndex = levelIndex) => {
    const nextLevel = levels[nextLevelIndex];
    setRobot(nextLevel.start);
    setCommands([]);
    setRunning(false);
  };

  const launchConfetti = () => {
    const burstId = confettiIdRef.current + 1;
    confettiIdRef.current = burstId;
    setConfettiBursts((current) => [...current, buildConfettiBurst(burstId)]);
    window.setTimeout(() => {
      setConfettiBursts((current) => current.filter((burst) => burst.id !== burstId));
    }, 1900);
  };

  const handleAddCommand = (command) => {
    if (running || commands.length >= level.maxCommands) {
      return;
    }

    const selectedCommand = commandOptions.find((option) => option.id === command);
    setCommands((current) => [...current, command]);
    setMessage(`הוספנו "${selectedCommand?.label}". ממשיכים לבנות את המסלול של הרובוט.`);
    setMessageTone('neutral');
  };

  const handleRemoveLast = () => {
    if (running) {
      return;
    }

    setCommands((current) => current.slice(0, -1));
    setMessage('הסרנו את הפקודה האחרונה. אפשר לבחור צעד אחר במקומה.');
    setMessageTone('neutral');
  };

  const handleClearAll = () => {
    if (running) {
      return;
    }

    setCommands([]);
    setMessage('ניקינו את כל התור. עכשיו אפשר לתכנן מסלול חדש מההתחלה.');
    setMessageTone('neutral');
  };

  const handleResetLevel = () => {
    resetLevelState();
    setMessage('חזרנו לנקודת ההתחלה של השלב. בואו ננסה מסלול חדש.');
    setMessageTone('neutral');
  };

  const awardLevel = () => {
    if (completedLevels.includes(level.id)) {
      return;
    }

    setCompletedLevels((current) => [...current, level.id]);
    setSessionScore((current) => current + level.reward);
    recordActivity({
      score: level.reward,
      game: 'robot-maze',
      countSession: !sessionRecordedRef.current,
    });
    sessionRecordedRef.current = true;
  };

  const handleSuccess = () => {
    awardLevel();
    launchConfetti();
    setRunning(false);
    setMessage(`מעולה. הרובוט הגיע אל הדגל וזכיתם ב-${level.reward} נקודות.`);
    setMessageTone('success');

    window.setTimeout(() => {
      if (levelIndex < levels.length - 1) {
        const nextIndex = levelIndex + 1;
        setLevelIndex(nextIndex);
        setRobot(levels[nextIndex].start);
        setCommands([]);
        setMessage(`פותחים את ${levels[nextIndex].title}. ${levels[nextIndex].subtitle}`);
        setMessageTone('neutral');
      } else {
        resetLevelState(levelIndex);
        setMessage('אלופים. סיימתם את כל שלבי המבוך ואפשר לחזור כדי לשפר מסלולים.');
        setMessageTone('success');
      }
    }, 1100);
  };

  const handleFailure = (reason) => {
    setRunning(false);
    setCommands([]);
    setRobot(level.start);
    setMessage(reason);
    setMessageTone('warning');
  };

  const runCommands = async () => {
    if (running || commands.length === 0) {
      setMessage('לפני שמריצים, צריך לבחור לפחות פקודה אחת לתור.');
      setMessageTone('warning');
      return;
    }

    setRunning(true);
    setMessage('מריצים את המסלול. עקבו אחרי הרובוט ובדקו אם התכנון נכון.');
    setMessageTone('neutral');

    let nextRobot = { ...robot };

    for (const command of commands) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 460);
      });

      if (command === 'left' || command === 'right') {
        nextRobot = { ...nextRobot, dir: rotateDirection(nextRobot.dir, command) };
        setRobot(nextRobot);
        continue;
      }

      const nextPosition = moveForward(nextRobot);

      if (!isInsideBoard(level, nextPosition.row, nextPosition.col)) {
        handleFailure('אופס, הרובוט יצא מהלוח. מתחילים את השלב מחדש ומנסים מסלול מדויק יותר.');
        return;
      }

      if (isWall(level, nextPosition.row, nextPosition.col)) {
        handleFailure('הרובוט פגש קיר. נסו להוסיף סיבוב לפני שממשיכים קדימה.');
        return;
      }

      nextRobot = { ...nextRobot, row: nextPosition.row, col: nextPosition.col };
      setRobot(nextRobot);

      if (nextRobot.row === level.goal.row && nextRobot.col === level.goal.col) {
        handleSuccess();
        return;
      }
    }

    setRunning(false);
    setMessage('המסלול הסתיים, אבל הרובוט עוד לא הגיע אל הדגל. בואו נשפר את התכנון.');
    setMessageTone('warning');
  };

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-4 flex flex-col gap-5 relative">
      {showTutorial && (
        <GameIntroOverlay
          title="מבוך רובוט"
          subtitle="לפני שמתחילים, הנה שלושה צעדים קטנים שיעזרו להבין איך מנצחים במבוך."
          steps={tutorialSteps}
          accent="tertiary"
          onClose={() => setShowTutorial(false)}
        />
      )}
      <RewardConfetti bursts={confettiBursts} />
      <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(158,202,255,0.4),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(240,247,255,0.96))] border border-white px-5 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 rounded-full bg-primary-container px-5 py-2 text-primary font-bold">
              <span className="material-symbols-outlined">smart_toy</span>
              מבוך רובוט
            </div>
            <div className="flex items-center gap-4">
              <RobotToken dir={robot.dir} />
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-on-surface">{level.title}</h1>
                <p className="text-on-surface-variant font-medium max-w-3xl mt-2">{level.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] bg-surface-container-lowest px-5 py-4 text-center shadow-[0_6px_0_0_rgba(0,97,164,0.08)]">
              <div className="text-sm font-bold text-on-surface-variant">שלב</div>
              <div className="text-3xl font-black text-primary mt-1">{levelIndex + 1}/{levels.length}</div>
            </div>
            <div className="rounded-[1.5rem] bg-surface-container-lowest px-5 py-4 text-center shadow-[0_6px_0_0_rgba(0,110,28,0.08)]">
              <div className="text-sm font-bold text-on-surface-variant">ניקוד סשן</div>
              <div className="text-3xl font-black text-tertiary mt-1">{sessionScore}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.08fr_0.92fr] gap-5">
        <div className="rounded-[2rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(236,245,255,0.95))] p-5 md:p-6 shadow-[0_10px_30px_rgba(0,97,164,0.08)] border border-primary/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-black text-on-surface">לוח המשימה</h2>
              <p className="text-on-surface-variant font-medium">בונים תור פקודות ולוחצים הרצה כדי לראות אם הרובוט מגיע אל הדגל.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-full bg-secondary-container px-4 py-2 text-secondary font-bold">
                עד {level.maxCommands} פקודות
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-on-surface font-bold border border-primary/10">
                הרובוט מסתכל: {directionLabels[robot.dir]}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(180deg,_rgba(219,234,254,0.55),_rgba(255,255,255,0.95))] p-4 md:p-5 border border-white shadow-inner">
            <div
              className="grid gap-2 mx-auto w-full max-w-[38rem]"
              dir="ltr"
              style={{ gridTemplateColumns: `repeat(${level.gridSize}, minmax(0, 1fr))` }}
            >
              {cells.map((cellIndex) => {
                const row = Math.floor(cellIndex / level.gridSize);
                const col = cellIndex % level.gridSize;
                const isRobot = robot.row === row && robot.col === col;
                const isGoal = level.goal.row === row && level.goal.col === col;
                const wall = isWall(level, row, col);
                return (
                  <div
                    key={`${row}-${col}`}
                    className={`aspect-square rounded-[1.35rem] flex items-center justify-center border-2 relative overflow-hidden ${
                      wall
                        ? 'bg-[linear-gradient(145deg,_#334155,_#0f172a)] border-slate-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.1)]'
                        : isGoal
                          ? 'bg-[radial-gradient(circle_at_top,_rgba(255,248,190,1),_rgba(250,189,0,0.9))] border-secondary/20 shadow-[0_10px_22px_rgba(250,189,0,0.22)]'
                          : 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(232,242,255,0.9))] border-slate-200'
                    }`}
                  >
                    {!wall && !isGoal && <div className="absolute inset-2 rounded-[1rem] border border-sky-100/70" />}
                    {wall && (
                      <div className="grid grid-cols-2 gap-1 w-full px-2">
                        {Array.from({ length: 4 }, (_, brickIndex) => (
                          <div key={brickIndex} className="h-3 rounded-full bg-white/10" />
                        ))}
                      </div>
                    )}
                    {isGoal && !isRobot && (
                      <div className="relative flex flex-col items-center gap-1">
                        <span className="text-3xl">🏁</span>
                        <span className="text-[0.65rem] font-black text-secondary">יעד</span>
                      </div>
                    )}
                    {isRobot && (
                      <div className="relative z-20 overflow-visible">
                        <RobotToken dir={robot.dir} compact />
                        {showFirstLevelForwardHint && (
                          <div className="absolute left-1/2 bottom-0 translate-y-4 -translate-x-1/2 z-30 pointer-events-none">
                            <div className="flex items-center gap-1 rounded-full bg-white/98 px-2 py-1 text-[0.52rem] leading-none font-black text-primary shadow-[0_6px_14px_rgba(0,97,164,0.16)] border border-primary/10 whitespace-nowrap">
                              קדימה זה לכאן
                              <span className={`material-symbols-outlined text-sm ${getArrowRotation(robot.dir)} animate-pulse`}>
                                arrow_right_alt
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-5 md:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-white space-y-5">
          <div
            className={`rounded-[1.5rem] px-4 py-4 text-center font-bold text-base md:text-lg transition-all ${
              messageTone === 'success'
                ? 'bg-green-100 text-green-800'
                : messageTone === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-primary-container/60 text-primary'
            }`}
          >
            {message}
          </div>

          <div className="rounded-[1.5rem] bg-surface-container-low p-4">
            <h3 className="text-xl font-black text-on-surface mb-2">רמז לשלב</h3>
            <p className="text-on-surface-variant font-medium">{level.hint}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-on-surface">הפקודות של הרובוט</h3>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-on-surface-variant">
                בחרו לפי הסדר
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {commandOptions.map((command) => (
                <button
                  key={command.id}
                  onClick={() => handleAddCommand(command.id)}
                  disabled={running || commands.length >= level.maxCommands}
                  className={`rounded-[1.5rem] px-4 py-4 text-right shadow-[0_6px_0_0_rgba(15,23,42,0.12)] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    command.color === 'primary'
                      ? 'bg-primary text-on-primary'
                      : command.color === 'secondary'
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-tertiary text-on-tertiary'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-lg font-black">{command.label}</div>
                      <div className="text-sm font-medium opacity-90">
                        {command.id === 'forward'
                          ? `${command.description} כרגע זה לכיוון ${directionLabels[robot.dir]}.`
                          : command.description}
                      </div>
                    </div>
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/20">
                      <span className="material-symbols-outlined text-3xl">{command.icon}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-sky-50 border border-sky-100 p-4">
            <h3 className="text-lg font-black text-on-surface mb-3">איך קוראים את התור?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-bold">
              <div className="rounded-[1rem] bg-white p-3 text-on-surface shadow-sm">
                1. בוחרים פקודה
              </div>
              <div className="rounded-[1rem] bg-white p-3 text-on-surface shadow-sm">
                2. ממשיכים עד שיש מסלול
              </div>
              <div className="rounded-[1rem] bg-white p-3 text-on-surface shadow-sm">
                3. מריצים ובודקים אם הרובוט הגיע
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-on-surface">תור הפקודות</h3>
              <span className="text-sm font-bold text-on-surface-variant">
                {commands.length} / {level.maxCommands}
              </span>
            </div>

            <div className="rounded-[1.5rem] bg-surface-container p-4 min-h-[7rem]">
              {commands.length === 0 ? (
                <div className="text-on-surface-variant font-medium">עדיין לא בחרתם פקודות. התחילו עם צעד קטן אחד.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {commands.map((command, index) => {
                    const data = commandOptions.find((option) => option.id === command);
                    return (
                      <div
                        key={`${command}-${index}`}
                        className="rounded-full bg-white px-4 py-2 shadow-sm text-on-surface font-bold flex items-center gap-2 border border-slate-100"
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-container text-primary text-sm">
                          {index + 1}
                        </span>
                        <span className="material-symbols-outlined text-primary text-base">{data?.icon}</span>
                        {data?.shortLabel}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={runCommands}
              disabled={running}
              className="bg-primary text-on-primary px-6 py-4 rounded-xl font-bold shadow-[0_4px_0_0_#00497d] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              הרץ מסלול
            </button>
            <button
              onClick={handleRemoveLast}
              disabled={running || commands.length === 0}
              className="bg-secondary text-on-secondary px-6 py-4 rounded-xl font-bold shadow-[0_4px_0_0_#5b4300] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              מחק אחרון
            </button>
            <button
              onClick={handleClearAll}
              disabled={running || commands.length === 0}
              className="bg-surface-container-highest text-on-surface px-6 py-4 rounded-xl font-bold border-b-4 border-slate-300 hover:translate-y-1 hover:border-transparent transition-all disabled:opacity-50"
            >
              נקה הכל
            </button>
            <button
              onClick={handleResetLevel}
              disabled={running}
              className="bg-white text-primary px-6 py-4 rounded-xl font-bold border-b-4 border-primary/20 hover:translate-y-1 hover:border-transparent transition-all disabled:opacity-50"
            >
              אפס שלב
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 bg-surface-container-highest text-on-surface px-6 py-4 rounded-xl font-bold border-b-4 border-slate-300 hover:translate-y-1 hover:border-transparent transition-all"
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
