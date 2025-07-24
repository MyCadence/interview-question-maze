# backend/app.py
from flask import Flask, jsonify
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#Load questions from JSON
with open(os.path.join(os.path.dirname(__file__), "questions.json"), encoding="utf-8") as f:
    questions = {q["id"]: q for q in json.load(f)}


@app.route("/question/<question_id>")
def get_question(question_id):
    question = questions.get(question_id)
    if question:
        return jsonify(question)
    else:
        return jsonify({"error": "Question not found"}), 404
    

if __name__ == "__main__":
    app.run(debug=True)