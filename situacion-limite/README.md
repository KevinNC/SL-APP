# Situación Límite

App web estática para anotar una partida física o jugar en un solo dispositivo (pass-and-play). Sirve en celular y escritorio.

## Cómo jugar en la app

1. **Anotar partida física:** nombres, turno y letras A–B–C–D. La app calcula quién mueve y cuántas casillas.
2. **Jugar en la app:** el lector ve la carta y elige en secreto; el resto apuesta en el mismo celular; se revela y las fichas avanzan en el tablero.

Reglas de movimiento: si nadie acierta, nadie avanza. Si hay aciertos, el lector avanza `1 + aciertos` y cada acierto avanza 1.

## Desarrollo

```bash
npm install
npm run dev
```

Build local:

```bash
npm run build
npm run preview
```

## Agregar cartas

Editá [`src/data/cards.json`](src/data/cards.json). Cada carta es un objeto:

```json
{
  "id": "id-unico-sin-espacios",
  "text": "La situación límite.",
  "options": {
    "A": "Opción A",
    "B": "Opción B",
    "C": "Opción C",
    "D": "Opción D"
  }
}
```

Podés pegar objetos nuevos a mano o pedirlos a una IA con este mismo formato. El `id` tiene que ser único.

## GitHub Pages

`vite.config.ts` usa `base: './'`, así el build funciona en la raíz del repo o en un subpath.

1. Creá el repo y subí este proyecto.
2. En el repo: **Settings → Pages → Source = GitHub Actions**.
3. El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publica `dist/` en cada push a `main`.

También podés arrastrar la carpeta `dist/` a Netlify o Cloudflare Pages.

## Datos

La partida activa se guarda en `localStorage` del navegador. No hay servidor ni cuentas.
