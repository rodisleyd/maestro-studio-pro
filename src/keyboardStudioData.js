// src/keyboardStudioData.js
/**
 * MAESTRO STUDIO PRO - KEYBOARD & SYNTHESIZER STUDIO PRO
 * Base de conhecimento de estúdio para Pianos Acústicos, Pianos Elétricos,
 * Órgãos e Sintetizadores Analógicos / Digitais / Workstations.
 * Baseado na classificação hierárquica e cadeia de modelagem de timbres.
 */

export const KEYBOARD_CATEGORIES = [
  { id: 'all', name: 'Todos os Instrumentos', icon: '🎹' },
  { id: 'pianos', name: 'Pianos Acústicos', icon: '🎹' },
  { id: 'electric_pianos', name: 'Pianos Elétricos', icon: '⚡' },
  { id: 'organs', name: 'Órgãos Vintage', icon: '⛪' },
  { id: 'analog_synths', name: 'Sintetizadores Analógicos', icon: '🎛️' },
  { id: 'digital_synths', name: 'Sintetizadores Digitais & Workstations', icon: '💾' }
];

export const KEYBOARD_INSTRUMENTS = [
  // 1. PIANOS ACÚSTICOS
  {
    id: 'steinway_grand',
    category: 'pianos',
    name: 'Steinway & Sons Grand Piano',
    shortName: 'Steinway Grand',
    icon: '🎹',
    soundChar: 'Som rico, amplo, encorpado e sofisticado com ressonância nobre',
    bestFor: 'Música clássica, jazz moderno, baladas, trilhas sonoras cinematográficas',
    promptTag: 'Steinway & Sons Concert Grand Piano, pristine acoustic hall resonance, rich dynamic touch and harmonic depth',
    badge: 'O Padrão Ouro de Concerto'
  },
  {
    id: 'yamaha_cfx_c7',
    category: 'pianos',
    name: 'Yamaha CFX / C7 Grand Piano',
    shortName: 'Yamaha CFX / C7',
    icon: '🎹',
    soundChar: 'Brilhante, definido, cortante e com ataque nítido na mixagem',
    bestFor: 'Pop contemporâneo, gospel, rock, jazz fusion, worship',
    promptTag: 'Yamaha CFX Concert Grand Piano, bright sparkling clarity, punchy cutting acoustic attack and articulate mix presence',
    badge: 'Brilho & Clareza de Pop'
  },
  {
    id: 'bosendorfer_imperial',
    category: 'pianos',
    name: 'Bösendorfer Imperial 290',
    shortName: 'Bösendorfer Imperial',
    icon: '🎹',
    soundChar: 'Grave profundo e imponente com 97 teclas, corpo denso e aveludado',
    bestFor: 'Música erudita dramática, trilhas sombrias e épicas, baladas orquestrais',
    promptTag: 'Bösendorfer Imperial Grand Piano, cavernous resonant sub-bass octaves, warm opulent body and majestic acoustic warmth',
    badge: 'Graves Monumentais'
  },
  {
    id: 'kawai_grand',
    category: 'pianos',
    name: 'Kawai Shigeru Grand Piano',
    shortName: 'Kawai Grand',
    icon: '🎹',
    soundChar: 'Timbre quente, doce, romântico e extremamente suave',
    bestFor: 'Baladas românticas, MPB suave, jazz lounge, neo-clássico',
    promptTag: 'Kawai Shigeru Grand Piano, warm mellow timbre, delicate singing sustain and romantic velvety touch',
    badge: 'Doce & Aveludado'
  },
  {
    id: 'upright_piano',
    category: 'pianos',
    name: 'Upright Piano (Piano Vertical)',
    shortName: 'Upright Piano',
    icon: '🪵',
    soundChar: 'Mais íntimo, percussivo, caseiro e com personalidade rústica',
    bestFor: 'Indie rock, bedroom pop, folk acústico, trilhas introspectivas',
    promptTag: 'vintage upright acoustic piano, intimate percussive wooden clack, cozy boxy warmth and nostalgic home recording feel',
    badge: 'Íntimo & Indie'
  },
  {
    id: 'felt_piano',
    category: 'pianos',
    name: 'Felt Piano (Piano com Feltro)',
    shortName: 'Felt Piano',
    icon: '🌧️',
    soundChar: 'Abafado com feltro entre martelos e cordas: macio, sussurrado e etéreo',
    bestFor: 'Trilhas cinematográficas minimalistas, Lo-Fi hip hop, ambient e neo-clássico',
    promptTag: 'intimate felt piano, soft muffled hammers, delicate mechanical pedal noise, airy cinematic tenderness',
    badge: 'Cinematográfico & Lo-Fi'
  },
  {
    id: 'honky_tonk',
    category: 'pianos',
    name: 'Honky-Tonk / Tack Piano',
    shortName: 'Honky-Tonk',
    icon: '🤠',
    soundChar: 'Piano intencionalmente desafinado com ataque metálico estridente de tachinhas',
    bestFor: 'Ragtime, saloon blues, country tradicional, rockabilly, cenas retrô',
    promptTag: 'vintage honky-tonk upright piano, detuned chorus strings, bright metallic tack attack, authentic saloon ragtime tone',
    badge: 'Saloon & Ragtime'
  },
  {
    id: 'cinematic_grand',
    category: 'pianos',
    name: 'Cinematic Ambient Grand',
    shortName: 'Cinematic Grand',
    icon: '🌌',
    soundChar: 'Piano de cauda com reverberação gigante, cauda de harmônicos e texturas imersivas',
    bestFor: 'Trilhas de ficção científica, trailers de cinema, ambient e pós-rock',
    promptTag: 'cinematic grand piano, massive cathedral reverb decay, ambient ethereal piano shimmer, emotional soundtrack focal point',
    badge: 'Épico & Atmosférico'
  },

  // 2. PIANOS ELÉTRICOS
  {
    id: 'fender_rhodes',
    category: 'electric_pianos',
    name: 'Fender Rhodes (Mark I / Mark II)',
    shortName: 'Fender Rhodes',
    icon: '⚡',
    soundChar: 'Quente, suave, aveludado e com harmônicos metálicos de sino ("tine bell")',
    bestFor: 'Neo-soul, R&B contemporâneo, jazz fusion, funk, lo-fi, pop',
    promptTag: 'vintage Fender Rhodes electric piano, warm velvet bell chime, silky smooth chord voicing with analog lushness',
    badge: 'O Clássico do Neo-Soul'
  },
  {
    id: 'wurlitzer',
    category: 'electric_pianos',
    name: 'Wurlitzer 200A',
    shortName: 'Wurlitzer 200A',
    icon: '⚡',
    soundChar: 'Mais áspero, agressivo, mordaz e "elétrico" do que o Rhodes (palhetas de aço)',
    bestFor: 'Classic rock, indie pop, blues, soul dos anos 60/70, americana',
    promptTag: 'Wurlitzer 200A electric piano, gritty reed barking bite, vintage dynamic bark and cutting electric soul',
    badge: 'Mordida & Rock Retrô'
  },
  {
    id: 'clavinet_d6',
    category: 'electric_pianos',
    name: 'Hohner Clavinet D6',
    shortName: 'Clavinet D6',
    icon: '🎸',
    soundChar: 'Extremamente percussivo, estalado e cortante com cordas beliscadas por tangentes',
    bestFor: 'Funk clássico (Stevie Wonder style), disco, soul, reggae, R&B',
    promptTag: 'Hohner Clavinet D6, snappy funky plucked attack, sharp percussive syncopation, groovy auto-wah bite',
    badge: 'Funk Estalado & Wah'
  },
  {
    id: 'yamaha_cp70',
    category: 'electric_pianos',
    name: 'Yamaha CP-70 / CP-80 Electric Grand',
    shortName: 'Yamaha CP-70',
    icon: '🎹',
    soundChar: 'Piano de cauda eletroacústico com captadores piezo: som oco, brilhante e único',
    bestFor: 'Pop dos anos 80, power ballads, new wave, rock britânico (estilo Peter Gabriel / U2)',
    promptTag: 'Yamaha CP-70 electric grand piano, unique 80s acoustic-electric chime, punchy compressed pop ballad tone',
    badge: 'Pop 80s & Power Ballad'
  },
  {
    id: 'yamaha_dx7_epiano',
    category: 'electric_pianos',
    name: 'Yamaha DX7 FM E-Piano',
    shortName: 'DX7 E-Piano',
    icon: '💾',
    soundChar: 'Piano elétrico de síntese FM com harmônicos brilhantes de sino cristalino',
    bestFor: 'Baladas pop dos anos 80/90, vaporwave, synthpop, adult contemporary',
    promptTag: 'Yamaha DX7 FM electric piano, signature 1980s crystal bell chime, pristine digital gloss and lush chorus',
    badge: 'Bells Cristalinos 80s'
  },

  // 3. ÓRGÃOS
  {
    id: 'hammond_b3',
    category: 'organs',
    name: 'Hammond B3 Organ (+ Leslie Speaker)',
    shortName: 'Hammond B3',
    icon: '⛪',
    soundChar: 'Encorpado, expressivo com drawbars, percussão harmônica e autofalante rotativo Leslie acelerando',
    bestFor: 'Gospel, blues, classic rock, soul, funk, jazz de órgão',
    promptTag: 'vintage Hammond B3 tonewheel organ, Leslie rotating speaker swirl, warm tube overdrive grit, harmonic percussion drawbars',
    badge: 'Lenda do Gospel & Rock'
  },
  {
    id: 'vox_continental',
    category: 'organs',
    name: 'Vox Continental Organ',
    shortName: 'Vox Continental',
    icon: '🎸',
    soundChar: 'Órgão transistorizado anos 60: agudo, brilhante, estridente e penetrante',
    bestFor: 'Garage rock, surf rock, The Doors style, ska, punk dos anos 70',
    promptTag: 'Vox Continental transistor combo organ, bright nasal 60s garage rock bite, piercing psychedelic reed tone',
    badge: 'Garage Rock 60s'
  },
  {
    id: 'farfisa_compact',
    category: 'organs',
    name: 'Farfisa Compact Organ',
    shortName: 'Farfisa Compact',
    icon: '🌈',
    soundChar: 'Timbre psicodélico italiano, vibrato característico e textura rústica vintage',
    bestFor: 'Rock psicodélico (Pink Floyd inicial), indie rock, post-punk, new wave',
    promptTag: 'vintage Farfisa Compact combo organ, psychedelic Italian vibrato, warm vintage transistor cheese, lo-fi indie character',
    badge: 'Psicodélico & New Wave'
  },
  {
    id: 'church_pipe_organ',
    category: 'organs',
    name: 'Pipe Organ (Órgão de Tubos de Catedral)',
    shortName: 'Pipe Organ',
    icon: '⛪',
    soundChar: 'Monumental, solene, com reverberação sacra gigante e sustentação épica',
    bestFor: 'Música sacra, gótica, metal sinfônico, trilhas sonoras de terror ou ficção científica épica (Interstellar)',
    promptTag: 'massive cathedral pipe organ, monumental acoustic grandeur, roaring pedal bass pipes, sacred dramatic reverberation',
    badge: 'Monumental & Sacro'
  },

  // 4. SINTETIZADORES ANALÓGICOS VINTAGE
  {
    id: 'minimoog_d',
    category: 'analog_synths',
    name: 'Moog Minimoog Model D',
    shortName: 'Minimoog Model D',
    icon: '🎛️',
    soundChar: 'Grave analógico monstruoso, filtro ladder 24dB/oct ressonante e saturação orgânica',
    bestFor: 'Synth bass pesadíssimo, leads cortantes de funk/prog, synthwave, eletrônica',
    promptTag: 'vintage Moog Minimoog Model D, fat resonant ladder filter sweep, monolithic warm analog synth bass, rich raw oscillators',
    badge: 'O Rei do Synth Bass'
  },
  {
    id: 'roland_juno_106',
    category: 'analog_synths',
    name: 'Roland Juno-60 / Juno-106',
    shortName: 'Roland Juno-106',
    icon: '🌊',
    soundChar: 'O som definitivo dos anos 80: chorus estéreo analógico inconfundível, pads aveludados e calor sonoro',
    bestFor: 'Synthwave, dream pop, indie, 80s synthpop, house melódico',
    promptTag: 'Roland Juno-106 analog synthesizer, legendary lush stereo chorus, warm dreamy silky pads, nostalgic 80s synthwave warmth',
    badge: 'Chorus Lendário & Pads'
  },
  {
    id: 'roland_jupiter_8',
    category: 'analog_synths',
    name: 'Roland Jupiter-8',
    shortName: 'Roland Jupiter-8',
    icon: '👑',
    soundChar: 'Polifonia de 8 vozes opulenta: brass encorpado, pads gigantes e leads heroicos',
    bestFor: 'Synthpop imponente, trilhas épicas dos anos 80, electro pop moderno',
    promptTag: 'Roland Jupiter-8 polyphonic synthesizer, majestic analog synth brass, lush opulent 8-voice textures, heroic cutting leads',
    badge: 'Majestoso & 8 Vozes'
  },
  {
    id: 'roland_sh101',
    category: 'analog_synths',
    name: 'Roland SH-101',
    shortName: 'Roland SH-101',
    icon: '⚡',
    soundChar: 'Monofônico ágil, rápido, com envelopes estalados e sequências ácidas pulsantes',
    bestFor: 'Techno clássico, electro, acid house, synthpop veloz',
    promptTag: 'Roland SH-101 monophonic synthesizer, snappy rubbery bassline, driving sequencer pulse, sharp punchy resonance',
    badge: 'Techno & Sequências'
  },
  {
    id: 'prophet_5',
    category: 'analog_synths',
    name: 'Sequential Circuits Prophet-5',
    shortName: 'Prophet-5',
    icon: '🔥',
    soundChar: 'Polissintetizador analógico clássico: timbres orgânicos, sync cortante e calor vintage autêntico',
    bestFor: 'Classic rock, new wave, pop dos anos 80, trilhas de suspense (John Carpenter)',
    promptTag: 'Sequential Circuits Prophet-5, rich analog warmth, poly-mod frequency modulation, organic singing polyphonic synth pads',
    badge: 'Polissintetizador Lendário'
  },
  {
    id: 'oberheim_obxa',
    category: 'analog_synths',
    name: 'Oberheim OB-Xa / OB-8',
    shortName: 'Oberheim OB-Xa',
    icon: '💥',
    soundChar: 'Timbre maciço com filtros 2-pole marcantes: o famoso "brass" do Van Halen ("Jump")',
    bestFor: 'Rock com sintetizadores, synthwave agressivo, hinos pop dos anos 80',
    promptTag: 'Oberheim OB-Xa analog synthesizer, massive wide American synth brass, thick roaring polysynth chords, huge filter resonance',
    badge: 'Poderoso OB-Brass'
  },
  {
    id: 'korg_ms20',
    category: 'analog_synths',
    name: 'Korg MS-20',
    shortName: 'Korg MS-20',
    icon: '🎛️',
    soundChar: 'Filtros duplos auto-oscilantes agressivos e sujos, semi-modular gritante e rústico',
    bestFor: 'Industrial, eletrônica experimental, leads distorcidos, techno pesado',
    promptTag: 'vintage Korg MS-20 semi-modular synth, screaming dirty resonant peak filters, aggressive gritty analog leads, raw distortion',
    badge: 'Agressivo & Modular'
  },
  {
    id: 'arp_odyssey',
    category: 'analog_synths',
    name: 'ARP Odyssey / ARP 2600',
    shortName: 'ARP Odyssey',
    icon: '🚀',
    soundChar: 'Duofônico afiado, modulação em anel, leads cortantes e efeitos de ficção científica',
    bestFor: 'Jazz fusion, space rock, ficção científica dos anos 70, funk espacial',
    promptTag: 'ARP Odyssey duophonic synthesizer, biting hard-sync leads, ring-modulated sci-fi overtones, piercing vintage articulation',
    badge: 'Fusion & Espacial'
  },

  // 5. SINTETIZADORES DIGITAIS & WORKSTATIONS
  {
    id: 'yamaha_dx7_synth',
    category: 'digital_synths',
    name: 'Yamaha DX7 (FM Synthesizer)',
    shortName: 'Yamaha DX7 FM',
    icon: '💾',
    soundChar: 'Síntese de modulação em frequência (FM): graves elétricos percussivos, marimbas, sinos e brilho metálico',
    bestFor: 'Pop dos anos 80, dance, new jack swing, synthwave futurista',
    promptTag: 'Yamaha DX7 6-operator FM synthesizer, percussive digital slap bass, crystalline harmonic bells, sharp metallic brass punch',
    badge: 'A Revolução FM'
  },
  {
    id: 'korg_m1',
    category: 'digital_synths',
    name: 'Korg M1 Music Workstation',
    shortName: 'Korg M1 Workstation',
    icon: '🎛️',
    soundChar: 'A workstation pioneira que definiu os anos 90: piano de house percussivo, slap bass, strings e Universe Pad',
    bestFor: 'House music clássico dos anos 90, eurodance, pop, techno melódico',
    promptTag: 'Korg M1 Music Workstation, legendary 90s M1 house piano chords, punchy bright digital attack, iconic dance anthem energy',
    badge: 'Ícone da Dance Music 90s'
  },
  {
    id: 'roland_d50',
    category: 'digital_synths',
    name: 'Roland D-50',
    shortName: 'Roland D-50',
    icon: '✨',
    soundChar: 'Síntese Linear Arithmetic (LA): ataques amostrados com caudas analógicas (Fantasia, Pizzagogo)',
    bestFor: 'New Age dos anos 80/90, pop etéreo, trilhas de cinema míticas',
    promptTag: 'Roland D-50 LA synthesis synthesizer, magical airy Fantasia pad, sparkling breathless digital textures, lush vintage warmth',
    badge: 'Texturas Fantasia 80s'
  },
  {
    id: 'yamaha_motif',
    category: 'digital_synths',
    name: 'Yamaha Motif / Montage',
    shortName: 'Yamaha Motif / Montage',
    icon: '🎧',
    soundChar: 'Workstation completa: pianos acústicos impecáveis, cordas orquestrais e synths polidos de estúdio',
    bestFor: 'R&B contemporâneo, hip-hop, gospel moderno, produção de estúdio completa',
    promptTag: 'Yamaha Motif workstation, pristine polished studio acoustic and electric sounds, high-definition R&B orchestration',
    badge: 'O Padrão do R&B & Gospel'
  },
  {
    id: 'korg_kronos',
    category: 'digital_synths',
    name: 'Korg Kronos / Nautilus',
    shortName: 'Korg Kronos',
    icon: '🚀',
    soundChar: 'Workstation topo de linha com 9 motores de síntese dedicados (SGX-2, CX-3, AL-1, MS-20)',
    bestFor: 'Produção moderna de alta complexidade, turnês ao vivo, rock progressivo, worship',
    promptTag: 'Korg Kronos 9-engine flagship workstation, multi-layered high-fidelity soundscape, ultra-rich physical modeling',
    badge: '9 Motores de Síntese'
  },
  {
    id: 'nord_stage_modern',
    category: 'digital_synths',
    name: 'Nord Stage / Modern Stage Keyboard',
    shortName: 'Nord Stage Flagship',
    icon: '🔴',
    soundChar: 'O padrão dos palcos mundiais: sample modeling orgânico de pianos, rhodes e sintetizadores híbridos analógicos',
    bestFor: 'Shows ao vivo, pop contemporâneo, worship, jazz fusion moderno',
    promptTag: 'Nord Stage modern performance keyboard, organic responsive studio acoustic sampling, transparent modern sheen and analog grit',
    badge: 'O Teclado dos Palcos'
  }
];

