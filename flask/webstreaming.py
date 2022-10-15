#!/usr/bin/env python

# import the necessary packages
import argparse
import cv2
import glob
import imutils
import logging
import math
import numpy as np
import os
import threading
import time

from flask import Flask, Response, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from imutils.video import FPS, VideoStream

# initialize a flask object
app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
socketio = SocketIO(app, cors_allowed_origins="*", logger=False)

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
# logging.basicConfig(level=logging.DEBUG)
weblog = logging.getLogger('werkzeug')
weblog.setLevel(logging.ERROR)

# Frame variables
videoFeed = "colour"

# Input variables
pipelineType = "limelight standard"
sourceImage = "snapshot"
ledState = "off"
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
dilation = 0

# Contour Filtering variables
sortMode = 'largest'
lowerArea = 0
lowerFullness = 0
lowerRatio = 0
upperArea = 100
upperFullness = 100
upperRatio = 100
directionFilter = 'None'
smartSpeckle = 0
intersectionFilter = 'None'
lowerAreaInPixels = lowerArea * width * height / 100
upperAreaInPixels = upperArea * width * height / 100

# Output variables
targetingRegion = "center"
targetGrouping = "single"
crosshairMode = "single crosshair"
crosshair_x = int(width / 2)
crosshair_y = int(height / 2)

# center pixel coordinates
cx = 0
cy = 0

# normalized pixel coordinates
nx = 0
ny = 0

# camera's horizontal and vertical field of view
hfov = 54
vfov = 41

# view plane width and height
vpw = 2.0 * math.tan(hfov / 2 * math.pi / 180)
vph = 2.0 * math.tan(vfov / 2 * math.pi / 180)

# Actions
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

# set routing
@app.route("/")
def index():
    # return the rendered template
    return render_template("index.html")

@app.route("/video_feed")
def video_feed():
    # return the response generated along with the specific media type (mime type)
    return Response(generate(), mimetype = "multipart/x-mixed-replace; boundary=frame")

# set sockets to capture output from the angular application
@socketio.on('connect', namespace='/test')
def client_connect(auth):
    print('Client connected - sending ack')
    socketio.emit('ack-response', {'connect': True}, namespace='/test')

@socketio.on('disconnect', namespace='/test')
def client_disconnect():
    print('Client disconnected')

@socketio.on('new-message', namespace='/test')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('Received: ' + str(json))
    socketio.emit('ack-response', json, callback=messageReceived, namespace='/test')

@socketio.on('set-input-component', namespace='/test')
def set_input_component_event(component, value):
    set_input_component(component, value)

@socketio.on('set-thresholding-component', namespace='/test')
def set_thresholding_component_event(component, value1, value2):
    set_thresholding_component(component, value1, value2)

@socketio.on('set-contour-filtering-component', namespace='/test')
def set_contour_filtering_component_event(component, value1, value2):
    set_contour_filtering_component(component, value1, value2)

@socketio.on('set-output-component', namespace='/test')
def set_output_component_event(component, value):
    set_output_component(component, value)

@socketio.on('set-component', namespace='/test')
def set_component_event(component, value):
    set_component(component, value)

@socketio.on('convert-hsv', namespace='/test')
def convert_hsv_event(s, b, g, r):
    bounds = convert_hsv(s, b, g, r)
    socketio.send(bounds, json=True, namespace='/test')

# generate the image frame to be sent to the angular application
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

