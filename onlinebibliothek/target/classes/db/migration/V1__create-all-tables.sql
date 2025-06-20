CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'DIRECTOR', 'ADMIN');

CREATE TABLE Schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(255) NOT NULL,
    school_id INT REFERENCES Schools(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    school_id INT REFERENCES Schools(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    module_id INT REFERENCES Modules(id),
    uploaded_by INT REFERENCES Users(id),
    user_owner INT REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Feedbacks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    resource_id INT REFERENCES Resources(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AccessLogs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    action VARCHAR(255) NOT NULL,
    resource_id INT REFERENCES Resources(id),
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
