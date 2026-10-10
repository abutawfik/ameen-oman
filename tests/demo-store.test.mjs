import test from 'node:test';
import assert from 'node:assert/strict';
const { readDemoRecords, writeDemoRecords } = await import('../src/workflows/demoStore.ts').catch(()=>({}));
test('demo case notes and statuses survive re-reading',()=>{
 let value=null;const storage={getItem:()=>value,setItem:(k,v)=>{value=v;}};
 const seed=[{id:'CASE-DEMO',status:'OPEN',notes:[]}];
 assert.deepEqual(readDemoRecords?.(storage,'cases',seed),seed);
 const changed=[{...seed[0],status:'INVESTIGATING',notes:[{id:'note1',body:'Demo review'}]}];
 writeDemoRecords?.(storage,'cases',changed);
 assert.deepEqual(readDemoRecords?.(storage,'cases',seed),changed);
});
test('corrupted state and failed writes are reported instead of reset or false success',()=>{
 assert.throws(()=>readDemoRecords?.({getItem:()=>'{bad'},'cases',[]));
 assert.throws(()=>writeDemoRecords?.({setItem:()=>{throw new Error('full')}},'cases',[{id:'demo'}]));
});
