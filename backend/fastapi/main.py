from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from pydantic import BaseModel
from uuid import uuid4
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure database tables are created
models.Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
class ToDo(BaseModel):
    id: str
    title: str 
    completed: bool = False
    
class ToDoCreate(BaseModel):
    title: str 
    completed: bool = False
    
class ToDoUpdate(BaseModel):
    title: Optional[str]
    completed: Optional[bool]
    
    
# Get All Tasks
@app.get("/tasks/", response_model=list[ToDo])
def get_all_tasks(db: Session = Depends(get_db)):
    return db.query(models.ToDo).all()

# Create Task 
@app.post("/tasks/", response_model=ToDo)
def create_task(todo: ToDoCreate, db: Session = Depends(get_db)):
    try:
        # Generate a UUID for the id field
        todo_db = models.ToDo(**todo.dict(), id=str(uuid4()))
        db.add(todo_db)
        db.commit()
        db.refresh(todo_db)
        return todo_db
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create task")
    
# Delete Task 
@app.delete("/tasks/{task_id}/")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    try:
        # Retrieve the task from the database
        todo_db = db.query(models.ToDo).filter(models.ToDo.id == task_id).first()
        if not todo_db:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Delete the task
        db.delete(todo_db)
        db.commit()
        
        return {"message": "Task deleted successfully"}
    except Exception as e:
        print(f"Error deleting task: {e}")  # Print the error message to the console
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete task")
        
        
   
 # Update Task   
 
@app.put("/tasks/{task_id}/", response_model=ToDo)
def update_task(task_id: str, todo_update: ToDoUpdate, db: Session = Depends(get_db)):
    try:
        # Retrieve the task from the database
        todo_db = db.query(models.ToDo).filter(models.ToDo.id == task_id).first()
        if not todo_db:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Update the task fields if new values are provided
        if todo_update.title:
            todo_db.title = todo_update.title
        if todo_update.completed is not None:
            todo_db.completed = todo_update.completed
        
        # Commit the changes
        db.commit()
        
        # Refresh the task object
        db.refresh(todo_db)
        
        return todo_db
    except Exception as e:
        print(f"Error updating task: {e}")  # Print the error message to the console
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update task")
    
    
# Toggle Complete 

@app.put("/tasks/{task_id}/toggle/")
def toggle_completed(task_id: str, db: Session = Depends(get_db)):
    try:
        # Retrieve the task from the database
        todo_db = db.query(models.ToDo).filter(models.ToDo.id == task_id).first()
        if not todo_db:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Toggle the completion status
        todo_db.completed = not todo_db.completed
        
        # Commit the changes
        db.commit()
        
        # Refresh the task object
        db.refresh(todo_db)
        
        return {"message": "Completed status toggled"}
    except Exception as e:
        print(f"Error toggling completed status: {e}")  # Print the error message to the console
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to toggle completed status")


