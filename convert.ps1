$files = Get-ChildItem -Path "src" -Recurse -Include "*.jsx","*.js"
foreach ($file in $files) {
    Try {
        $content = Get-Content $file.FullName -Raw
        
        # 1. Remove import type
        $content = $content -replace "import\s+type\s*\{[^}]*\}\s*from\s*['`"][^'`"]+['`"];?", ""
        
        # 2. Remove type from imports (import { a, type b } ...)
        $content = $content -replace "(import\s*\{[^}]*?)\btype\s+([^,}]+)([^}]*?\})", '$1$2$3'
        
        # 3. Remove interface blocks
        # (?s) enables single-line mode (dot matches newline)
        $content = $content -replace "(?s)(export\s+)?interface\s+\w+(\s+extends\s+[^{]+)?\s*\{.*?\}", ""
        
        # 4. Remove generic type arguments on forwardRef, useState, etc.
        # \b(forwardRef|useState|useRef|createContext)\s*<[^>]+>
        # We use [^>]+ to be safe, assuming no nested >. If nested, this fails.
        # But React types usually don't nest heavily in these calls.
        $content = $content -replace "\b(forwardRef|useState|useRef|createContext)\s*<[^>]+>", '$1'
        
        # 5. Remove argument types ({...}: Type)
        # \(\{([^}]+)\}\s*:\s*\w+\)
        $content = $content -replace "\(\{([^}]+)\}\s*:\s*\w+\)", '({$1})'
        
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Output "Processed $($file.Name)"
    } Catch {
        Write-Output "Error processing $($file.Name): $_"
    }
}
