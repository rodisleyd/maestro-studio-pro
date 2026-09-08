// src/guitarRigData.js
/**
 * MAESTRO STUDIO PRO - GUITAR RIG & TONE ARCHITECT
 * Base de conhecimento profissional para modelagem de guitarras, pedais e amplificadores para Suno/Udio.
 * Baseado em especificações de estúdio de gravação.
 */

export const GUITAR_MODELS = [
  {
    id: 'stratocaster',
    name: 'Fender Stratocaster',
    shortName: 'Stratocaster',
    icon: '🎸',
    soundChar: 'Brilhante, estalada, percussiva e muito dinâmica',
    bestFor: 'Blues, Rock, Pop, Funk, Soul, Indie',
    defaultPickup: 'single_coil',
    pickupPosition: 'bridge',
    promptTag: 'Fender Stratocaster electric guitar, crisp bright twang, dynamic chime',
    badge: 'Versátil & Estalado'
  },
  {
    id: 'telecaster',
    name: 'Fender Telecaster',
    shortName: 'Telecaster',
    icon: '🎸',
    soundChar: 'Ataque forte, agudo definido e cortante ("twang" inconfundível)',
    bestFor: 'Country, Rock, Blues, Pop, Indie Rock',
    defaultPickup: 'single_coil',
    pickupPosition: 'bridge',
    promptTag: 'Fender Telecaster, sharp biting twang, cutting presence and punchy attack',
    badge: 'Ataque Cortante'
  },
  {
    id: 'les_paul',
    name: 'Gibson Les Paul',
    shortName: 'Les Paul',
    icon: '🎸',
    soundChar: 'Grave, encorpada, aveludada com sustain longo e poderoso',
    bestFor: 'Rock, Hard Rock, Blues, Heavy Metal, Stoner Rock',
    defaultPickup: 'humbucker',
    pickupPosition: 'bridge',
    promptTag: 'Gibson Les Paul, thick warm body, heavy singing sustain and rich harmonics',
    badge: 'Sustain & Peso'
  },
  {
    id: 'sg',
    name: 'Gibson SG',
    shortName: 'Gibson SG',
    icon: '🎸',
    soundChar: 'Parecida com Les Paul, porém mais aberta, mordaz e agressiva nos médios',
    bestFor: 'Hard Rock, Heavy Metal, Punk Rock, Classic Rock',
    defaultPickup: 'humbucker',
    pickupPosition: 'bridge',
    promptTag: 'Gibson SG electric guitar, punchy aggressive midrange bite, raw drive',
    badge: 'Mordida & Médios'
  },
  {
    id: 'superstrat',
    name: 'Ibanez / ESP Superstrat',
    shortName: 'Superstrat',
    icon: '⚡',
    soundChar: 'Ultra veloz, alta saída com ponte tremolo Floyd Rose e timbre cirúrgico',
    bestFor: 'Heavy Metal, Power Metal, Prog Metal, Shred Fusion',
    defaultPickup: 'humbucker',
    pickupPosition: 'bridge',
    promptTag: 'Superstrat electric guitar, high-gain active pickups, razor-sharp surgical articulation',
    badge: 'Metal & Velocidade'
  },
  {
    id: 'jazzmaster',
    name: 'Fender Jazzmaster / Offset',
    shortName: 'Jazzmaster',
    icon: '🌊',
    soundChar: 'Grave e médios aveludados, som expansivo e vintage',
    bestFor: 'Indie Rock, Shoegaze, Alternative, Surf Rock, Post-Rock',
    defaultPickup: 'single_coil',
    pickupPosition: 'neck',
    promptTag: 'Fender Jazzmaster offset guitar, atmospheric warm jangle, lush vintage tone',
    badge: 'Indie & Shoegaze'
  },
  {
    id: 'es335',
    name: 'Gibson ES-335 (Semiacústica)',
    shortName: 'Semiacústica ES-335',
    icon: '🎷',
    soundChar: 'Quente, encorpada, ressonante com "ar" e respiro acústico',
    bestFor: 'Blues, Jazz, Classic Rock, Soul, R&B',
    defaultPickup: 'humbucker',
    pickupPosition: 'neck',
    promptTag: 'Gibson ES-335 semi-hollow guitar, resonant airy warmth, smooth woody tone',
    badge: 'Quente & Ressonante'
  },
  {
    id: 'jazz_box',
    name: 'Guitarra de Jazz / Caixa Oca',
    shortName: 'Jazz Hollowbody',
    icon: '🎻',
    soundChar: 'Timbre limpo, suave, grave macio e acústico tradicional',
    bestFor: 'Jazz Standard, Bebop, Bossa Nova, Smooth Blues',
    defaultPickup: 'humbucker',
    pickupPosition: 'neck',
    promptTag: 'Archtop hollowbody jazz guitar, mellow dark clean tone, velvety jazz warmth',
    badge: 'Jazz Veludo'
  },
  {
    id: 'extended_range',
    name: 'Guitarra 7/8 Cordas (Extended Range)',
    shortName: '7/8 Cordas (Djent)',
    icon: '💥',
    soundChar: 'Graves subterrâneos gigantescos, resposta firme para afinações baixas',
    bestFor: 'Metal Moderno, Djent, Prog Metal, Deathcore, Nu Metal',
    defaultPickup: 'humbucker',
    pickupPosition: 'bridge',
    promptTag: '8-string extended range baritone guitar, monstrous low-end clarity, tight djent attack',
    badge: 'Grave Subterrâneo'
  }
];

