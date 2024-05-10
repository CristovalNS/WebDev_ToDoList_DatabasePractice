from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

def create_server_connection(host_name, user_name, user_password, db_name):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("MySQL Database connection successful")
    except Error as err:
        print(f"Error: '{err}'")

    return connection

connection = create_server_connection("127.0.0.1", "root", "*neoSQL01", "todolist")

class Task(BaseModel):
    user_id: str
    title: str
    isCompleted: bool

# CREATE
@app.post("/tasks/")
def create_task(task: Task):
    cursor = connection.cursor()
    cursor.execute("INSERT INTO tasks (title, user_id) VALUES (%s, %s)", (task.title, task.user_id))
    new_id = cursor.lastrowid  # Get the new task ID
    connection.commit()
    cursor.close()
    return {"id": new_id, "title": task.title, "user_id": task.user_id}


# READ
@app.get("/tasks/{user_id}")
def read_tasks(user_id: str):
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT id, title, isCompleted FROM tasks WHERE user_id = %s", (user_id,))
        result = cursor.fetchall()
        cursor.close()
        tasks = [{"id": task[0], "title": task[1], "isCompleted": task[2]} for task in result]
        print("Fetched tasks:", tasks)  
        return tasks
    except Exception as e:
        print("Error fetching tasks:", str(e))
        return []

# UPDATE
@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: Task):
    cursor = connection.cursor()

    cursor.execute("SELECT title FROM tasks WHERE id = %s AND user_id = %s", (task_id, task.user_id))
    current_title = cursor.fetchone()

    if current_title:
        current_title = current_title[0]
        if current_title == task.title:
            cursor.execute("UPDATE tasks SET isCompleted = %s WHERE id = %s AND user_id = %s", (task.isCompleted, task_id, task.user_id))
        else:
            cursor.execute("UPDATE tasks SET title = %s, isCompleted = %s WHERE id = %s AND user_id = %s", (task.title, task.isCompleted, task_id, task.user_id))
        connection.commit()
        cursor.close()
        return {"message": "Task updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

# DELETE
@app.delete("/tasks/{task_id}/{user_id}")
def delete_task(task_id: int, user_id: str):
    cursor = connection.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = %s AND user_id = %s", (task_id, user_id))
    connection.commit()
    cursor.close()
    return {"message": "Task deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
