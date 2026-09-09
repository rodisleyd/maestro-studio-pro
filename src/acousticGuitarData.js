// src/acousticGuitarData.js
/**
 * MAESTRO STUDIO PRO - ACOUSTIC GUITAR STUDIO & RIG ARCHITECT
 * Base de conhecimento de estúdio para Violões de Corda de Aço (Steel-String Acoustic Guitars).
 * Baseado no documento técnico de estúdio de gravação de violões de aço.
 */

export const ACOUSTIC_BODY_SHAPES = [
  {
    id: 'dreadnought',
    name: 'Dreadnought',
    icon: '🎸',
    size: 'Corpo Grande',
    soundChar: 'Forte, grave e encorpado com alta projeção',
    bestFor: 'Folk, Country, Rock Acústico, Pop, Sertanejo, bases firmes',
    promptTag: 'Dreadnought steel-string acoustic guitar, deep resonant low-end, bold volume and projection',
    badge: 'O Clássico Encorpado'
  },
  {
    id: 'jumbo',
    name: 'Jumbo',
    icon: '🎸',
    size: 'Corpo Extra Grande e Arredondado',
    soundChar: 'Muito volume, graves e agudos equilibrados, som cheio e amplo',
    bestFor: 'Bases onde o violão precisa preencher todo o espaço estéreo da música',
    promptTag: 'Jumbo steel-string acoustic guitar, booming projection, full-bodied expansive acoustic power',
    badge: 'Máximo Volume & Espaço'
  },
  {
    id: 'om',
    name: 'OM / Orchestra Model',
    icon: '🎸',
    size: 'Corpo Médio',
    soundChar: 'Equilibrado, definido, dinâmico e extremamente versátil para estúdio',
    bestFor: 'Dedilhados, Fingerstyle, Pop, Folk, Blues, arranjos de estúdio',
    promptTag: 'Orchestra Model OM steel-string acoustic guitar, articulate dynamic balance, pristine studio recording',
    badge: 'O Favorito de Estúdio'
  },
  {
    id: '000',
    name: '000 (Triple O)',
    icon: '🎸',
    size: 'Corpo Médio Confortável',
    soundChar: 'Quente, equilibrado, focado e muito detalhado',
    bestFor: 'Arranjos intimistas, fingerpicking suave, baladas e MPB',
    promptTag: '000 body steel-string acoustic guitar, warm intimate balance, nuanced delicate response',
    badge: 'Quente & Detalhado'
  },
  {
    id: 'parlor',
    name: 'Parlor',
    icon: '🪵',
    size: 'Corpo Pequeno Vintage',
    soundChar: 'Médio-agudo, íntimo, seco e focado nos médios com textura rústica',
    bestFor: 'Delta Blues, Trilha Sonora, Folk Antigo, Lo-Fi e gravação intimista',
    promptTag: 'vintage Parlor acoustic guitar, focused boxy midrange, dry intimate retro acoustic tone',
    badge: 'Vintage & Blues Íntimo'
  },
  {
    id: 'auditorium',
    name: 'Auditorium',
    icon: '🎸',
    size: 'Corpo Médio/Grande',
    soundChar: 'Equilibrado e versátil, excelente resposta tanto com palheta quanto dedos',
    bestFor: 'Pop Acústico, Worship, Folk Moderno, Singer-Songwriter',
    promptTag: 'Auditorium steel-string acoustic guitar, clear modern acoustic response, versatile dynamic range',
    badge: 'Moderno & Versátil'
  },
  {
    id: 'grand_auditorium',
    name: 'Grand Auditorium',
    icon: '🎸',
    size: 'Corpo Maior com Cintura Marcada',
    soundChar: 'Graves presentes e definidos com agudos brilhantes e cristalinos',
    bestFor: 'Pop Moderno, Fingerstyle Percussivo, Solo e Acompanhamento',
    promptTag: 'Grand Auditorium steel-string acoustic guitar, tight punchy bass, sparkling articulate top-end chime',
    badge: 'Brilho & Pegada'
  },
  {
    id: '12_strings',
    name: 'Violão de 12 Cordas',
    icon: '✨',
    size: 'Seis Pares de Cordas',
    soundChar: 'Brilhante, amplo, "cheio" e cintilante com coro harmônico natural',
    bestFor: 'Rock Clássico, Folk, Baladas, Introduções épicas e camadas cintilantes',
    promptTag: '12-string steel-string acoustic guitar, lush natural chorus, shimmering wide harmonic jangle, rich double-course shimmer',
    badge: 'Lush & Cintilante'
  }
];

