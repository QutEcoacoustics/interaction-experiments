# interaction-experiments

This repo contains a set of interaction experiments the QUT Ecoacoustics lab
runs to test new ideas.

Each experiment is designed for it's own purpose and must have an associated
ethics document before they "go-live".

Importantly, however, experiments that are in devleopment, or no longer
needed are still contained here, and may even still work in production
but will be prevented from storing any of the collected data.

## Install instructions

 1. Clone this repo
 2. Open a shell (PowerShell on Windows, Bash on Mac or Linux)
 3. `cd` to this directory
 4. Install Hugo https://gohugo.io/getting-started/installing/

## Testing instructions

1. In your shell, run the `hugo server` command
2. Edit files in this folder, and see the changes live at <http://localhost:1313/>
3. Use <kbd>Ctrl</kbd>+<kbd>c</kbd> to stop the Hugo server
4. Commit and and Push your changes
5. Wait about 30 seconds and they will be live in production

## Working with the theme

Docs: https://github.com/zwbetz-gh/minimal-bootstrap-hugo-theme

To update the theme:
```
git submodule update --remote --merge
```