#!/bin/bash

# Configurações
EC2_USER="ec2-user"  # ou "ubuntu" dependendo da AMI
EC2_HOST="your-ec2-public-ip"  # Substitua pelo IP público da sua instância EC2
PEM_FILE="your-key.pem"  # Substitua pelo nome do seu arquivo de chave SSH
PROJECT_NAME="room-reservation"  # Nome do projeto
REMOTE_DIR="/home/${EC2_USER}/${PROJECT_NAME}"  # Diretório remoto para o projeto

# 1. Acessar a EC2 e configurar o ambiente
echo "Configurando o ambiente na instância EC2..."
ssh -i ${PEM_FILE} ${EC2_USER}@${EC2_HOST} << EOF
  sudo yum update -y
  sudo yum install -y docker git
  sudo service docker start
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
EOF

# 2. Copiar os arquivos do projeto para a instância EC2
echo "Copiando arquivos do projeto para a EC2..."
scp -i ${PEM_FILE} -r ./ ${EC2_USER}@${EC2_HOST}:${REMOTE_DIR}

# 3. Acessar a instância e rodar o Docker Compose
echo "Executando a aplicação na EC2..."
ssh -i ${PEM_FILE} ${EC2_USER}@${EC2_HOST} << EOF
  cd ${REMOTE_DIR}
  sudo docker-compose down
  sudo docker-compose up --build -d
EOF

echo "Deploy concluído com sucesso!"
