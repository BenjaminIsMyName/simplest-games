import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center gap-4 mt-auto pt-12 pb-8 bg-slate-50 border-t border-slate-200">
      <div className="text-lg font-bold text-slate-500 font-headline">MPG CodeGround</div>
      <div className="flex gap-8 text-sm text-slate-500 font-semibold">
        <span>בית</span>
        <span>אתגר שבועי</span>
        <span>האלופים של פרוגיקס</span>
      </div>
      <div className="text-sm text-slate-500 opacity-70">© 2024 MPG CodeGround</div>
    </footer>
  );
};
