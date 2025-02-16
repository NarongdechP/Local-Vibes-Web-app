create database local_vibes;

create table usersystem (
    id serial PRIMARY KEY,
    username VARCHAR(100) NOT null,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_pic TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table events (
    id serial PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    category VARCHAR(100),
    created_by INT REFERENCES usersystem(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);