const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'');await p.evaluate(()=>store.set('seenHelp','1'));await p.click('#coverGo');await p.click('#menuBtn');await p.click('#mDemo');await p.waitForTimeout(300);
const st=async n=>{await p.waitForTimeout(300);console.log(n,'|',await p.evaluate(()=>$('msg').innerText.replace(/\n/g,' / ')+' | cur='+(cur&&cur.l+cur.c)+' ask='+!$('ask').hidden+' score='+score));await p.screenshot({path:__dirname+'/demo-'+n+'.png'})};
const tapCol=async c=>{const bx=await (await p.$(`[data-k="0,${c}"]`)).boundingBox();await p.mouse.click(bx.x+bx.width/2,bx.y+bx.height/2)};
await tapCol(2);await tapCol(2);await p.waitForTimeout(300);await p.click('#askHold');await p.waitForTimeout(300);
await tapCol(3);await p.waitForTimeout(300);await p.click('#askHold');await p.waitForTimeout(300);
await tapCol(4);await tapCol(4);await p.waitForTimeout(300);await p.click('#askList button');await p.waitForTimeout(1000);
await st("v6");await tapCol(3);await st('v6-ask');await p.click('#askList button');await p.waitForTimeout(1600);
console.log('done',await p.evaluate(()=>!$('demoDone').hidden+' '+$('ddText').innerText));await p.screenshot({path:__dirname+'/demo-done.png'});
// real game: last letter ends
await p.click('#ddGo');await p.waitForTimeout(300);
await p.evaluate(()=>{clearTimeout(timer);grid=Array.from({length:H},()=>Array(W).fill(null));li=99;cur=null;spawn();clearTimeout(timer)});
console.log('last',await p.evaluate(()=>$('left').textContent+' | '+$('msg').textContent));await p.click('#dBtn');await p.waitForTimeout(1200);
console.log('ended',await p.evaluate(()=>over+' '+!$('done').hidden+' '+$('dWhy').textContent));
await b.close()})();
