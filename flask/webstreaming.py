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
import os
import glob

from imutils.video import FPS, VideoStream
from flask import Flask, Response, render_template
from flask_cors import CORS
from flask_socketio import SocketIO

# initialize a flask object
app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# initialize the output frame and a lock used to ensure thread-safe
# exchanges of the output frames (useful for multiple browsers/tabs are viewing tthe stream)
lock = threading.Lock()

# initialize frame holders
width = 640
height = 480
frame   = np.zeros(shape=(height, width, 3), dtype=np.uint8)
resized = np.zeros(shape=(height, width, 3), dtype=np.uint8)
blurred = np.zeros(shape=(height, width, 3), dtype=np.uint8)
hsv     = np.zeros(shape=(height, width, 3), dtype=np.uint8)
mask    = np.zeros(shape=(height, width, 3), dtype=np.uint8)
outputFrame = np.zeros(shape=(height, width, 3), dtype=np.uint8)
min_area = 100

# set up logging
logging.basicConfig(level=logging.DEBUG)

# Frame variables
videoFeed = "colour"

# Input variables
sourceImage = "camera"
orientation = "normal"
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

# Output variables
targetingRegion = "center"
targetGrouping = "single target"
crosshairMode = "single crosshair"

# Actions
takeSnapshot = False
imagePath = './snapshots'
snapshotFile = os.path.join(imagePath, "default.jpg")

# initialize the video stream
# if args["webcam"] is True:
vs = VideoStream(src=0).start()
# else:
    # vs = VideoStream(usePiCamera=1).start()

# set manual exposure and intial value
# vs.stream.set(cv2.CAP_PROP_AUTO_EXPOSURE, 0)
# vs.stream.set(cv2.CAP_PROP_EXPOSURE, -4)

# start the frame counter
fps = FPS().start()

# let camera warmup
time.sleep(2.0)

# set component value
def set_component(component, value):
    global sourceImage, orientation, videoFeed, width, height, exposure, blackLevel, redBalance, blueBalance, lowerHue, lowerSaturation, lowerValue, upperHue, upperSaturation, upperValue, erosion, dilate, targetGrouping

    print("C: {} - V: {}".format(component, value))

    if component == 'sourceImage':
        sourceImage = value.lower()
    elif component == 'orientation':
        orientation = value.lower()
    elif component == 'resolution':
        (w, h) = value.split("x")
        width = int(w)
        height = int(h)
    elif component == 'exposure':
        exposure = int(value)
        vs.stream.set(cv2.CAP_PROP_EXPOSURE, exposure - 12)
    elif component == 'blackLevel':
        blackLevel = int(value)
    elif component == 'redBalance':
        redBalance = int(value)
        vs.stream.set(cv2.CAP_PROP_WHITE_BALANCE_RED_V, redBalance - 12)
    elif component == 'blueBalance':
        blueBalance = int(value)
        vs.stream.set(cv2.CAP_PROP_WHITE_BALANCE_BLUE_U, blueBalance - 12)
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
    elif component == 'targetingRegion':
        targetingRegion = value.lower()
    elif component == 'targetGrouping':
        targetGrouping = value.lower()
    elif component == 'crosshairMode':
        crosshairMode = value.lower()
    elif component == 'videoFeed':
        videoFeed = value.lower()
    elif component == 'takeSnapshot':
        save_snapshot()
    else:
        print("No component set")

# convert commponent value
def convert_hsv(s, b, g, r):
    color = np.uint8([[[b, g, r]]])
    hsvColor = cv2.cvtColor(color, cv2.COLOR_BGR2HSV)

    hsvRange = (0, 0, 0)
    if s == 'eyedropper':
        hsvRange = (5, 10, 15)

    lower = max(hsvColor[0][0][0] - hsvRange[0], 0), max(hsvColor[0][0][1] - hsvRange[1], 0), max(hsvColor[0][0][2] - hsvRange[2], 0)
    upper = min(hsvColor[0][0][0] + hsvRange[0], 179), min(hsvColor[0][0][1] + hsvRange[1], 255), min(hsvColor[0][0][2] + hsvRange[2], 255)

    data = { "wand": s, "lower": { "lh": str(lower[0]), "ls": str(lower[1]), "lv": str(lower[2]) }, "upper": { "uh": str(upper[0]), "us": str(upper[1]), "uv": str(upper[2]) } }
    print(data)
    return data

