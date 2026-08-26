const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;

// Helper to remove directory recursively
function rmDirRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        rmDirRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
    console.log(`Successfully deleted folder: ${dirPath}`);
  }
}

// Helper to delete file
function rmFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Successfully deleted file: ${filePath}`);
  }
}

console.log('✈️ Starting AtlasUla full-stack workspace migration clean-up...');

// 1. Delete old root frontend directories
rmDirRecursive(path.join(ROOT_DIR, 'src'));
rmDirRecursive(path.join(ROOT_DIR, 'public'));

// 2. Delete old root configuration files
rmFile(path.join(ROOT_DIR, 'index.html'));
rmFile(path.join(ROOT_DIR, 'vite.config.ts'));
rmFile(path.join(ROOT_DIR, 'tailwind.config.js'));
rmFile(path.join(ROOT_DIR, 'postcss.config.js'));
rmFile(path.join(ROOT_DIR, 'tsconfig.json'));
rmFile(path.join(ROOT_DIR, '.env.example'));

// 3. Overwrite root package.json with Monorepo Workspaces package.json
const rootPackageJson = {
  "name": "atlasula-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "setup": "npm install && npm install --prefix frontend && npm install --prefix backend",
    "dev:frontend": "npm run dev --prefix frontend",
    "dev:backend": "npm run dev --prefix backend",
    "dev": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
};

fs.writeFileSync(
  path.join(ROOT_DIR, 'package.json'),
  JSON.stringify(rootPackageJson, null, 2),
  'utf-8'
);
console.log('Successfully updated root package.json to monorepo workspaces.');

console.log('\n✅ Clean-up complete! You can now run:\n');
console.log('   npm run setup    (installs all dependencies for workspaces)');
console.log('   npm run dev      (launches both frontend and backend concurrently)');
console.log('\n=======================================================\n');
