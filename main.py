from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from routes.usuario import usuario
from routes.empleado import empleado
from routes.conceptonomina import conceptos_nomina
from routes.puesto import puesto
from routes.reporte import reporte
from config.openapi import tags_metadata
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime, timedelta
import hashlib
import base64

load_dotenv()

api_path = os.getenv("ROOT_PATH")
app = FastAPI(
    title="ZeeTech",
    description="EXAMEN PRÁCTICO DESARROLLADOR FULL STACK  --- REST API con FastAPI (python) y MariaDB",
    version="0.0.1",
    root_path=api_path,
    openapi_tags=tags_metadata,
)

# Configuración del middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar la clave secreta del JWT desde el archivo .env
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# Dependencia OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Función para verificar un token JWT de manera personalizada 
def verify_token(token: str):
    try:
        # Este ejemplo usa una verificación simple, pero puedes personalizarla
        # Para un ejemplo más avanzado, implementa la lógica de decodificación y verificación del token.
        decoded_token = base64.urlsafe_b64decode(token.split(".")[1] + "==")  # Decodificación Base64
        payload = decoded_token.decode("utf-8")
        
        # Lógica de validación del payload 
        if "exp" not in payload:
            raise HTTPException(status_code=401, detail="Token inválido")
        
        exp_time = datetime.utcfromtimestamp(int(payload.split(":")[1]))  # Aquí extraemos la fecha de expiración
        if exp_time < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Token expirado")

        return payload  # Regresa el payload decodificado
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token inválido")

# Dependencia para obtener el usuario actual
def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_token(token)

# Incluye las rutas
app.include_router(usuario)
app.include_router(empleado)
app.include_router(conceptos_nomina)
app.include_router(puesto)
app.include_router(reporte)#, dependencies=[Depends(get_current_user)]

@app.get("/")
async def docs_redirect():
    return RedirectResponse(url=api_path + 'docs')
