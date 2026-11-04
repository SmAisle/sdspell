// Walks the coach demo (a wrong tap, three moves, the popup, Play), then checks the real game ends on the last letter.
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));await p.evaluate(()=>store.set('seenHelp','1'));await p.click('#coverDemo');
await p.waitForTimeout(700);await p.locator('.smCap').click();await p.locator('.smStage').click({position:{x:12,y:12}});console.log('nudge',await p.locator('.smCap p.nudge').count());
for(let i=0;i<3;i++){await p.waitForTimeout(800);await p.locator('#smDemo .smNow').click()}
await p.waitForSelector('.smPop',{timeout:5000});console.log('popup',await p.locator('.smPc').innerText());await p.click('#smPlay');await p.waitForTimeout(300);
await p.evaluate(()=>{clearTimeout(timer);grid=Array.from({length:H},()=>Array(W).fill(null));li=99;cur=null;spawn();clearTimeout(timer)});
console.log('last',await p.evaluate(()=>$('left').textContent+' | '+$('msg').textContent));await p.click('#dBtn');await p.waitForTimeout(1200);
console.log('ended',await p.evaluate(()=>over+' '+!$('done').hidden+' '+$('dWhy').textContent));
await b.close()})();
