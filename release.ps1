Write-Output "---------- Release $args ----------"

# config.js
$config = Get-Content src/config/index.js
$config = $config -replace "(\d+\.){2}\d+", $args
Set-Content src/config/index.js -Value $config

npm run build

# CHANGELOG.md
$changelog = Get-Content CHANGELOG.md
[System.Collections.ArrayList]$changelog = $changelog
$timestamp = Get-Date -Format "MM d, yyyy"
$changelog.Insert(2, "## $args`n###### _$timestamp`_`n- `n")
Set-Content CHANGELOG.md -Value $changelog

# README.md
$readme = Get-Content README.md
$readme = $readme -replace "(\d+\.){2}\d+", $args
Set-Content README.md -Value $readme

Set-Location "dist"

# manifest.json
$manifest = Get-Content manifest.json
$manifest = $manifest -replace "(\d+\.){2}\d+", $args -replace "\]\,", "]"
# $manifest = $manifest[0..21] + $manifest[23]
[System.Collections.ArrayList]$manifest = $manifest
$manifest.RemoveAt(22)
Set-Content manifest.json -Value $manifest

# index.html
$html = Get-Content index.html
$html = $html -replace "<!\-\-", "" -replace "\-\->", ""
# $html = $html[0..9] + $html[11..12]
[System.Collections.ArrayList]$html = $html
$html.RemoveAt(10)
Set-Content index.html -Value $html

$files = @()
foreach ($name in Get-ChildItem -name) {
  $format = Get-Item $name
  # Write-Output $format.Extension
  if ($name -ne "images" -and $format.Extension -ne ".zip") {
    $files += $name
  }
}
# Write-Output $files
Compress-Archive -Path $files -Force -DestinationPath "new-tab v$args.zip"

Set-Location ".."
Move-Item -Force dist/*.zip releases

Write-Output "---------- Done ----------"

$confirmation = Read-Host "Do you want to clean up the dist folder changes? [y/n]"
if ($confirmation -eq 'y') {
  Remove-Item -Recurse dist/assets
  git checkout -- dist

  Write-Output "---------- Done ----------"
}