# RealEstate API

A RESTful API built with ASP.NET Core 8 for managing real estate property listings, with JWT authentication and SQL Server persistence.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download/dotnet/8.0) | **8.0** | Required for backend |
| [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) | **LocalDB / Express / Developer** | LocalDB is included with Visual Studio |
| [EF Core CLI](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) | **8.x** | For running migrations |
| [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/) | Latest | Recommended IDE |

---

## Project Structure


realestate-backend/
└── RealEstate.Api/          # ASP.NET Core 8 Web API

realestate-frontend/         # React frontend (separate repo/folder)


---

## Backend Setup

### 1. Clone the repository


git clone <your-repo-url>
cd realestate-backend/RealEstate.Api


### 2. Configure environment variables

Open `appsettings.json` and update the following sections:


{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=RealEstateDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY_MIN_32_CHARS",
    "Issuer": "RealEstateApi",
    "Audience": "RealEstateApiUsers",
    "ExpireMinutes": 60
  },
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}


> ⚠️ **Never commit real secrets to source control.** Use `appsettings.Development.json` or environment variables to override `Jwt:Key` locally.

| Variable | Description |
|---|---|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string |
| `Jwt:Key` | Secret key for signing JWT tokens (min 32 characters) |
| `Jwt:Issuer` | JWT issuer name |
| `Jwt:Audience` | JWT audience name |
| `Jwt:ExpireMinutes` | Token expiry duration in minutes |
| `AllowedOrigins` | CORS allowed origins for the frontend |

### 3. Install dependencies


dotnet restore


### 4. Apply database migrations

Make sure SQL Server LocalDB is running:


sqllocaldb start MSSQLLocalDB


Install the EF Core CLI tool if not already installed:


dotnet tool install --global dotnet-ef


Apply migrations to create the database:


dotnet ef database update


> This will create the `RealEstateDb` database with `Users` and `Properties` tables.

### 5. Trust the HTTPS development certificate


dotnet dev-certs https --trust


### 6. Run the API


dotnet run


The API will be available at:
- **HTTPS:** `https://localhost:7108`
- **Swagger UI:** `https://localhost:7108/swagger`

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | X | Register a new user |
| `POST` | `/api/auth/login` | X | Login and receive a JWT token |

### Properties

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/properties` | ✅ | Get paginated list of properties |
| `GET` | `/api/properties/{id}` | ✅ | Get a property by ID |
| `POST` | `/api/properties` | ✅ | Create a new property |
| `PUT` | `/api/properties/{id}` | ✅ | Update a property (owner only) |
| `DELETE` | `/api/properties/{id}` | ✅ | Delete a property (owner only) |

---

## Password Requirements

Passwords must contain:
- At least **6 characters**
- At least **one uppercase letter**
- At least **one lowercase letter**
- At least **one number**

---

## Assumptions & Trade-offs

| # | Assumption / Trade-off |
|---|---|
| 1 | **LocalDB** is used as the default database for development simplicity.|
| 2 | **Authorization** is ownership-based — only the user who created a property can update or delete it. No admin role was created as of now. |
| 3 | **Property types** are restricted to `Apartment`, `Villa`, and `Land` via validation. This can be extended to a lookup table if needed. |
| 4 | **Global exception middleware** is implemented. |
| 5 | **CORS** is configured in `appsettings.json`.
| 6 | **Passwords** are hashed using BCrypt before storage. |

---
