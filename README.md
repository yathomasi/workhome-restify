# workhome-restify (backend api)
Note taking app using nodejs, restify & mysql with authentication and authorizaion using jsonwebtoken.


## Stack
- Nodejs
- Restify
- Mysql


# Getting Started
To get the Node server running locally:
### Installation
Make sure you have  [Node.js](https://nodejs.org/) and yarn installed. 
Also as we use mysql for database which can be installed to your computer and serve easily or use mysql workbench for the database.

Also required script is also provided.

Here Nodejs version v10.15.3 is used. You can use NVM to install the exact version. Also yarn v1.21.1 as package dependeny manager

Clone this repo:

 ` git clone https://github.com/yathomasi/workhome-restify.git `
 

Install the dependencies and devDependencies.

```sh
cd workhome-restify
yarn install
```
### Database
Create database and tables with `opennotes.sql` file in the repo.
I have used mysql workbench for this script generation of the model.

![Opennotes Model](https://i.imgur.com/rWsMOnL.png)

Also populate the database using the `dummy_data/opennotes_notes.sql` and `dummy_data/opennotes_users.sql`.

_Here all the users has password **!restify!** in the dummy users data._

### Manage Environment File

You can create a new `.env` file in root directory and copy`.env.example`content.

OR
Copy the file `.env.example` to `.env` and replace the value in key=value format environment file

### Running the server

Now let's run the server

`yarn start ` for simple nodejs run

`yarn dev` run using nodemon

`yarn debug` debug mode with nodemon

### Endpoints

- get / - root
- get /notes - return all the notes
- get /notes/id - return specific note
- post /register - register 
```json
{
	"first_name" : "user",
	"last_name" : "name",
	"email" : "user@mail.com",
	"username": "user",
	"password": "pass"
}
```
- post /login - login
```json
{
	"email" : "user@mail.com",
	"password": "pass"
}
```
- post /notes - add notes (auth required)
```json
{
	"Title":"homework",
	"Content":"math equation science derivation"
}
```
- put /notes/id - update notes (auth required)
```json
{
	"Title":"nowork",
	"Content":"english passage"
}
```
- del /notes/id - delete notes (auth required)