export const PICKUP_TYPES = [
  {
    id: 'single_coil',
    name: 'Single Coil',
    desc: 'Som brilhante, ataque hiper-definido, estalado e cristalino',
    icon: '🧲',
    promptTag: 'single-coil pickups with crystalline bright bite'
  },
  {
    id: 'humbucker',
    name: 'Humbucker (Duplo)',
    desc: 'Som cheio, gordo e potente, rico em médios e sustain sem ruído',
    icon: '🔋',
    promptTag: 'fat humbucker pickups with rich mid-range power'
  },
  {
    id: 'p90',
    name: 'P-90 (Vintage Bite)',
    desc: 'Equilíbrio perfeito: ataque e mordida do single com o corpo do humbucker',
    icon: '🪨',
    promptTag: 'vintage P-90 pickups, gritty midrange punch'
  }
];

export const PICKUP_POSITIONS = [
  {
    id: 'bridge',
    name: 'Ponte (Bridge)',
    desc: 'Agudo cortante, ataque rápido, ideal para leads, solos e riffs pesados',
    promptTag: 'bridge position'
  },
  {
    id: 'middle',
    name: 'Meio (Middle)',
    desc: 'Equilibrado e versátil, excelente para rítmicas e levadas',
    promptTag: 'middle position'
  },
  {
    id: 'neck',
    name: 'Braço (Neck)',
    desc: 'Grave macio, aveludado e quente, perfeito para solos expressivos e jazz/blues',
    promptTag: 'neck position'
  }
];

