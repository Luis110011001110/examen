from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Esquema base para Usuario
class UsuarioBase(BaseModel):
    nombre_usuario: str
    correo: EmailStr
    rol: str

# Esquema para crear un nuevo usuario
class UsuarioCreate(UsuarioBase):
    password: str  # La contraseña es requerida para creación
    empleado_id: Optional[int] = None

# Esquema para usuarios almacenados en la base de datos
class UsuarioInDB(UsuarioBase):
    id: int
    empleado_id: int    # Relación opcional con la tabla empleados
    f_alta: Optional[datetime] = None

    class Config:
        orm_mode = True  # Permite trabajar directamente con objetos ORM

# Esquema para iniciar sesión
class UsuarioLogin(BaseModel):
    correo: EmailStr  # Se usará el correo como identificador
    password: str

# Esquema de respuesta al iniciar sesión
class UsuarioInfo(UsuarioBase):
    id: int
    f_alta: datetime

    class Config:
        orm_mode = True