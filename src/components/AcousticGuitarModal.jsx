// src/components/AcousticGuitarModal.jsx
import React, { useState } from 'react';
import { 
  X, Sparkles, Check, Copy, CheckCheck, Sliders, 
  RotateCcw, ArrowRight, Mic, Disc3, Layers, Music, 
  Flame, Zap, Radio, Volume2, Anchor, Hash, ArrowUpDown, 
  Info, Lightbulb, Compass, HelpCircle
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
  ACOUSTIC_TUNINGS,
  ACOUSTIC_CAPO_FRETS,
  CAGED_OPEN_SHAPES,
  CHROMATIC_NOTES,
  transposeChord,
  transposeProgression,
  getSoundingKeyFromShape,
  suggestCapoPositions,
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
  const [customSubTab, setCustomSubTab] = useState('SHAPE'); // 'SHAPE' | 'WOOD_STRINGS' | 'TECHNIQUE' | 'CAPO_TUNING' | 'STUDIO'
  const [copied, setCopied] = useState(false);
  const [tagSuccess, setTagSuccess] = useState('');
  const [finderTargetKey, setFinderTargetKey] = useState('Eb');

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
      tuningId: 'standard',
      capoFret: 2,
      cagedShapeId: 'G',
      progressionInput: 'G - D - Em - C',
      transposedProgression: 'A - E - F#m - D',
      concertKey: 'A Major',
      effects: ['compressor', 'reverb_room'],
      isPreset: true,
      presetName: 'Folk & Singer-Songwriter'
    };
  });

  if (!isOpen) return null;

  // Aplica um Preset de Estúdio
  const handleSelectPreset = (preset) => {
    const capoFret = preset.capoFret !== undefined ? preset.capoFret : 0;
    const cagedShapeId = preset.cagedShapeId || 'G';
    const defaultProg = cagedShapeId === 'C' ? 'C - G - Am - F' : 'G - D - Em - C';
    const transposed = transposeProgression(defaultProg, capoFret);
    const sounding = getSoundingKeyFromShape(cagedShapeId, capoFret);

    setRigState({
      shapeId: preset.shapeId,
      tonewoodId: preset.tonewoodId,
      stringsId: preset.stringsId,
      techniqueId: preset.techniqueId,
      attackId: preset.attackId,
      timbreId: preset.timbreId,
      micId: preset.micId,
      tuningId: preset.tuningId || 'standard',
      capoFret,
      cagedShapeId,
      progressionInput: defaultProg,
      transposedProgression: transposed,
      concertKey: capoFret > 0 ? `${sounding} Major` : '',
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

  // Manipulador de mudança de casa do Capotraste
  const handleCapoChange = (newFret) => {
    const fretNum = Number(newFret);
    const shapeId = rigState.cagedShapeId || 'G';
    const sounding = getSoundingKeyFromShape(shapeId, fretNum);
    const transposedProg = rigState.progressionInput 
      ? transposeProgression(rigState.progressionInput, fretNum)
      : '';

    setRigState(prev => ({
      ...prev,
      capoFret: fretNum,
      transposedProgression: transposedProg,
      concertKey: fretNum > 0 ? `${sounding} Major` : '',
      isPreset: false,
      presetName: ''
    }));
  };

  // Manipulador de mudança do Shape Aberto (CAGED)
  const handleShapeChange = (shapeId) => {
    const fretNum = Number(rigState.capoFret) || 0;
    const sounding = getSoundingKeyFromShape(shapeId, fretNum);
    let newProg = rigState.progressionInput;
    if (shapeId === 'C') newProg = 'C - G - Am - F';
    else if (shapeId === 'G') newProg = 'G - D - Em - C';
    else if (shapeId === 'D') newProg = 'D - A - Bm - G';
    else if (shapeId === 'E') newProg = 'E - B - C#m - A';
    else if (shapeId === 'A') newProg = 'A - E - F#m - D';
    else if (shapeId === 'Am') newProg = 'Am - F - C - G';
    else if (shapeId === 'Em') newProg = 'Em - C - G - D';
    else if (shapeId === 'Dm') newProg = 'Dm - Bb - F - C';

    const transposedProg = transposeProgression(newProg, fretNum);

    setRigState(prev => ({
      ...prev,
      cagedShapeId: shapeId,
      progressionInput: newProg,
      transposedProgression: transposedProg,
      concertKey: fretNum > 0 ? `${sounding} Major` : '',
      isPreset: false,
      presetName: ''
    }));
  };

  // Manipulador de digitação da progressão de acordes
  const handleProgressionChange = (val) => {
    const fretNum = Number(rigState.capoFret) || 0;
    const transposedProg = transposeProgression(val, fretNum);
    setRigState(prev => ({
      ...prev,
      progressionInput: val,
      transposedProgression: transposedProg,
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
  const selectedTuning = ACOUSTIC_TUNINGS.find(t => t.id === rigState.tuningId) || ACOUSTIC_TUNINGS[0];
  const selectedCapo = ACOUSTIC_CAPO_FRETS.find(c => c.fret === (Number(rigState.capoFret) || 0)) || ACOUSTIC_CAPO_FRETS[0];
  const selectedCagedShape = CAGED_OPEN_SHAPES.find(s => s.id === rigState.cagedShapeId) || CAGED_OPEN_SHAPES[0];
  const currentSoundingKey = getSoundingKeyFromShape(selectedCagedShape.id, Number(rigState.capoFret) || 0);

  const fullPromptText = buildAcousticGuitarPrompt(rigState);

  // Copia o prompt
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Aplica o Rig e fecha modal
  const handleApply = () => {
    const capoFret = Number(rigState.capoFret) || 0;
    const tuningObj = ACOUSTIC_TUNINGS.find(t => t.id === rigState.tuningId) || ACOUSTIC_TUNINGS[0];
    const openShapeObj = CAGED_OPEN_SHAPES.find(s => s.id === rigState.cagedShapeId);

    let capoPart = '';
    if (capoFret > 0) {
      if (openShapeObj) {
        const sounding = getSoundingKeyFromShape(openShapeObj.id, capoFret);
        capoPart = `Capo ${capoFret}ª (${openShapeObj.id} ➔ ${sounding})`;
      } else {
        capoPart = `Capo ${capoFret}ª`;
      }
    }

    const summaryParts = [
      selectedShape.name,
      selectedStrings?.name || 'Aço',
      capoPart,
      tuningObj.id !== 'standard' ? tuningObj.name.split(' ')[0] : null,
      selectedTechnique?.name.split(' ')[0] || 'Base'
    ].filter(Boolean);

    onApplyRig({
      ...rigState,
      fullPromptText,
      displaySummary: summaryParts.join(' • ')
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
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/5">
                {[
                  { id: 'SHAPE', label: '1. Formato', icon: '🎸' },
                  { id: 'WOOD_STRINGS', label: '2. Madeiras/Cordas', icon: '🪵' },
                  { id: 'TECHNIQUE', label: '3. Técnica/Pegada', icon: '🖐' },
                  { id: 'CAPO_TUNING', label: '4. Capotraste & Tom', icon: '⚡' },
                  { id: 'STUDIO', label: '5. Microfones & FX', icon: '🎙️' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setCustomSubTab(st.id)}
                    className={`py-2 px-2 rounded-xl text-[9px] sm:text-[9.5px] font-black uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      customSubTab === st.id
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{st.icon}</span>
                    <span className="truncate">{st.label}</span>
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

              {/* 4. CAPOTRASTE & AFINAÇÃO INTELIGENTE (SMART CAPO) */}
              {customSubTab === 'CAPO_TUNING' && (
                <div className="space-y-6">
                  {/* Cabeçalho da Seção */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider">
                          Smart Capo Engine
                        </span>
                        <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                          Capotraste & Transposição Harmônica
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        O Suno v6 reage ao timbre característico de capotraste e à física das cordas soltas. O Maestro calcula o <strong>Tom Real</strong> exato para o modelo não errar a harmonia.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCapoChange(0)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all cursor-pointer ${
                          rigState.capoFret === 0
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'bg-black/40 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                        }`}
                      >
                        Sem Capo (Aberto)
                      </button>
                    </div>
                  </div>

                  {/* 1. BRAÇO DE VIOLÃO INTERATIVO (FRETBOARD COM CAPO VISUAL) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                          Braço do Violão (Posição do Capotraste)
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          Clique na casa desejada
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                        {selectedCapo.name}
                      </span>
                    </div>

                    {/* Visual Fretboard */}
                    <div className="p-3.5 bg-gradient-to-b from-[#1c140e] to-[#0f0b08] rounded-2xl border border-amber-900/40 shadow-inner overflow-x-auto custom-scrollbar">
                      <div className="min-w-[620px] relative py-2 select-none">
                        {/* 6 Cordas do Violão com espessuras e brilhos realistas */}
                        <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between py-6 pointer-events-none z-0 opacity-80">
                          {/* 6ª corda E (grossa, bronze) */}
                          <div className="h-[3px] bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 shadow-sm" />
                          {/* 5ª corda A */}
                          <div className="h-[2.5px] bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600" />
                          {/* 4ª corda D */}
                          <div className="h-[2px] bg-gradient-to-r from-amber-500 via-amber-200 to-amber-600" />
                          {/* 3ª corda G */}
                          <div className="h-[1.5px] bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500" />
                          {/* 2ª corda B (aço prateado fino) */}
                          <div className="h-[1.2px] bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400" />
                          {/* 1ª corda E aguda (aço fino cristalino) */}
                          <div className="h-[1px] bg-gradient-to-r from-slate-400 via-white to-slate-400 shadow-sm" />
                        </div>

                        {/* Grade de Casas (0 a 7) */}
                        <div className="grid grid-cols-8 relative z-10 gap-1">
                          {ACOUSTIC_CAPO_FRETS.map((capo) => {
                            const isCurrent = Number(rigState.capoFret) === capo.fret;
                            return (
                              <button
                                key={capo.fret}
                                type="button"
                                onClick={() => handleCapoChange(capo.fret)}
                                className={`relative h-24 rounded-xl border flex flex-col items-center justify-between p-2 transition-all cursor-pointer group ${
                                  isCurrent
                                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50'
                                    : 'bg-black/50 border-white/10 hover:border-amber-500/50 hover:bg-black/70'
                                }`}
                              >
                                {/* Número do Traste */}
                                <div className="flex items-center justify-between w-full">
                                  <span className={`text-[9px] font-black uppercase ${
                                    isCurrent ? 'text-amber-300' : 'text-slate-400 group-hover:text-amber-400'
                                  }`}>
                                    {capo.fret === 0 ? 'Aberto' : `${capo.fret}ª`}
                                  </span>
                                  {/* Ponto / Inlay nos trastes 3, 5, 7 */}
                                  {[3, 5, 7].includes(capo.fret) && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300/40" title="Traste Marcado" />
                                  )}
                                </div>

                                {/* Capotraste visual fixado */}
                                {isCurrent ? (
                                  <div className="relative flex flex-col items-center w-full my-auto animate-in zoom-in-75 duration-150">
                                    <div className="w-full h-7 rounded-md bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border border-amber-200 shadow-md flex items-center justify-center text-black font-black text-[9px] uppercase tracking-wider">
                                      {capo.fret === 0 ? 'Sem Capo' : `CAPO ${capo.fret}`}
                                    </div>
                                    {capo.fret > 0 && (
                                      <div className="w-1.5 h-3 bg-amber-600 rounded-b-sm -mt-0.5" />
                                    )}
                                  </div>
                                ) : (
                                  <div className="my-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-bold text-amber-300/80 bg-black/60 px-1.5 py-0.5 rounded">
                                      Fixar
                                    </span>
                                  </div>
                                )}

                                {/* Rótulo inferior */}
                                <div className={`text-[7.5px] font-mono uppercase tracking-tight text-center truncate w-full ${
                                  isCurrent ? 'text-amber-300 font-bold' : 'text-slate-500'
                                }`}>
                                  {capo.fret === 0 ? '0 Semitons' : `+${capo.fret} Semitons`}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Detalhes da Casa Selecionada */}
                    <div className="mt-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-black text-xs shrink-0">
                          {rigState.capoFret === 0 ? '0' : `C${rigState.capoFret}`}
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-amber-300 uppercase flex items-center gap-1.5">
                            <span>{selectedCapo.name}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-white">{selectedCapo.register}</span>
                          </div>
                          <div className="text-[8.5px] text-slate-400">
                            {selectedCapo.toneDesc}
                          </div>
                        </div>
                      </div>

                      {selectedCapo.promptTag && (
                        <div className="px-2.5 py-1 rounded-lg bg-black/50 border border-amber-500/20 text-[8px] font-mono text-amber-200/90 shrink-0">
                          "{selectedCapo.promptTag}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. SISTEMA CAGED & CALCULADORA HARMÔNICA INTERMEDIÁRIA */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Coluna 1: Formatos de Acordes Abertos (CAGED) */}
                    <div className="lg:col-span-6 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                          Formato de Digitação Aberta (CAGED Shapes)
                        </h5>
                        <span className="text-[8.5px] text-slate-400">
                          Posição das mãos
                        </span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
                        {CAGED_OPEN_SHAPES.map((shape) => {
                          const isSelected = rigState.cagedShapeId === shape.id;
                          const sounding = getSoundingKeyFromShape(shape.id, Number(rigState.capoFret) || 0);
                          return (
                            <button
                              key={shape.id}
                              type="button"
                              onClick={() => handleShapeChange(shape.id)}
                              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-gradient-to-br from-amber-500/25 to-orange-500/10 border-amber-400 ring-1 ring-amber-400/50 shadow'
                                  : 'bg-[#141414] border-white/5 hover:border-amber-500/30'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                  {shape.id}
                                </span>
                                <span className="text-[7.5px] font-bold text-amber-300">
                                  ➔ {sounding}
                                </span>
                              </div>
                              <span className="text-[7px] text-slate-400 truncate mt-1">
                                {shape.name.split(' ')[1]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[8.5px] text-slate-400 leading-relaxed">
                        <strong className="text-amber-300">{selectedCagedShape.name}:</strong> {selectedCagedShape.desc}
                      </p>
                    </div>

                    {/* Coluna 2: Transposição em Tempo Real (Shape Tocado vs Som Real) */}
                    <div className="lg:col-span-6 p-4 rounded-2xl bg-black/60 border border-amber-500/25 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1.5">
                          <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                          Transposição em Tempo Real (Concert Pitch)
                        </span>
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Suno Ready
                        </span>
                      </div>

                      {/* Display Duplo: Digitação vs Som Real */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                          <div className="text-[8px] font-bold text-slate-400 uppercase">
                            Digitação (Shape Tocado)
                          </div>
                          <div className="text-base font-black text-white mt-0.5">
                            Formato {selectedCagedShape.id}
                          </div>
                          <div className="text-[8px] text-amber-300/80 font-mono mt-0.5">
                            {rigState.capoFret === 0 ? 'Sem Capo' : `Capo na ${rigState.capoFret}ª Casa`}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 shadow-md">
                          <div className="text-[8px] font-bold text-amber-300 uppercase">
                            Som Real (Afinação da Música)
                          </div>
                          <div className="text-base font-black text-amber-300 mt-0.5">
                            Tom: {currentSoundingKey}
                          </div>
                          <div className="text-[8px] text-slate-300 font-mono mt-0.5">
                            Concert Key p/ Suno v6
                          </div>
                        </div>
                      </div>

                      {/* Campo de Progressão Harmônica */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold text-slate-300 uppercase">
                            Progressão de Acordes (Mão Esquerda):
                          </label>
                          <span className="text-[8px] text-slate-400">Ex: C – G – Am – F</span>
                        </div>
                        <input
                          type="text"
                          value={rigState.progressionInput || ''}
                          onChange={(e) => handleProgressionChange(e.target.value)}
                          placeholder="Ex: C - G - Am - F"
                          className="w-full bg-[#111] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none"
                        />
                      </div>

                      {/* Resultado Transposto Calculado */}
                      <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
                        <div className="flex items-center justify-between text-[8px] font-bold uppercase text-amber-300 mb-0.5">
                          <span>Acordes Reais que o Suno Soará:</span>
                          {rigState.capoFret > 0 && (
                            <span className="text-slate-400">+{rigState.capoFret} Semitons</span>
                          )}
                        </div>
                        <div className="text-xs font-black font-mono text-white">
                          {rigState.transposedProgression || '—'}
                        </div>
                        <p className="text-[8px] text-slate-400 mt-1">
                          O Suno receberá tanto a textura das cordas abertas quanto a progressão transposta para não haver choque de notas com baixo, voz e teclados.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. ASSISTENTE DE TONALIDADE (QUAL CAPO USAR PARA O TOM DA MÚSICA) */}
                  <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <h5 className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                          Assistente de Arranjo: "Tenho o Tom da Música, Qual Capo Usar?"
                        </h5>
                      </div>
                      <span className="text-[8.5px] text-slate-400">
                        Escolha o tom da sua canção e o Maestro calcula o melhor shape aberto
                      </span>
                    </div>

                    {/* Seletor rápido de Tom da Canção */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                      {['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'].map((keyNote) => (
                        <button
                          key={keyNote}
                          type="button"
                          onClick={() => setFinderTargetKey(keyNote)}
                          className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase transition-all shrink-0 cursor-pointer ${
                            finderTargetKey === keyNote
                              ? 'bg-amber-400 text-black shadow'
                              : 'bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {keyNote}
                        </button>
                      ))}
                    </div>

                    {/* Recomendações calculadas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                      {suggestCapoPositions(finderTargetKey).slice(0, 3).map((sug, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-white">
                                {sug.fret === 0 ? 'Sem Capo' : `Capo na ${sug.fret}ª Casa`}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[8px] font-black uppercase">
                                Shape {sug.shape.id}
                              </span>
                            </div>
                            <p className="text-[8px] text-slate-400 mt-1">
                              {sug.recommendation}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleCapoChange(sug.fret);
                              handleShapeChange(sug.shape.id);
                            }}
                            className="w-full py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[8px] font-bold uppercase transition-colors cursor-pointer"
                          >
                            Usar Esta Combinação
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. AFINAÇÕES ALTERNATIVAS DE ESTÚDIO */}
                  <div>
                    <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-2">
                      Afinação Base das Cordas (Tunings)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {ACOUSTIC_TUNINGS.map((tuning) => {
                        const isSelected = rigState.tuningId === tuning.id;
                        return (
                          <button
                            key={tuning.id}
                            type="button"
                            onClick={() => setRigState(prev => ({ ...prev, tuningId: tuning.id, isPreset: false, presetName: '' }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-white shadow'
                                : 'bg-[#141414] border-white/5 text-slate-300 hover:border-amber-500/30'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9.5px] font-black uppercase text-amber-300">
                                  {tuning.name.split(' (')[0]}
                                </span>
                                <span className="text-[7.5px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 font-mono">
                                  {tuning.badge}
                                </span>
                              </div>
                              <div className="text-[8px] text-slate-400 leading-snug">
                                {tuning.desc}
                              </div>
                            </div>
                            <div className="text-[7.5px] text-amber-400/90 font-mono mt-2 pt-1 border-t border-white/5">
                              {tuning.notes}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. MICROFONE & EFEITOS DE ESTÚDIO */}
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
                  {selectedShape.name} ({selectedTonewood?.name.split(' ')[0]})
                  {rigState.capoFret > 0 ? ` • Capo ${rigState.capoFret}ª (${selectedCagedShape.id} ➔ ${currentSoundingKey})` : ''}
                  {selectedTuning.id !== 'standard' ? ` • ${selectedTuning.name.split(' (')[0]}` : ''}
                  {` • ${selectedStrings?.name || 'Aço'} • ${selectedTechnique?.name.split(' ')[0] || 'Base'}`}
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