export const STUDIO_AMPLIFIERS = [
  {
    id: 'fender_twin',
    name: 'Fender Twin Reverb (65)',
    shortName: 'Fender Twin',
    character: 'Clean lendário, brilhante, estalado e com headroom colossal',
    bestFor: 'Funk, Pop, Country, Blues, Surf, Clean Pedals',
    icon: '📻',
    promptTag: 'cranked through Fender Twin Reverb tube amp, pristine sparkling headroom'
  },
  {
    id: 'marshall_plexi',
    name: 'Marshall 1959 Plexi / JCM 800',
    shortName: 'Marshall Plexi',
    character: 'O rugido clássico do rock britânico, crunch rasgado e agressivo',
    bestFor: 'Classic Rock, Hard Rock, Punk, Heavy Metal 80s',
    icon: '🔊',
    promptTag: 'pushed through vintage Marshall Plexi tube stack, aggressive British crunch'
  },
  {
    id: 'vox_ac30',
    name: 'Vox AC30 Top Boost',
    shortName: 'Vox AC30',
    character: 'Harmônicos brilhantes ("chime"), saturação cremosa e clássica',
    bestFor: 'Indie Rock, British Pop, Beatles, U2, Alternative',
    icon: '🎙️',
    promptTag: 'running through Vox AC30 Top Boost amp, glorious British chime and harmonic drive'
  },
  {
    id: 'mesa_rectifier',
    name: 'Mesa Boogie Dual Rectifier / 5150',
    shortName: 'Mesa Boogie High-Gain',
    character: 'Ganho massivo, graves esmagadores e parede sonora impenetrável',
    bestFor: 'Heavy Metal, Modern Metal, Metalcore, Grunge, Djent',
    icon: '⚡',
    promptTag: 'blasting through Mesa Boogie Dual Rectifier high-gain tube head, tight crushing wall of sound'
  },
  {
    id: 'roland_jc120',
    name: 'Roland JC-120 Jazz Chorus',
    shortName: 'Roland JC-120',
    character: 'Clean estereofônico puro, ultra limpo, espaçoso e sem distorção',
    bestFor: '80s Pop, New Wave, Post-Punk, Jazz, Dream Pop',
    icon: '🎹',
    promptTag: 'stereo Roland JC-120 Jazz Chorus solid state clean amp, ultra-wide spatial definition'
  },
  {
    id: 'fender_tweed',
    name: 'Fender Tweed Deluxe 50s',
    shortName: 'Fender Tweed',
    character: 'Saturação quente, compressão natural e resposta dinâmica vintage',
    bestFor: 'Blues Raiz, Rockabilly, Americana, Garage Rock',
    icon: '🪕',
    promptTag: 'warm vintage 1950s Fender Tweed Deluxe combo amp, organic tube compression'
  }
];

