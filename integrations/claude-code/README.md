# Claude Code integration

Alternative `toast-meter` integration for users who cannot use the Pi agent extension.

Example output:

```text
~/project/toast-meter (main) 121k 🧠🧱🧱🧱 • Dumb as a Brick
```

## Requirements

- `bash`
- `jq`
- `git`

## Install

1. Copy the script into your Claude config directory:

   ```bash
   cp integrations/claude-code/statusline-command.sh ~/.claude/statusline-command.sh
   chmod +x ~/.claude/statusline-command.sh
   ```

2. Add this to `~/.claude/settings.json`:

   ```json
   {
     "statusLine": {
       "type": "command",
       "command": "bash ~/.claude/statusline-command.sh"
     }
   }
   ```

3. Restart Claude Code.

## Optional

```bash
export TOAST_METER_MODE=de
export TOAST_METER_SHOW_TEXT=1
```

## Notes

- This is separate from the Pi extension.
- It is not loaded by Pi.
- It is not part of the published package.
