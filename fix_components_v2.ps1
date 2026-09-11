
Get-ChildItem -Path "src\components\ui" -Filter "*.jsx" | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content $path -Raw
    $originalContent = $content

    # Pattern 1: Destructured props with type annotation
    # }: Type ) =>  -->  }) =>
    $content = $content -replace '\}\s*:\s*[^)]+\s*\)\s*=>', '}) =>'

    # Pattern 2: Regular props with type annotation
    # ): Type ) =>  -->  )) =>
    $content = $content -replace '\)\s*:\s*[^)]+\s*\)\s*=>', ')) =>'

    # Pattern 3: Remove 'as React.CSSProperties'
    $content = $content -replace 'as React\.CSSProperties', ''

    if ($content -ne $originalContent) {
        Set-Content -Path $path -Value $content
        Write-Host "Fixed $($_.Name)"
    }
}