// TÉCNICAS E ATAQUE AO TECLADO
export const KEYBOARD_TECHNIQUES = [
  {
    id: 'expressive_dynamic',
    name: 'Toque Expressivo & Dinâmico',
    desc: 'Variação rica de intensidade de toque (velocidade), de pianíssimo a fortíssimo com alta musicalidade.',
    promptTag: 'expressive dynamic touch, sensitive touch velocity response, highly nuanced musical phrasing'
  },
  {
    id: 'soft_felt_attack',
    name: 'Ataque Suave & Aveludado',
    desc: 'Toque delicado, amortecido e lento, com cauda longa e sem agressividade nos transientes.',
    promptTag: 'soft velvet attack, slow gentle key release, delicate tender articulation'
  },
  {
    id: 'punchy_staccato',
    name: 'Staccato Percussivo & Cortante',
    desc: 'Notas curtas, secas e com ataque incisivo para marcar o ritmo com precisão cirúrgica.',
    promptTag: 'punchy staccato chords, tight percussive rhythmic attacks, sharp short envelope release'
  },
  {
    id: 'legato_portamento',
    name: 'Legato & Portamento Analógico',
    desc: 'Notas conectadas sem interrupção com deslizamento de afinação (glide) clássico de sintetizadores analógicos.',
    promptTag: 'smooth legato phrasing, expressive analog glide portamento, seamless melodic transitions'
  },
  {
    id: 'arpeggiated_sequence',
    name: 'Arpejo Contínuo & Sequenciador',
    desc: 'Subida e descida hipnótica de acordes em notas rápidas, gerando pulsação e movimento contínuo.',
    promptTag: 'flowing arpeggiated patterns, continuous 16th-note synthesizer sequence, driving hypnotic rhythm'
  },
  {
    id: 'sustained_chords',
    name: 'Acordes Sustentados & Pads Espessos',
    desc: 'Acordes abertos que preenchem o fundo sonoro com sustentação infinita e respiro.',
    promptTag: 'lush sustained chord bed, expansive atmospheric hold, deep harmonic warmth filling the stereo field'
  },
  {
    id: 'funk_clav_comping',
    name: 'Funk Comping & Tumbao Sincopado',
    desc: 'Riffs percussivos com notas fantasmas e sincopas agressivas na clave rítmica.',
    promptTag: 'syncopated funky chord comping, rhythmic ghost notes, punchy rhythmic groove accents'
  },
  {
    id: 'leslie_speed_transitions',
    name: 'Modulação Leslie (Slow/Fast Swirl)',
    desc: 'Alternância clássica do rotor de caixa Leslie entre rotação lenta (Chorale) e acelerada (Tremolo).',
    promptTag: 'dynamic Leslie rotary speaker transitions, accelerating and decelerating organ rotor swirl, thrilling Doppler modulation'
  }
];

