import mysql.connector

def create_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password = '',
        database='primer_api_db'
    )

def get_cursor():
    conn = create_connection()
    cursor = conn.cursor(dictionary=True)
    return conn, cursor