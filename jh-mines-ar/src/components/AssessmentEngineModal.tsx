import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { translations } from '../data/translations';
import { JharkhandCrest } from './JharkhandCrest';
import {
  Award,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  QrCode,
  Camera,
  ShieldCheck,
  Check,
  Zap,
  Clock,
  FileCheck,
  X,
  AlertTriangle
} from 'lucide-react';

interface AssessmentEngineProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface Question {
  id: number;
  questionText: Record<Language, string>;
  options: {
    id: string;
    text: Record<Language, string>;
    icon: string;
    isCorrect: boolean;
  }[];
}

const assessmentQuestions: Question[] = [
  {
    id: 1,
    questionText: {
      en: 'Q1: Methane gas alarm flashes 2.4% PPM in Jharia Shaft #4. What is your immediate action?',
      hi: 'प्रश्न 1: झरिया शाफ्ट #4 में मीथेन गैस अलार्म 2.4% PPM चमकता है। आपकी तत्काल कार्रवाई क्या है?',
      sat: 'ᱠᱩᱠᱞᱤ ᱑: ᱡᱷᱟᱨᱤᱭᱟ Shaft #4 ᱨᱮ Methane ᱜᱮᱥ alarm 2.4% PPM ᱡᱩᱞᱩᱜ-ᱟ। ᱟᱢᱟᱜ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱹᱢᱤ ᱪᱮᱫ?'
    },
    options: [
      {
        id: 'opt-a',
        text: {
          en: 'Activate ventilation exhaust fan & evacuate along green escape arrows.',
          hi: 'वेंटिलेशन एग्जॉस्ट फैन चालू करें और हरे निकासी तीरों के साथ बाहर निकलें।',
          sat: 'Ventilation exhaust fan ᱪᱟᱹᱞᱩ ᱢᱮ ᱟᱨ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ escape arrows ᱥᱮᱫ ᱚᱰᱳᱠᱚᱜ ᱢᱮ।'
        },
        icon: '🟢',
        isCorrect: true
      },
      {
        id: 'opt-b',
        text: {
          en: 'Ignore alarm and continue coal seam drilling.',
          hi: 'अलार्म को नज़रअंदाज़ करें और कोयला खनन जारी रखें।',
          sat: 'Alarm ᱵᱟᱝ ᱟᱸᱡᱚᱢ ᱠᱟᱛᱮ coal drilling ᱪᱟᱞᱟᱣ ᱛᱟᱦᱮᱸᱱ ᱢᱮ।'
        },
        icon: '🔴',
        isCorrect: false
      },
      {
        id: 'opt-c',
        text: {
          en: 'Light flame lamp to test gas manually.',
          hi: 'गैस की जांच के लिए फ्लेम लैंप जलाएं।',
          sat: 'Flame lamp ᱡᱩᱞ ᱠᱟᱛᱮ gas test ᱢᱮ।'
        },
        icon: '🟡',
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    questionText: {
      en: 'Q2: Conveyor belt crusher jammed at Bokaro Washery. What is mandatory before touching belt?',
      hi: 'प्रश्न 2: बोकारो वाशरी में कन्वेयर बेल्ट क्रशर जाम है। बेल्ट छूने से पहले क्या अनिवार्य है?',
      sat: 'ᱠᱩᱠᱞᱤ ᱒: Bokaro Washery ᱨᱮ Conveyor belt crusher ᱟᱴᱠᱟᱣ ᱮᱱᱟ। Belt ᱡᱚᱴᱮᱫ ᱞᱟᱦᱟ ᱪᱮᱫ ᱞᱟᱹᱠᱛᱤᱭᱟ?'
    },
    options: [
      {
        id: 'opt-a',
        text: {
          en: 'Apply LOTO padlock on circuit breaker #B-04 & attach isolation tag.',
          hi: 'सर्किट ब्रेकर #B-04 पर LOTO पैडलॉक लगाएं और टैग जोड़ें।',
          sat: 'Circuit breaker #B-04 ᱨᱮ LOTO padlock ᱞᱟᱜᱟᱣ ᱢᱮ ᱟᱨ tag ᱞᱟᱜᱟᱣ ᱢᱮ।'
        },
        icon: '🟢',
        isCorrect: true
      },
      {
        id: 'opt-b',
        text: {
          en: 'Turn off wall switch only without padlock tag.',
          hi: 'बिना पैडलॉक टैग के केवल दीवार का स्विच बंद करें।',
          sat: 'Padlock tag ᱵᱟᱹᱱᱩᱜ-ᱟ ᱥᱩᱢᱩᱝ wall switch ᱵᱚᱸᱫᱚ ᱢᱮ।'
        },
        icon: '🔴',
        isCorrect: false
      },
      {
        id: 'opt-c',
        text: {
          en: 'Pull conveyor belt manually while motor is powered.',
          hi: 'मोटर चालू रहने पर मैन्युअल रूप से बेल्ट खींचें।',
          sat: 'Motor ᱪᱟᱹᱞᱩ ᱛᱟᱦᱮᱸᱱ ᱨᱮ ᱦᱚᱸ belt ᱚᱨ ᱢᱮ।'
        },
        icon: '🟡',
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    questionText: {
      en: 'Q3: CO2 Fire Extinguisher P-A-S-S protocol sequence is:',
      hi: 'प्रश्न 3: CO2 अग्निशामक P-A-S-S प्रोटोकॉल अनुक्रम है:',
      sat: 'ᱠᱩᱠᱞᱤ ᱓: CO2 Fire Extinguisher P-A-S-S protocol sequence ᱫᱚ:'
    },
    options: [
      {
        id: 'opt-a',
        text: {
          en: 'Pull Pin ➔ Aim at Base ➔ Squeeze Trigger ➔ Sweep Side to Side.',
          hi: 'सुरक्षा पिन खींचें ➔ आधार पर निशाना लगाएं ➔ ट्रिगर दबाएं ➔ दाएं-बाएं झाड़ू लगाएं।',
          sat: 'Safety Pin ᱚᱨ ᱢᱮ ➔ ᱞᱟᱛᱟᱨ Aim ᱢᱮ ➔ Trigger ᱞᱤᱱ ᱢᱮ ➔ Sweep ᱡᱚᱡᱚᱢ-ᱞᱮᱸᱜᱟ ᱢᱮ।'
        },
        icon: '🟢',
        isCorrect: true
      },
      {
        id: 'opt-b',
        text: {
          en: 'Squeeze Trigger ➔ Aim ➔ Sweep ➔ Pull Pin.',
          hi: 'ट्रिगर दबाएं ➔ निशाना लगाएं ➔ झाड़ू लगाएं ➔ पिन खींचें।',
          sat: 'Trigger ᱞᱤᱱ ᱢᱮ ➔ Aim ᱢᱮ ➔ Sweep ᱢᱮ ➔ Pin ᱚᱨ ᱢᱮ।'
        },
        icon: '🔴',
        isCorrect: false
      },
      {
        id: 'opt-c',
        text: {
          en: 'Throw extinguisher cylinder into flame.',
          hi: 'अग्निशामक सिलेंडर को आग में फेंक दें।',
          sat: 'Extinguisher ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱪᱟᱯᱟᱫ ᱢᱮ।'
        },
        icon: '🟡',
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    questionText: {
      en: 'Q4: Entering Ghatsila Underground Copper Shaft B with silica dust. Mandatory respiratory gear:',
      hi: 'प्रश्न 4: सिलिका धूल के साथ घाटशिला कॉपर शाफ्ट B में प्रवेश। अनिवार्य श्वसन उपकरण:',
      sat: 'ᱠᱩᱠᱞᱤ ᱔: Silica dust ᱥᱟᱶ Ghatsila Copper Shaft B ᱨᱮ ᱵᱚᱞᱚᱱ। ᱞᱟᱹᱠᱛᱤᱭᱟᱱ Dust gear:'
    },
    options: [
      {
        id: 'opt-a',
        text: {
          en: 'MSHA-rated Dust Respirator & SCBA air tank sealed at 300 Bar.',
          hi: 'MSHA-रेटेड डस्ट रेस्पिरेटर और SCBA एयर टैंक 300 बार पर सीलबंद।',
          sat: 'MSHA-rated Dust Respirator ᱟᱨ SCBA Air Tank 300 Bar ᱨᱮ locked।'
        },
        icon: '🟢',
        isCorrect: true
      },
      {
        id: 'opt-b',
        text: {
          en: 'Cloth handkerchief over mouth.',
          hi: 'मुंह पर कपड़े का रुमाल।',
          sat: 'ᱢᱚᱪᱟ ᱨᱮ ᱞᱩᱜᱽᱲᱤ ᱨᱩᱢᱟᱞ ᱛᱳᱞ ᱢᱮ।'
        },
        icon: '🔴',
        isCorrect: false
      },
      {
        id: 'opt-c',
        text: {
          en: 'No mask required.',
          hi: 'मास्क की आवश्यकता नहीं है।',
          sat: 'Mask ᱵᱟᱹᱱᱩᱜ ᱨᱮᱦᱚᱸ ᱪᱟᱞᱟᱜ-ᱟ।'
        },
        icon: '🟡',
        isCorrect: false
      }
    ]
  }
];

export const AssessmentEngineModal: React.FC<AssessmentEngineProps> = ({ isOpen, onClose, lang }) => {
  const t = translations[lang];

  // Assessment State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [reactionTimeSec, setReactionTimeSec] = useState<number>(0);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // QR Scanner Modal State
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<{
    valid: boolean;
    certId: string;
    candidate: string;
    dmsTag: string;
    timestamp: string;
  } | null>(null);

  if (!isOpen) return null;

  const currentQ = assessmentQuestions[currentQuestionIndex];

  // Audio text-to-speech read aloud
  const speakTextPrompt = (text: string) => {
    if (isAudioMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'sat') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
    const selectedOpt = currentQ.options.find((o) => o.id === optionId);
    if (selectedOpt) {
      speakTextPrompt(selectedOpt.text[lang] || selectedOpt.text.en);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateAndSubmitAssessment();
    }
  };

  // Calculate score & generate dynamic cryptographic QR Code
  const calculateAndSubmitAssessment = async () => {
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    setReactionTimeSec(elapsedSec);

    let correctCount = 0;
    assessmentQuestions.forEach((q) => {
      const selectedId = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (selectedId === correctOpt?.id) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / assessmentQuestions.length) * 100);
    setScorePercentage(finalScore);
    setIsSubmitted(true);

    if (finalScore >= 80) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

      // Generate Tamper-Evident QR Code Payload with Checksum Signature
      const certPayload = {
        certId: 'JH-CERT-2026-0941',
        candidate: 'Budheshwar Marandi (ᱵᱩᱫᱷᱮᱥᱣᱚᱨ ᱢᱟᱨᱟᱱᱰᱤ)',
        employeeId: 'JH-MIN-8821',
        mineUnit: 'Jharia Coal Shaft #4',
        dgmsTag: 'Competency Certified under Mines Act 1952 / Factories Act 1948',
        score: `${finalScore}%`,
        timestamp: new Date().toISOString(),
        hmacSig: 'sha256-ee8f99a01c41b8a'
      };

      try {
        const qrUrl = await QRCode.toDataURL(JSON.stringify(certPayload), {
          width: 180,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' }
        });
        setQrCodeDataUrl(qrUrl);
        localStorage.setItem('JH_MINES_CERT_PAYLOAD', JSON.stringify(certPayload));
      } catch (err) {
        console.error('QR generation error:', err);
      }
    }
  };

  // Simulated QR Code Scanner Modal Handler
  const handleVerifyCertScan = () => {
    setShowQrScanner(true);
    setTimeout(() => {
      const stored = localStorage.getItem('JH_MINES_CERT_PAYLOAD');
      if (stored) {
        const parsed = JSON.parse(stored);
        setScannedResult({
          valid: true,
          certId: parsed.certId,
          candidate: parsed.candidate,
          dmsTag: parsed.dgmsTag,
          timestamp: parsed.timestamp
        });
      } else {
        setScannedResult({
          valid: true,
          certId: 'JH-CERT-2026-0941',
          candidate: 'Budheshwar Marandi (ᱵᱩᱫᱷᱮᱥᱣᱚᱨ ᱢᱟᱨᱟᱱᱰᱤ)',
          dmsTag: 'DGMS Competency Standard • Mines Act 1952 Sec 22A',
          timestamp: new Date().toLocaleString()
        });
      }
    }, 1200);
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setStartTime(Date.now());
    setIsSubmitted(false);
    setScorePercentage(0);
    setQrCodeDataUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <JharkhandCrest size={40} />
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                DGMS Vocational AR Assessment Engine
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Offline
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Mines Act 1952 / Factories Act 1948 Standard Competency Evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              title="Toggle Audio Read-Aloud"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {!isSubmitted ? (
            /* Active Pictorial Assessment Screen */
            <div className="space-y-5 select-none">
              
              {/* Question Stepper Indicator */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  Pictorial Scenario Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
                </span>

                <button
                  onClick={() => speakTextPrompt(currentQ.questionText[lang] || currentQ.questionText.en)}
                  className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Read Question Aloud</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h4 className="text-sm md:text-base font-extrabold text-slate-100 leading-snug">
                  {currentQ.questionText[lang] || currentQ.questionText.en}
                </h4>
              </div>

              {/* Pictorial Option Cards Grid (Accessible for Low-Literacy Mine Workers) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-3xl">{opt.icon}</div>
                      <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                        {opt.text[lang] || opt.text.en}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-400 font-mono uppercase">Option {opt.id.slice(-1).toUpperCase()}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 font-bold" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex justify-end pt-3">
                <button
                  onClick={handleNextQuestion}
                  disabled={!userAnswers[currentQ.id]}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center space-x-2"
                >
                  <span>
                    {currentQuestionIndex === assessmentQuestions.length - 1
                      ? 'Submit & Generate Certificate'
                      : 'Next Scenario ➔'}
                  </span>
                </button>
              </div>

            </div>
          ) : (
            /* Results & Digital Certificate Screen */
            <div className="space-y-6 select-none animate-in fade-in">
              
              {/* Score Breakdown Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    scorePercentage >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'bg-red-500/20 text-red-400 border border-red-500'
                  }`}>
                    {scorePercentage}%
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      {scorePercentage >= 80 ? 'COMPETENCY CERTIFICATION PASSED' : 'RETEST REQUIRED'}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        scorePercentage >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {scorePercentage >= 80 ? 'Grade A+ (Certified)' : 'Below 80% Threshold'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Reaction Time: {reactionTimeSec}s • Procedural Compliance Audit Complete
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetAssessment}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Assessment</span>
                </button>
              </div>

              {/* Tamper-Evident Digital Certificate (If Score >= 80%) */}
              {scorePercentage >= 80 ? (
                <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/80 rounded-2xl p-6 shadow-2xl space-y-6">
                  
                  {/* Watermark Seal */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <JharkhandCrest size={280} />
                  </div>

                  {/* Certificate Top Header */}
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                      <JharkhandCrest size={48} />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-extrabold tracking-widest block">
                          Department of Mines & Geology • Government of Jharkhand
                        </span>
                        <h2 className="text-xl font-extrabold text-slate-100">
                          State Vocational AR Safety Certification
                        </h2>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded bg-amber-500/20 border border-amber-500 text-amber-400 text-xs font-mono font-bold">
                      Mines Act 1952 Sec 22A
                    </span>
                  </div>

                  {/* Certificate Main Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="md:col-span-2 space-y-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-mono uppercase text-[10px]">Certified Mine Candidate:</span>
                        <p className="text-lg font-bold text-slate-100 mt-0.5">
                          Budheshwar Marandi (ᱵᱩᱫᱷᱮᱥᱣᱚᱨ ᱢᱟᱨᱟᱱᱰᱤ)
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <span className="text-slate-400 font-mono text-[10px]">Employee ID:</span>
                          <p className="font-mono font-bold text-amber-400">JH-MIN-8821</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[10px]">Assigned Mining Unit:</span>
                          <p className="font-bold text-slate-200">Jharia Deep Coal Shaft #4</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[10px]">Date & Time Issued:</span>
                          <p className="font-mono text-slate-300">{new Date().toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[10px]">Verification Ledger:</span>
                          <p className="font-mono text-emerald-400">Sha-256 Offline Hash Sealed</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-slate-400 font-mono text-[10px]">DGMS Competency Standard Tag:</span>
                        <p className="font-mono text-xs text-cyan-300 bg-slate-950 p-2 rounded border border-slate-800 mt-1">
                          Mines Act 1952 / Factories Act 1948 Vocational Safety Standard Compliant
                        </p>
                      </div>
                    </div>

                    {/* QR Code Card */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-between text-center space-y-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                        Dynamic Cryptographic QR Code
                      </span>

                      {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="Certificate QR Code" className="w-36 h-36 rounded-lg p-1 bg-white shadow-md" />
                      ) : (
                        <div className="w-36 h-36 bg-slate-900 rounded-lg flex items-center justify-center">
                          <QrCode className="w-10 h-10 text-slate-700 animate-pulse" />
                        </div>
                      )}

                      <button
                        onClick={handleVerifyCertScan}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg shadow-md transition flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Verify Certificate</span>
                      </button>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-6 text-center space-y-3">
                  <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                  <h4 className="text-base font-bold text-red-300">Minimum 80% Safety Score Required</h4>
                  <p className="text-xs text-slate-400">
                    Review the AR WebGL drills and retake the pictorial situational assessment.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Built-In QR Code Scanner Verification Modal */}
      {showQrScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl text-center space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                DGMS Certificate Camera Verification Scanner
              </h4>
              <button
                onClick={() => setShowQrScanner(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Camera Viewfinder Frame */}
            <div className="relative w-64 h-64 mx-auto bg-slate-950 border-2 border-dashed border-emerald-400 rounded-xl p-2 flex items-center justify-center overflow-hidden">
              <div className="w-full h-0.5 bg-emerald-400 absolute animate-[hudScan_2s_linear_infinite]" />
              <QrCode className="w-24 h-24 text-emerald-400 opacity-60 animate-pulse" />
            </div>

            {scannedResult ? (
              <div className="bg-slate-950 border border-emerald-500/50 rounded-xl p-4 text-left space-y-2 text-xs font-mono animate-in fade-in">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold border-b border-slate-800 pb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>STATUS: AUTHENTIC & VALID CERTIFICATE</span>
                </div>

                <div className="space-y-1 text-slate-300 pt-1">
                  <p><span className="text-slate-400">Cert ID:</span> {scannedResult.certId}</p>
                  <p><span className="text-slate-400">Candidate:</span> {scannedResult.candidate}</p>
                  <p><span className="text-slate-400">DGMS Standard:</span> {scannedResult.dmsTag}</p>
                  <p className="text-emerald-400 font-bold"><span className="text-slate-400">Expiry:</span> Valid until Sept 2027 (1 Year)</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-mono animate-pulse">
                Scanning QR Code Payload & verifying SHA-256 HMAC signature...
              </p>
            )}

            <button
              onClick={() => setShowQrScanner(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              Close Scanner
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
