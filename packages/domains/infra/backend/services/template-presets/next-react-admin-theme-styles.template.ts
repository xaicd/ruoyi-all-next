export const nextReactAdminThemeStylesTemplate = `:root {
  --admin-bg: #f8fafc;
  --admin-surface: #ffffff;
  --admin-border: #e2e8f0;
  --admin-text: #0f172a;
  --admin-primary: #b42318;
}

.admin-shell {
  background: radial-gradient(circle at top right, #fff4ed 0%, var(--admin-bg) 48%, #eef2ff 100%);
  color: var(--admin-text);
}

.admin-card {
  border: 1px solid var(--admin-border);
  background: var(--admin-surface);
  border-radius: 16px;
}
`