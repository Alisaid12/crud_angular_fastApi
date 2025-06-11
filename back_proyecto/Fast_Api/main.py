from fastapi import FastAPI, status, HTTPException, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
import firebase_admin
from db import get_cursor
from typing import Annotated
from classes.user import User
import pathlib
from functools import lru_cache
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import Annotated
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin.auth import verify_id_token

app = FastAPI()  # Inicia l'api
conn, cursor = get_cursor()

# we need to load the env file because it contains the GOOGLE_APPLICATION_CREDENTIALS
basedir = pathlib.Path(__file__).parents[1]
print('directive ', basedir)
print(load_dotenv(basedir / ".env.example"))
load_dotenv(basedir / ".env.example")

print("FRONTEND_URL", os.getenv("FRONTEND_URL", ""))

# use of a simple bearer scheme as auth is handled by firebase and not fastapi
# we set auto_error to False because fastapi incorrectly returns a 403 intead
# of a 401
# see: https://github.com/tiangolo/fastapi/pull/2120
bearer_scheme = HTTPBearer(auto_error=False)


class Settings(BaseSettings):
    """Main settings"""
    app_name: str = "demofirebase"
    env: str = os.getenv("ENV", "development")
    # Needed for CORS
    frontend_url: str = os.getenv("FRONTEND_URL", "NA")


@lru_cache
def get_settings() -> Settings:
    """Retrieves the fastapi settings"""
    return Settings()


def get_firebase_user_from_token(
    token: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> User | None:
    """Uses bearer token to identify firebase user id
    Args:
        token : the bearer token. Can be None as we set auto_error to False
    Returns:
        dict: the firebase user on success
    Raises:
        HTTPException 401 if user does not exist or token is invalid
    """
    try:
        if not token:
            # raise and catch to return 401, only needed because fastapi returns 403
            # by default instead of 401 so we set auto_error to False
            raise ValueError("No token")
        user = verify_id_token(token.credentials)
        return user
    # lots of possible exceptions, see firebase_admin.auth,
    # but most of the time it is a credentials issue
    except Exception:
        # we also set the header
        # see https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not logged in or Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


router = APIRouter()
app.include_router(router)
firebase_admin.initialize_app()

print("CURRENT APP", firebase_admin.get_app().project_id)

origins = [
    "http://localhost:4200",
]

# origins = [os.getenv("FRONTEND_URL", "")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Crear rutes amb una petició get




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


@app.get('/users/secured')
# async def get_users(user: Annotated[dict, Depends(get_firebase_user_from_token)]):
async def get_users(user: Annotated[User, Depends(get_firebase_user_from_token)]):
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



