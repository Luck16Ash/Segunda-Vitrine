#!/usr/bin/env bash
# Baixa logotipos oficiais (Simple Icons) para assets/icons/. Rode uma vez, com internet: bash scripts/baixar-icones.sh
cd "$(dirname "$0")/../assets/icons" || exit 1
for s in postgresql springboot powerbi excel html5 css3 javascript python mysql mongodb git github react openjdk nodedotjs php; do
  curl -fsSL "https://cdn.simpleicons.org/$s" -o "$s.svg" && echo "ok $s" || echo "falhou $s"
done