export const ACOUSTIC_TONEWOODS = [
  {
    id: 'sitka_spruce',
    name: 'Sitka Spruce (Tampo)',
    desc: 'O tampo mais tradicional do mundo: dinâmico, aberto e com agudos cristalinos.',
    promptTag: 'solid Sitka spruce soundboard, wide dynamic headroom and crisp chime'
  },
  {
    id: 'mahogany',
    name: 'Mahogany / Mogno',
    desc: 'Madeira densa e quente, com médios doces, ataque focado e som aveludado.',
    promptTag: 'solid mahogany construction, warm focused woody midrange and punchy bloom'
  },
  {
    id: 'rosewood',
    name: 'Rosewood / Jacarandá',
    desc: 'Graves profundos e agudos limpos com reverbação natural rica em harmônicos.',
    promptTag: 'Indian rosewood back and sides, deep resonant low-end and bell-like overtones'
  },
  {
    id: 'cedar_koa',
    name: 'Koa / Western Cedar',
    desc: 'Madeira nobre e sedosa, com resposta ultrarrápida a toques leves e dedilhados.',
    promptTag: 'exotic tonewood build, silky smooth high-end and lush acoustic sustain'
  }
];

export const ACOUSTIC_STRINGS = [
  {
    id: 'phosphor_bronze',
    name: 'Phosphor Bronze',
    desc: 'Padrão de estúdio mundial: quente, encorpada, rica e com brilho equilibrado.',
    promptTag: 'phosphor bronze acoustic strings, warm rich harmonic sustain'
  },
  {
    id: '80_20_bronze',
    name: '80/20 Bronze (Brass)',
    desc: 'Mais metálica, brilhante e cortante. Ideal para abrir a mixagem e dar estalo.',
    promptTag: '80/20 bronze strings, bright articulate metallic chime and cutting bite'
  },
  {
    id: 'flatwound',
    name: 'Flatwound / Lisa',
    desc: 'Superfície lisa sem ruído de arrasto dos dedos: som macio, aveludado e vintage.',
    promptTag: 'flatwound acoustic strings, smooth mellow response, zero fret finger squeak'
  },
  {
    id: 'silk_steel',
    name: 'Silk & Steel',
    desc: 'Baixa tensão com núcleo macio: toque extremamente aveludado e intimista.',
    promptTag: 'silk and steel acoustic strings, tender gentle touch, soft woody tone'
  }
];

export const ACOUSTIC_TECHNIQUES = [
  {
    id: 'fingerpicking',
    name: 'Dedilhado (Fingerpicking)',
    desc: 'Suave + detalhado + íntimo + notas bem separadas e definidas.',
    promptTag: 'delicate fingerpicking, warm and intimate tone, nuanced note separation',
    icon: '🤏'
  },
  {
    id: 'fingerstyle_full',
    name: 'Fingerstyle Completo',
    desc: 'Linhas de baixo simultâneas, acordes, melodia guia e batuque no tampo.',
    promptTag: 'virtuoso fingerstyle acoustic guitar, simultaneous bassline and melody, percussive body tapping',
    icon: '🖐'
  },
  {
    id: 'pick_flatpicking',
    name: 'Palheta Firme (Flatpicking)',
    desc: 'Ataque forte + definido + brilho na ponta da palheta.',
    promptTag: 'crisp pick attack, bright articulate flatpicking, clear transient definition',
    icon: '🎸'
  },
  {
    id: 'strumming_gentle',
    name: 'Batida Suave (Gentle Strum)',
    desc: 'Acompanhamento acústico leve, aberto e aconchegante.',
    promptTag: 'gentle acoustic strumming, airy open chords, smooth rhythmic cushion',
    icon: '🎵'
  },
  {
    id: 'strumming_bold',
    name: 'Batida Forte / Rítmica',
    desc: 'Base enérgica, palhetada firme que guia o ritmo da música.',
    promptTag: 'driving rhythmic acoustic strumming, energetic full chords, strong forward momentum',
    icon: '⚡'
  },
  {
    id: 'palm_muting',
    name: 'Palm Muting / Abafado',
    desc: 'Batida com a mão apoiada nas cordas junto à ponte, criando um groove percussivo.',
    promptTag: 'tight acoustic palm muting, punchy rhythmic acoustic pulse, percussive chug',
    icon: '⭕'
  },
  {
    id: 'travis_picking',
    name: 'Travis Picking',
    desc: 'Padrão clássico de baixo alternado do polegar com arpejo síncopado.',
    promptTag: 'steady alternating-bass Travis picking, syncopated folk-country acoustic pattern',
    icon: '🪕'
  },
  {
    id: 'hammer_pull',
    name: 'Hammer-on & Pull-off',
    desc: 'Ligaduras e ornamentos melódicos expressivos no meio do dedilhado.',
    promptTag: 'expressive hammer-ons and melodic pull-offs, lyrical acoustic ornamentation',
    icon: '🔨'
  }
];

