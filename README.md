![Logo](client-angular/src/assets/images/logo.png)
# Triller: A Microblogging Social Media Platform

Triller is a social media platform that mimics the functionality of Twitter, 
allowing users to share their thoughts, updates, and more through short posts called Trills. 
Users can engage with Trills by liking, commenting, and reposting them. Additionally, 
the platform supports user-to-user connections with a follow system.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Server Installation](#server-installation)
  - [Client Installation](#client-installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Screenshots](#screenshots)
- [License](#license)

## Features
- **Authorization**: Users need to sign in or register to be able to use the application.
- **Trills**: Users can compose and share short posts, known as Trills, with their followers.  
- **Engagement**: Users can express their opinions by liking, commenting, and reposting Trills.
- **Follow System**: Users can follow each other to stay updated on the latest Trills from their connections.

## Tech Stack
- **Backend:**
  - ASP.NET 8
  - Microsoft SQL Server
  - Entity Framework

- **Frontend:**
  - Angular 17
  - Angular Material
  - Tailwind CSS

- **Infrastructure:**
  - Microsoft Azure (for deployment)

- **External Services:**
  - Cloudinary (for photo uploading)

## Installation
### Server Installation

To install and run the Triller server (ASP.NET) locally, follow these steps:

1. Clone this repository:

    ```
    git clone https://github.com/mespino4/Triller
    ```

2. Navigate to the `api-aspnet` directory:

    ```
    cd api-aspnet
    ```

3. Install dependencies:

    ```
    dotnet restore
    ```

### Client Installation

To install and run the Triller client (Angular) locally, follow these steps:

1. In a second terminal navigate to the `client-angular` directory:

    ```
    cd client-angular
    ```

2. Install dependencies:

    ```
    npm install
    ```
    
3. Run the Angular development server:

    ```
    ng serve
    ```
    
## Usage

- Access the frontend application in your browser at `http://localhost:4200`.
- Explore the different features and functionalities of the application.
- Use the provided authentication mechanism to log in and access restricted resources.

## Configuration

- Backend:
  - Database connection settings: Update the connection string in `appsettings.json`.
  - Authentication settings: Configure authentication providers, JWT tokens, etc., in `Program.cs`.

- Frontend:
  - API base URL: Update the base URL of the backend API in `environment.ts` for development and `environment.prod.ts` for production.

## Screenshots
Coming Soon!

## License

This project is licensed under the [MIT License](LICENSE).
