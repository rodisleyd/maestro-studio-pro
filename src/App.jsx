import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Wand2, Settings2, Play, Copy, CheckCheck, AlertCircle, 
  Layers, Mic2, ArrowRight, Search, Upload, 
  FileAudio, Activity, X, Save, Trash2, History, RotateCcw,
  ChevronDown, ChevronUp
} from 'lucide-react';

/**
 * MAESTRO STUDIO PRO - VERSÃO DEFINITIVA VERCEL
 * Corrigido para ser funcional, com IA e armazenamento local.
 */

// Função para aceder à API Key de forma segura
const getEnvVariable = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || "";
    }
  } catch (e) {}
  return "";
};

const apiKey = getEnvVariable('VITE_GEMINI_API_KEY');

// Constantes de Configuração Profissional (Inspirado no Magic Prompt)
const VOCAL_ARCHETYPES = [
  { id: 'Modern Pop', label: 'Modern Pop', desc: 'Limpo e produzido' },
  { id: 'Rock Grit', label: 'Rock Grit', desc: 'Energia e drive' },
  { id: 'Intimate Folk', label: 'Intimate Folk', desc: 'Suave e acústico' },
  { id: 'Deep Soul', label: 'Deep Soul', desc: 'Grave e emotivo' },
  { id: 'Dreamy Pop', label: 'Dreamy Pop', desc: 'Etéreo e com ar' },
];

const INSTRUMENT_GROUPS = [
  { label: 'Cordas', items: ['Violão Aço', 'Violão Nylon', 'Guitarra Elétrica', 'Baixo Elétrico', 'Baixo Slap'] },
  { label: 'Teclas', items: ['Piano Acústico', 'Piano Elétrico', 'Synth Pad', 'Synth Lead', 'Órgão'] },
  { label: 'Percussão', items: ['Bateria Completa', 'Pandeiro', 'Congas', 'Cajón', 'Drum Machine'] },
  { label: 'Sopros/Outros', items: ['Saxe/Metais', 'Trompete', 'Flauta', 'Violino/Strings', 'Efeitos FX'] },
];

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});

