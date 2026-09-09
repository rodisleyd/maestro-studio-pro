// src/components/AcousticGuitarModal.jsx
import React, { useState } from 'react';
import { 
  X, Sparkles, Check, Copy, CheckCheck, Sliders, 
  RotateCcw, ArrowRight, Mic, Disc3, Layers, Music, 
  Flame, Zap, Radio, Volume2
} from 'lucide-react';
import {
  ACOUSTIC_BODY_SHAPES,
  ACOUSTIC_TONEWOODS,
  ACOUSTIC_STRINGS,
  ACOUSTIC_TECHNIQUES,
  ACOUSTIC_ATTACKS,
  ACOUSTIC_TIMBRES,
  ACOUSTIC_MICS,
  ACOUSTIC_EFFECTS,
  ACOUSTIC_PRESETS,
  buildAcousticGuitarPrompt,
  buildAcousticLyricsTag
} from '../acousticGuitarData';

export default function AcousticGuitarModal({
  isOpen,
  onClose,
  currentRig,
  onApplyRig,
  onInsertLyricsTag
}) {
  const [activeTab, setActiveTab] = useState('PRESETS'); // 'PRESETS' | 'CUSTOM'
  const [customSubTab, setCustomSubTab] = useState('SHAPE'); // 'SHAPE' | 'WOOD_STRINGS' | 'TECHNIQUE' | 'STUDIO'
  const [copied, setCopied] = useState(false);
  const [tagSuccess, setTagSuccess] = useState('');

  // Estado do Rig Acústico
  const [rigState, setRigState] = useState(() => {
    if (currentRig) return { ...currentRig };
    return {
      shapeId: 'dreadnought',
      tonewoodId: 'sitka_spruce',
      stringsId: 'phosphor_bronze',
      techniqueId: 'fingerpicking',
      attackId: 'soft',
      timbreId: 'warm',
      micId: '12th_fret',
      effects: ['compressor', 'reverb_room'],
      isPreset: true,
      presetName: 'Folk & Singer-Songwriter'
    };
  });

  if (!isOpen) return null;

  // Aplica um Preset de Estúdio
  const handleSelectPreset = (preset) => {
    setRigState({
      shapeId: preset.shapeId,
      tonewoodId: preset.tonewoodId,
      stringsId: preset.stringsId,
      techniqueId: preset.techniqueId,
      attackId: preset.attackId,
      timbreId: preset.timbreId,
      micId: preset.micId,
      effects: [...preset.effects],
      isPreset: true,
      presetName: preset.name
    });
  };

  // Alterna efeito acústico
  const toggleEffect = (effectId) => {
    const exists = rigState.effects.includes(effectId);
    let updated;
    if (exists) {
      updated = rigState.effects.filter(e => e !== effectId);
    } else {
      updated = [...rigState.effects, effectId];
    }
    setRigState(prev => ({
      ...prev,
      effects: updated,
      isPreset: false,
      presetName: ''
    }));
  };

  // Objetos resolvidos para renderização
  const selectedShape = ACOUSTIC_BODY_SHAPES.find(s => s.id === rigState.shapeId) || ACOUSTIC_BODY_SHAPES[0];
  const selectedTonewood = ACOUSTIC_TONEWOODS.find(t => t.id === rigState.tonewoodId);
  const selectedStrings = ACOUSTIC_STRINGS.find(st => st.id === rigState.stringsId);
  const selectedTechnique = ACOUSTIC_TECHNIQUES.find(tc => tc.id === rigState.techniqueId);
  const selectedAttack = ACOUSTIC_ATTACKS.find(a => a.id === rigState.attackId);
  const selectedTimbre = ACOUSTIC_TIMBRES.find(tb => tb.id === rigState.timbreId);
  const selectedMic = ACOUSTIC_MICS.find(m => m.id === rigState.micId);

  const fullPromptText = buildAcousticGuitarPrompt(rigState);

  // Copia o prompt
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Aplica o Rig e fecha modal
  const handleApply = () => {
    onApplyRig({
      ...rigState,
      fullPromptText,
      displaySummary: `${selectedShape.name} • ${selectedStrings?.name || 'Aço'} • ${selectedTechnique?.name.split(' ')[0] || 'Base'}`
    });
    onClose();
  };

  // Inserir tag de letra no editor
  const handleInsertTag = (tagType) => {
    if (!onInsertLyricsTag) return;
    const tag = buildAcousticLyricsTag(rigState, tagType);
    onInsertLyricsTag(tag);
    setTagSuccess(tagType);
    setTimeout(() => setTagSuccess(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-[#111111] border border-amber-500/30 rounded-[32px] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between p-5 sm:px-8 border-b border-white/10 bg-gradient-to-r from-amber-950/30 via-[#161616] to-[#111111] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 shrink-0">
              🎸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  Acoustic Studio PRO
                </h2>
                <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Violões de Aço
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Modelagem acústica de estúdio: formatos de corpo, cordas, técnicas de dedilhado e microfonação
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
            title="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex border-b border-white/10 bg-black/40 px-5 sm:px-8 gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('PRESETS')}
            className={`py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'PRESETS'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Presets de Estúdio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CUSTOM')}
            className={`py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'CUSTOM'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Personalizar Cadeia Acústica
          </button>
        </div>

        {/* CONTEÚDO PRINCIPAL (COM SCROLL) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-8 custom-scrollbar space-y-6">
          {activeTab === 'PRESETS' ? (
            /* ================= ABA PRESETS ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Timbres Acústicos Prontos de Referência
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Selecione um preset consagrado de estúdio ou use como ponto de partida para personalizar
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {ACOUSTIC_PRESETS.map((preset) => {
                  const isSelected = rigState.isPreset && rigState.presetName === preset.name;
                  const shapeObj = ACOUSTIC_BODY_SHAPES.find(s => s.id === preset.shapeId);
                  const strObj = ACOUSTIC_STRINGS.find(s => s.id === preset.stringsId);
                  const techObj = ACOUSTIC_TECHNIQUES.find(t => t.id === preset.techniqueId);

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-500/25 via-amber-600/10 to-black border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                          : 'bg-[#141414] border-white/5 hover:border-amber-500/40 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                            {preset.name}
                          </span>
                          <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                          {preset.desc}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5 text-[8px]">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {shapeObj?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {strObj?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {techObj?.name}
                        </span>
                        {preset.effects.length > 0 && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">
                            {preset.effects.length} Efeitos
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ================= ABA CUSTOM ================= */
            <div className="space-y-6">
              {/* SUB-ABAS DA PERSONALIZAÇÃO */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/5">
                {[
                  { id: 'SHAPE', label: '1. Formato do Corpo', icon: '🎸' },
                  { id: 'WOOD_STRINGS', label: '2. Madeiras & Cordas', icon: '🪵' },
                  { id: 'TECHNIQUE', label: '3. Técnica & Pegada', icon: '🖐' },
                  { id: 'STUDIO', label: '4. Microfone & Efeitos', icon: '🎙️' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setCustomSubTab(st.id)}
                    className={`py-2 px-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      customSubTab === st.id
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{st.icon}</span>
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>

              {/* 1. FORMATO DO CORPO (SHAPE) */}
              {customSubTab === 'SHAPE' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                        Formato & Dimensão do Violão de Aço
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        O tamanho e a curvatura da caixa de ressonância determinam a resposta de graves, volume e foco
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ACOUSTIC_BODY_SHAPES.map((shape) => {
                      const isSelected = rigState.shapeId === shape.id;
                      return (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => setRigState(prev => ({ ...prev, shapeId: shape.id, isPreset: false, presetName: '' }))}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/50 shadow-lg'
                              : 'bg-[#141414] border-white/5 hover:border-amber-500/30 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{shape.icon}</span>
                                <span className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                                  {shape.name}
                                </span>
                              </div>
                              <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-white/5 text-amber-300">
                                {shape.badge}
                              </span>
                            </div>
                            <p className="text-[9px] text-amber-200/70 font-medium mb-1.5">
                              {shape.soundChar}
                            </p>
                            <p className="text-[8.5px] text-slate-400">
                              <strong className="text-slate-300">Ideal para:</strong> {shape.bestFor}
                            </p>
                          </div>
                          <div className="text-[8px] text-slate-500 mt-2 font-mono uppercase tracking-wider">
                            {shape.size}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. MADEIRAS & CORDAS */}
              {customSubTab === 'WOOD_STRINGS' && (
                <div className="space-y-6">
                  {/* Madeiras */}
                  <div>
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                      Madeira do Tampo e Caixa (Tonewoods)
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-3">
                      A densidade da madeira define o calor, os harmônicos e o brilho acústico
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ACOUSTIC_TONEWOODS.map((wood) => {
                        const isSelected = rigState.tonewoodId === wood.id;
                        return (
                          <button
                            key={wood.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, tonewoodId: wood.id, isPreset: false, presetName: '' }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-white shadow'
                                : 'bg-[#141414] border-white/5 text-slate-300 hover:border-amber-500/30'
                            }`}
                          >
                            <div className="text-[10px] font-black uppercase text-amber-300 mb-0.5">
                              {wood.name}
                            </div>
                            <div className="text-[8.5px] text-slate-400 leading-snug">
                              {wood.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cordas */}
                  <div>
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                      Tipo de Cordas de Aço
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-3">
                      A liga metálica altera radicalmente a textura e o ataque de cada nota
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ACOUSTIC_STRINGS.map((str) => {
                        const isSelected = rigState.stringsId === str.id;
                        return (
                          <button
                            key={str.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, stringsId: str.id, isPreset: false, presetName: '' }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-white shadow'
                                : 'bg-[#141414] border-white/5 text-slate-300 hover:border-amber-500/30'
                            }`}
                          >
                            <div className="text-[10px] font-black uppercase text-amber-300 mb-0.5">
                              {str.name}
                            </div>
                            <div className="text-[8.5px] text-slate-400 leading-snug">
                              {str.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TÉCNICA, ATAQUE E TIMBRE */}
              {customSubTab === 'TECHNIQUE' && (
                <div className="space-y-6">
                  {/* Técnicas de Execução */}
                  <div>
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                      Técnica de Execução (Como o violão é tocado)
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-3">
                      Do dedilhado intimista à batida percussiva ou palheta cortante
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ACOUSTIC_TECHNIQUES.map((tech) => {
                        const isSelected = rigState.techniqueId === tech.id;
                        return (
                          <button
                            key={tech.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, techniqueId: tech.id, isPreset: false, presetName: '' }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-white shadow'
                                : 'bg-[#141414] border-white/5 text-slate-300 hover:border-amber-500/30'
                            }`}
                          >
                            <span className="text-base shrink-0 mt-0.5">{tech.icon}</span>
                            <div>
                              <div className="text-[10px] font-black uppercase text-amber-300">
                                {tech.name}
                              </div>
                              <div className="text-[8.5px] text-slate-400 leading-snug mt-0.5">
                                {tech.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ataque & Timbre */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                    {/* Ataque */}
                    <div>
                      <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-2">
                        Intensidade do Ataque:
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {ACOUSTIC_ATTACKS.map((att) => (
                          <button
                            key={att.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, attackId: att.id, isPreset: false, presetName: '' }))}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              rigState.attackId === att.id
                                ? 'bg-amber-500 border-amber-500 text-black font-black'
                                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            <div className="text-[9px] font-bold">{att.name}</div>
                            <div className="text-[7px] opacity-70 leading-tight mt-0.5">{att.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Caráter do Timbre */}
                    <div>
                      <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-2">
                        Caráter do Timbre:
                      </h5>
                      <div className="grid grid-cols-3 gap-1.5">
                        {ACOUSTIC_TIMBRES.map((timbre) => (
                          <button
                            key={timbre.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, timbreId: timbre.id, isPreset: false, presetName: '' }))}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              rigState.timbreId === timbre.id
                                ? 'bg-amber-400 border-amber-400 text-black font-black'
                                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            <div className="text-[9px] font-bold">{timbre.name}</div>
                            <div className="text-[7px] opacity-70 truncate mt-0.5">{timbre.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. MICROFONE & EFEITOS DE ESTÚDIO */}
              {customSubTab === 'STUDIO' && (
                <div className="space-y-6">
                  {/* Microfonação */}
                  <div>
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                      Técnica de Microfonação em Estúdio
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-3">
                      A posição do microfone altera completamente o ataque, a presença e o ar acústico
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ACOUSTIC_MICS.map((mic) => {
                        const isSelected = rigState.micId === mic.id;
                        return (
                          <button
                            key={mic.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, micId: mic.id, isPreset: false, presetName: '' }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-white shadow'
                                : 'bg-[#141414] border-white/5 text-slate-300 hover:border-amber-500/30'
                            }`}
                          >
                            <Mic className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[10px] font-black uppercase text-amber-300">
                                {mic.name}
                              </div>
                              <div className="text-[8.5px] text-slate-400 leading-snug mt-0.5">
                                {mic.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Efeitos de Estúdio */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                        Processamento & Efeitos de Estúdio (Múltipla Escolha)
                      </h4>
                      <span className="text-[9px] text-amber-300/80 font-mono">
                        {rigState.effects.length} ativos
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {ACOUSTIC_EFFECTS.map((eff) => {
                        const isActive = rigState.effects.includes(eff.id);
                        return (
                          <button
                            key={eff.id}
                            type="button"
                            onClick={() => toggleEffect(eff.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-1.5 ${
                              isActive
                                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400 text-white shadow-sm'
                                : 'bg-[#141414] border-white/5 text-slate-400 hover:border-amber-500/30'
                            }`}
                          >
                            <div>
                              <div className="text-[9.5px] font-bold text-white flex items-center gap-1">
                                {eff.name}
                              </div>
                              <div className="text-[7.5px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                                {eff.desc}
                              </div>
                            </div>
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[8px] ${
                              isActive ? 'bg-amber-400 border-amber-400 text-black font-black' : 'border-white/20'
                            }`}>
                              {isActive ? '✓' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RODAPÉ COM RESUMO ATIVO E BOTÕES DE AÇÃO */}
        <div className="p-4 sm:px-8 border-t border-white/10 bg-[#0d0d0d] space-y-3 shrink-0">
          {/* CADEIA DE SINAL ACÚSTICA SINTETIZADA */}
          <div className="p-3 bg-black/60 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-400">
                  Cadeia Acústica:
                </span>
                <span className="text-[10px] text-white font-bold truncate">
                  {selectedShape.name} ({selectedTonewood?.name.split(' ')[0]}) • {selectedStrings?.name} • {selectedTechnique?.name.split(' ')[0]}
                </span>
              </div>
              <p className="text-[8.5px] text-slate-400 truncate max-w-2xl font-mono" title={fullPromptText}>
                {fullPromptText}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[9px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copiar prompt acústico completo"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>

              {onInsertLyricsTag && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleInsertTag('intro')}
                    className="px-2 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[8.5px] font-black uppercase transition-all cursor-pointer"
                    title="Inserir Metatag de Intro Acústica na Letra"
                  >
                    {tagSuccess === 'intro' ? '✓ Inserido!' : '+ Intro na Letra'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTag('solo')}
                    className="px-2 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[8.5px] font-black uppercase transition-all cursor-pointer"
                    title="Inserir Metatag de Solo Acústico na Letra"
                  >
                    {tagSuccess === 'solo' ? '✓ Inserido!' : '+ Solo'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BOTÕES PRINCIPAIS */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                onApplyRig(null);
                onClose();
              }}
              className="text-[9px] sm:text-[10px] font-bold text-slate-400 hover:text-red-400 underline transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Desativar Violão de Aço
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Aplicar Violão de Aço ao Projeto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
