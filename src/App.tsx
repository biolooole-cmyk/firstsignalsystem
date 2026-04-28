import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Layers, 
  Zap, 
  CheckCircle, 
  Award, 
  Home,
  ChevronRight,
  Brain,
  Eye,
  Activity,
  User,
  Star
} from 'lucide-react';
import { UserProgress, INITIAL_PROGRESS, BADGES } from './types';

// Views
type View = 'home' | 'theory' | 'schemes' | 'practice' | 'tests' | 'achievements';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('neuro_quest_progress') : null;
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem('neuro_quest_progress', JSON.stringify(progress));
    
    // Update level based on points
    if (progress.points > 500 && progress.level === 'Дослідник') {
      setProgress(p => ({ ...p, level: 'Експерт' }));
    } else if (progress.points > 200 && progress.level === 'Новачок') {
      setProgress(p => ({ ...p, level: 'Дослідник' }));
    }
  }, [progress]);

  const addPoints = (amount: number) => {
    setProgress(prev => {
      // Check for completion-based badges
      const newPoints = prev.points + amount;
      const newBadges = [...prev.badges];
      
      return { ...prev, points: newPoints, badges: newBadges };
    });
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView setView={setCurrentView} progress={progress} />;
      case 'theory': return <TheoryView onBack={() => setCurrentView('home')} progress={progress} setProgress={setProgress} />;
      case 'schemes': return <SchemesView onBack={() => setCurrentView('home')} addPoints={addPoints} />;
      case 'practice': return <PracticeView onBack={() => setCurrentView('home')} addPoints={addPoints} />;
      case 'tests': return <TestsView onBack={() => setCurrentView('home')} addPoints={addPoints} />;
      case 'achievements': return <AchievementsView onBack={() => setCurrentView('home')} progress={progress} />;
      default: return <HomeView setView={setCurrentView} progress={progress} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FEE7] text-slate-800 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 border-4 border-emerald-500 rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border-4 border-orange-400 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 border-4 border-sky-400 rounded-full" />
      </div>

      <main className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      {currentView !== 'home' && (
        <motion.nav 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgb(0,0,0,0.04)] border-t border-slate-100 z-50 py-3 px-6 flex justify-around items-center"
        >
          <NavButton active={currentView === 'home'} onClick={() => setCurrentView('home')} icon={Home} label="ГОЛОВНА" />
          <NavButton active={currentView === 'theory'} onClick={() => setCurrentView('theory')} icon={BookOpen} label="ТЕОРІЯ" />
          <NavButton active={currentView === 'schemes'} onClick={() => setCurrentView('schemes')} icon={Layers} label="СХЕМИ" />
          <NavButton active={currentView === 'tests'} onClick={() => setCurrentView('tests')} icon={CheckCircle} label="ТЕСТИ" />
        </motion.nav>
      )}
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group">
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 group-hover:bg-slate-50'}`}>
        <Icon size={24} />
      </div>
      <span className={`text-[10px] font-black tracking-widest ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
    </button>
  );
}

// --- Home View ---

function HomeView({ setView, progress }: { setView: (v: View) => void, progress: UserProgress }) {
  return (
    <motion.div 
      key="home"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="p-6 flex flex-col gap-8 flex-1"
    >
      <header className="pt-8">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white border-b-8 border-emerald-500 rounded-3xl p-6 shadow-xl w-full mr-4">
            <h1 className="text-3xl font-black text-emerald-600 tracking-tight leading-none uppercase">NEURO<br />ПУЛЬС</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Твій путівник у світ мозку</p>
          </div>
          <div className="bg-white border-b-4 border-slate-200 p-4 rounded-2xl shadow-lg flex flex-col items-center min-w-[70px]">
            <div className="text-sky-500 text-2xl mb-1">💎</div>
            <span className="font-black text-slate-800 text-xl leading-none">{progress.points}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar py-2">
          <BadgePill label={progress.level} active />
          {progress.badges.map(b => (
             <BadgePill key={b.id} label={b.name} />
          ))}
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase">До наступного рангу:</p>
            <p className="text-[10px] font-bold text-orange-400 tracking-tighter uppercase">{500 - (progress.points % 500)} XP LEFT</p>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(progress.points % 500) / 5}%` }}
              className="h-full bg-orange-400 rounded-full"
            />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6">
        <BigButton 
          onClick={() => setView('theory')} 
          icon={BookOpen} 
          label="ТЕОРІЯ" 
          desc="Модуль 01 • 85%" 
          color="bg-white" 
          borderColor="border-emerald-500"
          accentColor="text-emerald-500"
          emoji="📡"
          delay={0.1}
        />
        <div className="grid grid-cols-2 gap-4">
          <SmallButton 
            onClick={() => setView('schemes')} 
            icon={Layers} 
            label="СХЕМИ" 
            color="bg-white" 
            borderColor="border-orange-400"
            emoji="🎭"
            delay={0.2}
          />
          <SmallButton 
            onClick={() => setView('practice')} 
            icon={Zap} 
            label="ПРАКТИКА" 
            color="bg-white" 
            borderColor="border-sky-400"
            emoji="🏗️"
            delay={0.3}
          />
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-emerald-500 rounded-3xl p-8 relative overflow-hidden text-white shadow-xl"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2 uppercase leading-none">СЬОГОДНІШНІЙ ЧЕЛЕНДЖ</h2>
            <p className="text-emerald-100 mb-6 text-sm font-medium">Визнач емоцію за мімікою персонажа!</p>
            <button 
              onClick={() => setView('tests')}
              className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-black text-sm border-b-4 border-slate-300 hover:brightness-95 active:translate-y-1 active:border-b-0 transition-all uppercase tracking-widest"
            >
              ПОЧАТИ ГРУ
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 rotate-12">🕹️</div>
        </motion.div>
      </section>

      <footer className="mt-auto pt-8 pb-12 flex flex-col items-center">
        <div className="bg-white rounded-3xl p-6 border-4 border-emerald-100 flex flex-col items-center relative w-full shadow-sm">
          <div className="absolute -top-10 w-20 h-20 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-md">🧠</div>
          <p className="mt-8 text-center text-sm font-bold text-slate-700 italic leading-relaxed">
            "Ти знав, що перша сигнальна система працює 24/7 і обробляє тисячі сигналів за секунду?"
          </p>
        </div>
      </footer>
    </motion.div>
  );
}

