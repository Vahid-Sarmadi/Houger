@echo off
REM Create a file name for the database output which contains the date and time. Replace any characters which might cause an issue.
set filename=database %date% %time%
set filename=%filename:/=-%
set filename=%filename: =__%
set filename=%filename:.=_%
set filename=%filename::=-%

set dist="%cd%\db_backup\%filename%"

mkdir %dist%

REM Export the database
echo Running backup "%filename%"
"C:\Program Files\MongoDB\Server\3.2\bin\mongodump.exe" --out %dist%

echo BACKUP COMPLETE

timeout /t 10

