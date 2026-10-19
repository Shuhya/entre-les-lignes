#!/usr/bin/env python3
# beta_sync.py — met à jour le miroir beta/ sur main + la branche beta.
# La landing GitHub Pages sert main → https://shuhya.github.io/entre-les-lignes/beta/jeu.html
# Usage: python3 beta_sync.py ["message"]
import json, os, sys, urllib.request, urllib.error
# Le PAT n'est JAMAIS stocké dans ce fichier (secret scanning GitHub) :
#   export GITHUB_TOKEN=... && python3 beta_sync.py ["message"]
PAT = os.environ.get("GITHUB_TOKEN") or sys.exit("export GITHUB_TOKEN=<PAT> requis")
R1 = "Shuhya/entre-les-lignes"
MSG = sys.argv[1] if len(sys.argv) > 1 else "beta: sync"
EXCLUDE = (".github/", "scripts/", "build/", "README", "CHANGELOG", ".eslintrc", "beta/")

def api(url, data=None, method=None):
    import time as _t
    last = None
    for attempt in range(4):
        req = urllib.request.Request("https://api.github.com" + url,
            data=json.dumps(data).encode() if data is not None else None,
            method=method or ("POST" if data is not None else "GET"))
        req.add_header("Authorization", "Bearer " + PAT)
        req.add_header("Accept", "application/vnd.github+json")
        req.add_header("User-Agent", "etl")
        try:
            return json.loads(urllib.request.urlopen(req).read() or b"{}")
        except urllib.error.HTTPError as err:
            last = err
            if err.code in (403, 429) or 500 <= err.code < 600:
                _t.sleep(6 * (attempt + 1)); continue
            raise
    raise last

main_sha = api("/repos/%s/git/ref/heads/main" % R1)["object"]["sha"]
head = api("/repos/%s/git/commits/%s" % (R1, main_sha))
tree = api("/repos/%s/git/trees/%s?recursive=1" % (R1, head["tree"]["sha"]))
entries = []
for it in tree.get("tree", []):
    if it["type"] != "blob": continue
    if any(it["path"].startswith(x) or it["path"] == x for x in EXCLUDE): continue
    entries.append({"path": "beta/" + it["path"], "mode": it["mode"], "type": "blob", "sha": it["sha"]})
print("miroir: %d fichiers" % len(entries))
new_tree = api("/repos/%s/git/trees" % R1, {"base_tree": head["tree"]["sha"], "tree": entries})
commit = api("/repos/%s/git/commits" % R1,
    {"message": MSG, "tree": new_tree["sha"], "parents": [main_sha]})
api("/repos/%s/git/refs/heads/main" % R1, {"sha": commit["sha"]}, method="PATCH")
print("MIROIR BETA OK", commit["sha"])

try:
    api("/repos/%s/git/refs" % R1, {"ref": "refs/heads/beta", "sha": commit["sha"]})
    print("BRANCHE BETA créée")
except urllib.error.HTTPError:
    api("/repos/%s/git/refs/heads/beta" % R1, {"sha": commit["sha"]}, method="PATCH")
    print("BRANCHE BETA avancée")
