import os
from os.path import join
import json

from flask import Flask, render_template, send_from_directory, request

from crossword import solve

app = Flask(__name__)

cwd = os.getcwd()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/styles/<path:path>")
def styles(path):
    return send_from_directory(join(cwd, "static/styles"), path)


@app.route("/scripts/<path:path>")
def scripts(path):
    return send_from_directory(join(cwd, "static/scripts"), path)


@app.route("/images/<path:path>")
def images(path):
    return send_from_directory(join(cwd, "static/images"), path)


@app.route("/fonts/<path:path>")
def fonts(path):
    return send_from_directory(join(cwd, "static/fonts"), path)


@app.route("/solve", methods=["POST"])
def solve_route():
    return solve(json.loads(request.form["board"]), request.form["letters"])
