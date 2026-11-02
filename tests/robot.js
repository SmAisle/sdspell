const {chromium}=require('playwright');const S=__dirname+'/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'');await p.evaluate(()=>store.set('seenHelp','1'));await p.click('#coverGo');
 // greedy-ish robot: spread letters across columns, clear any lit word right away
 await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));let col=0;
  for(let i=0;i<600&&!over;i++){if(!$('ask').hidden){closeAsk(true)}if(lit.length){clearWord(lit[0]);await sl(400);continue}
   if(cur){let c=col%W;col+=1;let h=r=>{let y=-1;for(let k=0;k<H;k++)if(grid[k][r]){y=k;break}return y};cur.c=c;if(grid[cur.r][c])cur.c=(c+1)%W;drop()}
   else if(!$('goBtn').hidden){$('goBtn').onclick();break}await sl(160)}});
 await p.waitForTimeout(1200);console.log(await p.evaluate(()=>over+' li='+li+' score='+score+' | '+$('dRes').textContent+' | '+$('dWords').textContent));await p.screenshot({path:'/tmp/sds-robot-end.png'});
 await p.reload();await p.click('#coverGo');await p.waitForTimeout(300);console.log(await p.evaluate(()=>$('done').hidden+' '+$('dScore').textContent));
 await b.close()})();
