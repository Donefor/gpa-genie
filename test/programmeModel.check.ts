import { PROGRAMMES } from '@/data/programmes';
let fail=0;
const check=(n:string,c:boolean,d='')=>{ if(!c) fail++; console.log(`${c?'PASS':'FAIL'}  ${n}${c?'':'  <-- '+d}`); };
const SLOT=7.5;
PROGRAMMES.forEach(p=>{
  if(p.custom){ console.log(`\n--- ${p.name} (bespoke page, no generic terms)`); return; }
  console.log(`\n--- ${p.name}  [${p.level}, ${p.degreeCredits} ECTS]`);
  let grand=0;
  p.terms.forEach(t=>{
    const group=t.courses.filter(c=>c.kind==='choice');
    const chosen=group.length ? (group[0].choose!.pick/group.length)*group.reduce((s,c)=>s+c.credits,0) : 0;
    const fixed=t.courses.filter(c=>c.kind!=='choice').reduce((s,c)=>s+c.credits,0);
    const filled=fixed+chosen+t.electiveSlots*SLOT;
    grand+=filled;
    const ok=Math.abs(filled-t.credits)<0.01;
    if(!ok) fail++;
    console.log(`  ${ok?'OK':'!!'}  ${t.year} ${t.label.slice(0,38).padEnd(40)} fixed ${fixed.toFixed(1).padStart(5)} + choice ${chosen.toFixed(1).padStart(5)} + ${t.electiveSlots} slots = ${filled.toFixed(1).padStart(5)} / ${t.credits}`);
  });
  check(`  ${p.shortName} totals ${p.degreeCredits}`, Math.abs(grand-p.degreeCredits)<0.01, `${grand}`);
});
console.log(`\nprogrammes: ${PROGRAMMES.length}`);
console.log(fail===0?'ALL PROGRAMME MODEL CHECKS PASSED':`${fail} FAILED`);
process.exit(fail===0?0:1);
