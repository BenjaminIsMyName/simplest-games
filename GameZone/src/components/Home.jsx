import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

export const Home = () => {
  const navigate = useNavigate();
  const { currentUser, challenge } = useAppData();

  return (
    <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 space-y-16 flex-grow">
      <section className="relative bg-primary-container rounded-[2.5rem] p-8 md:p-16 overflow-hidden flex flex-col md:flex-row items-center gap-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary opacity-10 rounded-full -ml-10 -mb-10 blur-2xl" />

        <div className="flex-1 text-center md:text-right space-y-6 relative z-10">
          <div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm">
            <span className="text-primary font-bold text-lg">שלום {currentUser.name}, מוכנים לתרגול הבא?</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-on-primary-container leading-tight tracking-tight">
            לומדים לתכנת
            <br />
            <span className="text-primary">דרך משחקים חכמים</span>
          </h1>
          <p className="text-xl text-on-primary-container/80 max-w-xl font-medium">
            בוחרים משחק, צוברים נקודות, שומרים על רצף יומי ומטפסים בטבלת האלופים של פרוגיקס.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate('/games/touch-typing')}
              className="bg-primary text-on-primary px-10 py-5 rounded-xl text-2xl font-bold shadow-[0_6px_0_0_#00497d] active:translate-y-1 active:shadow-none transition-all hover:scale-105"
            >
              מתחילים לתרגל
            </button>
            <button
              onClick={() => navigate('/weekly-challenge')}
              className="bg-white text-primary px-8 py-5 rounded-xl text-xl font-bold shadow-[0_6px_0_0_#b6cff6] active:translate-y-1 active:shadow-none transition-all hover:scale-105"
            >
              לאתגר השבועי
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative z-20 rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(0,97,164,0.14)] rotate-[-3deg]">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface-variant">אתגר השבוע</span>
                <span className="bg-secondary-container text-secondary px-4 py-2 rounded-full font-black text-sm">
                  {challenge.goalScore} נקודות
                </span>
              </div>
              <h3 className="text-3xl font-black text-on-surface">השבוע צוברים ניקוד ושומרים על רצף</h3>
              <p className="text-on-surface-variant font-medium">{challenge.description}</p>
              <div className="rounded-2xl bg-surface-container p-5">
                <div className="text-sm font-bold text-on-surface-variant">ההתקדמות שלך</div>
                <div className="mt-3 text-4xl font-black text-primary">{currentUser.weeklyScore}</div>
                <div className="mt-2 text-on-surface-variant font-medium">נקודות השבוע</div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-75 -z-10" />
        </div>
      </section>

      <section className="space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-on-surface">בחרו משחק והתחילו ללמוד</h2>
          <p className="text-on-surface-variant text-xl">כל משחק תורם לניקוד, לרצף ולהתקדמות האישית שלכם</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
          <button
            onClick={() => navigate('/games/memory')}
            className="group bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_8px_0_0_#eeeeee] border-2 border-transparent hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden rotate-1 text-left"
          >
            <div className="bg-primary-container w-20 h-20 rounded-xl flex items-center justify-center mb-8 rotate-[-5deg] group-hover:rotate-0 transition-transform">
              <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-3">משחק הזיכרון</h3>
            <p className="text-on-surface-variant leading-relaxed font-medium">לומדים מושגי תכנות דרך התאמת קלפים, ניקוד והצלחה בשלבים.</p>
            <div className="mt-8">
              <span className="text-primary font-bold flex items-center gap-2">
                למשחק
                <span className="material-symbols-outlined">arrow_back</span>
              </span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          </button>

          <button
            onClick={() => navigate('/games/touch-typing')}
            className="group bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_8px_0_0_#eeeeee] border-2 border-transparent hover:border-secondary/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden -rotate-1 text-left"
          >
            <div className="bg-secondary-container w-20 h-20 rounded-xl flex items-center justify-center mb-8 rotate-[5deg] group-hover:rotate-0 transition-transform">
              <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                keyboard
              </span>
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-3">הקלדה עיוורת</h3>
            <p className="text-on-surface-variant leading-relaxed font-medium">מתחילים מ־F ו־J, מתקדמים למילים שלמות וצוברים נקודות בלי לאבד את הרצף.</p>
            <div className="mt-8">
              <span className="text-secondary font-bold flex items-center gap-2">
                למשחק
                <span className="material-symbols-outlined">arrow_back</span>
              </span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
          </button>

          <button
            onClick={() => navigate('/games/robot-maze')}
            className="group bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_8px_0_0_#eeeeee] border-2 border-transparent hover:border-tertiary/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden rotate-2 text-left"
          >
            <div className="bg-tertiary-container w-20 h-20 rounded-xl flex items-center justify-center mb-8 rotate-[-4deg] group-hover:rotate-0 transition-transform">
              <span className="material-symbols-outlined text-tertiary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-3">מבוך רובוט</h3>
            <p className="text-on-surface-variant leading-relaxed font-medium">מתכננים מסלול, מסדרים פקודות ועוזרים לרובוט להגיע למטרה בלי לפגוש קירות.</p>
            <div className="mt-8">
              <span className="text-tertiary font-bold flex items-center gap-2">
                למשחק
                <span className="material-symbols-outlined">arrow_back</span>
              </span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-tertiary/5 rounded-full blur-2xl" />
          </button>

          <button
            onClick={() => navigate('/games/step-order')}
            className="group bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_8px_0_0_#eeeeee] border-2 border-transparent hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden -rotate-2 text-left"
          >
            <div className="bg-primary-container w-20 h-20 rounded-xl flex items-center justify-center mb-8 rotate-[4deg] group-hover:rotate-0 transition-transform">
              <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                format_list_numbered
              </span>
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-3">סדר צעדים</h3>
            <p className="text-on-surface-variant leading-relaxed font-medium">מסדרים משימות מחיי היום יום והמחשב לפי הסדר הנכון, ומתרגלים חשיבה אלגוריתמית בלי לכתוב קוד.</p>
            <div className="mt-8">
              <span className="text-primary font-bold flex items-center gap-2">
                למשחק
                <span className="material-symbols-outlined">arrow_back</span>
              </span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-tertiary-container p-10 rounded-[2rem] flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-black text-on-tertiary-container mb-4">אתגר השבוע</h3>
            <p className="text-on-tertiary-container/80 text-lg font-bold">{challenge.description}</p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-tertiary font-black shadow-sm">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <span className="text-on-tertiary-container font-bold text-sm">כל תרגול השבוע נספר לקראת הפרס השבועי</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border-b-8 border-secondary flex flex-col items-center justify-center text-center">
          <span className="text-5xl mb-4">🏆</span>
          <span className="text-4xl font-black text-on-surface">{currentUser.totalScore}</span>
          <span className="text-on-surface-variant font-bold">נקודות שצברת</span>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border-b-8 border-primary flex flex-col items-center justify-center text-center">
          <span className="text-5xl mb-4">🔥</span>
          <span className="text-4xl font-black text-on-surface">{currentUser.streakDays}</span>
          <span className="text-on-surface-variant font-bold">ימי רצף</span>
        </div>
      </section>
    </main>
  );
};