export const ACOUSTIC_ATTACKS = [
  { id: 'soft', name: 'Soft (Suave)', desc: 'Toque aveludado e delicado', promptTag: 'soft tender acoustic attack' },
  { id: 'medium', name: 'Medium (Natural)', desc: 'Pegada equilibrada de estúdio', promptTag: 'balanced natural acoustic attack' },
  { id: 'aggressive', name: 'Aggressive (Forte)', desc: 'Ataque enérgico e com pegada', promptTag: 'bold energetic pick attack' },
  { id: 'percussive', name: 'Percussive (Percussivo)', desc: 'Com estalos nas cordas e batidas no corpo', promptTag: 'percussive body slaps and sharp string snapping' }
];

export const ACOUSTIC_TIMBRES = [
  { id: 'warm', name: 'Warm', desc: 'Quente e encorpado', promptTag: 'warm organic tone' },
  { id: 'bright', name: 'Bright', desc: 'Brilhante e aberto', promptTag: 'bright sparkling tone' },
  { id: 'woody', name: 'Woody', desc: 'Amadeirado e acústico natural', promptTag: 'dry woody vintage tone' },
  { id: 'metallic', name: 'Metallic', desc: 'Metálico e definido', promptTag: 'articulate metallic sheen' },
  { id: 'resonant', name: 'Resonant', desc: 'Ressonante e sustentado', promptTag: 'rich resonant acoustic bloom' },
  { id: 'full_bodied', name: 'Full-Bodied', desc: 'Cheio e presente no mix', promptTag: 'full-bodied acoustic presence' }
];

export const ACOUSTIC_MICS = [
  {
    id: '12th_fret',
    name: '12º Traste (Close Mic)',
    desc: 'Mais definição e agudos cristalinos sem embolar os graves.',
    promptTag: 'close-miked at the 12th fret with small diaphragm condenser, pristine articulation'
  },
  {
    id: 'bridge',
    name: 'Próximo à Ponte',
    desc: 'Mais ataque na palheta e presença nos médios para cortar na mix.',
    promptTag: 'bridge-aimed microphone placement, pronounced pick transient attack'
  },
  {
    id: 'body',
    name: 'Região do Corpo',
    desc: 'Mais corpo, ressonância da caixa e graves confortáveis.',
    promptTag: 'soundboard-aimed large diaphragm condenser, deep woody acoustic body resonance'
  },
  {
    id: 'stereo_pair',
    name: 'Par Estéreo XY (Spaced Pair)',
    desc: 'Dois microfones combinados para abertura estéreo larga e realismo 3D.',
    promptTag: 'spaced stereo pair condenser microphones, wide holographic acoustic stereo image'
  },
  {
    id: 'ambient_room',
    name: 'Microfone de Sala / Ambiência',
    desc: 'Capta a acústica viva da sala de gravação.',
    promptTag: 'ambient stereo room mic blending natural room reflections'
  }
];

