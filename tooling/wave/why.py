# Helper for writing <Name>.why.json during the wave runs: quotes the concept's Therefore text exactly.
import json, sys
T = json.load(open('/Users/tanawitch.saentree/.claude/jobs/61286bac/tmp/therefore.json'))
C = 'packages/react/src/components/'
def dump(p, o): open(p, 'w').write(json.dumps(o, indent=2, ensure_ascii=False) + '\n')
def derived(name, concept, avoid, kind, why_not, refs, steps, lab, options, picked, reason, parts, states=None, motion=None):
    d = {"concept": concept, "default_to_avoid": [{"pattern": avoid, "kind": kind, "why_not": why_not}], "references": [{"title": t, "url": u} for t, u in refs],
         "derivation": [{"p": k.split('.')[0], "axis": k.split('.')[1], "consequence": T[k], "form": f} for k, f in steps],
         "variants": {"lab": lab, "section": name.lower(), "options": options, "picked": picked, "by": "agent", "reason": reason},
         "parts": {k: {"p": p, "axis": a, "why": w} for k, (p, a, w) in parts.items()},
         "states": {k: {"p": p, "axis": a, "why": w} for k, (p, a, w) in (states or {}).items()},
         "motion": {k: {"p": p, "axis": a, "why": w} for k, (p, a, w) in (motion or {}).items()}}
    dump(C + f'{name}/{name}.why.json', d)
def identity(name, reason, concept, parts, states=None):
    d = {"identity": False, "identity_reason": reason, "concept": concept, "parts": {k: {"p": p, "axis": a, "why": w} for k, (p, a, w) in parts.items()},
         "states": {k: {"p": p, "axis": a, "why": w} for k, (p, a, w) in (states or {}).items()}, "motion": {}}
    dump(C + f'{name}/{name}.why.json', d)
