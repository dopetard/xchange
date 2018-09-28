$InputFiles = Get-Item "lib/proto/*.js"
$OldString  = 'new Buffer'
$NewString  = 'Buffer.from'
$InputFiles | ForEach {
    (Get-Content -Path $_.FullName).Replace($OldString,$NewString) | Set-Content -Path $_.FullName
     Write-Output "`n" | Out-File $_.FullName -encoding ASCII -append
}