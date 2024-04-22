from sqlalchemy import Boolean, Column, Integer, String
from database import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(50), unique=True, index=True)
    password = Column(String(50)) # I hashed ra nya ni nako in the future I guess for security reasons
    firstName = Column(String(20))
    lastName = Column(String(20))
    
    
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True) 
    docId = Column(String(50))
    docName = Column(String(50),index=True) # Kapoyg specify sa mga str size bahala nag di optimized ang database
    creatorId = Column(Integer)
    dateCreated = Column(String(30))