// REGISTROS / OITAVAS
export const KEYBOARD_REGISTERS = [
  {
    id: 'full_range',
    name: 'Extensão Completa (Full 88-Key Range)',
    desc: 'Uso de todo o teclado, desde os graves fundamentais até os agudos cristalinos.',
    promptTag: 'full 88-key dynamic range, sweeping low to high register interplay'
  },
  {
    id: 'mid_register',
    name: 'Registro Médio (Base Harmônica)',
    desc: 'Oitavas centrais (C3 a C5), perfeitas para harmonia e acompanhamento de vocais sem embolar a mix.',
    promptTag: 'mid-register chordal voicings, centered acoustic body fitting comfortably beneath the vocal'
  },
  {
    id: 'low_register',
    name: 'Registro Grave / Sub Bass (Fundação)',
    desc: 'Oitavas mais baixas (C1 a C3), gerando fundação pesada de synth bass ou baixos de piano.',
    promptTag: 'low-register sub-bass foundation, deep resonant fundamentals, commanding low-end punch'
  },
  {
    id: 'high_register',
    name: 'Registro Agudo / Lead & Bells (Destaque)',
    desc: 'Oitavas altas (C5 a C7), garantindo solos cortantes, sinos e melodias brilhantes que flutuam no topo.',
    promptTag: 'upper-register crystalline melodic lead, shimmering top-octave bell chime and melodic highlight'
  }
];

