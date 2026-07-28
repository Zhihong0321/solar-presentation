import json
import os
import urllib.request
import urllib.error

def get_minimax_api_key():
    api_key = os.environ.get("MINIMAX_API_KEY")
    if api_key:
        return api_key
    vault_path = r"C:\Users\Eternalgy\.hermes\vault.json"
    if os.path.exists(vault_path):
        with open(vault_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            for cred in data.get("credentials", []):
                if cred.get("id") in ["minimax", "minimax-2.7-hspeed"]:
                    return cred.get("credential")
    return None

CLIPS_EN = {
    "s0.mp3": "Hi — and thank you for your time. In the next two minutes, I'll show you exactly what solar can do for your home… and why it matters who installs it.",
    "s1.mp3": "Right now, your electricity bill averages three hundred and eighty ringgit a month. With solar… that drops to around ninety-five. That's a seventy-five percent saving — every single month, for decades to come.",
    "s2.mp3": "And this number is not a guess. Your panels will generate around eight hundred and sixty kilowatt-hours a month. About forty percent powers your home directly during the day — the rest is exported to the grid for credit, calculated against your actual TNB tariff, rate by rate.",
    "s3.mp3": "Here's the system that does it. Thirteen JinkoSolar panels — six hundred and fifty watts each, Tier-one, N-type — paired with an SAJ inverter. Eight-point-four-five kilowatts, sized precisely for your roof and your usage.",
    "s4a.mp3": "Now — before you compare quotes, one thing you deserve to know. The most common trick in this industry is overclaimed savings. Even a small exaggeration — just fifty ringgit a month — compounds to over twelve thousand ringgit that never arrives, across your system's lifetime.",
    "s4b.mp3": "That's why we built Malaysia's first solar simulator. Your forecast is calculated on your actual TNB tariff structure. The numbers you saw just now? They're not estimates.",
    "s5a.mp3": "Second — let me ask you something. When we don't understand a product… we pick the cheapest. When we truly understand it — we avoid the cheapest. So… are you looking for the cheapest right now?",
    "s5b.mp3": "Because this system will sit on your roof for fifteen to twenty years. Cheap components fail early. At best, a dead system. At worst… a fire, on your own home.",
    "s5c.mp3": "Remember this: a real bargain is honesty. What's truly expensive… is risk.",
    "s6.mp3": "And third — we don't disappear after installation. Our in-house roof maintenance team responds to any roof issue, for the life of your system. One hundred and forty projects in a single month. Every roof type in Malaysia. Certified by SEDA, CIDB, and MyHIJAU.",
    "s7.mp3": "So here it is — panels, inverter, installation, and every warranty — at twenty-four thousand two hundred ringgit after discount. Payback in around six years. Everything after that… is pure savings. Shall we get your roof assessed?"
}

def generate_clip(filename, text, api_key, output_dir):
    url = "https://api.minimax.io/v1/t2a_v2"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "speech-02-hd",
        "text": text,
        "stream": False,
        "voice_setting": {
            "voice_id": "English_expressive_narrator",
            "speed": 1.0,
            "vol": 1.0,
            "pitch": 0
        },
        "audio_setting": {
            "sample_rate": 32000,
            "bitrate": 128000,
            "format": "mp3",
            "channel": 1
        }
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            base_resp = data.get("base_resp", {})
            if base_resp.get("status_code") == 0 and "data" in data and "audio" in data["data"]:
                hex_audio = data["data"]["audio"]
                audio_bytes = bytes.fromhex(hex_audio)
                out_path = os.path.join(output_dir, filename)
                with open(out_path, "wb") as f:
                    f.write(audio_bytes)
                size_kb = len(audio_bytes) / 1024
                print(f"✓ Generated {filename} ({size_kb:.1f} KB)")
            else:
                print(f"✗ Failed {filename}: {base_resp}")
    except Exception as e:
        print(f"✗ Error generating {filename}: {e}")

def main():
    api_key = get_minimax_api_key()
    output_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "web", "public", "narration"))
    os.makedirs(output_dir, exist_ok=True)
    print(f"Generating MiniMax TTS audio clips into: {output_dir}")
    for filename, text in CLIPS_EN.items():
        generate_clip(filename, text, api_key, output_dir)
    print("MiniMax TTS audio generation complete!")

if __name__ == "__main__":
    main()
