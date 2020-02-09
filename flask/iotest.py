#!/usr/bin/env python

# import the necessary packages
from flask import Flask, render_template
from flask_socketio import SocketIO

# initialize a flask object
app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def index():
    # return the rendered template
    return render_template("index.html")

def messageReceived(methods=['GET', 'POST']):
    print('Message was received!!')

@socketio.on('new-message')
def handle_my_custom_event(json, methods=['GET', 'POST']):
    print('Received: ' + str(json))
    socketio.emit('My response', json, callback=messageReceived)

# check to see if this is the main thread of execution
if __name__ == '__main__':
    socketio.run(app, debug=True)