// CARÁTER TÍMBRICO & TEXTURAS
export const KEYBOARD_TIMBRES = [
  {
    id: 'warm_vintage',
    name: 'Quente & Vintage (Velvet Analog)',
    desc: 'Médios aveludados, graves redondos e atenuação suave de agudos duros.',
    promptTag: 'warm vintage analog character, smooth harmonic roundness, silky tape-like highs'
  },
  {
    id: 'bright_cutting',
    name: 'Brilhante & Definido (Modern Cut)',
    desc: 'Agudos abertos e cristalinos com presença frontal para destacar o instrumento na mixagem.',
    promptTag: 'bright cutting presence, crisp definition, sparkling transient brilliance'
  },
  {
    id: 'dark_intimate',
    name: 'Escuro & Intimista (Moody)',
    desc: 'Timbre fechado, introspectivo, melancólico e acolhedor.',
    promptTag: 'dark moody timbre, intimate muted tone, mysterious deep emotional weight'
  },
  {
    id: 'felt_cinematic',
    name: 'Feltro & Cinematográfico (Tender)',
    desc: 'Amortecido por feltro com ruídos de madeira e mecânica audíveis.',
    promptTag: 'felt-dampened cinematic tone, whispering soft hammer textures, delicate fragility'
  },
  {
    id: 'fat_resonant',
    name: 'Gordo & Ressonante (Moog Ladder)',
    desc: 'O clássico filtro analógico com ressonância que ronca nos graves e canta nos médios.',
    promptTag: 'fat resonant analog body, singing filter sweep overtones, rich saturated harmonics'
  },
  {
    id: 'crystal_fm',
    name: 'Cristalino & Metálico (Digital FM)',
    desc: 'Harmônicos metálicos puros de síntese FM com ataque pontiagudo de sino.',
    promptTag: 'crystalline FM bell harmonics, pure pristine digital sheen, glassy shimmer'
  },
  {
    id: 'shimmer_ethereal',
    name: 'Etéreo & Shimmer (Floating Pad)',
    desc: 'Camadas celestiais de oitavas superiores com reverb difuso e sensação de espaço infinito.',
    promptTag: 'ethereal floating shimmer textures, dreamy ambient space, celestial harmonic trails'
  },
  {
    id: 'gritty_overdrive',
    name: 'Saturado & Valvulado (Tube Drive)',
    desc: 'Saturação quente de pré-amplificador a válvula, adicionando sujeira e personalidade.',
    promptTag: 'gritty tube overdrive saturation, warm harmonic distortion bite, analog edge'
  }
];

