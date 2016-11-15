"C:\Program Files\MongoDB\Server\3.2\bin\mongo.exe" admin --eval "db.shutdownServer()"
timeout /t 3 /nobreak
"C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --dbpath "%cd%\db"