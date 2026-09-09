// src/components/KeyboardStudioModal.jsx
import React, { useState } from 'react';
import { 
  X, Sparkles, Check, Copy, CheckCheck, Sliders, 
  RotateCcw, ArrowRight, Music, Radio, Disc3, Layers, 
  Flame, Zap, Volume2, Cpu, Waves, Activity
} from 'lucide-react';
import {
  KEYBOARD_CATEGORIES,
  KEYBOARD_INSTRUMENTS,
  KEYBOARD_TECHNIQUES,
  KEYBOARD_REGISTERS,
  KEYBOARD_TIMBRES,
  KEYBOARD_ROLES,
  KEYBOARD_EFFECTS,
  KEYBOARD_PRESETS,
  buildKeyboardPrompt,
  buildKeyboardLyricsTag,
  getOrchestratorNameForInstrument
} from '../keyboardStudioData';

export default function KeyboardStudioModal({
  isOpen,
  onClose,
  currentRig,
  initialInstrumentId,
  onApplyRig,
  onInsertLyricsTag
}) {
  const [activeTab, setActiveTab] = useState('PRESETS'); // 'PRESETS' | 'CUSTOM'
  const [customSubTab, setCustomSubTab] = useState('INSTRUMENT'); // 'INSTRUMENT' | 'TIMBRE' | 'TECHNIQUE' | 'STUDIO'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copied, setCopied] = useState(false);
  const [tagSuccess, setTagSuccess] = useState('');

  // Estado do Rig de Teclado
  const [rigState, setRigState] = useState(() => {
    if (currentRig) return { ...currentRig };
    const instId = initialInstrumentId || 'fender_rhodes';
    return {
      instrumentId: instId,
      techniqueId: 'expressive_dynamic',
      registerId: 'mid_register',
      timbreId: 'warm_vintage',
      roleId: 'chordal_accompaniment',
      effects: ['stereo_phaser', 'tape_saturation', 'hall_reverb'],
      isPreset: true,
      presetName: 'Fender Rhodes Neo-Soul & Velvet Groove'
    };
  });

  // Atualiza estado quando o modal abre ou initialInstrumentId muda
  React.useEffect(() => {
    if (isOpen) {
      if (currentRig) {
        setRigState({ ...currentRig });
      } else if (initialInstrumentId) {
        setRigState(prev => ({
          ...prev,
          instrumentId: initialInstrumentId,
          isPreset: false,
          presetName: ''
        }));
        // Seleciona aba personalizada para focar no instrumento clicado
        setActiveTab('CUSTOM');
        setCustomSubTab('INSTRUMENT');
      }
    }
  }, [isOpen, currentRig, initialInstrumentId]);

  if (!isOpen) return null;

  // Aplica Preset
  const handleSelectPreset = (preset) => {
    setRigState({
      instrumentId: preset.instrumentId,
      techniqueId: preset.techniqueId,
      registerId: preset.registerId,
      timbreId: preset.timbreId,
      roleId: preset.roleId,
      effects: [...preset.effects],
      isPreset: true,
      presetName: preset.name
    });
  };

  // Alterna Efeito de Estúdio
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

  // Resolução dos objetos ativos
  const selectedInstrument = KEYBOARD_INSTRUMENTS.find(i => i.id === rigState.instrumentId) || KEYBOARD_INSTRUMENTS[0];
  const selectedTechnique = KEYBOARD_TECHNIQUES.find(t => t.id === rigState.techniqueId);
  const selectedRegister = KEYBOARD_REGISTERS.find(r => r.id === rigState.registerId);
  const selectedTimbre = KEYBOARD_TIMBRES.find(tb => tb.id === rigState.timbreId);
  const selectedRole = KEYBOARD_ROLES.find(ro => ro.id === rigState.roleId);

  const fullPromptText = buildKeyboardPrompt(rigState);

  // Copia o prompt
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Aplica o Rig e fecha modal
  const handleApply = () => {
    const targetInstrumentName = getOrchestratorNameForInstrument(rigState.instrumentId);
    onApplyRig({
      ...rigState,
      fullPromptText,
      targetInstrumentName,
      displaySummary: `${selectedInstrument.shortName} • ${selectedTimbre?.name.split(' ')[0] || 'Quente'} • ${selectedRole?.name.split(' ')[0] || 'Base'}`
    });
    onClose();
  };

  // Inserir tag de letra no editor
  const handleInsertTag = (tagType) => {
    if (!onInsertLyricsTag) return;
    const tag = buildKeyboardLyricsTag(rigState, tagType);
    onInsertLyricsTag(tag);
    setTagSuccess(tagType);
    setTimeout(() => setTagSuccess(''), 2500);
  };

  // Filtragem dos instrumentos pela categoria
  const filteredInstruments = selectedCategory === 'all'
    ? KEYBOARD_INSTRUMENTS
    : KEYBOARD_INSTRUMENTS.filter(inst => inst.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-[#111111] border border-cyan-500/30 rounded-[32px] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between p-5 sm:px-8 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-[#161616] to-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
              🎹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  Keyboard Studio PRO
                </h2>
                <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                  Pianos, Órgãos & Synths
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Modelagem sonora de teclados: pianos acústicos e elétricos, órgãos vintage, sintetizadores analógicos e workstations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex border-b border-white/10 bg-black/40 px-5 sm:px-8 gap-2 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('PRESETS')}
            className={`py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'PRESETS'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Presets de Estúdio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CUSTOM')}
            className={`py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'CUSTOM'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Personalizar Teclado
          </button>
        </div>

        {/* CONTEÚDO PRINCIPAL (COM SCROLL) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar space-y-6">
          {activeTab === 'PRESETS' ? (
            /* ================= ABA PRESETS ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                    Timbres de Teclado Consagrados da Música Moderna
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Selecione um som de estúdio lendário calibrado para guiar a inteligência musical com perfeição
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {KEYBOARD_PRESETS.map((preset) => {
                  const isSelected = rigState.isPreset && rigState.presetName === preset.name;
                  const instObj = KEYBOARD_INSTRUMENTS.find(i => i.id === preset.instrumentId);
                  const timbreObj = KEYBOARD_TIMBRES.find(t => t.id === preset.timbreId);
                  const roleObj = KEYBOARD_ROLES.find(r => r.id === preset.roleId);

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-500/25 via-blue-600/10 to-black border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl'
                          : 'bg-[#141414] border-white/5 hover:border-cyan-500/40 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                            <span>{instObj?.icon}</span>
                            <span>{preset.name}</span>
                          </span>
                          <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                          {preset.desc}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5 text-[8px]">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {instObj?.shortName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {timbreObj?.name.split(' ')[0]}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {roleObj?.name.split(' ')[0]}
                        </span>
                        {preset.effects.length > 0 && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">
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
              {/* SUB-ABAS DE PERSONALIZAÇÃO */}
              <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
                {[
                  { id: 'INSTRUMENT', label: '1. Instrumento & Modelo', icon: <Disc3 className="w-3.5 h-3.5" /> },
                  { id: 'TIMBRE', label: '2. Timbre & Registro', icon: <Waves className="w-3.5 h-3.5" /> },
                  { id: 'TECHNIQUE', label: '3. Técnica & Função Musical', icon: <Activity className="w-3.5 h-3.5" /> },
                  { id: 'STUDIO', label: '4. Efeitos de Estúdio', icon: <Cpu className="w-3.5 h-3.5" /> }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setCustomSubTab(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      customSubTab === sub.id
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {sub.icon}
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* SUB-ABA 1: INSTRUMENTO & MODELO */}
              {customSubTab === 'INSTRUMENT' && (
                <div className="space-y-4">
                  {/* FILTRO DE CATEGORIAS */}
                  <div className="flex flex-wrap gap-1.5">
                    {KEYBOARD_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1 rounded-xl text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          selectedCategory === cat.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-[#141414] text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredInstruments.map((inst) => {
                      const isSelected = rigState.instrumentId === inst.id;
                      return (
                        <button
                          key={inst.id}
                          type="button"
                          onClick={() => setRigState(prev => ({ ...prev, instrumentId: inst.id, isPreset: false, presetName: '' }))}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                            isSelected
                              ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg'
                              : 'bg-[#141414] border-white/5 hover:border-cyan-500/40 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                                <span className="text-sm">{inst.icon}</span>
                                <span>{inst.name}</span>
                              </span>
                              <span className="px-2 py-0.5 text-[7.5px] font-black uppercase rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0">
                                {inst.badge}
                              </span>
                            </div>
                            <p className="text-[9.5px] text-slate-300 font-medium leading-relaxed mb-2">
                              {inst.soundChar}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-white/5 flex items-center gap-1 text-[8.5px] text-slate-400">
                            <span className="text-cyan-400 font-bold shrink-0">Ideal para:</span>
                            <span className="truncate">{inst.bestFor}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB-ABA 2: TIMBRE & REGISTRO */}
              {customSubTab === 'TIMBRE' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2">
                      Caráter Tímbrico & Textura Sonora
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-3">
                      Define a coloração tonal, densidade harmônica e textura do teclado
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {KEYBOARD_TIMBRES.map((tb) => {
                        const isSelected = rigState.timbreId === tb.id;
                        return (
                          <button
                            key={tb.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, timbreId: tb.id, isPreset: false, presetName: '' }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                                : 'bg-[#141414] border-white/5 text-slate-400 hover:border-cyan-500/30'
                            }`}
                          >
                            <div className="text-[10px] font-black text-white flex items-center justify-between">
                              <span>{tb.name}</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                            </div>
                            <p className="text-[8.5px] text-slate-400 mt-1 leading-relaxed">
                              {tb.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2">
                      Registro de Oitava & Extensão Musical
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-3">
                      Posicionamento das notas na escala de frequências para encaixar na mix
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {KEYBOARD_REGISTERS.map((reg) => {
                        const isSelected = rigState.registerId === reg.id;
                        return (
                          <button
                            key={reg.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, registerId: reg.id, isPreset: false, presetName: '' }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                                : 'bg-[#141414] border-white/5 text-slate-400 hover:border-cyan-500/30'
                            }`}
                          >
                            <div className="text-[10px] font-black text-white flex items-center justify-between">
                              <span>{reg.name}</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                            </div>
                            <p className="text-[8.5px] text-slate-400 mt-1 leading-relaxed">
                              {reg.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-ABA 3: TÉCNICA & FUNÇÃO MUSICAL */}
              {customSubTab === 'TECHNIQUE' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2">
                      Técnica de Execução & Ataque
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-3">
                      Como o músico toca as teclas (dinâmica, staccato, arpejo, legato com portamento)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {KEYBOARD_TECHNIQUES.map((tech) => {
                        const isSelected = rigState.techniqueId === tech.id;
                        return (
                          <button
                            key={tech.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, techniqueId: tech.id, isPreset: false, presetName: '' }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                                : 'bg-[#141414] border-white/5 text-slate-400 hover:border-cyan-500/30'
                            }`}
                          >
                            <div className="text-[10px] font-black text-white flex items-center justify-between">
                              <span>{tech.name}</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                            </div>
                            <p className="text-[8.5px] text-slate-400 mt-1 leading-relaxed">
                              {tech.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2">
                      Função Musical no Arranjo
                    </h4>
                    <p className="text-[10px] text-slate-400 mb-3">
                      O papel fundamental desempenhado pelo teclado na estrutura da produção
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {KEYBOARD_ROLES.map((role) => {
                        const isSelected = rigState.roleId === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, roleId: role.id, isPreset: false, presetName: '' }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                                : 'bg-[#141414] border-white/5 text-slate-400 hover:border-cyan-500/30'
                            }`}
                          >
                            <div className="text-[10px] font-black text-white flex items-center justify-between">
                              <span>{role.name}</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                            </div>
                            <p className="text-[8.5px] text-slate-400 mt-1 leading-relaxed">
                              {role.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-ABA 4: EFEITOS DE ESTÚDIO */}
              {customSubTab === 'STUDIO' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                        Processamento & Efeitos de Estúdio (Múltipla Escolha)
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Ative múltiplos processadores para moldar a acústica, modulação e textura final
                      </p>
                    </div>
                    <span className="text-[9px] text-cyan-300/80 font-mono">
                      {rigState.effects.length} ativos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {KEYBOARD_EFFECTS.map((eff) => {
                      const isActive = rigState.effects.includes(eff.id);
                      return (
                        <button
                          key={eff.id}
                          type="button"
                          onClick={() => toggleEffect(eff.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-1.5 ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 text-white shadow-sm'
                              : 'bg-[#141414] border-white/5 text-slate-400 hover:border-cyan-500/30'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9.5px] font-bold text-white">
                                {eff.name}
                              </span>
                            </div>
                            <span className="text-[7.5px] font-bold text-cyan-400/80 uppercase">
                              {eff.category}
                            </span>
                            <div className="text-[7.5px] text-slate-400 leading-tight mt-1 line-clamp-2">
                              {eff.desc}
                            </div>
                          </div>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[8px] ${
                            isActive ? 'bg-cyan-400 border-cyan-400 text-black font-black' : 'border-white/20'
                          }`}>
                            {isActive ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RODAPÉ COM RESUMO ATIVO E BOTÕES DE AÇÃO */}
        <div className="p-4 sm:px-8 border-t border-white/10 bg-[#0d0d0d] space-y-3">
          {/* CADEIA DE SINAL SINTETIZADA */}
          <div className="p-3 bg-black/60 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400">
                  Cadeia de Teclado:
                </span>
                <span className="text-[10px] text-white font-bold truncate">
                  {selectedInstrument.shortName} • {selectedTimbre?.name.split(' ')[0]} • {selectedTechnique?.name.split(' ')[0]} • {selectedRole?.name.split(' ')[0]}
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
                title="Copiar prompt completo de teclado"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>

              {onInsertLyricsTag && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleInsertTag('intro')}
                    className="px-2 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[8.5px] font-black uppercase transition-all cursor-pointer"
                    title="Inserir Metatag de Intro na Letra"
                  >
                    {tagSuccess === 'intro' ? '✓ Inserido!' : '+ Intro na Letra'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTag('solo')}
                    className="px-2 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[8.5px] font-black uppercase transition-all cursor-pointer"
                    title="Inserir Metatag de Solo na Letra"
                  >
                    {tagSuccess === 'solo' ? '✓ Inserido!' : '+ Solo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTag('breakdown')}
                    className="px-2 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[8.5px] font-black uppercase transition-all cursor-pointer"
                    title="Inserir Metatag de Breakdown na Letra"
                  >
                    {tagSuccess === 'breakdown' ? '✓ Inserido!' : '+ Breakdown'}
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
              Desativar Teclado
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
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Aplicar Teclado ao Projeto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