export const PEDALBOARD_CATEGORIES = {
  gain: {
    title: 'Ganho & Saturação',
    icon: '🔥',
    pedals: [
      {
        id: 'overdrive',
        name: 'Overdrive (Tube Screamer)',
        desc: 'Saturação quente e encorpada de válvulas trabalhando forte',
        sound: 'Quente, encorpado, levemente distorcido',
        genres: 'Blues, Rock, Pop, Country',
        icon: '🔥',
        promptTag: 'warm tube overdrive pedal'
      },
      {
        id: 'distortion',
        name: 'Distortion (DS-1 / RAT)',
        desc: 'Distorção agressiva, pesada e cortante com sustentação firme',
        sound: 'Pesado, comprimido, agressivo',
        genres: 'Hard Rock, Heavy Metal, Punk, Grunge',
        icon: '⚡',
        promptTag: 'aggressive tight distortion pedal'
      },
      {
        id: 'fuzz',
        name: 'Fuzz (Big Muff / Fuzz Face)',
        desc: 'Distorção suja, áspera, vintage e quase sintetizada',
        sound: 'Sujo, áspero, comprimido, anos 60/70',
        genres: 'Psychedelic Rock, Stoner, Grunge, Alternative',
        icon: '🔊',
        promptTag: 'thick fuzzy vintage fuzz pedal'
      }
    ]
  },
  dynamics_filter: {
    title: 'Dinâmica & Filtros',
    icon: '🎛️',
    pedals: [
      {
        id: 'compressor',
        name: 'Compressor de Estúdio',
        desc: 'Deixa o volume uniforme com ataque estalado e sustain prolongado',
        sound: 'Estalado, equilibrado e uniforme',
        genres: 'Funk, Country, Pop, Clean Mix',
        icon: '🗜️',
        promptTag: 'studio optical compressor for snappy attack and even sustain'
      },
      {
        id: 'wah',
        name: 'Wah-Wah (Cry Baby)',
        desc: 'Vocalização "uááá-uááá" controlada nas frequências médias/agudas',
        sound: 'Vocal, dinâmico e expressivo',
        genres: 'Funk, Classic Rock, Blues, Psicodelia',
        icon: '🦶',
        promptTag: 'expressive dynamic Cry Baby wah-wah sweep'
      },
      {
        id: 'noise_gate',
        name: 'Noise Gate',
        desc: 'Corta ruídos e chiados, deixando os silêncios ultra limpos e cortantes',
        sound: 'Aperto rítmico, sem sobras',
        genres: 'Metal Moderno, Djent, Prog',
        icon: '🛑',
        promptTag: 'ultra-tight noise gate gating'
      }
    ]
  },
  modulation: {
    title: 'Modulação',
    icon: '🌊',
    pedals: [
      {
        id: 'chorus',
        name: 'Chorus Clássico',
        desc: 'Duplicação e leve desafinação espacial ("som largo e flutuante")',
        sound: 'Largo, brilhante e flutuante',
        genres: 'Pop anos 80, New Wave, Rock, Clean Baladas',
        icon: '🌊',
        promptTag: 'shimmering lush 80s chorus pedal'
      },
      {
        id: 'flanger',
        name: 'Flanger',
        desc: 'Varredura metálica característica parecida com turbina de avião',
        sound: 'Metálico, intenso e viajante',
        genres: 'Rock 70/80, Van Halen, Metal, Psicodélico',
        icon: '✈️',
        promptTag: 'sweeping metallic jet flanger'
      },
      {
        id: 'phaser',
        name: 'Phaser (Phase 90)',
        desc: 'Movimentação cíclica e giratória nas frequências de áudio',
        sound: 'Giratório, espacial e hipnótico',
        genres: 'Rock Psicodélico, Funk 70s, Reggae, Fusion',
        icon: '🌀',
        promptTag: 'hypnotic swirl analog phaser'
      },
      {
        id: 'tremolo',
        name: 'Tremolo Vintage',
        desc: 'Oscilação rítmica do volume (alto ➔ baixo ➔ alto)',
        sound: 'Pulsante, vintage, cinematográfico',
        genres: 'Surf Rock, Indie, Ennio Morricone, Vintage Pop',
        icon: '〰️',
        promptTag: 'pulsing vintage tube tremolo effect'
      },
      {
        id: 'pitch_shifter',
        name: 'Pitch Shifter / Octaver',
        desc: 'Adiciona oitavas abaixo ou acima gerando um som gigante de parede',
        sound: 'Massivo, oitavado, sintetizado',
        genres: 'Hard Rock, Royal Blood style, Metal, Eletrônico',
        icon: '⬆️',
        promptTag: 'sub octave pitch shifter for massive thickness'
      }
    ]
  },
  time_space: {
    title: 'Delay & Reverb (Espaço)',
    icon: '⏳',
    pedals: [
      {
        id: 'tape_delay',
        name: 'Tape Delay (Eco de Fita Vintage)',
        desc: 'Ecos orgânicos, quentes com leve degradação analógica nas repetições',
        sound: 'Orgânico, nostálgico, espacial',
        genres: 'Rockabilly, Psicodélico, Reggae, Ambient',
        icon: '📼',
        promptTag: 'warm analog tape echo delay with decaying repeats'
      },
      {
        id: 'digital_delay',
        name: 'Digital Delay (Rítmico / U2)',
        desc: 'Repetições cristalinas sincadas no andamento (dotted 8th)',
        sound: 'Preciso, rítmico, moderno',
        genres: 'Pop Rock, Post-Rock, Gospel, Eletrônico',
        icon: '⏳',
        promptTag: 'crystal-clear rhythmic digital delay on beat'
      },
      {
        id: 'spring_reverb',
        name: 'Spring Reverb (Mola Vintage)',
        desc: 'Ressonância metálica e aquosa clássica dos amplificadores Fender',
        sound: 'Molhado, estalado, retrô',
        genres: 'Surf Rock, Blues, Country, Rockabilly',
        icon: '🪗',
        promptTag: 'splashing surf vintage spring reverb'
      },
      {
        id: 'ambient_reverb',
        name: 'Hall / Shimmer Reverb',
        desc: 'Espaços gigantescos, caudas longas e reflexões etéreas',
        sound: 'Catedral, etéreo, gigantesco',
        genres: 'Ambient, Post-Rock, Shoegaze, Cinematic',
        icon: '🌌',
        promptTag: 'vast cinematic hall and ethereal shimmer reverb'
      }
    ]
  }
};

