import sqlite3
import json
import os
from typing import Optional, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "flowsense.db")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS repo_analyses (
            repo_url TEXT PRIMARY KEY,
            repo_owner TEXT,
            repo_name TEXT,
            analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_json TEXT
        )
    """)
    conn.commit()
    conn.close()

def get_cached_analysis(repo_url: str) -> Optional[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT data_json FROM repo_analyses WHERE repo_url = ?", (repo_url,))
    row = cursor.fetchone()
    conn.close()
    if row:
        try:
            return json.loads(row[0])
        except Exception:
            return None
    return None

def save_analysis_cache(repo_url: str, repo_owner: str, repo_name: str, data_dict: Dict[str, Any]):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    data_json = json.dumps(data_dict)
    cursor.execute("""
        INSERT OR REPLACE INTO repo_analyses (repo_url, repo_owner, repo_name, analyzed_at, data_json)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)
    """, (repo_url, repo_owner, repo_name, data_json))
    conn.commit()
    conn.close()
