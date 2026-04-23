import React, { useState, useEffect, useRef, useMemo } from 'react';
import tagsData from './tags.json';

import { 
  Music, Wand2, Settings2, Play, Copy, CheckCheck, AlertCircle, 
  Layers, Mic2, ArrowRight, Search, Upload, 
  FileAudio, Activity, X, Save, Trash2, History, RotateCcw,
  ChevronDown, ChevronUp, Star, Edit3, Sparkles, Copy as CopyIcon, 
  Split, Award
} from 'lucide-react';

/**
 * MAESTRO STUDIO PRO - VERSÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O DEFINITIVA VERCEL
 * Corrigido para ser funcional, com IA e armazenamento local.
 */

// FunÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o para aceder ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  API Key de forma segura
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
  "Chillwave", "Chorinho", "Classical", "Cordel", "Country", "Dancehall", "Disco", "Drum & Bass", "Dubstep", 
  "Electronic", "Flamenco", "Folk", "ForrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³", "Funk", "Garage Rock", "Gospel", "Grunge", "Guarania", "Hardstyle", 
  "Hip-Hop", "House", "Indie", "Indie Pop", "Indie Rock", "Industrial", "Instrumental", "J-Pop", 
  "Jazz", "K-Pop", "Klezmer", "Lambada", "Latin", "Lo-Fi", "Math Rock", "Metal", "MPB", "New Wave", 
  "ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œpera", "Pagode", "Phonk", "Podcast", "Pop", "Post-Rock", "Psychedelic Rock", "Punk", "R&B", 
  "Rap", "Reggae", "Reggaeton", "Repente", "Rock", "Samba", "Sertanejo", "Sertanejo Raiz", "Sertanejo UniversitÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio", "Ska", "Soul", "Soundtrack", 
  "Surf Music", "Synthwave", "Tango", "Techno", "Trance", "Trap", "Valsa", "Vaporwave"
];

// Constantes de ConfiguraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Profissional (Inspirado no Magic Prompt)
const VOCAL_ARCHETYPES = [
  { id: 'Male Vocal', label: 'Male Vocal', desc: 'Vocal Masculino (Cantado)' },
  { id: 'Female Vocal', label: 'Female Vocal', desc: 'Vocal Feminino (Cantado)' },
  { id: 'Child Vocal', label: 'Child Vocal', desc: 'Vocal Juvenil/Infantil (Cantado)' },
  { id: 'Modern Pop', label: 'Modern Pop', desc: 'Limpo e produzido' },
  { id: 'Rock Grit', label: 'Rock Grit', desc: 'Energia e drive' },
  { id: 'Intimate Folk', label: 'Intimate Folk', desc: 'Suave e acÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico' },
  { id: 'Deep Soul', label: 'Deep Soul', desc: 'Grave e emotivo' },
  { id: 'Dreamy Pop', label: 'Dreamy Pop', desc: 'EtÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©reo e com ar' },
  { id: 'Soulful R&B', label: 'Soulful R&B', desc: 'Seda e veludo' },
  { id: 'Spoken Narrator', label: 'Male Narrator', desc: 'Fala/NarraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o (Homem)' },
  { id: 'Female Narrator', label: 'Female Narrator', desc: 'Fala/NarraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o (Mulher)' },
  { id: 'Child Narrator', label: 'Child Narrator', desc: 'Fala/NarraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o (CrianÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§a)' },
];

const BPM_RANGES = [
  { id: 'LENTO', label: 'LENTO (60-80)' },
  { id: 'MÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°DIO', label: 'MÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°DIO (90-110)' },
  { id: 'MODERADO', label: 'MODERADO (110-130)' },
  { id: 'RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂPIDO', label: 'RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂPIDO (130-160)' },
  { id: 'MUITO RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂPIDO', label: 'MUITO RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂPIDO (160+)' }
];

const TIME_SIGNATURES = ['4/4', '3/4', '6/8', '2/4', '5/4', '7/8'];

const VOCAL_TONES = [
  { id: 'grave', label: 'Grave', value: 'deep voice, low-pitched vocals' },
  { id: 'normal', label: 'Normal', value: '' },
  { id: 'agudo', label: 'Agudo', value: 'high-pitched voice, higher tone' }
];

const VOCAL_TEXTURES = [
  { id: 'limpa', label: 'Limpa', value: 'clean crystal clear vocals' },
  { id: 'rustica', label: 'RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstica', value: 'raw unpolished gravelly texture' },
  { id: 'rouca', label: 'Rouca', value: 'raspy hoarse husky vocals' }
];


const MUSICAL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALES = ['MAIOR', 'MENOR NATURAL', 'MENOR HARMÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂNICA', 'MENOR MELÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œDICA', 'PENTATÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂNICA', 'BLUES'];

const CHORD_PROGRESSIONS = [
  { id: 'POP', label: 'I-V-VI-IV (POP)' },
  { id: 'ROCK', label: 'I-IV-V (ROCK)' },
  { id: 'JAZZ', label: 'II-V-I (JAZZ)' },
  { id: 'EMOCIONAL', label: 'VI-IV-I-V (EMOCIONAL)' }
];

const GROOVES = ['STRAIGHT', 'SWING', 'SHUFFLE', 'FUNK GROOVE', 'HALF-TIME', 'DOUBLE-TIME'];

const EMOTIONS = ['ALEGRE', 'MELANCÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œLICO', 'TENSO', 'ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°PICO', 'NOSTÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂLGICO'];

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
      'iiÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°': getNoteStr(root, 2) + 'dim',
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
      'viiÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°': getNoteStr(root, 11) + 'dim',
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
  { id: 'drumbass', label: 'Drum & Bass / Dark (i-VI)', keys: ['i', 'VI'] },

  { id: 'rock50s', label: 'Doo-Wop / 50s (I-vi-IV-V)', keys: ['I', 'vi', 'IV', 'V'] },
  { id: 'rock', label: 'Rock ClÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ssico (I-IV-V)', keys: ['I', 'IV', 'V'] },
  { id: 'blues', label: 'Blues 12-Bar (I-IV-I-V-IV)', keys: ['I', 'IV', 'I', 'V', 'IV', 'I'] },
  { id: 'country', label: 'Country Road (I-V-IV-I)', keys: ['I', 'V', 'IV', 'I'] },

  // ================= SOUL / JAZZ / LOFI ================= //
  { id: 'jazz', label: 'Jazz Standard (ii-V-I)', keys: ['ii', 'V', 'I'] },
  { id: 'rnb', label: 'R&B ClÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ssico (I-vi-ii-V)', keys: ['I', 'vi', 'ii', 'V'] },
  { id: 'lofi', label: 'Lofi / Chill (Imaj7-vi-IVmaj7-V)', keys: ['Imaj7', 'vi', 'IVmaj7', 'V'] },
  { id: 'bossa', label: 'Bossa Nova Base (Imaj7-ii-V)', keys: ['Imaj7', 'ii', 'V'] },
  { id: 'neo_soul', label: 'Neo-Soul Groove (ii-V-Imaj7-vi)', keys: ['ii', 'V', 'Imaj7', 'vi'] },
  { id: 'funk', label: 'Funk / Soul Vamp (I-IV)', keys: ['I', 'IV'] },

  // ================= MENORES / TRISTES / ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°PICOS ================= //
  { id: 'melancolico', label: 'Pop MelancÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lico (vi-IV-I-V)', keys: ['vi', 'IV', 'I', 'V'] },
  { id: 'epic', label: 'ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°pico / Hans Zimmer (i-VI-III-VII)', keys: ['i', 'VI', 'III', 'VII'] },
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
  { label: 'Indie Folk', query: 'Folk melÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³dico com violÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes e harmonias vocais', genre: 'Indie Folk', category: 'Rock' },
  { label: 'Punk Rock', query: 'Punk enÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rgico e rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pido com atitude', genre: 'Punk Rock', category: 'Rock' },
  
  // ELETRÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂNICA
  { label: 'Synthwave', query: 'Viagem nostÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lgica aos anos 80 com sintetizadores retro', genre: 'Synthwave', category: 'Electronic' },
  { label: 'Dark Techno', query: 'Techno industrial sombrio com batida 4x4 hipnÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³tica', genre: 'Industrial Techno', category: 'Electronic' },
  { label: 'Lo-Fi Chill', query: 'Batidas relaxantes com texturas de vinil', genre: 'Lo-Fi Hip Hop', category: 'Electronic' },
  { label: 'House Music', query: 'Groove clÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ssico de Chicago para as pistas', genre: 'Deep House', category: 'Electronic' },
  { label: 'Drum & Bass', query: 'Batidas rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pidas e intensas com baixos profundos e sintÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ticos', genre: 'Drum & Bass', category: 'Electronic' },


  // BRASIL
  { label: 'Bossa Nova', query: 'Samba suave com violÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de nylon e voz sussurrada', genre: 'Bossa Nova / Jazz', category: 'Brasil' },
  { label: 'Samba Raiz', query: 'Roda de samba clÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ssica com cavaco e pandeiro', genre: 'Samba', category: 'Brasil' },
  { label: 'Chorinho', query: 'Choro clÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ssico e virtuoso com ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªnfase no cavaquinho, violÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de 7 cordas e pandeiro', genre: 'Chorinho', category: 'Brasil' },
  { label: 'ForrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³ PÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© de Serra', query: 'Ritmo nordestino animado com sanfona, triÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ngulo e zabumba', genre: 'ForrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³', category: 'Brasil' },
  { label: 'Repente Nordestino', query: 'Duelo PoÃƒÂ©tico improvisado com violas e MÃƒÂ©trica rigorosa', genre: 'Repente', category: 'Brasil' },
  { label: 'Funk Brasil', query: 'BatidÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de favela com graves potentes', genre: 'Funk Carioca', category: 'Brasil' },
  { label: 'MPB Moderna', query: 'MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsica Popular Brasileira com toques eletrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nicos', genre: 'MPB / Nu-Jazz', category: 'Brasil' },
  { label: 'Sertanejo UniversitÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio', query: 'Sertanejo moderno com arranjos pop, guitarras e sanfona animada', genre: 'Sertanejo UniversitÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio', category: 'Brasil' },
  { label: 'Sertanejo Raiz', query: 'Sertanejo tradicional com violas caipiras e duo vocal harmÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nico', genre: 'Sertanejo Raiz', category: 'Brasil' },
  { label: 'Guarania', query: 'Ritmo fronteiriÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§o cadenciado e sentimental com violÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes e harpa', genre: 'Guarania', category: 'Brasil' },

  // URBANO
  { label: 'Melodic Trap', query: 'Trap moderno com sintetizadores etÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©reos e 808s', genre: 'Melodic Trap', category: 'Urbano' },
  { label: 'Afrobeat', query: 'Ritmos africanos modernos com grooves infecciosos', genre: 'Afrobeat', category: 'Urbano' },
  { label: 'Boom Bap', query: 'Rap clÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ssico dos anos 90 com samplers sujos', genre: 'Old School Hip Hop', category: 'Urbano' },
  { label: 'Reggaeton', query: 'Batida dembow com vocais urbanos', genre: 'Reggaeton', category: 'Urbano' },

  // CINEMATOGRÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂFICO
  { label: 'Epic Orchestral', query: 'Orquestra completa com coros ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©picos e percussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de guerra', genre: 'Cinematic / Epic', category: 'Cinematic' },
  { label: 'Cyberpunk', query: 'Darksynth futurista com atmosfera distÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³pica', genre: 'Cyberpunk / EBM', category: 'Cinematic' },
  { label: 'Ambient', query: 'Paisagens sonoras calmas para foco e relaxamento', genre: 'Ambient', category: 'Cinematic' }
];

