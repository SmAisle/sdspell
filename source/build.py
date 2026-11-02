import os
here=os.path.dirname(os.path.abspath(__file__));root=os.path.dirname(here)
snd=open(os.path.join(here,'sounds.js')).read().strip()
s=open(os.path.join(here,'src.html')).read()
w=' '.join(x for x in open(os.path.join(here,'words.txt')).read().split() if len(x)>=3)
open(os.path.join(root,'index.html'),'w').write(s.replace('__SOUNDS__',snd).replace('__WORDS__',w).replace('__GAMES__',open(os.path.join(here,'games-fallback.js')).read().split('\n',1)[1]))
# The sound board uses the same sounds as the game.
os.makedirs(os.path.join(root,'extras'),exist_ok=True)
open(os.path.join(root,'extras','sound-board.html'),'w').write(open(os.path.join(here,'board.html')).read().replace('__SOUNDS__',snd))
