from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import models as model
from schemas import schema_conceptonomina
from config.db import get_db
from typing import List
from fastapi.responses import JSONResponse

# Crear el router de conceptos_nomina
conceptos_nomina = APIRouter()

# Crear un concepto de nómina
@conceptos_nomina.post(
    "/conceptos_nomina", 
    response_model=schema_conceptonomina.ConceptoNominaInDB, 
    tags=["conceptos_nomina"],
    status_code=status.HTTP_201_CREATED
)
def create_concepto_nomina(
    concepto: schema_conceptonomina.ConceptoNominaCreate, 
    db: Session = Depends(get_db)
):
    db_concepto = model.ConceptoNomina(
        nombre=concepto.nombre,
        tipo=concepto.tipo,
        importe=concepto.importe,
        puesto_id=concepto.puesto_id,
    )
    db.add(db_concepto)
    db.commit()
    db.refresh(db_concepto)
    return db_concepto

# Obtener todos los conceptos de nómina
@conceptos_nomina.get(
    "/conceptos_nomina", 
    response_model=List[schema_conceptonomina.ConceptoNominaInDB], 
    tags=["conceptos_nomina"]
)
def get_conceptos_nomina(db: Session = Depends(get_db)):
    conceptos = db.query(model.ConceptoNomina).all()
    if not conceptos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No hay conceptos de nómina registrados"
        )

    # Convertir las instancias de SQLAlchemy a Pydantic usando from_orm
    conceptos_response = [schema_conceptonomina.ConceptoNominaInDB.from_orm(concepto) for concepto in conceptos]
    
    return conceptos_response

# Obtener un concepto de nómina por ID
@conceptos_nomina.get(
    "/conceptos_nomina/{concepto_id}", 
    response_model=schema_conceptonomina.ConceptoNominaResponse, 
    tags=["conceptos_nomina"]
)
def get_concepto_nomina(concepto_id: int, db: Session = Depends(get_db)):
    concepto = db.query(model.ConceptoNomina).filter(model.ConceptoNomina.id == concepto_id).first()
    if concepto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Concepto de nómina no encontrado"
        )
    # Convertir el concepto a su formato Pydantic
    concepto_response = schema_conceptonomina.ConceptoNominaInDB.from_orm(concepto)
    return {"data": concepto_response}  # Devolver dentro de 'data'

# Actualizar un concepto de nómina
@conceptos_nomina.put(
    "/conceptos_nomina/{concepto_id}", 
    response_model=schema_conceptonomina.ConceptoNominaInDB, 
    tags=["conceptos_nomina"]
)
def update_concepto_nomina(
    concepto_id: int, 
    concepto: schema_conceptonomina.ConceptoNominaUpdate, 
    db: Session = Depends(get_db)
):
    db_concepto = db.query(model.ConceptoNomina).filter(model.ConceptoNomina.id == concepto_id).first()
    if db_concepto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Concepto de nómina no encontrado"
        )
    
    # Actualizar solo los campos proporcionados en la solicitud
    if concepto.nombre:
        db_concepto.nombre = concepto.nombre
    if concepto.tipo:
        db_concepto.tipo = concepto.tipo
    if concepto.importe:
        db_concepto.importe = concepto.importe
    if concepto.puesto_id is not None:
        db_concepto.puesto_id = concepto.puesto_id
    
    db.commit()
    db.refresh(db_concepto)
    return db_concepto

# Eliminar un concepto de nómina
@conceptos_nomina.delete(
    "/conceptos_nomina/{concepto_id}", 
    status_code=status.HTTP_204_NO_CONTENT, 
    tags=["conceptos_nomina"]
)
def delete_concepto_nomina(concepto_id: int, db: Session = Depends(get_db)):
    db_concepto = db.query(model.ConceptoNomina).filter(model.ConceptoNomina.id == concepto_id).first()
    if db_concepto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Concepto de nómina no encontrado"
        )
    
    db.delete(db_concepto)
    db.commit()
    return JSONResponse(content={"message": "Concepto de nómina eliminado con éxito."}, status_code=status.HTTP_204_NO_CONTENT)