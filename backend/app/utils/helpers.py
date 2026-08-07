import re
import hashlib
import numpy as np

def sanitize_repo_url(url: str) -> str:
    """Sanitizes and normalizes a GitHub repository URL."""
    url = url.strip()
    # Handle shorthand owner/repo like 'facebook/react'
    if re.match(r"^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$", url):
        return f"https://github.com/{url}.git"
    
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url
        
    if url.endswith("/"):
        url = url[:-1]
        
    if not url.endswith(".git"):
        url = url + ".git"
        
    return url

def extract_owner_repo(url: str) -> tuple[str, str]:
    """Extracts (owner, repo_name) from URL."""
    clean_url = sanitize_repo_url(url)
    match = re.search(r"github\.com/([^/]+)/([^/]+?)(?:\.git)?$", clean_url)
    if match:
        return match.group(1), match.group(2)
    parts = clean_url.rstrip(".git").split("/")
    if len(parts) >= 2:
        return parts[-2], parts[-1]
    return "unknown", "repository"

def calculate_gini_coefficient(array: list[float]) -> float:
    """Calculates Gini coefficient of inequality (0 to 1)."""
    if not array or sum(array) == 0:
        return 0.0
    np_arr = np.sort(np.array(array, dtype=float))
    n = len(np_arr)
    index = np.arange(1, n + 1)
    return float(((2 * np.sum(index * np_arr)) / (n * np.sum(np_arr))) - ((n + 1) / n))

def generate_gravatar_hash(email: str) -> str:
    """Generates MD5 hash for Gravatar avatar URL."""
    clean_email = email.strip().lower()
    return hashlib.md5(clean_email.encode('utf-8')).hexdigest()
