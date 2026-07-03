import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\DELL\.gemini\antigravity-ide\brain\7b0cf829-f1a0-44cb-b432-0e418c2ba800\.system_generated\logs\transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f):
        data = json.loads(line)
        step_idx = data.get("step_index")
        content = str(data)
        if "ChairmanController" in content:
            print(f"Step {step_idx}: Type={data.get('type')}, Length={len(content)}")
