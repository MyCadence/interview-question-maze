from flask import Flask, jsonify, request, session
import sqlite3, json, os, hashlib
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

#Secret key for sessions
app.secret_key = "supersecretkey" #replace with env var in production

DB_PATH = os.path.join(os.path.dirname(__file__), "questions.db")

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row #access rows like dict
    return conn

#------------------Score Submission Route-------------------------
@app.route("/submit_score", methods=["POST"])
def submit_score():
    if "username" not in session:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    score = data.get("score")
    if score is None:
        return jsonify({"error": "Score required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    
    # Get user_id
    cur.execute("SELECT id FROM users WHERE username = ?", (session["username"],))
    user = cur.fetchone()
    if not user:
        conn.close()
        return jsonify({"error": "User not found"}), 404
    
    user_id = user["id"]

    # Check if leaderboard entry exists
    cur.execute("SELECT * FROM leaderboard WHERE user_id = ?", (user_id,))
    entry = cur.fetchone()
    if entry:
        # Update if new score is higher
        if score > entry["score"]:
            cur.execute("UPDATE leaderboard SET score = ? WHERE user_id = ?", (score, user_id))
    else:
        # Insert new entry
        cur.execute("INSERT INTO leaderboard (user_id, score) VALUES (?, ?)", (user_id, score))

    conn.commit()
    conn.close()
    return jsonify({"message": "Score submitted"})


#------------------Authentication Route-------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    #Check if user exists
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    if cur.fetchone():
        return jsonify({"error": "Username already taken"}), 400
    
    cur.execute(" INSERT INTO users (username, password_hash) VALUES (?, ?)",
        (username, hash_password(password)),
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cur.fetchone()
    conn.close()

    if user and user["password_hash"] == hash_password(password):
        session["username"] = username
        return jsonify({"message": "Login successful", "username": username})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("username", None)
    return jsonify({"message": "Logged out"})


@app.route("/whoami", methods=["GET"])
def whoami():
    return jsonify({"username": session.get("username")})


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
    

#----------------Leaderboard Route-----------------------
@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT u.username, l.score
        FROM leaderboard l
        JOIN users u ON l.user_id = u.id
        ORDER BY l.score DESC
        LIMIT 10
    """).fetchall()
    conn.close()

    leaderboard_data = [{"username": row["username"], "score": row["score"]} for row in rows]
    return jsonify(leaderboard_data)

if __name__ == "__main__":
    app.run(debug=True)