from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import time
from sqlalchemy.exc import OperationalError
from fastapi.middleware.cors import CORSMiddleware

DATABASE_URL = "postgresql://postgres:password@db:5432/dbcursos"

max_retries = 5
for attempt in range(max_retries):
    try:
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base = declarative_base()
        Base.metadata.create_all(bind=engine)
        break
    except OperationalError as e:
        if attempt < max_retries - 1:
            time.sleep(5)
        else:
            raise e


class CursoDB(Base):
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    titulo = Column(String, index=True)
    descricao = Column(String)
    data_termino = Column(String)
    

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Curso(BaseModel):
    id: Optional[int] = None
    titulo: str
    descricao: str
    data_termino: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/cursos/", response_model=Curso)
def adicionar_curso(curso: Curso, db: Session = Depends(get_db)):
    db_curso = CursoDB(**curso.dict())
    db.add(db_curso)
    db.commit()
    db.refresh(db_curso)
    return db_curso


@app.get("/cursos/", response_model=List[Curso])
def listar_cursos(db: Session = Depends(get_db)):
    return db.query(CursoDB).all()


@app.delete("/cursos/{curso_id}", response_model=Curso)
def excluir_curso(curso_id: int, db: Session = Depends(get_db)):
    db_curso = db.query(CursoDB).filter(CursoDB.id == curso_id).first()
    if db_curso is None:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    db.delete(db_curso)
    db.commit()
    return db_curso


@app.put("/cursos/{curso_id}", response_model=Curso)
def atualizar_curso(curso_id: int, curso: Curso, db: Session = Depends(get_db)):
    db_curso = db.query(CursoDB).filter(CursoDB.id == curso_id).first()
    if db_curso is None:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    
    # Atualiza apenas os campos que foram passados
    for key, value in curso.dict(exclude_unset=True).items():
        setattr(db_curso, key, value)
    
    db.commit()
    db.refresh(db_curso)
    return db_curso
