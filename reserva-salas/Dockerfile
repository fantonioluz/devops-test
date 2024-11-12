# Usa uma imagem oficial do Node
FROM node:18

# Define o diretório de trabalho na imagem
WORKDIR /usr/src/app

# Copia os arquivos de dependências (package.json e package-lock.json)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta da aplicação
EXPOSE 5000

# Define o comando para iniciar a aplicação
CMD ["node", "server.js"]
