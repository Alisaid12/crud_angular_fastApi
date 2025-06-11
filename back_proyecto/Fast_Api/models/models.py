from sqlalchemy import Boolean, Column, Integer, String
from db import Base


class Users(Base):
    __tablename__ = 'users'

    user_id = Column(Integer,primary_key=True,autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(120), nullable=False)
    email = Column(String(100), nullable=False)
    status = Column(Boolean, nullable=False, default=True)
    
    def __repr__(self):
        return f"<Usuaris(nom={self.first_name}, cognoms={self.last_name}, email={self.email}, status={self.status})>"
