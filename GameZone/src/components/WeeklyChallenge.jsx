import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

export const WeeklyChallenge = () => {
  const navigate = useNavigate();
  const { currentUser, challenge } = useAppData();

  const scoreProgress = Math.min(100, Math.round((currentUser.weeklyScore / challenge.goalScore) * 100));
  const sessionsProgress = Math.min(100, Math.round((currentUser.weeklySessions / challenge.goalSessions) * 100));
  const challengeCompleted = currentUser.weeklyScore >= challenge.goalScore && currentUser.weeklySessions >= challenge.goalSessions;

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10 pb-20 flex-grow space-y-10">
      <section className="rounded-[2.5rem] bg-white border border-white shadow-[0_14px_40px_rgba(15,23,42,0.08)] p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-secondary-container px-5 py-2 text-secondary font-bold">
              <span className="material-symbols-outlined">emoji_events</span>
              {challenge.title}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-on-surface">משימת השבוע של ProGix</h1>
            <p className="text-xl text-on-surface-variant max-w-2xl font-medium">{challenge.description}</p>
          </div>
          <div className={`rounded-[2rem] px-6 py-5 text-center shadow-lg ${challengeCompleted ? 'bg-green-100 text-green-800' : 'bg-primary-container text-primary'}`}>
            <div className="text-sm font-bold uppercase tracking-[0.2em]">סטטוס</div>
            <div className="text-2xl font-black mt-2">{challengeCompleted ? 'הושלם בהצלחה' : 'בדרך לזכייה'}</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_10px_30px_rgba(0,97,164,0.08)] border border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-on-surface">ניקוד שבועי</h2>
            <span className="text-primary font-black text-3xl">{currentUser.weeklyScore}</span>
          </div>
          <div className="h-5 rounded-full bg-primary-container/60 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${scoreProgress}%` }} />
          </div>
          <p className="mt-4 text-on-surface-variant font-medium">
            יעד השבוע: {challenge.goalScore} נקודות. נשארו לכם {Math.max(0, challenge.goalScore - currentUser.weeklyScore)} נקודות כדי להשלים.
          </p>
        </div>

        <div className="rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_10px_30px_rgba(0,110,28,0.08)] border border-tertiary/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-on-surface">ימי תרגול השבוע</h2>
            <span className="text-tertiary font-black text-3xl">{currentUser.weeklySessions}</span>
          </div>
          <div className="h-5 rounded-full bg-tertiary-container/50 overflow-hidden">
            <div className="h-full rounded-full bg-tertiary transition-all duration-500" style={{ width: `${sessionsProgress}%` }} />
          </div>
          <p className="mt-4 text-on-surface-variant font-medium">
            יעד השבוע: {challenge.goalSessions} סשנים. נשארו לכם {Math.max(0, challenge.goalSessions - currentUser.weeklySessions)} סשנים כדי להשלים.
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.08)] border border-white">
        <h2 className="text-3xl font-black text-on-surface mb-4">המלצה להיום</h2>
        <p className="text-lg text-on-surface-variant font-medium max-w-3xl">
          כדי להתקדם מהר יותר, שלבו בין תרגול הקלדה עיוורת לבין משחק הזיכרון. כך גם תשפרו מהירות וגם תגדילו את הניקוד השבועי.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/games/touch-typing')}
            className="bg-primary text-on-primary px-6 py-4 rounded-xl font-bold shadow-[0_4px_0_0_#00497d] hover:translate-y-1 hover:shadow-none transition-all"
          >
            לתרגול הקלדה
          </button>
          <button
            onClick={() => navigate('/games/memory')}
            className="bg-secondary text-on-secondary px-6 py-4 rounded-xl font-bold shadow-[0_4px_0_0_#5b4300] hover:translate-y-1 hover:shadow-none transition-all"
          >
            למשחק הזיכרון
          </button>
        </div>
      </section>
    </main>
  );
};
