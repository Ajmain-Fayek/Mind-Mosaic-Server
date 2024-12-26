# Mind Mosaic Server

## Purpose
This web application serves as a robust and secure platform for managing and sharing data. Built using modern backend technologies, it provides a seamless API layer, ensuring efficient and secure data transactions.

## Key Features
- **Secure Authentication:** Implements token-based authentication using `jsonwebtoken`.
- **Database Integration:** Utilizes MongoDB for flexible and scalable data storage.
- **Environment Configuration:** Secure and customizable environment variables with `dotenv`.
- **Cross-Origin Requests:** Ensures compatibility with frontend applications using `cors`.
- **Request Parsing:** Handles cookies and JSON requests efficiently with `cookie-parser` and Express's middleware.
- **Static Asset Serving:** Efficiently serves static assets and favicons using `serve-favicon`.
- **Modular Architecture:** Built with Express.js for a lightweight and modular backend.

## Technologies and Packages Used

### Dependencies
- **cookie-parser:** v1.4.7 - For parsing cookies in incoming requests.
- **cors:** v2.8.5 - To enable Cross-Origin Resource Sharing (CORS).
- **dotenv:** v16.4.7 - For managing environment variables.
- **express:** v4.21.2 - Lightweight web application framework for Node.js.
- **jsonwebtoken:** v9.0.2 - For generating and verifying JSON Web Tokens (JWT).
- **mongodb:** v6.12.0 - MongoDB driver for database operations.
- **serve-favicon:** v2.5.0 - Middleware for serving favicon requests.

## Getting Started
1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the project directory:
   ```bash
   cd project-directory
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the root directory with the necessary environment variables, such as:
   ```env
   PORT=3000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_secret_key>
   ```
5. Start the application:
   ```bash
   npm start
   ```

## API Documentation
- **Authentication:**
  - `POST /auth/login` - Authenticate user and return a JWT.
  - `POST /auth/register` - Register a new user.
- **Data Management:**
  - `GET /data` - Fetch all data entries.
  - `POST /data` - Add a new data entry.
  - `PUT /data/:id` - Update an existing data entry.
  - `DELETE /data/:id` - Delete a data entry.

## Contributing
Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
