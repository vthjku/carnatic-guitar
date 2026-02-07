// ============================================
// Carnatic Guitar Scale Finder
// ============================================

// Western note names (chromatic scale)
const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Guitar string tuning (standard) - from high E to low E
const GUITAR_STRINGS = [
    { name: 'e', note: 'E', octave: 4 },  // High E
    { name: 'B', note: 'B', octave: 3 },
    { name: 'G', note: 'G', octave: 3 },
    { name: 'D', note: 'D', octave: 3 },
    { name: 'A', note: 'A', octave: 2 },
    { name: 'E', note: 'E', octave: 2 }   // Low E
];

const NUM_FRETS = 15;

// Swara to semitone mapping (from Sa)
// In Carnatic music, there are 16 swarasthanas but 12 notes (some swaras share positions)
const SWARA_SEMITONES = {
    'S': 0,      // Shadjam (Sa)
    'R1': 1,     // Shuddha Rishabham
    'R2': 2,     // Chatushruti Rishabham 
    'R3': 3,     // Shatshruti Rishabham (= G2)
    'G1': 2,     // Shuddha Gandharam (= R2)
    'G2': 3,     // Sadharana Gandharam (= R3)
    'G3': 4,     // Antara Gandharam
    'M1': 5,     // Shuddha Madhyamam
    'M2': 6,     // Prati Madhyamam
    'P': 7,      // Panchamam (Pa)
    'D1': 8,     // Shuddha Dhaivatam
    'D2': 9,     // Chatushruti Dhaivatam
    'D3': 10,    // Shatshruti Dhaivatam (= N2)
    'N1': 9,     // Shuddha Nishadam (= D2)
    'N2': 10,    // Kaisiki Nishadam (= D3)
    'N3': 11     // Kakali Nishadam
};

// Swara display names
const SWARA_DISPLAY = {
    'S': 'Sa', 'R1': 'Ri₁', 'R2': 'Ri₂', 'R3': 'Ri₃',
    'G1': 'Ga₁', 'G2': 'Ga₂', 'G3': 'Ga₃',
    'M1': 'Ma₁', 'M2': 'Ma₂', 'P': 'Pa',
    'D1': 'Da₁', 'D2': 'Da₂', 'D3': 'Da₃',
    'N1': 'Ni₁', 'N2': 'Ni₂', 'N3': 'Ni₃'
};

// Swara to CSS class mapping
const SWARA_CLASS = {
    'S': 'sa', 'R1': 'ri', 'R2': 'ri', 'R3': 'ri',
    'G1': 'ga', 'G2': 'ga', 'G3': 'ga',
    'M1': 'ma', 'M2': 'ma', 'P': 'pa',
    'D1': 'da', 'D2': 'da', 'D3': 'da',
    'N1': 'ni', 'N2': 'ni', 'N3': 'ni'
};

// Chakra system for Melakarta ragas
const CHAKRAS = [
    'Indu', 'Netra', 'Agni', 'Veda', 'Bana', 'Rutu',
    'Rishi', 'Vasu', 'Brahma', 'Disi', 'Rudra', 'Aditya'
];

