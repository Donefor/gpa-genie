import { CATALOGUE, ALL_CATALOGUE, catalogueCourse, DEFAULT_ELECTIVE_CREDITS } from '@/data/courseCatalogue';
import { programmeByKey } from '@/data/programmes';
import { buildProgrammeTerms, flattenTerms } from '@/utils/programmeModel';
import { calculateStats } from '@/utils/calculations';
import { emptyConfig } from '@/hooks/useProgramState';
import { GradeMap } from '@/types';

let fail=0;
const check=(n:string,c:boolean,d='')=>{ if(!c) fail++; console.log(`${c?'PASS':'FAIL'}  ${n}${c?'':'  <-- '+d}`); };

console.log('--- Catalogue ---');
check('290 rows in the export', ALL_CATALOGUE.length===290, String(ALL_CATALOGUE.length));
check('283 pickable (7 zero-credit excluded)', CATALOGUE.length===283, String(CATALOGUE.length));
check('published credits on most', ALL_CATALOGUE.filter(c=>c.creditsKnown).length===248,
  String(ALL_CATALOGUE.filter(c=>c.creditsKnown).length));
check('unknown credits fall back to 7.5',
  ALL_CATALOGUE.filter(c=>!c.creditsKnown).every(c=>c.credits===DEFAULT_ELECTIVE_CREDITS));
check('no duplicate course numbers', new Set(ALL_CATALOGUE.map(c=>c.courseNo)).size===ALL_CATALOGUE.length);
check('every pickable course has weight', CATALOGUE.every(c=>c.credits>0));
check('the zero-credit ones are still looked up', catalogueCourse('NDH676')?.credits===0);
check('lookup works', catalogueCourse('4319')?.name.includes('Corporate Finance')===true,
  String(catalogueCourse('4319')?.name));

console.log('\n--- Non-standard credits survive ---');
const odd=CATALOGUE.filter(c=>c.creditsKnown && c.credits!==7.5);
check('there are non-7.5 courses', odd.length>20, String(odd.length));
console.log('      e.g. ' + odd.slice(0,4).map(c=>`${c.name.slice(0,28)} ${c.credits}`).join(' | '));

console.log('\n--- A named elective uses its real credits ---');
const fin=programmeByKey('msc-finance');
const slot=buildProgrammeTerms(fin,{...emptyConfig,programme:fin.key}).find(t=>t.electiveKeys.length>0)!;
const key=slot.electiveKeys[0];
const three=CATALOGUE.find(c=>c.creditsKnown && c.credits===3.0)!;
const cfg={...emptyConfig,programme:fin.key,
  programmeElectiveCourses:{[key]:three.courseNo},
  programmeElectives:{[key]:'Graded' as const}};
const courses=flattenTerms(buildProgrammeTerms(fin,cfg));
const el=courses.find(c=>c.kind==='elective')!;
check(`slot takes ${three.name.slice(0,26)} at ${three.credits} ECTS`, el.credits===three.credits,
  `${el.credits}`);
check('and its real name', el.name===three.name, el.name);

console.log('\n--- Unnamed slots still work ---');
const plain={...emptyConfig,programme:fin.key,programmeElectives:{[key]:'Graded' as const}};
const pc=flattenTerms(buildProgrammeTerms(fin,plain)).find(c=>c.kind==='elective')!;
check('generic elective is 7.5', pc.credits===7.5 && pc.name==='Elective course', `${pc.name} ${pc.credits}`);

console.log('\n--- Grade follows the course, not the slot ---');
const g:GradeMap={[el.id]:'Excellent'};
check('graded correctly', calculateStats([el],g).gpa===5);
const moved={...cfg, programmeElectiveCourses:{[slot.electiveKeys[1]]:three.courseNo, [key]:null},
  programmeElectives:{[slot.electiveKeys[1]]:'Graded' as const}};
const movedEl=flattenTerms(buildProgrammeTerms(fin,moved)).find(c=>c.kind==='elective')!;
check('a different slot gives a different id', movedEl.id!==el.id);
check('but both ids name the same course', movedEl.name===el.name);

console.log('\n--- Suggested electives come from the programme page ---');
[['msc-finance',15],['msc-economics',10],['msc-avfm',6]].forEach(([k,n])=>{
  const p=programmeByKey(k as string);
  check(`${p.shortName}: ${n} suggestions`, p.suggested.length===n, String(p.suggested.length));
});

console.log(`\n${fail===0?'ALL CATALOGUE CHECKS PASSED':fail+' FAILED'}`);
// --- periods -------------------------------------------------------------
import { semesterOfPeriod } from '@/data/courseCatalogue';
console.log('\n--- Periods ---');
{
  check('every course knows at least one period', ALL_CATALOGUE.every(c => c.periods.length > 0));
  check('periods are 1-4', ALL_CATALOGUE.every(c => c.periods.every(p => p >= 1 && p <= 4)));
  check('periods are sorted and distinct', ALL_CATALOGUE.every(c =>
    c.periods.every((p, i) => i === 0 || p > c.periods[i - 1])));
  check('221 rows run in exactly one period',
    ALL_CATALOGUE.filter(c => c.periods.length === 1).length === 221,
    String(ALL_CATALOGUE.filter(c => c.periods.length === 1).length));
  check('helper maps halves', semesterOfPeriod(1)==='Autumn' && semesterOfPeriod(4)==='Spring'
    && semesterOfPeriod(null)===null);

  // A master's semester is half a year, so it holds two periods of 15 ECTS.
  const bi = programmeByKey('msc-business-innovation');
  const s1 = bi.terms.find(t => /Semester 1/.test(t.label))!;
  const inAutumn = s1.courses.every(c => {
    const cat = catalogueCourse(c.courseNo!);
    return !!cat && cat.periods.some(p => p === 1 || p === 2);
  });
  check('MSc semester 1 sits in the autumn', inAutumn);
  const credits = (p: number) => s1.courses
    .filter(c => catalogueCourse(c.courseNo!)?.periods.includes(p))
    .reduce((sum, c) => sum + c.credits, 0);
  check('and splits 15 + 15 across its two periods',
    credits(1) === 15 && credits(2) === 15, `${credits(1)} + ${credits(2)}`);

  check('the bad NDH203 join on International Business is gone',
    !programmeByKey('msc-international-business').terms
      .some(t => t.courses.some(c => c.courseNo === 'NDH203')));
}
console.log(`\n${fail===0?'ALL CATALOGUE CHECKS PASSED':fail+' FAILED'}`);
process.exit(fail===0?0:1);
