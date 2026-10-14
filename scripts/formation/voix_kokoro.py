"""Voix off de la Formation : synthèse neuronale française (Kokoro-82M, voix ff_siwis) de phrases → MP3.

Appelé par scripts/formation/voix.mjs : lit sur l'entrée standard une liste JSON [{"h": empreinte, "t": texte}],
écrit app/voix/<h>.mp3 (24 kHz mono, 48 kb/s) et renvoie sur la sortie standard {empreinte: durée en ms}.
Prérequis (voir scripts/formation/README.md) : pip install kokoro-onnx onnxruntime ; ffmpeg ;
KOKORO_MODEL = modèle ONNX fp16 (npm kokoro-fp16-shards, parts concaténées) ; KOKORO_VOICE = voices/ff_siwis.bin (npm kokoro-js).
"""
import json, os, re, subprocess, sys, tempfile, wave
import numpy as np
import onnxruntime as ort
from kokoro_onnx.tokenizer import Tokenizer

MODEL = os.environ.get('KOKORO_MODEL', 'kokoro-fp16.onnx')
VOICE = os.environ.get('KOKORO_VOICE', 'ff_siwis.bin')
OUT = sys.argv[1]
SPEED = float(os.environ.get('KOKORO_SPEED', '1.0'))

sess = ort.InferenceSession(MODEL, providers=['CPUExecutionProvider'])
voice = np.fromfile(VOICE, dtype=np.float32).reshape(-1, 1, 256)
tok = Tokenizer()

def say(text):
    # Petites retouches de prononciation pour les termes du CRM.
    t = text.replace('CRM', 'C R M').replace('Ctrl', 'Contrôle').replace('PDF', 'P D F').replace('MRR', 'M R R').replace('CSV', 'C S V')
    t = t.replace('RDV', 'rendez-vous').replace('e-mail', 'email').replace('SIRET', 'siret').replace('KPI', 'indicateurs').replace('·', ',')
    t = t.replace('’', "'")
    ph = tok.phonemize(t, lang='fr-fr')
    ph = re.sub(r'\((en|fr)\)', '', ph)
    ids = tok.tokenize(ph)[:509]
    style = voice[min(len(ids), len(voice) - 1)]
    wav = sess.run(None, {'input_ids': np.array([[0] + ids + [0]], dtype=np.int64), 'style': style.astype(np.float32), 'speed': np.array([SPEED], dtype=np.float32)})[0]
    return np.squeeze(wav)

items = json.load(sys.stdin)
res = {}
for it in items:
    w = say(it['t'])
    # Silence de fin retiré, 80 ms gardés.
    nz = np.where(np.abs(w) > 0.008)[0]
    if len(nz): w = w[max(0, nz[0] - 1200): min(len(w), nz[-1] + 1920)]
    pcm = (np.clip(w, -1, 1) * 32767).astype(np.int16)
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
        with wave.open(f.name, 'wb') as wf:
            wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(24000); wf.writeframes(pcm.tobytes())
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f.name, '-ac', '1', '-ar', '24000', '-b:a', '48k', os.path.join(OUT, it['h'] + '.mp3')], check=True)
        os.unlink(f.name)
    res[it['h']] = int(round(len(pcm) / 24.0))
    print(f"  {it['h']} {res[it['h']]} ms  {it['t'][:70]}", file=sys.stderr, flush=True)
print(json.dumps(res))