export const GUITAR_TECHNIQUES = [
  { id: 'funk_scratch', name: 'Funk Chucking & Scratching', desc: 'Palhetadas percussivas abafadas e rítmicas', promptTag: 'percussive funk scratches and rhythmic strumming' },
  { id: 'palm_mute', name: 'Palm Muting Firme', desc: 'Abafamento com a palma da mão junto à ponte', promptTag: 'tight palm-muted chugging rhythms' },
  { id: 'virtuoso_solo', name: 'Solo Virtuoso / Shred', desc: 'Velocidade, arpejos rápidos e licks melódicos', promptTag: 'virtuosic guitar soloing with fluid fast runs' },
  { id: 'emotional_bends', name: 'Bends Expressivos & Vibrato', desc: 'Notas sustentadas com curva vocal e sentimento', promptTag: 'expressive vocal-like bends and singing vibrato' },
  { id: 'fingerpicking', name: 'Fingerstyle / Dedilhado', desc: 'Execução com os dedos sem palheta para textura orgânica', promptTag: 'delicate fingerstyle picking and acoustic intimacy' },
  { id: 'clean_arpeggios', name: 'Arpejos Limpos', desc: 'Acordes dedilhados nota por nota brilhantes', promptTag: 'clean crystalline chord arpeggios' },
  { id: 'slide_guitar', name: 'Slide Guitar (Gargalo)', desc: 'Glissandos contínuos e sonoridade sulista/blues', promptTag: 'smooth emotive slide guitar weeping melodies' },
  { id: 'whammy_flutter', name: 'Alavanca / Tremolo Arm', desc: 'Mergulhos de afinação e flutuações harmônicas', promptTag: 'expressive whammy bar flutters and dive bombs' }
];