export const ACOUSTIC_EFFECTS = [
  {
    id: 'compressor',
    name: 'Compressor Óptico',
    category: 'dinamica',
    desc: 'Deixa o volume uniforme e controlado sem perder o dinamismo.',
    promptTag: 'subtle optical studio acoustic compression'
  },
  {
    id: 'eq_air',
    name: 'EQ Presença & Brilho',
    category: 'eq',
    desc: 'High-shelf nos agudos para trazer "ar" e brilho de estúdio de primeira linha.',
    promptTag: 'air-band high frequency acoustic EQ sheen'
  },
  {
    id: 'eq_body',
    name: 'EQ Corpo & Graves',
    category: 'eq',
    desc: 'Reforço sutil nos médios-graves para dar sensação de instrumento imponente.',
    promptTag: 'warm low-end body contouring EQ'
  },
  {
    id: 'reverb_room',
    name: 'Reverb Small Room',
    category: 'espaco',
    desc: 'Sensação aconchegante de estúdio de gravação com painéis de madeira.',
    promptTag: 'wooden studio room acoustic reverb'
  },
  {
    id: 'reverb_hall',
    name: 'Reverb Concert Hall',
    category: 'espaco',
    desc: 'Ambiência ampla, solene e etérea de sala de concertos.',
    promptTag: 'expansive concert hall reverb, lush acoustic tail'
  },
  {
    id: 'reverb_plate',
    name: 'Reverb Vintage Plate',
    category: 'espaco',
    desc: 'Placa clássica dos anos 70 que traz brilho aveludado e sustain suave.',
    promptTag: 'smooth vintage plate reverb'
  },
  {
    id: 'tape_saturation',
    name: 'Saturação de Fita Analógica',
    category: 'cor',
    desc: 'Passagem por pré valvulado e fita de rolo: calor vintage orgânico.',
    promptTag: 'subtle analog tape saturation, warm tube preamp coloration'
  },
  {
    id: 'stereo_chorus',
    name: 'Chorus Acústico Sutil',
    category: 'modulacao',
    desc: 'Cria uma abertura estéreo cintilante e brilhante.',
    promptTag: 'tasteful subtle stereo chorus, shimmering wide acoustic depth'
  },
  {
    id: 'tape_delay',
    name: 'Tape Delay Discreto',
    category: 'tempo',
    desc: 'Ecos rítmicos analógicos sutis para criar profundidade e atmosfera.',
    promptTag: 'discreet analog tape echoes, ambient spatial depth'
  }
];

export const ACOUSTIC_PRESETS = [
  {
    id: 'folk_songwriter',
    name: 'Folk & Singer-Songwriter',
    badge: 'Íntimo & Poético',
    desc: 'Inspirado em James Taylor, Bob Dylan e Simon & Garfunkel: dedilhado suave, madeira quente e sala aconchegante.',
    shapeId: 'dreadnought',
    tonewoodId: 'sitka_spruce',
    stringsId: 'phosphor_bronze',
    techniqueId: 'fingerpicking',
    attackId: 'soft',
    timbreId: 'warm',
    micId: '12th_fret',
    effects: ['compressor', 'reverb_room']
  },
  {
    id: 'modern_pop_percussive',
    name: 'Pop Acústico & Percussivo',
    badge: 'Moderno & Dinâmico',
    desc: 'Estilo Ed Sheeran e John Mayer: Grand Auditorium com batida sincopada, estalo na palheta e compressão moderna.',
    shapeId: 'grand_auditorium',
    tonewoodId: 'rosewood',
    stringsId: '80_20_bronze',
    techniqueId: 'strumming_bold',
    attackId: 'percussive',
    timbreId: 'bright',
    micId: 'bridge',
    effects: ['compressor', 'eq_air', 'reverb_plate']
  },
  {
    id: 'sertanejo_acustico',
    name: 'Moda Acústica & Sertanejo',
    badge: 'Base Forte & Brilho',
    desc: 'Dreadnought com cordas 80/20 Bronze, palhetada firme e aberta, brilho cortante na mixagem.',
    shapeId: 'dreadnought',
    tonewoodId: 'sitka_spruce',
    stringsId: '80_20_bronze',
    techniqueId: 'pick_flatpicking',
    attackId: 'aggressive',
    timbreId: 'bright',
    micId: '12th_fret',
    effects: ['compressor', 'eq_air', 'reverb_room']
  },
  {
    id: 'virtuoso_fingerstyle',
    name: 'Fingerstyle Virtuoso',
    badge: 'Tommy Emmanuel Style',
    desc: 'Orchestra Model com par estéreo, linhas de baixo com melodia simultânea e percussão rica no tampo.',
    shapeId: 'om',
    tonewoodId: 'rosewood',
    stringsId: 'phosphor_bronze',
    techniqueId: 'fingerstyle_full',
    attackId: 'percussive',
    timbreId: 'resonant',
    micId: 'stereo_pair',
    effects: ['compressor', 'reverb_hall']
  },
  {
    id: 'twelve_string_shimmer',
    name: '12 Cordas Sonho & Shimmer',
    badge: 'Épico & Cintilante',
    desc: 'Seis pares de cordas com chorus sutil e reverb amplo: o violão brilhante que preenche toda a canção.',
    shapeId: '12_strings',
    tonewoodId: 'sitka_spruce',
    stringsId: '80_20_bronze',
    techniqueId: 'strumming_gentle',
    attackId: 'medium',
    timbreId: 'resonant',
    micId: 'stereo_pair',
    effects: ['eq_air', 'reverb_hall', 'stereo_chorus']
  },
  {
    id: 'delta_blues_vintage',
    name: 'Delta Blues & Vintage Lofi',
    badge: 'Seco & Retrô',
    desc: 'Parlor em mogno, dedilhado rústico com afinação aberta, som seco, intimista e saturação de fita vintage.',
    shapeId: 'parlor',
    tonewoodId: 'mahogany',
    stringsId: 'flatwound',
    techniqueId: 'fingerpicking',
    attackId: 'medium',
    timbreId: 'woody',
    micId: 'body',
    effects: ['tape_saturation', 'reverb_room']
  },
  {
    id: 'unplugged_rock',
    name: 'Rock Acústico Unplugged',
    badge: 'MTV Unplugged',
    desc: 'Jumbo imponente com batida aberta em acordes cheios, saturação analógica e grande projeção.',
    shapeId: 'jumbo',
    tonewoodId: 'sitka_spruce',
    stringsId: 'phosphor_bronze',
    techniqueId: 'strumming_bold',
    attackId: 'aggressive',
    timbreId: 'full_bodied',
    micId: 'stereo_pair',
    effects: ['compressor', 'reverb_room', 'tape_saturation']
  }
];

