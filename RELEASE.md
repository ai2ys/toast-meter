# Release Checklist

## Before release

- [ ] Run `npm pack`
- [ ] Verify package contents
- [ ] Test install via local path
- [ ] Test install via git ref
- [ ] Check footer display in Pi
- [ ] Check `mode: en` and `mode: de`
- [ ] Check project override `.pi/toast-meter.json`

## Release steps

1. Bump version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Tag release (e.g. `v0.1.0`)
5. Push tag to GitHub
6. Publish install instructions in README

## Post-release

- [ ] Install from git tag with Pi
- [ ] Confirm default config still works
- [ ] Confirm no extra files are packed
