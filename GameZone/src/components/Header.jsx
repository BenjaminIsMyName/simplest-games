import React from 'react';
import { NavLink } from 'react-router-dom';
import codeLogo from '../assets/code-logo.png';
import { useAppData } from '../context/AppDataContext';

const navItems = [
  { to: '/', label: 'בית' },
  { to: '/weekly-challenge', label: 'אתגר שבועי' },
  { to: '/leaderboard', label: 'האלופים של פרוגיקס' },
];

export const Header = ({ hideNavigation = false }) => {
  const { currentUser } = useAppData();

  return (
    <header className="bg-white dark:bg-slate-900 sticky top-0 rounded-b-[3rem] shadow-[0_4px_0_0_rgba(0,97,164,0.1)] z-50">
      <div className={`flex justify-between items-center w-full px-6 max-w-7xl mx-auto ${hideNavigation ? 'py-3' : 'py-4'}`}>
        <div className="flex items-center gap-4">
          <img
            alt="MPG CodeGround Logo"
            className={`${hideNavigation ? 'h-11 w-11' : 'h-14 w-14'} object-contain`}
            src={codeLogo}
          />
          <span className={`${hideNavigation ? 'text-2xl' : 'text-3xl'} font-black text-blue-700 dark:text-blue-400 tracking-tight`}>
            MPG CodeGround
          </span>
        </div>

        {!hideNavigation && (
          <nav className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-700 dark:text-blue-300 font-extrabold scale-110 transition-transform duration-200'
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:scale-105 transition-transform duration-200'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-primary-container px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-primary">account_circle</span>
            <span className="font-bold text-on-primary-container">{currentUser.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
