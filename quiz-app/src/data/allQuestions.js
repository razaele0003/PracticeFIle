import { quizData } from './quizData';
import { eceLawModule1Data } from './eceLawModule1';
import { eceLawModule2Data } from './eceLawModule2';
import { eceLawModule4_3Data } from './eceLawModule4_3';
import { eceLawModule4_4Data } from './eceLawModule4_4';

// Stamp the set label on RA 9292 questions (avoids editing 110 individual objects)
const ra9292 = quizData.map(q => ({
  ...q,
  id: `ra9292_${q.id}`,
  set: 'RA 9292 - Electronics Engineering Law',
}));

// ECE Law Module 1 — set labels already baked in
const eclm1 = eceLawModule1Data.map(q => ({ ...q, id: `ecl1_${q.id}` }));

// ECE Law Module 2 — set labels already baked in
const eclm2 = eceLawModule2Data.map(q => ({ ...q, id: `ecl2_${q.id}` }));

// ECE Law Module 4.3 — set labels already baked in
const eclm4_3 = eceLawModule4_3Data.map(q => ({ ...q, id: `ecl4_3_${q.id}` }));

// ECE Law Module 4.4 — set labels already baked in
const eclm4_4 = eceLawModule4_4Data.map(q => ({ ...q, id: `ecl4_4_${q.id}` }));

// Combined pool — all sets together
export const allQuestions = [...ra9292, ...eclm1, ...eclm2, ...eclm4_3, ...eclm4_4];

// Named sets for the filter dropdown
// Add new sets here and they appear automatically in the UI
export const QUESTION_SETS = [
  {
    key: 'all',
    label: 'All Questions',
    questions: allQuestions,
  },
  {
    key: 'ra9292',
    label: 'RA 9292 - Electronics Engineering Law',
    questions: ra9292,
  },
  {
    key: 'ecl_m1',
    label: 'ECE Law - Module 1',
    questions: eclm1,
  },
  {
    key: 'ecl_m2',
    label: 'ECE Law - Module 2',
    questions: eclm2,
  },
  {
    key: 'ecl_m4_3',
    label: 'ECE Law - Module 4.3 (RA 7925)',
    questions: eclm4_3,
  },
  {
    key: 'ecl_m4_4',
    label: 'ECE Law - Module 4.4 (RA 3846)',
    questions: eclm4_4,
  },
];
