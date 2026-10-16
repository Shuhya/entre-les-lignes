import re
#!/usr/bin/env python3
"""Régénère le fichier unique jouable (export) depuis l'architecture du repo.
Usage : python3 build/build-single.py  →  dist/entre-les-lignes.html"""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "dist")
os.makedirs(OUT, exist_ok=True)

def read(p): return open(os.path.join(ROOT, p), encoding="utf-8").read()
def b64(path): return base64.b64encode(open(os.path.join(ROOT, path), "rb").read()).decode()

img_keys = ["menu","gare","train","pluie","aube","mer","carnet","champ","voiture","cafe","bureau","grange","ormes","archives","vaubris","appart","quai9"]
av = {"AVF1": "av-c", "AVF2": "av-j", "AVM1": "av-n", "AVF3": "av-cora", "AVF4": "av-yasmine"}

assets = ('const RAIN="%s";\n' % b64("assets/audio/pluie.mp3")
    + 'const IMG={' + ",".join('%s:"data:image/jpeg;base64,%s"' % (k, b64(f"assets/img/{k}.jpg")) for k in img_keys) + '};\n'
    + 'IMG.nuit=IMG.gare;\n'
    + 'const %s;' % ",".join('%s="data:image/jpeg;base64,%s"' % (n, b64(f"assets/img/{f}.jpg")) for n, f in av.items()))

engine = read("js/engine.js")
# replacer le fetch par le décodage base64 (le son est embarqué)
i_rb = engine.find("const rainBuf=")
j_rb = engine.find("}));", i_rb)
assert i_rb >= 0 and j_rb > i_rb, "rainBuf fetch introuvable"
new_rb = engine[i_rb:j_rb+4]
old_rb = ('const b64buf=s=>{const r=atob(s),u=new Uint8Array(r.length);for(let i=0;i<r.length;i++)u[i]=r.charCodeAt(i);return u.buffer};\n'
          'const rainBuf=()=>RB||(RB=new Promise(res=>{try{ac.decodeAudioData(b64buf(RAIN),res,()=>res(null))}catch(e){res(null)}}));')
assert "fetch(" in new_rb, "rainBuf fetch introuvable"
engine = engine.replace(new_rb, old_rb)

single = read("index.html")
single = re.sub(r'<link rel="stylesheet" href="css/style.css(\?v=[^"]*)?">', "<style>\n%s\n</style>" % read("css/style.css"), single)
single = re.sub(r'<script src="js/assets.js(\?v=[^"]*)?"></script>', lambda m: "<script>\n%s\n</script>" % assets, single)
single = re.sub(r'<script src="js/story.js(\?v=[^"]*)?"></script>', lambda m: "<script>\n%s\n</script>" % read("js/story.js"), single)
single = re.sub(r'<script src="js/engine.js(\?v=[^"]*)?"></script>', lambda m: "<script>\n%s\n</script>" % engine, single)
assert "src=\"js/" not in single and "href=\"css" not in single, "refs externes restantes"
out_path = os.path.join(OUT, "entre-les-lignes.html")
open(out_path, "w", encoding="utf-8").write(single)
print("OK :", out_path, len(single)//1024, "Ko")
