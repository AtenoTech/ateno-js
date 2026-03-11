#!/usr/bin/env node

import { Ateno } from '../dist/index.js';

// Simple argument parser
const args = process.argv.slice(2);
const command = args[0];

function getArgValue(flag) {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : null;
}

async function main() {
  if (command === '--version') {
    console.log('Ateno JS CLI v0.1.4');
    return;
  }

  if (!command || command === '--help') {
    console.log(`
🚀 Ateno Spatial Design CLI (Node.js)

Usage:
  ateno-js <command> [options]

Commands:
  generate-2d    Generate a 2D room design
  generate-3d    Generate a 3D spatial design

Options:
  --image        Path to local image or URL (Required)
  --room-type    Type of room (e.g., living_room)
  --design       Design style (e.g., modern)
  --scene-name   Name of the scene (for 3D)
    `);
    return;
  }

  // Look for the API key in the environment variables
  const apiKey = process.env.ATENO_API_KEY;
  if (!apiKey) {
    console.error('\n❌ Error: API key is required. Set the ATENO_API_KEY environment variable.');
    console.error('Example: export ATENO_API_KEY="your_api_key_here"\n');
    process.exit(1);
  }

  const ateno = new Ateno({ apiKey });

  const image = getArgValue('--image');
  if (!image) {
    console.error('\n❌ Error: The --image flag is required.');
    process.exit(1);
  }

  const onProgress = (msg) => console.log(`-> ${msg}`);

  try {
    if (command === 'generate-2d') {
      console.log('\n🚀 Starting 2D Generation...');
      
      const payload = { image };
      const roomType = getArgValue('--room-type');
      const design = getArgValue('--design');
      
      if (roomType) payload.roomType = roomType;
      if (design) payload.design = design;

      const result = await ateno.rooms.generateRoom2D(payload, onProgress);
      
      console.log('\n✅ Success!');
      console.log(`🎨 Design ID: ${result.designId}`);
      console.log(`🖼️  Image URL: ${result.generatedImage}\n`);

    } else if (command === 'generate-3d') {
      console.log('\n🚀 Starting 3D Generation...');
      
      const payload = { imageBase64: image };
      const sceneName = getArgValue('--scene-name');
      
      if (sceneName) payload.sceneName = sceneName;

      const result = await ateno.rooms.generateRoom3D(payload, onProgress);
      
      console.log('\n✅ Success!');
      console.log(`📦 Design ID: ${result.designId}`);
      console.log(`🌐 3D Model URL: ${result.storageUrl}\n`);

    } else {
      console.error(`\n❌ Unknown command: ${command}`);
      console.log('Run "ateno-js --help" for a list of valid commands.\n');
    }
  } catch (error) {
    console.error(`\n❌ Failed: ${error.message}\n`);
    process.exit(1);
  }
}

main();