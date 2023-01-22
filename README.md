## Installation

### API

```bash
$ (cd server && yarn)
```

### Client

```bash
$ (cd client && yarn)
```

## Running the app locally

### Running docker container with mongoDB

Ensure also that [Docker is installed](https://docs.docker.com/engine/install) on your work station

```bash
docker-compose up

#After running the app, you can stop the Docker container with
docker-compose down
```

### API

```bash
$ (cd server && yarn run start)
```

### Client

```bash
$ (cd client && yarn run start)
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
