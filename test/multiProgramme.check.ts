import { PROGRAMMES, programmeByKey } from '@/data/programmes';
import { buildProgrammeTerms, flattenTerms, groupProgrammeYears, groupByYear } from '@/utils/programmeModel';
import { calculateStats } from '@/utils/calculations';
import { emptyConfig } from '@/hooks/useProgramState';
import { GradeMap, ProgramConfig } from '@/types';

let fail=0;
const check=(n:string,c:boolean,d='')=>{ if(!c) fail++; console.log(`${c?'PASS':'FAIL'}  ${n}${c?'':'  <-- '+d}`); };
const cfg=(o:Partial<ProgramConfig>={}):ProgramConfig=>({...emptyConfig,...o});

console.log('--- Registry ---');
check('7 programmes (6 scraped + B&E)', PROGRAMMES.length===7, String(PROGRAMMES.length));
check('B&E is the custom one', PROGRAMMES.filter(p=>p.custom).length===1);
check('no Public Policy', !PROGRAMMES.some(p=>/public policy/i.test(p.name)));

console.log('\n--- All core courses Excellent gives exactly 5.00 ---');
PROGRAMMES.filter(p=>!p.custom).forEach(p=>{
  const courses=flattenTerms(buildProgrammeTerms(p,cfg({programme:p.key})));
  const g:GradeMap={}; courses.forEach(c=>{ g[c.id]='Excellent'; });
  const s=calculateStats(courses,g);
  check(`${p.shortName}: 5.00`, s.gpa.toFixed(2)==='5.00', s.gpa.toFixed(2));
});

console.log('\n--- Credit weighting where credits are uneven (MSc Finance) ---');
const fin=programmeByKey('msc-finance');
const finCourses=flattenTerms(buildProgrammeTerms(fin,cfg({programme:fin.key})));
const s1=finCourses.filter(c=>c.credits===1.5);
check('the 1.5 ECTS course exists', s1.length===1, `${s1.length}`);
const g2:GradeMap={};
finCourses.forEach(c=>{ g2[c.id]='Excellent'; });
g2[s1[0].id]='Pass';                                   // 1.5 credits at 3.0
const st=calculateStats(finCourses,g2);
const total=finCourses.reduce((a,c)=>a+c.credits,0);
const expected=((total-1.5)*5 + 1.5*3)/total;
check('weighted by credits, not per course', Math.abs(st.gpa-expected)<1e-9,
  `${st.gpa.toFixed(4)} vs ${expected.toFixed(4)}`);

console.log('\n--- Choose N of M only counts what is ticked ---');
const ib=programmeByKey('msc-international-business');
const base=flattenTerms(buildProgrammeTerms(ib,cfg({programme:ib.key})));
const term=buildProgrammeTerms(ib,cfg({programme:ib.key})).find(t=>t.choices.length>0)!;
check('IB has a choose group', term.choices.length===3, String(term.choices.length));
const picked={[term.choices[0].key]:true,[term.choices[1].key]:true};
const withTwo=flattenTerms(buildProgrammeTerms(ib,cfg({programme:ib.key,programmeChoices:picked})));
check('ticking two adds two courses', withTwo.length===base.length+2,
  `${base.length} -> ${withTwo.length}`);

console.log('\n--- Elective slots ---');
const bi=programmeByKey('msc-business-innovation');
const slotTerm=buildProgrammeTerms(bi,cfg({programme:bi.key})).find(t=>t.electiveKeys.length>0)!;
check('a period offers 2 elective slots', slotTerm.electiveKeys.length===2, String(slotTerm.electiveKeys.length));
const withEl=flattenTerms(buildProgrammeTerms(bi,cfg({
  programme:bi.key, programmeElectives:{[slotTerm.electiveKeys[0]]:'Graded',[slotTerm.electiveKeys[1]]:'Pass/Fail'}})));
const el=withEl.filter(c=>c.kind==='elective');
check('two electives appear', el.length===2, String(el.length));
check('pass/fail elective excluded from GPA',
  calculateStats(el,{[el[0].id]:'Excellent',[el[1].id]:'Excellent'}).gradedCredits===7.5);

console.log('\n--- Nothing leaks between programmes ---');
{
  // A thesis repeats within its own programme by design, so compare owners.
  const owner=new Map<string,string>(); let shared=0;
  PROGRAMMES.filter(p=>!p.custom).forEach(p=>{
    flattenTerms(buildProgrammeTerms(p,cfg({programme:p.key}))).forEach(c=>{
      const prev=owner.get(c.id);
      if(prev && prev!==p.key) shared++;
      owner.set(c.id,p.key);
    });
  });
  check('no course id is shared by two programmes', shared===0, `${shared}`);

  // Slot keys must be scoped too, or a choice made in one shows up in another.
  const keys=new Map<string,string>(); let clash=0;
  PROGRAMMES.filter(p=>!p.custom).forEach(p=>{
    buildProgrammeTerms(p,cfg({programme:p.key})).forEach(t=>t.electiveKeys.forEach(k=>{
      const prev=keys.get(k);
      if(prev && prev!==p.key) clash++;
      keys.set(k,p.key);
    }));
  });
  check('no elective slot key is shared by two programmes', clash===0, `${clash}`);

  const fin2=programmeByKey('msc-finance'), eco2=programmeByKey('msc-economics');
  const fk=buildProgrammeTerms(fin2,cfg({programme:fin2.key})).find(t=>t.electiveKeys.length>0)!.electiveKeys[0];
  const bleed=flattenTerms(buildProgrammeTerms(eco2,cfg({programme:eco2.key,
    programmeElectiveCourses:{[fk]:'4335'}, programmeElectives:{[fk]:'Graded' as const}})))
    .filter(c=>c.kind==='elective');
  check('a course chosen in Finance does not appear in Economics', bleed.length===0,
    bleed.map(c=>c.name).join(','));
}

console.log('\n--- Per-year grouping ---');
PROGRAMMES.filter(p=>!p.custom).forEach(p=>{
  const years=groupProgrammeYears(p,cfg({programme:p.key}));
  const expect=p.level==='Bachelor'?3:2;
  check(`${p.shortName}: ${expect} years`, years.length===expect, String(years.length));
});

console.log('\n--- Year capacity, independent of what is filled in ---');
PROGRAMMES.filter(p=>!p.custom).forEach(p=>{
  const terms=buildProgrammeTerms(p,cfg({programme:p.key}));
  const byYear=groupByYear(terms);
  const caps=byYear.map(y=>y.terms.reduce((s,t)=>s+t.credits,0));
  const total=caps.reduce((a,b)=>a+b,0);
  check(`${p.shortName}: years ${caps.join(' + ')} = ${total}`,
    caps.every(c=>c===60) && total===p.degreeCredits, `expected ${p.degreeCredits}`);
});

console.log(`\n${fail===0?'ALL MULTI-PROGRAMME CHECKS PASSED':fail+' FAILED'}`);
process.exit(fail===0?0:1);
