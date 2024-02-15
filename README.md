# BookWorm API

This project is the backend REST Service for the supposed BookWorm company.
Service is responsible for keeping track of different books and their respective authors.

## Running the Application

Images for the service can be created and run with `docker compose --profile dev up --build` command.<br>
Compose file will create two API images for development and test environments.
<br>
These containers share the same MongoDb instance and only one of them should be running in a moment to function properly. Application uses `5000` as the default port for dev and prod, `3000` for test.
<br>
With the default settings application should be running on `http://localhost:5000`

## Production

Application also has a `compose-prod.yaml` file that can be modified and extended with proper Production environment settings.

## Test
For default, test container is built but not started in the compose file.<br>
To test the test suite simply stop the dev container if it's running by `docker stop library-api-dev-1`. <br>
After stopping the dev container you can run the test container via <br> `docker compose --profile test up --build` <br> command.

### package.json commands

`npm start` command will start the application in prod environment locally.<br>
`npm run dev` command will start the application in development environment locally.<br>
`npm test` command will run the test suite with Jest.<br>
`npm run seed` will seed the environment database with the data in the `./_data` file.<br>
`npm run destroy` will delete all of the documents in the database for the environment.

## API Documentation

Application serves the API documents in default. Document site can be accesed in the root path.
`<APPLICATION_URL>:<PORT>`.<br>
For default settings in local `http://localhost:5000` should provide the API documentation for all of the endpoints.<br>
Raw html files for the documentation can be acccesed in the `./public` folder.

## Environment Variables
Environment variables can be added and modified within the `./src/config/config.env` file.
