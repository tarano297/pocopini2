# اسکریپت Backup خودکار دیتابیس

$BackupDir = "backups"
$Date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFile = "$BackupDir/db_backup_$Date.sqlite3"

Write-Host "=== شروع Backup دیتابیس ===" -ForegroundColor Cyan

# ایجاد پوشه backup
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
    Write-Host "✓ پوشه backup ایجاد شد" -ForegroundColor Green
}

# کپی دیتابیس
if (Test-Path "backend\db.sqlite3") {
    Copy-Item "backend\db.sqlite3" $BackupFile
    Write-Host "✓ Backup با موفقیت ایجاد شد: $BackupFile" -ForegroundColor Green
    
    # نمایش حجم فایل
    $FileSize = (Get-Item $BackupFile).Length / 1MB
    Write-Host "حجم فایل: $([math]::Round($FileSize, 2)) MB" -ForegroundColor Yellow
} else {
    Write-Host "✗ فایل دیتابیس یافت نشد!" -ForegroundColor Red
    exit 1
}

# حذف backup های قدیمی (بیش از 7 روز)
Write-Host ""
Write-Host "پاکسازی backup های قدیمی..." -ForegroundColor Yellow
$OldBackups = Get-ChildItem -Path $BackupDir -Filter "db_backup_*.sqlite3" | 
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }

if ($OldBackups) {
    $OldBackups | Remove-Item
    Write-Host "✓ $($OldBackups.Count) backup قدیمی حذف شد" -ForegroundColor Green
} else {
    Write-Host "✓ backup قدیمی برای حذف وجود ندارد" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Backup کامل شد ===" -ForegroundColor Cyan
