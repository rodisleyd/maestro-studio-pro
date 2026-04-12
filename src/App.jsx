import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Wand2, Settings2, Play, Copy, CheckCheck, AlertCircle, 
  Layers, Mic2, ArrowRight, Search, Upload, 
  FileAudio, Activity, X, Save, Trash2, History, RotateCcw,
  ChevronDown, ChevronUp, Star, Edit3, Sparkles, Copy as CopyIcon, 
  Split, Award
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

const ALL_GENRES = [
  "Afrobeat", "Alternative", "Ambient", "Balada Pop", "Bluegrass", "Blues", "Bossa Nova", "Brega", 
  "Chillwave", "Classical", "Cordel", "Country", "Dancehall", "Disco", "Drum & Bass", "Dubstep", 
  "Electronic", "Flamenco", "Folk", "Funk", "Garage Rock", "Gospel", "Grunge", "Hardstyle", 
  "Hip-Hop", "House", "Indie", "Indie Pop", "Indie Rock", "Industrial", "Instrumental", "J-Pop", 
  "Jazz", "K-Pop", "Klezmer", "Latin", "Lo-Fi", "Math Rock", "Metal", "MPB", "New Wave", 
  "Ópera", "Pagode", "Phonk", "Podcast", "Pop", "Post-Rock", "Psychedelic Rock", "Punk", "R&B", 
  "Rap", "Reggae", "Reggaeton", "Rock", "Samba", "Sertanejo", "Ska", "Soul", "Soundtrack", 
  "Surf Music", "Synthwave", "Tango", "Techno", "Trance", "Trap", "Valsa", "Vaporwave"
];

// Constantes de Configuração Profissional (Inspirado no Magic Prompt)
const VOCAL_ARCHETYPES = [
  { id: 'Modern Pop', label: 'Modern Pop', desc: 'Limpo e produzido' },
  { id: 'Rock Grit', label: 'Rock Grit', desc: 'Energia e drive' },
  { id: 'Intimate Folk', label: 'Intimate Folk', desc: 'Suave e acústico' },
  { id: 'Deep Soul', label: 'Deep Soul', desc: 'Grave e emotivo' },
  { id: 'Dreamy Pop', label: 'Dreamy Pop', desc: 'Etéreo e com ar' },
  { id: 'Soulful R&B', label: 'Soulful R&B', desc: 'Seda e veludo' },
  { id: 'Child Vocal', label: 'Child Vocal', desc: 'Juvenil e inocente' },
  { id: 'Spoken Narrator', label: 'Male Narrator', desc: 'Fala/Narração (Homem)' },
  { id: 'Female Narrator', label: 'Female Narrator', desc: 'Fala/Narração (Mulher)' },
  { id: 'Child Narrator', label: 'Child Narrator', desc: 'Fala/Narração (Criança)' },
];

const BPM_RANGES = [
  { id: 'LENTO', label: 'LENTO (60-80)' },
  { id: 'MÉDIO', label: 'MÉDIO (90-110)' },
  { id: 'MODERADO', label: 'MODERADO (110-130)' },
  { id: 'RÁPIDO', label: 'RÁPIDO (130-160)' },
  { id: 'MUITO RÁPIDO', label: 'MUITO RÁPIDO (160+)' }
];

const TIME_SIGNATURES = ['4/4', '3/4', '6/8', '2/4', '5/4', '7/8'];

const VOCAL_TONES = [
  { id: 'grave', label: 'Grave', value: 'deep voice, low-pitched vocals' },
  { id: 'normal', label: 'Normal', value: '' },
  { id: 'agudo', label: 'Agudo', value: 'high-pitched voice, higher tone' }
];

const VOCAL_TEXTURES = [
  { id: 'limpa', label: 'Limpa', value: 'clean crystal clear vocals' },
  { id: 'rustica', label: 'Rústica', value: 'raw unpolished gravelly texture' },
  { id: 'rouca', label: 'Rouca', value: 'raspy hoarse husky vocals' }
];


const MUSICAL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALES = ['MAIOR', 'MENOR NATURAL', 'MENOR HARMÔNICA', 'MENOR MELÓDICA', 'PENTATÔNICA', 'BLUES'];

const CHORD_PROGRESSIONS = [
  { id: 'POP', label: 'I-V-VI-IV (POP)' },
  { id: 'ROCK', label: 'I-IV-V (ROCK)' },
  { id: 'JAZZ', label: 'II-V-I (JAZZ)' },
  { id: 'EMOCIONAL', label: 'VI-IV-I-V (EMOCIONAL)' }
];

const GROOVES = ['STRAIGHT', 'SWING', 'SHUFFLE', 'FUNK GROOVE', 'HALF-TIME', 'DOUBLE-TIME'];

const EMOTIONS = ['ALEGRE', 'MELANCÓLICO', 'TENSO', 'ÉPICO', 'NOSTÁLGICO'];

/* Map each root to its major scale notes */
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const flats = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
const sharpToFlatDisplay = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'F#', 'G#': 'Ab', 'A#': 'Bb' };

function getNoteStr(root, offset) {
  let isFlat = root.includes('b') || root === 'F';
  let baseNote = flats[root] || root;
  let idx = (notes.indexOf(baseNote) + offset) % 12;
  let note = notes[idx];
  return (isFlat && sharpToFlatDisplay[note]) ? sharpToFlatDisplay[note] : note;
}

const CHORD_MAP = {};
const ALL_24_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'];

ALL_24_KEYS.forEach(key => {
  const isMinor = key.endsWith('m');
  const root = isMinor ? key.slice(0, -1) : key;
  if(isMinor) {
    CHORD_MAP[key] = {
      'i': getNoteStr(root, 0) + 'm',
      'ii°': getNoteStr(root, 2) + 'dim',
      'III': getNoteStr(root, 3),
      'iv': getNoteStr(root, 5) + 'm',
      'v': getNoteStr(root, 7) + 'm',
      'VI': getNoteStr(root, 8),
      'VII': getNoteStr(root, 10),
      'IVmaj': getNoteStr(root, 5),
      'I': getNoteStr(root, 0) + 'm',
      'V': getNoteStr(root, 7) + 'm',
      'vi': getNoteStr(root, 8),
      'IV': getNoteStr(root, 5) + 'm',
      'ii': getNoteStr(root, 2) + 'dim',
      'Imaj7': getNoteStr(root, 0) + 'm7',
      'IVmaj7': getNoteStr(root, 5) + 'm7'
    };
  } else {
    CHORD_MAP[key] = {
      'I': getNoteStr(root, 0),
      'ii': getNoteStr(root, 2) + 'm',
      'iii': getNoteStr(root, 4) + 'm',
      'IV': getNoteStr(root, 5),
      'V': getNoteStr(root, 7),
      'vi': getNoteStr(root, 9) + 'm',
      'vii°': getNoteStr(root, 11) + 'dim',
      'Imaj7': getNoteStr(root, 0) + 'maj7',
      'IVmaj7': getNoteStr(root, 5) + 'maj7',
      'i': getNoteStr(root, 0) + 'm',
      'III': getNoteStr(root, 4),
      'IVmaj': getNoteStr(root, 5)
    };
  }
});

