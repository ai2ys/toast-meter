#!/usr/bin/env bash
# Claude Code statusline command with toast-meter-style context display
set -u

input="$(cat)"
cwd="$(echo "$input" | jq -r '.cwd // .workspace.current_dir // empty')"
[ -z "$cwd" ] && cwd="$(pwd)"

total_tokens="$(echo "$input" | jq -r '.context_window.total_input_tokens // empty')"
mode="${TOAST_METER_MODE:-en}"
show_text="${TOAST_METER_SHOW_TEXT:-1}"

case "$mode" in
  de)
    label="Dumm wie Brot"
    icons=("🧠🧠🧠🧠" "🧠🧠🧠🍞" "🧠🧠🍞🍞" "🧠🍞🍞🍞" "🍞🍞🍞🍞" "🏠🔥")
    ;;
  *)
    label="Dumb as a Brick"
    icons=("🧠🧠🧠🧠" "🧠🧠🧠🧱" "🧠🧠🧱🧱" "🧠🧱🧱🧱" "🧱🧱🧱🧱" "🏠🔥")
    ;;
esac

thresholds=(80000 100000 120000 140000 150000)
final_label="House is on fire"

meter_for_tokens() {
  local tokens="$1"
  local icon="${icons[0]}"
  local i

  for i in "${!thresholds[@]}"; do
    if [ "$tokens" -ge "${thresholds[$i]}" ] 2>/dev/null; then
      icon="${icons[$((i + 1))]}"
    fi
  done

  local k=$((tokens / 1000))
  local text_label="$label"
  if [ "$tokens" -ge "${thresholds[4]}" ] 2>/dev/null; then
    text_label="$final_label"
  fi

  if [ "$show_text" = "0" ] || [ "$show_text" = "false" ]; then
    printf '\033[00;33m%sk\033[00m \033[00;32m%s\033[00m' "$k" "$icon"
  else
    printf '\033[00;33m%sk\033[00m \033[00;32m%s\033[00m \033[00;90m•\033[00m \033[00;37m%s\033[00m' "$k" "$icon" "$text_label"
  fi
}

display_path="$cwd"
case "$display_path" in
  "$HOME"/*) display_path="~${display_path#"$HOME"}" ;;
esac

branch="$(git -C "$cwd" rev-parse --abbrev-ref HEAD 2>/dev/null)"
if [ -n "$branch" ] && [ "$branch" != "HEAD" ]; then
  prefix=$(printf '\033[01;34m%s\033[00m \033[00;32m(%s)\033[00m' "$display_path" "$branch")
else
  short_sha="$(git -C "$cwd" rev-parse --short HEAD 2>/dev/null)"
  if [ -n "$short_sha" ]; then
    prefix=$(printf '\033[01;34m%s\033[00m \033[00;32m(%s)\033[00m' "$display_path" "$short_sha")
  else
    prefix=$(printf '\033[01;34m%s\033[00m' "$display_path")
  fi
fi

if [ -n "$total_tokens" ] && [ "$total_tokens" -gt 0 ] 2>/dev/null; then
  printf '%s %s' "$prefix" "$(meter_for_tokens "$total_tokens")"
else
  printf '%s %s' "$prefix" "\033[00;33m?\033[00m \033[00;32m${icons[0]}\033[00m \033[00;90m•\033[00m \033[00;37m${label}\033[00m"
fi
