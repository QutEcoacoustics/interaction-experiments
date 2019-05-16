# interaction-experiments

[![Netlify Status](https://api.netlify.com/api/v1/badges/accae919-9963-4757-9d8c-fd0c8da7d139/deploy-status)](https://app.netlify.com/sites/qut-ecoacoustics-interaction-experiments/deploys)

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

## Editing code

Please use Visual Studio Code to make changes to these files.
Open this folder as a workspace and it will automatically suggest extensions to install.

**Most importantly**: do not mass format a file because you do not like how it is formatted.
This can produce confusing diffs and unnecessarily large commits.

See `.editorConfig` and `.eslintrc.yml` for established style rules.

You don't need _eslint_ installed. The files in the solution are already formatted well,
so just try to maintain the style you see.

However, if you want  to use the eslint extension, then:

1. Ensure you have a revent version of _node_ installed
2. Install _eslint_ with `npm install -g eslint`
3. If your workspace is open, you will need to re-open it
