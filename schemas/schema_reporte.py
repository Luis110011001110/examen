from pydantic import BaseModel
from typing import Optional

class ReporteEmpleado(BaseModel):
    empleado_id: int
    empleado_nombre: str
    puesto: str
    total_empleados: int
    empleados_por_puesto: int
    percepciones_totales: Optional[float] = 0.0  # Puede ser nulo o 0 si no hay percepciones

    class Config:
        orm_mode = True