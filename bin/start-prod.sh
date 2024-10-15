#!/usr/bin/env bash
set -e

echo "Cargando variables de entorno desde .env"
set -a
. ./.env
set +a

# Verificando la conexion a MinIO
bin/wait-for-it.sh $MINIO_HOST:$MINIO_PORT

# Iniciando la aplicacion en modo desarrollo
node dist/main.js