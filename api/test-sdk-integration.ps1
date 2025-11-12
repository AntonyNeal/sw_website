# Test SDK Integration
# PowerShell script to test backend API endpoints

Write-Host "`n🧪 TESTING SDK INTEGRATION`n" -ForegroundColor Cyan
Write-Host "Testing: Frontend SDK -> Backend API -> SimplyBook.me`n" -ForegroundColor White
Write-Host ("=" * 60) -ForegroundColor Gray

$baseUrl = "http://localhost:3001/api"
$passedTests = 0
$failedTests = 0

# Test 1: Get Services
Write-Host "`n📝 Test 1: GET /api/simplybook/services" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/simplybook/services" -Method GET
    $serviceCount = ($response | Get-Member -MemberType NoteProperty).Count
    Write-Host "✅ Success! Got $serviceCount services" -ForegroundColor Green
    
    # Show first service
    $firstService = $response.PSObject.Properties.Value | Select-Object -First 1
    $duration = $firstService.duration
    Write-Host "   Sample: $($firstService.name) ($duration minutes)" -ForegroundColor Gray
    $passedTests++
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $failedTests++
}

# Test 2: Get Company Info
Write-Host "`n📝 Test 2: GET /api/simplybook/company" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/simplybook/company" -Method GET
    Write-Host "✅ Success! Company: $($response.company)" -ForegroundColor Green
    Write-Host "   Email: $($response.email)" -ForegroundColor Gray
    Write-Host "   Phone: $($response.phone)" -ForegroundColor Gray
    Write-Host "   City: $($response.city)" -ForegroundColor Gray
    $passedTests++
}
catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $failedTests++
}

# Test 3: Get Providers
Write-Host "`n📝 Test 3: GET /api/simplybook/providers" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/simplybook/providers" -Method GET
    $providerCount = ($response | Get-Member -MemberType NoteProperty).Count
    Write-Host "✅ Success! Got $providerCount providers" -ForegroundColor Green
    $passedTests++
}
catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $failedTests++
}

# Test 4: Get Available Dates
Write-Host "`n📝 Test 4: GET /api/simplybook/available-dates" -ForegroundColor Yellow
try {
    $today = Get-Date -Format "yyyy-MM-dd"
    $endDate = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
    
    $url = "$baseUrl/simplybook/available-dates?service_id=2&from=$today&to=$endDate"
    $response = Invoke-RestMethod -Uri $url -Method GET
    
    if ($response -is [array]) {
        $dateCount = $response.Count
    }
    else {
        $dateCount = ($response | Get-Member -MemberType NoteProperty).Count
    }
    
    Write-Host "✅ Success! Got $dateCount available dates" -ForegroundColor Green
    $passedTests++
}
catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    $failedTests++
}

# Test 5: Get Time Slots
Write-Host "`n📝 Test 5: GET /api/simplybook/timeslots" -ForegroundColor Yellow
try {
    $tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
    
    $params = @{
        service_id = "2"
        date = $tomorrow
    }
    $queryString = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&"
    $url = "$baseUrl/simplybook/timeslots?$queryString"
    $response = Invoke-RestMethod -Uri $url -Method GET
    
    if ($response -is [array]) {
        $slotCount = $response.Count
        $availableCount = ($response | Where-Object { $_.available -eq $true }).Count
    }
    else {
        $slotCount = ($response | Get-Member -MemberType NoteProperty).Count
        $availableCount = "N/A"
    }
    
    Write-Host "✅ Success! Got $slotCount time slots for $tomorrow" -ForegroundColor Green
    Write-Host "   Available slots: $availableCount" -ForegroundColor Gray
    $passedTests++
}
catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $failedTests++
}

# Summary
Write-Host "`n$("=" * 60)" -ForegroundColor Gray
Write-Host "`n📊 TEST SUMMARY`n" -ForegroundColor Cyan
Write-Host "✅ Passed: $passedTests" -ForegroundColor Green
Write-Host "❌ Failed: $failedTests" -ForegroundColor Red

$successRate = [math]::Round(($passedTests / ($passedTests + $failedTests)) * 100)
Write-Host "📈 Success Rate: $successRate%" -ForegroundColor White

if ($failedTests -eq 0) {
    Write-Host "`nALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "SDK integration is working correctly!`n" -ForegroundColor Green
}
else {
    Write-Host "`nSome tests failed. Check the errors above.`n" -ForegroundColor Yellow
}
