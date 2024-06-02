from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks,  File, UploadFile 
from starlette.responses import HTMLResponse, FileResponse 
import os
import uuid
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Annotated, Any
from database import engine, SessionLocal
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import inspect
from pgpt_python.client import PrivateGPTApi
from passlib.context import CryptContext
import models
from models import Admin, Dataset, Question, Prompt, Photo

load_dotenv()
# BackendCurrentURL = os.getenv("BackendCurrentURL") #"http://192.168.97.155:8000"
privateGPTBackendURL = os.getenv("privateGPTBackendURL") #"http://192.168.97.155:8001"
# print(f"Backend URL: {BackendCurrentURL}. LLM Url; {privateGPTBackendURL}")
print(f"LLM Url; {privateGPTBackendURL}")

pwd_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=12)


app = FastAPI(
    title="eBuddy Database Backend",
    description="Server for managing Admin, Datasets and User Question",
    version="0.0.1",
    contact={
        "name": "eBuddy's",
        "url": "http://localhost:3000",
    }
    )

# Define CORS options
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


#PrivateGPT URL, the ingestion service is usually hidden  basin mahack so ari ra i expose
client = PrivateGPTApi(base_url=privateGPTBackendURL)


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
    profile_picture: Optional[str] = None

    def hash_password(self):
        self.password = pwd_context.hash(self.password)

class AdminUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    profile_picture: Optional[str] = None

    def update_password(self, new_password: str):
        return pwd_context.hash(new_password)

@app.post("/admins/create", status_code=status.HTTP_201_CREATED)
async def create_admin(admin: AdminBase, db: db_dependency):
    admin.hash_password()  # Hash the password before storing it
    existing_admin = db.query(Admin).filter(Admin.email == admin.email).first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Email already in use")
    db_admin = Admin(**admin.dict())
    db.add(db_admin)
    db.commit()
    return {"id": db_admin.id,"email": db_admin.email,"firstName": db_admin.firstName,"lastName": db_admin.lastName,"profile_picture": db_admin.profile_picture}

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
        raise HTTPException(status_code=404, detail="Admin not found")

    if admin_data.password:
        admin_data.password = admin_data.update_password(admin_data.password)  # Hash new password

    for field, value in admin_data.dict(exclude_unset=True).items():
        setattr(db_admin, field, value)

    db.commit()
    return {"id": db_admin.id,"email": db_admin.email,"firstName": db_admin.firstName,"lastName": db_admin.lastName,"profile_picture": db_admin.profile_picture}

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
async def login(admin: AdminLogin, db: db_dependency):
    db_admin = db.query(Admin).filter(Admin.email == admin.email).first()
    if db_admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    if not pwd_context.verify(admin.password, db_admin.password):
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"id": db_admin.id,"email": db_admin.email,"firstName": db_admin.firstName,"lastName": db_admin.lastName,"profile_picture": db_admin.profile_picture}
    


#Dataset API

# Pydantic Model for Dataset

class DatasetResponse(BaseModel):
    id: int
    name: str
    Question: str
    Answer: str
    Context: str
    DateCreated: datetime
    IngestId: Optional[str]
    IsIngested: bool

    class Config:
        orm_mode = True
        
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


@app.get("/datasets/all", response_model=List[DatasetResponse], status_code=status.HTTP_200_OK)
def get_all_datasets(db: Session = Depends(get_db)):
    datasets = db.query(Dataset).all()
    return datasets

@app.get("/datasets/{id}", status_code=status.HTTP_200_OK)
async def read_dataset(id: int, db:db_dependency):
    dataset = db.query(Dataset).filter(Dataset.id == id).first()
    if dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset

@app.put("/datasets/{id}", status_code=status.HTTP_200_OK)
async def update_dataset(id: int, dataset_data: DatasetUpdate, db: Session = Depends(get_db)):
    print(dataset_data)
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

# Pydantic Model for Prompt
class PromptBase(BaseModel):
    id: int
    name: str
    content: str
    role: str
    promptType: str
    popularity: int

class SystemPromptCreate(BaseModel):
    name: str
    content: str
    promptType: str
    role: str


