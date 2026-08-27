import { programmeByKey, PROGRAMMES } from '@/data/programmes';
import { CATALOGUE } from '@/data/courseCatalogue';
import { buildProgrammeTerms, flattenTerms } from '@/utils/programmeModel';
import { emptyConfig } from '@/hooks/useProgramState';
import { calculateStats } from '@/utils/calculations';

let fail=0;
const check=(n:string,c:boolean,d='')=>{ if(!c) fail++; console.log(`${c?'PASS':'FAIL'}  ${n}${c?'':'  <-- '+d}`); };

console.log('--- Department detection ---');
const expect: Record<string,string[]> = {
  'msc-finance':['43'], 'msc-economics':['53'], 'msc-avfm':['33'],
  'msc-business-innovation':['13'], 'bsc-retail-management':['NDH'],
};
Object.entries(expect).forEach(([k,pref])=>{
  const p=programmeByKey(k);
  check(`${p.shortName}: ${pref.join(',')}`, pref.every(x=>p.departmentPrefixes.includes(x)),
    p.departmentPrefixes.join(','));
});
const ib=programmeByKey('msc-international-business');
check('International Business spans 61 and 94',
  ib.departmentPrefixes.includes('61') && ib.departmentPrefixes.includes('94'),
  ib.departmentPrefixes.join(','));

console.log('\n--- Every programme offers real department courses ---');
PROGRAMMES.filter(p=>!p.custom).forEach(p=>{
  const n=CATALOGUE.filter(c=>p.departmentPrefixes.some(x=>c.courseNo.startsWith(x))).length;
  check(`${p.shortName}: ${n} to choose from`, n>=10, String(n));
});

console.log('\n--- Picking a department course uses its real credits ---');
const fin=programmeByKey('msc-finance');
const slotTerm=buildProgrammeTerms(fin,{...emptyConfig,programme:fin.key}).find(t=>t.electiveKeys.length>0)!;
const key=slotTerm.electiveKeys[0];
const dept=CATALOGUE.filter(c=>c.courseNo.startsWith('43'));
const odd=dept.find(c=>c.creditsKnown && c.credits!==7.5) ?? dept[0];
const cfg={...emptyConfig,programme:fin.key,
  programmeElectiveCourses:{[key]:odd.courseNo}, programmeElectives:{[key]:'Graded' as const}};
const el=flattenTerms(buildProgrammeTerms(fin,cfg)).find(c=>c.kind==='elective')!;
check(`"${odd.name.slice(0,30)}" at ${odd.credits} ECTS`, el.credits===odd.credits && el.name===odd.name,
  `${el.name} ${el.credits}`);

console.log('\n--- The unnamed options still behave ---');
const graded={...emptyConfig,programme:fin.key,programmeElectives:{[key]:'Graded' as const}};
const g=flattenTerms(buildProgrammeTerms(fin,graded)).find(c=>c.kind==='elective')!;
check('graded elective counts 7.5 toward the GPA',
  g.credits===7.5 && calculateStats([g],{[g.id]:'Excellent'}).gradedCredits===7.5);
const pf={...emptyConfig,programme:fin.key,programmeElectives:{[key]:'Pass/Fail' as const}};
const p2=flattenTerms(buildProgrammeTerms(fin,pf)).find(c=>c.kind==='elective')!;
check('pass/fail elective is excluded from the GPA',
  calculateStats([p2],{[p2.id]:'Excellent'}).gradedCredits===0);

console.log('\n--- Empty means empty ---');
const none={...emptyConfig,programme:fin.key};
check('no elective courses when nothing is chosen',
  flattenTerms(buildProgrammeTerms(fin,none)).filter(c=>c.kind==='elective').length===0);

console.log(`\n${fail===0?'ALL ELECTIVE SLOT CHECKS PASSED':fail+' FAILED'}`);
process.exit(fail===0?0:1);
