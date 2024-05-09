from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

# Admin Model
class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(50), unique=True, index=True)
    password = Column(String(50))  # Hash this in the future for security
    firstName = Column(String(20))
    lastName = Column(String(20))
    
# Datasets Model
class Dataset(Base):
    __tablename__ = 'datasets'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    Question = Column(Text, nullable=False)
    Answer = Column(Text, nullable=False)
    Context = Column(Text, nullable=False)
    DateCreated = Column(DateTime(timezone=True), server_default=func.now())
    IngestId = Column(String(255), nullable=True)
    IsIngested = Column(Boolean, default=False)
    
# System Prompts Model
    
class Prompt(Base):
    __tablename__ = 'prompts'
    id = Column(String(50), primary_key=True, index=True)  
    content = Column(Text, nullable=False)
    role = Column(String(255), nullable=False)


# Questions Model
class Question(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True, index=True)
    summary = Column(Text, nullable=False)
    dateCreated = Column(DateTime(timezone=True), server_default=func.now())
    isResolved = Column(Boolean, default=False)
    chatHistory = Column(JSON, nullable=False)  # Using JSON to store the list of chat objects