# grab a frame from the video stream
def grab_frame():
    # grab global references to the video stream, output frame, and lock variables
    global vs, sourceImage, orientation, videoFeed, hfov, vfov, width, height, frame, resized, blurred, hsv, mask, erosion, dilation, outputFrame, lock, snapshotFile, targetGrouping, lowerAreaInPixels, upperAreaInPixels, cx, cy, vpw, vph

    counter = 0
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
        mask = cv2.dilate(mask, None, iterations=dilation)

        # find the contours in the mask
        contours, hierarchy = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        # contours = imutils.grab_contours(contours)

        # only process found contours
        if len(contours) > 0:
            # draw a line around all the contours
            cv2.drawContours(resized, contours, -1, (0, 0, 0), 1)

            # get area of contours
            areas = []
            bounds = []
            for c in contours:
                area = cv2.contourArea(c)
                if area >= lowerAreaInPixels and area <= upperAreaInPixels:
                    bounds.append(c)
                    areas.append(area)

            # draw rectangle if single target otherwise 
            if targetGrouping == 'single':

                # find largest contour and draw bounding box
                if len(bounds) > 0:
                    c = max(bounds, key=cv2.contourArea)
                    x, y, w, h = cv2.boundingRect(c)
                    cv2.rectangle(resized, (x, y), (x + w, y + h), (149, 228, 234), 1)
                    cv2.putText(resized, "{} x {}".format(w, h), (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (102,191,14), 1, cv2.LINE_AA)

                    # get center of contour
                    M = cv2.moments(c)

                    if M["m00"] != 0:
                        cx = int(M["m10"] / M["m00"])
                        cy = int(M["m01"] / M["m00"])
                    else:
                        cx = cy = 0

            elif targetGrouping == 'dual':
                try: hierarchy = hierarchy[0]
                except: hierarchy = []

                min_x, min_y, _ = resized.shape
                max_x = max_y = 0

                for contour, heir in zip(contours, hierarchy):
                    (x, y, w, h) = cv2.boundingRect(contour)
                    min_x, max_x = min(x, min_x), max(x + w, max_x)
                    min_y, max_y = min(y, min_y), max(y + h, max_y)

                    # if w > 80 and h > 80:
                        # cv2.rectangle(resized, (x, y), (x + w, y + h), (0, 255, 0), 1)

                if max_x - min_x > 0 and max_y - min_y > 0:
                    cv2.rectangle(resized, (min_x, min_y), (max_x, max_y), (202, 219, 45), 2)
                    cx = min_x + int((max_x - min_x) / 2)
                    cy = min_y + int((max_y - min_y) / 2)

            # calculate degrees to target
            # cx = 640
            # cy = 480
            nx, ny = normalize_coordinates(cx, cy)
            px = vpw / 2 * nx
            py = vph / 2 * ny
            # ax = math.atan2(1, round(px, 2))
            # ay = math.atan2(1, round(py, 2))
            ax = math.atan(px)
            ay = math.atan(py)
            tx = math.degrees(ax)
            ty = math.degrees(ay)
            ta = sum(areas) / (width * height) * 100

            if counter % 1000 == 0:
                print("width: {} - height: {} - cx: {} - cx: {} vpw: {} vph: {} nx: {} ny: {} px: {} py: {} ax: {} ay {} tx {} ty {} ta {}".format(width, height, cx, cy, round(vpw, 2), round(vph, 2), round(nx, 2), round(ny, 2), round(px, 2), round(py, 2), round(ax, 2), round(ay, 2), round(tx, 2),  round(ty, 2), ta))
                counter = 0

            data = { "tx": tx, "ty": ty, "ta": ta }
            socketio.emit('degrees', data, namespace='/test')

            # draw small crosshair
            cv2.line(resized, (cx, cy - 5), (cx, cy - 15), (0, 0, 255), 3)
            cv2.line(resized, (cx, cy + 5), (cx, cy + 15), (0, 0, 255), 3)
            cv2.line(resized, (cx - 5, cy), (cx - 15, cy), (0, 0, 255), 3)
            cv2.line(resized, (cx + 5, cy), (cx + 15, cy), (0, 0, 255), 3)

            cv2.line(mask, (cx, cy - 5), (cx, cy - 15), (0, 0, 255), 3)
            cv2.line(mask, (cx, cy + 5), (cx, cy + 15), (0, 0, 255), 3)
            cv2.line(mask, (cx - 5, cy), (cx - 15, cy), (0, 0, 255), 3)
            cv2.line(mask, (cx + 5, cy), (cx + 15, cy), (0, 0, 255), 3)

            # draw targeting crosshair
            cv2.line(resized, (crosshair_x, crosshair_y - 15), (crosshair_x, crosshair_y - 45), (0, 255, 0), 1)
            cv2.line(resized, (crosshair_x, crosshair_y + 15), (crosshair_x, crosshair_y + 45), (0, 255, 0), 1)
            cv2.line(resized, (crosshair_x - 15, crosshair_y), (crosshair_x - 45, crosshair_y), (0, 255, 0), 1)
            cv2.line(resized, (crosshair_x + 15, crosshair_y), (crosshair_x + 45, crosshair_y), (0, 255, 0), 1)

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
        # if sourceImage == 'camera':
            # cv2.putText(resized, "{:.1f}".format(fps.fps()), (1, 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (102,191,14), 1, cv2.LINE_AA)
            # cv2.putText(mask, "{:.1f}".format(fps.fps()), (1, 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (102,191,14), 1, cv2.LINE_AA)

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
        counter += 1

# snapshot related functions
def delete_snapshot():
    global snapshotFile

    files = glob.glob(os.path.join(imagePath, "*"))
    snapshotFile = max(files, key=os.path.getctime)
    os.remove(snapshotFile)
    load_snapshot()

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

# normalize the image coordinates
def normalize_coordinates(px, py):
    global width, height
    x = (1/(width/2)) * (px - (width/2) - .5)
    y = (1/(height/2)) * ((height/2) - .5 - py)
    return x, y

# these set functions set variables based on input from the angular application
# convert commponent blue green red value to hsv
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

# convert area to pixels
def set_area_by_pixels():
    global width, height, lowerArea, upperArea, lowerAreaInPixels, upperAreaInPixels, nx, ny

    if sourceImage == 'snapshot':
        frame = cv2.imread(snapshotFile)
        (height, width, _) = frame.shape

    lowerAreaInPixels = (width * height * lowerArea) / 100
    upperAreaInPixels = (width * height * upperArea) / 100

    print("W: {} - H: {} - LAIP: {} - UAIP: {}".format(width, height, lowerAreaInPixels, upperAreaInPixels))

# set input component value
def set_input_component(component, value):
    global pipelineType, sourceImage, width, height, ledState, orientation, exposure, blackLevel, redBalance, blueBalance

    print("C: {} - V: {}".format(component, value))

    if component == 'pipelineType':
        pipelineType = value.lower()
    elif component == 'sourceImage':
        sourceImage = value.lower()
    elif component == 'resolution':
        (w, h) = value.split("x")
        width = int(w)
        height = int(h)
        set_area_by_pixels()
    elif component == 'ledState':
        ledState = value.lower()
    elif component == 'orientation':
        orientation = value.lower()
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
    else:
        print("No input component set: " + component)

# set thresholding component value
def set_thresholding_component(component, value1, value2):
    global lowerHue, lowerSaturation, lowerValue, upperHue, upperSaturation, upperValue, erosion, dilation

    print("C: {} - V1: {} - V2: {}".format(component, value1, value2))

    if component == 'hue':
        lowerHue = int(value1)
        upperHue = int(value2)
    elif component == 'saturation':
        lowerSaturation = int(value1)
        upperSaturation = int(value2)
    elif component == 'value':
        lowerValue = int(value1)
        upperValue = int(value2)
    elif component == 'erosion':
        erosion = int(value1)
    elif component == 'dilation':
        dilation = int(value1)
    else:
        print("No thresholding component set: " + component)

# set contour filtering component value
def set_contour_filtering_component(component, value1, value2):
    global sortMode, lowerArea, lowerFullness, lowerRatio, upperArea, upperFullness, upperRatio, directionFilter, smartSpeckle, targetGrouping, intersectionFilter

    print("C: {} - V1: {} - V2: {}".format(component, value1, value2))

    if component == 'sortMode':
        sortMode = value1.lower()
    elif component == 'area':
        lowerArea = int(value1)
        upperArea = int(value2)
        set_area_by_pixels()
    elif component == 'fullness':
        lowerFullness = int(value1)
        upperFullness = int(value2)
    elif component == 'ration':
        lowerRatio = int(value1)
        upperRatio = int(value2)
    elif component == 'directionFilter':
        directionFilter = value1.lower()
    elif component == 'smartSpeckle':
        smartSpeckle = int(value1)
    elif component == 'targetGrouping':
        targetGrouping = value1.lower()
    elif component == 'intersectionFilter':
        intersectionFilter = value1.lower()
    else:
        print("No contour filtering component set: " + component)

# set output component value
def set_output_component(component, value):
    global targetingRegion, targetGrouping, crosshairMode, crosshair_x, crosshair_y, cx, cy

    print("C: {} - V: {}".format(component, value))

    if component == 'targetingRegion':
        targetingRegion = value.lower()
    elif component == 'targetGrouping':
        targetGrouping = value.lower()
    elif component == 'crosshairMode':
        crosshairMode = value.lower()
    elif component == 'calibrateXY':
        crosshair_x = cx
        crosshair_y = cy
    elif component == 'calibrateX':
        crosshair_x = cx
    elif component == 'calibrateY':
        crosshair_y = cy
    else:
        print("No output component set: " + component)

# set component value
def set_component(component, value):
    global videoFeed

    print("C: {} - V: {}".format(component, value))

    if component == 'videoFeed':
        videoFeed = value.lower()
    elif component == 'deleteSnapshot':
        delete_snapshot()
    elif component == 'takeSnapshot':
        save_snapshot()
    else:
        print("No component set: " + component)


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

    # start the flask app - 0.0.0.0 will listen on all interfaces
    # app.run(host='0.0.0.0', port=args["port"], debug=True, threaded=True, use_reloader=False)
    socketio.run(app, host="0.0.0.0", port=args["port"], debug=False, use_reloader=False)

# release the video stream pointer
vs.stop()
fps.stop()
