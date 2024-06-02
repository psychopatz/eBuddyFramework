import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

load_dotenv()
username = os.getenv("dbUsername") #"ebuddy_admin"
password = os.getenv("dbPassword") #"OneTeamOneGoal"
print(f"Username: {username}, Password: {password}")

URL_DATABASE = f"mysql+pymysql://{username}:{password}@localhost:3306/ebuddyapp" #For Production

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()