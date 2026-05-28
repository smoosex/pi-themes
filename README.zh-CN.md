# pi-themes

一个用于 [pi](https://github.com/earendil-works/pi) 的主题包，支持通过文件监听的方式切换主题。

## 安装

```bash
pi install git:github.com/smoosex/pi-themes
```

当前包含 Everforest 和 Tundra。成对的明暗主题建议使用 `<family>-light` / `<family>-dark` 命名；只有单一风格的主题也可以通过具体主题名直接切换。

## 已包含主题

### Everforest

中等对比度，默认 family：

- `everforest-dark`
- `everforest-light`

高对比度：

- `everforest-hard-dark`
- `everforest-hard-light`

低对比度：

- `everforest-soft-dark`
- `everforest-soft-light`

### Tundra

从 [`sam4llis/nvim-tundra`](https://github.com/sam4llis/nvim-tundra) 的 arctic palette 和 stylesheet 提取：

- `tundra-dark`

Tundra 目前只有暗色主题。

## 切换机制

插件会监听一个小的控制文件。当文件变化时，插件读取其中的配置，并在 pi 内部调用 `ctx.ui.setTheme(...)` 切换主题。

插件还会设置一个 footer/status key：`pi-themes`，可以和其他 footer 插件结合使用或进行样式处理。

默认控制文件：

```text
~/.pi/agent/pi-theme.json
```

可以通过环境变量覆盖：

```bash
PI_THEME_CONTROL_FILE=/path/to/pi-theme.json
```

## 控制文件格式

指定主题 family 和明暗模式：

```json
{
  "family": "everforest",
  "appearance": "dark"
}
```

这会切换到：

```text
everforest-dark
```

也可以直接指定具体主题名：

```json
{
  "theme": "tundra-dark"
}
```

外部程序可以用任何方式写入这个文件，例如：

```bash
mkdir -p ~/.pi/agent
printf '{"family":"everforest-soft","appearance":"dark"}\n' > ~/.pi/agent/pi-theme.json
printf '{"theme":"tundra-dark"}\n' > ~/.pi/agent/pi-theme.json
```

## pi 内部命令

在 pi 内部也可以使用 `/theme` 命令切换主题 family：

```text
/theme everforest        # 默认切到 everforest-dark
/theme everforest light
/theme everforest-hard dark
/theme everforest-soft light
/theme tundra            # 默认切到 tundra-dark
```

命令格式：

```text
/theme <family> [dark|light]
```

如果省略 `dark` 或 `light`，默认使用 `dark`。命令只要求最终目标主题存在，因此像 `tundra-dark` 这种只有暗色版本的主题也可以使用。

注意：插件区分 dark / light 依赖的是主题 JSON 里的 `name` 字段，例如 `everforest-dark`，不是文件名本身。文件名建议与主题名保持一致，方便维护。

## 环境变量

```bash
PI_THEME=everforest
PI_THEME_CONTROL_FILE=~/.pi/agent/pi-theme.json
```

`PI_THEME` 设置默认 family。文件监听切换本身由控制文件驱动。

