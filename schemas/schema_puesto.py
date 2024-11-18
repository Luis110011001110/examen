from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PuestoBase(BaseModel):
    """
    Esquema base para Puesto.
    """
    nombre: str = Field(..., max_length=100, description="Nombre del puesto")
    sueldo_base: float = Field(..., gt=0, description="Sueldo base del puesto")


class PuestoCreate(PuestoBase):
    """
    Esquema para creación de un puesto.
    """
    pass


class PuestoUpdate(BaseModel):
    """
    Esquema para actualización parcial de un puesto.
    """
    nombre: Optional[str] = Field(None, max_length=100, description="Nombre del puesto")
    sueldo_base: Optional[float] = Field(None, gt=0, description="Sueldo base del puesto")


class PuestoInDB(PuestoBase):
    """
    Esquema que representa un puesto almacenado en la base de datos.
    """
    id: int
    f_alta: datetime

    class Config:
        orm_mode = True


class PuestoResponse(BaseModel):
    """
    Esquema para respuestas de API.
    """
    data: PuestoInDB
    message: Optional[str] = Field(None, description="Mensaje adicional opcional")