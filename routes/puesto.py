from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import models as model
from schemas import schema_puesto  # Importa los esquemas correctamente
from config.db import get_db
from typing import List
from dotenv import load_dotenv
from fastapi.responses import Response

# Configuración y carga del entorno
load_dotenv()

# Crear el router de puestos
puesto = APIRouter()

# CRUD para Puestos

# Crear un nuevo puesto
@puesto.post("/puestos", response_model=schema_puesto.PuestoInDB, tags=["puestos"])
def create_puesto(puesto: schema_puesto.PuestoCreate, db: Session = Depends(get_db)):
    db_puesto = model.Puesto(
        nombre=puesto.nombre, 
        sueldo_base=puesto.sueldo_base
    )
    db.add(db_puesto)
    db.commit()
    db.refresh(db_puesto)
    return db_puesto

# Obtener todos los puestos
@puesto.get("/puestos", response_model=List[schema_puesto.PuestoInDB], tags=["puestos"])
def get_puestos(db: Session = Depends(get_db)):
    return db.query(model.Puesto).all()

# Obtener un puesto específico por ID
@puesto.get("/puestos/{puesto_id}", response_model=schema_puesto.PuestoInDB, tags=["puestos"])
def get_puesto(puesto_id: int, db: Session = Depends(get_db)):
    puesto = db.query(model.Puesto).filter(model.Puesto.id == puesto_id).first()
    if puesto is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puesto no encontrado")
    return puesto

# Actualizar un puesto existente
@puesto.put("/puestos/{puesto_id}", response_model=schema_puesto.PuestoInDB, tags=["puestos"])
def update_puesto(puesto_id: int, puesto: schema_puesto.PuestoUpdate, db: Session = Depends(get_db)):
    db_puesto = db.query(model.Puesto).filter(model.Puesto.id == puesto_id).first()
    if db_puesto is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puesto no encontrado")
    
    db_puesto.nombre = puesto.nombre
    db_puesto.sueldo_base = puesto.sueldo_base
    db.commit()
    db.refresh(db_puesto)
    return db_puesto

# Eliminar un puesto
@puesto.delete("/puestos/{puesto_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["puestos"])
def delete_puesto(puesto_id: int, db: Session = Depends(get_db)):
    db_puesto = db.query(model.Puesto).filter(model.Puesto.id == puesto_id).first()
    if db_puesto is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puesto no encontrado")
    
    db.delete(db_puesto)
    db.commit()
    return None