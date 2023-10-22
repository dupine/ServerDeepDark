@echo off
ECHO Enter commit statement:
SET /p input=""
GOTO check
  

:check
IF "%input%" == "" (
	ECHO Input is empty
	GOTO exit 
) ELSE (
	GOTO commit
)

:commit
git.exe add .
git.exe commit -m "%input%"
git.exe push
ECHO Successfully Commited

:exit
PAUSE