/**
 * Constrói o texto detalhado de prompt do violão de aço para Suno / Udio
 */
export function buildAcousticGuitarPrompt(rig) {
  if (!rig) return '';

  const shape = ACOUSTIC_BODY_SHAPES.find(s => s.id === rig.shapeId) || ACOUSTIC_BODY_SHAPES[0];
  const tonewood = ACOUSTIC_TONEWOODS.find(t => t.id === rig.tonewoodId);
  const strings = ACOUSTIC_STRINGS.find(st => st.id === rig.stringsId);
  const technique = ACOUSTIC_TECHNIQUES.find(tc => tc.id === rig.techniqueId);
  const attack = ACOUSTIC_ATTACKS.find(a => a.id === rig.attackId);
  const timbre = ACOUSTIC_TIMBRES.find(tb => tb.id === rig.timbreId);
  const mic = ACOUSTIC_MICS.find(m => m.id === rig.micId);

  const activeEffects = (rig.effects || [])
    .map(effId => ACOUSTIC_EFFECTS.find(e => e.id === effId))
    .filter(Boolean);

  const parts = [];

  // 1. Instrumento principal e formato do corpo
  parts.push(shape.promptTag);

  // 2. Madeira e cordas
  if (tonewood) parts.push(tonewood.promptTag);
  if (strings) parts.push(strings.promptTag);

  // 3. Técnica e ataque
  if (technique) parts.push(technique.promptTag);
  if (attack && attack.id !== 'medium') parts.push(attack.promptTag);

  // 4. Caráter do timbre
  if (timbre) parts.push(timbre.promptTag);

  // 5. Microfonação
  if (mic) parts.push(mic.promptTag);

  // 6. Efeitos de estúdio
  if (activeEffects.length > 0) {
    parts.push(activeEffects.map(e => e.promptTag).join(', '));
  }

  return parts.join(', ');
}

/**
 * Gera etiqueta estrutural de letra para Suno
 */
export function buildAcousticLyricsTag(rig, tagType = 'intro') {
  const shape = ACOUSTIC_BODY_SHAPES.find(s => s.id === rig?.shapeId) || ACOUSTIC_BODY_SHAPES[0];
  const technique = ACOUSTIC_TECHNIQUES.find(tc => tc.id === rig?.techniqueId);
  const techStr = technique ? ` ${technique.name.split(' ')[0]}` : '';

  if (tagType === 'intro') {
    return `[Acoustic Intro: ${shape.name}${techStr}]`;
  }
  if (tagType === 'solo') {
    return `[Acoustic Guitar Solo: ${shape.name}]`;
  }
  if (tagType === 'bridge') {
    return `[Acoustic Breakdown: ${shape.name}${techStr}]`;
  }
  return `[Acoustic Guitar: ${shape.name}]`;
}
