
const fs = require('fs');
const path = require('path');

try {
    const directoryPath = path.join(process.cwd(), 'src', 'components', 'ui');
    console.log(`Target directory: ${directoryPath}`);

    function processFiles(dir) {
        if (!fs.existsSync(dir)) {
            console.log(`Directory not found: ${dir}`);
            return;
        }

        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                processFiles(filePath);
            } else if (file.endsWith('.jsx')) {
                let content = fs.readFileSync(filePath, 'utf8');
                let originalContent = content;

                // Pattern 1: Destructured props with type annotation
                // Matches: }: ... ) =>
                // Replaces with: }) =>
                content = content.replace(/\}\s*:\s*[^)]+\s*\)\s*=>/g, '}) =>');

                // Pattern 2: Regular args with type annotation
                // Matches: ): ... ) =>
                // Replaces with: )) =>
                content = content.replace(/\)\s*:\s*[^)]+\s*\)\s*=>/g, ')) =>');

                // Pattern 4: Remove 'as React.CSSProperties'
                content = content.replace(/as React\.CSSProperties/g, '');

                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`Fixed: ${file}`);
                }
            }
        });
    }

    console.log('Starting batch fix for UI components...');
    processFiles(directoryPath);
    console.log('Batch fix completed.');

} catch (error) {
    console.error('Fatal error in script:', error);
    process.exit(1);
}