// ============================================
// Complete Melakarta Raga Database (72 ragas)
// ============================================
const MELAKARTA_RAGAS = [
    // Chakra 1: Indu (R1, G1)
    { number: 1, name: 'Kanakangi', arohanam: ['S', 'R1', 'G1', 'M1', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M1', 'G1', 'R1', 'S'] },
    { number: 2, name: 'Ratnangi', arohanam: ['S', 'R1', 'G1', 'M1', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G1', 'R1', 'S'] },
    { number: 3, name: 'Ganamurti', arohanam: ['S', 'R1', 'G1', 'M1', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M1', 'G1', 'R1', 'S'] },
    { number: 4, name: 'Vanaspati', arohanam: ['S', 'R1', 'G1', 'M1', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G1', 'R1', 'S'] },
    { number: 5, name: 'Manavati', arohanam: ['S', 'R1', 'G1', 'M1', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M1', 'G1', 'R1', 'S'] },
    { number: 6, name: 'Tanarupi', arohanam: ['S', 'R1', 'G1', 'M1', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M1', 'G1', 'R1', 'S'] },

    // Chakra 2: Netra (R1, G2)
    { number: 7, name: 'Senavati', arohanam: ['S', 'R1', 'G2', 'M1', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M1', 'G2', 'R1', 'S'] },
    { number: 8, name: 'Hanumatodi', arohanam: ['S', 'R1', 'G2', 'M1', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G2', 'R1', 'S'] },
    { number: 9, name: 'Dhenuka', arohanam: ['S', 'R1', 'G2', 'M1', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M1', 'G2', 'R1', 'S'] },
    { number: 10, name: 'Natakapriya', arohanam: ['S', 'R1', 'G2', 'M1', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G2', 'R1', 'S'] },
    { number: 11, name: 'Kokilapriya', arohanam: ['S', 'R1', 'G2', 'M1', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M1', 'G2', 'R1', 'S'] },
    { number: 12, name: 'Rupavati', arohanam: ['S', 'R1', 'G2', 'M1', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M1', 'G2', 'R1', 'S'] },

    // Chakra 3: Agni (R1, G3)
    { number: 13, name: 'Gayakapriya', arohanam: ['S', 'R1', 'G3', 'M1', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M1', 'G3', 'R1', 'S'] },
    { number: 14, name: 'Vakulabharanam', arohanam: ['S', 'R1', 'G3', 'M1', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G3', 'R1', 'S'] },
    { number: 15, name: 'Mayamalavagowla', arohanam: ['S', 'R1', 'G3', 'M1', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M1', 'G3', 'R1', 'S'] },
    { number: 16, name: 'Chakravakam', arohanam: ['S', 'R1', 'G3', 'M1', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G3', 'R1', 'S'] },
    { number: 17, name: 'Suryakantam', arohanam: ['S', 'R1', 'G3', 'M1', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M1', 'G3', 'R1', 'S'] },
    { number: 18, name: 'Hatakambari', arohanam: ['S', 'R1', 'G3', 'M1', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M1', 'G3', 'R1', 'S'] },

    // Chakra 4: Veda (R2, G2)
    { number: 19, name: 'Jhankaradhwani', arohanam: ['S', 'R2', 'G2', 'M1', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M1', 'G2', 'R2', 'S'] },
    { number: 20, name: 'Natabhairavi', arohanam: ['S', 'R2', 'G2', 'M1', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G2', 'R2', 'S'] },
    { number: 21, name: 'Keeravani', arohanam: ['S', 'R2', 'G2', 'M1', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M1', 'G2', 'R2', 'S'] },
    { number: 22, name: 'Kharaharapriya', arohanam: ['S', 'R2', 'G2', 'M1', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G2', 'R2', 'S'] },
    { number: 23, name: 'Gourimanohari', arohanam: ['S', 'R2', 'G2', 'M1', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M1', 'G2', 'R2', 'S'] },
    { number: 24, name: 'Varunapriya', arohanam: ['S', 'R2', 'G2', 'M1', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M1', 'G2', 'R2', 'S'] },

    // Chakra 5: Bana (R2, G3)
    { number: 25, name: 'Mararanjani', arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M1', 'G3', 'R2', 'S'] },
    { number: 26, name: 'Charukesi', arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G3', 'R2', 'S'] },
    { number: 27, name: 'Sarasangi', arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M1', 'G3', 'R2', 'S'] },
    { number: 28, name: 'Harikambhoji', arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G3', 'R2', 'S'] },
    { number: 29, name: 'Dheerasankarabharanam', arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M1', 'G3', 'R2', 'S'] },
    { number: 30, name: 'Naganandini', arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M1', 'G3', 'R2', 'S'] },

    // Chakra 6: Rutu (R3, G3)
    { number: 31, name: 'Yagapriya', arohanam: ['S', 'R3', 'G3', 'M1', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M1', 'G3', 'R3', 'S'] },
    { number: 32, name: 'Ragavardhini', arohanam: ['S', 'R3', 'G3', 'M1', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G3', 'R3', 'S'] },
    { number: 33, name: 'Gangeyabhushani', arohanam: ['S', 'R3', 'G3', 'M1', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M1', 'G3', 'R3', 'S'] },
    { number: 34, name: 'Vagadheeswari', arohanam: ['S', 'R3', 'G3', 'M1', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G3', 'R3', 'S'] },
    { number: 35, name: 'Shulini', arohanam: ['S', 'R3', 'G3', 'M1', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M1', 'G3', 'R3', 'S'] },
    { number: 36, name: 'Chalanata', arohanam: ['S', 'R3', 'G3', 'M1', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M1', 'G3', 'R3', 'S'] },

    // Chakra 7: Rishi (R1, G1, M2) - Prati Madhyama ragas
    { number: 37, name: 'Salagam', arohanam: ['S', 'R1', 'G1', 'M2', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M2', 'G1', 'R1', 'S'] },
    { number: 38, name: 'Jalarnavam', arohanam: ['S', 'R1', 'G1', 'M2', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M2', 'G1', 'R1', 'S'] },
    { number: 39, name: 'Jhalavarali', arohanam: ['S', 'R1', 'G1', 'M2', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M2', 'G1', 'R1', 'S'] },
    { number: 40, name: 'Navaneetam', arohanam: ['S', 'R1', 'G1', 'M2', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M2', 'G1', 'R1', 'S'] },
    { number: 41, name: 'Pavani', arohanam: ['S', 'R1', 'G1', 'M2', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M2', 'G1', 'R1', 'S'] },
    { number: 42, name: 'Raghupriya', arohanam: ['S', 'R1', 'G1', 'M2', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M2', 'G1', 'R1', 'S'] },

    // Chakra 8: Vasu (R1, G2, M2)
    { number: 43, name: 'Gavambodhi', arohanam: ['S', 'R1', 'G2', 'M2', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M2', 'G2', 'R1', 'S'] },
    { number: 44, name: 'Bhavapriya', arohanam: ['S', 'R1', 'G2', 'M2', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M2', 'G2', 'R1', 'S'] },
    { number: 45, name: 'Shubhapantuvarali', arohanam: ['S', 'R1', 'G2', 'M2', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M2', 'G2', 'R1', 'S'] },
    { number: 46, name: 'Shadvidhamargini', arohanam: ['S', 'R1', 'G2', 'M2', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M2', 'G2', 'R1', 'S'] },
    { number: 47, name: 'Suvarnangi', arohanam: ['S', 'R1', 'G2', 'M2', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M2', 'G2', 'R1', 'S'] },
    { number: 48, name: 'Divyamani', arohanam: ['S', 'R1', 'G2', 'M2', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M2', 'G2', 'R1', 'S'] },

    // Chakra 9: Brahma (R1, G3, M2)
    { number: 49, name: 'Dhavalambari', arohanam: ['S', 'R1', 'G3', 'M2', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M2', 'G3', 'R1', 'S'] },
    { number: 50, name: 'Namanarayani', arohanam: ['S', 'R1', 'G3', 'M2', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M2', 'G3', 'R1', 'S'] },
    { number: 51, name: 'Kamavardhini', arohanam: ['S', 'R1', 'G3', 'M2', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M2', 'G3', 'R1', 'S'] },
    { number: 52, name: 'Ramapriya', arohanam: ['S', 'R1', 'G3', 'M2', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M2', 'G3', 'R1', 'S'] },
    { number: 53, name: 'Gamanashrama', arohanam: ['S', 'R1', 'G3', 'M2', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M2', 'G3', 'R1', 'S'] },
    { number: 54, name: 'Vishwambhari', arohanam: ['S', 'R1', 'G3', 'M2', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M2', 'G3', 'R1', 'S'] },

    // Chakra 10: Disi (R2, G2, M2)
    { number: 55, name: 'Shamalangi', arohanam: ['S', 'R2', 'G2', 'M2', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M2', 'G2', 'R2', 'S'] },
    { number: 56, name: 'Shanmukhapriya', arohanam: ['S', 'R2', 'G2', 'M2', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M2', 'G2', 'R2', 'S'] },
    { number: 57, name: 'Simhendramadhyamam', arohanam: ['S', 'R2', 'G2', 'M2', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M2', 'G2', 'R2', 'S'] },
    { number: 58, name: 'Hemavati', arohanam: ['S', 'R2', 'G2', 'M2', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M2', 'G2', 'R2', 'S'] },
    { number: 59, name: 'Dharmavati', arohanam: ['S', 'R2', 'G2', 'M2', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M2', 'G2', 'R2', 'S'] },
    { number: 60, name: 'Neetimati', arohanam: ['S', 'R2', 'G2', 'M2', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M2', 'G2', 'R2', 'S'] },

    // Chakra 11: Rudra (R2, G3, M2)
    { number: 61, name: 'Kantamani', arohanam: ['S', 'R2', 'G3', 'M2', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M2', 'G3', 'R2', 'S'] },
    { number: 62, name: 'Rishabhapriya', arohanam: ['S', 'R2', 'G3', 'M2', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M2', 'G3', 'R2', 'S'] },
    { number: 63, name: 'Latangi', arohanam: ['S', 'R2', 'G3', 'M2', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M2', 'G3', 'R2', 'S'] },
    { number: 64, name: 'Vachaspati', arohanam: ['S', 'R2', 'G3', 'M2', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M2', 'G3', 'R2', 'S'] },
    { number: 65, name: 'Mechakalyani', arohanam: ['S', 'R2', 'G3', 'M2', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M2', 'G3', 'R2', 'S'] },
    { number: 66, name: 'Chitrambari', arohanam: ['S', 'R2', 'G3', 'M2', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M2', 'G3', 'R2', 'S'] },

    // Chakra 12: Aditya (R3, G3, M2)
    { number: 67, name: 'Sucharitra', arohanam: ['S', 'R3', 'G3', 'M2', 'P', 'D1', 'N1', 'S'], avarohanam: ['S', 'N1', 'D1', 'P', 'M2', 'G3', 'R3', 'S'] },
    { number: 68, name: 'Jyotiswarupini', arohanam: ['S', 'R3', 'G3', 'M2', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M2', 'G3', 'R3', 'S'] },
    { number: 69, name: 'Dhatuvardhini', arohanam: ['S', 'R3', 'G3', 'M2', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M2', 'G3', 'R3', 'S'] },
    { number: 70, name: 'Nasikabhushani', arohanam: ['S', 'R3', 'G3', 'M2', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M2', 'G3', 'R3', 'S'] },
    { number: 71, name: 'Kosalam', arohanam: ['S', 'R3', 'G3', 'M2', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M2', 'G3', 'R3', 'S'] },
    { number: 72, name: 'Rasikapriya', arohanam: ['S', 'R3', 'G3', 'M2', 'P', 'D3', 'N3', 'S'], avarohanam: ['S', 'N3', 'D3', 'P', 'M2', 'G3', 'R3', 'S'] }
];

// ============================================
// Popular Janya (Derived) Ragas
// ============================================
const JANYA_RAGAS = [
    // Popular pentatonic ragas
    { name: 'Mohanam', parent: 28, arohanam: ['S', 'R2', 'G3', 'P', 'D2', 'S'], avarohanam: ['S', 'D2', 'P', 'G3', 'R2', 'S'] },
    { name: 'Hamsadhwani', parent: 29, arohanam: ['S', 'R2', 'G3', 'P', 'N3', 'S'], avarohanam: ['S', 'N3', 'P', 'G3', 'R2', 'S'] },
    { name: 'Shuddha Saveri', parent: 29, arohanam: ['S', 'R2', 'P', 'D2', 'S'], avarohanam: ['S', 'D2', 'P', 'R2', 'S'] },
    { name: 'Hindolam', parent: 20, arohanam: ['S', 'G2', 'M1', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'M1', 'G2', 'S'] },
    { name: 'Madhyamavati', parent: 22, arohanam: ['S', 'R2', 'M1', 'P', 'N2', 'S'], avarohanam: ['S', 'N2', 'P', 'M1', 'R2', 'S'] },
    { name: 'Shivaranjani', parent: 22, arohanam: ['S', 'R2', 'G2', 'P', 'D2', 'S'], avarohanam: ['S', 'D2', 'P', 'G2', 'R2', 'S'] },
    { name: 'Revati', parent: 22, arohanam: ['S', 'R2', 'M1', 'P', 'N2', 'S'], avarohanam: ['S', 'N2', 'P', 'M1', 'R2', 'S'] },
    { name: 'Abhogi', parent: 22, arohanam: ['S', 'R2', 'G2', 'M1', 'D2', 'S'], avarohanam: ['S', 'D2', 'M1', 'G2', 'R2', 'S'] },

    // Popular hexatonic ragas (Shadava)
    { name: 'Kalyani', parent: 65, arohanam: ['S', 'R2', 'G3', 'M2', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M2', 'G3', 'R2', 'S'] },
    { name: 'Shankarabharanam', parent: 29, arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M1', 'G3', 'R2', 'S'] },
    { name: 'Karaharapriya', parent: 22, arohanam: ['S', 'R2', 'G2', 'M1', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G2', 'R2', 'S'] },
    { name: 'Thodi', parent: 8, arohanam: ['S', 'R1', 'G2', 'M1', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G2', 'R1', 'S'] },
    { name: 'Bhairavi', parent: 20, arohanam: ['S', 'R2', 'G2', 'M1', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G2', 'R2', 'S'] },
    { name: 'Bilahari', parent: 29, arohanam: ['S', 'R2', 'G3', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M1', 'G3', 'R2', 'S'] },
    { name: 'Kedaram', parent: 28, arohanam: ['S', 'M1', 'G3', 'M1', 'P', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'P', 'M1', 'G3', 'R2', 'S'] },
    { name: 'Saveri', parent: 15, arohanam: ['S', 'R1', 'M1', 'P', 'D1', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M1', 'G3', 'R1', 'S'] },

    // More popular ragas
    { name: 'Kambhoji', parent: 28, arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'D2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G3', 'R2', 'S'] },
    { name: 'Behag', parent: 28, arohanam: ['S', 'G3', 'M1', 'P', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G3', 'M1', 'G3', 'R2', 'S'] },
    { name: 'Anandabhairavi', parent: 20, arohanam: ['S', 'G2', 'R2', 'G2', 'M1', 'P', 'D2', 'P', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G2', 'R2', 'S'] },
    { name: 'Begada', parent: 29, arohanam: ['S', 'G3', 'R2', 'G3', 'M1', 'P', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'P', 'M1', 'G3', 'R2', 'S'] },
    { name: 'Atana', parent: 29, arohanam: ['S', 'R2', 'M1', 'P', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'P', 'M1', 'G3', 'R2', 'S'] },
    { name: 'Vasantha', parent: 17, arohanam: ['S', 'M1', 'G3', 'M1', 'D2', 'N3', 'S'], avarohanam: ['S', 'N3', 'D2', 'M1', 'G3', 'R1', 'S'] },
    { name: 'Sahana', parent: 28, arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'M1', 'D2', 'N2', 'S'], avarohanam: ['S', 'N2', 'P', 'M1', 'G3', 'M1', 'R2', 'G3', 'R2', 'S'] },
    { name: 'Yadukulakambhoji', parent: 28, arohanam: ['S', 'R2', 'M1', 'P', 'N2', 'S'], avarohanam: ['S', 'N2', 'D2', 'P', 'M1', 'G3', 'R2', 'S'] },
    { name: 'Amritavarshini', parent: 65, arohanam: ['S', 'G3', 'M2', 'P', 'N3', 'S'], avarohanam: ['S', 'N3', 'P', 'M2', 'G3', 'S'] },
    { name: 'Durga', parent: 29, arohanam: ['S', 'R2', 'M1', 'P', 'D2', 'S'], avarohanam: ['S', 'D2', 'P', 'M1', 'R2', 'S'] },
    { name: 'Malkauns', parent: 20, arohanam: ['S', 'G2', 'M1', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'M1', 'G2', 'S'] },
    { name: 'Charukesi', parent: 26, arohanam: ['S', 'R2', 'G3', 'M1', 'P', 'D1', 'N2', 'S'], avarohanam: ['S', 'N2', 'D1', 'P', 'M1', 'G3', 'R2', 'S'] },
    { name: 'Panthuvarali', parent: 45, arohanam: ['S', 'R1', 'G2', 'M2', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M2', 'G2', 'R1', 'S'] },
    { name: 'Varali', parent: 39, arohanam: ['S', 'R1', 'G1', 'M2', 'P', 'D1', 'N3', 'S'], avarohanam: ['S', 'N3', 'D1', 'P', 'M2', 'G1', 'R1', 'S'] }
];

// ============================================
// Application State
// ============================================
let currentRaga = null;
let rootNote = 'C';
let allRagas = [];

// ============================================
// Utility Functions
// ============================================

/**
 * Get note index in chromatic scale
 */
function getNoteIndex(note) {
    return CHROMATIC_NOTES.indexOf(note);
}

/**
 * Get note name from index (wraps around)
 */
function getNoteName(index) {
    return CHROMATIC_NOTES[((index % 12) + 12) % 12];
}

/**
 * Convert swara to Western note based on root
 */
function swaraToNote(swara, rootNote) {
    const rootIndex = getNoteIndex(rootNote);
    const semitones = SWARA_SEMITONES[swara];
    if (semitones === undefined) return null;
    return getNoteName(rootIndex + semitones);
}

/**
 * Get all notes in a raga (unique swaras only)
 */
function getRagaNotes(raga) {
    const swaras = new Set();
    raga.arohanam.forEach(s => swaras.add(s));
    raga.avarohanam.forEach(s => swaras.add(s));
    return Array.from(swaras);
}

/**
 * Get note at a specific fret on a string
 */
function getNoteAtFret(stringNote, fret) {
    const stringIndex = getNoteIndex(stringNote);
    return getNoteName(stringIndex + fret);
}

/**
 * Check if a note belongs to current raga
 */
function isNoteInRaga(note, raga, rootNote) {
    const ragaSwaras = getRagaNotes(raga);
    for (const swara of ragaSwaras) {
        if (swaraToNote(swara, rootNote) === note) {
            return swara;
        }
    }
    return null;
}

// ============================================
// UI Rendering Functions
// ============================================

/**
 * Initialize the raga database
 */
function initRagas() {
    allRagas = [
        ...MELAKARTA_RAGAS.map(r => ({ ...r, type: 'melakarta' })),
        ...JANYA_RAGAS.map(r => ({ ...r, type: 'janya' }))
    ];
}

/**
 * Render the guitar fretboard
 */
function renderFretboard() {
    const neck = document.getElementById('guitar-neck');
    const fretNumbers = document.getElementById('fret-numbers');

    // Clear existing content
    neck.innerHTML = '';
    fretNumbers.innerHTML = '';

    // Render fret numbers
    for (let fret = 0; fret <= NUM_FRETS; fret++) {
        const fretNum = document.createElement('div');
        fretNum.className = 'fret-number';
        fretNum.textContent = fret === 0 ? '' : fret;
        fretNumbers.appendChild(fretNum);
    }

    // Inlay positions (standard dot positions)
    const inlayFrets = [3, 5, 7, 9, 12, 15];
    const doubleInlayFrets = [12];

    // Render strings
    GUITAR_STRINGS.forEach((string, stringIndex) => {
        const stringRow = document.createElement('div');
        stringRow.className = 'string-row';

        // String name
        const stringName = document.createElement('div');
        stringName.className = 'string-name';
        stringName.textContent = string.name;
        stringRow.appendChild(stringName);

        // Frets container
        const stringFrets = document.createElement('div');
        stringFrets.className = 'string-frets';

        for (let fret = 0; fret <= NUM_FRETS; fret++) {
            const fretCell = document.createElement('div');
            fretCell.className = 'fret-cell';

            if (fret === 0) fretCell.classList.add('nut');

            // Add inlay markers only on middle strings
            if (stringIndex === 2 || stringIndex === 3) {
                if (inlayFrets.includes(fret)) {
                    fretCell.classList.add('inlay');
                }
                if (doubleInlayFrets.includes(fret)) {
                    fretCell.classList.add('double-inlay');
                }
            }

            // Note marker
            const noteMarker = document.createElement('div');
            noteMarker.className = 'note-marker';
            noteMarker.dataset.string = stringIndex;
            noteMarker.dataset.fret = fret;

            fretCell.appendChild(noteMarker);
            stringFrets.appendChild(fretCell);
        }

        stringRow.appendChild(stringFrets);
        neck.appendChild(stringRow);
    });
}

/**
 * Update note markers on fretboard based on selected raga
 */
function updateFretboard() {
    const markers = document.querySelectorAll('.note-marker');

    markers.forEach(marker => {
        const stringIndex = parseInt(marker.dataset.string);
        const fret = parseInt(marker.dataset.fret);
        const stringNote = GUITAR_STRINGS[stringIndex].note;
        const noteAtFret = getNoteAtFret(stringNote, fret);

        // Reset marker
        marker.classList.remove('active', 'sa', 'ri', 'ga', 'ma', 'pa', 'da', 'ni');
        marker.textContent = '';

        if (currentRaga) {
            const swara = isNoteInRaga(noteAtFret, currentRaga, rootNote);
            if (swara) {
                marker.classList.add('active', SWARA_CLASS[swara]);
                marker.textContent = SWARA_DISPLAY[swara];
                marker.title = `${SWARA_DISPLAY[swara]} (${noteAtFret})`;
            }
        }
    });
}

/**
 * Render raga dropdown
 */
function renderRagaDropdown(filter = '', category = 'all') {
    const dropdown = document.getElementById('raga-dropdown');
    dropdown.innerHTML = '';

    let filteredRagas = allRagas;

    // Filter by category
    if (category !== 'all') {
        filteredRagas = filteredRagas.filter(r => r.type === category);
    }

    // Filter by search
    if (filter) {
        const searchLower = filter.toLowerCase();
        filteredRagas = filteredRagas.filter(r =>
            r.name.toLowerCase().includes(searchLower)
        );
    }

    // Render items
    filteredRagas.forEach(raga => {
        const item = document.createElement('div');
        item.className = 'raga-dropdown-item';
        if (currentRaga && currentRaga.name === raga.name) {
            item.classList.add('selected');
        }

        const nameSpan = document.createElement('span');
        nameSpan.textContent = raga.name;
        item.appendChild(nameSpan);

        if (raga.type === 'melakarta') {
            const numSpan = document.createElement('span');
            numSpan.className = 'raga-number';
            numSpan.textContent = `#${raga.number}`;
            item.appendChild(numSpan);
        }

        item.addEventListener('click', () => selectRaga(raga));
        dropdown.appendChild(item);
    });

    dropdown.classList.remove('hidden');
}

/**
 * Select a raga and update UI
 */
function selectRaga(raga) {
    currentRaga = raga;

    // Update search input
    document.getElementById('raga-search').value = raga.name;
    document.getElementById('raga-dropdown').classList.add('hidden');

    // Show raga info
    const ragaInfo = document.getElementById('raga-info');
    ragaInfo.classList.remove('hidden');

    document.getElementById('raga-name').textContent = raga.name;

    const ragaType = document.getElementById('raga-type');
    ragaType.textContent = raga.type === 'melakarta' ? `Melakarta #${raga.number}` : 'Janya';
    ragaType.className = `raga-badge ${raga.type}`;

    // Render arohanam and avarohanam
    renderScaleNotes('arohanam', raga.arohanam);
    renderScaleNotes('avarohanam', raga.avarohanam);

    // Update fretboard
    updateFretboard();

    // Update legend
    updateLegend();
}

/**
 * Render scale notes (arohanam/avarohanam)
 */
function renderScaleNotes(elementId, swaras) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    swaras.forEach(swara => {
        const swaraSpan = document.createElement('span');
        swaraSpan.className = `swara ${SWARA_CLASS[swara]}`;
        swaraSpan.textContent = SWARA_DISPLAY[swara];
        swaraSpan.style.borderColor = `var(--swara-${SWARA_CLASS[swara]})`;
        container.appendChild(swaraSpan);
    });
}

/**
 * Update the swara legend based on current raga
 */
function updateLegend() {
    const legendItems = document.getElementById('legend-items');
    legendItems.innerHTML = '';

    if (!currentRaga) return;

    const swaras = getRagaNotes(currentRaga);
    const orderedSwaras = ['S', 'R1', 'R2', 'R3', 'G1', 'G2', 'G3', 'M1', 'M2', 'P', 'D1', 'D2', 'D3', 'N1', 'N2', 'N3'];

    orderedSwaras.forEach(swara => {
        if (swaras.includes(swara)) {
            const item = document.createElement('div');
            item.className = 'legend-item';

            const dot = document.createElement('div');
            dot.className = `legend-dot ${SWARA_CLASS[swara]}`;
            dot.textContent = SWARA_DISPLAY[swara].charAt(0) + (SWARA_DISPLAY[swara].charAt(2) || '');

            const text = document.createElement('div');
            text.className = 'legend-text';
            text.innerHTML = `${SWARA_DISPLAY[swara]} <span>${swaraToNote(swara, rootNote)}</span>`;

            item.appendChild(dot);
            item.appendChild(text);
            legendItems.appendChild(item);
        }
    });
}

// ============================================
// Event Listeners
// ============================================

function initEventListeners() {
    // Raga search input
    const ragaSearch = document.getElementById('raga-search');
    const ragaDropdown = document.getElementById('raga-dropdown');
    const ragaCategory = document.getElementById('raga-category');
    const rootNoteSelect = document.getElementById('root-note');

    ragaSearch.addEventListener('focus', () => {
        renderRagaDropdown(ragaSearch.value, ragaCategory.value);
    });

    ragaSearch.addEventListener('input', (e) => {
        renderRagaDropdown(e.target.value, ragaCategory.value);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            ragaDropdown.classList.add('hidden');
        }
    });

    // Category filter
    ragaCategory.addEventListener('change', (e) => {
        renderRagaDropdown(ragaSearch.value, e.target.value);
    });

    // Root note change
    rootNoteSelect.addEventListener('change', (e) => {
        rootNote = e.target.value;
        updateFretboard();
        updateLegend();
    });
}

// ============================================
// Initialization
// ============================================

function init() {
    initRagas();
    renderFretboard();
    initEventListeners();

    // Select a default raga to showcase
    const defaultRaga = allRagas.find(r => r.name === 'Mohanam');
    if (defaultRaga) {
        selectRaga(defaultRaga);
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
