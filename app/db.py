import os
from dotenv import load_dotenv
import psycopg

load_dotenv()

def get_connection():
    return psycopg.connect(os.getenv("DATABASE_URL"))