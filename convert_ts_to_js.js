const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'conversion.log');
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

log('Starting conversion script...');

function walkDir(dir, callback) {
    log(`Scanning directory: ${dir}`);
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filepath = path.join(dir, file);
            try {
                const stats = fs.statSync(filepath);
                if (stats.isDirectory()) {
                    walkDir(filepath, callback);
                } else if (stats.isFile() && (filepath.endsWith('.jsx') || filepath.endsWith('.js'))) {
                    // Skip config files in root if scanned (but we scan src mostly)
                    if (filepath.includes('vite.config.js') || filepath.includes('tailwind.config.js')) return;
                    callback(filepath);
                }
            } catch (err) {
                log(`Error stat-ing file ${filepath}: ${err}`);
            }
        });
    } catch (err) {
        log(`Error reading directory ${dir}: ${err}`);
    }
}

function processFile(filepath) {
    log(`Processing: ${filepath}`);
    try {
        let content = fs.readFileSync(filepath, 'utf8');

        // 1. Remove imports that are JUST types
        content = content.replace(/import\s+type\s*{[^}]*}\s*from\s*['"][^'"]+['"];?/g, '');

        // 2. Remove "type" keyword from imports
        content = content.replace(/(import\s*{[^}]*?)\btype\s+([^,}]+)([^}]*?})/g, '$1$2$3');

        // 3. Remove interface blocks
        content = content.replace(/(export\s+)?interface\s+\w+(\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

        // 4. Remove generic type arguments <...> attached to specific React functions
        content = content.replace(/\b(forwardRef|ElementRef|ComponentPropsWithoutRef|useState)\s*<([\s\S]*?)>/g, (match, func, args) => {
            return func;
        });

        // 5. Remove type annotations in function arguments ({ ... }: Props)
        content = content.replace(/\({([^}]+)}\s*:\s*\w+\)/g, '({$1})');

        // 6. Remove }: Type in other contexts (risky but needed)
        content = content.replace(/}:\s*[A-Z]\w+/g, '}');

        // 7. Remove ": Type" in variable declarations or simple args?
        // e.g. "param: string" -> "param"
        // Regex: \b(\w+)\s*:\s*(string|number|boolean|any|void)\b
        content = content.replace(/\b(\w+)\s*:\s*(string|number|boolean|any|void)\b/g, '$1');

        fs.writeFileSync(filepath, content);
    } catch (err) {
        log(`Error processing file ${filepath}: ${err}`);
    }
}

const targetDir = path.resolve(__dirname, 'src');
if (fs.existsSync(targetDir)) {
    walkDir(targetDir, processFile);
    log('Script completed.');
} else {
    log(`Target directory not found: ${targetDir}`);
}
