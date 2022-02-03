# tree-nodes
Full-stack web app (NestJS + Angular) for managing and visualising a tree structure and it's nodes.

## Description

This full stack web application was built in context of a tech assessment for FrozenLogic.
* Backend: (tree-nodes/api)
    NestJS backend server and PostgreSQL database.
* Frontend: (tree-nodes/client)
    Angular web application

### Built with

* [npm](https://www.npmjs.com)
* [Node](https://nodejs.org/en/)
* [NestJS](https://nestjs.com)
* [PostgreSQL](https://www.postgresql.org)
* [Angular](https://angular.io)
* [Angular Material](https://material.angular.io)

## Getting Started

### Dependencies

* [Docker](https://www.docker.com), [npm](https://www.npmjs.com) & [Node](https://nodejs.org/en/) instaled locally on your machine.

### Installing

1. Clone the repo

   ```
   git clone https://github.com/benmoussa96/tree-nodes.git
   ```
2. Change into repo root directory

    ```
    cd tree-nodes
    ```

### Run backend

3. With Docker running

    ```
    docker-compose up --build
    ```

### Run frontend

4. Change into client directory

    ```
    cd ../client
    ```
5. Install dependencies

    ```
    npm install
    ``` 
6. Run Angular server

    ```
    npm run start
    ``` 
10. Go to `localhost:4200`

## Authors

* Ghaieth Ben Moussa
    [ghaieth96](https://github.com/benmoussa96)

## Version History

* 0.1
    * Initial Release
