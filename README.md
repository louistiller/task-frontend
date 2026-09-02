# Task Management Frontend

Frontend for a full-stack task management web application.

The application communicates with a Spring Boot REST API and provides authentication and user-specific task management.

## Features

- User registration and login
- Session-based authentication
- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Search tasks
- Filter open and completed tasks
- Sort tasks
- Persistent user-specific task data
- CSRF-protected requests

## Tech Stack

- HTML
- CSS
- JavaScript
- Fetch API

## Live Application

https://task-frontend-rho-vert.vercel.app

## Backend

Backend repository:

[Task Management API](https://github.com/louistiller/task-api)

## Running Locally

First, start the backend. It will be available at:

```text
http://localhost:8080
```

Enable the local API configuration in `script.js`:

```js
const local = true;
```

Then start the frontend using a local development server, such as Live Server.

The frontend will be available at:

```text
http://localhost:5500
```

## Deployment

The frontend is deployed on Vercel.

For production, the local configuration in `script.js` is disabled:

```js
const local = false;
```

Requests to `/api` are forwarded to the deployed backend on Render.

## API Documentation

Local Swagger UI:

http://localhost:8080/swagger-ui/index.html

Online Swagger UI:

https://task-api-u38p.onrender.com/swagger-ui/index.html

## Security

The frontend uses session cookies for authentication and sends CSRF tokens with state-changing requests.