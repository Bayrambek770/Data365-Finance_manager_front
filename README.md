# Data365 Finance Manager Frontend

Frontend dashboard for managing business income and expenses.

## Stack

- React (loaded from CDN)
- Babel Standalone (in-browser JSX transform)
- Recharts
- Axios
- Static HTML entrypoint: `index.html`

## Requirements

- Python 3.8+
- Optional backend API at `http://localhost:8000/api/v1`

## Run Locally (Recommended)

This project uses client-side routing (`/dashboard/<code>`), so run with SPA fallback.

From project root:

```bash
python3 - <<'PY'
import http.server, socketserver, os

PORT = 3000
ROOT = '/home/benn/Documents/data365_front'
os.chdir(ROOT)

class SPAHandler(http.server.SimpleHTTPRequestHandler):
	def do_GET(self):
		path = self.path.split('?', 1)[0]
		candidate = path.lstrip('/')
		if path in ('', '/') or os.path.exists(candidate):
			return super().do_GET()
		self.path = '/index.html'
		return super().do_GET()

with socketserver.TCPServer(('127.0.0.1', PORT), SPAHandler) as server:
	print(f'Serving on http://127.0.0.1:{PORT}')
	server.serve_forever()
PY
```

Open:

- `http://127.0.0.1:3000`
- `http://127.0.0.1:3000/dashboard/<your-user-code>`

Example:

- `http://127.0.0.1:3000/dashboard/fNgvk2v1`

## API Configuration

The frontend API base is set in `index.html` and `Xisob.html`:

```html
window.XISOB_API_BASE = "http://localhost:8000/api/v1";
```

If backend is unavailable, parts of the UI can still render from seed data.

## Project Structure

- `index.html` / `Xisob.html`: app shell, global styles, script loading
- `src/components/context.jsx`: data loading and app state
- `src/components/app.jsx`: root app composition
- `src/components/shell.jsx`: sidebar/header layout
- `src/components/overview.jsx`, `transactions.jsx`, `pages.jsx`: main screens
- `src/components/modal.jsx`: add/edit transaction modal
- `src/components/i18n.jsx`: translations

## Troubleshooting

- 404 on `/dashboard/...`: use SPA fallback server above, not plain `python3 -m http.server`.
- Data not updating: ensure backend is running and reachable at `window.XISOB_API_BASE`.
- If port 3000 is busy, stop existing process first or choose another port.
