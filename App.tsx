
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { INITIAL_APPS, STORE_GAMES } from './constants';
import { GameApp, StoreGame, DownloadTask, Language } from './types';
import { getGeminiRecommendation } from './services/gemini';

// --- LOCALIZATION ---
const TRANSLATIONS = {
  EN: {
    welcome: "Welcome",
    neuralSync: "Neural Sync Established",
    initWorkspace: "Initializing Your Personal Workspace",
    confirm: "Confirm",
    back: "Back",
    execute: "Execute",
    stats: "Neural Stats",
    market: "Gemini Market",
    transfers: "Neural Transmits",
    config: "Station Config",
    archives: "Station Archives",
    assist: "Gemini Assist",
    readyAuth: "SYSTEM: READY TO AUTHENTICATE.",
    enterName: "ENTER NAME...",
    launchEntity: "Launch Entity",
    abort: "Abort",
    settings: "Settings",
    language: "Language",
    neuralLink: "Neural Link",
    visuals: "Visual Output",
    close: "Close",
    synced: "Synced",
    metadata: "Metadata",
    station: "GeminiStation",
    switchAccount: "Switch Account",
    changeAvatar: "Change Avatar",
    powerOff: "Power Off",
    shuttingDown: "Shutting Down Neural Link...",
    profile: "Entity Profile"
  },
  RU: {
    welcome: "Добро пожаловать",
    neuralSync: "Нейронная связь установлена",
    initWorkspace: "Инициализация персонального пространства",
    confirm: "Подтвердить",
    back: "Назад",
    execute: "Запуск",
    stats: "Статистика",
    market: "Рынок Gemini",
    transfers: "Передача данных",
    config: "Настройки",
    archives: "Архивы станции",
    assist: "Ассистент Gemini",
    readyAuth: "СИСТЕМА: ГОТОВА К АВТОРИЗАЦИИ.",
    enterName: "ВВЕДИТЕ ИМЯ...",
    launchEntity: "Запустить сущность",
    abort: "Отмена",
    settings: "Настройки",
    language: "Язык",
    neuralLink: "Нейролинк",
    visuals: "Видеовыход",
    close: "Закрыть",
    synced: "Синхронизировано",
    metadata: "Метаданные",
    station: "GeminiStation",
    switchAccount: "Сменить аккаунт",
    changeAvatar: "Сменить аватар",
    powerOff: "Выключить консоль",
    shuttingDown: "Завершение нейросвязи...",
    profile: "Профиль сущности"
  }
};

// --- POWER OFF SCREEN ---
const PowerOffScreen: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center animate-in fade-in duration-1000">
      <div className="text-6xl mb-8 animate-pulse opacity-50">💎</div>
      <div className="text-white font-black uppercase tracking-[0.5em] text-xs animate-pulse italic">
        {t.shuttingDown}
      </div>
    </div>
  );
};

// --- OS SPLASH SCREEN ---
const SplashScreen: React.FC<{ onComplete: () => void, lang: Language }> = ({ onComplete, lang }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const t = TRANSLATIONS[lang];
  
  const logMessages = [
    "KERNEL: Initializing GeminiStation Kernel 5.0.4...",
    "BIOS: Checking neural core health... [OK]",
    "MEMORY: Allocating 128TB neural buffers...",
    "STORAGE: Mounting 'GeminiStation' partitions...",
    "NET: Handshaking with satellite node 0x7F...",
    "UI: Loading station shaders and textures...",
    t.readyAuth
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < logMessages.length) {
        setLogs(prev => [...prev, logMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(onComplete, 800);
        }, 1200);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center p-12 font-mono transition-opacity duration-1000 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative mb-16 group">
        <div className="text-9xl filter drop-shadow-[0_0_50px_rgba(59,130,246,0.9)] animate-pulse">💎</div>
        <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full animate-ping opacity-20" />
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black italic tracking-widest text-white uppercase mb-2 animate-in slide-in-from-bottom-4 duration-1000">GeminiStation</h1>
        <div className="h-0.5 w-48 bg-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(37,99,235,1)]" />
      </div>

      <div className="w-full max-w-xl h-48 overflow-hidden bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
        <div className="space-y-1.5 overflow-y-auto max-h-full no-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className="text-blue-400 text-[10px] uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-300">
              <span className="text-white/20 mr-3">[{new Date().toLocaleTimeString()}]</span> {log}
            </div>
          ))}
          {logs.length < logMessages.length && (
            <div className="w-1.5 h-3 bg-blue-500 animate-pulse inline-block" />
          )}
        </div>
      </div>
    </div>
  );
};