const ADVANCED_INSTRUMENTS = [
  { label: 'ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes & AcÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsticos', items: [
    { name: 'ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Nylon', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o AÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§o', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o 12 Cordas', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' },
    { name: 'Viola Caipira', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'Cavaquinho', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂªÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢' }, { name: 'Fingerstyle', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¤Ãƒâ€¦Ã¢â‚¬â„¢' }, 
    { name: 'ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Percussivo', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Flamenco', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€ Ã¢â‚¬â„¢' }, { name: 'Fingerpicking', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¤Ãƒâ€šÃ‚Â' }, 
    { name: 'Strumming', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'HarmÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nicos', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“Ãƒâ€šÃ‚Â¨' }, { name: 'Rasgueado', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¤Ãƒâ€šÃ‚Â' },
    { name: 'Harpa', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“Ãƒâ€šÃ‚Â¨' }, { name: 'Lira', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¼' }, { name: 'Ukulele', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂªÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢' }
  ]},
  { label: 'Contrabaixos', items: [
    { name: 'Baixo ElÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©trico (4 cordas)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'Baixo 5 Cordas', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'Baixo 6 Cordas', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' },
    { name: 'Baixo Fretless', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'Baixo AcÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'Baixo SemiacÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' },
    { name: 'Fingerstyle (Bass)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¤Ãƒâ€¦Ã¢â‚¬â„¢' }, { name: 'Slap Bass', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â¥' }, { name: 'Pop Bass', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â¥' },
    { name: 'Palm Mute (Bass)', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â­ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢' }, { name: 'Pick Bass', icon: 'ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Tapping (Bass)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ' },
    { name: 'Hammer-On (Bass)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â¨' }, { name: 'Pull-Off (Bass)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°' }, { name: 'Slide (Bass)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒâ€šÃ‚Â¹' },
    { name: 'Vibrato (Bass)', icon: 'ÃƒÆ’Ã‚Â£ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â°ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Ghost Notes (Bass)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€šÃ‚Â»' }
  ]},
  { label: 'Guitarras ElÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tricas', items: [
    { name: 'Stratocaster', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'Telecaster', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'Les Paul', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' },
    { name: 'SG', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'Guitarra SemiacÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstica', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' }, { name: 'Guitarra Grunge', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¸' },
    { name: 'Alternate Picking', icon: 'ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Downpicking', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Sweep Picking', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â¹' },
    { name: 'Palm Mute (Gtr)', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â­ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢' }, { name: 'Hybrid Picking', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¤Ãƒâ€¦Ã¢â‚¬â„¢' }, { name: 'Hammer-On (Gtr)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â¨' },
    { name: 'Pull-Off (Gtr)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°' }, { name: 'Slide (Gtr)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒâ€šÃ‚Â¹' }, { name: 'Bend', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â¤Ãƒâ€šÃ‚Â´ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' },
    { name: 'Vibrato (Gtr)', icon: 'ÃƒÆ’Ã‚Â£ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â°ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Tapping (Gtr)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ' }, { name: 'Legato', icon: 'ÃƒÆ’Ã‚Â£ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â°ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }
  ]},
  { label: 'Efeitos de Pedais', items: [
    { name: 'Overdrive', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â¥' }, { name: 'Distortion', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡Ãƒâ€šÃ‚Â¡' }, { name: 'Fuzz', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€¦Ã‚Â ' },
    { name: 'Chorus', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€¦Ã‚Â ' }, { name: 'Flanger', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Phaser', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬' },
    { name: 'Tremolo', icon: 'ÃƒÆ’Ã‚Â£ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â°ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Reverb', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€¦Ã‚Â ' }, { name: 'Delay', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â³' },
    { name: 'Compressor', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ÂÃƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Noise Gate', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°' }, { name: 'Equalizer', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' },
    { name: 'Wah-Wah', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â¶' }, { name: 'Octaver', icon: '2ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¢Ãƒâ€ Ã¢â‚¬â„¢Ãƒâ€šÃ‚Â£' }, { name: 'Looper', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â' }, { name: 'Pitch Shifter', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }
  ]},
  { label: 'Pianos & Teclados', items: [
    { name: 'Piano AcÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' }, { name: 'Piano de Cauda', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' }, { name: 'Piano ElÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©trico (Rhodes)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' },
    { name: 'Wurlitzer', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' }, { name: 'ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œrgÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Hammond', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' }, { name: 'ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œrgÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de Tubos', icon: 'ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒâ€šÃ‚Âª' },
    { name: 'Cravo', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' }, { name: 'Mellotron', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¼' }, { name: 'Clavinete', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' },
    { name: 'Acordeom', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂªÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â' }
  ]},
  { label: 'Sintetizadores & Digital', items: [
    { name: 'Synth Lead', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â¡ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬' }, { name: 'Synth Pad', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¹Ã…â€œÃƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Synth Bass', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°' },
    { name: 'Arpeggiator', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¾Ãƒâ€šÃ‚Â¿' }, { name: 'Wavetable Synth', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€¦Ã‚Â ' }, { name: 'Modular Synth', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€¦Ã¢â‚¬â„¢' },
    { name: 'FM Synth', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â»' }, { name: 'Vocoder', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¤ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“' }, { name: 'Chiptune / 8-bit', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€šÃ‚Â¾' }
  ]},
  { label: 'Cordas & Orquestra', items: [
    { name: 'Violino', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â»' }, { name: 'Viola', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â»' }, { name: 'Cello', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â»' },
    { name: 'Contrabaixo AcÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â»' }, { name: 'SeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de Cordas', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â»' }, { name: 'Quarteto de Cordas', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â»' },
    { name: 'Harpa Orquestral', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“Ãƒâ€šÃ‚Â¨' }, { name: 'Trompete', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Âº' }, { name: 'Trombone', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Âº' },
    { name: 'Saxofone', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â·' }, { name: 'Flauta', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Clarinete', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' },
    { name: 'Gaita (Harmonica)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾' }, { name: 'Tuba', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Âº' }, { name: 'Assobio (Whistle)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¹Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â' }
  ]},
  { label: 'Bateria Completa', items: [
    { name: 'Caixa', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Bumbo', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Chimbal', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¡' }, { name: 'Tons', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' },
    { name: 'Surdo', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Crash', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â¥' }, { name: 'Ride', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¡' }, { name: 'Ghost Notes', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€šÃ‚Â»' },
    { name: 'Rimshot', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â¢' }, { name: 'Groove Shuffle', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢Ãƒâ€šÃ‚Âº' }, { name: 'Half-Time', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â³' }, { name: 'Double-Time', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡Ãƒâ€šÃ‚Â¡' }
  ]},
  { label: 'PercussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Brasileira', items: [
    { name: 'Pandeiro', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Surdo de Samba', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Tamborim', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' },
    { name: 'CuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ca', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â»' }, { name: 'AgogÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â€šÂ¬Ã‚Â' }, { name: 'Reco-Reco', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â¢' },
    { name: 'GanzÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Caixa de Samba', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Repique de MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€šÃ‚Â' },
    { name: 'Atabaque', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Berimbau', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â¹' }
  ]},
  { label: 'PercussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Latina', items: [
    { name: 'Congas', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'BongÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´s', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Timbales', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' },
    { name: 'Claves', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â¢' }, { name: 'Maracas', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Guiro', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â¢' }
  ]},
  { label: 'PercussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Africana', items: [
    { name: 'DjembÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âª', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Talking Drum', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Udu', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Âº' }, { name: 'Balafon', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' }
  ]},
  { label: 'PercussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Mundial', items: [
    { name: 'CajÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¦' }, { name: 'Darbuka', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Tabla', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' },
    { name: 'Taiko', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'BodhrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡n', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }
  ]},
  { label: 'PercussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Orquestral', items: [
    { name: 'TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­mpanos', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€šÃ‚Â' }, { name: 'Xilofone', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' }, { name: 'Vibrafone', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' },
    { name: 'Marimba', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¹' }, { name: 'TriÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ngulo', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â' }, { name: 'Pratos Orquestrais', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¡' },
    { name: 'Glockenspiel', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â€šÂ¬Ã‚Â' }, { name: 'Sinos (Bells)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â€šÂ¬Ã‚Â' }
  ]},
  { label: 'PercussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Moderna', items: [
    { name: 'Pads EletrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nicos', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â¹ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Drum Machine', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â»' }, { name: 'Samples', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ÂÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â' }, { name: 'Sound FX', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€¦Ã‚Â ' }
  ]},
  { label: 'Efeitos & AmbiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia (SFX)', items: [
    { name: 'Chuva (Rain)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€šÃ‚Â§ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â', prompt: 'heavy rain pouring with clear water drops hitting surfaces, cinematic ambience, clearly audible' },
    { name: 'Vento (Wind)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â', prompt: 'strong wind blowing, howling sound, atmospheric and immersive, clearly audible' },
    { name: 'TrovÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o (Thunder)', icon: 'ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â', prompt: 'distant thunder rumbling occasionally, adding tension to the scene, clearly audible' },
    { name: 'Ondas do Mar (Waves)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€¦Ã‚Â ', prompt: 'ocean waves gently crashing on the shore, relaxing beach ambience, clearly audible' },
    { name: 'Natureza (Birds/Forest)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€ Ã¢â‚¬â„¢', prompt: 'forest ambience with birds chirping, leaves rustling, peaceful natural environment, clearly audible' },
    { name: 'Palmas (Claps)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€šÃ‚Â', prompt: 'crowd clapping in sync, energetic and lively, clearly audible' },
    { name: 'Sirene (Siren)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â¡Ãƒâ€šÃ‚Â¨', prompt: 'distant police siren echoing in the background, urban atmosphere, clearly audible' },
    { name: 'Apito (Referee)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â£', prompt: 'sharp referee whistle sound, short and piercing, clearly audible' },
    { name: 'Tic-Tac (RelÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³gio)', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â±ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â', prompt: 'clear ticking clock sound, repetitive and noticeable, clearly audible' },
    { name: 'RuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­do de Vinil (Vinyl)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â»', prompt: 'vinyl crackle noise, lo-fi texture, nostalgic sound, clearly audible' },
    { name: 'MultidÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o (Crowd)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€šÃ‚Â¥', prompt: 'crowd murmuring and reacting, stadium-like atmosphere, clearly audible' },
    { name: 'Passos (Footsteps)', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€šÃ‚Â£', prompt: 'clear footsteps sound on hard floor, rhythmic and noticeable, clearly audible' },
    { name: 'Impacto CinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fico', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â¥', prompt: 'cinematic impact braam, heavy and powerful hit, prominent in the mix' }
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
  const audioPreviewRef = useRef(null);
  const [activePreviewGenre, setActivePreviewGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [tempName, setTempName] = useState('');

  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [promptA, setPromptA] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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
  
  // ESTADOS DA ABA ESSENCIAL
  const [essencialArrangement, setEssencialArrangement] = useState('DUO');
  const [essencialPrimaryInst, setEssencialPrimaryInst] = useState('');
  const [essencialSecondaryInst, setEssencialSecondaryInst] = useState('');
  const [essencialTertiaryInst, setEssencialTertiaryInst] = useState('');
  const [essencialVocal, setEssencialVocal] = useState(true);
  const [essencialStyle, setEssencialStyle] = useState('');
  const [essencialMood, setEssencialMood] = useState('Agradecido');

  // NOVOS ESTADOS - SISTEMA DE TAGS INTELIGENTES
  const [generationMode, setGenerationMode] = useState('inteligente'); // 'basico', 'inteligente', 'minimalista'
  const [selectedLibraryTags, setSelectedLibraryTags] = useState([]);
  const [searchTagTerm, setSearchTagTerm] = useState('');
  const [showTagLibrary, setShowTagLibrary] = useState(false);



  const [showProggenModal, setShowProggenModal] = useState(false);
  const [proggenKey, setProggenKey] = useState('C');
  const [proggenStyle, setProggenStyle] = useState(PROGGEN_STYLES[0]);
  const [isProggenStylesOpen, setIsProggenStylesOpen] = useState(false);

  const [showArranger, setShowArranger] = useState(false);
  const [arrangerStep, setArrangerStep] = useState(1);
  
  // ESTADOS DO NOVO COMPOSITOR DE LETRAS
  const [lyricsTheme, setLyricsTheme] = useState('');
  const [lyricsGenre, setLyricsGenre] = useState('');
  const [lyricsMood, setLyricsMood] = useState('Emocional');
  const [lyricsStructure, setLyricsStructure] = useState(['Intro', 'Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Bridge', 'Chorus', 'Outro']);
  const [lyricsRhymeStyle, setLyricsRhymeStyle] = useState('Rimas Ricas'); // 'Ricas', 'Simples', 'Versos Livres'
  const [lyricsKeywords, setLyricsKeywords] = useState('');
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [lyricsResult, setLyricsResult] = useState('');
  const [lyricsLanguage, setLyricsLanguage] = useState('Portuguese');
  
  // OpÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes AvanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§adas de composiÃƒÂ§ÃƒÂ£o
  const [lyricsComplexity, setLyricsComplexity] = useState('PoÃƒÂ©tico');
  const [lyricsMeter, setLyricsMeter] = useState('MÃƒÂ©dio');
  const [lyricsPerspective, setLyricsPerspective] = useState('1ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âª Pessoa (Eu)');

  const [arrangerData, setArrangerData] = useState({
    intention: { message: '', feeling: '', mood: '' },
    references: { links: '', preferences: '', nature: 'similar' },
    vocal: { singer: '', range: '', gender: '', strength: '', focus: '' },
    structure: { defined: 'NÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o', helpNeeded: false, chorusGrowth: '' },
    style: { main: '', mix: '', defineForMe: false },
    rhythm: { tempo: '', nature: '', groove: '' },
    harmony: { hasChords: 'NÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o', complexity: '', flavor: '' },
    instrumentation: { instruments: [], defineForMe: false, nature: '' },
    dynamics: { start: '', chorus: '', transitions: '' },
    production: { era: '', texture: '' },
    objective: { platform: '', projectType: '' },
    freedom: { level: 'Moderada', changesAllowed: [] },
    lyrics: { text: '', analyzeMetric: false },
    extra: { highlightedWords: '', unchangeableParts: '', keyMoment: '' }
  });

  const handleMagicGenerator = () => {
    setShowProggenModal(true);
  };

  // DicionÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio de SugestÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes Inteligentes (Mapeamento de Artistas/GÃƒÂªneros)
  const SMART_SUGGESTIONS = {
    'R.E.M.': {
      label: 'Estilo R.E.M. (Folk Rock)',
      genre: 'Folk Rock / Alternative',
      vocal: 'Dreamy Pop',
      instruments: ['ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o AÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§o', 'Guitarra ElÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©trica', 'Baixo ElÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©trico', 'Bateria Completa', 'Piano AcÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico'],
      negative: 'heavy metal, electronic, high gain'
    },
    'Queen': {
      label: 'Estilo Queen (Stadium Rock)',
      genre: 'Glam Rock / Opera Rock',
      vocal: 'Rock Grit',
      instruments: ['Piano AcÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico', 'Guitarra ElÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©trica', 'Baixo ElÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©trico', 'Bateria Completa', 'Violino/Strings'],
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
      instruments: ['ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Nylon', 'Piano AcÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico', 'Baixo ElÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©trico', 'Pandeiro', 'Flauta'],
      negative: 'distorted, metal, trap'
    },
    'Chorinho': {
      label: 'Estilo Chorinho (Brasil)',
      genre: 'Chorinho / Samba-Choro',
      vocal: 'None',
      instruments: ['Cavaquinho', 'ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Nylon', 'ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o 7 Cordas', 'Pandeiro', 'Flauta'],
      negative: 'electronic, synth, heavy drums, electric guitar, trap, metal'
    },
    'Drum & Bass': {
      label: 'Estilo Drum & Bass (EletrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nica)',
      genre: 'Drum & Bass / Jungle',
      vocal: 'None',
      instruments: ['Synth Lead', 'Synth Pad', 'Drum Machine', 'Sub Bass', 'Efeitos FX'],
      negative: 'acoustic, folk, guitar, piano'
    }

  };

  // Efeito para simular progresso durante a geraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
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
    const input = (activeTab === 'INFLUÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â NCIA' ? referenceInput : userQuery).toLowerCase();
    
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
      const genreContext = baseGenre ? `GÃƒÂªnero Base Selecionado: ${baseGenre}. ` : '';
      finalQuery = `${genreContext}Briefing: ${userQuery}`;
    }
    else if (activeTab === 'ESSENCIAL') {
      const insts = [essencialPrimaryInst, essencialSecondaryInst, essencialTertiaryInst].filter(Boolean).join(' and ');
      const arrangement = essencialArrangement.charAt(0) + essencialArrangement.slice(1).toLowerCase();
      finalQuery = `
        [STYLE FEEL]
        ${essencialStyle ? `Acoustic music inspired by ${essencialStyle} rhythm` : 'Minimalist acoustic arrangement'}, ${essencialMood.toLowerCase()} atmosphere

        [INSTRUMENTATION - PRIORITY]
        ONLY ${insts}${essencialVocal ? ' and voice' : ''}

        [RESTRICTIONS]
        No percussion, no drums, no bass, no piano (unless specified), no orchestration, no additional instruments

        [ARRANGEMENT]
        ${arrangement}, intimate, stripped-down performance, focal point on ${essencialPrimaryInst}

        [MOOD]
        ${essencialMood}
      `;
    }
    else if (activeTab === 'INFLUÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â NCIA') finalQuery = `Artista: ${referenceInput}. Detalhes: ${userQuery}`;
    else if (activeTab === 'DNA ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂUDIO') finalQuery = `ReferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia: ${selectedFile?.name}. InstruÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes: ${userQuery}`;
    else if (activeTab === 'INSIGHT VISUAL') finalQuery = `Imagem de ReferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia: ${imageFile?.name}. InstruÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes: ${userQuery}`;

    if (!finalQuery.trim() && !selectedFile && !imageFile) return;

    if (!apiKey) {
      setError("Falta a API Key no ficheiro .env (VITE_GEMINI_API_KEY)");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const systemPrompt = `ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°s o "Maestro Studio Pro", um Produtor Musical lendÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio e Engenheiro de Prompts para Suno/Udio. 
    Analisa os inputs e responde APENAS em JSON. 
    
    DIRETRIZES CRÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂTICAS:
    1. IDIOMA DA ANÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂLISE: O campo "style_analysis" DEVE ser escrito em PORTUGUÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â S DO BRASIL.
    2. IDIOMA VOCAL: Especifique sempre "Vocals in Brazilian Portuguese" no final_prompt para garantir o sotaque correto.
    3. FUSÃƒÆ’O DE GÃƒÅ NEROS: Se houver um GÃƒÂªnero SecundÃƒÂ¡rio, descreva uma transiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o ou mistura fluida.
    4. CONTROLE DE PERCUSSÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O: Se a percussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o for solicitada, NÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O use termos de bateria.
    5. MODO ESSENCIAL (CRÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂTICO): Se o input contiver [INSTRUMENTATION - PRIORITY], o prompt final DEVE ser ultra-minimalista. NÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O adicione baixo, bateria ou preenchimentos orquestrais. Foque TOTALMENTE nos instrumentos listados. Se disser "ONLY X", remova QUALQUER outro instrumento.
    6. DNA VOCAL & SPOKEN INTRO: Integre o "ArquÃƒÂ©tipo Vocal" na descriÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o. Se o usuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio escolher "Male Vocal" ou "Female Vocal", especifique claramente o GÃƒÂªnero e que ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© voz cantada. Se escolher vocal de crianÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§a, use tags como "children's vocal", "child voice" ou "kids vocal". Se escolher "Spoken Narrator", "Female Narrator" ou "Child Narrator", VocÃƒÂª DEVE incluir tags como "spoken intro", "spoken male voice", "spoken female voice" ou "spoken child voice" no Master Prompt e descrever uma introduÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o narrativa. Use "..." (reticÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias) na estruturaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de letras caso sugerido para criar pausas naturais.
    7. SOUND DESIGN (SFX): Se SFX forem selecionados, use terminologia tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnica no final_prompt como "Field Recording", "Nature soundscape", "Diegetic Sound" e "Atmospheric Texture". NUNCA use tags tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnicas curtas como [SFX: Rain].
    8. STYLE TAGS (CRÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂTICO): String de tags curtas em INGLÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â S. MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂXIMO DE 120 CARACTERES. PRIORIDADE: Se houver SFX, as tags de SFX DEVEM vir no INÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂCIO da string (ex: "Nature soundscape, Field recording, Birds, Wind, Indie Pop..."). Para o modo ESSENCIAL, as tags devem incluir "Solo", "Acoustic" ou "Duo" e listar APENAS os instrumentos solicitados.
    9. SFX INTRO HACK (ESTRUTURA): Comandos de tempo e transiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o literal (ex: "comeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ar sÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³ com vento por 5 segundos") DEVEM ser colocados dentro do bloco "Intro" (ou o bloco inicial) da "musical_structure", formatados como "[Intro: Ambient sounds only for 5 seconds, no instruments]".
    10. DICAS DE PRODUÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O: O campo "production_tips" deve conter conselhos tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnicos em PORTUGUÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â S (ex: "Use o Custom Mode no Suno", "Sugerido 120 BPM").
    11. ESTRUTURA MUSICAL: O campo "musical_structure" DEVE SER SEMPRE GERADO como um objeto detalhado com blocos. O CONTEÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â¡DO de cada bloco DEVE SER EM INGLÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â S TÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°CNICO. Integre as ambiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias aqui para melhor timing. No modo ESSENCIAL, a estrutura deve refletir a simplicidade do arranjo.
    12. ANÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂLISE VISUAL (INSIGHT VISUAL): Se uma imagem for fornecida, analise a paleta de cores, iluminaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, ambiente e emoÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes visuais. Converta isso em elementos musicais. Ex: Tons quentes e ambientes internos sugerem Jazz, Bossa Nova ou Lofi; tons neon sugerem Synthwave; paisagens amplas e naturais sugerem Orchestral ou Ambient; cenas urbanas cinzas sugerem Industrial ou Techno.
    
    JSON:
    {
      "genre": "GÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©nero",
      "bpm": "BPM",
      "key": "Tom",
      "style_analysis": "AnÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lise em PT-BR (inclua a interpretaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o visual se houver imagem)",
      "instruments": ["Lista"],
      "style_tags": "Tags em EN (MAX 120 chars, SFX First). SIGA A HIERARQUIA: [SFX] > Genre > Instruments > Vocals > Mood > Production.",
      "final_prompt": "Master Prompt curto em EN",
      "production_tips": "Dicas em PT-BR",
      "musical_structure": null
    }`;

    const modeInstructions = {
      basico: "Siga o briefing do usuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio de forma livre.",
      inteligente: "Otimize o prompt evitando conflitos (ex: nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o misture 'lo-fi' com 'high fidelity' a menos que faÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§a sentido artÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­stico). Priorize clareza e use a hierarquia de tags sugerida.",
      minimalista: "MODO ULTRA-MINIMALISTA: Limite a no mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ximo 2 instrumentos. Remova percussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o pesada, baterias e preenchimentos orquestrais. Foco em 'clean mix', 'acoustic', 'minimalist' e 'solo'."
    };


    try {
      let modContext = "";
      if (modifier === 'energetic') modContext = "\nVARIAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O: Torne o prompt muito mais enÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rgico, agressivo e dinÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢mico.";
      if (modifier === 'slow') modContext = "\nVARIAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O: Torne o prompt muito mais lento, calmo e atmosfÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rico.";
      if (modifier === 'emotional') modContext = "\nVARIAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O: Torne o prompt profundamente emocional, melancÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lico e expressivo.";

      const expertContext = `
        GÃƒÂªnero SecundÃƒÂ¡rio: ${secondaryGenre || 'Nenhum'}
        ArquÃƒÂ©tipo Vocal: ${vocalArchetype || 'AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico'}
        Timbre Vocal: ${VOCAL_TONES.find(t => t.id === vocalTone)?.label || 'Normal'}
        Texturas Vocais: ${vocalTextures.length > 0 ? vocalTextures.map(id => VOCAL_TEXTURES.find(t => t.id === id)?.label).join(', ') : 'Nenhuma'}
        Instrumentos Selecionados: ${selectedInstruments.join(', ') || 'AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico'}
        BPM / Andamento: ${selectedBpm || 'AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico'}
        Compasso: ${timeSignature || 'AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico'}
        Tom & Modo: ${musicalKey ? `${musicalKey} ${keyMode}` : 'AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico'}

        Escala: ${scale || 'AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico'}
        ProgressÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de Acordes: ${chordProgression || 'AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico'}
        Groove / Feel: ${groove || 'AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico'}
        EmoÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Musical: ${emotion || 'AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico'}
        Excluir (Prompt Negativo): ${negativePrompt || 'Nenhum'}
        
        --- SISTEMA DE TAGS INTELIGENTES ---
        Modo de GeraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o: ${generationMode.toUpperCase()}
        InstruÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o do Modo: ${modeInstructions[generationMode]}
        Tags Selecionadas da Biblioteca: ${selectedLibraryTags.join(', ')}
        
        ${modContext}
      `;

      const parts = [{ text: `${finalQuery}\n\n--- CONFIGURAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O EXPERT ---\n${expertContext}` }];
      
      // Se tiver arquivo e estiver na aba DNA ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂUDIO, envia o ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡udio para a IA
      if (selectedFile && activeTab === 'DNA ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂUDIO') {
        try {
          const base64Data = await fileToBase64(selectedFile);
          parts.push({
            inline_data: {
              mime_type: selectedFile.type,
              data: base64Data
            }
          });
        } catch (e) {
          console.error("Erro ao processar ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡udio:", e);
        }
      }

      // Se tiver imagem e estiver na aba INSIGHT VISUAL, envia a imagem para a IA
      if (imageFile && activeTab === 'INSIGHT VISUAL') {
        try {
          const base64Data = await fileToBase64(imageFile);
          parts.push({
            inline_data: {
              mime_type: imageFile.type,
              data: base64Data
            }
          });
        } catch (e) {
          console.error("Erro ao processar imagem:", e);
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
      if (!text) throw new Error("A IA nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o retornou uma resposta vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lida.");
      const result = JSON.parse(text);
      
      if (isComparisonMode && maestroAnalysis) {
        setPromptA({ ...maestroAnalysis });
      }
      setMaestroAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(`O Maestro estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ offline: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateArrangerPrompt = async () => {
    if (!apiKey) {
      setError("Falta a API Key no ficheiro .env (VITE_GEMINI_API_KEY)");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const systemPrompt = `ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°s o "Arranjador Mestre do Maestro Studio Pro", um produtor musical lendÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio que sabe absolutamente TUDO sobre o Suno AI e engenharia de prompts. 
    A tua missÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© analisar os resultados de uma entrevista profunda com o usuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio e gerar o melhor prompt possÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­vel para o Suno.

    SAÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂDA ESPERADA (JSON):
    {
      "analysis": "Breve visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o geral do arranjador em PT-BR sobre o que estamos criando.",
      "style_prompt": "String curta de tags em INGLÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â S para a caixa de 'Style' do Suno (max 120-150 chars).",
      "structured_lyrics": "A letra formatada com metatags do Suno [Intro], [Verse], [Chorus], etc. Se houver letra fornecida, analise a MÃƒÂ©trica. Se nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, sugira a estrutura.",
      "production_tips": "Dicas tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnicas master (ex: usar extend no Suno, colocar tags de reverb nas letras, etc) em PT-BR."
    }

    CONHECIMENTO SUNO:
    - Tags estruturais: [Intro], [Verse], [Pre-Chorus], [Chorus], [Bridge], [Solo], [Break], [Outro].
    - Tags de estilo: [Genre: ...], [Mood: ...], [Vocal: ...], [Tempo: ...].
    - Macetes: Usar vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­rgulas, nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o exagerar em tags contrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rias, usar [Style: ...] dentro da letra no Custom Mode para mudanÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§as de clima.
    - SFX PRO CALIBRADO: No Suno, evite [SFX: Rain] no Style. Use "Field recording of rain" no inÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­cio das tags. No Lyrics (structured_lyrics), use comandos de tempo no Intro, ex: [Intro: Rain sounds only, then piano fades in]. Limite Style a 120 caracteres.
    - Se houver letra, analise a MÃƒÂ©trica e sugira quebras de linha que faÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§am sentido musical.
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: JSON.stringify(arrangerData) }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { 
            responseMimeType: "application/json",
            temperature: 0.8
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Erro na API do Gemini");
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("A IA nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o retornou uma resposta vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lida.");
      const result = JSON.parse(text);
      
      // Adaptar o resultado do arranjador para o formato da anÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lise do maestro para exibiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
      setMaestroAnalysis({
        genre: result.style_prompt,
        style_analysis: result.analysis,
        final_prompt: result.style_prompt,
        production_tips: result.production_tips,
        musical_structure: { "Master Arrangement": result.structured_lyrics }
      });
      setCustomLyrics(result.structured_lyrics);
      setShowArranger(false);
      setArrangerStep(1);
    } catch (err) {
      console.error(err);
      setError(`O Arranjador teve um problema: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToLibrary = () => {
    if (!maestroAnalysis) return;
    setTempName(maestroAnalysis.genre || "");
    setShowNamingModal(true);
  };

  const confirmSave = () => {
    if (!maestroAnalysis) return;
    const newEntry = { 
      ...maestroAnalysis, 
      id: crypto.randomUUID(), 
      timestamp: new Date().toISOString(),
      isFavorite: false,
      customName: tempName || maestroAnalysis.genre || "Nova SessÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o"
    };
    persistData([newEntry, ...savedPrompts]);
    setSaveSuccess(true);
    setShowNamingModal(false);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const toggleFavorite = (id) => {
    const newList = savedPrompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p);
    persistData(newList);
  };

  const generateLyrics = async () => {
    if (!lyricsTheme.trim()) {
      setError("Por favor, defina um tema para a sua letra.");
      return;
    }

    if (!apiKey) {
      setError("Falta a API Key no ficheiro .env (VITE_GEMINI_API_KEY)");
      return;
    }

    setIsGeneratingLyrics(true);
    setError(null);

    const systemPrompt = `VocÃƒÂª ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© o "Ghostwriter Pro", um compositor premiado e especialista em estruturaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de letras para IA (Suno/Udio). 
    Sua missÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© criar letras memorÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡veis, com MÃƒÂ©trica perfeita e rimas impactantes.
    
    DIRETRIZES:
    1. ESTRUTURA: Respeite rigorosamente a ordem das partes solicitada.
    2. MARCAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ES: Use colchetes para as partes, ex: [Verse 1], [Chorus], [Bridge].
    3. RIMA: Se solicitado rimas ricas, evite rimas ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³bvias (ex: amor/dor).
    4. IDIOMA: Escreva no idioma ${lyricsLanguage}.
    5. ESTILO: Adapte o VocabulÃƒÂ¡rio ao GÃƒÂªnero musical ${lyricsGenre || 'Pop'}.
    
    SAÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂDA:
    Retorne a letra completa formatada com as tags estruturais.`;

    const prompt = `
      TEMA: ${lyricsTheme}
      GÃƒÅ NERO/ESTILO: ${lyricsGenre}
      CLIMA/EMOÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O: ${lyricsMood}
      ESTILO DE RIMA: ${lyricsRhymeStyle}
      PALAVRAS OBRIGATÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œRIAS: ${lyricsKeywords}
      ESTRUTURA DESEJADA: ${lyricsStructure.join(' -> ')}
      
      --- PARÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡METROS AVANÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ADOS (MODO PRODUTOR) ---
      COMPLEXIDADE DO VOCABULÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂRIO: ${lyricsComplexity}
      MÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°TRICA/TAMANHO DOS VERSOS: ${lyricsMeter}
      PERSPECTIVA NARRATIVA: ${lyricsPerspective}
      
      Crie uma letra que respeite a MÃƒÂ©trica de ${lyricsMeter} (versos mais ${lyricsMeter === 'Longo' ? 'detalhados e explicativos' : lyricsMeter === 'Curto' ? 'diretos e curtos' : 'equilibrados'}).
      O VocabulÃƒÂ¡rio deve ser ${lyricsComplexity}.
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { 
            temperature: 0.8
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Erro na API do Gemini");
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("A IA nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o retornou uma letra vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lida.");
      
      setLyricsResult(text);
    } catch (err) {
      console.error(err);
      setError(`O Compositor falhou: ${err.message}`);
    } finally {
      setIsGeneratingLyrics(false);
    }
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
    setEssencialPrimaryInst('');
    setEssencialSecondaryInst('');
    setEssencialTertiaryInst('');
    setSelectedLibraryTags([]);
    
    // Limpar Compositor
    setLyricsTheme('');
    setLyricsGenre('');
    setLyricsKeywords('');
    setLyricsResult('');
    setLyricsComplexity('PoÃƒÂ©tico');
    setLyricsMeter('MÃƒÂ©dio');
    setLyricsPerspective('1ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âª Pessoa (Eu)');
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

  const insertTag = (item, type = 'structural') => {
    let finalTag = typeof item === 'object' ? item.name : item;
    
    if (type === 'sfx' && typeof item === 'object' && item.prompt) {
      finalTag = item.prompt;
    } else if (type === 'sfx') {
       const match = finalTag.match(/\(([^)]+)\)/);
       const englishName = match ? match[1] : finalTag;
       finalTag = `Field recording of ${englishName}, nature soundscape, clearly audible`;
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

  const playGenrePreview = (genre) => {
    // 1. Limpar qualquer ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡udio tocando
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
    }

    // 2. Definir animaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o instantaneamente
    setActivePreviewGenre(genre);

    const fileName = genre.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, '');
    const audioPath = `/previews/${fileName}.mp3`;

    try {
      const audio = new Audio(audioPath);
      audio.volume = 0.5;
      audioPreviewRef.current = audio;

      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Erro de Autoplay ou arquivo ausente
          console.log("Aguardando interaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o ou ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡udio nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o encontrado:", fileName);
        });
      }

      // Parar automaticamente apÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³s 10 segundos
      setTimeout(() => {
        if (audioPreviewRef.current === audio) {
          stopGenrePreview();
        }
      }, 10000);

    } catch (e) {
      // Falha silenciosa
    }
  };

  const stopGenrePreview = () => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.currentTime = 0;
      audioPreviewRef.current = null;
    }
    setActivePreviewGenre(null);
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

        {/* NAVEGAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O SUPERIOR */}
        <div className="bg-[#121212] p-1.5 rounded-full border border-white/5 flex gap-1">
          {['MANUAL', 'COMPOSITOR', 'ESSENCIAL', 'INFLUÃŠNCIA', 'DNA ÃUDIO', 'INSIGHT VISUAL'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${
                activeTab === tab ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'COMPOSITOR' ? (
                <span className="flex items-center gap-2">
                  <Mic2 className="w-3 h-3" />
                  {tab}
                </span>
              ) : tab}
            </button>
          ))}
          <button
            onClick={() => setShowArranger(true)}
            className="flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:scale-105 transition-all group"
          >
            <Award className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Arranjador PRO
          </button>
          <button onClick={clearAll} className="px-3 text-slate-500 hover:text-white transition-colors" title="Limpar">
             <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* GRID PRINCIPAL */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CONFIGURAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O DE ORIGEM (ESQUERDA) */}
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

            {activeTab === 'ESSENCIAL' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                {/* TIPO DE ARRANJO */}
                <div>
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Estrutura do Arranjo</label>
                   <div className="grid grid-cols-2 gap-2">
                      {['SOLO', 'DUO', 'TRIO', 'MINIMALISTA'].map((type) => (
                        <button 
                          key={type}
                          onClick={() => setEssencialArrangement(type)}
                          className={`py-3 rounded-xl text-[10px] font-black transition-all border ${essencialArrangement === type ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-white/20'}`}
                        >
                          {type}
                        </button>
                      ))}
                   </div>
                </div>

                {/* INSTRUMENTOS */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Instrumento Principal</label>
                    <input 
                      className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50 transition-all font-bold text-white"
                      placeholder="Ex: Cavaquinho, Piano, ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o..."
                      value={essencialPrimaryInst}
                      onChange={e => setEssencialPrimaryInst(e.target.value)}
                    />
                  </div>
                  
                  {(essencialArrangement === 'DUO' || essencialArrangement === 'TRIO') && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Instrumento SecundÃƒÂ¡rio</label>
                      <input 
                        className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50 transition-all font-bold text-white"
                        placeholder="Ex: ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o 7 Cordas, Flauta..."
                        value={essencialSecondaryInst}
                        onChange={e => setEssencialSecondaryInst(e.target.value)}
                      />
                    </div>
                  )}

                  {essencialArrangement === 'TRIO' && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Instrumento TerciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio</label>
                      <input 
                        className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50 transition-all font-bold text-white"
                        placeholder="Ex: Flauta, Piano, Violoncelo..."
                        value={essencialTertiaryInst}
                        onChange={e => setEssencialTertiaryInst(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* VOZ E ESTILO */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Vocal</label>
                    <button 
                      onClick={() => setEssencialVocal(!essencialVocal)}
                      className={`w-full py-3 rounded-xl text-[10px] font-black transition-all border flex items-center justify-center gap-2 ${essencialVocal ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-[#0f0f0f] border-white/5 text-slate-500'}`}
                    >
                      <Mic2 className="w-3 h-3" />
                      {essencialVocal ? 'COM VOZ' : 'INSTRUMENTAL'}
                    </button>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Clima (Mood)</label>
                    <select 
                      value={essencialMood}
                      onChange={e => setEssencialMood(e.target.value)}
                      className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50 transition-all font-bold text-white appearance-none"
                    >
                      {['Alegre', 'NostÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lgico', 'MelancÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lico', 'ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Ântimo', 'EnergÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tico', 'Relaxante'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">ReferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia de Estilo (Opcional)</label>
                   <input 
                     className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50 transition-all text-slate-400"
                     placeholder="Ex: Chorinho, Samba, Jazz (DNA sutil)"
                     value={essencialStyle}
                     onChange={e => setEssencialStyle(e.target.value)}
                   />
                   <p className="text-[8px] text-slate-600 mt-1.5 italic">O Maestro usarÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ apenas a essÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­tmica do estilo, ignorando o arranjo padrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de banda.</p>
                </div>
              </div>
            )}

            {activeTab === 'INFLUÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â NCIA' && (
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
                  placeholder="InstruÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes adicionais..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'COMPOSITOR' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Tema da MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsica</label>
                    <input 
                      className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50 transition-all font-bold text-white"
                      placeholder="Ex: Saudade, SuperaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, Festa na Praia..."
                      value={lyricsTheme}
                      onChange={e => setLyricsTheme(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">GÃƒÂªnero Musical</label>
                      <input 
                        className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50 transition-all font-bold text-white"
                        placeholder="Ex: Pagode, Rock, Trap..."
                        value={lyricsGenre}
                        onChange={e => setLyricsGenre(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Clima (Mood)</label>
                      <select 
                        value={lyricsMood}
                        onChange={e => setLyricsMood(e.target.value)}
                        className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50 transition-all font-bold text-white appearance-none"
                      >
                        {['Emocional', 'Alegre', 'MelancÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³lico', 'Agressivo', 'Sombrio', 'PoÃƒÂ©tico'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Estilo de Rima</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Rimas Ricas', 'Rimas Simples', 'Versos Livres'].map((style) => (
                        <button 
                          key={style}
                          onClick={() => setLyricsRhymeStyle(style)}
                          className={`py-2 rounded-xl text-[9px] font-black transition-all border ${lyricsRhymeStyle === style ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-[#0f0f0f] border-white/5 text-slate-400 hover:border-white/20'}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Palavras ObrigatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rias</label>
                    <input 
                      className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50 transition-all text-slate-400"
                      placeholder="Ex: Sol, mar, destino (separadas por vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­rgula)"
                      value={lyricsKeywords}
                      onChange={e => setLyricsKeywords(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Idioma</label>
                    <div className="flex gap-2">
                       {['Portuguese', 'English', 'Spanish'].map(lang => (
                         <button 
                           key={lang}
                           onClick={() => setLyricsLanguage(lang)}
                           className={`flex-1 py-2 rounded-xl text-[9px] font-black transition-all border ${lyricsLanguage === lang ? 'bg-white text-black border-white' : 'bg-[#0f0f0f] border-white/5 text-slate-500'}`}
                         >
                           {lang === 'Portuguese' ? 'PortuguÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªs' : lang}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'DNA ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂUDIO' && (
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-32 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all group"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-orange-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase px-4 text-center truncate w-full">
                    {selectedFile ? selectedFile.name : 'Carregar ReferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia MP3'}
                  </span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={e => setSelectedFile(e.target.files[0])} />
                </div>
                <textarea
                  className="w-full h-24 bg-[#0f0f0f] rounded-2xl p-4 border border-white/5 text-slate-300 text-sm outline-none"
                  placeholder="InstruÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes para anÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lise..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'INSIGHT VISUAL' && (
              <div className="space-y-4">
                <div 
                  onClick={() => imageInputRef.current.click()}
                  className="w-full h-48 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                       <Music className="w-24 h-24 rotate-12" />
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col items-center p-4">
                    <Upload className="w-6 h-6 text-slate-500 group-hover:text-orange-500 mb-1" />
                    <span className="text-[10px] font-black text-slate-500 uppercase px-4 text-center truncate w-full">
                      {imageFile ? imageFile.name : 'Carregar Imagem de ReferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia'}
                    </span>
                    <p className="text-[8px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">JPG, PNG, WEBP</p>
                  </div>
                  <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setImagePreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </div>
                {imageFile && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[9px] font-black uppercase rounded-xl transition-all"
                  >
                    Remover Imagem
                  </button>
                )}
                <textarea
                  className="w-full h-20 bg-[#0f0f0f] rounded-2xl p-4 border border-white/5 text-slate-300 text-sm outline-none"
                  placeholder="Descreva o que a imagem deve inspirar..."
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
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">SugestÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Maestro</span>
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


          {/* SELEÃ‡ÃƒO DE MODO DE GERAÃ‡ÃƒO (SISTEMA DE TAGS) */}
          {activeTab !== 'COMPOSITOR' && (
            <div className="mb-6 p-4 bg-white/5 border border-white/5 rounded-3xl">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Modo de composiÃ§Ã£o</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'basico', label: 'BÃ¡sico', icon: <Play className="w-3 h-3" /> },
                { id: 'inteligente', label: 'Inteligente', icon: <Sparkles className="w-3 h-3" /> },
                { id: 'minimalista', label: 'Minimalista', icon: <Layers className="w-3 h-3" /> }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setGenerationMode(m.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-[9px] font-black uppercase transition-all ${
                    generationMode === m.id 
                    ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20' 
                    : 'bg-black border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-[8px] text-slate-600 mt-2.5 px-1 italic leading-tight">
              {generationMode === 'basico' && 'Fluxo livre baseado no seu briefing.'}
              {generationMode === 'inteligente' && 'OtimizaÃ§Ã£o de tags e hierarquia profissional.'}
              {generationMode === 'minimalista' && 'Foco em pureza, acÃºstico e poucos instrumentos.'}
            </p>
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

                {activeTab === 'COMPOSITOR' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[9px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                          MÃƒÂ©trica (Tamanho dos Versos)
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['Curto', 'MÃƒÂ©dio', 'Longo'].map(m => (
                          <button 
                            key={m}
                            onClick={() => setLyricsMeter(m)}
                            className={`py-3 rounded-xl text-[9px] font-bold transition-all border ${lyricsMeter === m ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-black border-white/5 text-slate-500 hover:border-white/20'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[9px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                          NÃƒÂ­vel de VocabulÃƒÂ¡rio
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['Popular', 'PoÃƒÂ©tico', 'Erudito'].map(c => (
                          <button 
                            key={c}
                            onClick={() => setLyricsComplexity(c)}
                            className={`py-3 rounded-xl text-[9px] font-bold transition-all border ${lyricsComplexity === c ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-black border-white/5 text-slate-500 hover:border-white/20'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[9px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                          Perspectiva Narrativa
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['Eu', 'Tu/VocÃƒÂª', 'Narrador'].map(p => (
                          <button 
                            key={p}
                            onClick={() => setLyricsPerspective(p)}
                            className={`py-3 rounded-xl text-[9px] font-bold transition-all border ${lyricsPerspective === p ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-black border-white/5 text-slate-500 hover:border-white/20'}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
               )}

               {/* MODO MUSICAL (ESCONDIDO NO COMPOSITOR) */}
               {activeTab !== 'COMPOSITOR' && (
                 <>
                   {/* FUSÃƒÆ’O DE GÃƒÅ NERO */}
               <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[9px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                      GÃƒÂªnero SecundÃƒÂ¡rio
                    </label>
                    <span className="text-[8px] font-bold text-orange-500/50 uppercase">FusÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o HÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­brida</span>
                  </div>
                  <input 
                    className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-orange-500/50 transition-all"
                    placeholder="Ex: Trap, Melodic Pop..."
                    value={secondaryGenre}
                    onChange={e => setSecondaryGenre(e.target.value)}
                  />
                  <p className="text-[8px] text-slate-600 mt-1.5 italic">Cria uma transiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o fluida entre estilos musicais distintos.</p>
               </div>

               {/* DNA VOCAL */}
               <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[9px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span>
                      DNA Vocal (ArquÃƒÂ©tipo)
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
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Texturas (MÃƒÂºltipla Escolha)</p>
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

                        {/* PROGRESSÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ES */}
                        <div>
                          <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
                            <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 uppercase flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50 flex-shrink-0"></span> ProgressÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes de Acordes
                            </p>
                            <button type="button" onClick={handleMagicGenerator} className="flex-1 min-w-fit flex items-center justify-center gap-1.5 px-3 py-2 bg-[#121212] border border-orange-500/20 text-orange-500 rounded-lg text-[8px] font-black hover:bg-orange-500 hover:text-black transition-all shadow-md active:scale-95">
                              <Sparkles className="w-2.5 h-2.5 flex-shrink-0" /> GERADOR MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂGICO
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

                        {/* EMOÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O MUSICAL */}
                        <div>
                          <p className="text-[9px] font-black tracking-[0.2em] text-yellow-400 mb-3 uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50"></span> EmoÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Musical
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

               {/* ORQUESTRADOR AVANÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ADO */}
               <div className="pt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setShowOrchestrator(!showOrchestrator)}
                    className="w-full flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Wand2 className="w-5 h-5 text-orange-500" />
                      <div className="text-left">
                        <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Orquestrador de Instrumentos & TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnicas</span>
                        <span className="block text-[8px] text-slate-500 mt-0.5">Explore violÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes, guitarras, efeitos e dezenas de percussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes</span>
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
                                      onClick={() => insertTag(item, group.label.includes('SFX') ? 'sfx' : 'structural')}
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

                {/* BIBLIOTECA DE TAGS SUNO (SISTEMA DO USUÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂRIO) */}
                <div className="pt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setShowTagLibrary(!showTagLibrary)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-600/10 to-amber-500/10 border border-orange-500/20 rounded-2xl hover:bg-orange-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-orange-500" />
                      <div className="text-left">
                        <span className="block text-[10px] font-black text-white uppercase tracking-widest group-hover:text-orange-400 transition-colors">Biblioteca de Tags Suno (350+)</span>
                        <span className="block text-[8px] text-orange-500/50 mt-0.5">Explore GÃƒÂªneros, Vocais, Moods e ProduÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o</span>
                      </div>
                    </div>
                    {showTagLibrary ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-orange-500" />}
                  </button>

                  {showTagLibrary && (
                    <div className="animate-in slide-in-from-top-2 duration-300 mt-3">
                      <div className="bg-black/60 p-5 rounded-2xl border border-orange-500/10 space-y-6">
                        
                        {/* Busca Interna de Tags */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                          <input 
                            type="text"
                            placeholder="Buscar tag especÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­fica..."
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-8 pr-4 text-[10px] outline-none focus:border-orange-500/50"
                            value={searchTagTerm}
                            onChange={(e) => setSearchTagTerm(e.target.value)}
                          />
                        </div>

                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {Object.entries(tagsData).map(([category, tags]) => {
                            const filteredTags = tags.filter(t => t.toLowerCase().includes(searchTagTerm.toLowerCase()));
                            if (filteredTags.length === 0) return null;

                            return (
                              <div key={category}>
                                <p className="text-[8px] font-black text-orange-500/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                                  {category.replace('_', ' ')}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {filteredTags.map(tag => {
                                    const isSelected = selectedLibraryTags.includes(tag);
                                    return (
                                      <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                          if (isSelected) setSelectedLibraryTags(selectedLibraryTags.filter(t => t !== tag));
                                          else setSelectedLibraryTags([...selectedLibraryTags, tag]);
                                        }}
                                        className={`px-2 py-1.5 rounded-lg border text-[9px] font-bold transition-all ${
                                          isSelected 
                                          ? 'bg-orange-500 border-orange-500 text-black shadow-md' 
                                          : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                                        }`}
                                      >
                                        {tag}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* VisualizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de Tags Selecionadas da Biblioteca */}
                  {selectedLibraryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                      {selectedLibraryTags.map(tag => (
                        <span key={tag} className="text-[8px] font-black px-2 py-1.5 bg-orange-500 text-black rounded-lg flex items-center gap-1.5 shadow-sm">
                          {tag.toUpperCase()}
                          <button onClick={() => setSelectedLibraryTags(selectedLibraryTags.filter(t => t !== tag))} className="hover:scale-110 transition-transform">
                            <X className="w-3 h-3"/>
                          </button>
                        </span>
                      ))}
                      <button 
                        type="button"
                        onClick={() => setSelectedLibraryTags([])}
                        className="text-[8px] font-black text-slate-500 hover:text-red-500 uppercase ml-auto"
                      >
                        Limpar Tudo
                      </button>
                    </div>
                  )}
                </div>


               {/* PROMPT NEGATIVO */}
               <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filtro de Pureza (Negativo)</label>
                    <span className="text-[8px] font-bold text-red-500/50 uppercase">ExclusÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o</span>
                  </div>
                  <input 
                    className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-red-500/50 transition-all"
                    placeholder="Ex: no drums, no piano..."
                    value={negativePrompt}
                    onChange={e => setNegativePrompt(e.target.value)}
                  />
                  <p className="text-[8px] text-slate-600 mt-1.5 italic">Remove elementos indesejados da composiÃƒÂ§ÃƒÂ£o final.</p>
               </div>
             </>
           )}
          </div>
        )}

          <button 
            onClick={activeTab === 'COMPOSITOR' ? generateLyrics : generateMusicConcept}
            disabled={isGenerating || isGeneratingLyrics}
            className={`w-full font-black py-5 rounded-full transition-all uppercase text-xs tracking-widest disabled:opacity-50 active:scale-95 shadow-xl ${(isProMode || activeTab === 'COMPOSITOR') ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-black hover:shadow-orange-500/20' : 'bg-white text-black hover:bg-orange-500 shadow-white/5'}`}
          >
            {isGenerating || isGeneratingLyrics ? 'A Processar...' : (activeTab === 'COMPOSITOR' ? 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â Escrever Letra' : (isProMode ? 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡Ãƒâ€šÃ‚Â¡ Gerar como Produtor' : 'Convocar o Maestro'))}
          </button>
        </section>

        {/* ESTÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â¡DIO VIRTUAL (DIREITA) */}
        <section className="lg:col-span-8">
          {isGenerating || isGeneratingLyrics ? (
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
                 {isGeneratingLyrics ? 'O Ghostwriter estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ a Escrever...' : 'O Maestro estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ a Elaborar...'}
               </h3>
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                 {isGeneratingLyrics ? 'Criando rimas e MÃƒÂ©tricas perfeitas' : 'A analisar DNA Sonoro e Estrutura'}
               </p>
            </div>
          ) : activeTab === 'COMPOSITOR' && lyricsResult ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="bg-white rounded-[40px] p-8 text-black shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <Mic2 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase opacity-50 tracking-widest block">Obra Original</span>
                      <h4 className="text-sm font-black uppercase text-black">{lyricsTheme}</h4>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setCustomLyrics(lyricsResult);
                        setActiveTab('MANUAL');
                        setTimeout(() => {
                          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        }, 100);
                      }} 
                      className="flex items-center gap-2 bg-orange-500 text-black px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:bg-black hover:text-orange-500 transition-all shadow-md active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" /> Injetar no Maestro
                    </button>
                    <button onClick={() => copyPrompt(lyricsResult)} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                      {copySuccess ? <><CheckCheck className="w-4 h-4 text-green-400" /> Copiado!</> : <><CopyIcon className="w-4 h-4" /> Copiar Letra</>}
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 bg-black/5 p-8 rounded-[32px] font-medium text-base whitespace-pre-wrap leading-relaxed shadow-inner border border-black/5 mb-6 overflow-y-auto max-h-[500px] custom-scrollbar text-slate-800 italic">
                  {lyricsResult}
                </div>

                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <p className="text-[9px] font-bold text-orange-800 uppercase mb-1">Dica do Ghostwriter:</p>
                  <p className="text-[11px] text-orange-700">Esta letra foi otimizada para o Suno AI. Use os colchetes [Verse], [Chorus] para guiar a IA.</p>
                </div>
              </div>
            </div>
          ) : maestroAnalysis ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
              {/* BARRA DE AÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ES RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂPIDAS */}
              <div className="flex flex-wrap gap-3 mb-4">
                <button 
                  onClick={() => setIsComparisonMode(!isComparisonMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase transition-all ${isComparisonMode ? 'bg-orange-500 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  <Split className="w-3 h-3" />
                  {isComparisonMode ? 'Modo ComparaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o On' : 'Comparar rascunhos'}
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
                      ['GÃƒÂªnero', maestroAnalysis.genre],
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

                  {/* ANÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂLISE E VEREDITO */}
                  <div className="bg-orange-500/5 border border-orange-500/10 p-8 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 opacity-50" />
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2 tracking-widest">
                        <History className="w-3 h-3" /> {isComparisonMode ? 'Veredito do Maestro' : 'AnÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lise de Estilo'}
                      </h4>
                      {isComparisonMode && (
                        <span className="bg-orange-500 text-black text-[8px] font-black px-2 py-1 rounded-md animate-bounce">MELHOR OPÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed group-hover:text-white transition-colors duration-500">
                      "{renderSafe(maestroAnalysis.style_analysis)}"
                    </p>
                    {maestroAnalysis.production_tips && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[9px] font-bold text-orange-500/40 uppercase mb-2">Dica de ProduÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o:</p>
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
                         <h5 className="text-[10px] font-black uppercase opacity-40">Estrutura da composiÃƒÂ§ÃƒÂ£o</h5>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(maestroAnalysis.musical_structure).map(([section, text]) => (
                               <div key={section} className="bg-black/5 p-4 rounded-2xl relative group">
                                  <span className="text-[8px] font-black text-orange-600 uppercase mb-1 block tracking-widest">{section}</span>
                                  <p className="text-[10px] text-slate-700 leading-normal">{text}</p>
                                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => insertIntoLyrics(section, text)} className="p-1.5 bg-orange-500 rounded-lg text-black hover:bg-black hover:text-orange-500 transition-all shadow-md" title="Inserir na Letra">
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => copyPrompt(`[${section}]\n[${text}]`)} className="p-1.5 bg-white/80 rounded-lg hover:bg-orange-500 hover:text-white transition-all shadow-md" title="Copiar SeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o">
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
                            Montador de Letras AutomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Cole sua letra aqui. Clique nos botÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes <span className="inline-flex bg-orange-500 text-black px-1 py-0.5 rounded text-[8px] mx-1"><ArrowRight className="w-2 h-2" /></span> na estrutura acima para injetar as tags direto na letra.
                          </p>
                        </div>
                        <button onClick={() => copyPrompt(customLyrics)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:bg-orange-500 hover:text-black transition-all whitespace-nowrap active:scale-95 shadow-lg">
                          {copySuccess ? <><CheckCheck className="w-3 h-3 text-green-400" /> Copiado Tudo!</> : <><CopyIcon className="w-3 h-3" /> Copiar Letra Completa</>}
                        </button>
                      </div>

                      {/* QUICK TAGS (Apenas no Modo Produtor) */}
                      {isProMode && (
                        <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest self-center mr-2">Tags RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pidas:</span>
                          {[
                            { label: 'Intro Falada', tag: 'Intro - spoken' },
                            { label: 'Intro', tag: 'Intro' },
                            { label: 'Verso', tag: 'Verse' },
                            { label: 'RefrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o', tag: 'Chorus' },
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
                          placeholder="[Intro]&#10;Cole o comeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§o da sua letra aqui...&#10;&#10;(Em seguida, clique em algum card da [Estrutura da composiÃƒÂ§ÃƒÂ£o] logo acima para injetar as instruÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes musicais automaticamente na posiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o do cursor.)"
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
                EstÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºdio Virtual Ativo
              </h3>
              {activeTab === 'MANUAL' ? (
                <>
                  <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-6 max-w-xs">
                    Selecione rapidamente um dos GÃƒÂªneros disponÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­veis:
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 w-full max-w-2xl px-2">
                     {ALL_GENRES.map((genre) => (
                       <button
                        key={genre}
                        onMouseEnter={() => playGenrePreview(genre)}
                        onMouseLeave={() => stopGenrePreview()}
                        onClick={() => {
                           setUserQuery(`MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsica estilo ${genre}`);
                           setBaseGenre(genre);
                           setSecondaryGenre('');
                           setActiveTab('MANUAL');
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap flex items-center gap-2 ${activePreviewGenre === genre ? 'bg-orange-500 border-orange-500 text-black scale-105' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                       >
                         {genre}
                         {activePreviewGenre === genre && (
                           <div className="flex gap-0.5 items-end h-3">
                              <div className="w-0.5 bg-black animate-[musicBar_0.8s_ease-in-out_infinite] h-full"></div>
                              <div className="w-0.5 bg-black animate-[musicBar_1.1s_ease-in-out_infinite] h-2/3"></div>
                              <div className="w-0.5 bg-black animate-[musicBar_0.9s_ease-in-out_infinite] h-4/5"></div>
                           </div>
                         )}
                       </button>
                     ))}
                  </div>
                </>
              ) : (
                <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-6 max-w-xs">
                  Preencha os dados no painel de controle para iniciar a produÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o.
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      {/* BIBLIOTECA LOCAL */}
      {savedPrompts.length > 0 && (
        <section className="max-w-6xl mx-auto mt-20 border-t border-white/10 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <History className="w-6 h-6 text-orange-500" /> HistÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rico de SessÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
            </h2>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
               <div className="relative group w-full md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Buscar prompt ou GÃƒÂªnero..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-orange-500/30 transition-all"
                  />
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase px-4 py-3 bg-white/5 rounded-full border border-white/5 whitespace-nowrap">
                 {savedPrompts.length} Prompts Guardados
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPrompts
              .filter(p => 
                p.customName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.style_analysis?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((p) => (
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
                      {p.customName || `${p.bpm} BPM ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ ${renderSafe(p.key)}`}
                    </p>
                    <button 
                      onClick={() => {
                        const name = prompt("Novo nome para esta sessÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o:", p.customName || "");
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
                  Abrir no EstÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºdio
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MODAL PROGGEN */}
      {/* MODAL ARRANJADOR PRO */}
      {showArranger && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex items-center justify-center p-0 md:p-10 overflow-hidden">
          <div className="bg-[#111] w-full h-full md:max-w-5xl md:max-h-[85vh] md:rounded-[50px] border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.1)] flex flex-col relative animate-in fade-in zoom-in-95 duration-500">
            
            {/* PROGRESS BAR */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 overflow-hidden md:rounded-t-[50px]">
              <div 
                className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500 transition-all duration-700 ease-out"
                style={{ width: `${(arrangerStep / 7) * 100}%` }}
              ></div>
            </div>

            {/* HEADER */}
            <div className="p-8 md:p-12 pb-6 flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-lg shadow-violet-500/20 rotate-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                    EstÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºdio do <span className="text-violet-500">Arranjador</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                      Fase {arrangerStep} de 7
                    </span>
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest animate-pulse">
                      Suno Pro Expert Ativo
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setShowArranger(false); setArrangerStep(1); }} 
                className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-12 pb-12">
              <div className="max-w-3xl mx-auto">
                {/* RENDER STEPS HERE */}
                {arrangerStep === 1 && (
                  <div className="space-y-10 animate-in slide-in-from-bottom-5 fade-in duration-500">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">01</span>
                        Qual ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© a intenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o e a alma da mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsica?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mensagem Principal</label>
                          <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-violet-500/50 transition-all min-h-[120px] resize-none"
                            placeholder="Sobre o que fala a mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsica? Ex: SuperaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, um amor de verÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o..."
                            value={arrangerData.intention.message}
                            onChange={(e) => setArrangerData({...arrangerData, intention: {...arrangerData.intention, message: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sentimento ao Ouvir</label>
                          <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-violet-500/50 transition-all min-h-[120px] resize-none"
                            placeholder="Ex: Felicidade extrema, arrependimento profundo..."
                            value={arrangerData.intention.feeling}
                            onChange={(e) => setArrangerData({...arrangerData, intention: {...arrangerData.intention, feeling: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="mt-8">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-3">Vibe Predominante</label>
                         <div className="flex flex-wrap gap-2">
                           {['Introspectiva', 'EnergÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tica', 'Emocional', 'Comercial'].map(vibe => (
                             <button
                               key={vibe}
                               onClick={() => setArrangerData({...arrangerData, intention: {...arrangerData.intention, mood: vibe}})}
                               className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${arrangerData.intention.mood === vibe ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                             >
                               {vibe}
                             </button>
                           ))}
                         </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                         <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">02</span>
                         DNA & ReferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Links de ReferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia (YouTube/Spotify)</label>
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-violet-500/50 transition-all"
                            placeholder="Cole links aqui separados por vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­rgula..."
                            value={arrangerData.references.links}
                            onChange={(e) => setArrangerData({...arrangerData, references: {...arrangerData.references, links: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">O que VocÃƒÂª gosta nelas?</label>
                          <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-violet-500/50 transition-all min-h-[100px] resize-none"
                            placeholder="Gosto do timbre da bateria, do clima sombrio, etc..."
                            value={arrangerData.references.preferences}
                            onChange={(e) => setArrangerData({...arrangerData, references: {...arrangerData.references, preferences: e.target.value}})}
                          />
                        </div>
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Estilo de CriaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o:</span>
                            {['Parecido', 'Inspirado'].map(nat => (
                              <button
                                key={nat}
                                onClick={() => setArrangerData({...arrangerData, references: {...arrangerData.references, nature: nat}})}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${arrangerData.references.nature === nat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}
                              >
                                {nat}
                              </button>
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {arrangerStep === 2 && (
                  <div className="space-y-10 animate-in slide-in-from-right-5 fade-in duration-500">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">03</span>
                        Sobre a Voz & IntÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rprete
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Perfil de Voz</label>
                          <div className="grid grid-cols-2 gap-2">
                             {['Masculina', 'Feminina', 'Infantil', 'Coral/Dupla'].map(g => (
                               <button
                                 key={g}
                                 onClick={() => setArrangerData({...arrangerData, vocal: {...arrangerData.vocal, gender: g}})}
                                 className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${arrangerData.vocal.gender === g ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400'}`}
                               >
                                 {g}
                               </button>
                             ))}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                             {['Grave', 'MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©dia', 'Aguda'].map(r => (
                               <button
                                 key={r}
                                 onClick={() => setArrangerData({...arrangerData, vocal: {...arrangerData.vocal, range: r}})}
                                 className={`px-3 py-3 rounded-xl text-[10px] font-bold transition-all ${arrangerData.vocal.range === r ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}
                               >
                                 {r}
                               </button>
                             ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Foco da Performance</label>
                          <select 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
                            value={arrangerData.vocal.strength}
                            onChange={(e) => setArrangerData({...arrangerData, vocal: {...arrangerData.vocal, strength: e.target.value}})}
                          >
                            <option value="" className="bg-black">Selecione uma forÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§a...</option>
                            <option value="InterpretaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Emocional" className="bg-black">InterpretaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Emocional</option>
                            <option value="PotÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia Vocal" className="bg-black">PotÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia Vocal</option>
                            <option value="TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnica / Virtuosismo" className="bg-black">TÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnica / Virtuosismo</option>
                          </select>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Valorizar na MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsica:</label>
                            <div className="flex flex-wrap gap-2">
                               {['Letra', 'Melodia', 'Performance'].map(f => (
                                 <button
                                   key={f}
                                   onClick={() => setArrangerData({...arrangerData, vocal: {...arrangerData.vocal, focus: f}})}
                                   className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${arrangerData.vocal.focus === f ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20' : 'bg-white/5 text-slate-500'}`}
                                 >
                                   {f}
                                 </button>
                               ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">04</span>
                        Estrutura da MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsica
                      </h3>
                      <div className="bg-white/5 border border-white/10 rounded-[30px] p-8 space-y-8">
                         <div className="flex flex-col md:flex-row gap-6 justify-between">
                            <div className="space-y-3">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">JÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ tem estrutura definida?</span>
                              <div className="flex gap-2">
                                {['Sim', 'NÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o'].map(v => (
                                  <button
                                    key={v}
                                    onClick={() => setArrangerData({...arrangerData, structure: {...arrangerData.structure, defined: v}})}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${arrangerData.structure.defined === v ? 'bg-white text-black' : 'bg-white/5 text-slate-500'}`}
                                  >
                                    {v}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <input 
                                 type="checkbox" 
                                 className="w-5 h-5 accent-violet-500 cursor-pointer"
                                 checked={arrangerData.structure.helpNeeded}
                                 onChange={(e) => setArrangerData({...arrangerData, structure: {...arrangerData.structure, helpNeeded: e.target.checked}})}
                               />
                               <span className="text-xs font-bold text-slate-300">Quero ajuda para melhorar a estrutura</span>
                            </div>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">O refrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o deve crescer ou jÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ forte?</label>
                            <input 
                              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-slate-300 outline-none focus:border-violet-500/50 transition-all"
                              placeholder="Ex: Precisa de uma explosÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©pica, ou ser sutil..."
                              value={arrangerData.structure.chorusGrowth}
                              onChange={(e) => setArrangerData({...arrangerData, structure: {...arrangerData.structure, chorusGrowth: e.target.value}})}
                            />
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {arrangerStep === 3 && (
                  <div className="space-y-10 animate-in slide-in-from-right-5 fade-in duration-500">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">05</span>
                        GÃƒÂªnero Musical & Estilo
                      </h3>
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">GÃƒÂªnero Principal</label>
                              <input 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-violet-500/50"
                                placeholder="MPB, Trap, Gospel, Jazz..."
                                value={arrangerData.style.main}
                                onChange={(e) => setArrangerData({...arrangerData, style: {...arrangerData.style, main: e.target.value}})}
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mistura de Estilos (Opcional)</label>
                              <input 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-violet-500/50"
                                placeholder="Ex: Trap + Sertanejo, Indie + Samba..."
                                value={arrangerData.style.mix}
                                onChange={(e) => setArrangerData({...arrangerData, style: {...arrangerData.style, mix: e.target.value}})}
                              />
                           </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-violet-500/10 border border-violet-500/20 rounded-3xl">
                           <input 
                             type="checkbox" 
                             className="w-6 h-6 accent-violet-500 cursor-pointer"
                             checked={arrangerData.style.defineForMe}
                             onChange={(e) => setArrangerData({...arrangerData, style: {...arrangerData.style, defineForMe: e.target.checked}})}
                           />
                           <div>
                              <p className="text-xs font-black text-white uppercase tracking-tighter">Deixar o Arranjador definir o melhor estilo</p>
                              <p className="text-[9px] text-slate-500 uppercase font-black">Com base em todas as outras informaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes passadas</p>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">06</span>
                        Ritmo & Andamento
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Velocidade</label>
                            <div className="flex flex-col gap-2">
                               {['Lenta (Balada)', 'MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©dia', 'RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pida'].map(t => (
                                 <button
                                   key={t}
                                   onClick={() => setArrangerData({...arrangerData, rhythm: {...arrangerData.rhythm, tempo: t}})}
                                   className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${arrangerData.rhythm.tempo === t ? 'bg-white text-black' : 'bg-white/5 text-slate-400'}`}
                                 >
                                   {t}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">IntenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­tmica</label>
                            <div className="flex flex-col gap-2">
                               {['Mais Levada', 'Mais Marcada'].map(n => (
                                 <button
                                   key={n}
                                   onClick={() => setArrangerData({...arrangerData, rhythm: {...arrangerData.rhythm, nature: n}})}
                                   className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${arrangerData.rhythm.nature === n ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}
                                 >
                                   {n}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Groove</label>
                            <div className="flex flex-col gap-2">
                               {['OrgÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢nico (Bateria Real)', 'EletrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nico (Beat)'].map(g => (
                                 <button
                                   key={g}
                                   onClick={() => setArrangerData({...arrangerData, rhythm: {...arrangerData.rhythm, groove: g}})}
                                   className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${arrangerData.rhythm.groove === g ? 'bg-fuchsia-600 text-white' : 'bg-white/5 text-slate-400'}`}
                                 >
                                   {g}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {arrangerStep === 4 && (
                  <div className="space-y-10 animate-in slide-in-from-right-5 fade-in duration-500">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">07</span>
                        Harmonia
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">JÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ tem cifra ou melodia?</label>
                            <div className="flex gap-2">
                                {['Sim', 'NÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o'].map(v => (
                                  <button
                                    key={v}
                                    onClick={() => setArrangerData({...arrangerData, harmony: {...arrangerData.harmony, hasChords: v}})}
                                    className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${arrangerData.harmony.hasChords === v ? 'bg-white text-black' : 'bg-white/5 text-slate-400'}`}
                                  >
                                    {v}
                                  </button>
                                ))}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Complexidade HarmÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´nica</label>
                            <div className="flex flex-col gap-2">
                               {['Simples e Direta', 'Mais Sofisticada (Acordes Ricos)'].map(c => (
                                 <button
                                   key={c}
                                   onClick={() => setArrangerData({...arrangerData, harmony: {...arrangerData.harmony, complexity: c}})}
                                   className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${arrangerData.harmony.complexity === c ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}
                                 >
                                   {c}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="mt-8 space-y-3">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sabor da Harmonia</label>
                         <div className="flex flex-wrap gap-2">
                            {['Popular/Pop', 'ArtÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­stico', 'JazzÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­stico', 'EclesiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡stico/Gospel'].map(f => (
                              <button
                                key={f}
                                onClick={() => setArrangerData({...arrangerData, harmony: {...arrangerData.harmony, flavor: f}})}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${arrangerData.harmony.flavor === f ? 'bg-violet-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}
                              >
                                {f}
                              </button>
                            ))}
                         </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">08</span>
                        InstrumentaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
                      </h3>
                      <div className="space-y-6">
                         <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-4">Escolha os instrumentos base:</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                               {['ViolÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o', 'Piano', 'Guitarra', 'Orquestra', 'Sintetizadores', 'Metais', 'PercussÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Latina', 'Bateria Pesada'].map(i => (
                                 <button
                                   key={i}
                                   onClick={() => {
                                      const current = arrangerData.instrumentation.instruments;
                                      const next = current.includes(i) ? current.filter(x => x !== i) : [...current, i];
                                      setArrangerData({...arrangerData, instrumentation: {...arrangerData.instrumentation, instruments: next}});
                                   }}
                                   className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${arrangerData.instrumentation.instruments.includes(i) ? 'bg-fuchsia-600/20 border-fuchsia-500 text-white' : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'}`}
                                 >
                                   {i}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="flex flex-col md:flex-row gap-6 mt-4">
                            <div className="flex-1 space-y-3">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Densidade Musical</label>
                               <div className="flex gap-2">
                                  {['Minimalista', 'Cheia (Camadas)'].map(n => (
                                    <button
                                      key={n}
                                      onClick={() => setArrangerData({...arrangerData, instrumentation: {...arrangerData.instrumentation, nature: n}})}
                                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${arrangerData.instrumentation.nature === n ? 'bg-white text-black' : 'bg-white/5 text-slate-400'}`}
                                    >
                                      {n}
                                    </button>
                                  ))}
                               </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-violet-500/10 border border-violet-500/20 rounded-3xl mt-6">
                               <input 
                                 type="checkbox" 
                                 className="w-6 h-6 accent-violet-500 cursor-pointer"
                                 checked={arrangerData.instrumentation.defineForMe}
                                 onChange={(e) => setArrangerData({...arrangerData, instrumentation: {...arrangerData.instrumentation, defineForMe: e.target.checked}})}
                               />
                               <span className="text-[10px] font-black text-white uppercase tracking-tighter">Deixar o Arranjador definir o resto</span>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {arrangerStep === 5 && (
                  <div className="space-y-10 animate-in slide-in-from-right-5 fade-in duration-500">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">09</span>
                        DinÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢mica & Crescimento
                      </h3>
                      <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">InÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­cio da MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsica</label>
                               <div className="flex gap-2">
                                  {['ComeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ar Simples', 'ComeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ar Intensa'].map(s => (
                                    <button
                                      key={s}
                                      onClick={() => setArrangerData({...arrangerData, dynamics: {...arrangerData.dynamics, start: s}})}
                                      className={`flex-1 py-4 rounded-2xl text-xs font-bold transition-all ${arrangerData.dynamics.start === s ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/5 text-slate-400'}`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">O RefrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o deve...</label>
                               <div className="flex gap-2">
                                  {['Explodir', 'Manter Vibe'].map(c => (
                                    <button
                                      key={c}
                                      onClick={() => setArrangerData({...arrangerData, dynamics: {...arrangerData.dynamics, chorus: c}})}
                                      className={`flex-1 py-4 rounded-2xl text-xs font-bold transition-all ${arrangerData.dynamics.chorus === c ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}
                                    >
                                      {c}
                                    </button>
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Viradas & TransiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes</label>
                            <textarea 
                              className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-violet-500/50"
                              placeholder="Ex: Quero um drop pesado antes do refrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, ou pausas dramÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ticas..."
                              value={arrangerData.dynamics.transitions}
                              onChange={(e) => setArrangerData({...arrangerData, dynamics: {...arrangerData.dynamics, transitions: e.target.value}})}
                            />
                         </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">10</span>
                        ProduÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o & Sonoridade
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Estilo de ProduÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o</label>
                            <div className="grid grid-cols-2 gap-2">
                               {['Moderno (Streaming)', 'Vintage / RetrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´', 'AcÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico Cru', 'CinematogrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡fico'].map(e => (
                                 <button
                                   key={e}
                                   onClick={() => setArrangerData({...arrangerData, production: {...arrangerData.production, era: e}})}
                                   className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all ${arrangerData.production.era === e ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-500'}`}
                                 >
                                   {e}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Textura do Som</label>
                            <div className="flex gap-2">
                               {['Mais Limpo', 'Mais Sujo/RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºstico'].map(t => (
                                 <button
                                   key={t}
                                   onClick={() => setArrangerData({...arrangerData, production: {...arrangerData.production, texture: t}})}
                                   className={`flex-1 py-4 rounded-2xl text-xs font-bold transition-all ${arrangerData.production.texture === t ? 'bg-fuchsia-600 text-white' : 'bg-white/5 text-slate-400'}`}
                                 >
                                   {t}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {arrangerStep === 6 && (
                  <div className="space-y-10 animate-in slide-in-from-right-5 fade-in duration-500">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">11</span>
                        Objetivo & Canal
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Onde serÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ usada?</label>
                            <div className="grid grid-cols-2 gap-2">
                               {['Spotify/Streaming', 'Redes Sociais', 'Show ao Vivo', 'Trilha Sonora'].map(o => (
                                 <button
                                   key={o}
                                   onClick={() => setArrangerData({...arrangerData, objective: {...arrangerData.objective, platform: o}})}
                                   className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all ${arrangerData.objective.platform === o ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-500'}`}
                                 >
                                   {o}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Tipo de Projeto</label>
                            <div className="flex gap-2">
                               {['Autoral ArtÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­stico', 'Comercial/Jingle'].map(p => (
                                 <button
                                   key={p}
                                   onClick={() => setArrangerData({...arrangerData, objective: {...arrangerData.objective, projectType: p}})}
                                   className={`flex-1 py-4 rounded-2xl text-xs font-bold transition-all ${arrangerData.objective.projectType === p ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}
                                 >
                                   {p}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">12</span>
                        Liberdade Criativa do Arranjador
                      </h3>
                      <div className="bg-white/5 border border-white/10 rounded-[30px] p-8 space-y-6">
                         <div className="space-y-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">NÃƒÂ­vel de Liberdade</span>
                            <div className="flex justify-between gap-2">
                               {['Siga a Risca', 'Moderada', 'Liberdade Total'].map(l => (
                                 <button
                                   key={l}
                                   onClick={() => setArrangerData({...arrangerData, freedom: {...arrangerData.freedom, level: l}})}
                                   className={`flex-1 py-4 rounded-2xl text-xs font-bold transition-all ${arrangerData.freedom.level === l ? 'bg-violet-600 text-white shadow-xl rotate-1' : 'bg-white/5 text-slate-500 opacity-50'}`}
                                 >
                                   {l}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-4 pt-4 border-t border-white/5">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">O Arranjador pode alterar:</span>
                            <div className="flex flex-wrap gap-3">
                               {['Melodia', 'Estrutura', 'Harmonia', 'InstrumentaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o'].map(c => (
                                 <label key={c} className="flex items-center gap-3 bg-black/40 px-5 py-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5">
                                    <input 
                                      type="checkbox" 
                                      className="accent-violet-500"
                                      checked={arrangerData.freedom.changesAllowed.includes(c)}
                                      onChange={(e) => {
                                         const current = arrangerData.freedom.changesAllowed;
                                         const next = e.target.checked ? [...current, c] : current.filter(x => x !== c);
                                         setArrangerData({...arrangerData, freedom: {...arrangerData.freedom, changesAllowed: next}});
                                      }}
                                    />
                                    <span className="text-xs font-bold text-slate-300">{c}</span>
                                 </label>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {arrangerStep === 7 && (
                  <div className="space-y-10 animate-in slide-in-from-right-5 fade-in duration-500">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">13</span>
                        Letra & MÃƒÂ©trica (Opcional)
                      </h3>
                      <div className="space-y-6">
                         <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[30px] blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                            <textarea 
                              className="relative w-full h-80 bg-[#0c0c0c] border border-white/10 rounded-[30px] p-8 text-sm leading-relaxed outline-none focus:border-violet-500/50 resize-none custom-scrollbar"
                              placeholder="Cole sua letra aqui se jÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ houver uma... O Arranjador irÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ sugerir tags e MÃƒÂ©trica musical."
                              value={arrangerData.lyrics.text}
                              onChange={(e) => setArrangerData({...arrangerData, lyrics: {...arrangerData.lyrics, text: e.target.value}})}
                            />
                         </div>
                         <div className="flex items-center gap-3 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
                            <input 
                              type="checkbox" 
                              className="w-6 h-6 accent-indigo-500 cursor-pointer"
                              checked={arrangerData.lyrics.analyzeMetric}
                              onChange={(e) => setArrangerData({...arrangerData, lyrics: {...arrangerData.lyrics, analyzeMetric: e.target.checked}})}
                            />
                            <div>
                               <p className="text-xs font-black text-white uppercase tracking-tighter">Ativar AnÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lise de MÃƒÂ©trica Profissional</p>
                               <p className="text-[9px] text-slate-500 uppercase font-black">O Arranjador vai sugerir divisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­tmicas para cada linha da sua letra baseado no Suno.</p>
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                         <span className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-500 text-xs">+</span>
                         Toques Finais (Extras)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Palavras ou Frases a Destacar</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-violet-500/50"
                              placeholder="Ex: No refrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o, destaque 'Liberdade'..."
                              value={arrangerData.extra.highlightedWords}
                              onChange={(e) => setArrangerData({...arrangerData, extra: {...arrangerData.extra, highlightedWords: e.target.value}})}
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Parte que NÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O pode mudar</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-violet-500/50"
                              placeholder="Ex: A melodia do verso 1 deve ser mantida..."
                              value={arrangerData.extra.unchangeableParts}
                              onChange={(e) => setArrangerData({...arrangerData, extra: {...arrangerData.extra, unchangeableParts: e.target.value}})}
                            />
                         </div>
                         <div className="md:col-span-2 space-y-3 mt-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Momento Mais Importante da MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsica</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-violet-500/50"
                              placeholder="Qual o clÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­max? Ex: A virada instrumental final..."
                              value={arrangerData.extra.keyMoment}
                              onChange={(e) => setArrangerData({...arrangerData, extra: {...arrangerData.extra, keyMoment: e.target.value}})}
                            />
                         </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* NAV ACTIONS */}
            <div className="p-8 md:p-12 pt-6 border-t border-white/5 backdrop-blur-3xl bg-black/20 flex justify-between items-center md:rounded-b-[50px]">
              <button 
                onClick={() => arrangerStep > 1 ? setArrangerStep(arrangerStep - 1) : setShowArranger(false)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {arrangerStep === 1 ? 'Cancelar' : 'Voltar'}
              </button>
              
              <button 
                onClick={() => {
                  if (arrangerStep < 7) setArrangerStep(arrangerStep + 1);
                  else generateArrangerPrompt();
                }}
                disabled={isGenerating}
                className="flex items-center gap-3 px-10 py-4 rounded-2xl text-[10px] font-black uppercase bg-white text-black hover:bg-violet-500 hover:text-white shadow-xl shadow-white/5 transition-all active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-3 h-3 animate-spin" />
                    Gerando Arranjo...
                  </>
                ) : (
                  <>
                    {arrangerStep === 7 ? 'Finalizar & Gerar Prompt' : 'PrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³xima Fase'}
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 block">Gerador de ProgressÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes</span>
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
      {/* MODAL DE NOMEAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢O PREMIUM */}
      {showNamingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#121212] w-full max-w-md rounded-[40px] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] p-8 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Nomear Prompt</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âª um tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­tulo para sua obra-mestra</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <input 
                  autoFocus
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmSave()}
                  placeholder="Ex: Pop Rock ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°pico - Base 01"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white outline-none focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/5 transition-all text-center"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowNamingModal(false)}
                  className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmSave}
                  className="flex-1 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white shadow-xl shadow-orange-500/10 transition-all active:scale-95"
                >
                  Confirmar & Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;