export const GUITAR_RIG_PRESETS = [
  {
    id: 'preset_funk_nile',
    name: 'Funk/Pop Estalado (Nile Rodgers)',
    category: 'Pop & Funk',
    desc: 'O som icônico de rítmicas funky: brilhante, percussivo e na cara do mix.',
    modelId: 'stratocaster',
    pickupId: 'single_coil',
    pickupPosition: 'bridge',
    ampId: 'fender_twin',
    pedals: ['compressor', 'chorus', 'spring_reverb'],
    techniqueId: 'funk_scratch',
    tagsDescription: 'Fender Stratocaster, bridge single-coil through Fender Twin Reverb clean amp, optical compressor, subtle 80s chorus, splash of spring reverb, percussive funk rhythm scratches'
  },
  {
    id: 'preset_classic_rock_70s',
    name: 'Rock Clássico 70s Crunch (Page / Slash)',
    category: 'Rock & Metal',
    desc: 'O DNA do classic rock: Les Paul rugindo em um Marshall Plexi com sustain eterno.',
    modelId: 'les_paul',
    pickupId: 'humbucker',
    pickupPosition: 'bridge',
    ampId: 'marshall_plexi',
    pedals: ['overdrive', 'tape_delay'],
    techniqueId: 'emotional_bends',
    tagsDescription: 'Gibson Les Paul bridge humbucker cranked through vintage Marshall Plexi tube stack, warm overdrive boost, short tape slapback delay, singing vibrato and heavy blues-rock bends'
  },
  {
    id: 'preset_gilmour_solo',
    name: 'Solo Espacial / Épico (David Gilmour)',
    category: 'Rock & Metal',
    desc: 'Solo celestial e expansivo com Fuzz cremoso, delay de fita e reverberação infinita.',
    modelId: 'stratocaster',
    pickupId: 'single_coil',
    pickupPosition: 'neck',
    ampId: 'fender_twin',
    pedals: ['fuzz', 'tape_delay', 'ambient_reverb', 'phaser'],
    techniqueId: 'emotional_bends',
    tagsDescription: 'Stratocaster neck pickup with smooth sustaining vintage fuzz, lush tape echo repeats, expansive hall reverb, slow phase sweep, soaring emotional melodic lead'
  },
  {
    id: 'preset_modern_djent',
    name: 'Metal Moderno / Djent 8 Cordas',
    category: 'Rock & Metal',
    desc: 'Agressividade cirúrgica, graves subterrâneos sem embolar e corte seco no gate.',
    modelId: 'extended_range',
    pickupId: 'humbucker',
    pickupPosition: 'bridge',
    ampId: 'mesa_rectifier',
    pedals: ['noise_gate', 'distortion', 'digital_delay'],
    techniqueId: 'palm_mute',
    tagsDescription: '8-string baritone guitar into high-gain Mesa Boogie Rectifier, precision noise gate, tight razor distortion boost, syncopated heavy palm-muted djent riffing'
  },
  {
    id: 'preset_surf_indie',
    name: 'Indie & Surf Rock Vintage',
    category: 'Indie & Alt',
    desc: 'Guitarra vintage com reverb de mola molhado e oscilação hipnótica de tremolo.',
    modelId: 'jazzmaster',
    pickupId: 'single_coil',
    pickupPosition: 'middle',
    ampId: 'fender_twin',
    pedals: ['tremolo', 'spring_reverb', 'tape_delay'],
    techniqueId: 'clean_arpeggios',
    tagsDescription: 'Fender Jazzmaster offset guitar, vintage spring reverb drenched, pulsing tube tremolo, warm tape echo, jangly clean indie arpeggios'
  },
  {
    id: 'preset_chicago_blues',
    name: 'Blues Aveludado de Chicago (ES-335)',
    category: 'Blues & Jazz',
    desc: 'Madeira ressonante, harmônicos orgânicos e dinâmica aveludada sensível ao toque.',
    modelId: 'es335',
    pickupId: 'humbucker',
    pickupPosition: 'neck',
    ampId: 'fender_tweed',
    pedals: ['overdrive', 'spring_reverb'],
    techniqueId: 'emotional_bends',
    tagsDescription: 'Gibson ES-335 semi-hollow guitar, neck humbucker warmth into pushed 1950s Fender Tweed Deluxe amp, organic tube breakup, rich blues soul dynamics'
  },
  {
    id: 'preset_shoegaze_wall',
    name: 'Shoegaze Wall of Sound',
    category: 'Indie & Alt',
    desc: 'Parede colossal de guitarras mergulhadas em Fuzz e reverberação infinita.',
    modelId: 'jazzmaster',
    pickupId: 'single_coil',
    pickupPosition: 'bridge',
    ampId: 'marshall_plexi',
    pedals: ['fuzz', 'flanger', 'ambient_reverb', 'digital_delay'],
    techniqueId: 'whammy_flutter',
    tagsDescription: 'Fender Jazzmaster gliding with whammy flutter, saturated wall of fuzz, lush swirling flanger, massive washes of ethereal reverse reverb'
  },
  {
    id: 'preset_vintage_tele_country',
    name: 'Country & Southern Twang (Telecaster)',
    category: 'Pop & Funk',
    desc: 'O clássico "chicken picking" do country: estalo rápido, compressor ótico e agudos de navalha.',
    modelId: 'telecaster',
    pickupId: 'single_coil',
    pickupPosition: 'bridge',
    ampId: 'fender_twin',
    pedals: ['compressor', 'spring_reverb'],
    techniqueId: 'fingerpicking',
    tagsDescription: 'Fender Telecaster bridge pickup, snappy optical compressor, sparkling Fender Twin clean tone, crisp country chicken picking twang'
  }
];

