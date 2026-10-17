# OwlHacks '26 demo timer

A countdown timer for hackathon demos. Put it on screen when you present.

**Live:** https://owlhacks-timer.vercel.app

Waskar Paulino built it with Claude Code for the "AI-Assisted Building in a Weekend" session at
OwlHacks '26, Temple University, on 09/26/2026. He did not type the code. He ran it after every
change, so he can explain every function in it.

## Use it

1. Pick 1, 2, 3, or 5 minutes.
2. Press Start.
3. Present.

The display turns coral in the last 10 seconds. A bell rings three times at zero.

| Key | Action |
|---|---|
| Space | Start or pause |
| R | Reset |
| F | Full screen |

To test the bell fast, open `index.html?s=5`. The timer then starts from 5 seconds.

## Run it on your machine

No build step and no libraries. It works offline.

```bash
git clone https://github.com/philaconvalley/owlhacks-timer.git
cd owlhacks-timer
open index.html
```

## Change it

- `index.html`: the preset buttons and the page layout.
- `style.css`: the colors and fonts.
- `timer.js`: the countdown, the bell, and the keys. `WARNING_SECONDS` sets when the coral warning starts.

## License

The code uses the MIT license. See `LICENSE`. The fonts in `fonts/` are not covered by `LICENSE`. Baloo 2 and Nunito use the SIL Open Font License 1.1. See `fonts/OFL-Baloo2.txt` and `fonts/OFL-Nunito.txt`.

## PhilaCon Valley

A Philadelphia tech community, by us, for us. Come build with us:
[Discord](https://discord.gg/fxUfeSbFZM).
