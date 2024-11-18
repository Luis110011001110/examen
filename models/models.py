from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, Date, TIMESTAMP, func
from sqlalchemy.orm import relationship
from config.db import Base
from sqlalchemy import Sequence


# Modelo para la tabla "puestos"
class Puesto(Base):
    __tablename__ = "puestos"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    sueldo_base = Column(Numeric(10, 2), nullable=False)
    f_alta = Column(TIMESTAMP, default=func.now())

    # Relación con la tabla empleados (uno a muchos)
    empleados = relationship("Empleado", back_populates="puesto")
    conceptos_nomina = relationship("ConceptoNomina", back_populates="puesto")


# Modelo para la tabla "empleados"
class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    region = Column(String(50), nullable=False)
    puesto_id = Column(Integer, ForeignKey('puestos.id'))
    estado = Column(String(10), nullable=False)
    f_alta = Column(TIMESTAMP, default=func.now())

    # Relación con la tabla puestos (muchos a uno)
    puesto = relationship("Puesto", back_populates="empleados")

    # Relación con la tabla usuarios (uno a uno)
    usuario = relationship("Usuario", back_populates="empleado", uselist=False)

    # Relación con la tabla nomina (uno a muchos)
    nominas = relationship("Nomina", back_populates="empleado")


# Modelo para la tabla "usuarios"
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True) 
    nombre_usuario = Column(String(50), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    rol = Column(String(10), nullable=False)
    empleado_id = Column(Integer, ForeignKey('empleados.id'))
    f_alta = Column(TIMESTAMP, default=func.now())

    # Relación con la tabla empleados (muchos a uno)
    empleado = relationship("Empleado", back_populates="usuario")


# Modelo para la tabla "conceptos_nomina"
class ConceptoNomina(Base):
    __tablename__ = "conceptos_nomina"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(12), nullable=False)
    importe = Column(Numeric(10, 2), nullable=False)
    puesto_id = Column(Integer, ForeignKey('puestos.id'))
    f_alta = Column(TIMESTAMP, default=func.now())

    # Relación con la tabla puestos (muchos a uno)
    puesto = relationship("Puesto", back_populates="conceptos_nomina")


# Modelo para la tabla "nomina"
class Nomina(Base):
    __tablename__ = "nomina"

    id = Column(Integer, primary_key=True)
    empleado_id = Column(Integer, ForeignKey('empleados.id'), nullable=False)
    fecha_generacion = Column(Date, nullable=False)
    total_percepciones = Column(Numeric(10, 2), nullable=False)
    total_deducciones = Column(Numeric(10, 2), nullable=False)
    neto_pagado = Column(Numeric(10, 2), nullable=False)
    f_alta = Column(TIMESTAMP, default=func.now())

    # Relación con la tabla empleados (muchos a uno)
    empleado = relationship("Empleado", back_populates="nominas")