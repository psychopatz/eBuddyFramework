from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Annotated, Any
from database import engine, SessionLocal
from datetime import datetime
from sqlalchemy.orm import Session
from pgpt_python.client import PrivateGPTApi
import models
from models import Admin, Dataset, Question, SystemPrompt


app = FastAPI(
    title="eBuddy Database Backend",
    description="Server for managing Admin, Datasets and User Question"
    )



#PrivateGPT URL, the ingestion service is usually hidden  basin mahack so ari ra i expose
client = PrivateGPTApi(base_url="http://localhost:8001")


# Initialize the database 
models.Base.metadata.create_all(bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

#Admins API

# Pydantic Model for Admin
class AdminBase(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str

class AdminUpdate(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str
    
@app.post("/admins/", status_code=status.HTTP_201_CREATED)
async def create_admin(admin: AdminBase, db:db_dependency):
    db_admin = Admin(**admin.dict())
    db.add(db_admin)
    db.commit()

@app.get("/admins/{id}",status_code=status.HTTP_200_OK)
async def read_admin(id: int, db:db_dependency):
    admin = db.query(Admin).filter(Admin.id == id).first()
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin

@app.put("/admins/{id}", status_code=status.HTTP_200_OK)
async def update_admin(id: int, admin_data: AdminUpdate, db: Session = Depends(get_db)):
    db_admin = db.query(Admin).filter(Admin.id == id).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    

    for field, value in admin_data.dict(exclude_unset=True).items():
        setattr(db_admin, field, value)
    
    db.commit()
    return {"message": "Admin updated successfully"}

@app.delete("/admins/{id}",status_code=status.HTTP_200_OK)
async def delete_admin(id: int, db:db_dependency):
    db_admin = db.query(Admin).filter(Admin.id == id).first()
    if db_admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    db.delete(db_admin)
    db.commit()

#Admin Functionalities API
# TODO Basic verification ra kay galabad akong ulo ahahaha, ig capstone na nako i add ang legit lols
class AdminLogin(BaseModel):
    email: str
    password: str
    
@app.post("/admins/login", status_code=status.HTTP_200_OK)
async def login(admin: AdminLogin, db:db_dependency):
    db_admin = db.query(Admin).filter(Admin.email == admin.email).first()
    if db_admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    if db_admin.password != admin.password:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"message": "Admin logged in successfully", "id": db_admin.id}
    


#Documents API

# Pydantic Model for Dataset
class DatasetCreate(BaseModel):
    name: str
    Question: str
    Answer: str
    Context: str
    IngestId: Optional[str] = None

class DatasetUpdate(BaseModel):
    name: Optional[str] = None
    Question: Optional[str] = None
    Answer: Optional[str] = None
    Context: Optional[str] = None
    IngestId: Optional[str] = None
    IsIngested: Optional[bool] = None
    
    
@app.post("/datasets/", response_model=int, status_code=status.HTTP_201_CREATED)
def create_dataset(dataset: DatasetCreate, db: Session = Depends(get_db)):
    db_dataset = Dataset(**dataset.dict())
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset.id
@app.get("/datasets/{id}", status_code=status.HTTP_200_OK)
async def read_dataset(id: int, db:db_dependency):
    dataset = db.query(Dataset).filter(Dataset.id == id).first()
    if dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset

@app.put("/datasets/{id}", status_code=status.HTTP_200_OK)
async def update_admin(id: int, dataset_data: DatasetUpdate, db: Session = Depends(get_db)):
    db_dataset = db.query(Dataset).filter(Dataset.id == id).first()
    if db_dataset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    

    for field, value in dataset_data.dict(exclude_unset=True).items():
        setattr(db_dataset, field, value)
    
    db.commit()
    return {"message": "Dataset updated successfully"}

@app.delete("/datasets/{id}",status_code=status.HTTP_200_OK)
async def delete_dataset(id: int, db:db_dependency):
    db_dataset = db.query(Dataset).filter(Dataset.id == id).first()
    if db_dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    db.delete(db_dataset)
    db.commit()
#Dataset Functionalities API
# TODO Gitapulan pako since inamaw ang akong verification process, ig capstone na nako i add lols 


#System Prompts API

# Pydantic Model for SystemPrompt
class SystemPromptBase(BaseModel):
    system_prompt: str
    type: str

class SystemPromptCreate(BaseModel):
    id: str
    system_prompt: str
    type: str


class SystemPromptUpdate(BaseModel):
    system_prompt: Optional[str] = None
    type: Optional[str] = None


@app.post("/system_prompts/", status_code=status.HTTP_201_CREATED)
def create_system_prompt(prompt: SystemPromptCreate, db: Session = Depends(get_db)):
    # Check if a SystemPrompt with the same id already exists
    existing_prompt = db.query(SystemPrompt).filter(SystemPrompt.id == prompt.id).first()
    if existing_prompt:
        raise HTTPException(status_code=400, detail="A system prompt with the given ID already exists")

    # Create a new SystemPrompt entry
    db_prompt = SystemPrompt(**prompt.dict())
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt


@app.get("/system_prompts/{id}", status_code=status.HTTP_200_OK)
def read_system_prompt(id: str, db: Session = Depends(get_db)):
    prompt = db.query(SystemPrompt).filter(SystemPrompt.id == id).first()
    if prompt is None:
        raise HTTPException(status_code=404, detail="System prompt not found")
    return prompt

@app.put("/system_prompts/{id}", status_code=status.HTTP_200_OK)
def update_system_prompt(id: str, prompt_data: SystemPromptUpdate, db: Session = Depends(get_db)):
    db_prompt = db.query(SystemPrompt).filter(SystemPrompt.id == id).first()
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="System prompt not found")

    for field, value in prompt_data.dict(exclude_unset=True).items():
        setattr(db_prompt, field, value)

    db.commit()
    return {"message": "System prompt updated successfully"}

@app.delete("/system_prompts/{id}", status_code=status.HTTP_200_OK)
def delete_system_prompt(id: str, db: Session = Depends(get_db)):
    db_prompt = db.query(SystemPrompt).filter(SystemPrompt.id == id).first()
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="System prompt not found")
    db.delete(db_prompt)
    db.commit()
    return {"message": "System prompt deleted successfully"}


