from fastapi import FastAPI
from db import get_cursor
from fastapi.middleware.cors import CORSMiddleware
from classes.user import User
from typing import Optional
conn, cursor = get_cursor()



app = FastAPI()

origins = [
    "http://127.0.0.1:5501",  
    # "http://localhost:5501",
    "http://localhost:4200", # url manijia
    'http://localhost:53107'
]


app.add_middleware(
    CORSMiddleware,
    # Or use ["*"] to allow all origins (not recommended for production)
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get('/')
async def index():
    return {"message":"Hello World"}

@app.get('/api/saludo')
async def root():
    return {'message':'Hola Mundo!'}


@app.get('/api/saludo2')
async def saludos():
    return {'message': 'Hola, Como estas?'}

@app.get('/users')
async def get_users():
    select_query = "SELECT * FROM users WHERE  status = 1"
    cursor.execute(select_query)
    results = cursor.fetchall()
    return results

@app.get('/user')
async def get_user(user_id:int):
    select_query = "SELECT * FROM users WHERE user_id = %s AND status = 1"
    cursor.execute(select_query,(user_id,))
    result = cursor.fetchone()
    # if not result:
    #     raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "User Not Found")
    return result


@app.get('/get-user-by-name')
async def get_user_by_name(fname:str):
    select_query = "SELECT * FROM users WHERE first_name=%s"
    cursor.execute(select_query,(fname,))
    res = cursor.fetchone()
    return res

@app.get('/get_user_by_gmail')
async def get_user_with_gamil(email):
    select_query = "SELECT * FROM users WHERE email LIKE %s"
    search_value = f"%{email}%"
    cursor.execute(select_query, (search_value,))
    res = cursor.fetchall()
    return res

@app.post('/create_user')
async def create_user(user: User):

    cursor.execute(
        "INSERT INTO users (user_id, first_name, last_name, email,status) VALUES (%s, %s, %s, %s,%s)",('', user.first_name, user.last_name, user.email,user.status)
    )

    conn.commit()   

    return {"success": "User created successfully"}

@app.delete("/delete/user/{user_id}")
async def delete_user(user_id:int):
    delete_query = "UPDATE  users SET status = False WHERE user_id = %(id)s"
    cursor.execute(delete_query, {'id': user_id})
    conn.commit()
    return {"messag": f"Deleted user with id {user_id} succefully"}


@app.put('/update/user/{user_id}')
async def update_user(user_id:int,user:User):
    update_query = "UPDATE users SET first_name = %s , last_name = %s , email = %s , status = %s WHERE user_id = %s "
    cursor.execute(update_query, (user.first_name, user.last_name, user.email,user.status, user_id))
    conn.commit()
    return {"message": f"Update user with id {user_id} Succefully"}