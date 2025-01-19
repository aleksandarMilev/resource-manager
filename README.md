# Resource Manager REST API

## Description
This project is a REST API designed for managing monthly expenses. The application uses PostgreSQL to store data and follows Clean Architecture principles.

## Features
- **Add Expense**: Users can add new expenses to the database.
- **View All Expenses**: Users can see a list of all expenses.
- **Calculate Total Expenses**: Users can view the total amount of expenses for the current month.
- **Delete Expense**: Users can delete an expense by its identifier.
  
## Technologies used
- **Node.js** and **Express.js**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **Docker**

## To run the app
### 1. Clone my repo:
```bash
git clone https://github.com/aleksandarMilev/resource-manager
```

### 2. Install Dependencies:
```bash
cd resource-manager
npm i
```

### 3. Create ``.env`` file in the folder root
It should contain:
- **``DATABASE_URL``**: Connection string for PostgreSQL.
- **``JWT_SECRET``**: Secret key for generating and verifying JWT tokens.
- **``JWT_EXPIRES_IN``**: Expiration time for tokens in days.
- **``PORT``**: Optional port number (default is 3000).

It should be something like this:
```plaintext
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
JWT_SECRET=<your_secret_key>
JWT_EXPIRES_IN=<expiration_time_in_seconds>
PORT=<optional_port_number>
```

### 4. Make sure Docker Engine is running on your machine, then run:
```bash
docker-compose up
```
This will start the PostgreSQL container defined in ``docker-compose.yml`` file.

### 5. Migrate the database
Run:
```bash
npx prisma migrate dev --schema ./src/repositories/prisma/schema.prisma
```
This will apply the latest Prisma migrations to the database.

### 6. Run the App:
```bash
npm run dev
```
The app should now be listening on ``http://localhost:3000`` (or the specified PORT value in the ``.env`` file).

## Architecture
The project is organized into layers to adhere to Clean Architecture principles:

1. **Entities**: Domain objects.
2. **Use Cases**: The business processes.
3. **Repositories**: Interacting with PostgreSQL (using Prisma).
4. **Controllers**: Handles HTTP requests.
5. **Routes**: Configures Express.js routes.

## API Endpoints
### User

#### **POST /api/user/register**
Creates a new user.

##### Request Body:
```json
{
    "email": "my@mail.com",
    "password": "some-password"
}
```

##### Response:
```json
{
    "message": "User registered successfully!"
}
```

#### **POST /api/user/login**
Authenticates the user.

##### Request Body:
```json
{
    "email": "my@mail.com",
    "password": "some-password"
}
```

##### Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
        eyJ1c2VySWQiOiJlZjE3MDYxYi0zMzg3LTQ0MTMtOTU1My0yZTY4YzEzNTM0MGQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTczNzI4OTg5MywiZXhwIjoxNzM3ODk0NjkzfQ.
        U-8CIoiXMJgvfDsZcm1vaEztX_iw5pxo5dsDOSWXetM"
}
```

### Expense
All expense endpoints are authenticated, so the server will expect the following header in the request:
```
Authorization: Bearer <your_token>
```

#### 1. **POST api/expense**
Adds a new expense.

##### Request Body:
```json
{
    "amount": 50,
    "category": "Food",
    "description": "Groceries",
    "date": "2025-01-19"
}
```

##### Response:
```json
{
    "id": "c6312198-a6e9-4723-bd86-717a070b4c36",
    "amount": 50,
    "category": "Food",
    "description": "Groceries",
    "date": "2025-01-19"
}
```
#### 2. **GET api/expense**
Returns all expenses for the current user.

##### Response:
```json
[
    {
        "id": "c6312198-a6e9-4723-bd86-717a070b4c36",
        "amount": 50,
        "category": "Food",
        "description": "Groceries",
        "date": "2025-01-19"
    },
    {
        "id": "fb16d5de-9197-4841-818a-5fb305ec7a34",
        "amount": 120,
        "category": "Utilities",
        "description": "Electricity Bill",
        "date": "2025-01-15"
    }
]
```

#### 3. **GET api/expense/total**
Returns the sum of all expenses for the current user.

```json
{
    "total": 170
}
```

#### 4. **DELETE api/expense/:id**
Deletes an expense by its ID and returns a 204 status code (No Content).

## License
This repository is **not licensed**.
 