const PROGGEN_STYLES = [
  // ================= MAIORES / ALEGRES / POP ================= //
  { id: 'pop', label: 'Hino Pop (I-V-vi-IV)', keys: ['I', 'V', 'vi', 'IV'] },
  { id: 'indie', label: 'Indie / Dream Pop (I-iii-IV-V)', keys: ['I', 'iii', 'IV', 'V'] },
  { id: 'kpop', label: 'Pop Moderno / K-Pop (ii-V-I-vi)', keys: ['ii', 'V', 'I', 'vi'] },
  { id: 'dance', label: 'EDM / Dance (vi-V-IV-V)', keys: ['vi', 'V', 'IV', 'V'] },
  { id: 'rock50s', label: 'Doo-Wop / 50s (I-vi-IV-V)', keys: ['I', 'vi', 'IV', 'V'] },
  { id: 'rock', label: 'Rock Clássico (I-IV-V)', keys: ['I', 'IV', 'V'] },
  { id: 'blues', label: 'Blues 12-Bar (I-IV-I-V-IV)', keys: ['I', 'IV', 'I', 'V', 'IV', 'I'] },
  { id: 'country', label: 'Country Road (I-V-IV-I)', keys: ['I', 'V', 'IV', 'I'] },

  // ================= SOUL / JAZZ / LOFI ================= //
  { id: 'jazz', label: 'Jazz Standard (ii-V-I)', keys: ['ii', 'V', 'I'] },
  { id: 'rnb', label: 'R&B Clássico (I-vi-ii-V)', keys: ['I', 'vi', 'ii', 'V'] },
  { id: 'lofi', label: 'Lofi / Chill (Imaj7-vi-IVmaj7-V)', keys: ['Imaj7', 'vi', 'IVmaj7', 'V'] },
  { id: 'bossa', label: 'Bossa Nova Base (Imaj7-ii-V)', keys: ['Imaj7', 'ii', 'V'] },
  { id: 'neo_soul', label: 'Neo-Soul Groove (ii-V-Imaj7-vi)', keys: ['ii', 'V', 'Imaj7', 'vi'] },
  { id: 'funk', label: 'Funk / Soul Vamp (I-IV)', keys: ['I', 'IV'] },

  // ================= MENORES / TRISTES / ÉPICOS ================= //
  { id: 'melancolico', label: 'Pop Melancólico (vi-IV-I-V)', keys: ['vi', 'IV', 'I', 'V'] },
  { id: 'epic', label: 'Épico / Hans Zimmer (i-VI-III-VII)', keys: ['i', 'VI', 'III', 'VII'] },
  { id: 'andaluz', label: 'Espanhol / Andaluz (i-VII-VI-v)', keys: ['i', 'VII', 'VI', 'v'] },
  { id: 'grunge', label: 'Grunge / Alt Rock (i-III-IV)', keys: ['i', 'III', 'IVmaj'] },
  { id: 'trap', label: 'Trap / Drill Escuro (i-iv)', keys: ['i', 'iv'] },
  { id: 'doom', label: 'Heavy / Doom Metal (i-VI-iv-v)', keys: ['i', 'VI', 'iv', 'v'] },
  { id: 'synthwave', label: 'Synthwave / Retro (i-VII-iv-VI)', keys: ['i', 'VII', 'iv', 'VI'] }
];

const QUICK_EXAMPLES = [
  // ROCK / METAL
  { label: 'Heavy Metal', query: 'Metal pesado com bumbos duplos e solos virtuosos', genre: 'Heavy Metal', category: 'Rock' },
  { label: 'Grunge 90s', query: 'Rock alternativo sujo com guitarras distorcidas', genre: 'Grunge', category: 'Rock' },
  { label: 'Indie Folk', query: 'Folk melódico com violões e harmonias vocais', genre: 'Indie Folk', category: 'Rock' },
  { label: 'Punk Rock', query: 'Punk enérgico e rápido com atitude', genre: 'Punk Rock', category: 'Rock' },
  
  // ELETRÔNICA
  { label: 'Synthwave', query: 'Viagem nostálgica aos anos 80 com sintetizadores retro', genre: 'Synthwave', category: 'Electronic' },
  { label: 'Dark Techno', query: 'Techno industrial sombrio com batida 4x4 hipnótica', genre: 'Industrial Techno', category: 'Electronic' },
  { label: 'Lo-Fi Chill', query: 'Batidas relaxantes com texturas de vinil', genre: 'Lo-Fi Hip Hop', category: 'Electronic' },
  { label: 'House Music', query: 'Groove clássico de Chicago para as pistas', genre: 'Deep House', category: 'Electronic' },

  // BRASIL
  { label: 'Bossa Nova', query: 'Samba suave com violão de nylon e voz sussurrada', genre: 'Bossa Nova / Jazz', category: 'Brasil' },
  { label: 'Samba Raiz', query: 'Roda de samba clássica com cavaco e pandeiro', genre: 'Samba', category: 'Brasil' },
  { label: 'Funk Brasil', query: 'Batidão de favela com graves potentes', genre: 'Funk Carioca', category: 'Brasil' },
  { label: 'MPB Moderna', query: 'Música Popular Brasileira com toques eletrônicos', genre: 'MPB / Nu-Jazz', category: 'Brasil' },

  // URBANO
  { label: 'Melodic Trap', query: 'Trap moderno com sintetizadores etéreos e 808s', genre: 'Melodic Trap', category: 'Urbano' },
  { label: 'Afrobeat', query: 'Ritmos africanos modernos com grooves infecciosos', genre: 'Afrobeat', category: 'Urbano' },
  { label: 'Boom Bap', query: 'Rap clássico dos anos 90 com samplers sujos', genre: 'Old School Hip Hop', category: 'Urbano' },
  { label: 'Reggaeton', query: 'Batida dembow com vocais urbanos', genre: 'Reggaeton', category: 'Urbano' },

  // CINEMATOGRÁFICO
  { label: 'Epic Orchestral', query: 'Orquestra completa com coros épicos e percussão de guerra', genre: 'Cinematic / Epic', category: 'Cinematic' },
  { label: 'Cyberpunk', query: 'Darksynth futurista com atmosfera distópica', genre: 'Cyberpunk / EBM', category: 'Cinematic' },
  { label: 'Ambient', query: 'Paisagens sonoras calmas para foco e relaxamento', genre: 'Ambient', category: 'Cinematic' }
];

