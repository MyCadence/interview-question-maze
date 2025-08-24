# backend/app.py
from flask import Flask, jsonify, request
import sqlite3
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), "questions.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row #access rows like dict
    return conn

#------------------Question Route-------------------------
@app.route("/question/<question_id>")
def get_question(question_id):
    conn = get_db_connection()
    question = conn.execute("SELECT * FROM questions WHERE id = ?", (question_id,)).fetchone()
    conn.close()

    if question:
        return jsonify({
            "id": question["id"],
            "question": question["question"],
            "options": json.loads(question["options"])
        })
    else:
        return jsonify({"error": "Question not found"}), 404
    
#----------------Leaderboard Routes-----------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password") #must be hashed

    if not username or not password:
        return jsonify({"eror": "Username and password required"}), 400
    
    conn = get_db_connection()
    try:
        conn.execute("INSERT INTO leaderboard (username, password, score) VALUES (?, ?, ?)",
                     (username, password, 0))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Username already ecists"}), 400
    
    conn.close()
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    conn = get_db_connection()
    rows = conn.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10").fetchall()
    conn.close()

    leaderboard_data = [{"username": row["username"], "score": row["score"]} for row in rows]
    return jsonify(leaderboard_data)

if __name__ == "__main__":
    app.run(debug=True)