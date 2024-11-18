from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from config.db import get_db
from models.models import Usuario
from schemas.schema_usuario import UsuarioInfo, UsuarioCreate, UsuarioLogin, UsuarioBase
from typing import List
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

# Cargar configuraciones de entorno
load_dotenv()

# Cargar la clave secreta del JWT desde el archivo .env
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Crear un contexto para las contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Crear el router de usuarios
usuario = APIRouter()

# Dependencia de OAuth2 para obtener el token desde los headers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth")

# Función para generar el token JWT
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

# Función para obtener el usuario del token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decodificar el token JWT
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        correo: str = payload.get("sub")
        if correo is None:
            raise credentials_exception
        user = db.query(Usuario).filter(Usuario.correo == correo).first()
        if user is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user

# Clase Hasher para manejar contraseñas
class Hasher:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verifica si una contraseña plana coincide con su hash."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hashea una contraseña utilizando bcrypt."""
        return pwd_context.hash(password)

# Endpoint para autenticación de usuarios (Login)
@usuario.post(
    "/auth",
    tags=["usuarios"],
    response_model=UsuarioInfo,
    description="Inicio de sesión de un usuario."
)
def login_usuario(usuario_login: UsuarioLogin, db: Session = Depends(get_db)):
    """
    Autentica un usuario basado en su correo y contraseña y genera un token JWT.
    """
    # Buscar al usuario por correo
    user = db.query(Usuario).filter(Usuario.correo == usuario_login.correo).first()
    
    # Si el usuario no existe, devolver mensaje específico
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado en la base de datos."
        )
    
    # Verificar si la contraseña es incorrecta
    if not Hasher.verify_password(usuario_login.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta."
        )
    
    # Generar el token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.correo},  # "sub" es el sujeto, generalmente el correo del usuario
        expires_delta=access_token_expires
    )
    
    # Devolver el token junto con la información del usuario
    return JSONResponse(
        content={
            "message": "Login exitoso",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "nombre_usuario": user.nombre_usuario,
                "correo": user.correo,
                "rol": user.rol,
                "f_alta": user.f_alta.isoformat()  # Asegurarse de serializar correctamente el datetime
            }
        }
    )

# Endpoint para listar todos los usuarios (requiere autenticación)
@usuario.get(
    "/usuarios",
    tags=["usuarios"],
    response_model=List[UsuarioInfo],
    description="Obtener una lista de todos los usuarios."
)
def get_usuarios(db: Session = Depends(get_db)):
    """
    Devuelve una lista de todos los usuarios. Requiere autenticación.
    """
    usuarios = db.query(Usuario).all()
    return usuarios

# Endpoint para crear un nuevo usuario
@usuario.post(
    "/usuarios",
    tags=["usuarios"],
    response_model=UsuarioInfo,
    description="Crear un nuevo usuario."
)
def create_usuario(usuario_create: UsuarioCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo usuario. Requiere datos de nombre de usuario, correo, contraseña, rol, y empleado_id.
    """
    # Verificar si el correo ya está en uso
    existing_user = db.query(Usuario).filter(Usuario.correo == usuario_create.correo).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado en el sistema."
        )
    
    # Hashear la contraseña antes de guardarla
    hashed_password = Hasher.get_password_hash(usuario_create.password)
    
    # Crear un nuevo usuario
    new_user = Usuario(
        nombre_usuario=usuario_create.nombre_usuario,
        correo=usuario_create.correo,
        password=hashed_password,
        rol=usuario_create.rol,
        empleado_id=usuario_create.empleado_id  # Asumimos que el campo 'empleado_id' es proporcionado
    )
    
    # Agregar el usuario a la base de datos
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# Endpoint para actualizar un usuario (requiere autenticación)
@usuario.put(
    "/usuarios/{usuario_id}",
    tags=["usuarios"],
    response_model=UsuarioInfo,
    description="Actualizar la información de un usuario."
)
def update_usuario(usuario_id: int, usuario_data: UsuarioBase, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    """
    Actualiza la información de un usuario basado en su ID. Requiere autenticación.
    """
    user = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    # Actualizar los datos del usuario
    user.nombre_usuario = usuario_data.nombre_usuario
    user.correo = usuario_data.correo
    user.rol = usuario_data.rol
    db.commit()
    db.refresh(user)
    return user

# Endpoint para eliminar un usuario (requiere autenticación)
@usuario.delete(
    "/usuarios/{usuario_id}",
    tags=["usuarios"],
    status_code=status.HTTP_204_NO_CONTENT,
    description="Eliminar un usuario del sistema."
)
def delete_usuario(usuario_id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    """
    Elimina un usuario basado en su ID. Requiere autenticación.
    """
    user = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    db.delete(user)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)