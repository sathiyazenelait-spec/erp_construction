import json
import sys

# Reconfigure stdout to use utf-8
sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\DELL\.gemini\antigravity-ide\brain\7b0cf829-f1a0-44cb-b432-0e418c2ba800\.system_generated\logs\transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f):
        data = json.loads(line)
        step_idx = data.get("step_index")
        content = data.get("content", "")
        if "ChairmanController" in content and len(content) > 100:
            print(f"--- Step {step_idx} (Line {line_num}) Length: {len(content)} ---")
            print(content[:500])
            print("...")
            print(content[-500:])
