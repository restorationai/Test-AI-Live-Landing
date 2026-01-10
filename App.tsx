import React, { useRef, useState, useEffect } from 'react';
import WorkflowAnimation from './WorkflowAnimation';
import { Loader2, Square, AlertCircle, RefreshCw, Sparkles, Mic, PhoneCall, ShieldCheck, Zap, TrendingUp, MessageSquare, X } from 'lucide-react';

/**
 * Premium Upgrade Button Component
 */
const Button: React.FC<{
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  subtext?: React.ReactNode; 
  noBorder?: boolean;
  noGlow?: boolean;
  headerStyle?: boolean;
  onClick?: () => void;
  trackingClass?: string;
}> = ({ variant = 'primary', children, className = '', subtext, noBorder, noGlow, headerStyle, onClick, trackingClass = "tracking-wide" }) => {
  const baseStyles = headerStyle 
    ? `px-3 py-1.5 font-black text-[10px] md:text-[11px] uppercase rounded-full border relative overflow-hidden group active:scale-95 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(255,255,255,1)] ring-2 ring-white/40 tracking-tighter`
    : `px-6 py-5 font-black ${trackingClass} transition-all duration-300 uppercase rounded-xl border-2 relative overflow-hidden group active:scale-95 flex flex-col items-center justify-center text-center`;
  
  const variants = {
    primary: headerStyle 
      ? `bg-brand-primary border-white/50 text-black`
      : `bg-brand-primary border-white shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:shadow-[0_0_50px_rgba(255,255,255,0.7)] hover:scale-[1.01]`,
    secondary: "bg-transparent border-white/20 text-white hover:border-brand-primary/60 hover:shadow-[0_0_20px_rgba(0,210,255,0.2)]",
    ghost: "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white",
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button onClick={onClick} className={`${baseStyles} ${variants[variant]} w-full`}>
        <div className="relative z-10 w-full">{children}</div>
        {!headerStyle && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />}
      </button>
      {subtext && (
        <span className="mt-4 text-[11px] md:text-xs font-bold text-white/50 tracking-normal normal-case leading-tight max-w-[320px]">
          {subtext}
        </span>
      )}
    </div>
  );
};

/**
 * Calendar Booking Modal Component
 */
const CalendarModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-card rounded-[2rem] md:rounded-[3rem] overflow-hidden border-brand-primary/40 shadow-[0_0_100px_rgba(0,210,255,0.2)] flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header/Close */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Container for Iframe */}
        <div className="flex-grow overflow-y-auto scrollbar-hide">
           <div className="p-4 md:p-8 pt-12 md:pt-16">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">Book Your Strategy Call</h2>
                <p className="text-brand-primary text-sm md:text-lg font-bold uppercase tracking-widest mt-1">Claim Your 30 Days Free Trial</p>
              </div>
              <div className="w-full bg-slate-900/50 rounded-2xl min-h-[600px] overflow-hidden">
                <iframe 
                  src="https://link.restorationai.io/widget/booking/nxDQ6IYn3QIIvrXS6Ib0" 
                  style={{ width: '100%', border: 'none', height: '800px' }} 
                  scrolling="yes" 
                  id="amzzk8cUTFJTWf00mnGo_1767992691847"
                />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Reusable subtext with glowing blue trial text
const StrategyCallSubtext = () => (
  <>
    A Quick 15-Minute Call to see if this fits your business. Includes a <span className="text-brand-primary text-glow-sm">30-day free trial</span>.
  </>
);

// New multi-line label for the main CTA with much larger font, black top text, and glowing white bottom text
const STRATEGY_CALL_LABEL = (
  <div className="flex flex-col gap-1 leading-[0.9] py-1">
    <span className="text-black text-xl md:text-3xl font-black">BOOK A STRATEGY CALL</span>
    <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] text-3xl md:text-6xl font-black">CLAIM 30 DAYS FREE</span>
  </div>
);

