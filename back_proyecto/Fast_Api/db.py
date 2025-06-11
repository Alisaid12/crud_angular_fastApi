# import mysql.connector

# def create_connection():
#     return mysql.connector.connect(
#         host='localhost',
#         user='root',
#         password = '',
#         database='primer_api_db'
#     )

# def get_cursor():
#     conn = create_connection()
#     cursor = conn.cursor(dictionary=True)
#     return conn, cursor

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root@localhost:3306/primer_api_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
