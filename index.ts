#!/usr/bin/env node
import { Command } from 'commander';
import { terminal } from 'terminal-kit';
import path from 'path';
import fs from 'fs';

function animateFrames(frames: string[], frameDelay = 80) {
    let i = 0;
    const interval = setInterval(() => {
        terminal.clear();
        terminal(frames[i]);
        i = (i + 1) % frames.length;
    }, frameDelay);

    process.on('SIGINT', () => {
        clearInterval(interval);
        terminal.clear();
        process.exit();
    });
}

const program = new Command();

program
  .name('memecli')
  .description('meme on the terminal')
  .version('1.0.0');

program
  .argument('<animation>', 'Name of the animation to run')
  .action((animation: string) => {
    const animationPath = path.resolve(__dirname, 'meme', `${animation}.js`);

    if (!fs.existsSync(animationPath)) {
      console.error(`Animation "${animation}" not found!`);
      process.exit(1);
    }

    try {
      const animModule = require(animationPath);
      const frames: string[] = animModule.frames;
      if (!frames || !Array.isArray(frames) || frames.length === 0) {
        console.error(`Animation "${animation}" does not contain frames!`);
        process.exit(1);
      }

      animateFrames(frames);
    } catch (err) {
      console.error(`Failed to load animation "${animation}":`, err);
      process.exit(1);
    }
  });

program.parse(process.argv);