#Questions API


# Pydantic Model for Question
class QuestionBase(BaseModel):
    summary: str
    isResolved: bool = False
    chatHistory: List[dict]  # List of objects with 'context' and 'role'

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    summary: Optional[str] = None
    isResolved: Optional[bool] = None
    chatHistory: Optional[List[dict]] = None

class QuestionDisplay(BaseModel):
    id: int
    summary: str
    dateCreated: datetime
    isResolved: bool
    chatHistory: List[dict]

    class Config:
        orm_mode = True
        
        
# Create a Question
@app.post("/questions/", response_model=QuestionDisplay, status_code=status.HTTP_201_CREATED)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_question = Question(**question.dict(), dateCreated=datetime.utcnow())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

# Read a Question by ID
@app.get("/questions/{id}", response_model=QuestionDisplay, status_code=status.HTTP_200_OK)
def read_question(id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

# Update a Question
@app.put("/questions/{id}", response_model=QuestionDisplay, status_code=status.HTTP_200_OK)
def update_question(id: int, question_data: QuestionUpdate, db: Session = Depends(get_db)):
    db_question = db.query(Question).filter(Question.id == id).first()
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    for field, value in question_data.dict(exclude_unset=True).items():
        setattr(db_question, field, value)

    db.commit()
    return db_question

# Delete a Question
@app.delete("/questions/{id}", status_code=status.HTTP_200_OK)
def delete_question(id: int, db: Session = Depends(get_db)):
    db_question = db.query(Question).filter(Question.id == id).first()
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(db_question)
    db.commit()
    return {"message": "Question deleted successfully"}


#Utils
@app.get("/llm/health",
             summary="Checks the health of the Privategpt backend")
async def health():
    return {client.health.health()}


class IngestText(BaseModel):
    name: str
    text: str


@app.post("/llm/ingest/text", status_code=status.HTTP_201_CREATED)
async def ingest_text(data: IngestText):
    ingested_text_doc_id = (
        client.ingestion.ingest_text(file_name=data.name, text=data.text)
        .data[0]
        .doc_id
    )
    return {"ingestedId": ingested_text_doc_id}

def ingest_text_in_background(dataset_name, text, db_dataset, db):
    ingested_text_doc_id = client.ingestion.ingest_text(file_name=dataset_name, text=text).data[0].doc_id
    db_dataset.IngestId = ingested_text_doc_id
    db_dataset.IsIngested = True
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    
@app.post("/llm/ingest", response_model=str, status_code=status.HTTP_201_CREATED)
async def ingest_dataset(dataset: DatasetCreate, db: db_dependency, background_tasks: BackgroundTasks):
    db_dataset = Dataset(**dataset.dict())
    ingestedText = f"{db_dataset.Question.replace('\n\n', ' ')}\n{db_dataset.Answer.replace('\n\n', ' ')}\n{db_dataset.Context.replace('\n\n', ' ')}"
    
    # Adding the ingestion to background tasks
    background_tasks.add_task(ingest_text_in_background, db_dataset.name, ingestedText, db_dataset, db)

    return "Queued for ingestion"