class PromptUpdate(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    role: Optional[str] = None
    promptType: Optional[str] = None
    popularity: Optional[int] = None
    

class PromptTypeQuery(BaseModel):
    promptType: str

@app.get("/prompts/type/", response_model=List[PromptBase], status_code=status.HTTP_200_OK)
async def get_prompts_by_type(prompt_type: PromptTypeQuery = Depends(), db: Session = Depends(get_db)):
    # Fetch prompts from the database based on the prompt type
    prompts = db.query(Prompt).filter(Prompt.promptType == prompt_type.promptType).all()
    if not prompts:
        raise HTTPException(status_code=404, detail="No prompts found for the specified type")
    return prompts
    
@app.get("/prompts/all", response_model=List[PromptBase], status_code=status.HTTP_200_OK)
async def get_all_prompts(db: Session = Depends(get_db)):
    # Fetch all prompts from the database
    prompts = db.query(Prompt).all()
    return prompts



@app.post("/prompts/create", status_code=status.HTTP_201_CREATED)
def create_system_prompt(prompt: SystemPromptCreate, db: Session = Depends(get_db)):
    # Check if a Prompt with the same id already exists
    db_prompt = Prompt(**prompt.dict())
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

@app.post("/prompts/{id}/increment-popularity", status_code=status.HTTP_200_OK)
async def increment_prompt_popularity(id: int, db: Session = Depends(get_db)):
    # Retrieve the prompt from the database
    prompt = db.query(Prompt).filter(Prompt.id == id).first()
    if prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # Increment the popularity
    prompt.popularity += 1
    db.commit()

    return {"id": prompt.id, "message": f"Increased popularity to {prompt.popularity}"}

@app.post("/prompts/{id}/reset-popularity", status_code=status.HTTP_200_OK)
async def reset_prompt_popularity(id: int, db: Session = Depends(get_db)):
    # Retrieve the prompt from the database
    prompt = db.query(Prompt).filter(Prompt.id == id).first()
    if prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # Increment the popularity
    prompt.popularity = 0
    db.commit()

    return {"id": prompt.id, "message": f"Reset popularity to {prompt.popularity}"}


@app.get("/prompts/{id}", status_code=status.HTTP_200_OK)
def read_system_prompt(id: int, db: Session = Depends(get_db)):
    prompt = db.query(Prompt).filter(Prompt.id == id).first()
    if prompt is None:
        raise HTTPException(status_code=404, detail="System prompt not found")
    return prompt


@app.put("/prompts/{id}", status_code=status.HTTP_200_OK)
def update_system_prompt(id: int, prompt_data: PromptUpdate, db: Session = Depends(get_db)):
    db_prompt = db.query(Prompt).filter(Prompt.id == id).first()
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="System prompt not found")

    for field, value in prompt_data.dict(exclude_unset=True).items():
        setattr(db_prompt, field, value)

    db.commit()
    return {"message": "System prompt updated successfully"}

@app.delete("/prompts/{id}", status_code=status.HTTP_200_OK)
def delete_system_prompt(id: int, db: Session = Depends(get_db)):
    db_prompt = db.query(Prompt).filter(Prompt.id == id).first()
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="System prompt not found")
    db.delete(db_prompt)
    db.commit()
    return {"message": "System prompt deleted successfully"}


#Questions API


# Pydantic Model for Question
class QuestionBase(BaseModel):
    summary: str
    tags: str
    isResolved: bool = False
    chatHistory: List[dict]  # List of objects with 'context' and 'role'

    

class QuestionUpdate(BaseModel):
    summary: Optional[str] = None
    tags: Optional[str] = None
    isResolved: Optional[bool] = None
    chatHistory: Optional[List[dict]] = None



class QuestionDisplay(BaseModel):
    id: int
    summary: str
    tags: str
    dateCreated: datetime
    isResolved: bool
    chatHistory: List[dict]


    class Config:
        orm_mode = True
        
        
