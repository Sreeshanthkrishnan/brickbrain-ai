@echo off
echo ========================================================
echo       BRICK BRAIN AI - APK GOOGLE DRIVE UPLOADER
echo ========================================================
echo.
echo Opening Google Drive in your default web browser...
start https://drive.google.com/drive/my-drive
echo.
echo Highlighting the newly built BrickBrain APK in Explorer...
explorer.exe /select,"%~dp0BrickBrain-v1.0-debug.apk"
echo.
echo [DONE] Drag and drop 'BrickBrain-v1.0-debug.apk' into your Google Drive window!
echo You can then download and install it on your mobile phone.
echo.
pause