// FUNÇÃO MUSICAL NO ARRANJO
export const KEYBOARD_ROLES = [
  {
    id: 'chordal_accompaniment',
    name: 'Acompanhamento Harmônico (Base)',
    desc: 'Condução harmônica sólida em acordes, sustentando o cantor e a dinâmica da canção.',
    promptTag: 'serving as essential chordal accompaniment, solid foundational harmonic backing'
  },
  {
    id: 'background_pad',
    name: 'Pad de Fundo & Ambiência',
    desc: 'Camada sutil no estéreo que cola todos os instrumentos sem chamar a atenção para si.',
    promptTag: 'providing smooth background ambient pad harmony, lush glue filling the stereo image'
  },
  {
    id: 'synth_bass_riff',
    name: 'Linha de Baixo / Synth Bass Riff',
    desc: 'O teclado assume a função de contrabaixo com groove analógico e peso monolítico.',
    promptTag: 'commanding the groove with a heavy punchy synth bass riff, anchoring the rhythm section'
  },
  {
    id: 'melodic_lead',
    name: 'Solo Principal / Melodia Líder',
    desc: 'Voz solista em primeiro plano com frases marcantes e virtuosismo.',
    promptTag: 'taking center stage with an expressive soaring melodic solo lead, focal instrument lead'
  },
  {
    id: 'rhythmic_arpeggio',
    name: 'Arpejo Rítmico Hipnótico',
    desc: 'Padrão arpejado em colcheias ou semicolcheias que impulsiona o andamento.',
    promptTag: 'propelling momentum with a hypnotic repeating arpeggiated motif'
  },
  {
    id: 'funky_groove_comp',
    name: 'Riff Percussivo / Funk Groove',
    desc: 'Ataques sincopados e rítmicos que dividem espaço com a bateria e percussão.',
    promptTag: 'driving a syncopated funky groove with percussive rhythmic comping and rhythmic punch'
  },
  {
    id: 'cinematic_soundscape',
    name: 'Cenário Sonoro Cinematográfico',
    desc: 'Texturas evolutivas, notas isoladas cheias de reverberação para evocar emoção pura.',
    promptTag: 'weaving an evocative cinematic soundscape with deep narrative emotional storytelling'
  },
  {
    id: 'call_and_response',
    name: 'Resposta Gospel / Fraseados (Call & Response)',
    desc: 'O órgão ou piano responde às frases do cantor com licks rápidos e acordes tensos.',
    promptTag: 'dynamic call-and-response gospel organ phrases answering vocal lines with rich emotion'
  }
];

