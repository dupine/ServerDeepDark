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
git add .
git commit -m "%input%"
git push
ECHO Successfully Commited

:exit
PAUSE