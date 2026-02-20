// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { medicalCases } from "../data/cases";

export default function Home() {
  const currentCase = medicalCases[0];
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory' | 'scoreboard'>('intro');
  const [activeTab, setActiveTab] = useState<'klinik' | 'tetkik' | 'goruntuleme' | 'konsultasyon' | 'karar'>('klinik');
  
  const [timeElapsed, setTimeElapsed] = useState(0); 
  const [budget, setBudget] = useState(5000); 
  const [reputation, setReputation] = useState(100);
  const [playerName, setPlayerName] = useState("");
  
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [muayeneDone, setMuayeneDone] = useState(false);
  const [consultLogs, setConsultLogs] = useState<{dept: string, note: string, isSuccess: boolean}[]>([]);
  
  const [usedKidemli, setUsedKidemli] = useState(false);
  const [usedUptodate, setUsedUptodate] = useState(false);
  const [activeJokerModal, setActiveJokerModal] = useState<string | null>(null);

  const [leaderboard, setLeaderboard] = useState<{name: string, score: number, result: string}[]>([]);

  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const savedScores = localStorage.getItem('medCaseScores');
    if (savedScores) {
      setLeaderboard(JSON.parse(savedScores));
    } else {
      setLeaderboard([
        { name: "Dr. House", score: 9500, result: "Kurtardı" },
        { name: "İntörn Dr.", score: 3200, result: "Kaybetti" },
      ]);
    }
  }, []);

  const saveScoreToLeaderboard = () => {
    if (!playerName) return;
    const finalScore = budget + (reputation * 10) - (timeElapsed * 20);
    const newEntry = { 
      name: playerName, 
      score: finalScore > 0 ? finalScore : 0, 
      result: gameState === 'victory' ? "Kurtardı" : "Kaybetti" 
    };
    
    const newBoard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score);
    setLeaderboard(newBoard);
    localStorage.setItem('medCaseScores', JSON.stringify(newBoard));
    setGameState('scoreboard');
  };

  const orderTest = (item: any, type: 'tetkik' | 'goruntuleme') => {
    if (unlockedItems.includes(item.id)) return;
    if (item.condition && !item.condition.every((c: string) => unlockedItems.includes(c))) {
      showToast("Gerekli ön tetkikleri tamamlamadınız!", "error"); return;
    }
    if (budget < item.cost) {
      showToast("Bütçe yetersiz!", "error"); return;
    }
    setBudget(prev => prev - item.cost);
    setTimeElapsed(prev => prev + item.time);
    setUnlockedItems(prev => [...prev, item.id]);
    showToast(`Sonuç eklendi: ${item.name}`, "success");
  };

  const callConsult = (consult: any) => {
    if (consultLogs.some(log => log.dept === consult.name)) return;
    const conditionsMet = consult.condition.every((cond: string) => unlockedItems.includes(cond));
    
    if (conditionsMet || consult.condition.length === 0) {
      setConsultLogs(prev => [{dept: consult.name, note: consult.success, isSuccess: true}, ...prev]);
      setTimeElapsed(prev => prev + 2); 
    } else {
      setConsultLogs(prev => [{dept: consult.name, note: consult.fail, isSuccess: false}, ...prev]);
      setReputation(prev => prev - 20);
      setTimeElapsed(prev => prev + 1);
      showToast("Gereksiz konsültasyon! İtibar düştü.", "error");
      if (reputation - 20 <= 0) setGameState('gameover');
    }
  };

  const useJoker = (type: 'kidemli' | 'uptodate') => {
    if (type === 'kidemli') { setUsedKidemli(true); setReputation(prev => prev - 15); setActiveJokerModal(currentCase.jokers.kidemli); } 
    else { setUsedUptodate(true); setTimeElapsed(prev => prev + 3); setActiveJokerModal(currentCase.jokers.uptodate); }
  };

  const makeDecision = (treatment: any) => {
    if (treatment.type === "fatal") {
      setGameState("gameover"); setToast({msg: treatment.story, type: 'error'});
    } else if (treatment.type === "wrong") {
      setReputation(prev => prev - 30); setTimeElapsed(prev => prev + 48); showToast(treatment.story, "error");
      if (reputation - 30 <= 0) setGameState("gameover");
    } else if (treatment.type === "victory") {
      setGameState("victory"); setToast({msg: treatment.story, type: 'success'});
    }
  };

  const resetGame = () => {
    setGameState('intro'); setActiveTab('klinik'); setTimeElapsed(0); setBudget(5000); setReputation(100);
    setUnlockedItems([]); setConsultLogs([]); setMuayeneDone(false); setUsedKidemli(false); setUsedUptodate(false);
    setToast(null); setActiveJokerModal(null); setPlayerName("");
  };

  const theme = { bg: "bg-[#FFF8F8]", bordo: "bg-[#7A1523]" };

  // --- EKRAN 1: SİNEMATİK İNTRO ---
  if (gameState === 'intro') {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden bg-black">
        {currentCase.introVideo && (
          <video autoPlay loop muted playsInline className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover opacity-40 blur-sm">
            <source src={currentCase.introVideo} type="video/mp4" />
          </video>
        )}
        
        <div className="relative z-10 max-w-3xl bg-black/70 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center border border-white/10">
          <div className="w-24 h-24 bg-red-600 animate-pulse text-white rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-[0_0_30px_rgba(220,38,38,0.6)]">🚑</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-wider">KLİNİK VAKA <span className="text-red-500">SİMÜLATÖRÜ</span></h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed italic">
            "Acil Servisten Bir Yeni Konsultasyon...<br/>Bütçeni ve itibarını tüketmeden vakayı yönet!"
          </p>
          <button onClick={() => setGameState('playing')} className="bg-red-600 hover:bg-red-800 text-white text-xl font-bold py-4 px-12 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)] transition-all hover:scale-105 uppercase tracking-widest border border-red-500/50">
            Vakayı Üstlen
          </button>
        </div>
      </main>
    );
  }

  // --- EKRAN 2: OYUN BİTİŞİ VE EĞİTİM EKRANI ---
  if (gameState === 'gameover' || gameState === 'victory') {
    return (
      <main className={`min-h-screen ${gameState === 'gameover' ? 'bg-slate-900' : 'bg-emerald-900'} flex items-center justify-center p-4 font-sans`}>
        <div className={`max-w-3xl w-full bg-white p-8 md:p-10 rounded-3xl shadow-2xl border-t-8 ${gameState === 'gameover' ? 'border-red-600' : 'border-emerald-600'}`}>
          <div className="text-center">
            <div className="text-7xl mb-4">{gameState === 'gameover' ? '💀' : '🏆'}</div>
            <h1 className={`text-4xl font-extrabold mb-4 ${gameState === 'gameover' ? 'text-red-600' : 'text-emerald-700'}`}>
              {gameState === 'gameover' ? 'Hasta Kaybedildi' : 'Kusursuz Tanı!'}
            </h1>
            <p className="text-lg text-gray-700 mb-8 p-4 bg-gray-50 rounded-xl leading-relaxed italic border border-gray-200">"{toast?.msg}"</p>
          </div>

          {/* EĞİTİCİ VAKA ÖZETİ ALANI */}
          <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-200">
            <h3 className="font-bold text-xl mb-3 text-blue-900 flex items-center gap-2">📚 Öğrenim Noktası</h3>
            <p className="text-blue-800 text-sm leading-relaxed text-justify">
              {currentCase.educationalMessage}
            </p>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-2xl mb-4 text-center">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Skorbord'a Kaydol</h3>
            <input type="text" placeholder="Adınız (Örn: Dr. Ahmet)" className="w-full p-4 text-lg rounded-xl border-2 border-gray-300 focus:border-[#7A1523] focus:outline-none mb-4" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
            <button onClick={saveScoreToLeaderboard} disabled={!playerName} className={`w-full text-white font-bold py-4 px-8 rounded-xl transition-all ${!playerName ? 'bg-gray-400' : 'bg-[#7A1523] hover:bg-red-800 shadow-lg'}`}>
              Skorumu Kaydet ve Sıralamayı Gör
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- EKRAN 3: ONUR TABLOSU ---
  if (gameState === 'scoreboard') {
    return (
      <main className={`min-h-screen ${theme.bg} flex items-center justify-center p-4 font-sans`}>
        <div className="max-w-3xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-t-8 border-[#7A1523]">
          <h1 className="text-4xl font-extrabold text-center text-[#7A1523] mb-2 uppercase tracking-widest">Ankara Tıp</h1>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Klinik Onur Tablosu</h2>
          
          <div className="space-y-3 mb-10 max-h-96 overflow-y-auto pr-2">
            {leaderboard.map((entry, idx) => (
              <div key={idx} className={`flex justify-between items-center p-4 rounded-xl border-2 ${idx === 0 ? 'bg-yellow-50 border-yellow-400' : idx === 1 ? 'bg-gray-50 border-gray-300' : idx === 2 ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-black ${idx === 0 ? 'text-yellow-600' : idx === 1 ? 'text-gray-500' : idx === 2 ? 'text-orange-600' : 'text-gray-400'}`}>#{idx + 1}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{entry.name}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${entry.result === 'Kurtardı' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{entry.result}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#7A1523]">{entry.score}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Puan</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button onClick={resetGame} className="bg-gray-800 hover:bg-black text-white font-bold py-4 px-12 rounded-full shadow-lg transition-all">Yeni Vakaya Başla</button>
          </div>
        </div>
      </main>
    );
  }

  // --- EKRAN 4: HBYS ---
  return (
    <main className={`min-h-screen bg-gray-100 flex flex-col font-sans pb-10`}>
      {toast && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl font-bold text-white flex items-center animate-slideDown ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
          <span className="mr-3 text-2xl">{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span> {toast.msg}
        </div>
      )}

      {activeJokerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl border-t-8 border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">💡 Acil Destek Bilgisi</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">{activeJokerModal}</p>
            <button onClick={() => setActiveJokerModal(null)} className="w-full bg-gray-800 hover:bg-black text-white py-3 rounded-xl font-bold">Anladım</button>
          </div>
        </div>
      )}

      <header className={`${theme.bordo} text-white shadow-md p-4 flex flex-col lg:flex-row justify-between items-center z-10 sticky top-0`}>
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <div className="bg-white text-[#7A1523] p-2 rounded-lg font-extrabold text-xl">HBYS</div>
          <div><h1 className="font-bold text-lg">{currentCase.title}</h1><p className="text-red-200 text-xs">Hasta: {currentCase.patient.name} ({currentCase.patient.age}Y)</p></div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 items-center">
          <div className="flex gap-2 mr-4">
            <button disabled={usedKidemli} onClick={() => useJoker('kidemli')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${usedKidemli ? 'bg-gray-500 opacity-50' : 'bg-yellow-500 hover:bg-yellow-400 text-yellow-900'}`}>🦸‍♂️ Kıdemliye Sor</button>
            <button disabled={usedUptodate} onClick={() => useJoker('uptodate')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${usedUptodate ? 'bg-gray-500 opacity-50' : 'bg-blue-500 hover:bg-blue-400 text-white'}`}>📚 UpToDate</button>
          </div>
          <div className="flex gap-4 md:gap-8 bg-black/20 px-6 py-2 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-center"><p className="text-[10px] uppercase tracking-widest text-red-200 opacity-80">Geçen Süre</p><p className="text-xl font-bold">{timeElapsed} <span className="text-sm font-normal">Saat</span></p></div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center"><p className="text-[10px] uppercase tracking-widest text-red-200 opacity-80">Bütçe</p><p className={`text-xl font-bold ${budget < 1000 ? 'text-red-400' : 'text-emerald-400'}`}>{budget}₺</p></div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center"><p className="text-[10px] uppercase tracking-widest text-red-200 opacity-80">İtibar</p><p className={`text-xl font-bold ${reputation < 50 ? 'text-red-400' : 'text-blue-300'}`}>⭐ {reputation}</p></div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full mt-6 gap-6 px-4">
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          {[
            { id: 'klinik', icon: '📋', label: 'Hasta Dosyası' },
            { id: 'tetkik', icon: '🩸', label: 'Laboratuvar' },
            { id: 'goruntuleme', icon: '🩻', label: 'Radyoloji' },
            { id: 'konsultasyon', icon: '📞', label: 'Konsültasyon' },
            { id: 'karar', icon: '💊', label: 'Teşhis & Karar' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 p-4 rounded-xl text-left font-bold transition-all ${activeTab === tab.id ? `${theme.bordo} text-white shadow-lg translate-x-2` : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}><span className="text-xl">{tab.icon}</span>{tab.label}</button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 min-h-[600px]">
          {activeTab === 'klinik' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold border-b pb-2 text-gray-800">Şikayet ve Anamnez</h2>
              <p className="text-lg text-gray-700 leading-relaxed bg-blue-50 p-5 rounded-xl border border-blue-100">{currentCase.patient.anamnesis}</p>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Özgeçmiş</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">{currentCase.patient.history}</p>
              <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Fizik Muayene</h3>
                {!muayeneDone ? (
                  <button onClick={() => { setMuayeneDone(true); setTimeElapsed(prev => prev + 1); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">🩺 Hastayı Muayene Et (Zaman Alır: 1 Saat)</button>
                ) : (
                  <div className="bg-red-50 p-5 rounded-xl border border-red-100 space-y-4">
                    <div><span className="font-bold text-red-900">Vitaller:</span> <span className="text-red-800">{currentCase.muayene.vitals}</span></div>
                    <div><span className="font-bold text-red-900">Bulgular:</span> <span className="text-red-800">{currentCase.muayene.findings}</span></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {(activeTab === 'tetkik' || activeTab === 'goruntuleme') && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold border-b pb-2 text-gray-800 mb-6">{activeTab === 'tetkik' ? 'Laboratuvar İstemleri' : 'Radyolojik İncelemeler'}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(activeTab === 'tetkik' ? currentCase.labs : currentCase.imaging).map(item => {
                  const isUnlocked = unlockedItems.includes(item.id);
                  return (
                    <div key={item.id} className={`p-5 rounded-xl border-2 transition-all ${isUnlocked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`font-bold text-lg ${isUnlocked ? 'text-emerald-900' : 'text-gray-800'}`}>{item.name}</h3>
                        {!isUnlocked && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Maliyet: {item.cost}₺</span>}
                      </div>
                      {isUnlocked ? (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-100 shadow-sm"><p className="font-mono text-sm text-gray-800 leading-relaxed">{item.result}</p></div>
                      ) : (
                        <button onClick={() => orderTest(item, activeTab)} className="mt-2 w-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex justify-center items-center gap-2">
                          İstem Yap <span>(⏱️ {item.time} Saat)</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'konsultasyon' && (
            <div className="animate-fadeIn">
               <h2 className="text-2xl font-bold border-b pb-2 text-gray-800 mb-6">Uzman Görüşü Al</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                 {currentCase.consultations.map(consult => (
                   <button key={consult.id} onClick={() => callConsult(consult)} className="bg-gray-800 hover:bg-black text-white p-4 rounded-xl font-bold transition-colors flex flex-col items-center justify-center text-center gap-2">
                      <span className="text-2xl">👨‍⚕️</span>{consult.name} İste
                    </button>
                 ))}
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">E-Konsültasyon Raporları</h3>
               {consultLogs.length === 0 ? (
                 <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">Henüz istenen bir konsültasyon bulunmuyor.</p>
               ) : (
                 <div className="space-y-4">
                   {consultLogs.map((log, idx) => (
                     <div key={idx} className={`p-5 rounded-xl border-l-8 shadow-sm ${log.isSuccess ? 'bg-blue-50 border-blue-500' : 'bg-red-50 border-red-500'}`}>
                       <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 ${log.isSuccess ? 'text-blue-900' : 'text-red-900'}`}>{log.isSuccess ? '📝' : '⚠️'} {log.dept} Sonucu</h4>
                       <p className={`leading-relaxed ${log.isSuccess ? 'text-blue-800' : 'text-red-800'}`}>"{log.note}"</p>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'karar' && (
            <div className="animate-fadeIn">
               <h2 className="text-2xl font-bold border-b pb-2 text-[#7A1523] mb-6 flex items-center gap-2">⚕️ Kesin Tanı ve Tedavi Planı</h2>
               <div className="space-y-4">
                 {currentCase.treatments.map(treatment => (
                   <button key={treatment.id} onClick={() => makeDecision(treatment)} className="w-full text-left p-5 bg-white border-2 border-gray-200 hover:border-[#7A1523] hover:shadow-md rounded-xl group transition-all">
                     <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#7A1523] flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#7A1523] group-hover:text-white flex items-center justify-center transition-colors">➔</span>{treatment.name}</h3>
                   </button>
                 ))}
               </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}