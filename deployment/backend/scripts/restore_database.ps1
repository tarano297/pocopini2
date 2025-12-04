# اسکریپت بازیابی دیتابیس از Backup

param(
    [string]$BackupFile
)

Write-Host "=== بازیابی دیتابیس ===" -ForegroundColor Cyan

# اگر فایل backup مشخص نشده، آخرین backup را انتخاب کن
if (-not $BackupFile) {
    $LatestBackup = Get-ChildItem -Path "backups" -Filter "db_backup_*.sqlite3" | 
        Sort-Object LastWriteTime -Descending | 
        Select-Object -First 1
    
    if ($LatestBackup) {
        $BackupFile = $LatestBackup.FullName
        Write-Host "استفاده از آخرین backup: $($LatestBackup.Name)" -ForegroundColor Yellow
    } else {
        Write-Host "✗ هیچ backup یافت نشد!" -ForegroundColor Red
        exit 1
    }
}

# بررسی وجود فایل backup
if (-not (Test-Path $BackupFile)) {
    Write-Host "✗ فایل backup یافت نشد: $BackupFile" -ForegroundColor Red
    exit 1
}

# ایجاد backup از دیتابیس فعلی
if (Test-Path "backend\db.sqlite3") {
    $SafetyBackup = "backend\db.sqlite3.before_restore"
    Copy-Item "backend\db.sqlite3" $SafetyBackup
    Write-Host "✓ Backup امنیتی از دیتابیس فعلی ایجاد شد" -ForegroundColor Green
}

# بازیابی دیتابیس
try {
    Copy-Item $BackupFile "backend\db.sqlite3" -Force
    Write-Host "✓ دیتابیس با موفقیت بازیابی شد" -ForegroundColor Green
} catch {
    Write-Host "✗ خطا در بازیابی: $_" -ForegroundColor Red
    
    # بازگردانی backup امنیتی
    if (Test-Path $SafetyBackup) {
        Copy-Item $SafetyBackup "backend\db.sqlite3" -Force
        Write-Host "✓ دیتابیس قبلی بازگردانده شد" -ForegroundColor Yellow
    }
    exit 1
}

Write-Host ""
Write-Host "=== بازیابی کامل شد ===" -ForegroundColor Cyan
Write-Host "توجه: سرور را restart کنید" -ForegroundColor Yellow
