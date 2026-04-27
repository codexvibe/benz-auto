const fs = require('fs');
const path = require('path');

const dir = 'D:/gomycode/BENZ-AUTO WEBSITE/src/app/admin/dashboard';

function walkDir(currentDir, callback) {
    fs.readdirSync(currentDir).forEach(f => {
        let dirPath = path.join(currentDir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(currentDir, f));
    });
}

walkDir(dir, function(filePath) {
    if (filePath.endsWith('page.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 1. Refactor Main Wrapper
        if (content.includes('flex p-6 gap-6')) {
            content = content.replace('flex p-6 gap-6', 'flex flex-col xl:flex-row p-4 md:p-6 gap-4 md:gap-6');
            modified = true;
        }

        // 2. Refactor Sidebar
        if (content.includes('w-80 bg-[#0F172A]/40')) {
            content = content.replace('w-80 bg-[#0F172A]/40', 'w-full xl:w-80 bg-[#0F172A]/40');
            modified = true;
        }

        // 3. Refactor Headers (h-28 flex items-center justify-between px-10)
        // Usually looks like: className="h-28 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex items-center justify-between px-10 shadow-xl relative overflow-hidden"
        if (content.includes('h-28') && content.includes('flex items-center justify-between px-10')) {
            content = content.replace('h-28', 'min-h-28 py-6 md:py-0');
            content = content.replace('flex items-center justify-between px-10', 'flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log('Modified:', filePath);
        }
    }
});
