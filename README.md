# Lemonlight
Attempted replication of LimelightVision on a standard Raspberry Pi

## Running in Development Mode
1. json-server --watch flask/db.json
2. python webstreaming.py -i localhost -o 5801
3. ng serve