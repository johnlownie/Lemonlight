# Lemonlight
Attempted replication of LimelightVision on a standard Raspberry Pi

# ion-range-slider
update the node_modules/ng2-ion-range-slider/lib/ion-range-slider.component.js with the one in the /fixes folder

## Running in Development Mode
Run each of the following in their own shell
1. npx json-server --watch flask/db.json
2. cd flask; python webstreaming.py -i localhost -o 5801
3. ng serve