// --- WELCOME ANIMATION ---
const WelcomeAnimation: React.FC<{ user: string; onComplete: () => void, lang: Language }> = ({ user, onComplete, lang }) => {
  const t = TRANSLATIONS[lang];
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-1000">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,transparent_70%)] opacity-40 animate-pulse" />
      
      <div className="z-10 text-center space-y-10 px-8">
        <div className="flex flex-col items-center">
          <div className="text-blue-500 font-black uppercase tracking-[2em] text-[10px] mb-6 animate-in zoom-in-150 fade-in duration-1000">{t.neuralSync}</div>
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
        </div>
        
        <h2 className="text-8xl font-black italic uppercase tracking-tighter text-white animate-in slide-in-from-bottom-12 duration-1000 delay-300">
          {t.welcome}, <span className="text-blue-500 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">{user}</span>
        </h2>
        
        <div className="max-w-md mx-auto">
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.8em] mb-4">{t.initWorkspace}</p>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,1)] animate-[welcome-progress_3.5s_cubic-bezier(0.65,0,0.35,1)_forwards]" />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes welcome-progress {
          0% { width: 0% }
          100% { width: 100% }
        }
      `}</style>
    </div>
  );
};

// --- SETTINGS OVERLAY ---
const SettingsOverlay: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  lang: Language; 
  setLang: (l: Language) => void 
}> = ({ isOpen, onClose, lang, setLang }) => {
  const t = TRANSLATIONS[lang];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] bg-black/95 backdrop-blur-3xl p-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-5xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-24">
          <div className="flex items-center gap-8">
            <div className="text-6xl text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">⚙️</div>
            <div>
              <h2 className="text-7xl font-black italic tracking-tighter uppercase text-white">{t.settings}</h2>
              <p className="text-blue-500 font-bold uppercase tracking-[0.8em] text-[10px] mt-2">Station Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="px-14 py-6 bg-white text-black font-black uppercase text-xs rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl">{t.close}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1 overflow-y-auto pr-8 no-scrollbar">
          <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:bg-white/10 transition-all group">
            <h3 className="text-blue-500 font-black uppercase tracking-[0.5em] text-[11px] mb-10">{t.language}</h3>
            <div className="flex gap-6">
              {(['EN', 'RU'] as Language[]).map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-8 rounded-3xl font-black text-2xl transition-all ${lang === l ? 'bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  {l === 'EN' ? 'English' : 'Русский'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] flex flex-col justify-between opacity-50 cursor-not-allowed">
             <div>
               <h3 className="text-blue-500 font-black uppercase tracking-[0.5em] text-[11px] mb-10">{t.neuralLink}</h3>
               <p className="text-white/30 text-sm">Enhanced synchronization for low-latency neural feedback.</p>
             </div>
             <div className="flex items-center justify-between mt-8">
                <span className="font-black text-white/40 uppercase tracking-widest text-xs">Offline Only</span>
                <div className="w-16 h-8 bg-white/10 rounded-full flex items-center px-1">
                  <div className="w-6 h-6 bg-white/20 rounded-full" />
                </div>
             </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] col-span-1 md:col-span-2">
            <h3 className="text-blue-500 font-black uppercase tracking-[0.5em] text-[11px] mb-10">System Identity</h3>
            <div className="flex items-center gap-12">
               <div className="w-24 h-24 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-4xl">🤖</div>
               <div>
                  <div className="text-white text-3xl font-black italic uppercase">GeminiStation v5.0</div>
                  <div className="text-white/20 text-xs mt-2 uppercase tracking-widest">Build Identifier: GS-KERNEL-2025-FLASH</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PROFILE MENU OVERLAY ---
const ProfileMenuOverlay: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  user: string,
  avatar: string,
  onSwitchAccount: () => void,
  onPowerOff: () => void,
  onChangeAvatar: () => void,
  lang: Language
}> = ({ isOpen, onClose, user, avatar, onSwitchAccount, onPowerOff, onChangeAvatar, lang }) => {
  const t = TRANSLATIONS[lang];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] bg-black/60 backdrop-blur-sm flex justify-end p-12 animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full max-w-sm bg-zinc-900/90 border border-white/10 rounded-[4rem] p-12 h-fit mt-16 animate-in slide-in-from-right-10 duration-500 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-12">
          <div className="w-32 h-32 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-5xl mb-6 shadow-2xl border-4 border-white/10 transition-transform hover:scale-105">
            {avatar}
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">{user}</h2>
          <p className="text-blue-500 font-bold uppercase tracking-[0.5em] text-[9px] mt-2">{t.profile}</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onSwitchAccount}
            className="w-full p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl flex items-center gap-6 transition-all group"
          >
            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">👥</span>
            <span className="font-black uppercase tracking-widest text-xs text-white/80">{t.switchAccount}</span>
          </button>
          <button 
            onClick={onChangeAvatar}
            className="w-full p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl flex items-center gap-6 transition-all group"
          >
            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🎨</span>
            <span className="font-black uppercase tracking-widest text-xs text-white/80">{t.changeAvatar}</span>
          </button>
          <div className="h-px w-full bg-white/10 my-6" />
          <button 
            onClick={onPowerOff}
            className="w-full p-6 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-3xl flex items-center gap-6 transition-all group shadow-xl"
          >
            <span className="text-2xl transition-all">⚡</span>
            <span className="font-black uppercase tracking-widest text-xs">{t.powerOff}</span>
          </button>
        </div>

        <button onClick={onClose} className="w-full mt-10 py-3 text-white/20 hover:text-white uppercase font-black text-[10px] tracking-[0.5em] underline underline-offset-8 transition-all">
          {t.close}
        </button>
      </div>
    </div>
  );
};

// --- MINI GAME ENGINE ---
const GameEngine: React.FC<{ gameId: string; onExit: () => void }> = ({ gameId, onExit }) => {
  const [gameState, setGameState] = useState<'playing' | 'over'>('playing');
  const [score, setScore] = useState(0);
  const [renderEntities, setRenderEntities] = useState<{ id: number; x: number; y: number; type: string }[]>([]);
  const [playerX, setPlayerX] = useState(50);

  const requestRef = useRef<number>(null);
  const scoreRef = useRef(0);
  const posRef = useRef(50);
  const entitiesRef = useRef<{ id: number; x: number; y: number; type: string }[]>([]);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (gameState === 'over') return;

    const tick = (time: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = time;
      const deltaTime = Math.min(time - lastUpdateRef.current, 32);
      lastUpdateRef.current = time;

      const speedMultiplier = gameId === 'stellar-voyager' ? 0.03 : 0.04;
      const movement = speedMultiplier * deltaTime;

      entitiesRef.current = entitiesRef.current
        .map(e => ({ ...e, y: e.y + movement }))
        .filter(e => e.y < 120);
      
      if (Math.random() > 0.95) {
        entitiesRef.current.push({ 
          id: Date.now() + Math.random(), 
          x: Math.random() * 85 + 7.5, 
          y: -10, 
          type: (gameId === 'gta5' || gameId.includes('gta')) ? (Math.random() > 0.7 ? 'money' : 'police') : 'obstacle' 
        });
      }

      const hit = entitiesRef.current.find(e => {
        const dx = e.x - posRef.current;
        const dy = e.y - 80;
        return Math.sqrt(dx * dx + dy * dy) < 9;
      });

      if (hit) {
        if (hit.type === 'money') {
          scoreRef.current += 1500;
          entitiesRef.current = entitiesRef.current.filter(e => e.id !== hit.id);
        } else {
          setGameState('over');
          return;
        }
      }

      setRenderEntities([...entitiesRef.current]);
      setPlayerX(posRef.current);
      scoreRef.current += (deltaTime / 5);
      setScore(Math.floor(scoreRef.current));

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameState, gameId]);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      const step = 15;
      if (e.key === 'ArrowLeft') posRef.current = Math.max(5, posRef.current - step);
      if (e.key === 'ArrowRight') posRef.current = Math.min(95, posRef.current + step);
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [onExit]);

  const theme = useMemo(() => {
    const id = gameId.toLowerCase();
    if (id === 'gta5' || id.includes('gta')) return { bg: 'bg-stone-900', accent: 'green-500', player: '🚗', enemy: '🚓', title: 'GTA: GEMINI' };
    switch(id) {
      case 'cyberpunk-neon': return { bg: 'bg-slate-950', accent: 'pink-500', player: '🏎️', enemy: '🚧', title: 'NEON DRIFT' };
      case 'stellar-voyager': return { bg: 'bg-black', accent: 'cyan-400', player: '🚀', enemy: '☄️', title: 'STELLAR VOYAGER' };
      default: return { bg: 'bg-slate-900', accent: 'blue-500', player: '🕹️', enemy: '👾', title: 'STATION PILOT' };
    }
  }, [gameId]);

  return (
    <div className={`fixed inset-0 z-[4000] ${theme.bg} flex items-center justify-center font-mono overflow-hidden`}>
      <div className="relative w-full max-w-lg h-[85vh] border-x border-white/10 bg-black/60 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-10 left-10 z-10 bg-black/90 p-5 rounded-2xl border border-white/10">
          <div className={`text-${theme.accent} font-black text-[10px] tracking-widest mb-1 uppercase`}>{theme.title}</div>
          <div className="text-white text-5xl font-bold tabular-nums">${score.toLocaleString()}</div>
        </div>
        {renderEntities.map(e => (
          <div key={e.id} className="absolute text-5xl transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
            {e.type === 'money' ? '💵' : theme.enemy}
          </div>
        ))}
        <div className="absolute text-7xl transform -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_40px_rgba(255,255,255,0.8)]" style={{ left: `${playerX}%`, top: `80%` }}>
          {theme.player}
        </div>
        {gameState === 'over' && (
          <div className="absolute inset-0 bg-black/98 flex flex-col items-center justify-center p-12 text-center z-50 animate-in fade-in zoom-in-95">
            <h2 className={`text-7xl font-black mb-4 text-${theme.accent} italic uppercase tracking-tighter`}>Signal Lost</h2>
            <div className="text-5xl font-bold mb-16 tabular-nums">${score}</div>
            <button onClick={() => { scoreRef.current = 0; entitiesRef.current = []; posRef.current = 50; setGameState('playing'); }} className="w-full py-6 bg-white text-black font-black uppercase rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl">Re-Link</button>
            <button onClick={onExit} className="mt-10 text-white/30 hover:text-white uppercase text-xs font-black tracking-[0.5em] underline underline-offset-8">Abort Game</button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- DOWNLOADS & STORE OVERLAYS ---
const DownloadsOverlay: React.FC<{ isOpen: boolean; onClose: () => void; downloads: DownloadTask[]; lang: Language }> = ({ isOpen, onClose, downloads, lang }) => {
  const t = TRANSLATIONS[lang];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1500] bg-black/98 backdrop-blur-3xl animate-in fade-in slide-in-from-right-20 duration-500 p-16 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-20">
          <h2 className="text-7xl font-black italic tracking-tighter uppercase text-white">{t.transfers}</h2>
          <button onClick={onClose} className="px-12 py-5 bg-white/10 text-white font-black uppercase text-xs rounded-full border border-white/10 hover:bg-white/20 transition-all">{t.close}</button>
        </div>
        <div className="space-y-8">
          {downloads.length === 0 ? (
            <div className="py-32 text-center text-white/10 font-black uppercase tracking-[0.8em] italic">Buffer Empty</div>
          ) : (
            downloads.map(task => (
              <div key={task.id} className="bg-white/5 border border-white/5 p-10 rounded-[3rem] flex items-center gap-10">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-4xl">{task.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{task.title}</h3>
                    <span className="text-blue-400 font-black text-xs uppercase">{task.status === 'completed' ? t.synced : `${task.progress}%`}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full transition-all duration-300 ${task.status === 'completed' ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]' : 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]'}`} style={{ width: `${task.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StoreOverlay: React.FC<{ isOpen: boolean; onClose: () => void; onStartDownload: (game: StoreGame) => void; storeGames: StoreGame[]; lang: Language }> = ({ isOpen, onClose, onStartDownload, storeGames, lang }) => {
  const t = TRANSLATIONS[lang];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1500] bg-black animate-in fade-in slide-in-from-bottom-20 p-16 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-24">
          <div>
            <h2 className="text-8xl font-black italic tracking-tighter uppercase text-blue-500">{t.market}</h2>
            <p className="text-white/40 font-bold uppercase tracking-[0.8em] text-[10px] mt-2">Neural Acquisition Link</p>
          </div>
          <button onClick={onClose} className="px-14 py-5 bg-white text-black font-black uppercase text-xs rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-2xl">{t.abort}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {storeGames.map(game => (
            <div key={game.id} className="bg-white/5 rounded-[3rem] overflow-hidden group border border-white/5 hover:border-blue-500/50 transition-all p-1">
              <div className="h-64 relative overflow-hidden rounded-[2.8rem]">
                <img src={game.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-8 left-8 font-black text-3xl italic uppercase tracking-tighter">{game.title}</div>
              </div>
              <div className="p-8">
                {game.status === 'downloading' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black text-blue-400 uppercase tracking-widest"><span>Syncing Core...</span><span>{game.progress}%</span></div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${game.progress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => game.status === 'buy' && onStartDownload(game)}
                    className={`w-full py-5 rounded-[1.5rem] font-black uppercase text-[12px] tracking-widest transition-all ${game.status === 'installed' ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}
                  >
                    {game.status === 'buy' ? (game.price === 'FREE' ? 'Initialize' : `Sync ${game.price}`) : game.status === 'installed' ? t.synced : 'Ready'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- LOGIN SCREEN ---
const LoginScreen: React.FC<{ onLogin: (user: string) => void, lang: Language }> = ({ onLogin, lang }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [nickname, setNickname] = useState('');
  const t = TRANSLATIONS[lang];

  const handleCreateConfirm = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (nickname.trim()) {
      onLogin(nickname.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_100%)] opacity-40 pointer-events-none" />
      
      <div className="mb-24 flex flex-col items-center text-center">
        <div className="text-9xl mb-8 filter drop-shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-transform hover:scale-110 duration-500">💎</div>
        <h1 className="text-7xl font-black italic tracking-tighter uppercase mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">{t.station}</h1>
        <p className="text-blue-500 font-bold uppercase tracking-[1.2em] text-[10px] ml-[1.2em]">Neural Authentication</p>
      </div>
      
      {!isCreating ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl w-full animate-in zoom-in-95 duration-500">
          <button onClick={() => onLogin('Station Admin')} className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/50 p-14 rounded-[4rem] transition-all flex flex-col items-center shadow-2xl">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 mb-8 shadow-2xl group-hover:scale-110 transition-transform flex items-center justify-center text-5xl font-black text-white/50">SA</div>
            <span className="text-lg font-black uppercase tracking-[0.4em] group-hover:text-blue-400 transition-colors">Admin Sync</span>
          </button>

          <button onClick={() => setIsCreating(true)} className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-green-500/50 p-14 rounded-[4rem] transition-all flex flex-col items-center shadow-2xl">
            <div className="w-36 h-36 rounded-full bg-white/5 border-2 border-dashed border-white/20 mb-8 flex items-center justify-center text-5xl group-hover:rotate-180 transition-transform duration-1000 text-white/30">+</div>
            <span className="text-lg font-black uppercase tracking-[0.4em] group-hover:text-green-400 transition-colors">New Entity</span>
          </button>

          <button onClick={() => onLogin('Guest Agent')} className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-14 rounded-[4rem] transition-all flex flex-col items-center shadow-2xl">
            <div className="w-36 h-36 rounded-full bg-white/5 border border-white/10 mb-8 flex items-center justify-center text-5xl">👤</div>
            <span className="text-lg font-black uppercase tracking-[0.4em] opacity-50 group-hover:opacity-100 transition-opacity">Guest Node</span>
          </button>
        </div>
      ) : (
        <div className="max-w-md w-full animate-in slide-in-from-bottom-20 duration-500">
          <form onSubmit={handleCreateConfirm} className="bg-neutral-900/40 border border-white/10 p-14 rounded-[5rem] backdrop-blur-3xl shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black uppercase tracking-[0.4em] text-white italic">Create Profile</h2>
              <p className="text-[9px] font-bold uppercase tracking-[0.6em] text-blue-500 mt-2">Neural OS v5.0</p>
            </div>
            <div className="mb-12">
              <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-5">Neural Alias</label>
              <input 
                autoFocus
                type="text"
                maxLength={16}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t.enterName}
                className="w-full bg-black/40 border-b-2 border-white/10 p-6 text-3xl outline-none focus:border-blue-500 transition-all font-light tracking-[0.2em] uppercase text-white"
              />
            </div>
            <div className="flex flex-col gap-6">
              <button 
                type="submit"
                disabled={!nickname.trim()}
                className="w-full py-7 bg-blue-600 text-white font-black uppercase tracking-[0.5em] text-xs rounded-2xl hover:bg-blue-500 disabled:opacity-20 shadow-2xl active:scale-95 transition-all"
              >
                {t.launchEntity}
              </button>
              <button type="button" onClick={() => setIsCreating(false)} className="w-full py-2 text-white/20 font-black uppercase tracking-[0.6em] text-[10px] hover:text-white transition-all underline underline-offset-8">{t.abort}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('RU');
  const [apps, setApps] = useState<GameApp[]>(INITIAL_APPS);
  const [storeGames, setStoreGames] = useState<StoreGame[]>(STORE_GAMES);
  const [downloads, setDownloads] = useState<DownloadTask[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [time, setTime] = useState('');
  const [user, setUser] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string>('👤');
  const [appState, setAppState] = useState<'splash' | 'login' | 'welcome' | 'dashboard' | 'power-off'>('splash');
  const [overlay, setOverlay] = useState<'none' | 'ai' | 'store' | 'library' | 'game' | 'downloads' | 'settings' | 'profile-menu'>('none');
  const [activeGameId, setActiveGameId] = useState<string>('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedApp = apps[selectedIdx];
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  // Sync localized titles for standard apps
  useEffect(() => {
     setApps(prev => prev.map(a => {
        if (a.id === 'store') return { ...a, title: t.market };
        if (a.id === 'downloads') return { ...a, title: t.transfers };
        if (a.id === 'settings') return { ...a, title: t.config };
        if (a.id === 'library') return { ...a, title: t.archives };
        if (a.id === 'gemini-assistant') return { ...a, title: t.assist };
        return a;
     }));
  }, [lang, t]);

  // System downloads logic
  useEffect(() => {
    const timer = setInterval(() => {
      setDownloads(prev => {
        let changed = false;
        const next = prev.map(task => {
          if (task.status === 'active' && task.progress < 100) {
            changed = true;
            const newProgress = Math.min(task.progress + 6, 100);
            return { ...task, progress: newProgress, status: newProgress === 100 ? 'completed' : 'active' } as DownloadTask;
          }
          return task;
        });
        return changed ? next : prev;
      });

      setStoreGames(prev => {
        let changed = false;
        const next = prev.map(game => {
          if (game.status === 'downloading' && game.progress < 100) {
            changed = true;
            const newProgress = Math.min(game.progress + 6, 100);
            if (newProgress === 100) {
              handleAppInstallation(game);
              return { ...game, progress: 100, status: 'installed' };
            }
            return { ...game, progress: newProgress };
          }
          return game;
        });
        return changed ? next : prev;
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  const handleAppInstallation = (game: StoreGame) => {
    setApps(prev => {
      if (prev.find(a => a.id === game.id)) return prev;
      return [...prev, {
        id: game.id,
        title: game.title,
        subtitle: 'Neural Archive Link',
        icon: game.id === 'geministation-core' ? '💎' : '🎮',
        background: game.cover,
        description: game.description,
        type: game.id === 'geministation-core' ? 'system' : 'game',
        color: game.id === 'geministation-core' ? 'from-blue-700 to-indigo-950' : 'from-zinc-900 to-black',
        isInstalled: true
      }];
    });
  };

  const startDownload = (game: StoreGame) => {
    setStoreGames(prev => prev.map(g => g.id === game.id ? { ...g, status: 'downloading', progress: 0 } : g));
    setDownloads(prev => [...prev, { id: game.id, title: game.title, progress: 0, status: 'active', icon: game.id === 'geministation-core' ? '💎' : '🎮' }]);
  };

  const handleAction = useCallback((id: string) => {
    if (overlay !== 'none') return;
    if (id === 'store') setOverlay('store');
    else if (id === 'downloads') setOverlay('downloads');
    else if (id === 'settings') setOverlay('settings');
    else if (id === 'gemini-assistant') setOverlay('ai');
    else if (id === 'library') setOverlay('library');
    else {
      const app = apps.find(a => a.id === id);
      if (app?.type === 'game') {
        setActiveGameId(id);
        setOverlay('game');
      }
    }
  }, [apps, overlay]);

  const handlePowerOff = () => {
    setOverlay('none');
    setAppState('power-off');
    setTimeout(() => {
      setAppState('splash');
      setUser(null);
    }, 3000);
  };

  const handleChangeAvatar = () => {
    const avatars = ['👤', '🤖', '👾', '🚀', '🌟', '💎', '🎨'];
    const currentIdx = avatars.indexOf(userAvatar);
    setUserAvatar(avatars[(currentIdx + 1) % avatars.length]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (appState !== 'dashboard' || overlay !== 'none') return;
      if (e.key === 'ArrowRight') setSelectedIdx(p => Math.min(p + 1, apps.length - 1));
      else if (e.key === 'ArrowLeft') setSelectedIdx(p => Math.max(p - 1, 0));
      else if (e.key === 'Enter') handleAction(selectedApp.id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, overlay, apps.length, handleAction, selectedApp.id]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedCard = container.children[selectedIdx] as HTMLElement;
      if (selectedCard) {
        container.scrollTo({
          left: selectedCard.offsetLeft - (container.offsetWidth / 2) + (selectedCard.offsetWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIdx]);

  if (appState === 'power-off') return <PowerOffScreen lang={lang} />;
  if (appState === 'splash') return <SplashScreen lang={lang} onComplete={() => setAppState('login')} />;
  if (appState === 'login') return <LoginScreen lang={lang} onLogin={(u) => { setUser(u); setAppState('welcome'); }} />;
  if (appState === 'welcome') return <WelcomeAnimation lang={lang} user={user!} onComplete={() => setAppState('dashboard')} />;

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden flex flex-col font-sans select-none text-white cursor-default animate-in fade-in duration-1000">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-60 scale-110"
          style={{ backgroundImage: `url(${selectedApp.background})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 w-full px-16 py-12 flex justify-between items-center z-50 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center space-x-12">
          {/* Top Left Settings Button */}
          <button 
            onClick={() => setOverlay('settings')}
            className="w-16 h-16 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-90 group backdrop-blur-md"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-700">⚙️</span>
          </button>
          
          <div className="flex items-center space-x-6">
            <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse">💎</span>
            <span className="font-black text-white tracking-[0.4em] uppercase text-2xl italic drop-shadow-lg">{t.station}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-12">
          {/* Profile Nickname + Avatar (Clickable) */}
          <div 
            onClick={() => setOverlay('profile-menu')}
            className="flex items-center space-x-5 px-8 py-3 bg-white/5 rounded-full backdrop-blur-3xl border border-white/10 shadow-2xl transition-all hover:bg-white/20 cursor-pointer active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-black text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform ring-2 ring-white/10">
              {userAvatar}
            </div>
            <span className="font-black tracking-[0.4em] text-[10px] uppercase text-white/90">{user}</span>
          </div>
          <div className="text-white font-black text-4xl tabular-nums tracking-tighter drop-shadow-2xl">{time}</div>
        </div>
      </div>

      {/* Hero Core Info */}
      <div className="absolute top-[12%] left-32 z-[100] animate-in fade-in slide-in-from-left-20 duration-1000 pointer-events-none">
        <h1 className="text-[140px] font-black italic uppercase mb-4 drop-shadow-[0_25px_60px_rgba(0,0,0,1)] tracking-tighter leading-[0.8] animate-in zoom-in-95 duration-700">
          {selectedApp.title}
        </h1>
        <p className="text-3xl text-white/40 mb-16 italic font-light tracking-[0.8em] uppercase drop-shadow-2xl">{selectedApp.subtitle}</p>
        <div className="flex items-center space-x-12 pointer-events-auto">
          <button 
            type="button"
            onPointerDown={(e) => { e.preventDefault(); handleAction(selectedApp.id); }}
            className="px-32 py-9 bg-white text-black font-black uppercase tracking-[0.8em] text-[15px] rounded-[2.5rem] shadow-[0_30px_90px_rgba(255,255,255,0.3)] transition-all hover:scale-110 active:scale-90 z-[200] relative cursor-pointer"
          >
            {t.execute}
          </button>
          <button className="px-16 py-9 bg-white/5 backdrop-blur-3xl border border-white/10 text-white/40 font-black uppercase tracking-[0.6em] text-[12px] rounded-[2.5rem] hover:bg-white/15 transition-all">
            {t.stats}
          </button>
        </div>
      </div>

      {/* Application Carousel */}
      <div className="absolute bottom-16 w-full z-40 h-[500px] flex items-end">
        <div ref={scrollContainerRef} className="flex items-center px-[45%] space-x-16 overflow-x-hidden py-40 scroll-smooth no-scrollbar w-full">
          {apps.map((app, index) => (
            <div 
              key={app.id} 
              onClick={() => { if (selectedIdx === index) handleAction(app.id); else setSelectedIdx(index); }}
              className={`
                relative shrink-0 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer
                ${selectedIdx === index ? 'w-80 h-80 -translate-y-16 ring-4 ring-white ring-offset-[16px] ring-offset-transparent z-10 scale-110 shadow-[0_80px_160px_-40px_rgba(0,0,0,1)]' : 'w-48 h-48 opacity-20 scale-90 grayscale blur-[2px] hover:blur-0 hover:opacity-50'}
                bg-gradient-to-br ${app.color} rounded-[3.5rem] flex flex-col items-center justify-center overflow-hidden
              `}
            >
              <div className={`text-8xl mb-8 transition-transform duration-700 ${selectedIdx === index ? 'scale-110' : 'scale-100'}`}>{app.icon}</div>
              <div className={`font-black text-center px-10 transition-all duration-700 tracking-[0.5em] uppercase text-[10px] leading-relaxed ${selectedIdx === index ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
                {app.title}
              </div>
              {app.isInstalled && selectedIdx === index && (
                <div className="absolute top-8 right-8 bg-blue-500 text-[9px] px-4 py-2 rounded-xl font-black text-white shadow-2xl animate-pulse">LIVE CORE</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overlays */}
      {overlay === 'game' && <GameEngine gameId={activeGameId} onExit={() => setOverlay('none')} />}
      <StoreOverlay isOpen={overlay === 'store'} onClose={() => setOverlay('none')} onStartDownload={startDownload} storeGames={storeGames} lang={lang} />
      <DownloadsOverlay isOpen={overlay === 'downloads'} onClose={() => setOverlay('none')} downloads={downloads} lang={lang} />
      <SettingsOverlay isOpen={overlay === 'settings'} onClose={() => setOverlay('none')} lang={lang} setLang={setLang} />
      <ProfileMenuOverlay 
        isOpen={overlay === 'profile-menu'} 
        onClose={() => setOverlay('none')} 
        user={user!} 
        avatar={userAvatar}
        onSwitchAccount={() => { setOverlay('none'); setAppState('login'); setUser(null); }}
        onPowerOff={handlePowerOff}
        onChangeAvatar={handleChangeAvatar}
        lang={lang}
      />
      
      {overlay === 'ai' && (
        <div className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-12 animate-in fade-in duration-700">
           <div className="max-w-6xl w-full bg-zinc-950/60 p-24 rounded-[7rem] border border-blue-500/40 shadow-2xl relative">
              <div className="flex items-center gap-16 mb-24">
                <div className="w-28 h-28 rounded-[2.5rem] bg-blue-600 flex items-center justify-center text-6xl shadow-2xl animate-pulse">✨</div>
                <div>
                  <h2 className="text-8xl font-black italic tracking-tighter uppercase text-white">{t.assist}</h2>
                  <p className="text-blue-500 font-bold uppercase tracking-[1.5em] text-[11px] mt-4">Station Intel Node</p>
                </div>
              </div>
              <div className="mb-24 min-h-[300px] text-5xl font-light text-white italic leading-tight border-l-[16px] border-blue-600/80 pl-24">
                {isAiLoading ? <span className="animate-pulse opacity-20">Analyzing neural data...</span> : aiResponse || "Ghost core ready. Awaiting telemetry."}
              </div>
              <input 
                autoFocus
                className="w-full bg-white/5 border-2 border-white/5 p-16 rounded-[4rem] text-4xl outline-none focus:border-blue-500/60 transition-all placeholder:text-white/10 font-light"
                placeholder="Talk to the station kernel..."
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value;
                    if (!val) return;
                    setIsAiLoading(true);
                    const res = await getGeminiRecommendation(val);
                    setAiResponse(res);
                    setIsAiLoading(false);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button onClick={() => setOverlay('none')} className="mt-24 text-white/10 hover:text-white uppercase text-[12px] font-black tracking-[1.5em] transition-all block mx-auto underline underline-offset-[20px] decoration-8">{t.abort}</button>
           </div>
        </div>
      )}

      {/* Guide */}
      <div className="absolute bottom-16 right-24 z-[100] flex space-x-20 text-white/30 text-[12px] font-black uppercase tracking-[1em] pointer-events-none">
        <div className="flex items-center space-x-8">
          <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-lg font-bold text-white shadow-2xl">X</div>
          <span>{t.confirm}</span>
        </div>
        <div className="flex items-center space-x-8">
          <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-lg font-bold text-white shadow-2xl">O</div>
          <span>{t.back}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
