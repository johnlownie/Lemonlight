#!/usr/bin/env python

# import the necessary packages
import threading
import argparse
import datetime
import imutils
import json
import logging
import numpy as np
import time
import cv2

from imutils.video import FPS, VideoStream
from flask import Flask, Response, render_template
from flask_socketio import SocketIO

# initialize a flask object
app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app, cors_allowed_origins="*")

# initialize the output frame and a lock used to ensure thread-safe
# exchanges of the output frames (useful for multiple browsers/tabs are viewing tthe stream)
lock = threading.Lock()

# initialize frame holders
width = 320
height = 240
frame   = np.zeros(shape=(height, width, 3), dtype=np.uint8)
grayed  = np.zeros(shape=(height, width, 3), dtype=np.uint8)
blurred = np.zeros(shape=(height, width, 3), dtype=np.uint8)
hsv     = np.zeros(shape=(height, width, 3), dtype=np.uint8)
mask    = np.zeros(shape=(height, width, 3), dtype=np.uint8)
outputFrame = np.zeros(shape=(height, width, 3), dtype=np.uint8)

# set up logging
logging.basicConfig(level=logging.DEBUG)

# Frame variables
videoFeed = "colour"

# Input variables
exposure = 0
blackLevel = 0
redBalance = 0
blueBalance = 0

# Threshold variables
lowerHue = 0
lowerSaturation = 0
lowerValue = 0
upperHue = 255
upperSaturation = 255
upperValue = 255
erosion = 0
dilate = 0

# initialize the video stream and allow the camera sensor to warmup
# if args["webcam"] is True:
vs = VideoStream(src=0).start()
fps = FPS().start()
# else:
    # vs = VideoStream(usePiCamera=1).start()

# let camera warmup
time.sleep(2.0)

# set commponent value
def set_component(json_data):
    global videoFeed, exposure, blackLevel, redBalance, blueBalance, lowerHue, lowerSaturation, lowerValue, upperHue, upperSaturation, upperValue, erosion, dilate

    loaded = json.loads(json_data)
    component = loaded['component']
    value = loaded['value']

    print("Setting: " + component + " - Value: " + value)
    
    if component == 'videoFeed':
        videoFeed = value
    elif component == 'exposure':
        exposure = int(value)
    elif component == 'blackLevel':
        blackLevel = int(value)
    elif component == 'redBalance':
        redBalance = int(value)
    elif component == 'blueBalance':
        blueBalance = int(value)
    elif component == 'lowerHue':
        lowerHue = int(value)
    elif component == 'lowerSaturation':
        lowerSaturation = int(value)
    elif component == 'lowerValue':
        lowerValue = int(value)
    elif component == 'upperHue':
        upperHue = int(value)
    elif component == 'upperSaturation':
        upperSaturation = int(value)
    elif component == 'upperValue':
        upperValue = int(value)
    elif component == 'erosion':
        erosion = int(value)
    elif component == 'dilate':
        dilate = int(value)
    else:
        print("No component set")

def grab_frame():
    # grab global references to the video stream, output frame, and lock variables
    global vs, videoFeed, frame, grayed, blurred, hsv, mask, erosion, dilate, outputFrame, lock

    # loop over frames from the video stream
    while True:
        # read the next frame from the video stream, resize it, convert the frame to grayscale, and blur it
        frame = vs.read()
        frame = imutils.resize(frame, width=width, height=height)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(frame, (5, 5), 0)
        hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)

        # create a mask, dilate and erode it
        mask = cv2.inRange(hsv, (lowerHue, lowerSaturation, lowerValue), (upperHue, upperSaturation, upperValue))
        mask = cv2.erode(mask, None, iterations=erosion)
        mask = cv2.dilate(mask, None, iterations=dilate)

        # grab the current timestamp and draw it on the frame
        timestamp = datetime.datetime.now()
        cv2.putText(frame, timestamp.strftime("%A %d %B %Y %I:%M:%S%p"), (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)

        # acquire the lock, set the output frame, and release the lock
        with lock:
            if videoFeed == "colour":
                outputFrame = frame.copy()
            else:
                outputFrame = mask.copy()

def generate():
    # grab global references to the output frame and lock variables
    global outputFrame, lock

    # loop over frames from the output stream
    while True:
        # wait until the lock is acquired
        with lock:
            # check if the output frame is available, otherwise skip the iteration of the loop
            if outputFrame is None:
                continue

            # encode the frame in JPEG format
            (flag, encodedImage) = cv2.imencode(".jpg", outputFrame )

            # ensure the frame was successfully encoded
            if not flag:
                continue

        # yield the output frame in the byte format
        yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

@app.route("/")
def index():
    # return the rendered template
    return render_template("index.html")

@app.route("/video_feed")
def video_feed():
    # return the response generated along with the specific media type (mime type)
    print('Feeding video...')
    return Response(generate(), mimetype = "multipart/x-mixed-replace; boundary=frame")

def messageReceived(methods=['GET', 'POST']):
    print('Message was received!!')

@socketio.on('new-message')
def handle_my_custom_event(json_data, methods=['GET', 'POST']):
    print('Received: ' + str(json_data))
    set_component(json_data)
    # socketio.emit('ack-response', json, callback=messageReceived)

# check to see if this is the main thread of execution
if __name__ == '__main__':
    # construct the argument parser and parse command line arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--ip", type=str, required=True, help="ip address of the device")
    ap.add_argument("-o", "--port", type=int, required=True, help="ephemeral port number of the server (1024 to 65535)")
    ap.add_argument("-f", "--frame-count", type=int, default=32, help="# of frames used to construct the background model")
    ap.add_argument("-w", "--webcam", action="store_true", help="use webcam as the video source")
    args = vars(ap.parse_args())

    # start a thread that will perform motion detection
    t = threading.Thread(target=grab_frame)
    t.daemon = True
    t.start()

    # start the flask app
    # app.run(host=args["ip"], port=args["port"], debug=True, threaded=True, use_reloader=False)
    socketio.run(app, port=args["port"], debug=True, use_reloader=False)

# release the video stream pointer
vs.stop()
