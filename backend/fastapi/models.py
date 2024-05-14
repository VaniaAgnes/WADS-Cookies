
from sqlalchemy import Column, Boolean, String
from database import Base

class ToDo(Base):
    __tablename__ = "todos"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    completed = Column(Boolean, default = False)
    
    

