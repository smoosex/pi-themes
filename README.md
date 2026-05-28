# pi-themes

A theme pack for [pi](https://github.com/earendil-works/pi), with file-based switching for paired light/dark theme families.

This package currently includes Everforest. More theme families can be added later by following the same `<family>-light` / `<family>-dark` naming convention.

## Included themes

### Everforest

Medium contrast, default family:

- `everforest-dark`
- `everforest-light`

Hard contrast:

- `everforest-hard-dark`
- `everforest-hard-light`

Soft contrast:

- `everforest-soft-dark`
- `everforest-soft-light`

## How switching works

The running pi extension watches a small control file. When the file changes, the extension reads it and calls `ctx.ui.setTheme(...)` inside pi.

The extension also sets a footer/status key named `pi-themes`, which can be consumed or styled together with other footer plugins.

Default control file:

```text
~/.pi/agent/pi-theme.json
```

Override it with:

```bash
PI_THEME_CONTROL_FILE=/path/to/pi-theme.json
```

## Control file format

Select a paired theme family and appearance:

```json
{
  "family": "everforest",
  "appearance": "dark"
}
```

This switches to:

```text
everforest-dark
```

Set a concrete theme directly:

```json
{
  "theme": "everforest-hard-light"
}
```

External tools can write this file however they like, for example:

```bash
mkdir -p ~/.pi/agent
printf '{"family":"everforest-soft","appearance":"dark"}\n' > ~/.pi/agent/pi-theme.json
printf '{"theme":"everforest-hard-light"}\n' > ~/.pi/agent/pi-theme.json
```

## Pi command

Inside pi, paired-family control is also available through:

```text
/theme everforest dark
/theme everforest light
/theme everforest-hard dark
/theme everforest-soft light
```

The command works with any family that provides both `<family>-light` and `<family>-dark`. For example, if a future `tokyonight-light` / `tokyonight-dark` pair is added, it can be selected with:

```text
/theme tokyonight dark
```

## Environment

```bash
PI_THEME=everforest
PI_THEME_CONTROL_FILE=~/.pi/agent/pi-theme.json
```

`PI_THEME` sets the default family used when the `/theme` command omits a family-specific context. File-based switching itself is driven by the control file.

## Usage

Test locally:

```bash
pi -e ./pi-themes
```

Install globally:

```bash
pi install /absolute/path/to/pi-themes
```

Install for a project:

```bash
pi install ./pi-themes -l
```
