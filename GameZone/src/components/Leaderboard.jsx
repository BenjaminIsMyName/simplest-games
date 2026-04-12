import React from 'react';
import { useAppData } from '../context/AppDataContext';

export const Leaderboard = () => {
  const { leaderboard, currentUser } = useAppData();

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10 pb-20 flex-grow space-y-10">
      <section className="rounded-[2.5rem] bg-white border border-white shadow-[0_14px_40px_rgba(15,23,42,0.08)] p-8 md:p-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full bg-primary-container px-5 py-2 text-primary font-bold">
            <span className="material-symbols-outlined">military_tech</span>
            האלופים של פרוגיקס
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-on-surface">טבלת המובילים</h1>
          <p className="text-xl text-on-surface-variant max-w-3xl font-medium">
            כאן רואים מי תרגלו הכי הרבה, צברו הכי הרבה נקודות ושומרים על רצף מרשים.
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_14px_40px_rgba(15,23,42,0.08)] border border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="text-right text-on-surface-variant border-b border-slate-200">
                <th className="pb-4 font-bold">מקום</th>
                <th className="pb-4 font-bold">תלמיד</th>
                <th className="pb-4 font-bold">נקודות</th>
                <th className="pb-4 font-bold">רצף</th>
                <th className="pb-4 font-bold">סשנים</th>
                <th className="pb-4 font-bold">שיא הקלדה</th>
                <th className="pb-4 font-bold">שיא זיכרון</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b last:border-b-0 ${user.id === currentUser.id ? 'bg-primary-container/40' : ''}`}
                >
                  <td className="py-5 font-black text-xl text-primary">#{index + 1}</td>
                  <td className="py-5 font-bold text-on-surface">{user.name}</td>
                  <td className="py-5 font-bold text-on-surface">{user.totalScore}</td>
                  <td className="py-5 font-bold text-on-surface">{user.streakDays} ימים</td>
                  <td className="py-5 font-bold text-on-surface">{user.sessionsCompleted}</td>
                  <td className="py-5 font-bold text-on-surface">{user.typingBestWpm} WPM</td>
                  <td className="py-5 font-bold text-on-surface">{user.memoryBest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
