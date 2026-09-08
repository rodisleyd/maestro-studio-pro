// src/components/GuitarRigModal.jsx
import React, { useState, useMemo } from 'react';
import { 
  X, Sparkles, Check, Copy, CheckCheck, Sliders, 
  RotateCcw, ArrowRight, Volume2, ShieldAlert, 
  Layers, Music, Flame, Zap
} from 'lucide-react';
import {
  GUITAR_MODELS,
  PICKUP_TYPES,
  PICKUP_POSITIONS,
  STUDIO_AMPLIFIERS,
  PEDALBOARD_CATEGORIES,
  GUITAR_TECHNIQUES,
  GUITAR_RIG_PRESETS,
  buildGuitarRigPrompt,
  buildGuitarLyricsTag
} from '../guitarRigData';

export default function GuitarRigModal({ 
  isOpen, 
  onClose, 
  currentRig, 
  onApplyRig, 
  onInsertLyricsTag 
}) {
  const [activeTab, setActiveTab] = useState('PRESETS'); // 'PRESETS' | 'CUSTOM'
  const [customSubTab, setCustomSubTab] = useState('GUITAR'); // 'GUITAR' | 'PICKUP' | 'AMP' | 'PEDALS' | 'TECHNIQUE'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [copied, setCopied] = useState(false);
  const [tagSuccess, setTagSuccess] = useState('');

  // Estado do Rig em Edição
  const [rigState, setRigState] = useState(() => {
    if (currentRig) return { ...currentRig };
    // Padrão: Nile Rodgers Funk/Pop
    return {
      modelId: 'stratocaster',
      pickupId: 'single_coil',
      pickupPosition: 'bridge',
      ampId: 'fender_twin',
      pedals: ['compressor', 'chorus', 'spring_reverb'],
      techniqueId: 'funk_scratch',
      isPreset: false,
      presetName: ''
    };
  });

  if (!isOpen) return null;

  // Aplica um Preset
  const handleSelectPreset = (preset) => {
    setRigState({
      modelId: preset.modelId,
      pickupId: preset.pickupId,
      pickupPosition: preset.pickupPosition,
      ampId: preset.ampId,
      pedals: [...preset.pedals],
      techniqueId: preset.techniqueId,
      isPreset: true,
      presetName: preset.name,
      tagsDescription: preset.tagsDescription
    });
  };

  // Alterna um pedal na lista de pedais selecionados
  const togglePedal = (pedalId) => {
    const exists = rigState.pedals.includes(pedalId);
    let updated;
    if (exists) {
      updated = rigState.pedals.filter(p => p !== pedalId);
    } else {
      updated = [...rigState.pedals, pedalId];
    }
    setRigState(prev => ({
      ...prev,
      pedals: updated,
      isPreset: false,
      presetName: ''
    }));
  };

  // Objetos resolvidos para visualização
  const selectedModel = GUITAR_MODELS.find(m => m.id === rigState.modelId) || GUITAR_MODELS[0];
  const selectedPickup = PICKUP_TYPES.find(p => p.id === rigState.pickupId) || PICKUP_TYPES[0];
  const selectedPosition = PICKUP_POSITIONS.find(p => p.id === rigState.pickupPosition) || PICKUP_POSITIONS[0];
  const selectedAmp = STUDIO_AMPLIFIERS.find(a => a.id === rigState.ampId) || STUDIO_AMPLIFIERS[0];
  const selectedTechnique = GUITAR_TECHNIQUES.find(t => t.id === rigState.techniqueId) || GUITAR_TECHNIQUES[0];

  const allPedalsList = Object.values(PEDALBOARD_CATEGORIES).flatMap(c => c.pedals);
  const activePedalObjects = rigState.pedals
    .map(pId => allPedalsList.find(p => p.id === pId))
    .filter(Boolean);

  const fullPromptText = buildGuitarRigPrompt(rigState);

  // Copia o prompt para o clipboard
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Aplica o rig e fecha modal
  const handleSaveAndApply = () => {
    onApplyRig({
      ...rigState,
      fullPromptText,
      displaySummary: `${selectedModel.shortName} + ${selectedAmp.shortName} (${activePedalObjects.length} pedais)`
    });
    onClose();
  };

  // Insere tag na letra
  const handleInsertTag = (tagType) => {
    const tag = buildGuitarLyricsTag(rigState, tagType);
    if (onInsertLyricsTag) {
      onInsertLyricsTag(tag);
      setTagSuccess(tagType);
      setTimeout(() => setTagSuccess(''), 2500);
    }
  };

  // Limpa/Desativa o Rig
  const handleResetRig = () => {
    onApplyRig(null);
    onClose();
  };

  // Filtro de presets por categoria
  const filteredPresets = GUITAR_RIG_PRESETS.filter(p => {
    if (selectedCategoryFilter === 'ALL') return true;
    return p.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
  });

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[70] flex items-center justify-center p-3 md:p-8 overflow-hidden animate-in fade-in duration-300">
      <div className="bg-[#0f0f11] w-full h-full md:max-w-6xl md:max-h-[90vh] md:rounded-[36px] border border-orange-500/20 shadow-[0_0_80px_rgba(249,115,22,0.15)] flex flex-col relative overflow-hidden">
        
        {/* HEADER BAR */}
        <div className="p-6 md:p-8 pb-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-orange-950/20 via-black to-amber-950/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30 text-2xl">
              🎸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                  Guitar Rig <span className="text-orange-500">PRO</span>
                </h2>
                <span className="text-[9px] font-black uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                  Tone Architect
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Engenharia de áudio: guitarras, captadores, pedaleira & amplificadores para Suno/Udio.
              </p>
            </div>
          </div>

          {/* ABAS PRINCIPAIS */}
          <div className="flex items-center gap-2 bg-black/60 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setActiveTab('PRESETS')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
                activeTab === 'PRESETS' 
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Presets de Estúdio
            </button>
            <button
              onClick={() => setActiveTab('CUSTOM')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
                activeTab === 'CUSTOM' 
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Construtor de Rig
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetRig}
              className="px-3 py-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 text-[10px] font-bold uppercase transition-all flex items-center gap-1"
              title="Desativar rig de guitarra"
            >
              <RotateCcw className="w-3 h-3" />
              Resetar
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SIGNAL CHAIN BAR (BARRA DA CADEIA DE SINAL VISUAL) */}
        <div className="px-6 py-3 bg-[#0a0a0c] border-b border-white/5 overflow-x-auto custom-scrollbar flex items-center gap-2 text-[10px]">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0 flex items-center gap-1 mr-2">
            <Volume2 className="w-3 h-3 text-orange-500" /> Sinal:
          </span>

          {/* 1. GUITARRA */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg shrink-0">
            <span className="text-xs">{selectedModel.icon}</span>
            <span className="font-bold text-slate-200">{selectedModel.shortName}</span>
            <span className="text-[8px] text-orange-400">({selectedPosition.name.split(' ')[0]})</span>
          </div>

          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />

          {/* 2. PEDAIS ATIVOS */}
          {activePedalObjects.length > 0 ? (
            activePedalObjects.map(p => (
              <React.Fragment key={p.id}>
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg shrink-0">
                  <span className="text-xs">{p.icon}</span>
                  <span className="font-bold text-amber-300">{p.name.split(' ')[0]}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              </React.Fragment>
            ))
          ) : (
            <>
              <span className="text-slate-600 italic text-[9px] shrink-0">Sem pedais</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
            </>
          )}

          {/* 3. AMPLIFICADOR */}
          <div className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 rounded-lg shrink-0">
            <span className="text-xs">{selectedAmp.icon}</span>
            <span className="font-bold text-orange-400">{selectedAmp.shortName}</span>
          </div>

          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />

          {/* 4. TÉCNICA */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg shrink-0">
            <span className="text-slate-400">🤌</span>
            <span className="font-medium text-slate-300">{selectedTechnique.name.split(' ')[0]}</span>
          </div>
        </div>

        {/* CORPO DO MODAL */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          
          {/* ABA 1: PRESETS DE ESTÚDIO */}
          {activeTab === 'PRESETS' && (
            <div className="space-y-6">
              {/* FILTRO DE CATEGORIAS */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {['ALL', 'Pop & Funk', 'Rock & Metal', 'Indie & Alt', 'Blues & Jazz'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                      selectedCategoryFilter === cat
                        ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'ALL' ? 'Todos os Estilos' : cat}
                  </button>
                ))}
              </div>

              {/* GRID DE PRESETS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredPresets.map(preset => {
                  const isCurrent = rigState.isPreset && rigState.presetName === preset.name;
                  const model = GUITAR_MODELS.find(m => m.id === preset.modelId);
                  const amp = STUDIO_AMPLIFIERS.find(a => a.id === preset.ampId);

                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between group ${
                        isCurrent
                          ? 'bg-gradient-to-b from-orange-500/20 to-black border-orange-500 shadow-xl shadow-orange-500/10'
                          : 'bg-[#141418] border-white/5 hover:border-orange-500/40 hover:bg-[#1a1a20]'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-black">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{model?.icon}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">
                            {preset.category}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors mb-2 leading-tight">
                          {preset.name}
                        </h4>

                        <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                          {preset.desc}
                        </p>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-white/5 text-[10px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-slate-500">Guitarra:</span>
                          <span className="font-bold text-slate-300">{model?.shortName}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-slate-500">Amp:</span>
                          <span className="font-bold text-orange-400">{amp?.shortName}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-slate-500">Pedais:</span>
                          <span className="font-bold text-amber-300">{preset.pedals.length} ativos</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 2: CONSTRUTOR DE RIG PERSONALIZADO */}
          {activeTab === 'CUSTOM' && (
            <div className="space-y-6">
              
              {/* SUB-NAVEGAÇÃO DAS ETAPAS */}
              <div className="flex items-center gap-1.5 p-1.5 bg-black/40 border border-white/5 rounded-2xl overflow-x-auto custom-scrollbar">
                {[
                  { id: 'GUITAR', label: '1. Modelo de Guitarra', icon: '🎸' },
                  { id: 'PICKUP', label: '2. Captadores & Posição', icon: '🧲' },
                  { id: 'AMP', label: '3. Amplificador', icon: '🔊' },
                  { id: 'PEDALS', label: `4. Pedaleira (${activePedalObjects.length})`, icon: '🔥' },
                  { id: 'TECHNIQUE', label: '5. Técnicas de Tocar', icon: '🤌' },
                ].map(step => (
                  <button
                    key={step.id}
                    onClick={() => setCustomSubTab(step.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${
                      customSubTab === step.id
                        ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{step.icon}</span>
                    <span>{step.label}</span>
                  </button>
                ))}
              </div>

              {/* ETAPA 1: MODELO DE GUITARRA */}
              {customSubTab === 'GUITAR' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {GUITAR_MODELS.map(model => {
                    const isSelected = rigState.modelId === model.id;
                    return (
                      <div
                        key={model.id}
                        onClick={() => {
                          setRigState(prev => ({
                            ...prev,
                            modelId: model.id,
                            pickupId: model.defaultPickup,
                            pickupPosition: model.pickupPosition,
                            isPreset: false,
                            presetName: ''
                          }));
                        }}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-b from-orange-500/20 to-black border-orange-500 shadow-lg shadow-orange-500/10'
                            : 'bg-[#141418] border-white/5 hover:border-orange-500/30 hover:bg-[#1a1a20]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{model.icon}</span>
                            <span className="text-[9px] font-black uppercase tracking-wider bg-white/5 text-orange-400 border border-white/10 px-2 py-0.5 rounded-md">
                              {model.badge}
                            </span>
                          </div>
                          <h4 className="text-base font-black text-white mb-1">{model.name}</h4>
                          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                            {model.soundChar}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-white/5 text-[9px] text-slate-500">
                          <span className="font-bold text-slate-400">Muito usada em:</span> {model.bestFor}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ETAPA 2: CAPTADORES & POSIÇÃO */}
              {customSubTab === 'PICKUP' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Tipo de Captador (Pickups)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PICKUP_TYPES.map(pick => {
                        const isSelected = rigState.pickupId === pick.id;
                        return (
                          <div
                            key={pick.id}
                            onClick={() => setRigState(prev => ({ ...prev, pickupId: pick.id, isPreset: false }))}
                            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                              isSelected
                                ? 'bg-orange-500/20 border-orange-500 text-white shadow-md shadow-orange-500/10'
                                : 'bg-[#141418] border-white/5 hover:border-white/20 text-slate-300'
                            }`}
                          >
                            <div className="text-xl mb-2">{pick.icon}</div>
                            <h5 className="font-bold text-white text-sm mb-1">{pick.name}</h5>
                            <p className="text-[11px] text-slate-400">{pick.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Posição da Chave Seletora
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PICKUP_POSITIONS.map(pos => {
                        const isSelected = rigState.pickupPosition === pos.id;
                        return (
                          <div
                            key={pos.id}
                            onClick={() => setRigState(prev => ({ ...prev, pickupPosition: pos.id, isPreset: false }))}
                            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/10'
                                : 'bg-[#141418] border-white/5 hover:border-white/20 text-slate-300'
                            }`}
                          >
                            <h5 className="font-bold text-white text-sm mb-1">{pos.name}</h5>
                            <p className="text-[11px] text-slate-400">{pos.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 3: AMPLIFICADORES DE ESTÚDIO */}
              {customSubTab === 'AMP' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {STUDIO_AMPLIFIERS.map(amp => {
                    const isSelected = rigState.ampId === amp.id;
                    return (
                      <div
                        key={amp.id}
                        onClick={() => setRigState(prev => ({ ...prev, ampId: amp.id, isPreset: false }))}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-b from-orange-500/20 to-black border-orange-500 shadow-lg shadow-orange-500/10'
                            : 'bg-[#141418] border-white/5 hover:border-orange-500/30 hover:bg-[#1a1a20]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{amp.icon}</span>
                            {isSelected && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-orange-500 text-black px-2 py-0.5 rounded-full">
                                Selecionado
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-black text-white mb-1">{amp.name}</h4>
                          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                            {amp.character}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-white/5 text-[9px] text-slate-500">
                          <span className="font-bold text-slate-400">Ideal para:</span> {amp.bestFor}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ETAPA 4: PEDALEIRA COMPLETA POR CATEGORIAS */}
              {customSubTab === 'PEDALS' && (
                <div className="space-y-6">
                  {Object.entries(PEDALBOARD_CATEGORIES).map(([catKey, cat]) => (
                    <div key={catKey} className="bg-black/30 p-5 rounded-2xl border border-white/5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-orange-400 mb-4 flex items-center gap-2">
                        <span className="text-base">{cat.icon}</span>
                        {cat.title}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {cat.pedals.map(pedal => {
                          const isActive = rigState.pedals.includes(pedal.id);
                          return (
                            <div
                              key={pedal.id}
                              onClick={() => togglePedal(pedal.id)}
                              className={`cursor-pointer p-4 rounded-xl border transition-all relative ${
                                isActive
                                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                                  : 'bg-[#141418] border-white/5 hover:border-white/20 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{pedal.icon}</span>
                                  <span className="font-bold text-xs text-white">{pedal.name}</span>
                                </div>
                                <div className={`w-3 h-3 rounded-full border ${
                                  isActive ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'border-slate-600 bg-transparent'
                                }`} />
                              </div>

                              <p className="text-[10px] text-slate-400 leading-tight mb-2">
                                {pedal.desc}
                              </p>

                              <div className="text-[9px] text-slate-500 flex items-center gap-1">
                                <span className="text-amber-400/80">Som:</span> {pedal.sound}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ETAPA 5: TÉCNICAS DE PERFORMANCE */}
              {customSubTab === 'TECHNIQUE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {GUITAR_TECHNIQUES.map(tech => {
                    const isSelected = rigState.techniqueId === tech.id;
                    return (
                      <div
                        key={tech.id}
                        onClick={() => setRigState(prev => ({ ...prev, techniqueId: tech.id, isPreset: false }))}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-orange-500/20 border-orange-500 text-white shadow-md shadow-orange-500/10'
                            : 'bg-[#141418] border-white/5 hover:border-white/20 text-slate-400'
                        }`}
                      >
                        <h5 className="font-bold text-white text-xs mb-1">{tech.name}</h5>
                        <p className="text-[11px] text-slate-400">{tech.desc}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER BAR (PROMPT PREVIEW & BOTÕES DE AÇÃO) */}
        <div className="p-6 border-t border-white/5 bg-[#0a0a0c] flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* TEXTO DO PROMPT GERADO */}
          <div className="w-full md:w-2/3 bg-black/50 border border-white/10 rounded-2xl p-3 px-4 flex items-center justify-between gap-3">
            <div className="truncate text-left">
              <span className="block text-[9px] font-black uppercase tracking-wider text-orange-400">
                Prompt Técnico de Áudio Gerado:
              </span>
              <span className="text-[11px] text-slate-300 font-mono truncate block" title={fullPromptText}>
                {fullPromptText || 'Selecione os parâmetros da guitarra...'}
              </span>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shrink-0"
              title="Copiar prompt da guitarra"
            >
              {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* AÇÕES */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            
            {/* BOTÃO INSERIR TAG NA LETRA */}
            <div className="relative group">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-orange-500/30 text-slate-300 hover:text-white text-[11px] font-bold uppercase transition-all flex items-center gap-1.5"
              >
                <Music className="w-3.5 h-3.5 text-orange-400" />
                <span>Tag de Letra</span>
              </button>

              {/* DROPDOWN FLUTUANTE */}
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#18181c] border border-white/10 rounded-2xl p-2 shadow-2xl hidden group-hover:block animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 py-1">
                  Inserir na Letra:
                </p>
                <button
                  onClick={() => handleInsertTag('solo')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-300 hover:bg-orange-500 hover:text-black transition-all flex items-center justify-between"
                >
                  <span>[Guitar Solo]</span>
                  {tagSuccess === 'solo' && <Check className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => handleInsertTag('riff')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-300 hover:bg-orange-500 hover:text-black transition-all flex items-center justify-between"
                >
                  <span>[Guitar Riff]</span>
                  {tagSuccess === 'riff' && <Check className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => handleInsertTag('intro')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-300 hover:bg-orange-500 hover:text-black transition-all flex items-center justify-between"
                >
                  <span>[Intro Lead]</span>
                  {tagSuccess === 'intro' && <Check className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* BOTÃO APLICAR AO MAESTRO */}
            <button
              onClick={handleSaveAndApply}
              className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-[11px] font-black uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Aplicar ao Maestro</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
