from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from models import models as model
from schemas import schema_reporte
from config.db import get_db
from typing import List
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from decimal import Decimal  # Importar Decimal

# Configuración y carga del entorno
load_dotenv()

# Crear el router de puestos
reporte = APIRouter()

# CRUD para Puestos

# Crear un nuevo puesto
@reporte.get("/reporte_empleados", response_model=List[schema_reporte.ReporteEmpleado], tags=["reporte"])
def get_reporte_empleados(db: Session = Depends(get_db)):
    # Consulta SQL para obtener el reporte, ahora usando text()
    query = text("""
        SELECT 
            e.id AS empleado_id,
            e.nombre AS empleado_nombre,
            p.nombre AS puesto,
            COUNT(e.id) OVER () AS total_empleados,
            COUNT(e.id) OVER (PARTITION BY e.puesto_id) AS empleados_por_puesto,
            SUM(c.importe) OVER (PARTITION BY e.puesto_id) AS percepciones_totales
        FROM 
            empleados e
        JOIN 
            puestos p ON e.puesto_id = p.id
        LEFT JOIN 
            conceptos_nomina c ON p.id = c.puesto_id AND c.tipo = 'percepcion'
        ORDER BY 
            p.nombre, e.nombre;
    """)

    result = db.execute(query).fetchall()

    # Formatear el resultado en un formato adecuado
    formatted_result = [
        {
            "empleado_id": row[0],
            "empleado_nombre": row[1],
            "puesto": row[2],
            "total_empleados": row[3],
            "empleados_por_puesto": row[4],
            # Convertir Decimal a float
            "percepciones_totales": float(row[5]) if isinstance(row[5], Decimal) else row[5],
        }
        for row in result
    ]
    
    return JSONResponse(content=formatted_result)