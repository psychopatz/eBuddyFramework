from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Annotated
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from pgpt_python.client import PrivateGPTApi
import models

backend = FastAPI(
    title="eBuddy Backend",
    description="Ai Powered Digital Costumer Service"
    )

models.Base.metadata.create_all(bind=engine)

#PrivateGPT URL, Usually hidden and just in localhost basin mahack so kani ra i expose
client = PrivateGPTApi(base_url="http://localhost:8001")


class DocumentBase(BaseModel):
    docId: str
    docName: str
    creatorId: int
    dateCreated: str

class DocumentUpdate(BaseModel):
    id: int
    docId: str
    docName: str
    creatorId: int
    dateCreated: str
    
    
class AdminBase(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str

class AdminUpdate(BaseModel):
    id: int
    email: str
    password: str
    firstName: str
    lastName: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

#Admins API
@backend.post("/admins/", status_code=status.HTTP_201_CREATED)
async def create_admin(admin: AdminBase, db:db_dependency):
    db_admin = models.Admin(**admin.dict())
    db.add(db_admin)
    db.commit()
    #return {"status": "ok"}

@backend.get("/admins/{id}",status_code=status.HTTP_200_OK)
async def read_admin(id: int, db:db_dependency):
    admin = db.query(models.Admin).filter(models.Admin.id == id).first()
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin

@backend.put("/admins/{admin_id}", status_code=status.HTTP_200_OK)
async def update_admin(admin_id: int, admin_data: AdminUpdate, db: Session = Depends(get_db)):
    db_admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    

    for field, value in admin_data.dict(exclude_unset=True).items():
        setattr(db_admin, field, value)
    
    db.commit()
    return {"message": "Admin updated successfully"}

@backend.delete("/admins/{id}",status_code=status.HTTP_200_OK)
async def delete_admin(id: int, db:db_dependency):
    db_admin = db.query(models.Admin).filter(models.Admin.id == id).first()
    if db_admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    db.delete(db_admin)
    db.commit()
    

#Documents API
@backend.post("/docs/", status_code=status.HTTP_201_CREATED)
async def create_docs(document: DocumentBase, db:db_dependency):
    db_document = models.Document(**document.dict())
    db.add(db_document)
    db.commit()
    #return {"status": "ok"}

@backend.get("/docs/{id}",status_code=status.HTTP_200_OK)
async def read_docs(id: int, db:db_dependency):
    document = db.query(models.Document).filter(models.Document.id == id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@backend.put("/docs/{id}", status_code=status.HTTP_200_OK)
async def update_docs(id: int, document_data: DocumentUpdate, db: Session = Depends(get_db)):
    db_document = db.query(models.Document).filter(models.Document.id == id).first()
    if db_document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    # Update the admin's information
    for field, value in document_data.dict(exclude_unset=True).items():
        setattr(db_document, field, value)
    
    db.commit()
    return {"message": "Document updated successfully"}

@backend.delete("/docs/{id}",status_code=status.HTTP_200_OK)
async def delete_docs(id: int, db:db_dependency):
    db_document = db.query(models.Document).filter(models.Document.id == id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(db_document)
    db.commit()

#Utils
@backend.get("/health",
             summary="Checks the health of the Privategpt backend")
async def health():
    return {client.health.health()}
