from pathlib import Path
from dotenv import load_dotenv
import os

# Project root folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file
load_dotenv(BASE_DIR / ".env")

# Application settings
APP_NAME = "Insider Threat Detection System"
APP_VERSION = "1.0.0"

# Database
DATABASE_URL = f"sqlite:///{BASE_DIR / 'database' / 'security.db'}"

# API settings
API_HOST = os.getenv("API_HOST", "127.0.0.1")
API_PORT = int(os.getenv("API_PORT", "8000"))

# Security
API_KEY = os.getenv("API_KEY", "")