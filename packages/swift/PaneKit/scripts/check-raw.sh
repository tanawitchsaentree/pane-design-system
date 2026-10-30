#!/bin/sh
# Fails if a component writes a raw design value: a hex colour, or a number in a size, padding, radius,
# spacing, font size, opacity or shadow call. Every value comes from PaneTokens (iron rule 1).
here="$(cd "$(dirname "$0")/.." && pwd)"
hits=$(grep -rnE '#[0-9A-Fa-f]{6}|Color\((red|white|\.sRGB)|\b(padding|frame|cornerRadius|spacing|size|opacity|lineWidth|radius|blur)\s*[:(]\s*-?[0-9]+(\.[0-9]+)?\b' "$here/Sources/PaneKit/Components" "$here/Sources/PaneKit/Foundation" | grep -v '// raw-ok' )
if [ -n "$hits" ]; then echo "$hits" | head -20; echo "✗ raw values in PaneKit: $(echo "$hits" | wc -l | tr -d ' ')"; exit 1; fi
echo "✓ PaneKit: no raw design values"
