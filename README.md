# Database Proxy CRUD REST API
## Overview
This project implements a generic database proxy, exposing CRUD (Create, Read, Update, Delete) operations through a RESTful API for a SQL database. The implementation is in JavaScript using Node.js and Express, with MySQL as the chosen SQL flavor. The database schema is dynamically created based on schema files provided during server startup.

## Getting Started

### Prerequisites
- Node.js and npm installed
- MySQL database server installed (or you can use a local SQLite instance)
- Docker (optional, if you choose to run the MySQL database in a Docker container)

### Installation
1. **Clone the repository:**

```bash
git clone https://github.com/rohitdalmia/Database_Proxy_CRUD_REST_API.git
```

2. **Install dependencies:**

```bash
npm install
```

### Configuration
Adjust the MySQL database connection details in the index.js file.

### Running the Application
Start the application:

```bash
npm start
```

### Loading Schema
Create a schema file (e.g., schema.json) with the desired database structure.

```JSON
  {
  "name":"table1",
  "columns": [
        { "name": "id", "type": "INT", "primaryKey": true },
        { "name": "name", "type": "VARCHAR(255)" },
        { "name": "email", "type": "VARCHAR(255)" }
      ]
}
```
The application will load and apply the schema on startup using :
```http
POST /ingest
```

## API Endpoints
### Create Table
Endpoint: 
```http
POST /:collection
```
Description: Create a new table if it doesn't exist based on the provided schema.

### Read Data
Endpoint: 
```http
GET /:collection/:id
```
Description: Retrieve data from the specified table based on the ID.

### Update Data
Endpoint: 
```http
POST /:collection/:id
```
Description: Update data in the specified table based on the ID.

### Delete Data
Endpoint: 
```http
DELETE /:collection/:id
```
Description: Delete data from the specified table based on the ID.

Feel free to customize the README further based on your specific project details and requirements. Include any additional information that might be relevant to users and contributors.
