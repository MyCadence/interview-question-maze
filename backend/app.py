# backend/app.py
from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

#Load questions from JSON
with open(os.path.join(os.path.dirname(__file__), "questions.json")) as f:
    questions = {q["id"]: q for q in json.load(f)}


@app.route("/question/<question_id>")
def get_question(question_id):
    question = questions.get(question_id)
    if question:
        return jsonify(question)
    else:
        return jsonify({"error": "Question not found"}), 404