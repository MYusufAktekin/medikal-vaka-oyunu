// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { medicalCases } from "../data/cases";

export default function Home() {
  const currentCase = medicalCases[0];
  
  // OYUN DURUMLARI: intro -> instructions -> playing -> video -> playingPhase2 -> gameover/victory
  const [gameState, setGameState] = useState<'intro' | 'instructions' | 'playing' | 'video' | 'playingPhase2' | 'gameover' | 'victory' | 'scoreboard'>('intro');
  const [activeTab, setActiveTab] = useState<'klinik' | 'tetkik' | 'goruntuleme' | 'konsultasyon' | 'karar'>('klinik');
  
  // STATLER
  const [timeElapsed, setTimeElapsed] = useState(0); 
  const [budget, setBudget] = useState(5000); 
  const [reputation, setReputation] = useState(100);
  const [playerName, setPlayerName] = useState("");
  
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [muayeneDone, setMuayeneDone] = useState(false);
  
  // KONSÜLTASYON
  const [consultLogs, setConsultLogs] = useState<{dept: string, note: string, isSuccess: boolean}[]>([]);
  const [selectedDept, setSelectedDept] = useState("Kıdemli Asistan");
  const [consultMessage, setConsultMessage] = useState("");
  const [isConsulting, setIsConsulting] = useState(false);

  // DİĞER
  const [usedUptodate, setUsedUptodate] = useState(false);
  const [activeJokerModal, setActiveJokerModal] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<{name: string, score: number, result: string}[]>([]);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info', duration = 4000) => {
    setToast({msg, type});
    setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    const savedScores = localStorage.getItem('medCaseScores_Dahiliye');
    if (savedScores) setLeaderboard(JSON.parse(savedScores));
  }, []);

  const saveScoreToLeaderboard = () => {
    if (!playerName) return;
    const finalScore = budget + (reputation * 10) - (timeElapsed * 20);
    const newEntry = { name: playerName, score: finalScore > 0 ? finalScore : 0, result: gameState === 'victory' ? "Kurtardı" : "Kaybetti" };
    const newBoard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score);
    setLeaderboard(newBoard);
    localStorage.setItem('medCaseScores_Dahiliye', JSON.stringify(newBoard));
    setGameState('scoreboard');
  };

  const orderTest = (item: any, type: 'tetkik' | 'goruntuleme') => {
    if (unlockedItems.includes(item.id)) return;
    if (budget < item.cost) {
      showToast("Yetersiz bütçe!", "error"); return;
    }
    setBudget(prev => prev - item.cost);
    setTimeElapsed(prev => prev + item.time);
    setUnlockedItems(prev => [...prev, item.id]);
    showToast(`${item.name} sisteme düştü.`, "success");
  };

  const handleConsultSubmit = async () => {
    if (!consultMessage.trim()) return;
    setIsConsulting(true);
    showToast(`${selectedDept} aranıyor...`, "info");
    
    const patientData = unlockedItems.map(id => {
      const lab = currentCase.labs.find(l => l.id === id);
      const img = currentCase.imaging.find(i => i.id === id);
      return (lab || img) ? `${(lab || img)?.name}: ${(lab || img)?.result}` : null;
    }).filter(Boolean);

    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: consultMessage, patientData: patientData.length > 0 ? patientData : "Veri yok.", department: selectedDept })
      });
      const data = await res.json();
      if (res.ok) {
        setConsultLogs(prev => [{dept: selectedDept, note: data.reply, isSuccess: true}, ...prev]);
        setTimeElapsed(prev => prev + 2);
        setConsultMessage(""); 
      }
    } catch (err) {
      showToast("Hoca meşgul.", "error");
    } finally {
      setIsConsulting(false);
    }
  };

  const useJoker = () => {
    setUsedUptodate(true); setTimeElapsed(prev => prev + 1); setActiveJokerModal(currentCase.jokers.uptodate);
  };

  // KARAR MEKANİZMASI (2 AŞAMALI)
  const makeDecision = (decision: any, currentPhase: number) => {
    if (decision.type === "wrong") {
      setReputation(prev => prev - decision.penalty); 
      setTimeElapsed(prev => prev + 1); 
      showToast(decision.story, "error");
      if (reputation - decision.penalty <= 0) setGameState("gameover");
    } 
    else if (decision.type === "success" && currentPhase === 1) {
      // 1. Aşama geçildi -> Entübasyon Videosu
      setGameState("video");
      showToast(decision.story, "success");
    }
    else if (decision.type === "fatal") {
      setGameState("gameover"); setToast({msg: decision.story, type: 'error'});
    } 
    else if (decision.type === "victory" && currentPhase === 2) {
      setGameState("victory"); setToast({msg: decision.story, type: 'success'});
    }
  };

  const resetGame = () => {
    setGameState('intro'); setActiveTab('klinik'); setTimeElapsed(0); setBudget(5000); setReputation(100);
    setUnlockedItems([]); setConsultLogs([]); setMuayeneDone(false); setUsedUptodate(false);
    setToast(null); setActiveJokerModal(null); setPlayerName(""); setConsultMessage("");
  };

  const theme = { bg: "bg-[#FFF8F8]", bordo: "bg-[#7A1523]" };

  // --- EKRAN 1: GİRİŞ ---
  if (gameState === 'intro') {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="relative z-10 max-w-3xl bg-black/80 p-10 rounded-3xl text-center border border-red-900/50">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Dahiliye İnteraktif <span className="text-red-500">Vaka Simülatörü</span></h1>
          <button onClick={() => setGameState('instructions')} className="bg-red-700 hover:bg-red-800 text-white text-xl font-bold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all uppercase tracking-widest border border-red-500">
            Nöbeti Devral
          </button>
          <p className="text-sm text-gray-500 mt-10">2026-2027 İç Hastalıkları Asistan Temsilciliği tarafından geliştirilmiştir</p>
        </div>
      </main>
    );
  }

  // --- EKRAN 2: TALİMATLAR ---
  if (gameState === 'instructions') {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-[#7A1523] border-b pb-2">Nöbet Talimatları</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Bu vaka simülatöründe <strong>Ankara Üniversitesi Tıp Fakültesi İbni Sina Hastanesi’nde</strong> genel dahiliye servisinde nöbetçi doktorsun.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Acil servisten bugün sabah devraldığınız bir hastanın solunum sıkıntısı yaşadığı iletiliyor. Senden beklenen hastayı değerlendirdikten sonra hasta yönetiminde en doğru kararları vermen. Bütçeni ve itibarını tüketmeden vakayı yönetmelisin. Hazırsan başlayalım.
          </p>
          <button onClick={() => setGameState('playing')} className="w-full bg-[#7A1523] hover:bg-red-900 text-white font-bold py-4 rounded-xl text-xl">
            Vakayı Üstlen
          </button>
        </div>
      </main>
    );
  }

  // --- EKRAN 3: ENTÜBASYON VİDEOSU ---
  if (gameState === 'video') {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl text-red-500 font-bold mb-4 animate-pulse">Acil Entübasyon İşlemi Yapılıyor...</h2>
        <div className="max-w-4xl w-full bg-gray-900 p-2 rounded-xl border border-gray-700 mb-6">
          {/* public klasöründeki entubasyon.mp4 videosu */}
          <video src={currentCase.intubationVideo} autoPlay loop muted playsInline className="w-full rounded-lg" />
        </div>
        <button onClick={() => { setGameState('playingPhase2'); setActiveTab('karar'); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all">
          İşlem Bitti -> ARDS Yönetimine Geç
        </button>
      </main>
    );
  }

  // --- EKRAN 4: GAME OVER / VICTORY ---
  if (gameState === 'gameover' || gameState === 'victory') {
    return (
      <main className={`min-h-screen ${gameState === 'gameover' ? 'bg-slate-900' : 'bg-emerald-900'} flex items-center justify-center p-4`}>
        <div className={`max-w-4xl w-full bg-white p-8 rounded-3xl shadow-2xl border-t-8 ${gameState === 'gameover' ? 'border-red-600' : 'border-emerald-600'}`}>
          <div className="text-center">
            <div className="text-7xl mb-4">{gameState === 'gameover' ? '💀' : '🏆'}</div>
            <h1 className={`text-4xl font-extrabold mb-4 ${gameState === 'gameover' ? 'text-red-600' : 'text-emerald-700'}`}>
              {gameState === 'gameover' ? 'Hasta Kaybedildi / Kovuldun' : 'Kusursuz ARDS Yönetimi!'}
            </h1>
            <p className="text-lg text-gray-700 mb-8 p-4 bg-gray-50 rounded-xl leading-relaxed italic border border-gray-200">"{toast?.msg}"</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-200">
            <h3 className="font-bold text-xl mb-3 text-blue-900">📚 Öğrenim Noktası</h3>
            <p className="text-blue-800 text-sm leading-relaxed text-justify whitespace-pre-line">
              {currentCase.educationalMessage}
            </p>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-2xl mb-4 text-center">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Skorbord'a Kaydol</h3>
            <input type="text" placeholder="Adınız (Örn: Dr. Ahmet)" className="w-full p-4 text-lg rounded-xl border-2 mb-4" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
            <button onClick={saveScoreToLeaderboard} disabled={!playerName} className={`w-full text-white font-bold py-4 rounded-xl ${!playerName ? 'bg-gray-400' : 'bg-[#7A1523]'}`}>Kaydet</button>
          </div>
        </div>
      </main>
    );
  }

  if (gameState === 'scoreboard') {
    /* Skorbord Ekranı (Eski kodla aynı kalabilir, yer kazanmak için kısa tuttum) */
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl border-t-4 border-[#7A1523]">
          <h2 className="text-3xl font-bold text-center text-[#7A1523] mb-6">Skorbord</h2>
          <div className="space-y-2 mb-6">
            {leaderboard.map((entry, idx) => (
              <div key={idx} className="flex justify-between p-4 bg-gray-50 border rounded">
                <span className="font-bold">{idx + 1}. {entry.name} ({entry.result})</span>
                <span className="font-bold text-[#7A1523]">{entry.score} Puan</span>
              </div>
            ))}
          </div>
          <button onClick={resetGame} className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl">Yeni Vaka</button>
        </div>
      </main>
    );
  }

  // --- EKRAN 5: ANA OYUN (HBYS) ---
  const isPhase2 = gameState === 'playingPhase2';

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col pb-10">
      {/* TOAST & JOKER MODAL (Önceki kodla aynı) */}
      {toast && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl font-bold text-white shadow-xl ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <header className={`${theme.bordo} text-white shadow-md p-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10`}>
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#7A1523] p-2 rounded-lg font-bold">HBYS</div>
          <div><h1 className="font-bold">{currentCase.title}</h1><p className="text-xs">Hasta: {currentCase.patient.name} ({currentCase.patient.age}Y)</p></div>
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <button onClick={useJoker} disabled={usedUptodate} className="bg-blue-600 px-3 py-1 rounded disabled:opacity-50">📚 UpToDate</button>
          <div className="bg-black/20 px-4 py-1 rounded flex gap-4">
            <span>Süre: {timeElapsed}s</span>
            <span>Bütçe: {budget}₺</span>
            <span>İtibar: {reputation}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full mt-6 gap-6 px-4">
        {/* SOL MENÜ */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          {[
            { id: 'klinik', icon: '📋', label: 'Hasta Dosyası' },
            { id: 'tetkik', icon: '🩸', label: 'Laboratuvar' },
            { id: 'goruntuleme', icon: '🩻', label: 'Radyoloji' },
            { id: 'konsultasyon', icon: '📞', label: 'Konsültasyon' },
            { id: 'karar', icon: '💊', label: isPhase2 ? 'Ventilatör & ARDS' : 'Acil Müdahale' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex gap-3 p-4 rounded-xl font-bold text-left ${activeTab === tab.id ? `${theme.bordo} text-white` : 'bg-white text-gray-600'}`}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        {/* SAĞ PANEL */}
        <div className="flex-1 rounded-2xl shadow-xl p-6 bg-white border border-gray-200">
          
          {activeTab === 'klinik' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-2">Şikayet ve Anamnez</h2>
              <p className="bg-blue-50 p-4 rounded-xl whitespace-pre-line">{currentCase.patient.anamnesis}</p>
              <h3 className="text-xl font-bold mt-4">Özgeçmiş</h3>
              <p className="bg-gray-50 p-4 rounded-lg">{currentCase.patient.history}</p>
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-bold mb-4">Fizik Muayene</h3>
                {!muayeneDone ? (
                  <button onClick={() => { setMuayeneDone(true); setTimeElapsed(prev=>prev+1); }} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl">🩺 Hastayı Muayene Et</button>
                ) : (
                  <div className="bg-red-50 p-4 rounded-xl space-y-2">
                    <p><span className="font-bold">Vitaller:</span> {currentCase.muayene.vitals}</p>
                    <p><span className="font-bold">Bulgular:</span> {currentCase.muayene.findings}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(activeTab === 'tetkik' || activeTab === 'goruntuleme') && (
            <div>
              <h2 className="text-2xl font-bold border-b pb-2 mb-6">{activeTab === 'tetkik' ? 'Laboratuvar' : 'Radyoloji'}</h2>
              <div className="grid grid-cols-1 gap-4">
                {(activeTab === 'tetkik' ? currentCase.labs : currentCase.imaging).map(item => {
                  const isUnlocked = unlockedItems.includes(item.id);
                  return (
                    <div key={item.id} className={`p-4 rounded-xl border-2 ${isUnlocked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">{item.name}</h3>
                        {!isUnlocked && <button onClick={() => orderTest(item, activeTab)} className="bg-blue-100 text-blue-700 font-bold py-1 px-3 rounded text-sm">İste ({item.cost}₺)</button>}
                      </div>
                      {isUnlocked && (
                        <div className="mt-3">
                          <p className="text-sm font-mono text-gray-800">{item.result}</p>
                          {/* EĞER GÖRSEL VARSA (Akciğer Grafisi gibi) BURADA GÖSTER */}
                          {item.imagePath && (
                            <img src={item.imagePath} alt={item.name} className="mt-4 w-full max-w-md rounded-lg border border-gray-300 shadow-sm" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'konsultasyon' && (
            <div>
               <h2 className="text-2xl font-bold border-b pb-2 mb-6">📞 Yapay Zeka Konsültasyon</h2>
               <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                 {["Yoğun Bakım", "Göğüs Hastalıkları", "Enfeksiyon"].map(dept => (
                   <button key={dept} onClick={() => setSelectedDept(dept)} className={`px-4 py-2 rounded-lg font-bold border ${selectedDept === dept ? 'bg-[#7A1523] text-white' : 'bg-white'}`}>{dept}</button>
                 ))}
               </div>
               <div className="flex gap-2 mb-6">
                 <input type="text" value={consultMessage} onChange={(e)=>setConsultMessage(e.target.value)} placeholder={`${selectedDept} uzmanına danış...`} className="flex-1 p-3 border rounded-lg" />
                 <button onClick={handleConsultSubmit} className="bg-[#7A1523] text-white px-6 rounded-lg font-bold">Gönder</button>
               </div>
               {consultLogs.map((log, idx) => (
                 <div key={idx} className="p-4 mb-3 bg-blue-50 border-l-4 border-blue-500 rounded"><span className="font-bold">{log.dept}:</span> "{log.note}"</div>
               ))}
            </div>
          )}

          {activeTab === 'karar' && (
            <div>
               <h2 className="text-2xl font-bold border-b pb-2 mb-6 text-[#7A1523]">
                 {isPhase2 ? "Aşama 2: ARDS ve Ventilatör Yönetimi" : "Aşama 1: Acil Stabilizasyon"}
               </h2>
               <div className="space-y-4">
                 {(isPhase2 ? currentCase.phase2Decisions : currentCase.phase1Decisions).map(decision => (
                   <button key={decision.id} onClick={() => makeDecision(decision, isPhase2 ? 2 : 1)} className="w-full text-left p-5 border-2 rounded-xl hover:border-[#7A1523] transition-colors">
                     <span className="font-bold text-lg">{decision.name}</span>
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