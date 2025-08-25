## Stack 
- **Nestjs**
- **Postgresql**

## Environment Variables
```bash
RATE_LIMIT=5
RATE_LIMIT_TTL=60000
DATABASE_URL="DATABASE URL" 
SECRET_KEY="SECRET KEY FOR ACCESS TOKEN" 
RT_SECRET_KEY="SECRET KEY FOR REFRESH TOKEN"
```
## Installation & Startup
 ```bash
yarn install
npx prisma migrate dev
npx prisma generate
yarn run start:dev
 ```

## Endpoints

### Todo
- **GET** `/todos`
- **POST** `/todos`
- **DELETE** `/todos`
- **POST** `/todos/addTodos`
- **GET** `/todos/{id}`
- **PATCH** `/todos/{id}`
- **DELETE** `/todos/{id}`

### User
- **GET** `/users/me`
- **PATCH** `/users/edit-me`
- **POST** `/users/freeze-account`
- **POST** `/users/delete-account`

### Auth
- **POST** `/auth/sign-up`
- **POST** `/auth/sign-in`
- **POST** `/auth/refresh`
- **GET** `/auth/logout`