// EFEITOS & PROCESSAMENTO DE ESTÚDIO
export const KEYBOARD_EFFECTS = [
  {
    id: 'leslie_rotary',
    name: 'Gabinete Leslie Rotativo',
    category: 'Modulação',
    desc: 'Caixa acústica rotativa valvulada com aceleração de rotor físico e efeito Doppler espetacular.',
    promptTag: 'classic Leslie rotating horn cabinet modulation with warm vintage tube swirl'
  },
  {
    id: 'analog_chorus',
    name: 'Chorus Estéreo Analógico (Juno)',
    category: 'Modulação',
    desc: 'O consagrado circuito BBD de chorus estéreo da Roland que transforma qualquer som em uma nuvem ampla.',
    promptTag: 'lush vintage analog stereo chorus, wide rich BBD chorus dimension'
  },
  {
    id: 'tape_saturation',
    name: 'Saturação de Fita & Válvula',
    category: 'Dinâmica & Cor',
    desc: 'Calor de gravador de rolo analógico (Tape Saturation) que amacia transientes e encorpa os graves.',
    promptTag: 'warm 1/2-inch reel-to-reel analog tape saturation and tube harmonic warmth'
  },
  {
    id: 'stereo_phaser',
    name: 'Phaser Estéreo / Auto-Pan',
    category: 'Modulação',
    desc: 'Varredura de fase analógica suave de 4 a 8 estágios com movimento panorâmico estéreo.',
    promptTag: 'sweeping analog stereo phaser modulation, gentle binaural auto-pan movement'
  },
  {
    id: 'hall_reverb',
    name: 'Reverb Hall de Estúdio (Lexicon)',
    category: 'Espaço',
    desc: 'Reverberação nobre de concerto com cauda densa de 2.5 segundos que traz espacialidade tridimensional.',
    promptTag: 'luxurious studio concert hall reverb with pristine expansive stereo decay'
  },
  {
    id: 'analog_delay',
    name: 'Analog Tape Delay (Eco de Fita)',
    category: 'Tempo',
    desc: 'Repetições musicais em semínima pontuada com degradação quente e orgânica a cada eco.',
    promptTag: 'warm vintage analog tape delay with dotted-eighth rhythmic echoes and organic decay'
  },
  {
    id: 'studio_compressor',
    name: 'Compressor Óptico de Estúdio (LA-2A)',
    category: 'Dinâmica',
    desc: 'Controle transparente de dinâmica que une as notas, dá sustentação e uniformidade.',
    promptTag: 'smooth studio optical compression, balanced dynamic sustain, tight polished level control'
  },
  {
    id: 'resonant_lpf',
    name: 'Filtro Passa-Baixa Ressonante (LPF)',
    category: 'Filtro',
    desc: 'Filtro analógico de 24dB com controle dinâmico de abertura para dar movimento expressivo.',
    promptTag: 'dynamic resonant 24dB low-pass filter sweeps, organic frequency modulation'
  },
  {
    id: 'funk_wah',
    name: 'Envelope Filter / Auto-Wah',
    category: 'Filtro',
    desc: 'Filtro que reage à força do toque criando o clássico "quack" percussivo funk.',
    promptTag: 'funky envelope-controlled auto-wah filter, snappy dynamic quack response'
  }
];

