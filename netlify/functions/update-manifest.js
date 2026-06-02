const fs = require('fs');
const path = require('path');

// Auto-update manifest.json by scanning _data folders
function getJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

const projectsDir = path.join(process.cwd(), '_data', 'projects');
const certsDir = path.join(process.cwd(), '_data', 'certifications');
const manifestPath = path.join(process.cwd(), '_data', 'manifest.json');

const projects = getJsonFiles(projectsDir);
const certifications = getJsonFiles(certsDir);

const manifest = { projects, certifications };

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('✅ manifest.json updated!');
console.log('Projects:', projects);
console.log('Certifications:', certifications);