/**
 * Monta o descritor de áudio em inglês técnico para injeção no prompt Suno/Udio
 */
export function buildGuitarRigPrompt(rig) {
  if (!rig) return '';
  
  // Se o usuário selecionou um preset direto e não modificou
  if (rig.isPreset && rig.tagsDescription) {
    return rig.tagsDescription;
  }

  const model = GUITAR_MODELS.find(m => m.id === rig.modelId) || GUITAR_MODELS[0];
  const pickup = PICKUP_TYPES.find(p => p.id === rig.pickupId);
  const position = PICKUP_POSITIONS.find(pos => pos.id === rig.pickupPosition);
  const amp = STUDIO_AMPLIFIERS.find(a => a.id === rig.ampId);
  
  // Pedais
  const allPedals = Object.values(PEDALBOARD_CATEGORIES).flatMap(c => c.pedals);
  const selectedPedalObjects = (rig.pedals || [])
    .map(pId => allPedals.find(p => p.id === pId))
    .filter(Boolean);

  const technique = GUITAR_TECHNIQUES.find(t => t.id === rig.techniqueId);

  const parts = [];

  // 1. Guitarra + Captador
  let guitarPart = model.name;
  if (position && pickup) {
    guitarPart += ` (${position.name.toLowerCase()} ${pickup.name.toLowerCase()})`;
  } else if (pickup) {
    guitarPart += ` (${pickup.name.toLowerCase()})`;
  }
  parts.push(guitarPart);

  // 2. Pedais de dinâmica ou ganho prévios
  const gainAndDynamics = selectedPedalObjects.filter(p => ['gain', 'dynamics_filter'].includes(
    Object.keys(PEDALBOARD_CATEGORIES).find(cat => PEDALBOARD_CATEGORIES[cat].pedals.some(x => x.id === p.id))
  ));
  if (gainAndDynamics.length > 0) {
    parts.push(gainAndDynamics.map(p => p.promptTag).join(', '));
  }

  // 3. Amplificador
  if (amp) {
    parts.push(amp.promptTag);
  }

  // 4. Modulações e Espaço (pós-amp)
  const modAndSpace = selectedPedalObjects.filter(p => ['modulation', 'time_space'].includes(
    Object.keys(PEDALBOARD_CATEGORIES).find(cat => PEDALBOARD_CATEGORIES[cat].pedals.some(x => x.id === p.id))
  ));
  if (modAndSpace.length > 0) {
    parts.push(modAndSpace.map(p => p.promptTag).join(', '));
  }

  // 5. Técnica
  if (technique) {
    parts.push(technique.promptTag);
  }

  return parts.join(', ');
}

/**
 * Gera uma tag de marcação estrutural de letra para Suno / Udio
 */
export function buildGuitarLyricsTag(rig, tagType = 'solo') {
  const model = GUITAR_MODELS.find(m => m.id === rig?.modelId) || GUITAR_MODELS[0];
  const allPedals = Object.values(PEDALBOARD_CATEGORIES).flatMap(c => c.pedals);
  const activePedalNames = (rig?.pedals || [])
    .map(pId => allPedals.find(p => p.id === pId)?.name.split(' ')[0])
    .filter(Boolean);

  const fxStr = activePedalNames.length > 0 ? ` with ${activePedalNames.join(' + ')}` : '';
  
  if (tagType === 'solo') {
    return `[Guitar Solo: ${model.shortName}${fxStr}]`;
  }
  if (tagType === 'riff') {
    return `[Guitar Riff: ${model.shortName}${fxStr}]`;
  }
  if (tagType === 'intro') {
    return `[Intro: ${model.shortName}${fxStr} Lead]`;
  }
  return `[Guitar Lead: ${model.shortName}${fxStr}]`;
}
