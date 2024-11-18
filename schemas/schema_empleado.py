from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Puesto(BaseModel):
    """
    Esquema para los datos del puesto.
    """
    id: int
    nombre: str = Field(..., max_length=100, description="Nombre del puesto asociado")

    class Config:
        orm_mode = True


class EmpleadoBase(BaseModel):
    """
    Esquema base para el modelo de empleados.
    """
    nombre: str = Field(..., max_length=100, description="Nombre del empleado")
    region: str = Field(..., max_length=50, description="Región donde se encuentra el empleado")
    puesto_id: Optional[int] = Field(None, description="ID del puesto asociado (puede ser nulo)")
    estado: str = Field(..., pattern="^(activo|inactivo)$", description="Estado del empleado: 'activo' o 'inactivo'")


class EmpleadoCreate(EmpleadoBase):
    """
    Esquema para la creación de un nuevo empleado.
    """
    pass


class EmpleadoUpdate(EmpleadoBase):
    """
    Esquema para la actualización de los datos de un empleado.
    """
    pass


class EmpleadoInDB(EmpleadoBase):
    """
    Esquema para el modelo de empleado en la base de datos.
    """
    id: int
    f_alta: datetime  # Fecha de alta del empleado
    puesto: Optional[Puesto] = Field(None, description="Datos del puesto asociado")  # Relación con el puesto

    class Config:
        orm_mode = True