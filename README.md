# mathapi - Certamen 2 CI/CD

Proyecto basado en `https://github.com/saferayar/mathapi`.

## Repositorio y rama QA

1. Cree un fork publico del proyecto fuente en GitHub.
2. Copie estos archivos al fork.
3. Cree la rama QA:

```bash
git checkout -b qa
git push -u origin qa
```

## Ejecucion local

```bash
npm install
npm test -- --coverage --runInBand
npm start
```

La API queda disponible en `http://localhost:3000/api`.

## Docker

```bash
docker compose build
docker compose up -d
docker compose logs --tail=100 mathapi
```

## Jenkins

Crear dos jobs Pipeline:

- `certamen2_qa`: usar `Jenkinsfile.qa` y ejecutar contra la rama `qa`.
- `certamen2_prod`: usar `Jenkinsfile.prod` y ejecutar contra la rama `main`.

Al ejecutar cada job, cambie `GIT_REPO_URL` por la URL publica del fork.

## SonarQube

En Jenkins, configure:

- Credencial Secret Text: `sonarqube-token`.
- Servidor SonarQube: nombre `SonarQube`, URL `http://sonarqube:9000`.
- Plugin requerido: SonarQube Scanner for Jenkins.
- Webhook en SonarQube: `http://jenkins:8080/sonarqube-webhook/`.

Para crear el Quality Gate:

```bash
SONAR_HOST_URL=http://localhost:9000 SONAR_TOKEN=TOKEN node scripts/create-quality-gate.js
```

El script crea `QG_Certamen2`, carga las condiciones del certamen y lo deja como predeterminado.
