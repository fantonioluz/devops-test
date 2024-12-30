# Room Reservation Application

Projeto previamente criado por @fantonioluz, e modificado para atender aos requisitos do teste para a vaga em estagio Devops, a aplicação é composta por um front-end, uma API e um banco de dados MongoDB. A infraestrutura foi configurada para diferentes ambientes, incluindo localmente com Docker Compose, em um servidor remoto via AWS EC2 utilizando GitHub Actions, e em um cluster Kubernetes com Kind.

---

## **Estrutura do Projeto**

- **Front-End**: React, configurado para se comunicar com a API.
- **API**: Node.js com Express, utilizando MongoDB como banco de dados.
- **Banco de Dados**: MongoDB, gerenciado em contêiner Docker.

---

## **Opções de Execução**

### **1. Docker Compose (Ambiente Local)**

O arquivo `docker-compose.yaml` permite rodar a aplicação localmente com os serviços integrados.

#### **Instruções**

1. Certifique-se de que o Docker está instalado e rodando no seu sistema.
2. No diretório raiz do projeto, execute:
   ```bash
   docker-compose up --build
   ```
3. Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

#### **Configuração do Docker Compose**

- **Front-End**: Exposto na porta `3000`.
- **API**: Exposto na porta `5000`.
- **MongoDB**: Exposto na porta `27017`, com credenciais configuradas no `docker-compose.yaml`.

---

### **2. GitHub Actions e EC2 (Ambiente Remoto)**

O workflow configurado no GitHub Actions permite deploy automatizado para uma instância EC2 na AWS.

#### **Setup**

1. Configure uma instância EC2 na AWS com as seguintes características:

   - Tipo: t2.micro.
   - Sistema Operacional: Amazon Linux 2.
   - Configure uma chave SSH para acesso remoto.

2. No repositório do GitHub, adicione as seguintes variáveis no `Settings > Secrets and Variables > Actions`:

   - **`AWS_EC2_IP`**: Endereço IP da instância EC2.
   - **`AWS_EC2_USER`**: Nome do usuário para login (geralmente `ec2-user`).
   - **`SSH_PRIVATE_KEY`**: Chave privada SSH para acesso remoto.

3. Foi definido o workflow do Github Actions no arquivo: `.github/workflows/deploy.yml`. Além disso, foi criado também um arquivo chamado `devops-infra.yaml`, que é um código de IaC (Infrastructure as Code) onde pode ser utilizado para configurar a infraestrutura necessária na AWS.&#x20;

---

### **3. Kubernetes com Kind (Cluster Local)**

Foi utilizado também o Kind para simular um cluster Kubernetes localmente.&#x20;

#### **Setup do Kind**

1. Certifique-se de que o Docker e o Kind estão instalados.
2. Crie o cluster Kind:
   ```bash
   kind create cluster --name room-reservation
   ```
3. Carregue as imagens locais no cluster:
   ```bash
   kind load docker-image room-reservation-api:latest --name room-reservation
   kind load docker-image room-reservation-frontend:latest --name room-reservation
   ```
4. Aplique os arquivos YAML:
   ```bash
   kubectl apply -f mongo-deployment.yaml
   kubectl apply -f mongo-service.yaml
   kubectl apply -f api-deployment.yaml
   kubectl apply -f api-service.yaml
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f frontend-service.yaml
   ```

#### **Problema Conhecido**



No atual estado do projeto foi encontrado um problema na comunicação entre os pods da API e do MongoDB. O pod da API entra em `CrashLoopBackOff` com a mensagem de erro **"Authentication failed"**, sugerindo que a conexão com o MongoDB não está sendo estabelecida corretamente.

##### **Soluções Tentadas**

- Configuração de um `initContainer` para garantir que a API espere o MongoDB estar pronto antes de iniciar.

  ```yaml
  initContainers:
  - name: wait-for-mongo
    image: busybox
    command: ['sh', '-c', 'until nc -z -v -w30 mongo-service 27017; do echo "Waiting for MongoDB..."; sleep 5; done;']
  ```

- Modificação da variável de ambiente `MONGO_URI` no `api-deployment.yaml` para:

  ```yaml
  env:
  - name: MONGO_URI
    value: mongodb://root:password123@mongo-service:27017/reservaSalas
  ```

- Adição de `readinessProbe` e `livenessProbe` para monitorar o estado da API no manifesto:

  ```yaml
  readinessProbe:
    httpGet:
      path: /health
      port: 5000
    initialDelaySeconds: 10
    periodSeconds: 5
  livenessProbe:
    httpGet:
      path: /health
      port: 5000
    initialDelaySeconds: 15
    periodSeconds: 10
  ```

- Configuração de um `initContainer` para garantir que a API espere o MongoDB estar pronto antes de iniciar.

- Verificação detalhada dos logs e credenciais do MongoDB.



Apesar das tentativas, o problema persiste e requer mais investigações.

---

### **Comandos de Depuração no Kubernetes**

1. Verificar os pods:

   ```bash
   kubectl get pods
   ```

2. Descrever um pod:

   ```bash
   kubectl describe pod <pod-name>
   ```

3. Ver logs de um pod:

   ```bash
   kubectl logs <pod-name>
   ```

4. Acessar um contêiner:

   ```bash
   kubectl exec -it <pod-name> -- /bin/bash
   ```

---

## **Considerações Finais**

Apesar que a aplicação funcione corretamente em ambientes locais e remotos com Docker Compose e EC2, não foi possível resolver o problema no cluster Kubernetes com Kind.

### **Abordagens Utilizadas para Resolver os Itens do Desafio**

#### **Docker Compose**

- Foi criado um arquivo `docker-compose.yaml` que integra os serviços de front-end, API e banco de dados MongoDB, permitindo fácil execução local.
- O arquivo configura as credenciais do MongoDB e expõe as portas necessárias para acesso.

#### **GitHub Actions e EC2**

- Foi configurado um workflow no GitHub Actions para deploy automatizado.
- O arquivo `.github/workflows/deploy.yml` realiza o build das imagens, faz o deploy para uma instância EC2 via SSH e executa os serviços usando Docker Compose.
- Um arquivo de infraestrutura como código (`devops-infra.yaml`) foi criado para provisionar recursos na AWS, incluindo grupos de segurança e uma instância EC2.

#### **Kubernetes com Kind**

- Um cluster local foi criado utilizando Kind, e as imagens da aplicação foram carregadas no cluster.
- Manifestos YAML foram desenvolvidos para configurar os deployments e serviços da API, front-end e MongoDB.

Apesar do problema que ainda existe no Kubernetes, o processo aborda diversas etapas críticas de configuração e gerenciamento de aplicações em ambientes variados.

