// ---------- Sound engine (shared by the game and the sound board) ----------
// Everything is made in the browser, no sound files. Phone speakers can't play deep bass, so every sound sits
// above about 250 Hz. All sound goes through one compressor so quiet and loud sounds even out.
let ac=null,noiseBuf=null,master=null,unlocked=false;
function actx(){if(typeof soundOn==='function'&&!soundOn())return null;try{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();
    const comp=ac.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;master=ac.createGain();master.gain.value=1.6;master.connect(comp).connect(ac.destination)}
  if(ac.state!=='running')ac.resume();
  if(!noiseBuf){noiseBuf=ac.createBuffer(1,ac.sampleRate*.5,ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}return ac}catch(e){return null}}
// iPhones: the first tap unlocks sound, and a silent looping audio element lets sound play even with the ringer switch on silent.
// Coming back to the app: iPhones pause the sound and the silent loop, so the next tap unlocks again, and a stuck sound engine is rebuilt.
let silentEl=null;
function unlockAudio(){if(unlocked)return;unlocked=true;try{
  if(ac&&ac.state!=='running'){const old=ac;old.resume().catch(()=>{});setTimeout(()=>{if(ac===old&&old.state!=='running'){try{old.close()}catch(e){}ac=null;master=null;noiseBuf=null;actx()}},250)}
  const a=actx();if(a){const b=a.createBuffer(1,1,22050),s=a.createBufferSource();s.buffer=b;s.connect(a.destination);s.start(0)}
  if(!silentEl){silentEl=document.createElement('audio');silentEl.setAttribute('playsinline','');silentEl.loop=true;
    silentEl.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='}
  silentEl.play().catch(()=>{})}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)unlocked=false});
window.addEventListener('pageshow',()=>{unlocked=false});
['touchstart','pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,unlockAudio,{once:false,passive:true}));
function tone(f,dur=.08,type='sine',vol=.1,delay=0,f2){const a=actx();if(!a)return;
  const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+delay;o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g).connect(master);o.start(t);o.stop(t+dur+.02)}
function noise(dur,freq,q=1,vol=.2,delay=0,type='bandpass'){const a=actx();if(!a)return;const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+delay;
  s.buffer=noiseBuf;f.type=type;f.frequency.value=freq;f.Q.value=q;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f).connect(g).connect(master);s.start(t);s.stop(t+dur+.02)}