# Create a Question
@app.post("/questions/", response_model=QuestionDisplay, status_code=status.HTTP_201_CREATED)
def create_question(question: QuestionBase, db: Session = Depends(get_db)):
    db_question = Question(**question.dict(), dateCreated=datetime.utcnow())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

# Read all Questions
@app.get("/questions/all", response_model=List[QuestionDisplay])
def read_all_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    return questions

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

# @app.get("/questions/count_not_resolved", status_code=status.HTTP_200_OK)
# def count_not_resolved_questions(db: Session = Depends(get_db)):
#     count = db.query(Question).filter(Question.isResolved == False).count()
#     return {"not_resolved_count": count}



#Utils
@app.get("/llm/health",
             summary="Checks the health of the Privategpt backend")
async def health():
    return {client.health.health()}


class IngestText(BaseModel):
    name: str
    text: str


# @app.post("/llm/ingest/text", status_code=status.HTTP_201_CREATED)
# async def manual_ingest_text(data: IngestText):
#     ingested_text_doc_id = (
#         client.ingestion.ingest_text(file_name=data.name, text=data.text)
#         .data[0]
#         .doc_id
#     )
#     return {"ingestedId": ingested_text_doc_id}

class IngestDataset(BaseModel):
    name: str
    Question: str
    Answer: str
    Context: str

def ingest_text_in_background(dataset_name, text, db_dataset, db):
    now = datetime.now()
    currentDate = now.strftime('%d-%m-%Y %H-%M-%S')
    ingested_text_doc_id = client.ingestion.ingest_text(file_name=f"{dataset_name} _DateCreated_ {currentDate}", text=text).data[0].doc_id
    print(f"Ingested Hash: {ingested_text_doc_id}")
    db_dataset.IngestId = ingested_text_doc_id
    db_dataset.IsIngested = True
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    
@app.post("/llm/ingest", response_model=str, status_code=status.HTTP_201_CREATED)
async def ingest_dataset(dataset: IngestDataset, db: db_dependency, background_tasks: BackgroundTasks):
    db_dataset = Dataset(**dataset.dict())
    # ingestedText = f"{db_dataset.Question.replace('\n\n', ' ')} \n {db_dataset.Answer.replace('\n\n', ' ')} \n {db_dataset.Context.replace('\n\n', ' ')}"
    # Perform replacements outside the f-string
    question_cleaned = db_dataset.Question.replace('\n\n', ' ')
    answer_cleaned = db_dataset.Answer.replace('\n\n', ' ')
    context_cleaned = db_dataset.Context.replace('\n\n', ' ')
    #Inaa to
    # Concatenate cleaned strings with f-string
    ingestedText = f"{question_cleaned} \n {answer_cleaned} \n {context_cleaned}"
    
    # Adding the ingestion to background tasks
    background_tasks.add_task(ingest_text_in_background, db_dataset.name, ingestedText, db_dataset, db)

    return "Queued for ingestion"


class IngestedDocument(BaseModel):
    doc_id: str
    file_name: str

class IngestedListResponse(BaseModel):
    documents: List[IngestedDocument]
    
@app.get("/llm/ingest/list", response_model=IngestedListResponse)
async def list_ingested():
    try:
        documents = []
        for doc in client.ingestion.list_ingested().data:
            documents.append({
                    'file_name': doc.doc_metadata['file_name'],
                    'doc_id': doc.doc_id
})
        # Return the response using the simplified model
        return IngestedListResponse(documents=documents)
    except Exception as e:
        # Handle errors appropriately
        raise HTTPException(status_code=500, detail=str(e))


    
@app.delete("/llm/ingest/{id}",status_code=status.HTTP_200_OK)
async def delete_ingest_dataset(id: int, db:db_dependency):
    db_dataset = db.query(Dataset).filter(Dataset.id == id).first()
    if db_dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # background_tasks = BackgroundTasks()
    # background_tasks.add_task(delete_ingest_text_in_background, db_dataset.IngestId)
    print(f"Deleting ingestion: {db_dataset.IngestId}")
    print("Deletion Error: ",client.ingestion.delete_ingested(db_dataset.IngestId))
    db.delete(db_dataset)
    db.commit()
    
