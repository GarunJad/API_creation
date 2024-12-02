# API Creation - Event Management

This project is a RESTful API built with Node.js, Express, and MongoDB to manage events. It allows users to create, read, update, and delete event records while handling file uploads (such as event images) using Multer.

## Features

- **Create Events**: Allows the creation of new events with details like name, description, schedule, etc.
- **Read Events**: Fetch events by specific queries such as `id` or `type`.
- **Update Events**: Modify existing event details.
- **Delete Events**: Remove events from the database.
- **Image Uploads**: Upload images associated with the event (using Multer).

## Tech Stack

- **Node.js**: JavaScript runtime for building the API.
- **Express.js**: Web framework for Node.js, used to handle routing.
- **MongoDB**: NoSQL database to store event data.
- **Multer**: Middleware for handling file uploads.
- **ObjectId**: Used to uniquely identify documents in MongoDB.

## Setup

### Prerequisites

- Install [Node.js](https://nodejs.org/)
- Install [MongoDB](https://www.mongodb.com/try/download/community) and make sure it's running
----
### Install Dependencies

1. Clone the repository:

```bash
   git clone https://github.com/GarunJad/API_creation.git
   
```
cd API_creation
----
Install the required Node.js dependencies:

```bash

npm install
```
Start the Server
Make sure your MongoDB server is running.

Start the Node.js server:

```bash

node index.js
```
The server will start on port 4000 by default. You should see the message:

```bash

Server running on http://localhost:4000
```
API Endpoints
1. **GET /api/v3/app/events**
Description: Fetch events by specific query parameters.

Query Parameters:

id: Event ID to fetch a specific event.
type: Type of query (e.g., latest to fetch the latest events).
limit: Number of events to return.
page: Page number for pagination.
Example:

```bash

GET http://localhost:4000/api/v3/app/events?id=12345&type=latest&limit=5&page=1
```

2. **POST /api/v3/app/events**
Description: Create a new event.

Request Body: JSON object containing event details and an optional file.

Example:

```json
{
  "name": "Sample Event",
  "files": "sample.jpg",
  "tagline": "An awesome event",
  "schedule": "2024-12-15T10:00:00Z",
  "description": "Event details",
  "moderator": "John Doe",
  "category": "Tech",
  "sub_category": "Web Development",
  "rigor_rank": 5,
  "attendees": ["John", "Jane"]
}
```
3. **PUT /api/v3/app/events/:id**
Description: Update an existing event by ID.

Request Body: Same as POST /api/v3/app/events, but includes the id in the URL.

Example:

```bash
PUT http://localhost:4000/api/v3/app/events/12345
```
4. DELETE /api/v3/app/events/:id
Description: Delete an event by ID.

Example:

```bash
DELETE http://localhost:4000/api/v3/app/events/12345
```

**File Uploads**

Multer is used for handling file uploads. All uploaded files are saved in the uploads/ directory. You can upload files by including a file field in the request body when creating or updating events.

**Folder Structure**

uploads/: Folder where uploaded files are stored.
index.js: Main file for the API server.
node_modules/: Folder where Node.js modules are installed.
package.json: Defines the project dependencies and scripts.
