# Utiliza uma imagem Python oficial do Docker como imagem base
FROM python:3.9-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de requisitos para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências necessárias
RUN pip install --no-cache-dir -r requirements.txt

# Copia o resto do código do projeto para o diretório de trabalho
COPY . .

# Define a variável de ambiente para evitar problemas de buffer no Python
ENV PYTHONUNBUFFERED=1

# Comando para iniciar a aplicação
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
