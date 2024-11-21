## Event Management API
---
This is a Node.js and Express.js application for managing events, using MongoDB as the database. It allows users to create, retrieve, update, and delete event data.
---
**Features**
1. Add Events: Add event details including images.
2. Fetch Events: Retrieve individual or multiple events with optional filters like latest or pagination.
3. Update Events: Modify existing event details.
4. Delete Events: Remove an event by ID.
---
**Technologies Used**
---
Backend: Node.js, Express.js
Database: MongoDB
File Uploads: Multer
Postman: For API testing
---
Installation and Setup
Prerequisites:
1. Node.js installed on your system.
2. MongoDB installed and running locally.
3. Postman (or similar tool) for API testing.
---
**Steps**

1. Clone the repository

```bash

git clone https://github.com/GarunJad/API_creation.git

cd event-management-api
```
2. Install dependencies

```bash

npm install
```
3. Add the sample data

Navigate to the directory containing data.json.
Import the sample data into your MongoDB instance:

```bash

mongoimport --db eventDB --collection events --file ./data/data.json --jsonArray
```
4. Run the server

```bash

node server.js
```
The server will start at http://localhost:3000.