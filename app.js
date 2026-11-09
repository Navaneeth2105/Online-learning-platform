/**
 * SkillForge Application Entry Point
 * 
 * Allows running `node app.js` directly from the project root.
 * Delegates execution to server/server.js using the server context.
 */
const path = require('path');

// Set current working directory to server directory so environment & dependencies resolve cleanly
process.chdir(path.join(__dirname, 'server'));

// Start server
require(path.join(__dirname, 'server', 'server.js'));