// PRESETS DE ESTÚDIO PRONTOS (REFERÊNCIAS HISTÓRICAS E MODERNAS)
export const KEYBOARD_PRESETS = [
  {
    id: 'steinway_concert_master',
    name: 'Steinway Grand de Concerto & Jazz',
    badge: 'Concerto Clássico & Jazz',
    desc: 'Piano de cauda nobre com toque expressivo, reverberação de sala de concerto e compressão óptica transparente.',
    instrumentId: 'steinway_grand',
    techniqueId: 'expressive_dynamic',
    registerId: 'full_range',
    timbreId: 'warm_vintage',
    roleId: 'chordal_accompaniment',
    effects: ['studio_compressor', 'hall_reverb']
  },
  {
    id: 'felt_piano_cinema_lofi',
    name: 'Intimate Felt Piano Cinematográfico',
    badge: 'Cinema, Indie & Lo-Fi',
    desc: 'Martelos amortecidos por feltro, toque aveludado e saturação de fita: pura intimidade e melancolia.',
    instrumentId: 'felt_piano',
    techniqueId: 'soft_felt_attack',
    registerId: 'mid_register',
    timbreId: 'felt_cinematic',
    roleId: 'cinematic_soundscape',
    effects: ['tape_saturation', 'hall_reverb']
  },
  {
    id: 'rhodes_neo_soul_velvet',
    name: 'Fender Rhodes Neo-Soul & Velvet Groove',
    badge: 'Neo-Soul & R&B',
    desc: 'Rhodes aveludado com sino metálico sutil, phaser estéreo suave, levada harmônica e saturação analógica.',
    instrumentId: 'fender_rhodes',
    techniqueId: 'expressive_dynamic',
    registerId: 'mid_register',
    timbreId: 'warm_vintage',
    roleId: 'chordal_accompaniment',
    effects: ['stereo_phaser', 'tape_saturation', 'hall_reverb']
  },
  {
    id: 'wurlitzer_vintage_drive',
    name: 'Wurlitzer 200A Rock & Soul Overdrive',
    badge: 'Classic Rock & Soul',
    desc: 'Palhetas elétricas do Wurlitzer com mordida rústica de drive valvulado e ataque percussivo.',
    instrumentId: 'wurlitzer',
    techniqueId: 'punchy_staccato',
    registerId: 'mid_register',
    timbreId: 'gritty_overdrive',
    roleId: 'chordal_accompaniment',
    effects: ['tape_saturation', 'studio_compressor']
  },
  {
    id: 'stevie_funky_clavinet',
    name: 'Stevie Wonder Funky Clavinet D6',
    badge: 'Funk, Soul & Disco',
    desc: 'O estalo inconfundível de cordas beliscadas com envelope filter auto-wah e grooves sincopados.',
    instrumentId: 'clavinet_d6',
    techniqueId: 'funk_clav_comping',
    registerId: 'mid_register',
    timbreId: 'bright_cutting',
    roleId: 'funky_groove_comp',
    effects: ['funk_wah', 'studio_compressor']
  },
  {
    id: 'hammond_b3_gospel_leslie',
    name: 'Hammond B3 Gospel & Blues Leslie',
    badge: 'Gospel, Blues & Rock',
    desc: 'Órgão B3 com gabinete Leslie rotativo em aceleração, overdrive valvulado e resposta harmônica viva.',
    instrumentId: 'hammond_b3',
    techniqueId: 'leslie_speed_transitions',
    registerId: 'full_range',
    timbreId: 'gritty_overdrive',
    roleId: 'call_and_response',
    effects: ['leslie_rotary', 'tape_saturation']
  },
  {
    id: 'minimoog_fat_bass',
    name: 'Minimoog Model D Fat Analog Bassline',
    badge: 'Funk, Synthwave & Trap',
    desc: 'Monstro dos graves analógicos com filtro ladder ressonante fechado, peso sub-grave e pegada rítmica.',
    instrumentId: 'minimoog_d',
    techniqueId: 'punchy_staccato',
    registerId: 'low_register',
    timbreId: 'fat_resonant',
    roleId: 'synth_bass_riff',
    effects: ['resonant_lpf', 'tape_saturation']
  },
  {
    id: 'juno_106_80s_dream_pad',
    name: 'Roland Juno-106 80s Dream Pad',
    badge: '80s Synthpop & Synthwave',
    desc: 'Pads aveludados com chorus estéreo Roland clássico, cauda longa sustentada e espacialidade nostálgica.',
    instrumentId: 'roland_juno_106',
    techniqueId: 'sustained_chords',
    registerId: 'mid_register',
    timbreId: 'warm_vintage',
    roleId: 'background_pad',
    effects: ['analog_chorus', 'hall_reverb']
  },
  {
    id: 'dx7_ballad_epiano',
    name: 'Yamaha DX7 80s Power Ballad EP',
    badge: '80s Pop & Power Ballad',
    desc: 'O famoso piano elétrico FM de Whitney Houston e Chicago, cheio de brilho cristalino e chorus.',
    instrumentId: 'yamaha_dx7_epiano',
    techniqueId: 'expressive_dynamic',
    registerId: 'full_range',
    timbreId: 'crystal_fm',
    roleId: 'chordal_accompaniment',
    effects: ['analog_chorus', 'hall_reverb', 'studio_compressor']
  },
  {
    id: 'korg_m1_90s_house_piano',
    name: 'Korg M1 90s Club House Piano',
    badge: 'House 90s & Eurodance',
    desc: 'O piano percussivo e brilhante que definiu o nascimento do House e Dance music nos anos 90.',
    instrumentId: 'korg_m1',
    techniqueId: 'punchy_staccato',
    registerId: 'mid_register',
    timbreId: 'bright_cutting',
    roleId: 'chordal_accompaniment',
    effects: ['studio_compressor', 'hall_reverb']
  },
  {
    id: 'jupiter8_epic_brass_lead',
    name: 'Roland Jupiter-8 Epic Poly Brass',
    badge: 'Arena Synth & 80s Rock',
    desc: 'Oitenta vozes analógicas majestosas com synth brass cortante, oitavas abertas e reverb espaçoso.',
    instrumentId: 'roland_jupiter_8',
    techniqueId: 'punchy_staccato',
    registerId: 'full_range',
    timbreId: 'bright_cutting',
    roleId: 'melodic_lead',
    effects: ['analog_chorus', 'hall_reverb']
  },
  {
    id: 'prophet_blade_runner_lead',
    name: 'Vangelis CS-80 / Prophet Blade Runner Lead',
    badge: 'Sci-Fi & Cinema Hero',
    desc: 'Solo sintetizado monumental com portamento analógico, modulação rica e delay quente.',
    instrumentId: 'prophet_5',
    techniqueId: 'legato_portamento',
    registerId: 'high_register',
    timbreId: 'warm_vintage',
    roleId: 'melodic_lead',
    effects: ['analog_delay', 'hall_reverb', 'analog_chorus']
  },
  {
    id: 'nord_stage_pop_worship',
    name: 'Nord Stage Modern Pop & Worship',
    badge: 'Modern Pop & Worship',
    desc: 'Piano de cauda moderno em camadas com pad etéreo de sintetizador e reverberação ampla de estúdio.',
    instrumentId: 'nord_stage_modern',
    techniqueId: 'expressive_dynamic',
    registerId: 'full_range',
    timbreId: 'shimmer_ethereal',
    roleId: 'chordal_accompaniment',
    effects: ['studio_compressor', 'hall_reverb', 'analog_chorus']
  },
  {
    id: 'cathedral_pipe_organ_epic',
    name: 'Cathedral Pipe Organ Épico Sacro',
    badge: 'Sinfônico, Sacro & Interstellar',
    desc: 'Órgão de tubos monumental em catedral de pedra, graves rugindo e grandeza solene.',
    instrumentId: 'church_pipe_organ',
    techniqueId: 'sustained_chords',
    registerId: 'full_range',
    timbreId: 'dark_intimate',
    roleId: 'cinematic_soundscape',
    effects: ['hall_reverb']
  }
];

