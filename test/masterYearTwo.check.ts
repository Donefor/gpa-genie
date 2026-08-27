import { programmeByKey, PROGRAMMES } from '@/data/programmes';
import { buildProgrammeTerms, flattenTerms, groupByYear, departmentElectiveCount,
         REQUIRED_DEPARTMENT_ELECTIVES } from '@/utils/programmeModel';
import { calculateStats } from '@/utils/calculations';
import { emptyConfig } from '@/hooks/useProgramState';
import { CATALOGUE } from '@/data/courseCatalogue';
import { ProgramConfig } from '@/types';

let fail=0;
const check=(n:string,c:boolean,d='')=>{ if(!c) fail++; console.log(`${c?'PASS':'FAIL'}  ${n}${c?'':'  <-- '+d}`); };
const cfg=(p:string,o:Partial<ProgramConfig>={}):ProgramConfig=>({...emptyConfig,programme:p,...o});

const fin=programmeByKey('msc-finance');

console.log('--- Year 2 is four periods of 15 ---');
{
  const y2=buildProgrammeTerms(fin,cfg(fin.key)).filter(t=>t.year==='Year 2');
  check('four periods', y2.length===4, String(y2.length));
  check('each worth 15', y2.every(t=>t.credits===15));
  check('period labels', y2.map(t=>t.label).join(',')==='Period 1,Period 2,Period 3,Period 4',
    y2.map(t=>t.label).join(','));
  check('year 2 totals 60', y2.reduce((s,t)=>s+t.credits,0)===60);
}

console.log('\n--- The thesis is required and takes half the year ---');
[['spring',[3,4]],['fall',[1,2]]].forEach(([half,periods])=>{
  const t=buildProgrammeTerms(fin,cfg(fin.key,{mscThesis:half as 'fall'|'spring'}))
    .filter(x=>x.year==='Year 2');
  const withThesis=t.filter(x=>x.courses.some(c=>c.kind==='thesis')).map(x=>Number(x.label.slice(-1)));
  check(`${half} thesis sits in periods ${(periods as number[]).join(' and ')}`,
    withThesis.join(',')===(periods as number[]).join(','), withThesis.join(','));
  const thesis=flattenTerms(t).filter(c=>c.kind==='thesis');
  check(`  and is 30 ECTS in total`, thesis.reduce((s,c)=>s+c.credits,0)===30,
    String(thesis.reduce((s,c)=>s+c.credits,0)));
  check(`  under one grade`, new Set(thesis.map(c=>c.id)).size===1);
});

console.log('\n--- Exchange takes the other half, never the thesis half ---');
{
  const c=cfg(fin.key,{mscThesis:'spring',mscExchange:'fall'});
  const y2=buildProgrammeTerms(fin,c).filter(t=>t.year==='Year 2');
  const ex=flattenTerms(y2).filter(x=>x.kind==='exchange');
  check('exchange fills the autumn', ex.length===4, String(ex.length));
  check('exchange is pass/fail', ex.every(x=>x.isPassFail));
  check('exchange adds nothing to the GPA',
    calculateStats(ex,Object.fromEntries(ex.map(x=>[x.id,'Excellent' as const]))).gradedCredits===0);
  check('no elective slots left in the autumn',
    y2.slice(0,2).every(t=>t.electiveKeys.length===0));
  check('spring is thesis, so no slots there either',
    y2.slice(2).every(t=>t.electiveKeys.length===0));
}

console.log('\n--- With no exchange, the free half is all electives ---');
{
  const y2=buildProgrammeTerms(fin,cfg(fin.key,{mscThesis:'spring'})).filter(t=>t.year==='Year 2');
  const slots=y2.reduce((s,t)=>s+t.electiveKeys.length,0);
  check('4 slots across the free half', slots===4, String(slots));
  check('each period offers 2', y2[0].electiveKeys.length===2 && y2[1].electiveKeys.length===2);
}

console.log('\n--- A period can never exceed 15 ECTS ---');
PROGRAMMES.filter(p=>p.level==='Master').forEach(p=>{
  const combos:[('fall'|'spring'),('none'|'fall'|'spring')][]=
    [['fall','none'],['spring','none'],['fall','spring'],['spring','fall']];
  let worst=0;
  combos.forEach(([th,ex])=>{
    buildProgrammeTerms(p,cfg(p.key,{mscThesis:th,mscExchange:ex}))
      .filter(t=>t.year==='Year 2')
      .forEach(t=>{ worst=Math.max(worst,t.courses.reduce((s,c)=>s+c.credits,0)); });
  });
  check(`${p.shortName}: never over 15`, worst<=15, String(worst));
});

console.log('\n--- Department elective requirement ---');
{
  const dept=CATALOGUE.filter(c=>c.courseNo.startsWith('43')).slice(0,4);
  const other=CATALOGUE.find(c=>c.courseNo.startsWith('53'))!;
  const picks:Record<string,string>={};
  dept.forEach((c,i)=>{ picks[`y2-p1-${i%2}`]=c.courseNo; });
  const c1=cfg(fin.key,{programmeElectiveCourses:{...picks}});
  check('counts only department courses',
    departmentElectiveCount(fin,c1)===Object.keys(picks).length, String(departmentElectiveCount(fin,c1)));
  const c2=cfg(fin.key,{programmeElectiveCourses:{...picks,'y2-p2-0':other.courseNo}});
  check('an outside course does not count',
    departmentElectiveCount(fin,c2)===departmentElectiveCount(fin,c1));
  check('the requirement is 4', REQUIRED_DEPARTMENT_ELECTIVES===4);
}

console.log('\n--- Year totals still hold ---');
PROGRAMMES.filter(p=>!p.custom).forEach(p=>{
  const years=groupByYear(buildProgrammeTerms(p,cfg(p.key)));
  const total=years.reduce((s,y)=>s+y.terms.reduce((a,t)=>a+t.credits,0),0);
  check(`${p.shortName}: ${total} ECTS`, total===p.degreeCredits, String(total));
});

console.log(`\n${fail===0?'ALL YEAR 2 CHECKS PASSED':fail+' FAILED'}`);
process.exit(fail===0?0:1);
