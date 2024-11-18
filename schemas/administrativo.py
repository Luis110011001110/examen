from typing import Optional, List, Tuple
from pydantic import BaseModel

class Administrativo(BaseModel):
    curp: str
    nombre: str
    papp: str
    sapp: Optional[str]
    correo: Optional[str]
    plantel: Optional[str]
    idrol: int 
    class Config:
        orm_mode = True

class AdministrativoLogin(BaseModel):
    username: str
    password: str

class AdministrativoCreate(Administrativo):
    password: str

class Role(BaseModel):
    idrol: int
    descripcion: str


class TemplateBase(BaseModel):
    role: int
    behavior: int
    module: int

class ModuleBase(BaseModel):
    id_mod: int
    menu: str
    submenu: Optional[str]
    ruta: str
    icono: str
    orden: int


class BehaviorBase(BaseModel):
    id_beh: int
    module: int
    nivel: int
    nombre: str
    descripcion: str

class PlantelBase(BaseModel):
    clave: str
    nombre: str
    estimado_inscripcion: int
    estimado_reinscripcion: int
    conapp: str

class AdministrativoInfo(BaseModel):
    curp: str
    nombre: str
    papellido: str
    sapellido: str
    cinstitucional: str
    pclave: str
    idrol: int
    rol: str
    pnombre: str

class AdministrativoUpdate(BaseModel):
    nombre: Optional[str] = None
    papp: Optional[str] = None
    sapp: Optional[str] = None
    correo: Optional[str] = None
    plantel: Optional[str] = None
    idrol: Optional[int] = None