function BadgePill({ label, active }: { label: string, active?: boolean, key?: string }) {
  return (
    <div className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border-2 transition-all ${active ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}>
      {label.toUpperCase()}
    </div>
  );
}

function BigButton({ onClick, icon: Icon, label, desc, color, borderColor, accentColor, emoji, delay }: any) {
  return (
    <motion.button
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      whileTap={{ y: 0 }}
      onClick={onClick}
      className={`w-full ${color} border-b-8 ${borderColor} rounded-3xl p-6 flex flex-col shadow-xl group text-left`}
    >
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className={`text-xl font-black text-slate-800 leading-tight uppercase tracking-tight`}>{label}</h3>
      <p className="text-slate-500 text-[10px] mt-2 font-black uppercase tracking-widest">{desc}</p>
    </motion.button>
  );
}

function SmallButton({ onClick, icon: Icon, label, color, borderColor, emoji, delay }: any) {
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      whileTap={{ y: 0 }}
      onClick={onClick}
      className={`w-full ${color} border-b-8 ${borderColor} rounded-3xl p-6 flex flex-col shadow-lg cursor-pointer transition-all text-left`}
    >
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-lg font-black text-slate-800 leading-tight uppercase tracking-tight">{label}</h3>
    </motion.button>
  );
}

// --- View: Theory ---

