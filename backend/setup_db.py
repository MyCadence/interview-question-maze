import sqlite3
import json
import os

db_path = os.path.join(os.path.dirname(__file__), "questions.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Drop old tables
cursor.execute("DROP TABLE IF EXISTS questions")
cursor.execute("DROP TABLE IF EXISTS leaderboard")
cursor.execute("DROP TABLE IF EXISTS users")

# Questions table
cursor.execute("""
CREATE TABLE questions (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    options TEXT NOT NULL
)
""")

# Users table (new for authentication)
cursor.execute("""
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
)
""")

# Leaderboard table (stores username and score)
cursor.execute("""
CREATE TABLE leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")

# Load questions from JSON file into SQL database
with open(os.path.join(os.path.dirname(__file__), "questions.json"), encoding="utf-8") as f:
    data = json.load(f)
    for q in data:
        cursor.execute(
            "INSERT INTO questions (id, question, options) VALUES (?, ?, ?)",
            (q["id"], q["question"], json.dumps(q["options"]))
        )

conn.commit()
conn.close()
print("Database setup complete with questions + users + leaderboard!")