def update_ingest_text_in_background(dataset_name, text, db_dataset,dataset_data, db):
    now = datetime.now()
    currentDate = now.strftime('%d-%m-%Y %H-%M-%S')
    previous_ingest_id = db_dataset.IngestId
    
    # Update dataset fields
    for field, value in dataset_data.dict(exclude_unset=True).items():
        setattr(db_dataset, field, value)

    try:
        # Deleting the previous ingestion
        deletion_response = client.ingestion.delete_ingested(previous_ingest_id)
        print(f"Deletion status for ingestion ID {previous_ingest_id}: {deletion_response}")

        # Ingest the new text
        ingestion_response = client.ingestion.ingest_text(
            file_name=f"{dataset_name} _DateCreated_ {currentDate}", text=text
        )
        ingested_text_doc_id = ingestion_response.data[0].doc_id

        # Update the dataset record with the new ingestion details
        db_dataset.IngestId = ingested_text_doc_id

        db.add(db_dataset)
        db.commit()
        db.refresh(db_dataset)
        
        print(f"Successfully updated ingestion for dataset {dataset_name} with new ID {ingested_text_doc_id}")
    except Exception as e:
        # Log specific exceptions or handle them differently as needed
        print(f"Error during ingestion update for {dataset_name}: {e}")

@app.put("/llm/ingest/{id}", status_code=status.HTTP_200_OK)
async def update_ingest_dataset(id: int, dataset_data: DatasetUpdate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    print(dataset_data)
    db_dataset = db.query(Dataset).filter(Dataset.id == id).first()
    if db_dataset is None:
        print("Error Updating, Dataset not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")

    # Prepare text for ingestion
    ingestedText = f"{db_dataset.Question.replace('\n\n', ' ')} \n {db_dataset.Answer.replace('\n\n', ' ')} \n {db_dataset.Context.replace('\n\n', ' ')}"
    
    # Update ingestion in background
    print("Sent to the ingestion queue")
    background_tasks.add_task(update_ingest_text_in_background, db_dataset.name, ingestedText, db_dataset,dataset_data, db)
    
    return {"message": "Dataset updated successfully"}

@app.delete("/llm/unlearn/{id}",status_code=status.HTTP_200_OK)
async def delete_ingest_dataset(id: int, db:db_dependency):
    db_dataset = db.query(Dataset).filter(Dataset.id == id).first()
    if db_dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # background_tasks = BackgroundTasks()
    # background_tasks.add_task(delete_ingest_text_in_background, db_dataset.IngestId)
    print(f"Deleting ingestion: {db_dataset.IngestId}")
    print("Deletion Error: ",client.ingestion.delete_ingested(db_dataset.IngestId))


#Save photo

def save_file_to_disk(file: UploadFile, path: str, filename: str) -> None:
    try:
        with open(os.path.join(path, filename), "wb") as buffer:
            buffer.write(file.file.read())
    except IOError as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

def create_photo_url(filename: str) -> str:
    return f"http://localhost:8000/photos/get/{filename}"

def save_photo_metadata(db: Session, filename: str, url: str) -> Photo:
    db_photo = Photo(filename=filename, url=url)
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo

@app.post("/photos/upload/")
async def upload_photo(file: UploadFile):
    
    # Generate a unique timestamp
    # timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex
    
    # Append the timestamp to the original filename
    filename = f"{unique_id[:5]}_{file.filename[:5]}.jpg"   # f"{unique_id}_{file.filename}"
    
    file_location = "uploaded_files"  # Folder where files will be stored
    if not os.path.exists(file_location):
        os.makedirs(file_location)
    
    save_file_to_disk(file, file_location, filename)
    url = create_photo_url(filename)
    
    db = SessionLocal()
    photo = save_photo_metadata(db, filename, url)
    db.close()
    
    return {"filename": filename, "url": url, "id": photo.id}

@app.get("/photos/get/{filename}")
async def get_photo(filename: str):
    file_location = os.path.join("uploaded_files", filename)
    if os.path.exists(file_location):
        return FileResponse(file_location)
    raise HTTPException(status_code=404, detail="File not found")
