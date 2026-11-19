$orgs = Invoke-RestMethod -Uri "http://localhost:8081/api/organizations"
$grouped = $orgs | Group-Object subscriptionTier

foreach ($g in $grouped) {
    Write-Host "`n========================================================" -ForegroundColor Cyan
    Write-Host " SUBSCRIPTION TIER: $($g.Name.ToUpper()) ($($g.Count) Organizations)" -ForegroundColor Yellow
    Write-Host "========================================================" -ForegroundColor Cyan
    $g.Group | Select-Object -First 3 id, name, subscriptionTier, orgUsername, orgPassword | Format-Table -AutoSize | Out-String | Write-Host
}
