# -*- coding: utf-8 -*-
import argparse
import os
from flask import Flask, jsonify, abort, json, render_template, request
import requests, datetime, requests.packages.urllib3

UPLOAD_FOLDER = './static/img/'
ALLOWED_EXTENSIONS = set(['txt', 'png', 'jpg', 'jpeg', 'gif'])
requests.packages.urllib3.disable_warnings()

app = Flask(__name__)

def allowed_file(file):
    return '.' in file and file.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=('GET', 'POST'))
@app.route('/index', methods=('GET', 'POST'))
def index():
	res = {}
	if request.method == 'GET':
		return render_template('index.html')
	elif request.method == 'POST':
		if 'file' not in request.files:
			return jsonify({'mess' : 'File not found'})
		file = request.files['file']
		if file.name == '':
			return jsonify({'mess' : 'File not found'})
		if file and allowed_file(file.filename):
			file.save(os.path.join(UPLOAD_FOLDER, file.filename))
			res['text'] = getText(file.filename)
			res['img'] = getBox(file.filename)
			res['raw'] = file.filename
			res['mess'] = 'Success'
			return jsonify(res)
		else:
			return jsonify({'mess' : 'File extension not allow'})
	return jsonify({'mess' : 'Error'})

def getText(file):
	data = {'file' : open(UPLOAD_FOLDER + file, 'rb')}
	res = requests.post('https://118.70.127.230:5050/infordio/get_text', files = data, verify=False)
	x = json.loads(res.content)
	return x

def getBox(file):
	data = {'file' : open(UPLOAD_FOLDER + file, 'rb')}
	res = requests.post('https://118.70.127.230:5050/infordio/get_box', files = data, verify=False)
	with open(UPLOAD_FOLDER + 'box_'+file, 'wb') as f:
		f.write(res.content)
	return 'box_'+file

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', '-H', default='127.0.0.1')
    parser.add_argument('--port', '-p', dest='port', default=9093)
    parser.add_argument('--debug', dest='debug', default=True)
    args = parser.parse_args()
    app.run(host=args.host, port=args.port, debug=args.debug, ssl_context=('cert.pem', 'key.pem'))
