const fs = require('fs');

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const flats = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
const sharpToFlatDisplay = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'F#', 'G#': 'Ab', 'A#': 'Bb' };

function getNoteIndex(note) {
  if (flats[note]) return notes.indexOf(flats[note]);
  return notes.indexOf(note);
}

function getNoteStr(index, preferred) {
  index = index % 12;
  const note = notes[index];
  if (preferred === 'flat' && sharpToFlatDisplay[note]) return sharpToFlatDisplay[note];
  return note;
}

const map = {};

const ALL_KEYS = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
  'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'
];

for (const key of ALL_KEYS) {
  const isMinor = key.endsWith('m');
  const rootStr = isMinor ? key.slice(0, -1) : key;
  const rootIdx = getNoteIndex(rootStr);
  const pref = (rootStr.includes('b') || rootStr === 'F') ? 'flat' : 'sharp';
  
  if (isMinor) {
    // Minor scale offsets: 0, 2, 3, 5, 7, 8, 10
    map[key] = {
      'I': getNoteStr(rootIdx, pref) + 'm', // i
      'V': getNoteStr(rootIdx + 7, pref) + 'm', // v
      'vi': getNoteStr(rootIdx + 8, pref), // VI
      'IV': getNoteStr(rootIdx + 5, pref) + 'm', // iv
      
      'ii': getNoteStr(rootIdx + 2, pref) + 'dim', // ii°
      
      'Imaj7': getNoteStr(rootIdx, pref) + 'm7', // Treat Imaj7 as im7 for minor
      'IVmaj7': getNoteStr(rootIdx + 5, pref) + 'm7', // Treat IVmaj7 as ivm7
      
      'i': getNoteStr(rootIdx, pref) + 'm',
      'III': getNoteStr(rootIdx + 3, pref),
      // In grunge, usually IV is played major even in minor keys
      'IV_GRUNGE': getNoteStr(rootIdx + 5, pref)
    };
  } else {
    // Major scale offsets: 0, 2, 4, 5, 7, 9, 11
    map[key] = {
      'I': getNoteStr(rootIdx, pref),
      'V': getNoteStr(rootIdx + 7, pref),
      'vi': getNoteStr(rootIdx + 9, pref) + 'm',
      'IV': getNoteStr(rootIdx + 5, pref),
      
      'ii': getNoteStr(rootIdx + 2, pref) + 'm',
      
      'Imaj7': getNoteStr(rootIdx, pref) + 'maj7',
      'IVmaj7': getNoteStr(rootIdx + 5, pref) + 'maj7',
      
      'i': getNoteStr(rootIdx, pref) + 'm',
      'III': getNoteStr(rootIdx + 4, pref),
      'IV_GRUNGE': getNoteStr(rootIdx + 5, pref)
    };
  }
}

fs.writeFileSync('C:/Users/admin/Desktop/maestro-studio-pro/chord_map.json', JSON.stringify(map, null, 2));