/**
 * Constrói a cadeia de prompt estruturada do teclado para Suno / Udio
 * Estrutura: Instrumento/Modelo -> Caráter de Timbre -> Técnica/Ataque -> Registro -> Efeitos -> Função Musical
 */
export function buildKeyboardPrompt(rig) {
  if (!rig) return '';

  const instrument = KEYBOARD_INSTRUMENTS.find(i => i.id === rig.instrumentId) || KEYBOARD_INSTRUMENTS[0];
  const technique = KEYBOARD_TECHNIQUES.find(t => t.id === rig.techniqueId);
  const register = KEYBOARD_REGISTERS.find(r => r.id === rig.registerId);
  const timbre = KEYBOARD_TIMBRES.find(tb => tb.id === rig.timbreId);
  const role = KEYBOARD_ROLES.find(ro => ro.id === rig.roleId);

  const activeEffects = (rig.effects || [])
    .map(effId => KEYBOARD_EFFECTS.find(e => e.id === effId))
    .filter(Boolean);

  const parts = [];

  // 1. Instrumento / Modelo Principal
  parts.push(instrument.promptTag);

  // 2. Caráter Tímbrico
  if (timbre) parts.push(timbre.promptTag);

  // 3. Técnica & Ataque
  if (technique) parts.push(technique.promptTag);

  // 4. Registro / Oitava
  if (register && register.id !== 'full_range') parts.push(register.promptTag);

  // 5. Efeitos de Estúdio
  if (activeEffects.length > 0) {
    parts.push(activeEffects.map(e => e.promptTag).join(', '));
  }

  // 6. Função Musical no Arranjo
  if (role) parts.push(role.promptTag);

  return parts.join(', ');
}

/**
 * Constrói metatag estrutural de letra para Suno / Udio
 */
export function buildKeyboardLyricsTag(rig, tagType = 'intro') {
  const instrument = KEYBOARD_INSTRUMENTS.find(i => i.id === rig?.instrumentId) || KEYBOARD_INSTRUMENTS[0];
  const technique = KEYBOARD_TECHNIQUES.find(t => t.id === rig?.techniqueId);
  const techStr = technique ? ` ${technique.name.split(' ')[0]}` : '';

  const isOrgan = instrument.category === 'organs';
  const isSynth = instrument.category === 'analog_synths' || instrument.category === 'digital_synths';

  const typeName = isOrgan ? 'Organ' : isSynth ? 'Synth' : 'Piano';

  if (tagType === 'intro') {
    return `[${typeName} Intro: ${instrument.shortName}${techStr}]`;
  }
  if (tagType === 'solo') {
    return `[${typeName} Solo: ${instrument.shortName}]`;
  }
  if (tagType === 'breakdown') {
    return `[${typeName} Breakdown: ${instrument.shortName} Ambient Chords]`;
  }
  return `[${typeName}: ${instrument.shortName}]`;
}
