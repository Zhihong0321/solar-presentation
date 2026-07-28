const fs = require('fs');
const path = require('path');

const KEY = process.env.MIMO_KEY;
const BASE = 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions';
const clips = ['s0', 's1', 's2', 's3', 's4a', 's4b', 's5a', 's5b', 's5c', 's6', 's7'];

async function genOne(name) {
  const text = fs.readFileSync(path.join(__dirname, name + '.txt'), 'utf8').trim();
  const payload = {
    model: 'mimo-v2.5-tts',
    messages: [
      { role: 'user', content: '沉稳、值得信赖的男性顾问声音，自然对话语速，不快不慢，语气亲切有活力，吐字清晰，句子之间有自然停顿。' },
      { role: 'assistant', content: text }
    ],
    audio: { format: 'wav', voice: '白桦' }
  };
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const status = res.status;
  const json = await res.json();
  if (status !== 200 || !json.choices || !json.choices[0].message.audio) {
    console.error(name, 'FAILED', status, JSON.stringify(json).slice(0, 400));
    return false;
  }
  const b64 = json.choices[0].message.audio.data;
  fs.writeFileSync(path.join(__dirname, name + '.wav'), Buffer.from(b64, 'base64'));
  console.log(name, 'OK', Buffer.from(b64, 'base64').length, 'bytes');
  return true;
}

(async () => {
  for (const c of clips) {
    let ok = false, tries = 0;
    while (!ok && tries < 3) {
      tries++;
      try { ok = await genOne(c); } catch (e) { console.error(c, 'ERR', e.message); }
      if (!ok && tries < 3) await new Promise(r => setTimeout(r, 1500));
    }
    if (!ok) console.error(c, 'GAVE UP');
  }
})();
