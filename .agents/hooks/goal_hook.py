import sys
import json
import os

def read_input():
    try:
        raw = sys.stdin.read()
        if raw.strip():
            return json.loads(raw)
    except Exception:
        pass
    return {}

def handle_pre_invocation(data):
    transcript_path = data.get("transcriptPath", "")
    is_goal = False
    goal_text = ""

    if transcript_path and os.path.exists(transcript_path):
        try:
            with open(transcript_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                for line in reversed(lines):
                    line_data = json.loads(line)
                    if line_data.get("type") == "USER_INPUT":
                        content = line_data.get("content", "")
                        if "/goal" in content.lower() or content.strip().startswith("/goal"):
                            is_goal = True
                            goal_text = content.strip()
                            break
                        # Stop checking older user inputs
                        break
        except Exception:
            pass

    if is_goal:
        instruction = (
            "[GOAL HOOK ACTIVATED]\n"
            "A '/goal' workflow has been initiated: " + goal_text + "\n"
            "MANDATORY REQUIREMENT: All agents have access to global skills and MCP tools and MUST leverage them mandatorily.\n"
            "Execute the autonomous 4-agent pipeline:\n"
            "1. SCOUT AGENT: Search for global skills, workspace skills, and MCPs required for the project. Designate mandatory skills/MCPs and hand off findings to Architect Agent.\n"
            "2. ARCHITECT AGENT: Produce PRD, Design Document (color theme, buttons, animations), Architecture Document, and mandatory Skill/MCP integration specs. Hand off to Dev Agent.\n"
            "3. DEV AGENT: Build full solution matching Architect PRD/Design/Architecture, strictly utilizing designated global skills and MCP tools. Once built, hand off to QA Agent.\n"
            "4. QA AGENT: Validate completely against Architect specs, audit global skill and MCP utilization, generate Deficiency Checklist, tag and message responsible agents (Dev/Architect/Scout) via send_message to fix deficiencies, and re-validate until 100% passed.\n"
            "Agents must communicate with each other using send_message. The pipeline is only complete when QA signs off."
        )
        output = {
            "injectSteps": [
                {
                    "ephemeralMessage": instruction
                }
            ]
        }
    else:
        output = {
            "injectSteps": []
        }

    sys.stdout.write(json.dumps(output))

def handle_stop(data):
    output = {
        "decision": "allow"
    }
    sys.stdout.write(json.dumps(output))

def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "pre_invocation"
    data = read_input()
    if mode == "pre_invocation":
        handle_pre_invocation(data)
    elif mode == "stop":
        handle_stop(data)
    else:
        sys.stdout.write(json.dumps({}))

if __name__ == "__main__":
    main()