function App() {
  const [activeTab, setActiveTab] = useState('MANUAL');
  const [userQuery, setUserQuery] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [maestroAnalysis, setMaestroAnalysis] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [generationTimer, setGenerationTimer] = useState(0);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [vocalArchetype, setVocalArchetype] = useState('');
  const [secondaryGenre, setSecondaryGenre] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showExpertOptions, setShowExpertOptions] = useState(false);
  const fileInputRef = useRef(null);

  // Efeito para simular progresso durante a geração
  useEffect(() => {
    let interval;
    if (isGenerating) {
      setProgress(0);
      setGenerationTimer(0);
      interval = setInterval(() => {
        setGenerationTimer(prev => prev + 1);
        setProgress(p => {
          if (p < 40) return p + 8;
          if (p < 70) return p + 3;
          if (p < 92) return p + 0.5;
          return p;
        });
      }, 500);
    } else {
      if (progress > 0) {
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
          setGenerationTimer(0);
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Carregar biblioteca local ao iniciar
  useEffect(() => {
    const data = localStorage.getItem('maestro_v2_library');
    if (data) {
      try {
        setSavedPrompts(JSON.parse(data));
      } catch (e) {
        console.error("Falha ao carregar biblioteca:", e);
      }
    }
  }, []);

  const persistData = (newList) => {
    setSavedPrompts(newList);
    localStorage.setItem('maestro_v2_library', JSON.stringify(newList));
  };

  const generateMusicConcept = async () => {
    let finalQuery = "";
    if (activeTab === 'MANUAL') finalQuery = `Briefing: ${userQuery}`;
    else if (activeTab === 'INFLUÊNCIA') finalQuery = `Artista: ${referenceInput}. Detalhes: ${userQuery}`;
    else if (activeTab === 'DNA ÁUDIO') finalQuery = `Referência: ${selectedFile?.name}. Instruções: ${userQuery}`;

    if (!finalQuery.trim() && !selectedFile) return;

    if (!apiKey) {
      setError("Falta a API Key no ficheiro .env (VITE_GEMINI_API_KEY)");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const systemPrompt = `És o "Maestro Studio Pro", um Produtor Musical lendário e Engenheiro de Prompts para Suno/Udio. 
    Analisa os inputs e responde APENAS em JSON. 
    
    DIRETRIZES CRÍTICAS:
    1. IDIOMA DA ANÁLISE: O campo "style_analysis" DEVE ser escrito em PORTUGUÊS DO BRASIL.
    2. IDIOMA VOCAL: Especifique sempre "Vocals in Brazilian Portuguese" no final_prompt para garantir o sotaque correto.
    3. FUSÃO DE GÊNEROS: Se houver um gênero secundário, descreva uma transição ou mistura fluida entre os estilos.
    4. CONTROLE DE PERCUSSÃO: Se a percussão não for solicitada ou selecionada, NÃO use termos como "drums", "beat" ou "groove" no texto positivo.
    5. DNA VOCAL: Integre o "Arquétipo Vocal" na descrição da performance.
    6. STYLE TAGS: Crie uma string de tags curtas (máx 120 caracteres) para o campo Style em INGLÊS.
    
    JSON:
    {
      "genre": "Género (ou Fusão)",
      "bpm": "BPM sugerido",
      "key": "Tom/Escala",
      "style_analysis": "Análise detalhada do DNA sonoro em PORTUGUÊS",
      "instruments": ["Lista de instrumentos definitiva"],
      "style_tags": "Tags para o campo Style em INGLÊS",
      "final_prompt": "Master Prompt técnico em INGLÊS"
    }`;

    try {
      const expertContext = `
        Gênero Secundário: ${secondaryGenre || 'Nenhum'}
        Arquétipo Vocal: ${vocalArchetype || 'Automático'}
        Instrumentos Selecionados: ${selectedInstruments.join(', ') || 'Automático'}
        Excluir (Prompt Negativo): ${negativePrompt || 'Nenhum'}
      `;
      const parts = [{ text: `${finalQuery}\n\n--- CONFIGURAÇÃO EXPERT ---\n${expertContext}` }];
      
      // Se tiver arquivo e estiver na aba DNA ÁUDIO, envia o áudio para a IA
      if (selectedFile && activeTab === 'DNA ÁUDIO') {
        try {
          const base64Data = await fileToBase64(selectedFile);
          parts.push({
            inline_data: {
              mime_type: selectedFile.type,
              data: base64Data
            }
          });
        } catch (e) {
          console.error("Erro ao processar áudio:", e);
        }
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { 
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Erro na API");
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("A IA não retornou uma resposta válida.");
      setMaestroAnalysis(JSON.parse(text));
    } catch (err) {
      console.error(err);
      setError(`O Maestro está offline: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToLibrary = () => {
    if (!maestroAnalysis) return;
    const newEntry = { ...maestroAnalysis, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    persistData([newEntry, ...savedPrompts]);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const deleteEntry = (id) => {
    persistData(savedPrompts.filter(p => p.id !== id));
  };

  const copyPrompt = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const clearAll = () => {
    setUserQuery('');
    setReferenceInput('');
    setSelectedFile(null);
    setMaestroAnalysis(null);
    setError(null);
    setSelectedInstruments([]);
    setVocalArchetype('');
    setSecondaryGenre('');
    setNegativePrompt('');
  };

  const renderSafe = (v) => (typeof v === 'object' ? JSON.stringify(v) : v || "");

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-orange-500/30">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex flex-col gap-2">
          <img src="/logo_maestro.png" alt="Maestro Logo" className="h-10 md:h-12 object-contain drop-shadow-[0_0_15px_rgba(255,165,0,0.2)]" />
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Studio Engine Ativo
          </p>
        </div>

        {/* NAVEGAÇÃO SUPERIOR */}
        <div className="bg-[#121212] p-1.5 rounded-full border border-white/5 flex gap-1">
          {['MANUAL', 'INFLUÊNCIA', 'DNA ÁUDIO'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${
                activeTab === tab ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
          <button onClick={clearAll} className="px-3 text-slate-500 hover:text-white transition-colors" title="Limpar">
             <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* GRID PRINCIPAL */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CONFIGURAÇÃO DE ORIGEM (ESQUERDA) */}
        <section className="lg:col-span-4 bg-[#161616] rounded-[40px] p-8 border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2 text-orange-500 mb-6">
            <Activity className="w-4 h-4" />
            <h2 className="text-[11px] font-black uppercase tracking-widest">Painel de Controlo</h2>
          </div>

          <div className="space-y-4 min-h-[300px] mb-8">
            {activeTab === 'MANUAL' && (
              <textarea
                className="w-full h-64 bg-[#0f0f0f] rounded-3xl p-6 border border-white/5 text-slate-300 text-sm leading-relaxed resize-none outline-none focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
                placeholder="Descreva a vibe, instrumentos ou atmosfera desejada..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
              />
            )}

            {activeTab === 'INFLUÊNCIA' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    className="w-full bg-[#0f0f0f] rounded-2xl py-4 pl-12 pr-6 border border-white/5 text-sm outline-none"
                    placeholder="Nome do artista..."
                    value={referenceInput}
                    onChange={(e) => setReferenceInput(e.target.value)}
                  />
                </div>
                <textarea
                  className="w-full h-32 bg-[#0f0f0f] rounded-2xl p-4 border border-white/5 text-slate-300 text-sm outline-none resize-none"
                  placeholder="Instruções adicionais..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'DNA ÁUDIO' && (
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-32 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all group"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-orange-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase px-4 text-center truncate w-full">
                    {selectedFile ? selectedFile.name : 'Carregar Referência MP3'}
                  </span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={e => setSelectedFile(e.target.files[0])} />
                </div>
                <textarea
                  className="w-full h-24 bg-[#0f0f0f] rounded-2xl p-4 border border-white/5 text-slate-300 text-sm outline-none"
                  placeholder="Instruções para análise..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* BOTÃO OPÇÕES EXPERT */}
          <button 
            onClick={() => setShowExpertOptions(!showExpertOptions)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/5 mb-4 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="w-3 h-3 text-orange-500" />
              Opções Avançadas (PRO)
            </div>
            {showExpertOptions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* PAINEL EXPERT */}
          {showExpertOptions && (
            <div className="space-y-6 mb-8 p-6 bg-black/20 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
               {/* FUSÃO DE GÊNERO */}
               <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Gênero Secundário (Fusão)</label>
                  <input 
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-orange-500/50"
                    placeholder="Ex: Trap, Melodic Pop..."
                    value={secondaryGenre}
                    onChange={e => setSecondaryGenre(e.target.value)}
                  />
               </div>

               {/* DNA VOCAL */}
               <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">DNA Vocal (Arquétipo)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {VOCAL_ARCHETYPES.map(arc => (
                      <button 
                        key={arc.id}
                        type="button"
                        onClick={() => setVocalArchetype(vocalArchetype === arc.id ? '' : arc.id)}
                        className={`p-2 rounded-xl border text-[9px] font-bold text-left transition-all ${vocalArchetype === arc.id ? 'bg-orange-500 border-orange-500 text-black' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-orange-500/30'}`}
                      >
                        {arc.label}
                      </button>
                    ))}
                  </div>
               </div>

               {/* ORQUESTRADOR */}
               <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Orquestrador (Instrumentos)</label>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {INSTRUMENT_GROUPS.map(group => (
                      <div key={group.label} className="mb-2">
                        <p className="text-[8px] font-black text-slate-600 mb-1.5 uppercase">{group.label}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map(item => (
                            <button 
                              key={item}
                              type="button"
                              onClick={() => {
                                if (selectedInstruments.includes(item)) setSelectedInstruments(selectedInstruments.filter(i => i !== item));
                                else setSelectedInstruments([...selectedInstruments, item]);
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-[8px] font-bold transition-all ${selectedInstruments.includes(item) ? 'bg-white text-black border-white' : 'bg-black/40 border-white/5 text-slate-500 hover:border-white/20'}`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* PROMPT NEGATIVO */}
               <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Prompt Negativo (Excluir)</label>
                  <input 
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-red-500/50"
                    placeholder="Ex: no drums, no piano..."
                    value={negativePrompt}
                    onChange={e => setNegativePrompt(e.target.value)}
                  />
               </div>
            </div>
          )}

          <button 
            onClick={generateMusicConcept}
            disabled={isGenerating}
            className="w-full bg-white text-black font-black py-5 rounded-full hover:bg-orange-500 transition-all uppercase text-xs tracking-widest disabled:opacity-50 active:scale-95 shadow-xl shadow-white/5"
          >
            {isGenerating ? 'A Processar...' : 'Convocar o Maestro'}
          </button>
        </section>

        {/* ESTÚDIO VIRTUAL (DIREITA) */}
        <section className="lg:col-span-8">
          {isGenerating ? (
            <div className="bg-[#161616]/50 rounded-[40px] p-8 border border-white/5 flex flex-col items-center justify-center min-h-[500px] text-center animate-in fade-in duration-500">
               <div className="w-48 h-48 relative flex items-center justify-center mb-10">
                  <div className="absolute inset-0 border-8 border-orange-500/10 rounded-full"></div>
                  <div 
                    className="absolute inset-0 border-8 border-orange-500 rounded-full border-t-transparent animate-spin"
                    style={{ animationDuration: '2s' }}
                  ></div>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-black text-white">{Math.round(progress)}%</div>
                    <div className="text-[10px] text-orange-500 font-bold tracking-widest">{generationTimer}s</div>
                  </div>
               </div>
               <div className="w-full max-w-sm bg-white/5 h-1.5 rounded-full overflow-hidden mb-6">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-600 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
               <h3 className="text-white text-sm font-black uppercase tracking-[0.3em] mb-2">
                 O Maestro está a Elaborar...
               </h3>
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                 A analisar DNA Sonoro e Estrutura
               </p>
            </div>
          ) : maestroAnalysis ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  ['Gênero', maestroAnalysis.genre],
                  ['BPM', maestroAnalysis.bpm],
                  ['Escala', maestroAnalysis.key],
                  ['Status', 'Pronto']
                ].map(([l, v], i) => (
                  <div key={i} className="bg-[#161616] p-5 rounded-3xl border border-white/5 shadow-lg">
                    <span className="text-[9px] text-slate-500 font-black uppercase block mb-1 tracking-widest">{l}</span>
                    <p className="text-white text-sm font-bold truncate">{renderSafe(v)}</p>
                  </div>
                ))}
              </div>

              <div className="bg-orange-500/5 border border-orange-500/10 p-8 rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 opacity-50" />
                <h4 className="text-[10px] font-black text-orange-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
                  <History className="w-3 h-3" /> Análise de Estilo
                </h4>
                <p className="text-sm text-slate-300 italic leading-relaxed group-hover:text-white transition-colors duration-500">
                  "{renderSafe(maestroAnalysis.style_analysis)}"
                </p>
              </div>

              <div className="bg-white rounded-[40px] p-8 text-black shadow-2xl relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">Prompt de Audio IA</span>
                  <div className="flex gap-2">
                    <button onClick={saveToLibrary} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase transition-all shadow-md active:scale-95 ${saveSuccess ? 'bg-green-100 text-green-700' : 'bg-orange-500 text-black hover:bg-black hover:text-orange-500'}`}>
                      {saveSuccess ? <><CheckCheck className="w-4 h-4" /> Guardado!</> : <><Save className="w-4 h-4" /> Guardar</>}
                    </button>
                    <button onClick={() => copyPrompt(maestroAnalysis.final_prompt)} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                      {copySuccess ? <><CheckCheck className="w-4 h-4 text-green-400" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar Prompt</>}
                    </button>
                  </div>
                </div>
                <div className="bg-black/5 p-6 rounded-2xl font-mono text-xs select-all whitespace-pre-wrap leading-relaxed shadow-inner border border-black/5">
                  {renderSafe(maestroAnalysis.final_prompt)}
                </div>

                {maestroAnalysis.style_tags && (
                  <div className="mt-6 pt-6 border-t border-black/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Suno / Udio Style Tags</span>
                      <button onClick={() => copyPrompt(maestroAnalysis.style_tags)} className="text-[9px] font-black text-orange-600 uppercase hover:underline">
                        {copySuccess ? 'Copiado!' : 'Copiar Tags'}
                      </button>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl text-[10px] font-bold text-orange-800 border border-orange-100 italic">
                      {renderSafe(maestroAnalysis.style_tags)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#161616]/50 rounded-[40px] p-8 border border-dashed border-white/10 flex flex-col items-center justify-center min-h-[500px] text-center">
              <Settings2 className="w-16 h-16 mb-6 opacity-10 animate-[spin_10s_linear_infinite]" />
              <h3 className="text-orange-500/50 text-xs font-black uppercase tracking-[0.3em] mb-2">
                Estúdio Virtual Ativo
              </h3>
              <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                Introduz um briefing para iniciar a produção
              </p>
            </div>
          )}
        </section>
      </main>

      {/* BIBLIOTECA LOCAL */}
      {savedPrompts.length > 0 && (
        <section className="max-w-6xl mx-auto mt-20 border-t border-white/10 pt-16">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 mb-10">
            <History className="w-6 h-6 text-orange-500" /> Histórico de Sessões
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedPrompts.map(p => (
              <div key={p.id} className="bg-[#161616] border border-white/5 p-6 rounded-[30px] group relative hover:border-orange-500/30 transition-all shadow-xl">
                <button onClick={() => deleteEntry(p.id)} className="absolute top-5 right-5 text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-500/10 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="mb-4">
                  <p className="text-[9px] font-black text-orange-500 uppercase mb-1 tracking-widest">{renderSafe(p.genre)}</p>
                  <p className="text-sm text-white font-bold">{p.bpm} BPM • {renderSafe(p.key)}</p>
                </div>
                <button onClick={() => { setMaestroAnalysis(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">
                  Abrir no Estúdio
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {error && (
        <div className="fixed bottom-10 right-10 bg-red-600 text-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 z-50 font-bold">
          <AlertCircle className="w-6 h-6" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-4 hover:bg-white/20 p-2 rounded-xl transition-colors"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}

export default App;