import { programmeByKey, PROGRAMMES } from '@/data/programmes';
import { buildProgrammeTerms, takenCourseNumbers, flattenTerms } from '@/utils/programmeModel';
import { emptyConfig } from '@/hooks/useProgramState';
import { CATALOGUE } from '@/data/courseCatalogue';
import { ProgramConfig } from '@/types';

let fail=0;
const check=(n:string,c:boolean,d='')=>{ if(!c) fail++; console.log(`${c?'PASS':'FAIL'}  ${n}${c?'':'  <-- '+d}`); };
const cfg=(p:string,o:Partial<ProgramConfig>={}):ProgramConfig=>({...emptyConfig,programme:p,...o});
const fin=programmeByKey('msc-finance');

console.log('--- Mandatory courses count as spent ---');
{
  const taken=takenCourseNumbers(fin,cfg(fin.key));
  check('Corporate Finance (4319) is a Finance core course', taken.get('4319')==='mandatory',
    String(taken.get('4319')));
  check('Asset Pricing (4339) too', taken.get('4339')==='mandatory');
  check('an untaken course is free', !taken.has('4335'));
  console.log(`      ${taken.size} numbers already spent before any elective is chosen`);
}

console.log('\n--- Choosing an elective marks it spent ---');
{
  const slot=buildProgrammeTerms(fin,cfg(fin.key,{mscThesis:'spring'}))
    .find(t=>t.year==='Year 2' && t.electiveKeys.length>0)!;
  const [a,b]=slot.electiveKeys;
  const c1=cfg(fin.key,{mscThesis:'spring',programmeElectiveCourses:{[a]:'4335'}});
  const taken=takenCourseNumbers(fin,c1);
  check('4335 is now spent', taken.get('4335')===a, String(taken.get('4335')));
  check('and points at the slot holding it, not "mandatory"', taken.get('4335')!=='mandatory');
  check('the other slot is a different key', a!==b);
}

console.log('\n--- A slot never disables its own choice ---');
{
  const slot=buildProgrammeTerms(fin,cfg(fin.key,{mscThesis:'spring'}))
    .find(t=>t.year==='Year 2' && t.electiveKeys.length>0)!;
  const [a,b]=slot.electiveKeys;
  const taken=takenCourseNumbers(fin,cfg(fin.key,{mscThesis:'spring',
    programmeElectiveCourses:{[a]:'4335'}}));
  const disabledInOwn = taken.get('4335') !== undefined && taken.get('4335') !== a;
  const disabledInOther = taken.get('4335') !== undefined && taken.get('4335') !== b;
  check('selectable in the slot that holds it', !disabledInOwn);
  check('blocked in a different slot', disabledInOther);
}

console.log('\n--- A ticked choose-group course counts, an unticked one does not ---');
{
  const ib=programmeByKey('msc-international-business');
  const term=buildProgrammeTerms(ib,cfg(ib.key)).find(t=>t.choices.length>0)!;
  const pick=term.choices[0];
  const no=pick.course.courseNo!;
  check('not spent while unticked', !takenCourseNumbers(ib,cfg(ib.key)).has(no), no);
  check('spent once ticked',
    takenCourseNumbers(ib,cfg(ib.key,{programmeChoices:{[pick.key]:true}})).get(no)==='mandatory');
}

console.log('\n--- Nothing bleeds between programmes ---');
{
  const slot=buildProgrammeTerms(fin,cfg(fin.key,{mscThesis:'spring'}))
    .find(t=>t.electiveKeys.length>0)!;
  const c=cfg(fin.key,{mscThesis:'spring',programmeElectiveCourses:{[slot.electiveKeys[0]]:'4335'}});
  const eco=programmeByKey('msc-economics');
  check('a Finance choice is not spent in Economics',
    takenCourseNumbers(eco,{...c,programme:eco.key}).get('4335')===undefined);
}

console.log('\n--- Every programme has its own cores marked ---');
PROGRAMMES.filter(p=>!p.custom).forEach(p=>{
  const taken=takenCourseNumbers(p,cfg(p.key));
  const mandatory=[...taken.values()].filter(v=>v==='mandatory').length;
  check(`${p.shortName}: ${mandatory} core numbers spent`, mandatory>0, '0');
});

console.log(`\n${fail===0?'ALL DUPLICATE CHECKS PASSED':fail+' FAILED'}`);
process.exit(fail===0?0:1);
