import React from 'react';

const WorkflowAnimation: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto px-2 mb-12 select-none">
      {/* Container for the static workflow image - Further reduced desktop width to max-w-2xl */}
      <div className="relative rounded-[2rem] md:rounded-[3rem] bg-[#050a1f] border-2 border-brand-primary/20 overflow-hidden shadow-[0_0_50px_rgba(0,210,255,0.15)] group">
        
        {/* Subtle glow behind the image */}
        <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none" />
        
        {/* The requested workflow image */}
        <img 
          src="https://storage.googleapis.com/msgsndr/Tx5eKisj3Xluq1SeZKe3/media/696290a198efbd7872a4e37e.png" 
          alt="Restoration AI Workflow Diagram" 
          className="w-full h-auto block relative z-10 transition-transform duration-700 group-hover:scale-[1.01]"
        />

        {/* HUD corners for aesthetics */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-brand-primary/30 rounded-tl-[2rem] md:rounded-tl-[3rem]" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-brand-primary/30 rounded-tr-[2rem] md:rounded-tr-[3rem]" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-brand-primary/30 rounded-bl-[2rem] md:rounded-bl-[3rem]" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-brand-primary/30 rounded-br-[2rem] md:rounded-br-[3rem]" />
      </div>
    </div>
  );
};

export default WorkflowAnimation;