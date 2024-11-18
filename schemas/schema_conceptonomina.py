from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ConceptoNominaBase(BaseModel):
    nombre: str = Field(..., max_length=100, description="Nombre del concepto de nómina")
    tipo: str = Field(..., pattern="^(percepcion|deduccion)$", description="Tipo de concepto: 'percepcion' o 'deduccion'")
    importe: float = Field(..., ge=0, description="Importe del concepto")
    puesto_id: Optional[int] = Field(None, description="ID del puesto asociado (puede ser nulo)")  # Cambiado a Optional[int]

class ConceptoNominaCreate(ConceptoNominaBase):
    """
    Esquema para la creación de un concepto de nómina.
    """
    pass

class ConceptoNominaUpdate(BaseModel):
    """
    Esquema para la actualización parcial de un concepto de nómina.
    """
    nombre: str = Field(..., max_length=100, description="Nombre del concepto de nómina")
    tipo: str = Field(..., pattern="^(percepcion|deduccion)$", description="Tipo de concepto: 'percepcion' o 'deduccion'")
    importe: float = Field(..., ge=0, description="Importe del concepto")
    puesto_id: Optional[int] = Field(None, description="ID del puesto asociado (puede ser nulo)")  # Cambiado a Optional[int]

class ConceptoNominaInDB(ConceptoNominaBase):
    """
    Esquema que representa un concepto de nómina almacenado en la base de datos.
    """
    id: int = Field(..., description="ID único del concepto de nómina")
    f_alta: datetime = Field(..., description="Fecha de alta en la base de datos")

    class Config:
        orm_mode = True
        from_attributes = True

class ConceptoNominaResponse(BaseModel):
    """
    Esquema para estructurar las respuestas de la API.
    """
    data: ConceptoNominaInDB
    message: Optional[str] = Field(None, description="Mensaje adicional opcional")