from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

username = "ebuddy_admin"
password = "OneTeamOneGoal"

# URL_DATABASE = "mysql+pymysql://root:root@localhost:3306/ebuddyapp" #For Development
URL_DATABASE = f"mysql+pymysql://{username}:{password}@localhost:3306/ebuddyapp" #For Production

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()