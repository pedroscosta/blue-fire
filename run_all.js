/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs');
const resolve = require('path').resolve;
const join = require('path').join;
const cp = require('child_process');
const os = require('os');
const chalk = require('chalk');

const internalExtensionsPath = resolve(__dirname, './src/internal_extensions/');

fs.readdirSync(internalExtensionsPath).forEach((extension) => {
  if (extension.startsWith('_')) return;

  const extensionPath = join(internalExtensionsPath, extension);

  if (!fs.existsSync(join(extensionPath, 'package.json'))) return;

  const yarnCmd = os.platform().startsWith('win') ? 'yarn.cmd' : 'yarn';

  const args = process.argv.length > 2 ? process.argv.slice(2) : [];

  console.log(chalk.yellow(`Executing on ${extension}...`));

  cp.spawn(yarnCmd, args, { env: process.env, cwd: extensionPath, stdio: 'inherit' });
});