// Casino bell: a bright strike with inharmonic overtones.
function bell(f,delay=0,vol=.08,dur=.6){tone(f,dur,'sine',vol,delay);tone(f*2.76,dur*.5,'sine',vol*.4,delay);tone(f*5.4,dur*.25,'sine',vol*.2,delay);noise(.02,f*3,4,vol*.8,delay)}
function coin(delay=0,pitch=1){const f=2100*pitch;tone(f,.25,'sine',.09,delay);tone(f*1.47,.18,'sine',.05,delay);noise(.025,6500,2,.12,delay)}
const coins=(n,d0=0,gap=.05)=>{for(let k=0;k<n;k++)coin(d0+k*gap+Math.random()*.025,.85+Math.random()*.35)};
const chip=(d=0)=>{noise(.012,4200,6,.35,d);noise(.015,3000,6,.3,d+.035)};
const arp=(notes,gap,type='square',vol=.06,dur=.12,d0=0)=>notes.forEach((f,k)=>tone(f,dur,type,vol,d0+k*gap));
const rnd=Math.random;
// Each moment has eight options [name, play]. A is the game's original sound.
const SOUNDS=[
 {k:'move',name:'Move a letter',what:'Each time the falling letter changes column',o:[
   ['Soft blip',()=>tone(600,.03,'sine',.04)],
   ['Tick',()=>noise(.012,4000,6,.25)],
   ['Wood tap',()=>{tone(900,.03,'triangle',.06);noise(.01,2500,4,.15)}],
   ['Click',()=>tone(1500,.02,'square',.03)],
   ['Pop',()=>tone(500,.04,'sine',.07,0,900)],
   ['Bubble',()=>tone(700,.05,'sine',.05,0,1200)],
   ['Typewriter',()=>{noise(.015,3200,3,.3);tone(2000,.01,'square',.02)}],
   ['Silent',()=>{}]]},
 {k:'drop',name:'Letter lands',what:'When a letter lands on the board',o:[
   ['Soft thud',()=>tone(330,.06,'triangle',.08)],
   ['Tile clack',()=>{noise(.03,2200,3,.35);tone(500,.04,'triangle',.08)}],
   ['Wood block',()=>{tone(700,.05,'triangle',.12);tone(1400,.02,'sine',.04)}],
   ['Plunk',()=>tone(420,.12,'sine',.12,0,280)],
   ['Thump',()=>{noise(.05,700,1.5,.4);tone(300,.08,'triangle',.12,0,200)}],
   ['Marble',()=>{tone(1200,.04,'sine',.06);tone(1800,.03,'sine',.04,.05)}],
   ['Whoosh + tap',()=>{tone(900,.12,'sine',.05,0,300);noise(.04,1500,1,.15,.1)}],
   ['Scrabble tiles',()=>{noise(.02,3000,4,.35);noise(.02,1800,4,.3,.03)}]]},
 {k:'word',name:'Word made',what:'The Hold or Clear pop-up opens',o:[
   ['Ping',()=>tone(880,.06,'sine',.06)],
   ['Two-note chime',()=>{tone(988,.12,'sine',.07);tone(1319,.18,'sine',.06,.1)}],
   ['Bell',()=>bell(1568,0,.06,.4)],
   ['Sparkle',()=>arp([1568,2093,2637],.05,'sine',.05,.1)],
   ['Ta-da',()=>{tone(784,.1,'triangle',.08);tone(1047,.25,'triangle',.08,.1)}],
   ['Question',()=>tone(660,.1,'sine',.07,0,990)],
   ['Glass tap',()=>{tone(2637,.25,'sine',.04);tone(3951,.15,'sine',.02)}],
   ['Doorbell',()=>{tone(1319,.2,'sine',.07);tone(1047,.35,'sine',.07,.22)}]]},
 {k:'clear',name:'Clear a word',what:'Every word you clear',o:[
   ['Two-note',()=>{tone(784,.08,'sine',.1);tone(1046,.12,'sine',.08,.08)}],
   ['Rising arpeggio',()=>arp([523,659,784,1047],.05,'triangle',.07,.1)],
   ['Coin',()=>coin(0)],
   ['Pop pop',()=>{tone(600,.05,'sine',.09,0,1200);tone(800,.05,'sine',.08,.07,1600)}],
   ['Swoosh',()=>{noise(.25,2500,.8,.25);tone(400,.25,'sine',.04,0,1600)}],
   ['Marimba',()=>[784,988,1175].forEach((f,i)=>{tone(f,.18,'sine',.09,i*.06);tone(f*4,.05,'sine',.02,i*.06)})],
   ['Two bells',()=>{bell(1319,0,.06,.4);bell(1760,.08,.05,.4)}],
   ['Arcade',()=>arp([440,880,1760],.04,'square',.04,.06)]]},
 {k:'big',name:'Bonus clear',what:'Added on top for a diagonal, chain, 2× vowel, Final 10 or Clear both',o:[
   ['High sparkle',()=>tone(1318,.14,'sine',.08)],
   ['Coins',()=>coins(5,0)],
   ['Chord',()=>[1047,1319,1568].forEach(f=>tone(f,.4,'triangle',.05))],
   ['Fanfare',()=>arp([784,1047,1319,1568],.07,'square',.04,.12)],
   ['Sweep up',()=>tone(500,.35,'sine',.06,0,2500)],
   ['Bell shower',()=>{for(let k=0;k<5;k++)bell(1568+k*200,k*.05,.04,.3)}],
   ['Power up',()=>arp([523,659,784,1047,1319,1568],.035,'square',.035,.06)],
   ['Harp',()=>arp([523,659,784,988,1175,1568,1976],.04,'sine',.05,.3)]]},
 {k:'star',name:'Star earned',what:'When your score passes a star line',o:[
   ['Twinkle',()=>arp([1568,2093,2637,3136],.06,'sine',.05,.15)],
   ['Chime',()=>bell(2093,0,.06,.6)],
   ['Level up',()=>arp([523,659,784,1047],.08,'square',.05,.1)],
   ['Applause',()=>{for(let k=0;k<24;k++)noise(.02,2000+rnd()*2000,2,.2,k*.03+rnd()*.02)}],
   ['Magic',()=>{tone(800,.5,'sine',.05,0,2400);tone(1200,.5,'sine',.03,.05,3600)}],
   ['Ding ding',()=>{bell(1760,0,.06,.3);bell(1760,.18,.06,.3)}],
   ['Coin shower',()=>coins(10,0)],
   ['None',()=>{}]]},
 {k:'final',name:'Final 10 warning',what:'When 10 letters are left',o:[
   ['Double buzz',()=>{tone(440,.12,'square',.05);tone(440,.12,'square',.05,.18)}],
   ['Alarm',()=>{for(let k=0;k<3;k++)tone(880,.1,'square',.04,k*.15,660)}],
   ['Gong',()=>{tone(392,1,'sine',.1);tone(587,.8,'sine',.04);noise(.05,600,1,.2)}],
   ['Tick tock',()=>{for(let k=0;k<4;k++)noise(.02,k%2?2500:1800,5,.35,k*.25)}],
   ['Drum roll',()=>{for(let k=0;k<16;k++)noise(.03,900,1,.25*(k/16+.3),k*.04)}],
   ['Siren',()=>{tone(600,.3,'square',.04,0,1200);tone(1200,.3,'square',.04,.3,600)}],
   ['Low horn',()=>{tone(294,.25,'sawtooth',.05);tone(294,.4,'sawtooth',.05,.3)}],
   ['Dramatic',()=>arp([440,415,392,370],.12,'triangle',.08,.2)]]},
 {k:'end',name:'Game over',what:'The game ends (any score)',o:[
   ['Two notes down',()=>{tone(523,.12,'sine',.1);tone(392,.2,'sine',.1,.14)}],
   ['Sad trombone',()=>{tone(466,.3,'sawtooth',.05,0,440);tone(440,.3,'sawtooth',.05,.32,415);tone(415,.8,'sawtooth',.05,.64,330)}],
   ['Falling tones',()=>arp([1047,880,698,587,440,349],.13,'square',.05,.14)],
   ['Soft chime',()=>bell(784,0,.06,.8)],
   ['Music box',()=>arp([784,659,587,523],.18,'sine',.06,.3)],
   ['Typewriter bell',()=>{noise(.03,3000,3,.3);bell(2093,.05,.06,.6)}],
   ['Gentle chord',()=>[523,659,784].forEach((f,i)=>tone(f,.8,'sine',.05,i*.08))],
   ['Game over jingle',()=>{arp([784,659,523],.18,'triangle',.08,.2);tone(392,.6,'triangle',.08,.6)}]]},
 {k:'win',name:'Stars at the end',what:'Plays after Game over when you earned a star',o:[
   ['Little fanfare',()=>[[659,.12,0],[784,.12,.13],[1047,.3,.26]].forEach(([f,d,t])=>tone(f,d,'triangle',.08,t))],
   ['Big fanfare',()=>{arp([523,523,523,698,880,1047],.15,'square',.06,.16);tone(1047,.9,'square',.06,.95);tone(1319,.9,'square',.04,.95)}],
   ['Bells',()=>{for(let k=0;k<10;k++)bell(k%2?2349:2093,k*.08,.05,.3)}],
   ['Harp sweep',()=>arp([523,659,784,988,1175,1568,1976,2349],.06,'sine',.06,.5)],
   ['Victory climb',()=>arp([392,523,659,784,1047,1319,1568],.08,'triangle',.07,.2)],
   ['Coin shower',()=>coins(25,0,.04)],
   ['Trumpets',()=>{arp([523,523,523],.12,'sawtooth',.04,.1);tone(698,.6,'sawtooth',.05,.4)}],
   ['Chord swell',()=>[523,659,784,1047].forEach((f,i)=>tone(f,1.2,'triangle',.04,i*.1))]]}];
