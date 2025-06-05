from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    user_id: Optional[str] = None
    first_name: str
    last_name: str
    email: str
    status: Optional[bool] = None
