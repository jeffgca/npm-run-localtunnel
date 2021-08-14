## npm-run-localtunnel

This is a dumb script that leverages child_process.spawn to run `npm run dev` and then run [localtunnel](https://github.com/localtunnel/localtunnel) using a somewhat-randomized port. Ported to JS from a bash script I wrote a few years ago.

### Usage

Run `node /path/to/index.js` in your project directory. 

This script assumes that `npm run dev` is how you start your dev server, and that localtunnel's binary `lt` is somewhere on your path. Eventually I'll re-factor this to just use npm dependencies and JS apis for this but for now child_process.spawn is fine.

### Roadmap

[X] dumbest possible script
[] parameterize the port
[] parameterize the command to run to start the dev server
[] figure out how npx works and support that directly
