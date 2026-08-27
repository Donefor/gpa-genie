import { programmeByKey, PROGRAMMES } from '@/data/programmes';
import { CATALOGUE, ALL_CATALOGUE, coursesInPeriods } from '@/data/courseCatalogue';
import { buildProgrammeTerms, periodsOfTerm } from '@/utils/programmeModel';
import { emptyConfig } from '@/hooks/useProgramState';

let fail=0;
const check=(n:string,c:boolean,d='')=>{ if(!c) fail++; console.log(`${c?'PASS':'FAIL'}  ${n}${c?'':'  <-- '+d}`); };

console.log('--- Term to period mapping ---');
([['Period 1',[1]],['Period 4',[4]],['Semester 1',[1,2]],['Semester 2',[3,4]],
  ['Semester 3 and 4',[1,2,3,4]],['Semester 1: Getting up to speed',[1,2]]] as [string,number[]][])
  .forEach(([label,expect])=>
    check(`${label} -> ${expect.join(',')}`, periodsOfTerm(label).join(',')===expect.join(','),
      periodsOfTerm(label).join(',')));

console.log('\n--- A period only offers what runs then ---');
[1,2,3,4].forEach(p=>{
  const list=coursesInPeriods([p]);
  check(`period ${p}: every course runs in it`, list.every(c=>c.periods.includes(p)),
    `${list.filter(c=>!c.periods.includes(p)).length} wrong`);
  console.log(`      ${list.length} courses offered in period ${p}`);
});

console.log('\n--- A single-period course appears in exactly one period ---');
{
  check('221 of all 290 rows run in one period', ALL_CATALOGUE.filter(c=>c.periods.length===1).length===221,
    String(ALL_CATALOGUE.filter(c=>c.periods.length===1).length));
  const only=CATALOGUE.filter(c=>c.periods.length===1);
  check('215 of the pickable ones do (7 zero-credit excluded)', only.length===215, String(only.length));
  const sample=only.slice(0,3);
  sample.forEach(c=>{
    const appears=[1,2,3,4].filter(p=>coursesInPeriods([p]).some(x=>x.courseNo===c.courseNo));
    check(`  "${c.name.slice(0,30)}" only in P${c.periods[0]}`,
      appears.length===1 && appears[0]===c.periods[0], `appears in ${appears.join(',')}`);
  });
}

console.log('\n--- A course given twice appears in both ---');
{
  const twice=CATALOGUE.find(c=>c.periods.length===2)!;
  const appears=[1,2,3,4].filter(p=>coursesInPeriods([p]).some(x=>x.courseNo===twice.courseNo));
  check(`"${twice.name.slice(0,30)}" in P${twice.periods.join(' and ')}`,
    appears.join(',')===twice.periods.join(','), appears.join(','));
}

console.log('\n--- Every elective slot filters by its own term ---');
PROGRAMMES.filter(p=>p.level==='Master').forEach(p=>{
  const terms=buildProgrammeTerms(p,{...emptyConfig,programme:p.key}).filter(t=>t.electiveKeys.length>0);
  let bad=0;
  terms.forEach(t=>{
    coursesInPeriods(t.periods).forEach(c=>{
      if(!c.periods.some(x=>t.periods.includes(x))) bad++;
    });
  });
  check(`${p.shortName}: ${terms.length} slotted terms, all filtered`, bad===0, String(bad));
});

console.log('\n--- Year 2 periods are genuinely distinct ---');
{
  const fin=programmeByKey('msc-finance');
  const y2=buildProgrammeTerms(fin,{...emptyConfig,programme:fin.key})
    .filter(t=>t.year==='Year 2' && t.electiveKeys.length>0);
  const sets=y2.map(t=>new Set(coursesInPeriods(t.periods).map(c=>c.courseNo)));
  check('two different periods offer different course sets',
    sets.length>=2 && [...sets[0]].some(x=>!sets[1].has(x)), 'identical');
  y2.forEach((t,i)=>console.log(`      ${t.label}: ${sets[i].size} courses`));
}

console.log(`\n${fail===0?'ALL PERIOD FILTER CHECKS PASSED':fail+' FAILED'}`);
process.exit(fail===0?0:1);