function TheoryView({ onBack, progress, setProgress }: any) {
  const modules = [
    { 
      id: 'systems', 
      title: 'Сигнальні системи', 
      icon: Activity, 
      content: 'Сигнальні системи за Павловим — це два рівні відображення дійсності. Перша — спільна з тваринами (відчуття), друга — притаманна лише людині (слово/мова). Це фундамент нашої психіки.',
      points: 20
    },
    { 
      id: 'receptors', 
      title: 'Сенсорні системи', 
      icon: Zap, 
      content: 'Рецептори перетворюють зовнішню енергію (світло, звук) на нервовий імпульс. Існує 5 основних чуттів: зір, слух, нюх, смак та дотик. Це "вхідні двері" для першої сигнальної системи.',
      points: 25
    },
    { 
      id: 'first', 
      title: 'Перша сигнальна система', 
      icon: Eye, 
      content: 'Це сприйняття світу через "образи": кольори, запахи, звуки. Вона дозволяє нам миттєво реагувати на небезпеку або шукати їжу без використання слів.',
      points: 30
    },
    { 
      id: 'limbic', 
      title: 'Лімбічна система', 
      icon: Brain, 
      content: 'Це "емоційний мозок". Таламус сортує сигнали, Гіпокамп зберігає спогади, а Мигдалина генерує страх або задоволення. Саме тут народжуються наші перші реакції.',
      points: 40
    },
    { 
      id: 'emotions', 
      title: 'Емоції та адаптація', 
      icon: User, 
      content: 'Емоції допомагають виживати. Страх змушує тікати від небезпеки, а радість — повторювати корисні дії. Це внутрішній компас нашого організму.',
      points: 25
    },
    { 
      id: 'attention', 
      title: 'Види Уваги', 
      icon: Activity, 
      content: 'Мимовільна (автоматична) увага виникає без зусиль на все нове. Довільна (свідома) потребує волі та концентрації. Післядовільна — коли процес настільки цікавий, що зусилля зникають.',
      points: 35
    },
  ];

  const handleComplete = (m: any) => {
    if (progress.completedModules.includes(m.id)) return;
    
    let newBadges = [...progress.badges];
    const newCompleted = [...progress.completedModules, m.id];
    
    // Check for "Theory Master" badge
    if (newCompleted.length === modules.length && !newBadges.find(b => b.id === 'theory_master')) {
        const badge = BADGES.find(b => b.id === 'theory_master');
        if (badge) newBadges.push(badge);
    }

    setProgress((p: any) => ({ 
      ...p, 
      completedModules: newCompleted, 
      points: p.points + m.points,
      badges: newBadges
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-24"
    >
      <button onClick={onBack} className="mb-6 font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <ChevronRight className="rotate-180" size={16} /> Назад
      </button>
      <h2 className="text-3xl font-black mb-6">Теорія</h2>

      <div className="grid grid-cols-1 gap-4">
        {modules.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white border-b-8 ${progress.completedModules.includes(m.id) ? 'border-emerald-500' : 'border-slate-200'} rounded-3xl p-6 shadow-lg group transition-all`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl border-4 ${progress.completedModules.includes(m.id) ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                <m.icon size={24} />
              </div>
              <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">{m.title}</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">{m.content}</p>
            {!progress.completedModules.includes(m.id) ? (
              <button 
                onClick={() => handleComplete(m)}
                className="w-full bg-emerald-500 border-b-4 border-emerald-700 text-white rounded-2xl py-3 font-black uppercase text-xs tracking-widest shadow-lg active:translate-y-1 active:border-b-0 transition-all"
              >
                ВИВЧЕНО (+{m.points} БАЛІВ)
              </button>
            ) : (
              <div className="text-emerald-500 font-black uppercase text-xs flex items-center gap-2 bg-emerald-50 py-2 px-4 rounded-xl w-fit">
                <CheckCircle size={16} /> ВИВЧЕНО
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// --- View: Schemes ---

function SchemesView({ onBack, addPoints }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-24"
    >
      <button onClick={onBack} className="mb-6 font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <ChevronRight className="rotate-180" size={16} /> Назад
      </button>
      <h2 className="text-3xl font-black mb-2 text-slate-800 uppercase tracking-tight">СХЕМИ</h2>
      <p className="text-sm text-slate-500 font-bold mb-6">Досліджуй центр твоїх емоцій та відчуттів</p>

      <div className="bg-white border-b-8 border-emerald-500 rounded-[40px] p-8 shadow-2xl aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-50/30 pointer-events-none" />
        
        <div className="relative w-48 h-48">
           <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 bg-emerald-400/10 rounded-full blur-3xl"
           />
           <Brain size={192} className="text-slate-800 relative z-10" />
           
           {/* Interactive points */}
           <BrainPoint top="25%" left="35%" label="ЛОБНА ЧАСТКА" desc="Твій командир. Відповідає за складну увагу та планування." />
           <BrainPoint top="45%" left="55%" label="МИГДАЛИНА" desc="Детектор емоцій. Попереджає про небезпеку (страх)." />
           <BrainPoint top="65%" left="40%" label="ТАЛАМУС" desc="Головний сортувальник сигналів від органів чуття." />
        </div>
        
        <div className="mt-12">
            <p className="font-black text-emerald-600 uppercase text-[10px] tracking-[0.2em] animate-pulse">НАТИСНИ НА ТОЧКИ</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
          <SenseCard icon={Eye} label="Зоровий нерв" desc="Передає 80% інформації до мозку." color="bg-[#60A5FA]" />
          <SenseCard icon={Zap} label="Рецептори" desc="Швидка реакція на дотик та біль." color="bg-[#FBBF24]" />
          <SenseCard icon={Activity} label="Вухо" desc="Сприймає механічні коливання звуку." color="bg-[#FF6321]" />
          <SenseCard icon={User} label="Смак/Нюх" desc="Хімічний аналіз їжі та повітря." color="bg-[#4ADE80]" />
      </div>
    </motion.div>
  );
}

function BrainPoint({ top, left, label, desc }: { top: string, left: string, label: string, desc: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className="absolute" style={{ top, left }}>
       <motion.button 
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setActive(!active)}
        className="w-6 h-6 bg-emerald-500 border-2 border-white rounded-full shadow-lg z-20 flex items-center justify-center ring-4 ring-emerald-500/20" 
       >
         <div className="w-1.5 h-1.5 bg-white rounded-full" />
       </motion.button>
       <AnimatePresence>
         {active && (
           <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-slate-800 text-white p-4 rounded-2xl text-[11px] z-30 shadow-2xl border-b-4 border-slate-900"
           >
             <p className="font-black uppercase mb-1 text-emerald-400 tracking-tight">{label}</p>
             <p className="opacity-90 leading-relaxed font-medium">{desc}</p>
             <div className="absolute top-full left-1/2 -translate-x-1/2 border-[12px] border-transparent border-t-slate-800" />
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}

function SenseCard({ icon: Icon, label, desc, color }: any) {
    const [active, setActive] = useState(false);
    return (
        <motion.button 
            whileHover={{ y: -4 }}
            onClick={() => setActive(!active)}
            className="bg-white border-b-8 border-slate-100 p-4 rounded-3xl flex flex-col items-center gap-2 shadow-lg text-center h-full active:translate-y-1 active:border-b-0 transition-all"
        >
            <div className={`p-3 rounded-2xl ${color} bg-opacity-20 border-2 border-current text-slate-700`}>
                <Icon size={24} />
            </div>
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-800">{label}</span>
            <AnimatePresence>
                {active && (
                    <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] font-bold text-slate-400 leading-tight mt-1 overflow-hidden"
                    >
                        {desc}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

// --- View: Practice ---

function PracticeView({ onBack, addPoints }: any) {
  const tasks = [
    {
      q: "Ти бачиш яскраву вивіску вночі і автоматично переводиш погляд. Яка це увага?",
      a: ["Довільна (свідома)", "Мимовільна (автоматична)", "Післядовільна"],
      correct: 1,
      expl: "Мимовільна увага — це реакція на новий або сильний подразник (світло, звук)."
    },
    {
      q: "Який орган чуття НЕ відноситься до першої сигнальної системи?",
      a: ["Очі (зір)", "Шкурові рецептори", "Сприйняття мови"],
      correct: 2,
      expl: "Слова та мова — це символи, вони складають ДРУГУ сигнальну систему."
    },
    {
      q: "Реакція організму на неочікуваний шум:",
      a: ["Орієнтувальний рефлекс", "Складне мислення", "Забування"],
      correct: 0,
      expl: "Орієнтувальний рефлекс (\"Що таке?\") — основа мимовільної уваги."
    },
    {
      q: "Ти настільки захопився комп’ютерною грою, що перестав помічати зусилля для концентрації. Це:",
      a: ["Мимовільна увага", "Післядовільна увага", "Розсіяність"],
      correct: 1,
      expl: "Післядовільна увага виникає, коли діяльність стає цікавою і не потребує вольових зусиль."
    },
    {
      q: "Лимон викликає виділення слини навіть якщо ти просто його бачиш. Це робота:",
      a: ["Тільки 2-ї системи", "1-ї сигнальної системи", "Лімбічної пам’яті"],
      correct: 1,
      expl: "Зоровий образ (лимон) є сигналом для першої сигнальної системи, що запускає фізіологічну реакцію."
    }
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const handleNext = () => {
    setCurrent((current + 1) % tasks.length);
    setSelected(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-24"
    >
      <button onClick={onBack} className="mb-6 font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <ChevronRight className="rotate-180" size={16} /> Назад
      </button>
      <h2 className="text-3xl font-black mb-6 text-slate-800 uppercase tracking-tight">ПРАКТИКА</h2>
      
      <div className="bg-white border-b-8 border-slate-200 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
            <Zap size={96} fill="#64748b" />
        </div>

        <span className="text-orange-500 font-black uppercase text-[10px] tracking-[0.2em] mb-4 block">КЕЙС №{current + 1}</span>
        <h3 className="text-xl font-black mb-8 leading-snug text-slate-800">
            {tasks[current].q}
        </h3>
        
        <div className="flex flex-col gap-4 relative z-10">
          {tasks[current].a.map((opt, i) => (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => {
                setSelected(i);
                if (i === tasks[current].correct) addPoints(15);
              }}
              className={`text-left p-5 rounded-2xl border-b-4 font-black text-sm transition-all shadow-md ${
                selected === null ? 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:border-slate-300 active:translate-y-1 active:border-b-0' : 
                i === tasks[current].correct ? 'border-emerald-600 bg-emerald-500 text-white shadow-emerald-200' :
                selected === i ? 'border-orange-600 bg-orange-400 text-white opacity-90 shadow-orange-200' : 'border-slate-50 bg-slate-50 opacity-30 scale-95'
              }`}
            >
              <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center font-black ${selected === i ? 'bg-white text-current' : 'bg-white text-slate-400 border-slate-200'}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-8 pt-8 border-t-2 border-dashed border-slate-100"
            >
               <div className={`p-6 rounded-2xl mb-8 ${selected === tasks[current].correct ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                   <p className="font-black uppercase text-[10px] tracking-widest mb-2">
                       {selected === tasks[current].correct ? "Чудово!" : "Будь уважнішим"}
                   </p>
                   <p className="text-sm font-bold leading-relaxed">
                     {tasks[current].expl}
                   </p>
               </div>
               <button 
                onClick={handleNext}
                className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-900 active:translate-y-1 transition-all"
               >
                 НАСТУПНА ЗАДАЧА
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- View: Tests ---

function TestsView({ onBack, addPoints }: any) {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);

  const questions = [
    { q: "Хто створив вчення про дві сигнальні системи?", a: ["Чарльз Дарвін", "Іван Павлов", "Зігмунд Фройд"], correct: 1 },
    { q: "Який орган мозку є головним 'центром емоцій'?", a: ["Мозочок", "Мигдалина", "Кора великих півкуль"], correct: 1 },
    { q: "Сферою якої системи є абстрактне мислення?", a: ["Першої", "Другої", "Обох однаково"], correct: 1 },
    { q: "Яка увага виникає при читанні цікавої книги?", a: ["Довільна", "Мимовільна", "Післядовільна"], correct: 2 },
    { q: "Де сортуються всі сенсорні сигнали, крім нюхових?", a: ["Таламус", "Гіпокамп", "Спинний мозок"], correct: 0 },
  ];

  const handleAnswer = (idx: number) => {
    setSelectedAns(idx);
    if (idx === questions[currentQ].correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedAns(null);
    } else {
      setFinished(true);
      if (score >= 4) addPoints(100);
    }
  };

  if (!testStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-6 pb-24"
      >
        <button onClick={onBack} className="mb-6 font-black uppercase text-xs tracking-widest flex items-center gap-2">
          <ChevronRight className="rotate-180" size={16} /> Назад
        </button>
        <h2 className="text-3xl font-black mb-6 text-slate-800 uppercase tracking-tight">ТЕСТИ</h2>
        <div className="bg-white border-b-8 border-emerald-500 rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-50/50 pointer-events-none" />
          <div className="bg-white p-6 rounded-3xl border-b-4 border-slate-200 mb-8 shadow-xl relative z-10">
              <Activity className="text-emerald-500" size={64} />
          </div>
          <h3 className="text-2xl font-black mb-3 text-slate-800 uppercase relative z-10">ПІДСУМКОВИЙ ІСПИТ</h3>
          <p className="text-xs font-bold text-slate-400 mb-10 uppercase tracking-[0.2em] relative z-10">
              5 ПИТАНЬ • +100 БАЛІВ
          </p>
          <button 
            onClick={() => setTestStarted(true)}
            className="w-full bg-emerald-500 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 hover:bg-emerald-600 active:translate-y-1 active:border-b-0 transition-all relative z-10 border-b-4 border-emerald-700"
          >
              ПОЧАТИ ШТУРМ
          </button>
        </div>
      </motion.div>
    );
  }

  if (finished) {
    return (
      <motion.div className="p-6 text-center">
        <h2 className="text-4xl font-black mb-4 uppercase mt-10">Результат</h2>
        <div className="bg-white border-b-8 border-emerald-500 rounded-3xl p-10 shadow-2xl mb-8">
          <div className="text-6xl mb-4">{score >= 4 ? '🏆' : '📚'}</div>
          <h3 className="text-3xl font-black">{score}/{questions.length}</h3>
          <p className="text-slate-500 font-bold mt-2">
            {score >= 4 ? 'Неймовірно! Ти справжній нейро-експерт!' : 'Непогано, але теорію варто підтягнути.'}
          </p>
          {score >= 4 && <p className="text-emerald-500 font-black mt-4">+100 БАЛІВ ТВОЇ!</p>}
        </div>
        <button 
          onClick={onBack}
          className="w-full bg-slate-800 text-white py-5 rounded-3xl font-black uppercase tracking-widest"
        >
          ПОВЕРНУТИСЬ
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <span className="font-black text-xs uppercase tracking-widest text-slate-400">Питання {currentQ + 1}/{questions.length}</span>
        <div className="w-1/2 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
      </div>
      
      <div className="bg-white border-b-8 border-slate-200 rounded-3xl p-8 shadow-xl mb-6">
        <h3 className="text-xl font-black text-slate-800 mb-8">{questions[currentQ].q}</h3>
        <div className="flex flex-col gap-4">
          {questions[currentQ].a.map((ans, i) => (
            <button
              key={i}
              disabled={selectedAns !== null}
              onClick={() => handleAnswer(i)}
              className={`p-5 rounded-2xl border-b-4 font-black text-sm text-left transition-all ${
                selectedAns === null ? 'bg-slate-50 border-slate-100 hover:bg-slate-100' :
                i === questions[currentQ].correct ? 'bg-emerald-500 border-emerald-700 text-white' :
                selectedAns === i ? 'bg-orange-400 border-orange-600 text-white' : 'bg-slate-50 opacity-40'
              }`}
            >
              {ans}
            </button>
          ))}
        </div>
      </div>

      {selectedAns !== null && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextQuestion}
          className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl"
        >
          {currentQ === questions.length - 1 ? 'ФІНІШ' : 'ДАЛІ'}
        </motion.button>
      )}
    </motion.div>
  );
}

// --- View: Achievements ---

function AchievementsView({ onBack, progress }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-24"
    >
      <button onClick={onBack} className="mb-6 font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <ChevronRight className="rotate-180" size={16} /> Назад
      </button>
      <h2 className="text-3xl font-black mb-6 text-slate-800 uppercase tracking-tight">ПРОГРЕС</h2>
      
      <div className="bg-white border-b-8 border-slate-200 rounded-[32px] p-8 shadow-2xl mb-10 overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
              <span className="font-black uppercase text-[10px] tracking-[0.2em] text-orange-500 mb-1">Твій ранг</span>
              <span className="text-2xl font-black text-slate-800 uppercase tracking-tight">{progress.level}</span>
          </div>
          <div className="w-20 h-20 bg-yellow-400 rounded-3xl border-b-4 border-yellow-600 flex items-center justify-center shadow-xl">
              <Star fill="#white" className="text-white" size={40} />
          </div>
        </div>

        <div className="h-4 bg-slate-100 rounded-full border border-slate-200 overflow-hidden p-0.5 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((progress.points / 500) * 100, 100)}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
          <span>0 XP</span>
          <span>{Math.max(0, 500 - progress.points)} XP ДО НОВОГО РАНГУ</span>
        </div>
      </div>

      <h3 className="font-black text-xl mb-8 uppercase tracking-tight text-slate-800">Твої Бейджі</h3>
      <div className="grid grid-cols-1 gap-4">
        {BADGES.map((badge: any) => {
          const isUnlocked = progress.badges.find((b: any) => b.id === badge.id);
          return (
            <motion.div 
              key={badge.id} 
              whileHover={isUnlocked ? { x: 4 } : {}}
              className={`flex items-center gap-6 p-6 rounded-3xl border-b-4 transition-all ${isUnlocked ? 'bg-white border-emerald-500 shadow-xl' : 'bg-slate-50 border-slate-100 grayscale opacity-40 shadow-none'}`}
            >
              <div className={`w-16 h-16 shrink-0 rounded-2xl border-b-4 flex items-center justify-center shadow-md ${isUnlocked ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-slate-200 border-slate-300 text-slate-400'}`}>
                {badge.icon === 'Brain' && <Brain size={32} />}
                {badge.icon === 'BookOpen' && <BookOpen size={32} />}
                {badge.icon === 'Trophy' && <Award size={32} />}
              </div>
              <div className="text-left">
                <h4 className="font-black text-sm uppercase mb-1 tracking-tight text-slate-800">{badge.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">{badge.description}</p>
              </div>
              {isUnlocked && <CheckCircle size={24} className="ml-auto text-emerald-500" />}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
