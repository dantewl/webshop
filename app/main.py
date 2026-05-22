from fastapi import FastAPI
from app.db import get_connection

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "webshop backend online"}

@app.get("/db-test")
def db_test():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("select version();")
            version = cur.fetchone()[0]
    return {"database": "connected", "version": version}