def grab_frame():
    # grab global references to the video stream, output frame, and lock variables
    global vs, sourceImage, orientation, videoFeed, width, height, frame, resized, blurred, hsv, mask, erosion, dilate, outputFrame, lock, snapshotFile, targetGrouping

    # loop over frames from the video stream
    while True:
        # initialize variables
        hull = []

        # read the next frame from the video stream or snapshot
        if sourceImage == 'snapshot':
            frame = cv2.imread(snapshotFile)
        else:
            frame = vs.read()

        # do nothing if we didn't get a frame
        if frame is None:
            continue

        if orientation == 'upside-down':
            frame = cv2.flip(frame, -1)

        # resize it, convert the frame to grayscale, and blur it
        resized = imutils.resize(frame, width=width, height=height)
        blurred = cv2.GaussianBlur(resized, (5, 5), 0)
        hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)

        # create a mask, dilate and erode it
        mask = cv2.inRange(hsv, (lowerHue, lowerSaturation, lowerValue), (upperHue, upperSaturation, upperValue))
        mask = cv2.erode(mask, None, iterations=erosion)
        mask = cv2.dilate(mask, None, iterations=dilate)

        # find the contours in the mask
        contours, hierarchy = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        # contours = imutils.grab_contours(contours)

        # only process found contours
        if len(contours) > 0:
            # draw a line around all the cohtours
            cv2.drawContours(resized, contours, -1, (0, 0, 0), 1)

            # draw rectangle if single target otherwise 
            if targetGrouping == 'single target':
                # find largest contour and draw bounding box
                c = max(contours, key=cv2.contourArea)
                x, y, w, h = cv2.boundingRect(c)
                cv2.rectangle(resized, (x, y), (x + w, y + h), (149, 228, 234), 1)
            elif targetGrouping == 'dual target':
                try: hierarchy = hierarchy[0]
                except: hierarchy = []

                min_x, min_y, _ = resized.shape
                max_x = max_y = 0

                for contour, heir in zip(contours, hierarchy):
                    (x, y, w, h) = cv2.boundingRect(contour)
                    min_x, max_x = min(x, min_x), max(x + w, max_x)
                    min_y, max_y = min(y, min_y), max(y + h, max_y)

                    if w > 80 and h > 80:
                        cv2.rectangle(resized, (x, y), (x + w, y + h), (0, 255, 0), 1)

                if max_x - min_x > 0 and max_y - min_y > 0:
                    cv2.rectangle(resized, (min_x, min_y), (max_x, max_y), (202, 219, 45), 2)

        # for i in range(len(cnts)):
        #     hull.append(cv2.convexHull(cnts[i], False))

        # if len(cnts) > 1:
        #     for i in range(len(cnts)):
        #         cv2.drawContours(resized, hull, i, (0, 0, 0), 1, cv2.LINE_AA)

        # draw a center line on the frame
        # cv2.line(frame, (width, 0), (width, height), (255, 255, 255), 1)
        # timestamp = datetime.datetime.now()
        # cv2.putText(frame, timestamp.strftime("%A %d %B %Y %I:%M:%S%p"), (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)

        # draw the FPS count on the image
        if sourceImage == 'camera':
            cv2.putText(resized, "{:.1f}".format(fps.fps()), (1, 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (102,191,14), 1, cv2.LINE_AA)
            cv2.putText(mask, "{:.1f}".format(fps.fps()), (1, 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (102,191,14), 1, cv2.LINE_AA)

        # grab the current timestamp and draw it on the frame
        # timestamp = datetime.datetime.now()
        # cv2.putText(frame, timestamp.strftime("%A %d %B %Y %I:%M:%S%p"), (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)

        # acquire the lock, set the output frame, and release the lock
        with lock:
            if videoFeed == "colour":
                outputFrame = resized.copy()
            else:
                outputFrame = mask.copy()

        # update the frame counter
        fps.update()

def load_snapshot():
    global snapshotFile

    files = glob.glob(os.path.join(imagePath, "*"))
    snapshotFile = max(files, key=os.path.getctime)

def save_snapshot():
    global vs, width, height, snapshotFile

    snapshot = vs.read()
    sized = imutils.resize(snapshot, width=width, height=height)

    # save the image to disk
    snapshotFile = os.path.join(imagePath, "snapshot" + time.strftime("%Y%m%d-%H%M%S") + ".jpg")
    cv2.imwrite(snapshotFile, sized)

def generate():
    # grab global references to the output frame and lock variables
    global outputFrame, lock

    # loop over frames from the output stream
    while True:
        # wait until the lock is acquired
        with lock:
            # check if the output frame is available, otherwise skip the iteration of the loop
            if outputFrame is None:
                print("Frame is none")
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
    return Response(generate(), mimetype = "multipart/x-mixed-replace; boundary=frame")

def messageReceived(methods=['GET', 'POST']):
    print('Message was received!!')

@socketio.on('set-component')
def set_component_event(component, value):
    set_component(component, value)

@socketio.on('convert-hsv')
def convert_hsv_event(s, b, g, r):
    bounds = convert_hsv(s, b, g, r)
    socketio.send(bounds, json=True)

# check to see if this is the main thread of execution
if __name__ == '__main__':
    # construct the argument parser and parse command line arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--ip", type=str, required=True, help="ip address of the device")
    ap.add_argument("-o", "--port", type=int, required=True, help="ephemeral port number of the server (1024 to 65535)")
    ap.add_argument("-f", "--frame-count", type=int, default=32, help="# of frames used to construct the background model")
    ap.add_argument("-w", "--webcam", action="store_true", help="use webcam as the video source")
    args = vars(ap.parse_args())

    # load latest snapshot
    load_snapshot()

    # start a thread that will perform motion detection
    t = threading.Thread(target=grab_frame)
    t.daemon = True
    t.start()

    # start the flask app
    # app.run(host=args["ip"], port=args["port"], debug=True, threaded=True, use_reloader=False)
    socketio.run(app, host="0.0.0.0", port=args["port"], debug=True, use_reloader=False)

# release the video stream pointer
vs.stop()
fps.stop()
