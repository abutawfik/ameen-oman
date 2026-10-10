import test from 'node:test';
import assert from 'node:assert/strict';
const load = async (path) => import(path).catch(() => ({}));
const { searchRecords, queryRecords } = await load('../src/workflows/search.ts');
const { validateCheckIn, saveCheckIn, readCheckIns } = await load('../src/workflows/checkIn.ts');
const { fitGraph } = await load('../src/workflows/graph.ts');
const { selectTargetHit } = await load('../src/workflows/target.ts');
const rows = [
 {id:'e1',domain:'events',name:'Ahmed Khalil',nameAr:'أحمد خليل',nationality:'Oman',nationalityCode:'OMN',docNumber:'A1',eventDate:'2026-10-10',riskScore:80,flight:'WY100',route:'DXB→MCT'},
 {id:'h1',domain:'hits',name:'Ahmad Khalil',nameAr:'احمد خليل',nationality:'Oman',nationalityCode:'OMN',docNumber:'A2',eventDate:'2026-10-09',riskScore:40,hitStatus:'NEW',watchlistName:'INTERPOL'},
 {id:'e2',domain:'events',name:'Salim Ali',nationality:'India',docNumber:'B1',eventDate:'2026-10-01',riskScore:20,flight:'WY200',route:'DEL→MCT'},
];
const condition=(field,operator,value,connector='AND')=>({id:field,field,operator,value,connector});
test('search applies domain before matching',()=>assert.deepEqual(searchRecords?.(rows,'hits','Khalil',false).map(x=>x.id),['h1']));
test('phonetic name mode matches Ahmed and Ahmad, exact mode does not',()=>{
 assert.deepEqual(searchRecords?.(rows,'hits','Ahmed',true).map(x=>x.id),['h1']);
 assert.deepEqual(searchRecords?.(rows,'hits','Ahmed',false),[]);
});
test('Arabic normalization finds names without diacritics or hamza differences',()=>assert.deepEqual(searchRecords?.(rows,'events','احمد',false).map(x=>x.id),['e1']));
test('builder evaluates date and AND/OR groups',()=>assert.deepEqual(queryRecords?.(rows,'events',[
 condition('traveler.nationality','equals','Oman'),condition('event.date','after','2026-10-05'),condition('traveler.docNumber','equals','B1','OR')
 ]).map(x=>x.id),['e1','e2']));
test('unsupported fields and incomplete criteria never match everything',()=>{
 assert.deepEqual(queryRecords?.(rows,'events',[condition('not.a.field','not_equals','x')]),[]);
 assert.deepEqual(queryRecords?.(rows,'events',[condition('traveler.docNumber','contains','')]),[]);
});
test('route target lookup never silently falls back on an unknown ID',()=>{
 const hits=[{id:'first'},{id:'second'}];
 assert.equal(selectTargetHit?.(hits,'second')?.id,'second');
 assert.equal(selectTargetHit?.(hits,'missing'),null);
});
test('fit graph contains negative and distant nodes in narrow canvas',()=>{
 const nodes=[{x:-400,y:-100},{x:1400,y:900}];const t=fitGraph?.(nodes,390,500,40);
 assert.ok(t);for(const n of nodes){assert.ok(n.x*t.scale+t.x>=40-1e-6);assert.ok(n.x*t.scale+t.x<=350+1e-6);assert.ok(n.y*t.scale+t.y>=40-1e-6);assert.ok(n.y*t.scale+t.y<=460+1e-6);}
});
const valid={firstName:'Demo',lastName:'Guest',docNumber:'DEMO-TEST',nationality:'Oman',room:'102',arrivalDate:'2026-10-10',arrivalTime:'14:00',departureDate:'2026-10-12',departureTime:'12:00'};
const rooms=[{id:'R102',number:'102',type:'double',status:'available',rateOMR:25},{id:'R101',number:'101',status:'occupied'}];
test('empty check-in is rejected with required-field errors',()=>assert.ok(Object.keys(validateCheckIn?.({},rooms)||{}).length>=6));
test('check-in rejects occupied rooms and reversed stay dates',()=>{
 assert.ok(validateCheckIn?.({...valid,room:'101'},rooms).room);
 assert.ok(validateCheckIn?.({...valid,departureDate:'2026-10-09'},rooms).departureDate);
 assert.deepEqual(validateCheckIn?.(valid,rooms),{});
});
test('a saved check-in survives rereading and remains pending sync',()=>{
 let value=null;const storage={getItem:()=>value,setItem:(k,v)=>{value=v;}};
 const saved=saveCheckIn?.(valid,rooms,storage);
 assert.ok(saved);assert.equal(saved.ameenSynced,false);assert.equal(readCheckIns?.(storage)[0]?.guestDoc,'DEMO-TEST');assert.equal(saved.nights,2);
 assert.throws(()=>saveCheckIn({...valid,room:'101'},rooms,storage));
});
test('multiword general query can match across fields',()=>assert.deepEqual(searchRecords(rows,'events','Oman WY100',false).map(x=>x.id),['e1']));
test('saved TODAY and bag count criteria are evaluated',()=>{
 const today=new Date().toISOString().slice(0,10);
 const sample=[{...rows[0],eventDate:today,bags:{count:3}}];
 assert.equal(queryRecords(sample,'events',[condition('event.date','equals','TODAY')]).length,1);
 assert.equal(queryRecords(sample,'events',[condition('event.bagCount','greater_than','2')]).length,1);
});
test('duplicate local room booking and storage failures never report a saved record',()=>{
 let value=null;const storage={getItem:()=>value,setItem:(k,v)=>{value=v;}};
 saveCheckIn(valid,rooms,storage);
 assert.throws(()=>saveCheckIn(valid,rooms,storage));
 assert.throws(()=>saveCheckIn(valid,rooms,{getItem:()=>null,setItem:()=>{throw new Error('storage blocked')}}));
});