const VoiceWidgetEmbed = ({ onCtaClick }: { onCtaClick: () => void }) => {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ACTIVE' | 'POST_CALL' | 'ERROR'>('IDLE'); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', company: '', phone: '', timezone: '' });
  const retellClientRef = useRef<any>(null);
  const sessionIdRef = useRef<string>(Math.random().toString(36).substring(2, 15));

  const CONFIG = {
    webhookUrl: "https://restorationai.app.n8n.cloud/webhook/voice-demo",
    buttonLabel: "Start Live Call"
  };

  const US_TIMEZONES = [
    { label: 'Eastern Time (New York, Miami, DC)', value: 'America/New_York' },
    { label: 'Central Time (Chicago, Houston, Nashville)', value: 'America/Chicago' },
    { label: 'Mountain Time (Denver, Salt Lake City)', value: 'America/Denver' },
    { label: 'Arizona Time (Phoenix - No DST)', value: 'America/Phoenix' },
    { label: 'Pacific Time (Los Angeles, Seattle, Las Vegas)', value: 'America/Los_Angeles' },
    { label: 'Alaska Time (Anchorage)', value: 'America/Anchorage' },
    { label: 'Hawaii Time (Honolulu)', value: 'Pacific/Honolulu' },
  ];

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const toE164 = (value: string) => {
    const digits = value.replace(/[^\d]/g, '');
    return `+1${digits}`;
  };

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const exists = US_TIMEZONES.some(tz => tz.value === detected);
      setFormData(prev => ({ ...prev, timezone: exists ? detected : 'America/New_York' }));
    } catch (e) {
      setFormData(prev => ({ ...prev, timezone: 'America/New_York' }));
    }

    import('retell-client-js-sdk').then((module) => {
      retellClientRef.current = new module.RetellWebClient();
      
      retellClientRef.current.on("call_started", () => setStatus('ACTIVE'));
      retellClientRef.current.on("call_ended", () => setStatus('POST_CALL'));
      retellClientRef.current.on("error", (err: any) => {
        setErrorMessage("Voice connection error. Please try again.");
        setStatus('ERROR');
      });
    });

    return () => { if (retellClientRef.current) retellClientRef.current.stopCall(); };
  }, []);

  const handleToggleCall = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (status === 'ACTIVE') {
      retellClientRef.current?.stopCall();
      return;
    }
    
    if (!formData.name.trim() || !formData.company.trim() || !formData.phone.trim()) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    const digitsOnly = formData.phone.replace(/[^\d]/g, '');
    if (digitsOnly.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    setStatus('LOADING');
    setErrorMessage(null);

    try {
      await (navigator as any).mediaDevices.getUserMedia({ audio: true });

      const payload = { 
        id: sessionIdRef.current,
        sessionId: sessionIdRef.current,
        fullName: formData.name,
        companyName: formData.company,
        phoneNumber: toE164(formData.phone),
        timezone: formData.timezone,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}. Check if the webhook is Active.`);
      }

      const data = await response.json();
      const accessToken = data.access_token || data.accessToken || (Array.isArray(data) ? data[0]?.access_token : null);
      
      if (!accessToken) {
        throw new Error("Connected to webhook, but no access_token was found in the response.");
      }

      await retellClientRef.current.startCall({ accessToken });
      
    } catch (err: any) {
      console.error("Call Toggle Error Detail:", err);
      let msg = err.message;
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        msg = "Network Error: This is likely a CORS issue. Please enable CORS in your n8n Webhook settings.";
      }
      setErrorMessage(msg);
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 6000);
    }
  };

  const handleReset = () => {
    sessionIdRef.current = Math.random().toString(36).substring(2, 15);
    setStatus('IDLE');
  };

  const isFormDisabled = status === 'LOADING' || status === 'ACTIVE';

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <div className="glass-card rounded-[2.5rem] overflow-hidden border-brand-primary/40 shadow-[0_0_50px_rgba(0,210,255,0.15)] transition-all duration-300">
        <div className="p-6 md:p-8 flex flex-col relative z-10 text-left">
          
          {status !== 'POST_CALL' ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20">
                   <Mic className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">AI Voice Interface</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight uppercase tracking-tighter text-glow-sm"> 
                  Test our agent live
                </h2>
                <div className="space-y-1">
                  <p className="text-brand-primary font-bold text-sm md:text-base leading-relaxed max-w-md mx-auto"> 
                    ROLE PLAY: Pretend you're a homeowner with water damage.
                  </p>
                  <p className="text-[#cbd5e1] font-bold text-[10px] md:text-[11px] uppercase tracking-[0.1em]"> 
                    Complete the form to test now
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleToggleCall} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="embed-label">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      disabled={isFormDisabled}
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: (e.target as any).value})}
                      className="embed-input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="embed-label">Company Name</label>
                    <input
                      type="text"
                      placeholder="Restoration Pro"
                      disabled={isFormDisabled}
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: (e.target as any).value})}
                      className="embed-input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="embed-label">Direct Phone</label>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      disabled={isFormDisabled}
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: formatPhoneNumber((e.target as any).value)})}
                      className="embed-input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="embed-label">Current Time Zone</label>
                    <div className="relative">
                      <select
                        value={formData.timezone}
                        disabled={isFormDisabled}
                        onChange={(e) => setFormData({...formData, timezone: (e.target as any).value})}
                        className="embed-input appearance-none cursor-pointer pr-10"
                      >
                        {US_TIMEZONES.map(tz => (
                          <option key={tz.value} value={tz.value} className="bg-brand-navy">
                            {tz.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type={status === 'ACTIVE' ? 'button' : 'submit'}
                    onClick={status === 'ACTIVE' ? () => handleToggleCall() : undefined}
                    disabled={status === 'LOADING'}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-base uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] border-2 ${
                      status === 'ACTIVE' 
                        ? 'bg-red-950/40 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                        : status === 'LOADING' 
                          ? 'bg-brand-secondary/50 border-brand-primary/50 text-white cursor-wait' 
                          : 'bg-brand-primary border-white/50 text-black shadow-[0_0_40px_rgba(0,210,255,0.4)] hover:scale-[1.02]'
                    }`}
                  > 
                    {status === 'LOADING' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                     status === 'ACTIVE' ? <Square className="w-5 h-5 fill-current" /> :
                     <Mic className="w-5 h-5" />}
                    <span> 
                      {status === 'LOADING' ? "Connecting..." : status === 'ACTIVE' ? "End Live Call" : CONFIG.buttonLabel}
                    </span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-2 shadow-[0_0_30px_rgba(0,210,255,0.2)]">
                  <Sparkles className="w-10 h-10 text-brand-primary" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight text-glow-sm"> 
                  Ready to secure more <br/> $15k+ leads?
                </h2>
                <p className="text-brand-muted font-bold text-sm uppercase tracking-widest">Call Session Completed Successfully</p>
              </div>
              
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <Button variant="primary" className="w-full" onClick={onCtaClick} subtext={<StrategyCallSubtext />}>
                  {STRATEGY_CALL_LABEL}
                </Button>
                <button 
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 text-brand-muted hover:text-white font-bold text-xs uppercase tracking-[0.2em] pt-4 transition-colors group"
                >
                  <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                  Reset Demo Session
                </button>
              </div>
            </div>
          )}
          
          {errorMessage && status !== 'POST_CALL' && (
            <div className="mt-4 text-xs leading-tight text-red-400 font-bold bg-red-950/30 px-4 py-3 rounded-xl border border-red-900/50 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4" />
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}
          {status === 'ACTIVE' && (
            <div className="mt-6 flex flex-col items-center gap-1 animate-in zoom-in duration-300">
              <div className="flex items-center gap-3 px-6 py-2.5 bg-brand-primary/10 rounded-full border border-brand-primary/20 call-pulse">
                <span className="w-2.5 h-2.5 bg-brand-primary rounded-full animate-pulse shadow-[0_0_15px_#00D2FF]" />
                <p className="text-xs text-brand-primary font-black uppercase tracking-[0.25em]">Direct Link Active</p>
              </div>
              <p className="mt-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">Speaking with Restoration Agent</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5">
    <div className="w-full px-6 h-20 flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="https://storage.googleapis.com/msgsndr/Tx5eKisj3Xluq1SeZKe3/media/693c93fe96e7531d61535687.png" 
          alt="RESTORATION AI" 
          className="h-8 md:h-12 object-contain drop-shadow-[0_0_15px_rgba(0, 210, 255, 0.6)]"
        />
      </div>
      <div className="flex items-center ml-auto">
        <Button 
          variant="primary" 
          headerStyle
          noGlow
          onClick={onCtaClick}
          className="w-28 md:w-36"
        >
          Try 30 days free
        </Button>
      </div>
    </div>
  </header>
);

const Hero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => (
  <section className="relative pt-24 pb-6 px-6 flex flex-col items-center justify-center overflow-hidden bg-black">
    <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full radial-glow-section pointer-events-none" />

    <div className="relative z-10 max-w-5xl w-full text-center space-y-4">
      <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-[1.05] uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
        Never miss a <br/> <span className="text-brand-primary text-glow-sm">$15,000 lead</span> <br/> ever again
      </h1>
      
      <p className="text-brand-muted text-lg md:text-2xl max-w-3xl mx-auto font-semibold leading-relaxed tracking-wide opacity-90">
        A restoration AI receptionist that qualifies jobs, dispatches crews, and follows up automatically 24/7
      </p>

      <VoiceWidgetEmbed onCtaClick={onCtaClick} />

      <div className="flex items-center justify-center mt-4">
        <Button 
          variant="primary" 
          className="w-full sm:w-[32rem] lg:w-[48rem]"
          onClick={onCtaClick}
          subtext={<StrategyCallSubtext />}
        >
          {STRATEGY_CALL_LABEL}
        </Button>
      </div>
    </div>
  </section>
);

const HowItWorksStepCard: React.FC<{
  id: string;
  title: string;
  subHeadline: string;
  supportingText: string;
  icon: React.ReactNode;
  accentColor: string;
  isActive: boolean;
}> = ({ id, title, subHeadline, supportingText, icon, accentColor, isActive }) => (
  <div className={`flex-none w-[85%] sm:w-[440px] snap-center glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col min-h-[460px] md:min-h-[500px] group transition-all duration-500 
    ${isActive ? 'scale-105 border-opacity-100 shadow-[0_0_60px_rgba(0,0,0,0.8)] opacity-100 border-2' : 'scale-100 border-opacity-30 md:border-opacity-100 opacity-50 md:opacity-100 border'}`} 
       style={{ borderTopColor: accentColor, borderTopWidth: '8px' }}>
    <div className="absolute -top-6 -right-3 text-[12rem] md:text-[14rem] font-black opacity-10 pointer-events-none select-none" style={{ color: accentColor }}>
      {id}
    </div>
    
    <div className="mb-6 md:mb-8 p-5 rounded-[1.5rem] w-fit border-2 transition-transform group-hover:scale-110" style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}40`, color: accentColor }}>
      {icon}
    </div>
    
    <div className="space-y-3 md:space-y-4 relative z-10 text-left">
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-[1.05]" style={{ color: accentColor }}>
        {title}
      </h3>
      <h4 className="text-white text-lg md:text-xl lg:text-2xl font-black uppercase tracking-tight opacity-90">
        {subHeadline}
      </h4>
      <p className="text-brand-muted text-sm md:text-base lg:text-lg font-bold leading-relaxed opacity-80 pt-1">
        {supportingText}
      </p>
    </div>
  </div>
);

const HowItWorks: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    { 
      id: "01", 
      title: "All Calls Answered Instantly", 
      subHeadline: "Work qualified automatically",
      supportingText: "Your AI answers every incoming call immediately, handling multiple lines at once to identify real customers and filter out spam while qualifying $15k+ leads automatically.", 
      accentColor: "#10b981", 
      icon: <PhoneCall className="w-8 h-8" /> 
    },
    { 
      id: "02", 
      title: "Emergency Protocol Handled", 
      subHeadline: "Work authorization signed & crews dispatched",
      supportingText: "When an emergency is detected, the AI sends a work authorization for signature and instantly alerts your on-call team while sending an immediate 'Help is on the way' text to the customer.", 
      accentColor: "#ef4444", 
      icon: <ShieldCheck className="w-8 h-8" /> 
    },
    { 
      id: "03", 
      title: "CRM Updated in Real Time", 
      subHeadline: "Integrates with your existing CRM",
      supportingText: "Call summaries, job details, and dispatch updates are automatically logged inside your existing CRM and the Restoration AI dashboard without you ever touching a single button.", 
      accentColor: "#a855f7", 
      icon: <Zap className="w-8 h-8" /> 
    },
    { 
      id: "04", 
      title: "Work Recovered & Follow-ups", 
      subHeadline: "Never let a potential job turn cold",
      supportingText: "The AI automatically follows up with homeowners who didn't book immediately, answering lingering questions and nudging them toward a signed contract to recover lost revenue.", 
      accentColor: "#00D2FF", 
      icon: <TrendingUp className="w-8 h-8" /> 
    },
    { 
      id: "05", 
      title: "Reviews Collected Automatically", 
      subHeadline: "Build a 5-star reputation on autopilot",
      supportingText: "Once the job is complete, the AI reaches out to happy customers to request reviews, building your online presence and authority in your service area automatically.", 
      accentColor: "#f59e0b", 
      icon: <MessageSquare className="w-8 h-8" /> 
    }
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = (scrollRef.current as any).scrollLeft;
      const width = (scrollRef.current as any).offsetWidth;
      const index = Math.round(scrollLeft / (width * 0.8));
      if (index !== activeIndex && index >= 0 && index < steps.length) setActiveIndex(index);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      (el as any).addEventListener('scroll', handleScroll);
      return () => (el as any).removeEventListener('scroll', handleScroll);
    }
  }, [activeIndex]);

  return (
    <section className="py-12 md:py-20 px-6 bg-brand-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-4 -mx-6 md:mx-0">
          <WorkflowAnimation />
        </div>
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">HOW IT WORKS</h2>
          <p className="text-brand-muted text-xl md:text-3xl font-black max-w-3xl mx-auto opacity-80 uppercase tracking-wide">Instant Capture. Seamless Dispatch. Automatic Growth.</p>
        </div>
        
        <div ref={scrollRef} className="flex gap-8 overflow-x-auto snap-x scroll-smooth scrollbar-hide pb-24 px-8 md:px-24 -mx-8 cursor-grab">
          {steps.map((step, idx) => (
            <HowItWorksStepCard key={step.id} {...step} isActive={idx === activeIndex} />
          ))}
        </div>
        
        <div className="flex justify-center gap-6 mt-2">
          {steps.map((_, idx) => (
            <div key={idx} className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-16 bg-brand-primary' : 'w-4 bg-white/20'}`} />
          ))}
        </div>
        
        <div className="flex items-center justify-center mt-16">
          <Button 
            variant="primary" 
            className="w-full sm:w-[32rem] lg:w-[48rem]"
            onClick={onCtaClick}
            subtext={<StrategyCallSubtext />}
          >
            {STRATEGY_CALL_LABEL}
          </Button>
        </div>
      </div>
    </section>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "Will I ever miss a call again?", a: "No. Restoration AI answers every call instantly, 24/7, using advanced intelligence trained specifically for emergency dispatch scenarios." },
    { q: "Is it worth the investment?", a: "Capturing just one additional $15,000 emergency job per year covers the cost of the platform for over 4 years. Most users see ROI in their first week." },
    { q: "How long is setup?", a: "Setup is designed to be streamlined. You can be live and capturing leads in under 5 minutes." },
    { q: "What is the cost?", a: "Restoration AI starts at $297/month after your risk-free 30-day trial." },
    { q: "Are there contracts?", a: "No. We believe in our product. Use it month-to-month and cancel anytime if you aren't seeing massive ROI." }
  ];

  return (
    <section className="py-16 px-6 relative bg-black">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-[2.5rem] overflow-hidden transition-all duration-300 border-brand-primary/20 shadow-[0_0_30px_rgba(0,210,255,0.1)]">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`w-full text-left p-5 md:p-6 flex items-center justify-between transition-all duration-300 ${openIndex === i ? 'bg-brand-primary/5' : ''}`}
              >
                <span className={`text-xl md:text-3xl font-black tracking-tight pr-8 ${openIndex === i ? 'text-brand-primary' : 'text-white'}`}>
                  {faq.q}
                </span>
                <div className={`flex-none w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${openIndex === i ? 'rotate-180 bg-brand-primary border-brand-primary text-black' : 'text-brand-primary'}`}>
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 md:p-8 pt-0 text-brand-muted text-lg md:text-2xl font-bold leading-relaxed border-t border-white/5 opacity-80">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowToGetStarted: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
  const RedX = ({ glowing = false }) => (
    <div className={`w-full h-full rounded-full flex items-center justify-center ${glowing ? 'border-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : ''}`}>
      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </div>
  );

  const stepsData = [
    { marker: <RedX glowing />, title: "WHERE YOU ARE NOW (LEADS SLIPPING AWAY)", desc: "" },
    { marker: <span className="text-black font-black text-sm md:text-lg">1</span>, title: "SECURE YOUR TERRITORY", desc: "Start your 30-day trial for $0. Lock in your area." },
    { marker: <span className="text-black font-black text-sm md:text-lg">2</span>, title: "LAUNCH IN 3 MINUTES", desc: "Connect your line and go live instantly." },
    { marker: <span className="text-black font-black text-sm md:text-lg">3</span>, title: "OPTIMIZE FOR $15K+ LEADS", desc: "10-min setup review with your dedicated account rep to ensure your AI captures every $15k+ lead." },
    { marker: <div className="w-full h-full rounded-full bg-white border border-brand-primary flex items-center justify-center overflow-hidden shadow-[0_0_8px_#00D2FF]"><img src="https://storage.googleapis.com/msgsndr/Tx5eKisj3Xluq1SeZKe3/media/693c75ba9caf9aea42d79079.png" className="w-full h-full object-cover" alt="AI" /></div>, title: "NEVER MISS ANOTHER CALL", desc: "" }
  ];

  return (
    <section className="py-8 md:py-12 px-6 bg-brand-navy relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            GET STARTED IN <span className="text-brand-primary">3 MINUTES</span>
          </h2>
          <div className="mt-4 inline-block">
            <span className="text-brand-muted text-[10px] font-black uppercase tracking-[0.3em] opacity-60">SUCCESS ROADMAP</span>
          </div>
        </div>

        {/* Compact Progress Bar */}
        <div className="mb-6 relative max-w-xl mx-auto px-4 hidden sm:block">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-4 right-4 h-2 bg-white/5 rounded-full -translate-y-1/2 -z-10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500/30 via-brand-primary/50 to-brand-primary w-[25%]" />
            </div>

            <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-white/10 flex items-center justify-center relative z-10 flex-none shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                <RedX glowing />
            </div>
            
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-none text-black font-black text-lg shadow-[0_0_15px_rgba(255,255,255,0.3)]">1</div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-none text-black font-black text-lg shadow-[0_0_15px_rgba(255,255,255,0.3)]">2</div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-none text-black font-black text-lg shadow-[0_0_15px_rgba(255,255,255,0.3)]">3</div>
            
            <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-primary flex items-center justify-center flex-none overflow-hidden shadow-[0_0_20px_rgba(0,210,255,0.5)]">
              <img src="https://storage.googleapis.com/msgsndr/Tx5eKisj3Xluq1SeZKe3/media/693c75ba9caf9aea42d79079.png" className="w-full h-full object-cover" alt="AI Agent" />
            </div>
          </div>
        </div>

        {/* Compressed List Card */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden border-brand-primary/20 max-w-2xl mx-auto shadow-[0_0_60px_rgba(0,0,0,0.7)] relative">
          <div className="p-6 md:p-8 space-y-6 md:space-y-8 relative">
            {/* Animated Connector Line */}
            <div className="absolute left-[2.4rem] md:left-[2.95rem] top-10 bottom-10 w-1.5 md:w-2 bg-white/5 rounded-full -z-0 overflow-hidden">
                <div className="w-full bg-gradient-to-b from-red-500/20 via-brand-primary/20 to-brand-primary/40 h-full" />
            </div>

            {stepsData.map((step, i) => (
              <div key={i} className="flex gap-5 md:gap-8 items-center group relative z-10">
                <div className={`flex-none w-10 h-10 md:w-12 md:h-12 rounded-full ${i === 0 ? 'bg-slate-950 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'} flex items-center justify-center`}>
                  {step.marker}
                </div>
                <div className="flex-grow">
                  <h3 className={`text-white text-base md:text-xl font-black uppercase tracking-tight leading-tight ${i === 0 ? 'text-red-400/90' : ''}`}>{step.title}</h3>
                  {step.desc && <p className="text-brand-muted text-[11px] md:text-sm font-bold opacity-80 mt-0.5">{step.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-10">
          <Button 
            variant="primary" 
            className="w-full sm:w-[32rem] lg:w-[48rem] py-4"
            onClick={onCtaClick}
            subtext={<StrategyCallSubtext />}
          >
            {STRATEGY_CALL_LABEL}
          </Button>
        </div>
      </div>
    </section>
  );
};

const FinalCTA: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => (
  <section className="py-24 px-6 bg-black relative overflow-hidden text-center">
    <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full radial-glow-section pointer-events-none" />
    
    <div className="max-w-6xl mx-auto relative z-10 space-y-10">
      <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.95] text-glow-sm">
        Never Miss <br className="hidden md:block" /> Another Call
      </h2>
      <p className="text-brand-primary text-2xl md:text-5xl font-black uppercase tracking-widest max-w-5xl mx-auto drop-shadow-[0_0_40px_rgba(0,210,255,0.6)] leading-tight">
        YOUR AI AGENT SECURES $30K+ EMERGENCY JOBS WHILE YOU SLEEP
      </p>
      
      <div className="flex items-center justify-center pt-4">
        <Button 
          variant="primary" 
          className="w-full sm:w-[32rem] lg:w-[48rem]"
          onClick={onCtaClick}
          subtext={<StrategyCallSubtext />}
        >
          {STRATEGY_CALL_LABEL}
        </Button>
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="py-12 bg-brand-navy border-t border-white/5 px-6">
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
      <div className="flex items-center">
        <img 
          src="https://storage.googleapis.com/msgsndr/Tx5eKisj3Xluq1SeZKe3/media/693c93fe96e7531d61535687.png" 
          alt="RESTORATION AI" 
          className="h-12 md:h-16 object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>
      <div className="text-brand-muted text-[10px] uppercase tracking-[0.2em] font-black text-center opacity-40 leading-relaxed max-w-md">
        © {new Date().getFullYear()} Restoration AI. All rights reserved. <br className="sm:hidden" /> Enterprise-grade AI for High-Stakes Restoration Services.
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const openCalendar = () => {
    setIsCalendarOpen(true);
    // Fix: Access document via globalThis to resolve the 'Cannot find name' error in this environment
    if ((globalThis as any).document) {
      (globalThis as any).document.body.style.overflow = 'hidden';
    }
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
    // Fix: Access document via globalThis to resolve the 'Cannot find name' error in this environment
    if ((globalThis as any).document) {
      (globalThis as any).document.body.style.overflow = 'auto';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black font-outfit">
      <Header onCtaClick={openCalendar} />
      <main className="flex-grow">
        <Hero onCtaClick={openCalendar} />
        <HowItWorks onCtaClick={openCalendar} />
        <FAQSection />
        <HowToGetStarted onCtaClick={openCalendar} />
        <FinalCTA onCtaClick={openCalendar} />
      </main>
      <Footer />
      <CalendarModal isOpen={isCalendarOpen} onClose={closeCalendar} />
    </div>
  );
};

export default App;