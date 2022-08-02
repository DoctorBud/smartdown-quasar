## SQ - Smartdown Quasar

This note illustrates some of the Smartdown capabilities unique to the Smartdown Quasar application.

### The `SQ` global variable

Available via `window.SQ` or simply `SQ`.

### Controlling the toolbar

- `SQ.setToolbarTransparency(transparency)`
- `SQ.setToolbarVisibility(visibility)`
- `SQ.setToolbarFade(fade)`
- `SQ.addToolbarItem(???)` (NYI)
- `SQ.removeToolbarItem(???)` (NYI)

#### Live Example

- [Toolbar Transparent](:XToolbarTransparent)
- [Toolbar Visible](:XToolbarVisible)
- [Toolbar Fade](:XToolbarFade)

```javascript /playable/autoplay
smartdown.set({
  ToolbarVisible: true,
  ToolbarTransparent: false,
  ToolbarFade: false});

this.dependOn.ToolbarTransparent = (x) => {
  SQ.setToolbarTransparency(env.ToolbarTransparent);
};

this.dependOn.ToolbarVisible = (x) => {
  SQ.setToolbarVisibility(env.ToolbarVisible);
};

this.dependOn.ToolbarFade = (x) => {
  SQ.setToolbarFade(env.ToolbarFade);
};
```
