#!/usr/bin/env python3
"""
Builds the self-contained single-file HTML5 + Three.js r128 bundle
from the modular TypeScript source under src/, writing both:
  - dist/index.html
  - ../../output/oficina-dos-gestos-compartilhados.html
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
DIST_DIR = os.path.join(ROOT, "dist")
OUTPUT_HTML = os.path.abspath(os.path.join(ROOT, "..", "..", "output", "oficina-dos-gestos-compartilhados.html"))

ORDER = [
    "core/textures.ts",
    "core/audio.ts",
    "physics/kernels.ts",
    "core/state.ts",
    "scene/atelierEnvironment.ts",
    "stations/paintStation.ts",
    "stations/clayStation.ts",
    "stations/sandStation.ts",
    "stations/ribbonsStation.ts",
    "stations/rhythmStation.ts",
    "main.ts",
]

def remove_balanced_blocks(code: str, pattern: str) -> str:
    out = []
    i = 0
    n = len(code)
    for m in re.finditer(pattern, code, flags=re.MULTILINE):
        if m.start() < i:
            continue
        out.append(code[i:m.start()])
        j = m.end()
        while j < n and code[j] not in '{;':
            j += 1
        if j < n and code[j] == ';':
            i = j + 1
        elif j < n and code[j] == '{':
            depth = 1
            j += 1
            while j < n and depth > 0:
                if code[j] == '{':
                    depth += 1
                elif code[j] == '}':
                    depth -= 1
                j += 1
            if j < n and code[j] == ';':
                j += 1
            i = j
        else:
            i = j
    out.append(code[i:])
    return "".join(out)

def strip_param_list(params: str) -> str:
    """Strip TypeScript `: Type` annotations from a function/method parameter list safely."""
    res = []
    i = 0
    n = len(params)
    depth_angle = 0
    depth_paren = 0
    depth_brace = 0
    depth_bracket = 0
    while i < n:
        ch = params[i]
        if ch == '<':
            depth_angle += 1
        elif ch == '>' and depth_angle > 0:
            depth_angle -= 1
        elif ch == '(':
            depth_paren += 1
        elif ch == ')' and depth_paren > 0:
            depth_paren -= 1
        elif ch == '{':
            depth_brace += 1
        elif ch == '}' and depth_brace > 0:
            depth_brace -= 1
        elif ch == '[':
            depth_bracket += 1
        elif ch == ']' and depth_bracket > 0:
            depth_bracket -= 1

        if ch == ':' and depth_angle == 0 and depth_paren == 0 and depth_brace == 0 and depth_bracket == 0:
            # Check if previous token is optional `?`
            if res and res[-1] == '?':
                res.pop()
            # Skip type until `,` or `=` at depth 0
            i += 1
            da = dp = db = dk = 0
            in_str = None
            while i < n:
                c = params[i]
                if in_str:
                    if c == in_str and params[i - 1] != '\\':
                        in_str = None
                else:
                    if c in ("'", '"', '`'):
                        in_str = c
                    elif c == '<':
                        da += 1
                    elif c == '>' and da > 0:
                        da -= 1
                    elif c == '(':
                        dp += 1
                    elif c == ')' and dp > 0:
                        dp -= 1
                    elif c == '{':
                        db += 1
                    elif c == '}' and db > 0:
                        db -= 1
                    elif c == '[':
                        dk += 1
                    elif c == ']' and dk > 0:
                        dk -= 1
                    elif (c == ',' or (c == '=' and params[i:i+2] != '=>')) and da == 0 and dp == 0 and db == 0 and dk == 0:
                        break
                i += 1
            continue
        res.append(ch)
        i += 1
    return "".join(res)

def strip_ts_to_js(code: str) -> str:
    # 1. Remove import statements
    code = re.sub(r'^import\s+[\s\S]*?from\s+[\'"][^\'"]+[\'"];\s*\n?', '', code, flags=re.MULTILINE)
    # 2. Remove interface and type declarations
    code = remove_balanced_blocks(code, r'^\s*(?:export\s+)?(?:interface|type)\s+\w+(?:\s*<[^>]+>)?\s*(?:=\s*)?')
    # 3. Remove export keywords on values
    code = re.sub(r'\bexport\s+(async\s+)?(function|class|const|let|var)\b', r'\1\2', code)
    code = code.replace('(window as unknown as { Imersivo?: { returnToCatalog?: () => void } })', 'window')
    # 4. Remove `as const` and `as Type` assertions
    code = re.sub(r'\s+as\s+const\b', '', code)
    code = re.sub(r'\s+as\s+(?:THREE\.\w+|HTML\w+Element|Record<[^>]+>|unknown|number|string|boolean|ABAConfig|SculptOp|StationId|ExperienceMode(?:\[\])?|QualityPreset|ParticipantId|RhythmHitResult\s*\|\s*undefined|RhythmHitResult|\'[^\']+\'(?:\s*\|\s*\'[^\']+\')*)', '', code)
    code = re.sub(r'\s+as\s+\{[^}]+\}', '', code)
    # 5. Remove non-null assertions `!`
    code = re.sub(r'([a-zA-Z0-9_\]\)])!\.', r'\1.', code)
    code = re.sub(r'([a-zA-Z0-9_\]\)])!;', r'\1;', code)
    code = re.sub(r'([a-zA-Z0-9_\]\)])!,', r'\1,', code)
    # 6. Remove class property modifiers & field type-only declarations (only 2-space indented class fields)
    code = re.sub(r'^  (?:private|public|protected)\s+(?:readonly\s+)?([a-zA-Z_]\w*)\s*:\s*[^=;\n]+;', '', code, flags=re.MULTILINE)
    code = re.sub(r'^  (?:private|public|protected)\s+(?:readonly\s+)?(?=[a-zA-Z_]\w*\s*[=(])', '  ', code, flags=re.MULTILINE)
    code = re.sub(r'^  (?:private|public|protected)\s+(?:readonly\s+)?([a-zA-Z_]\w*)\s*:\s*(?:[^=;\n]|=>)+(\s*=)', r'  \1\2', code, flags=re.MULTILINE)
    code = re.sub(r'\breadonly\s+(?=[a-zA-Z_]\w*\s*:)', '', code)
    # 7. Remove `const/let/var x: Type =`
    code = re.sub(r'^(\s*(?:const|let|var)\s+[a-zA-Z_]\w*)\s*:\s*[^=\n]+(\s*=)', r'\1\2', code, flags=re.MULTILINE)
    # 8. Strip function/method/arrow parameter types and return types
    # Match `function name(params): ReturnType {` or `  methodName(params): ReturnType {` or `(params): ReturnType =>`
    def replace_fn_sig(m):
        prefix = m.group(1)
        params = strip_param_list(m.group(2))
        suffix = m.group(3)
        return f"{prefix}({params}){suffix}"

    def strip_balanced_fn_sigs(text):
        out = []
        i = 0
        n = len(text)
        pat = re.compile(r'(\bfunction\s+[a-zA-Z_]\w*|\bconstructor|\b[a-zA-Z_]\w*)\(')
        while i < n:
            m = pat.search(text, i)
            if not m:
                out.append(text[i:])
                break
            name_part = m.group(1)
            if name_part in ('if', 'for', 'while', 'switch', 'catch', 'return', 'typeof', 'new'):
                out.append(text[i:m.end()])
                i = m.end()
                continue
            # Find matching ')'
            j = m.end()
            depth = 1
            in_str = None
            while j < n and depth > 0:
                c = text[j]
                if in_str:
                    if c == in_str and text[j - 1] != '\\':
                        in_str = None
                else:
                    if c in ("'", '"', '`'):
                        in_str = c
                    elif c == '(':
                        depth += 1
                    elif c == ')':
                        depth -= 1
                j += 1
            if depth != 0:
                out.append(text[i:m.end()])
                i = m.end()
                continue
            params_raw = text[m.end():j - 1]
            rest = text[j:]
            # Check for optional `: ReturnType` (including multi-line `{ ... }` return type) followed by `{`
            k = 0
            rn = len(rest)
            while k < rn and rest[k] in ' \t\r\n':
                k += 1
            if k < rn and rest[k] == ':':
                k += 1
                bdepth = 0
                adepth = 0
                pdepth = 0
                while k < rn:
                    rc = rest[k]
                    if rc == '<': adepth += 1
                    elif rc == '>' and adepth > 0: adepth -= 1
                    elif rc == '(': pdepth += 1
                    elif rc == ')' and pdepth > 0: pdepth -= 1
                    elif rc == '{':
                        if bdepth == 0 and adepth == 0 and pdepth == 0:
                            # Look ahead to see if this `{` is an object return type (ends with `} {`) or the function body
                            # Scan balanced `{...}` and check if followed by `{`
                            t = k + 1
                            td = 1
                            while t < rn and td > 0:
                                if rest[t] == '{': td += 1
                                elif rest[t] == '}': td -= 1
                                t += 1
                            u = t
                            while u < rn and rest[u] in ' \t\r\n':
                                u += 1
                            if u < rn and rest[u] == '{':
                                k = u
                                break
                            else:
                                break
                        bdepth += 1
                    elif rc == ';' and bdepth == 0 and adepth == 0 and pdepth == 0:
                        break
                    elif rc == '}' and bdepth > 0:
                        bdepth -= 1
                    k += 1
                if k < rn and rest[k] == '{':
                    out.append(text[i:m.start()])
                    out.append(f"{name_part}({strip_param_list(params_raw)}) {{")
                    i = j + k + 1
                    continue
            elif k < rn and rest[k] == '{':
                out.append(text[i:m.start()])
                out.append(f"{name_part}({strip_param_list(params_raw)}) {{")
                i = j + k + 1
                continue
            out.append(text[i:m.end()])
            i = m.end()
        return "".join(out)
    code = strip_balanced_fn_sigs(code)
    # Arrow functions `(a: Type, b: Type) =>` or `(a: Type): Ret =>`
    for _ in range(3):
        code = re.sub(
            r'(?<=[=\(,\s])\(([^()]*:[^()]*)\)(?:\s*:\s*[^=>\n]+)?(\s*=>)',
            lambda m: f"({strip_param_list(m.group(1))}){m.group(2)}",
            code
        )
    # 9. Remove generic type arguments on DOM queries
    code = re.sub(r'document\.querySelectorAll<[^>]+>', 'document.querySelectorAll', code)
    return code

def main():
    with open(os.path.join(ROOT, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()
    with open(os.path.join(SRC, "styles.css"), "r", encoding="utf-8") as f:
        css = f.read()

    js_parts = []
    for rel in ORDER:
        with open(os.path.join(SRC, rel), "r", encoding="utf-8") as f:
            raw = f.read()
        js_parts.append(f"// === {rel} ===\n" + strip_ts_to_js(raw))

    bundled_js = "\n".join(js_parts)
    html = html.replace(
        '<link rel="stylesheet" href="./src/styles.css" />',
        f"<style>\n{css}\n</style>"
    )
    html = html.replace(
        '<script type="module" src="./src/main.ts"></script>',
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'
        f'<script>\n(function() {{\n"use strict";\n{bundled_js}\n}})();\n</script>'
    )

    os.makedirs(DIST_DIR, exist_ok=True)
    dist_html = os.path.join(DIST_DIR, "index.html")
    with open(dist_html, "w", encoding="utf-8") as f:
        f.write(html)

    os.makedirs(os.path.dirname(OUTPUT_HTML), exist_ok=True)
    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Built {dist_html} and {OUTPUT_HTML} ({len(html)} bytes)")

if __name__ == "__main__":
    main()