const ADVANCED_INSTRUMENTS = [
  { label: 'Violões & Acústicos', items: [
    { name: 'Violão Nylon', icon: '🎸' }, { name: 'Violão Aço', icon: '🎸' }, { name: 'Violão 12 Cordas', icon: '🎸' },
    { name: 'Viola Caipira', icon: '🎸' }, { name: 'Cavaquinho', icon: '🪕' }, { name: 'Fingerstyle', icon: '🤌' }, 
    { name: 'Violão Percussivo', icon: '🥁' }, { name: 'Flamenco', icon: '💃' }, { name: 'Fingerpicking', icon: '🤏' }, 
    { name: 'Strumming', icon: '🎸' }, { name: 'Harmônicos', icon: '✨' }, { name: 'Rasgueado', icon: '🤏' },
    { name: 'Harpa', icon: '✨' }, { name: 'Lira', icon: '🎼' }
  ]},
  { label: 'Contrabaixos', items: [
    { name: 'Baixo Elétrico (4 cordas)', icon: '🎸' }, { name: 'Baixo 5 Cordas', icon: '🎸' }, { name: 'Baixo 6 Cordas', icon: '🎸' },
    { name: 'Baixo Fretless', icon: '🎸' }, { name: 'Baixo Acústico', icon: '🎸' }, { name: 'Baixo Semiacústico', icon: '🎸' },
    { name: 'Fingerstyle (Bass)', icon: '🤌' }, { name: 'Slap Bass', icon: '💥' }, { name: 'Pop Bass', icon: '💥' },
    { name: 'Palm Mute (Bass)', icon: '⭕' }, { name: 'Pick Bass', icon: '⛏️' }, { name: 'Tapping (Bass)', icon: '👆' },
    { name: 'Hammer-On (Bass)', icon: '🔨' }, { name: 'Pull-Off (Bass)', icon: '📉' }, { name: 'Slide (Bass)', icon: '🛹' },
    { name: 'Vibrato (Bass)', icon: '〰️' }, { name: 'Ghost Notes (Bass)', icon: '👻' }
  ]},
  { label: 'Guitarras Elétricas', items: [
    { name: 'Stratocaster', icon: '🎸' }, { name: 'Telecaster', icon: '🎸' }, { name: 'Les Paul', icon: '🎸' },
    { name: 'SG', icon: '🎸' }, { name: 'Guitarra Semiacústica', icon: '🎸' }, { name: 'Guitarra Grunge', icon: '🎸' },
    { name: 'Alternate Picking', icon: '⛏️' }, { name: 'Downpicking', icon: '⬇️' }, { name: 'Sweep Picking', icon: '🧹' },
    { name: 'Palm Mute (Gtr)', icon: '⭕' }, { name: 'Hybrid Picking', icon: '🤌' }, { name: 'Hammer-On (Gtr)', icon: '🔨' },
    { name: 'Pull-Off (Gtr)', icon: '📉' }, { name: 'Slide (Gtr)', icon: '🛹' }, { name: 'Bend', icon: '⤴️' },
    { name: 'Vibrato (Gtr)', icon: '〰️' }, { name: 'Tapping (Gtr)', icon: '👆' }, { name: 'Legato', icon: '〰️' }
  ]},
  { label: 'Efeitos de Pedais', items: [
    { name: 'Overdrive', icon: '🔥' }, { name: 'Distortion', icon: '⚡' }, { name: 'Fuzz', icon: '🔊' },
    { name: 'Chorus', icon: '🌊' }, { name: 'Flanger', icon: '✈️' }, { name: 'Phaser', icon: '🌀' },
    { name: 'Tremolo', icon: '〰️' }, { name: 'Reverb', icon: '🌊' }, { name: 'Delay', icon: '⏳' },
    { name: 'Compressor', icon: '🗜️' }, { name: 'Noise Gate', icon: '🙉' }, { name: 'Equalizer', icon: '🎚️' },
    { name: 'Wah-Wah', icon: '🦶' }, { name: 'Octaver', icon: '2️⃣' }, { name: 'Looper', icon: '🔁' }, { name: 'Pitch Shifter', icon: '⬆️' }
  ]},
  { label: 'Pianos & Teclados', items: [
    { name: 'Piano Acústico', icon: '🎹' }, { name: 'Piano de Cauda', icon: '🎹' }, { name: 'Piano Elétrico (Rhodes)', icon: '🎹' },
    { name: 'Wurlitzer', icon: '🎹' }, { name: 'Órgão Hammond', icon: '🎹' }, { name: 'Órgão de Tubos', icon: '⛪' },
    { name: 'Cravo', icon: '🎹' }, { name: 'Mellotron', icon: '📼' }, { name: 'Clavinete', icon: '🎹' },
    { name: 'Acordeom', icon: '🪗' }
  ]},
  { label: 'Sintetizadores & Digital', items: [
    { name: 'Synth Lead', icon: '🚀' }, { name: 'Synth Pad', icon: '☁️' }, { name: 'Synth Bass', icon: '🔉' },
    { name: 'Arpeggiator', icon: '➿' }, { name: 'Wavetable Synth', icon: '🌊' }, { name: 'Modular Synth', icon: '🔌' },
    { name: 'FM Synth', icon: '📻' }, { name: 'Vocoder', icon: '🤖' }, { name: 'Chiptune / 8-bit', icon: '👾' }
  ]},
  { label: 'Cordas & Orquestra', items: [
    { name: 'Violino', icon: '🎻' }, { name: 'Viola', icon: '🎻' }, { name: 'Cello', icon: '🎻' },
    { name: 'Contrabaixo Acústico', icon: '🎻' }, { name: 'Seção de Cordas', icon: '🎻' }, { name: 'Quarteto de Cordas', icon: '🎻' },
    { name: 'Harpa Orquestral', icon: '✨' }, { name: 'Trompete', icon: '🎺' }, { name: 'Trombone', icon: '🎺' },
    { name: 'Saxofone', icon: '🎷' }, { name: 'Flauta', icon: '🌬️' }, { name: 'Clarinete', icon: '🌬️' },
    { name: 'Assobio (Whistle)', icon: '😗' }
  ]},
  { label: 'Bateria Completa', items: [
    { name: 'Caixa', icon: '🥁' }, { name: 'Bumbo', icon: '🥁' }, { name: 'Chimbal', icon: '🟡' }, { name: 'Tons', icon: '🥁' },
    { name: 'Surdo', icon: '🥁' }, { name: 'Crash', icon: '💥' }, { name: 'Ride', icon: '🟡' }, { name: 'Ghost Notes', icon: '👻' },
    { name: 'Rimshot', icon: '🥢' }, { name: 'Groove Shuffle', icon: '🕺' }, { name: 'Half-Time', icon: '⏳' }, { name: 'Double-Time', icon: '⚡' }
  ]},
  { label: 'Percussão Brasileira', items: [
    { name: 'Pandeiro', icon: '🥁' }, { name: 'Surdo de Samba', icon: '🥁' }, { name: 'Tamborim', icon: '🥁' },
    { name: 'Cuíca', icon: '🐻' }, { name: 'Agogô', icon: '🔔' }, { name: 'Reco-Reco', icon: '🥢' },
    { name: 'Ganzá', icon: '🥁' }, { name: 'Caixa de Samba', icon: '🥁' }, { name: 'Repique de Mão', icon: '👏' },
    { name: 'Atabaque', icon: '🥁' }
  ]},
  { label: 'Percussão Latina', items: [
    { name: 'Congas', icon: '🥁' }, { name: 'Bongôs', icon: '🥁' }, { name: 'Timbales', icon: '🥁' },
    { name: 'Claves', icon: '🥢' }, { name: 'Maracas', icon: '🥁' }, { name: 'Guiro', icon: '🥢' }
  ]},
  { label: 'Percussão Africana', items: [
    { name: 'Djembê', icon: '🥁' }, { name: 'Talking Drum', icon: '🥁' }, { name: 'Udu', icon: '🏺' }, { name: 'Balafon', icon: '🎹' }
  ]},
  { label: 'Percussão Mundial', items: [
    { name: 'Cajón', icon: '📦' }, { name: 'Darbuka', icon: '🥁' }, { name: 'Tabla', icon: '🥁' },
    { name: 'Taiko', icon: '🥁' }, { name: 'Bodhrán', icon: '🥁' }
  ]},
  { label: 'Percussão Orquestral', items: [
    { name: 'Tímpanos', icon: '🥁' }, { name: 'Xilofone', icon: '🎹' }, { name: 'Vibrafone', icon: '🎹' },
    { name: 'Marimba', icon: '🎹' }, { name: 'Triângulo', icon: '📐' }, { name: 'Pratos Orquestrais', icon: '🟡' },
    { name: 'Glockenspiel', icon: '🔔' }
  ]},
  { label: 'Percussão Moderna', items: [
    { name: 'Pads Eletrônicos', icon: '⏹️' }, { name: 'Drum Machine', icon: '💻' }, { name: 'Samples', icon: '🗂️' }, { name: 'Sound FX', icon: '🔊' }
  ]},
  { label: 'Efeitos & Ambiência (SFX)', items: [
    { name: 'Chuva (Rain)', icon: '🌧️' }, { name: 'Vento (Wind)', icon: '🌬️' }, { name: 'Trovão (Thunder)', icon: '⛈️' },
    { name: 'Ondas do Mar (Waves)', icon: '🌊' }, { name: 'Natureza (Birds/Forest)', icon: '🍃' }, { name: 'Palmas (Claps)', icon: '👏' },
    { name: 'Sirene (Siren)', icon: '🚨' }, { name: 'Apito (Referee)', icon: '📣' }, { name: 'Tic-Tac (Relógio)', icon: '⏱️' },
    { name: 'Ruído de Vinil (Vinyl)', icon: '📻' }, { name: 'Multidão (Crowd)', icon: '👥' }, { name: 'Passos (Footsteps)', icon: '👣' },
    { name: 'Impacto Cinematográfico', icon: '💥' }
  ]}
];

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});

