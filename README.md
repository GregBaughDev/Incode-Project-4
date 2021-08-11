# Incode-Project 4: Create a client-server web app with authentication 
### Authors: Greg Baugh, Rhys Dawson

Web app that displays staff timetable database using login and authentication.


## Installation

Clone repo.

Use the package manager [npm](https://www.npmjs.com/) to install following dependencies.


```bash
npm install 
```


Create SQL database

```
npm run create-db
```
```
npm create-tables
```
```
npm seed-tables
```

## Usage

Change SQL values to suit your needs

Create .env file and fill with your values based on the .env.sample

Run:

```bash
npm run dev
```



## Technologies used
- NodeJS
- Express
- [Handlebars](https://handlebarsjs.com/)
- Postgres
- Bootstrap
- Pg-promise
- [Ethereal Email](https://ethereal.email/) 

## Full Package list

dotenv express express-handlebars express-session method-override nodemailer nodemon pg-promise uuid

## TODO
- [x] Express Skeleton and Home page
- [x] Create Login Page
- [x] Develop and test login logic
- [x] Develop and schedule management page
- [x] Develop and test schedule logic
- [x] Develop user page
- [x] Develop and test registration logic
- [x] Build UI

## License
[MIT](https://choosealicense.com/licenses/mit/)
