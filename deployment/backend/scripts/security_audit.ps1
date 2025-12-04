# اسکریپت بررسی امنیتی سیستم (نسخه Windows)

Write-Host "=== بررسی امنیتی پوکوپینی ===" -ForegroundColor Cyan
Write-Host ""

# بررسی فایل‌های .env
Write-Host "1. بررسی فایل‌های حساس..." -ForegroundColor Yellow
Get-ChildItem -Path . -Filter ".env*" -Recurse -File | Select-Object FullName, LastWriteTime

# بررسی SECRET_KEY
Write-Host ""
Write-Host "2. بررسی SECRET_KEY..." -ForegroundColor Yellow
$secretKeyCheck = Select-String -Path "backend\pokopini\settings.py" -Pattern "django-insecure" -Quiet
if ($secretKeyCheck) {
    Write-Host "⚠️  هشدار: SECRET_KEY پیش‌فرض استفاده شده!" -ForegroundColor Red
} else {
    Write-Host "✓ SECRET_KEY سفارشی است" -ForegroundColor Green
}

# بررسی DEBUG mode
Write-Host ""
Write-Host "3. بررسی DEBUG mode..." -ForegroundColor Yellow
$debugCheck = Select-String -Path "backend\pokopini\settings.py" -Pattern "DEBUG\s*=\s*True" -Quiet
if ($debugCheck) {
    Write-Host "⚠️  هشدار: DEBUG mode فعال است!" -ForegroundColor Red
} else {
    Write-Host "✓ DEBUG mode غیرفعال است" -ForegroundColor Green
}

# بررسی dependencies
Write-Host ""
Write-Host "4. بررسی dependencies..." -ForegroundColor Yellow
if (Test-Path "backend\venv\Scripts\activate.ps1") {
    & backend\venv\Scripts\python.exe -m pip list --outdated
}

# بررسی SSL certificate
Write-Host ""
Write-Host "5. بررسی SSL certificate..." -ForegroundColor Yellow
if (Test-Path "cert.pem") {
    Write-Host "✓ SSL certificate موجود است" -ForegroundColor Green
} else {
    Write-Host "⚠️  SSL certificate یافت نشد!" -ForegroundColor Red
}

# بررسی ALLOWED_HOSTS
Write-Host ""
Write-Host "6. بررسی ALLOWED_HOSTS..." -ForegroundColor Yellow
$allowedHosts = Select-String -Path "backend\pokopini\settings.py" -Pattern "ALLOWED_HOSTS"
if ($allowedHosts) {
    Write-Host $allowedHosts.Line
}

# بررسی CORS settings
Write-Host ""
Write-Host "7. بررسی CORS settings..." -ForegroundColor Yellow
$corsOrigins = Select-String -Path "backend\pokopini\settings.py" -Pattern "CORS_ALLOWED_ORIGINS"
if ($corsOrigins) {
    Write-Host $corsOrigins.Line
}

Write-Host ""
Write-Host "=== پایان بررسی ===" -ForegroundColor Cyan
