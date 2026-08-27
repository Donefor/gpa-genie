import { CATALOGUE, ALL_CATALOGUE, coursesInPeriods, catalogueCourse } from '@/data/courseCatalogue';
import { programmeByKey, PROGRAMMES } from '@/data/programmes';

let fail=0;
const check=(n:string,c:boolean,d='')=>{ if(!c) fail++; console.log(`${c?'PASS':'FAIL'}  ${n}${c?'':'  <-- '+d}`); };

console.log('--- Retired numbers are out of the picker ---');
{
  const retired=ALL_CATALOGUE.filter(c=>c.retired);
  check('13 numbers are retired', retired.length===13, String(retired.length));
  check('none of them can be picked',
    retired.every(r=>!CATALOGUE.some(c=>c.courseNo===r.courseNo)));
  check('but they are still resolvable, for grades already entered',
    retired.every(r=>!!catalogueCourse(r.courseNo)));
  ['619','629','639','649','659'].forEach(no=>
    check(`  old degree-project code ${no} is retired`, catalogueCourse(no)?.retired===true));
  ['BE151','BE251','BE351','BE451','BE551'].forEach(no=>
    check(`  its BE replacement ${no} is live`, CATALOGUE.some(c=>c.courseNo===no)));
}

console.log('\n--- No name appears twice without a way to tell them apart ---');
{
  const byName=new Map<string,typeof CATALOGUE>();
  CATALOGUE.forEach(c=>{ const k=c.name.trim().toLowerCase(); (byName.get(k) ?? byName.set(k,[]).get(k)!).push(c); });
  const dupes=[...byName.entries()].filter(([,v])=>v.length>1);
  check('6 names are still shared', dupes.length===6, String(dupes.length));
  check('every one of them is flagged ambiguous',
    dupes.every(([,v])=>v.every(c=>c.ambiguous)));
  check('a unique name is not flagged',
    CATALOGUE.filter(c=>!c.ambiguous).every(c=>
      CATALOGUE.filter(x=>x.name.trim().toLowerCase()===c.name.trim().toLowerCase()).length===1));
  dupes.forEach(([,v])=>console.log(`      "${v[0].name.slice(0,40)}" -> ${v.map(c=>c.courseNo).join(', ')}`));
}

console.log('\n--- A period dropdown never lists the same name twice unlabelled ---');
[1,2,3,4].forEach(p=>{
  const list=coursesInPeriods([p]);
  const bare=list.filter(c=>!c.ambiguous).map(c=>c.name.trim().toLowerCase());
  check(`period ${p}: no unlabelled repeats`, new Set(bare).size===bare.length,
    `${bare.length-new Set(bare).size} repeats`);
});

console.log('\n--- Department lists are clean ---');
PROGRAMMES.filter(p=>!p.custom).forEach(p=>{
  const dept=CATALOGUE.filter(c=>p.departmentPrefixes.some(x=>c.courseNo.startsWith(x)));
  const names=dept.filter(c=>!c.ambiguous).map(c=>c.name.trim().toLowerCase());
  check(`${p.shortName}: ${dept.length} courses, no repeats`,
    new Set(names).size===names.length, `${names.length-new Set(names).size}`);
});

console.log(`\n${fail===0?'ALL DEDUPE CHECKS PASSED':fail+' FAILED'}`);
process.exit(fail===0?0:1);
