const { spawn } = require('child_process');
const opn = require('better-opn');

/** 
 * Get a random-ish port number to run on. Running this script multiple times 
 * in fails hard in some cases where a binding on a port hasn't been released 
 * by the OS yet.
 * 
 * @int base: a number greater than 1024 that we use as the base of our range 
 */

function get_random_port(base=3000) {
  if (base < 1024) throw `Error: we don't try to bind to ports below 1024, you passed in ${base}`;
  return base + Math.round((Math.random() * 100));
}

function run_dev() {
  let localdev, prefix = 'server>';
  return new Promise((resolve, reject) => {
    try {
      localdev = spawn('npm', ['run', 'dev']);

      localdev.stdout.on('data', (data) => {
        data = String(data).trim();
        if (data.indexOf('🚀') > 0) {
          run_tunnel().then(() => {
            console.log('started tunnel?');
          });
        }
        console.log(`${prefix} ${data}`);
      });
      
      localdev.stderr.on('data', (data) => {
        console.error(`${prefix} ${data}`);
      });
      
      localdev.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });      
    } catch (error) {
      reject(error);
    }
    resolve(localdev);
  });
}

function run_tunnel() {
  let tunnel, prefix = 'tunnel>';
  return new Promise((resolve, reject) => {
    try {
      tunnel = spawn('lt', ['-p', PORT]);

      tunnel.stdout.on('data', (data) => {
        data = String(data).trim();
        console.log(`${prefix} ${data}`);
        if (/^your\ url\ is\:/.test(data)) {
          let Url = String(data).split(': ').pop().trim();
          open_browser(Url);
        }
      });
      
      tunnel.stderr.on('data', (data) => {
        console.error(`${prefix} ERR ${data}`);
      });
      
      tunnel.on('close', (code) => {
        console.log(`${prefix} child process exited with code ${code}`);
      });
    } catch (error) {
      reject(error);
    }
    resolve(tunnel);
  });
}

function open_browser(Url) {
  return new Promise((resolve, reject) => {
    resolve(opn(Url));
  });
}

const PORT = get_random_port(3000);

if (require.main === module) {
  process.env['PORT'] = PORT;

  run_dev().then(() => {
    console.log('Running?');
  });
} 
