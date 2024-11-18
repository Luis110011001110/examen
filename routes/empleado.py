from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import models as model
from schemas import schema_empleado
from config.db import get_db
from typing import List
from sqlalchemy.orm import joinedload

empleado = APIRouter()

# Crear un empleado
@empleado.post("/empleados", response_model=schema_empleado.EmpleadoInDB, tags=["empleados"])
def create_empleado(empleado: schema_empleado.EmpleadoCreate, db: Session = Depends(get_db)):
    db_empleado = model.Empleado(
        nombre=empleado.nombre,
        region=empleado.region,
        puesto_id=empleado.puesto_id,
        estado=empleado.estado,
    )
    db.add(db_empleado)
    db.commit()
    db.refresh(db_empleado)
    return db_empleado

# Obtener todos los empleados
@empleado.get("/empleados", response_model=List[schema_empleado.EmpleadoInDB], tags=["empleados"])
def get_empleados(db: Session = Depends(get_db)):
    return db.query(model.Empleado).options(joinedload(model.Empleado.puesto)).all()

# Obtener un empleado por ID
@empleado.get("/empleados/{empleado_id}", response_model=schema_empleado.EmpleadoInDB, tags=["empleados"])
def get_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(model.Empleado).filter(model.Empleado.id == empleado_id).first()
    if empleado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado")
    return empleado

# Actualizar un empleado
@empleado.put("/empleados/{empleado_id}", response_model=schema_empleado.EmpleadoInDB, tags=["empleados"])
def update_empleado(empleado_id: int, empleado: schema_empleado.EmpleadoUpdate, db: Session = Depends(get_db)):
    db_empleado = db.query(model.Empleado).filter(model.Empleado.id == empleado_id).first()
    if db_empleado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado")
    
    db_empleado.nombre = empleado.nombre
    db_empleado.region = empleado.region
    db_empleado.puesto_id = empleado.puesto_id
    db_empleado.estado = empleado.estado
    db.commit()
    db.refresh(db_empleado)
    return db_empleado

# Eliminar un empleado
@empleado.delete("/empleados/{empleado_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["empleados"])
def delete_empleado(empleado_id: int, db: Session = Depends(get_db)):
    db_empleado = db.query(model.Empleado).filter(model.Empleado.id == empleado_id).first()
    if db_empleado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado")
    
    db.delete(db_empleado)
    db.commit()
    return None