import React, { useState } from 'react';

const accentStyles = {
  primary: {
    badge: 'bg-primary-container text-primary',
    button: 'bg-primary text-on-primary shadow-[0_4px_0_0_#00497d]',
    iconBox: 'bg-primary-container text-primary',
  },
  secondary: {
    badge: 'bg-secondary-container text-secondary',
    button: 'bg-secondary text-on-secondary shadow-[0_4px_0_0_#5b4300]',
    iconBox: 'bg-secondary-container text-secondary',
  },
  tertiary: {
    badge: 'bg-tertiary-container text-tertiary',
    button: 'bg-tertiary text-on-tertiary shadow-[0_4px_0_0_#005313]',
    iconBox: 'bg-tertiary-container text-tertiary',
  },
};

export const GameIntroOverlay = ({ title, subtitle, steps, accent = 'primary', onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const palette = accentStyles[accent] ?? accentStyles.primary;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-5 md:p-7 shadow-[0_20px_60px_rgba(15,23,42,0.25)] border border-white">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${palette.badge}`}>
              <span className="material-symbols-outlined text-base">lightbulb</span>
              איך משחקים?
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-on-surface">{title}</h2>
              <p className="mt-2 text-on-surface-variant font-medium max-w-xl">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center active:scale-95 transition-transform"
            aria-label="סגירת הדרכה"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-6 rounded-[1.75rem] bg-surface-container-low p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[1.75rem] flex items-center justify-center shrink-0 ${palette.iconBox}`}>
              <span className="material-symbols-outlined text-5xl md:text-6xl animate-pulse">{step.icon}</span>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-on-surface-variant">שלב {currentStep + 1} מתוך {steps.length}</div>
              <h3 className="text-xl md:text-2xl font-black text-on-surface">{step.title}</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">{step.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {steps.map((item, index) => (
            <span
              key={`${item.title}-${index}`}
              className={`h-2.5 rounded-full transition-all ${index === currentStep ? 'w-10 bg-primary' : 'w-2.5 bg-slate-300'}`}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep((value) => Math.max(0, value - 1))}
              disabled={currentStep === 0}
              className="px-5 py-3 rounded-xl bg-surface-container-highest text-on-surface font-bold disabled:opacity-40 active:scale-95 transition-transform"
            >
              הקודם
            </button>
            <button
              onClick={isLastStep ? onClose : () => setCurrentStep((value) => Math.min(steps.length - 1, value + 1))}
              className={`px-6 py-3 rounded-xl font-bold active:translate-y-1 active:shadow-none transition-all ${palette.button}`}
            >
              {isLastStep ? 'התחל לשחק' : 'הבא'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-on-surface-variant font-bold hover:text-on-surface transition-colors"
          >
            דלג
          </button>
        </div>
      </div>
    </div>
  );
};
