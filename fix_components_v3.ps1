
Get-ChildItem -Path "src\components\ui" -Filter "*.jsx" | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content $path -Raw
    $originalContent = $content

    # Regex to match ": Type" where Type starts with React. or an Uppercase letter
    # and ends before a closing parenthesis or comma.
    # We use a loop to handle multiple occurrences or nested generics simply by repeating.
    
    # Pattern 1: : React.Something<...> or : Something<...>
    # We match ": " followed by React. or CapitalLetter...
    # Then we match until [),=] (end of arg, comma, or default value assignment? no assignment in type usually)
    # Actually simpler: match from ":" until ")" or "," but non-greedy?
    # No, types can be complex.
    
    # Let's stick to the specific patterns seen in grep which cover 99% of cases.
    
    # Remove : React.Something<...>
    $content = $content -replace ':\s*React\.[a-zA-Z0-9_.]+(<[^>]+>)?', ''
    
    # Remove : Type<...> (Capitalized type)
    $content = $content -replace ':\s*[A-Z][a-zA-Z0-9_.]+(<[^>]+>)?', ''
    
    # Remove : React.ComponentProps<typeof ...>
    # The previous regex might fail on "typeof ..." because of space.
    $content = $content -replace ':\s*React\.ComponentProps<typeof\s+[^>]+>', ''
    
    # Simple : Type
    $content = $content -replace ':\s*[A-Z][a-zA-Z0-9_]+', ''

    if ($content -ne $originalContent) {
        Set-Content -Path $path -Value $content
        Write-Host "Fixed $($_.Name)"
    }
}
