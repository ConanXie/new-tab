if ($args[0] -eq $null)
{
  Write-Error "Please type the version number"
  return
}

$version = $args[0]

Write-Output "---------- Release $version ----------"

npm run build

# CHANGELOG.md
$changelog = Get-Content CHANGELOG.md
[System.Collections.ArrayList]$changelog = $changelog
$timestamp = Get-Date -Format "MM dd, yyyy"
$changelog.Insert(2, "## $version`n###### _$timestamp`_`n- `n")
Set-Content CHANGELOG.md -Value $changelog

# README.md
$readme = Get-Content README.md
$readme = $readme -replace "(\d+\.){2}\d+", $version
Set-Content README.md -Value $readme

$distPath = "dist"
Set-Location $distPath

# manifest.json
$manifest = Get-Content manifest.json
$manifest = $manifest -replace "(\d+\.){2}\d+", $version -replace "\]\,", "]"
[System.Collections.ArrayList]$manifest = $manifest
$manifest.RemoveAt(25)
Set-Content manifest.json -Value $manifest

# index.html
$html = Get-Content index.html
$html = $html -replace "<!\-\-", "" -replace "\-\->", ""
[System.Collections.ArrayList]$html = $html
$html.RemoveAt(10)
Set-Content index.html -Value $html

$files = @()
foreach ($name in Get-ChildItem -name)
{
  $format = Get-Item $name
  if ($name -ne "images" -and $format.Extension -ne ".zip")
  {
    $files += $name
  }
}

$releasesPath = "../releases"
if (!(Test-Path $releasesPath)) {
  New-Item $releasesPath -type directory
}
Compress-Archive -Path $files -Force -DestinationPath "$releasesPath/new-tab v$version.zip"

Write-Output "---------- Done ----------"

Set-Location ".."

Write-Output "After this operation, changes of the dist folder will be cleaned up."
$confirmation = Read-Host "Do you want to continue? [Y/n]"

if ($confirmation -eq "y" -or $confirmation -eq "Y")
{

  Remove-Item -Recurse "$distPath/assets"
  Get-ChildItem $distPath | Where-Object{$_.Name -Match "js$"} | Remove-Item

  git checkout -- $distPath

  Write-Output "---------- Done ----------"
}