function App() {
  const [activeTab, setActiveTab] = useState('MANUAL');
  const [baseGenre, setBaseGenre] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [exampleFilter, setExampleFilter] = useState('Rock');
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
  const [isProMode, setIsProMode] = useState(false);
  const [vocalTone, setVocalTone] = useState('normal');
  const [vocalTextures, setVocalTextures] = useState([]);
  const [smartSuggestion, setSmartSuggestion] = useState(null);

  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [promptA, setPromptA] = useState(null);
  const fileInputRef = useRef(null);
  const [customLyrics, setCustomLyrics] = useState('');
  const lyricsTextareaRef = useRef(null);
  const [showOrchestrator, setShowOrchestrator] = useState(false);
  
  const [selectedBpm, setSelectedBpm] = useState('');
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [musicalKey, setMusicalKey] = useState('');
  const [keyMode, setKeyMode] = useState('MAIOR');
  const [scale, setScale] = useState('');
  const [chordProgression, setChordProgression] = useState('');
  const [groove, setGroove] = useState('');
  const [emotion, setEmotion] = useState('');
  const [showStructureSystem, setShowStructureSystem] = useState(false);

  const [showProggenModal, setShowProggenModal] = useState(false);
  const [proggenKey, setProggenKey] = useState('C');
  const [proggenStyle, setProggenStyle] = useState(PROGGEN_STYLES[0]);
  const [isProggenStylesOpen, setIsProggenStylesOpen] = useState(false);

  const handleMagicGenerator = () => {
    setShowProggenModal(true);
  };

  // Dicionário de Sugestões Inteligentes (Mapeamento de Artistas/Gêneros)
  const SMART_SUGGESTIONS = {
    'R.E.M.': {
      label: 'Estilo R.E.M. (Folk Rock)',
      genre: 'Folk Rock / Alternative',
      vocal: 'Dreamy Pop',
      instruments: ['Violão Aço', 'Guitarra Elétrica', 'Baixo Elétrico', 'Bateria Completa', 'Piano Acústico'],
      negative: 'heavy metal, electronic, high gain'
    },
    'Queen': {
      label: 'Estilo Queen (Stadium Rock)',
      genre: 'Glam Rock / Opera Rock',
      vocal: 'Rock Grit',
      instruments: ['Piano Acústico', 'Guitarra Elétrica', 'Baixo Elétrico', 'Bateria Completa', 'Violino/Strings'],
      negative: 'lo-fi, mumble, dark'
    },
    'Techno': {
      label: 'Estilo Techno (Industrial)',
      genre: 'Dark Techno / Industrial',
      vocal: 'None',
      instruments: ['Synth Lead', 'Synth Pad', 'Drum Machine', 'Efeitos FX', 'Baixo Slap'],
      negative: 'acoustic, folk, banjo'
    },
    'Bossa Nova': {
      label: 'Estilo Bossa Nova (Brasil)',
      genre: 'Bossa Nova / Jazz',
      vocal: 'Dreamy Pop',
      instruments: ['Violão Nylon', 'Piano Acústico', 'Baixo Elétrico', 'Pandeiro', 'Flauta'],
      negative: 'distorted, metal, trap'
    }
  };

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

  useEffect(() => {
    const input = (activeTab === 'INFLUÊNCIA' ? referenceInput : userQuery).toLowerCase();
    
    const matchedKey = Object.keys(SMART_SUGGESTIONS).find(key => 
      input.includes(key.toLowerCase())
    );

    if (matchedKey) {
      setSmartSuggestion(SMART_SUGGESTIONS[matchedKey]);
    } else {
      setSmartSuggestion(null);
    }
  }, [userQuery, referenceInput, activeTab]);

  const applySmartSuggestion = () => {
    if (!smartSuggestion) return;
    setSecondaryGenre(smartSuggestion.genre);
    setVocalArchetype(smartSuggestion.vocal);
    setSelectedInstruments(smartSuggestion.instruments);
    setNegativePrompt(smartSuggestion.negative);
    setSmartSuggestion(null);
    setIsProMode(true);
  };

  const generateMusicConcept = async (modifier = null) => {
    let finalQuery = "";
    if (activeTab === 'MANUAL') {
      const genreContext = baseGenre ? `Gênero Base Selecionado: ${baseGenre}. ` : '';
      finalQuery = `${genreContext}Briefing: ${userQuery}`;
    }
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
    3. FUSÃO DE GÊNEROS: Se houver um gênero secundário, descreva uma transição ou mistura fluida.
    4. CONTROLE DE PERCUSSÃO: Se a percussão não for solicitada, NÃO use termos de bateria.
    5. DNA VOCAL & SPOKEN INTRO: Integre o "Arquétipo Vocal" na descrição. Se o usuário escolher vocal de criança, use tags como "children's vocal", "child voice" ou "kids vocal". Se escolher "Spoken Narrator", "Female Narrator" ou "Child Narrator", você DEVE incluir tags como "spoken intro", "spoken male voice", "spoken female voice" ou "spoken child voice" no Master Prompt e descrever uma introdução narrativa. Use "..." (reticências) na estruturação de letras caso sugerido para criar pausas naturais.
    6. SOUND DESIGN (SFX): Se instrumentos da seção "Efeitos & Ambiência (SFX)" forem selecionados, você devera descrever o ambiente de forma CINEMÁTICA E DETALHADA no final_prompt e na musical_structure. Use tags técnicas em inglês como [SFX: Rain], [SFX: Thunder], [Sound of birds in the background], etc. Priorize descrições imersivas em inglês (ex: "Cinematic intro with heavy rain and distant thunder").
    7. STYLE TAGS: String de tags curtas em INGLÊS.
    8. DICAS DE PRODUÇÃO: O campo "production_tips" deve conter conselhos técnicos em PORTUGUÊS (ex: "Use modo manual no Suno", "Sugerido 120 BPM").
    9. ESTRUTURA MUSICAL: O campo "musical_structure" DEVE SER SEMPRE GERADO como um objeto detalhado com blocos. O CONTEÚDO de cada bloco DEVE SER EM INGLÊS TÉCNICO (ex: {"Intro": "A heavy atmospheric intro with [SFX: Rain]...", "Verse 1": "Minimalistic drums...", "Chorus": "...", "Outro": "..."}). NUNCA DEIXE NULO.
    
    JSON:
    {
      "genre": "Género",
      "bpm": "BPM",
      "key": "Tom",
      "style_analysis": "Análise em PT-BR",
      "instruments": ["Lista"],
      "style_tags": "Tags em EN",
      "final_prompt": "Master Prompt em EN",
      "production_tips": "Dicas em PT-BR",
      "musical_structure": null
    }`;

    try {
      let modContext = "";
      if (modifier === 'energetic') modContext = "\nVARIAÇÃO: Torne o prompt muito mais enérgico, agressivo e dinâmico.";
      if (modifier === 'slow') modContext = "\nVARIAÇÃO: Torne o prompt muito mais lento, calmo e atmosférico.";
      if (modifier === 'emotional') modContext = "\nVARIAÇÃO: Torne o prompt profundamente emocional, melancólico e expressivo.";

      const expertContext = `
        Gênero Secundário: ${secondaryGenre || 'Nenhum'}
        Arquétipo Vocal: ${vocalArchetype || 'Automático'}
        Timbre Vocal: ${VOCAL_TONES.find(t => t.id === vocalTone)?.label || 'Normal'}
        Texturas Vocais: ${vocalTextures.length > 0 ? vocalTextures.map(id => VOCAL_TEXTURES.find(t => t.id === id)?.label).join(', ') : 'Nenhuma'}
        Instrumentos Selecionados: ${selectedInstruments.join(', ') || 'Automático'}
        BPM / Andamento: ${selectedBpm || 'Automático'}
        Compasso: ${timeSignature || 'Automático'}
        Tom & Modo: ${musicalKey ? `${musicalKey} ${keyMode}` : 'Automático'}

        Escala: ${scale || 'Automático'}
        Progressão de Acordes: ${chordProgression || 'Automático'}
        Groove / Feel: ${groove || 'Automático'}
        Emoção Musical: ${emotion || 'Automático'}
        Excluir (Prompt Negativo): ${negativePrompt || 'Nenhum'}
        ${modContext}
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
      const result = JSON.parse(text);
      
      if (isComparisonMode && maestroAnalysis) {
        setPromptA({ ...maestroAnalysis });
      }
      setMaestroAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(`O Maestro está offline: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToLibrary = () => {
    if (!maestroAnalysis) return;
    const newEntry = { 
      ...maestroAnalysis, 
      id: crypto.randomUUID(), 
      timestamp: new Date().toISOString(),
      isFavorite: false,
      customName: ''
    };
    persistData([newEntry, ...savedPrompts]);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const toggleFavorite = (id) => {
    const newList = savedPrompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p);
    persistData(newList);
  };

  const renameEntry = (id, newName) => {
    const newList = savedPrompts.map(p => p.id === id ? { ...p, customName: newName } : p);
    persistData(newList);
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
    setBaseGenre('');
    setUserQuery('');
    setReferenceInput('');
    setSelectedFile(null);
    setMaestroAnalysis(null);
    setError(null);
    setSelectedInstruments([]);
    setVocalArchetype('');
    setSecondaryGenre('');
    setNegativePrompt('');
    setVocalTone('normal');
    setVocalTextures([]);
    setCustomLyrics('');

    setSelectedBpm('');
    setTimeSignature('4/4');
    setMusicalKey('');
    setKeyMode('MAIOR');
    setScale('');
    setChordProgression('');
    setGroove('');
    setEmotion('');
  };

  const insertIntoLyrics = (section, text) => {
    const insertText = `\n[${section}]\n[${text}]\n`;
    const textarea = lyricsTextareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = customLyrics;
      
      const newVal = currentVal.substring(0, start) + insertText + currentVal.substring(end);
      setCustomLyrics(newVal);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
        textarea.focus();
      }, 0);
    } else {
      setCustomLyrics(prev => prev + insertText);
    }
  };

  const insertTag = (tag, type = 'structural') => {
    let finalTag = tag;
    
    // Se for SFX, tenta extrair o nome em inglês entre parênteses
    if (type === 'sfx') {
      const match = tag.match(/\(([^)]+)\)/);
      const englishName = match ? match[1] : tag;
      finalTag = `SFX: ${englishName}`;
    }

    const insertText = `\n[${finalTag}]\n`;
    const textarea = lyricsTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = customLyrics;
      const newVal = currentVal.substring(0, start) + insertText + currentVal.substring(end);
      setCustomLyrics(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
        textarea.focus();
      }, 0);
    } else {
      setCustomLyrics(prev => prev + insertText);
    }
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
            <h2 className="text-[11px] font-black uppercase tracking-widest">Painel de Controle</h2>
          </div>

          <div className="space-y-4 min-h-[300px] mb-8">
            {activeTab === 'MANUAL' && (
              <textarea
                className="w-full h-48 bg-[#0f0f0f] rounded-3xl p-6 border border-white/5 text-slate-300 text-sm leading-relaxed resize-none outline-none focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
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

          {/* SMART SUGGESTION BADGE */}
          {smartSuggestion && (
            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-between animate-in zoom-in-95 duration-300">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Sugestão Maestro</span>
                <span className="text-[10px] font-bold text-white uppercase">{smartSuggestion.label}</span>
              </div>
              <button 
                onClick={applySmartSuggestion}
                className="bg-orange-500 hover:bg-orange-400 text-black text-[9px] font-black px-4 py-2 rounded-xl transition-all shadow-lg active:scale-95"
              >
                CONFIGURAR PRO
              </button>
            </div>
          )}

          {/* TOGGLE MODO PRO */}
          <div className="bg-[#121212] p-1.5 rounded-2xl border border-white/5 flex gap-1 mb-6 relative overflow-hidden group">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-4px)] rounded-xl transition-all duration-500 ease-out ${isProMode ? 'left-[calc(50%+2px)] bg-gradient-to-r from-orange-600 to-amber-500' : 'left-1.5 bg-white/10'}`}
            />
            <button 
              onClick={() => setIsProMode(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all z-10 ${!isProMode ? 'text-white' : 'text-slate-500'}`}
            >
              Modo Simples
            </button>
            <button 
              onClick={() => setIsProMode(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all z-10 ${isProMode ? 'text-black' : 'text-slate-500'}`}
            >
              <Wand2 className={`w-3 h-3 ${isProMode ? 'animate-pulse' : ''}`} />
              Modo Produtor
            </button>
          </div>

          {/* PAINEL PRODUTOR */}
          {isProMode && (
            <div className="space-y-8 mb-8 p-6 bg-orange-500/5 rounded-[32px] border border-orange-500/10 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Settings2 className="w-20 h-20 rotate-12" />
               </div>

               {/* FUSÃO DE GÊNERO */}
               <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[9px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                      Gênero Secundário
                    </label>
                    <span className="text-[8px] font-bold text-orange-500/50 uppercase">Fusão Híbrida</span>
                  </div>
                  <input 
                    className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-orange-500/50 transition-all"
                    placeholder="Ex: Trap, Melodic Pop..."
                    value={secondaryGenre}
                    onChange={e => setSecondaryGenre(e.target.value)}
                  />
                  <p className="text-[8px] text-slate-600 mt-1.5 italic">Cria uma transição fluida entre estilos musicais distintos.</p>
               </div>

               {/* DNA VOCAL */}
               <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[9px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                      DNA Vocal (Arquétipo)
                    </label>
                    <span className="text-[8px] font-bold text-orange-500/50 uppercase">Textura Visual</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {VOCAL_ARCHETYPES.map(arc => (
                      <button 
                        key={arc.id}
                        type="button"
                        onClick={() => setVocalArchetype(vocalArchetype === arc.id ? '' : arc.id)}
                        className={`p-2 rounded-xl border text-[9px] font-bold text-left transition-all ${vocalArchetype === arc.id ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-orange-500/30'}`}
                      >
                        <div className="truncate">{arc.label}</div>
                        <div className={`text-[7px] mt-0.5 opacity-60 ${vocalArchetype === arc.id ? 'text-black' : 'text-slate-500'}`}>{arc.desc}</div>
                      </button>
                    ))}
                  </div>

               {/* REFINAMENTO DE VOZ */}
               <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[9px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                      Refinamento de Voz
                    </label>
                    <span className="text-[8px] font-bold text-orange-500/50 uppercase">Timbre & Textura</span>
                  </div>

                  {/* TIMBRE (TONE) */}
                  <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Timbre (Pitch)</p>
                    <div className="flex gap-1.5">
                      {VOCAL_TONES.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setVocalTone(t.id)}
                          className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all border ${vocalTone === t.id ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-orange-500/30'}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TEXTURAS (TEXTURES) - MULTI SELECTION */}
                  <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Texturas (Múltipla Escolha)</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {VOCAL_TEXTURES.map(t => {
                        const isSelected = vocalTextures.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) setVocalTextures(vocalTextures.filter(id => id !== t.id));
                              else setVocalTextures([...vocalTextures, t.id]);
                            }}
                            className={`py-1.5 rounded-lg text-[9px] font-bold transition-all border ${isSelected ? 'bg-white border-white text-black shadow-md' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-white/20'}`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
               </div>

               </div>

               {/* SISTEMA DE ESTRUTURA MUSICAL */}
               <div className="pt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setShowStructureSystem(!showStructureSystem)}
                    className="w-full flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-orange-500" />
                      <div className="text-left">
                        <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Sistema de Estrutura Musical (Maestro)</span>
                        <span className="block text-[8px] text-slate-500 mt-0.5">BPM, Compasso, Escalas, Acordes, Groove e mais</span>
                      </div>
                    </div>
                    {showStructureSystem ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${showStructureSystem ? 'max-h-[1200px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* LADO ESQUERDO */}
                      <div className="space-y-6">
                        {/* BPM */}
                        <div>
                          <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 mb-3 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                            Andamento (BPM)
                          </p>
                          <div className="flex flex-col gap-2">
                            {BPM_RANGES.map(b => (
                              <button key={b.id} type="button" onClick={() => setSelectedBpm(selectedBpm === b.label ? '' : b.label)} className={`py-2 px-3 rounded-xl border text-[9px] font-bold transition-all ${selectedBpm === b.label ? 'bg-orange-500 text-black border-orange-500 shadow-md shadow-orange-500/20' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-orange-500/30 hover:text-white'}`}>
                                {b.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* COMPASSO */}
                        <div>
                          <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 mb-3 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                            Compasso
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {TIME_SIGNATURES.map(t => (
                              <button key={t} type="button" onClick={() => setTimeSignature(t)} className={`py-2 px-4 rounded-xl border text-[9px] font-bold transition-all ${timeSignature === t ? 'bg-white text-black border-white shadow-md' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-white/30 hover:text-white'}`}>
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* TOM */}
                        <div>
                          <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 mb-3 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span> Tom (Key) & Modo
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {MUSICAL_KEYS.map(k => (
                              <button key={k} type="button" onClick={() => setMusicalKey(k)} className={`w-9 h-9 rounded-xl border flex items-center justify-center text-[10px] font-black transition-all ${musicalKey === k ? 'bg-orange-500 text-black border-orange-500 shadow-md shadow-orange-500/20' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-orange-500/30 hover:text-white'}`}>
                                {k}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setKeyMode('MAIOR')} className={`flex-1 py-1.5 rounded-lg border text-[8px] font-bold transition-all ${keyMode === 'MAIOR' ? 'bg-[#1a1a1a] text-white border-white/20' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'}`}>MAIOR</button>
                            <button type="button" onClick={() => setKeyMode('MENOR')} className={`flex-1 py-1.5 rounded-lg border text-[8px] font-bold transition-all ${keyMode === 'MENOR' ? 'bg-[#1a1a1a] text-white border-white/20' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'}`}>MENOR</button>
                          </div>
                        </div>
                      </div>

                      {/* LADO DIREITO */}
                      <div className="space-y-6">
                        {/* ESCALAS */}
                        <div>
                          <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 mb-3 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span> Escalas
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {SCALES.map(s => (
                              <button key={s} type="button" onClick={() => setScale(scale === s ? '' : s)} className={`py-1.5 px-3 rounded-xl border text-[8px] font-bold transition-all ${scale === s ? 'bg-white text-black border-white shadow-sm' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-white/30 hover:text-white'}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* PROGRESSÕES */}
                        <div>
                          <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
                            <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 uppercase flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50 flex-shrink-0"></span> Progressões de Acordes
                            </p>
                            <button type="button" onClick={handleMagicGenerator} className="flex-1 min-w-fit flex items-center justify-center gap-1.5 px-3 py-2 bg-[#121212] border border-orange-500/20 text-orange-500 rounded-lg text-[8px] font-black hover:bg-orange-500 hover:text-black transition-all shadow-md active:scale-95">
                              <Sparkles className="w-2.5 h-2.5 flex-shrink-0" /> GERADOR MÁGICO
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {CHORD_PROGRESSIONS.map(p => (
                              <button key={p.id} type="button" onClick={() => setChordProgression(chordProgression === p.label ? '' : p.label)} className={`py-1.5 px-3 rounded-xl border text-[8px] font-bold transition-all ${chordProgression === p.label ? 'bg-white text-black border-white shadow-sm' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-white/30 hover:text-white'}`}>
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* GROOVE / FEEL */}
                        <div>
                          <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 mb-3 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span> Groove / Feel
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {GROOVES.map(g => (
                              <button key={g} type="button" onClick={() => setGroove(groove === g ? '' : g)} className={`py-1.5 px-3 rounded-xl border text-[8px] font-bold transition-all ${groove === g ? 'bg-white text-black border-white shadow-sm' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-white/30 hover:text-white'}`}>
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* EMOÇÃO MUSICAL */}
                        <div>
                          <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 mb-3 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span> Emoção Musical
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {EMOTIONS.map(e => (
                              <button key={e} type="button" onClick={() => setEmotion(emotion === e ? '' : e)} className={`py-1.5 px-3 rounded-xl border text-[8px] font-bold transition-all ${emotion === e ? 'bg-white text-black border-white shadow-sm' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-white/30 hover:text-white'}`}>
                                {e}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tags Selecionadas */}
                  {!showStructureSystem && (selectedBpm || musicalKey || scale || chordProgression || groove || emotion) && (
                    <div className="flex flex-wrap gap-1.5 mt-3 p-3 bg-black/20 rounded-xl border border-white/5">
                      {selectedBpm && <span className="text-[8px] font-bold px-2 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg flex items-center gap-1.5">
                        {selectedBpm}
                        <button onClick={() => setSelectedBpm('')} className="hover:text-red-400 opacity-60 hover:opacity-100 transition-all"><X className="w-3 h-3"/></button>
                      </span>}
                      {musicalKey && <span className="text-[8px] font-bold px-2 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg flex items-center gap-1.5">
                        Tom: {musicalKey} {keyMode}
                        <button onClick={() => setMusicalKey('')} className="hover:text-red-400 opacity-60 hover:opacity-100 transition-all"><X className="w-3 h-3"/></button>
                      </span>}
                      {scale && <span className="text-[8px] font-bold px-2 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg flex items-center gap-1.5">
                        {scale}
                        <button onClick={() => setScale('')} className="hover:text-red-400 opacity-60 hover:opacity-100 transition-all"><X className="w-3 h-3"/></button>
                      </span>}
                      {chordProgression && <span className="text-[8px] font-bold px-2 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg flex items-center gap-1.5">
                        {chordProgression}
                        <button onClick={() => setChordProgression('')} className="hover:text-red-400 opacity-60 hover:opacity-100 transition-all"><X className="w-3 h-3"/></button>
                      </span>}
                      {groove && <span className="text-[8px] font-bold px-2 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg flex items-center gap-1.5">
                        {groove}
                        <button onClick={() => setGroove('')} className="hover:text-red-400 opacity-60 hover:opacity-100 transition-all"><X className="w-3 h-3"/></button>
                      </span>}
                      {emotion && <span className="text-[8px] font-bold px-2 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg flex items-center gap-1.5">
                        {emotion}
                        <button onClick={() => setEmotion('')} className="hover:text-red-400 opacity-60 hover:opacity-100 transition-all"><X className="w-3 h-3"/></button>
                      </span>}
                    </div>
                  )}
               </div>

               {/* ORQUESTRADOR AVANÇADO */}
               <div className="pt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setShowOrchestrator(!showOrchestrator)}
                    className="w-full flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Wand2 className="w-5 h-5 text-orange-500" />
                      <div className="text-left">
                        <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Orquestrador de Instrumentos & Técnicas</span>
                        <span className="block text-[8px] text-slate-500 mt-0.5">Explore violões, guitarras, efeitos e dezenas de percussões</span>
                      </div>
                    </div>
                    {showOrchestrator ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${showOrchestrator ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar bg-black/40 p-5 rounded-2xl border border-white/5">
                      {ADVANCED_INSTRUMENTS.map(group => (
                        <div key={group.label} className="mb-2">
                          <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 mb-3 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                            {group.label}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {group.items.map(item => {
                              const isSelected = selectedInstruments.includes(item.name);
                              return (
                                <div key={item.name} className="flex items-center gap-1">
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) setSelectedInstruments(selectedInstruments.filter(i => i !== item.name));
                                      else setSelectedInstruments([...selectedInstruments, item.name]);
                                    }}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[9px] font-bold transition-all ${isSelected ? 'bg-orange-500 text-black border-orange-500 shadow-md shadow-orange-500/20' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-orange-500/30 hover:text-white'}`}
                                  >
                                    <span className="text-xs">{item.icon}</span>
                                    <span>{item.name}</span>
                                  </button>
                                  {isProMode && (
                                    <button 
                                      onClick={() => insertTag(item.name, group.label.includes('SFX') ? 'sfx' : 'structural')}
                                      className="p-2 bg-white/5 hover:bg-orange-500 hover:text-black rounded-xl border border-white/5 transition-all"
                                      title="Inserir na Letra"
                                    >
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tags Selecionadas */}
                  {!showOrchestrator && selectedInstruments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 p-3 bg-black/20 rounded-xl border border-white/5">
                      {selectedInstruments.map(inst => (
                        <span key={inst} className="text-[9px] font-bold px-2 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg flex items-center gap-1.5">
                          {inst}
                          <button onClick={() => setSelectedInstruments(selectedInstruments.filter(i => i !== inst))} className="hover:text-red-400 opacity-60 hover:opacity-100 transition-all">
                            <X className="w-3 h-3"/>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
               </div>

               {/* PROMPT NEGATIVO */}
               <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filtro de Pureza (Negativo)</label>
                    <span className="text-[8px] font-bold text-red-500/50 uppercase">Exclusão</span>
                  </div>
                  <input 
                    className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-red-500/50 transition-all"
                    placeholder="Ex: no drums, no piano..."
                    value={negativePrompt}
                    onChange={e => setNegativePrompt(e.target.value)}
                  />
                  <p className="text-[8px] text-slate-600 mt-1.5 italic">Remove elementos indesejados da composição final.</p>
               </div>
            </div>
          )}

          <button 
            onClick={generateMusicConcept}
            disabled={isGenerating}
            className={`w-full font-black py-5 rounded-full transition-all uppercase text-xs tracking-widest disabled:opacity-50 active:scale-95 shadow-xl ${isProMode ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-black hover:shadow-orange-500/20' : 'bg-white text-black hover:bg-orange-500 shadow-white/5'}`}
          >
            {isGenerating ? 'A Processar...' : (isProMode ? '⚡ Gerar como Produtor' : 'Convocar o Maestro')}
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
              {/* BARRA DE AÇÕES RÁPIDAS */}
              <div className="flex flex-wrap gap-3 mb-4">
                <button 
                  onClick={() => setIsComparisonMode(!isComparisonMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase transition-all ${isComparisonMode ? 'bg-orange-500 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  <Split className="w-3 h-3" />
                  {isComparisonMode ? 'Modo Comparação On' : 'Comparar rascunhos'}
                </button>
                <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block"></div>
                <button 
                  onClick={() => generateMusicConcept('energetic')}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 text-slate-400 hover:bg-orange-500 hover:text-black text-[10px] font-black uppercase transition-all"
                >
                  <Activity className="w-3 h-3" /> + Energia
                </button>
                <button 
                  onClick={() => generateMusicConcept('slow')}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 text-slate-400 hover:bg-orange-500 hover:text-black text-[10px] font-black uppercase transition-all"
                >
                   <RotateCcw className="w-3 h-3" /> + Calmo
                </button>
              </div>

              {/* LAYOUT COMPARATIVO OU SIMPLES */}
              <div className={`grid gap-6 ${isComparisonMode && promptA ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                
                {/* PROMPT A (COMPARATIVO) */}
                {isComparisonMode && promptA && (
                  <div className="space-y-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                     <div className="bg-[#121212] p-6 rounded-[40px] border border-white/5">
                        <span className="text-[9px] font-black text-slate-500 uppercase block mb-4">Prompt Anterior (A)</span>
                        <div className="bg-black/40 p-5 rounded-2xl font-mono text-[10px] text-slate-400 mb-4 truncate">
                          {renderSafe(promptA.final_prompt)}
                        </div>
                        <button onClick={() => setMaestroAnalysis(promptA)} className="w-full py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">Restaurar Este</button>
                     </div>
                  </div>
                )}

                {/* PROMPT ATUAL (B OU PRINCIPAL) */}
                <div className="space-y-6">
                  {/* METADADOS */}
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

                  {/* ANÁLISE E VEREDITO */}
                  <div className="bg-orange-500/5 border border-orange-500/10 p-8 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 opacity-50" />
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2 tracking-widest">
                        <History className="w-3 h-3" /> {isComparisonMode ? 'Veredito do Maestro' : 'Análise de Estilo'}
                      </h4>
                      {isComparisonMode && (
                        <span className="bg-orange-500 text-black text-[8px] font-black px-2 py-1 rounded-md animate-bounce">MELHOR OPÇÃO</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed group-hover:text-white transition-colors duration-500">
                      "{renderSafe(maestroAnalysis.style_analysis)}"
                    </p>
                    {maestroAnalysis.production_tips && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[9px] font-bold text-orange-500/40 uppercase mb-2">Dica de Produção:</p>
                        <p className="text-[11px] text-slate-400">{maestroAnalysis.production_tips}</p>
                      </div>
                    )}
                  </div>

                  {/* MASTER PROMPT */}
                  <div className="bg-white rounded-[40px] p-8 text-black shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">Prompt de Audio IA</span>
                      <div className="flex gap-2">
                        <button onClick={saveToLibrary} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase transition-all shadow-md active:scale-95 ${saveSuccess ? 'bg-green-100 text-green-700' : 'bg-orange-500 text-black hover:bg-black hover:text-orange-500'}`}>
                          {saveSuccess ? <><CheckCheck className="w-4 h-4" /> Guardado!</> : <><Save className="w-4 h-4" /> Guardar</>}
                        </button>
                        <button onClick={() => copyPrompt(maestroAnalysis.final_prompt)} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                          {copySuccess ? <><CheckCheck className="w-4 h-4 text-green-400" /> Copiado!</> : <><CopyIcon className="w-4 h-4" /> Copiar Prompt</>}
                        </button>
                      </div>
                    </div>
                    <div className="bg-black/5 p-6 rounded-2xl font-mono text-xs select-all whitespace-pre-wrap leading-relaxed shadow-inner border border-black/5 mb-6">
                      {renderSafe(maestroAnalysis.final_prompt)}
                    </div>

                    {/* ESTRUTURA MUSICAL (SE HOUVER) */}
                    {maestroAnalysis.musical_structure && (
                      <div className="space-y-4 pt-6 border-t border-black/5">
                         <h5 className="text-[10px] font-black uppercase opacity-40">Estrutura da Composição</h5>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(maestroAnalysis.musical_structure).map(([section, text]) => (
                               <div key={section} className="bg-black/5 p-4 rounded-2xl relative group">
                                  <span className="text-[8px] font-black text-orange-600 uppercase mb-1 block tracking-widest">{section}</span>
                                  <p className="text-[10px] text-slate-700 leading-normal">{text}</p>
                                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => insertIntoLyrics(section, text)} className="p-1.5 bg-orange-500 rounded-lg text-black hover:bg-black hover:text-orange-500 transition-all shadow-md" title="Inserir na Letra">
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => copyPrompt(`[${section}]\n[${text}]`)} className="p-1.5 bg-white/80 rounded-lg hover:bg-orange-500 hover:text-white transition-all shadow-md" title="Copiar Seção">
                                      <CopyIcon className="w-3 h-3 text-slate-700 hover:text-white" />
                                    </button>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                    )}

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

                    {/* MONTADOR DE LETRAS */}
                    <div className="mt-8 pt-6 border-t-2 border-orange-500/20">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div>
                          <h4 className="text-xs font-black uppercase flex items-center gap-2 text-black">
                            <FileAudio className="w-4 h-4 text-orange-500" />
                            Montador de Letras Automático
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Cole sua letra aqui. Clique nos botões <span className="inline-flex bg-orange-500 text-black px-1 py-0.5 rounded text-[8px] mx-1"><ArrowRight className="w-2 h-2" /></span> na estrutura acima para injetar as tags direto na letra.
                          </p>
                        </div>
                        <button onClick={() => copyPrompt(customLyrics)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:bg-orange-500 hover:text-black transition-all whitespace-nowrap active:scale-95 shadow-lg">
                          {copySuccess ? <><CheckCheck className="w-3 h-3 text-green-400" /> Copiado Tudo!</> : <><CopyIcon className="w-3 h-3" /> Copiar Letra Completa</>}
                        </button>
                      </div>

                      {/* QUICK TAGS (Apenas no Modo Produtor) */}
                      {isProMode && (
                        <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest self-center mr-2">Tags Rápidas:</span>
                          {[
                            { label: 'Intro Falada', tag: 'Intro - spoken' },
                            { label: 'Intro', tag: 'Intro' },
                            { label: 'Verso', tag: 'Verse' },
                            { label: 'Refrão', tag: 'Chorus' },
                            { label: 'Ponte', tag: 'Bridge' },
                            { label: 'Solo', tag: 'Guitar Solo' },
                            { label: 'Final', tag: 'Outro' }
                          ].map(t => (
                            <button 
                              key={t.tag}
                              onClick={() => insertTag(t.tag)}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-slate-400 hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all active:scale-95"
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div className="relative group">
                        <textarea
                          ref={lyricsTextareaRef}
                          value={customLyrics}
                          onChange={(e) => setCustomLyrics(e.target.value)}
                          placeholder="[Intro]&#10;Cole o começo da sua letra aqui...&#10;&#10;(Em seguida, clique em algum card da [Estrutura da Composição] logo acima para injetar as instruções musicais automaticamente na posição do cursor.)"
                          className="w-full h-80 bg-[#f5f5f5] text-slate-800 border border-slate-200 rounded-3xl p-6 text-sm outline-none resize-y focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all shadow-inner leading-relaxed font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#161616]/50 rounded-[40px] p-8 border border-dashed border-white/10 flex flex-col items-center justify-center min-h-[500px] text-center animate-in fade-in duration-700">
              <div className="mb-10 relative">
                <Settings2 className="w-16 h-16 opacity-10 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Activity className="w-6 h-6 text-orange-500 opacity-20" />
                </div>
              </div>
              <h3 className="text-orange-500/50 text-xs font-black uppercase tracking-[0.3em] mb-4">
                Estúdio Virtual Ativo
              </h3>
              {activeTab === 'MANUAL' ? (
                <>
                  <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-6 max-w-xs">
                    Selecione rapidamente um dos gêneros disponíveis:
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 w-full max-w-2xl px-2">
                     {ALL_GENRES.map((genre) => (
                       <button
                        key={genre}
                        onClick={() => {
                           setUserQuery(`Música estilo ${genre}`);
                           setBaseGenre(genre);
                           setSecondaryGenre('');
                           setActiveTab('MANUAL');
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                       >
                         {genre}
                       </button>
                     ))}
                  </div>
                </>
              ) : (
                <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-6 max-w-xs">
                  Preencha os dados no painel de controle para iniciar a produção.
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      {/* BIBLIOTECA LOCAL */}
      {savedPrompts.length > 0 && (
        <section className="max-w-6xl mx-auto mt-20 border-t border-white/10 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <History className="w-6 h-6 text-orange-500" /> Histórico de Sessões
            </h2>
            <div className="flex gap-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase px-4 py-2 bg-white/5 rounded-full border border-white/5">
                 {savedPrompts.length} Prompts Guardados
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedPrompts.map(p => (
              <div key={p.id} className="bg-[#161616] border border-white/5 p-6 rounded-[30px] group relative hover:border-orange-500/30 transition-all shadow-xl flex flex-col justify-between">
                <div className="absolute top-5 right-5 flex gap-1">
                  <button 
                    onClick={() => toggleFavorite(p.id)} 
                    className={`p-2 rounded-xl transition-all ${p.isFavorite ? 'text-amber-400 bg-amber-400/10' : 'text-slate-600 opacity-0 group-hover:opacity-100 hover:bg-white/5'}`}
                  >
                    <Star className={`w-4 h-4 ${p.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => deleteEntry(p.id)} 
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-500/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest truncate max-w-[120px]">
                      {renderSafe(p.genre)}
                    </p>
                    {p.isFavorite && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>}
                  </div>
                  
                  <div className="flex items-center justify-between group/name">
                    <p className="text-sm text-white font-bold truncate">
                      {p.customName || `${p.bpm} BPM • ${renderSafe(p.key)}`}
                    </p>
                    <button 
                      onClick={() => {
                        const name = prompt("Novo nome para esta sessão:", p.customName || "");
                        if (name !== null) renameEntry(p.id, name);
                      }}
                      className="opacity-0 group-hover/name:opacity-100 p-1 hover:text-orange-500 transition-all"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => { setMaestroAnalysis(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="w-full py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all"
                >
                  Abrir no Estúdio
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MODAL PROGGEN */}
      {showProggenModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161616] w-full max-w-md rounded-[40px] border border-white/5 shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-8 pb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  PROGGEN
                </h2>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 block">Gerador de Progressões</span>
              </div>
              <button onClick={() => setShowProggenModal(false)} className="bg-white/5 hover:bg-white/10 p-2 rounded-full text-slate-400 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 space-y-6">
              
              {/* TOM / KEY Selector */}
              <div>
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-3">Tom / Key</label>
                <div className="bg-[#121212] border border-white/5 p-4 rounded-3xl">
                  <div className="flex flex-wrap gap-2">
                    {ALL_24_KEYS.map(k => (
                      <button 
                        key={k} 
                        onClick={() => setProggenKey(k)}
                        className={`font-bold transition-all px-3 py-2 rounded-xl text-[11px] flex-1 min-w-[36px] ${proggenKey === k ? 'bg-white text-black shadow-lg scale-110' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STYLE Selector */}
              <div>
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-3">Estilo / Vibe</label>
                <div className="relative">
                  <button 
                    onClick={() => setIsProggenStylesOpen(!isProggenStylesOpen)}
                    className="w-full bg-[#121212] border border-white/5 px-5 py-4 rounded-3xl text-left text-sm font-bold text-white flex justify-between items-center outline-none min-h-[56px] focus:border-indigo-500/50 transition-all"
                  >
                    {proggenStyle.label}
                  </button>
                  {isProggenStylesOpen && (
                    <div className="absolute top-[64px] left-0 w-full bg-[#121212] border border-indigo-500/30 rounded-2xl shadow-xl overflow-hidden z-20 animate-in slide-in-from-top-2 duration-200">
                      <div className="max-h-[250px] overflow-y-auto custom-scrollbar flex flex-col">
                        {PROGGEN_STYLES.map(style => (
                          <button 
                            key={style.id}
                            onClick={() => { setProggenStyle(style); setIsProggenStylesOpen(false); }}
                            className={`w-full text-left px-5 py-3 text-sm font-bold transition-all hover:bg-indigo-500/20 ${proggenStyle.id === style.id ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
                          >
                            {style.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RESULT DISPLAY */}
              <div className="text-center py-4 bg-black/40 rounded-3xl border border-white/5">
                <p className="text-2xl font-black text-blue-400 tracking-widest font-sans">
                  {proggenStyle.keys.map(k => CHORD_MAP[proggenKey]?.[k] || '?').join(' ')}
                </p>
              </div>

            </div>

            {/* Actions */}
            <div className="px-8 pb-8 flex gap-4">
              <button 
                onClick={() => {
                  const text = proggenStyle.keys.map(k => CHORD_MAP[proggenKey]?.[k]).join(' ');
                  copyPrompt(text);
                }}
                className="bg-[#222] hover:bg-[#333] text-slate-300 text-[10px] font-black px-6 py-4 rounded-2xl transition-all uppercase"
              >
                Copiar
              </button>
              <button 
                onClick={() => {
                  const resultStr = proggenStyle.keys.map(k => CHORD_MAP[proggenKey]?.[k]).join('-');
                  setChordProgression(`${proggenStyle.label.split('(')[0].trim()} (${resultStr})`);
                  setMusicalKey(proggenKey.replace('m', ''));
                  setKeyMode(proggenKey.endsWith('m') ? 'MENOR' : 'MAIOR');
                  setShowStructureSystem(true);
                  setShowProggenModal(false);
                }}
                className="flex-1 bg-white hover:bg-slate-200 text-black text-[11px] font-black px-6 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all shadow-xl active:scale-95 uppercase"
              >
                Aplicar ao Maestro
              </button>
            </div>
            {/* Indigo accent line bottom */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600 absolute bottom-0 rounded-b-[40px]"></div>
          </div>
        </div>
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