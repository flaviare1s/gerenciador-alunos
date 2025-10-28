CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE course_status AS ENUM ('IN_PROGRESS', 'COMPLETED');

CREATE TABLE "Student" (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    birthDate TIMESTAMP NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    gender gender NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    zipCode VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Course" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Enrollment" (
    id SERIAL PRIMARY KEY,
    studentId INT NOT NULL,
    courseId INT NOT NULL,
    status course_status DEFAULT 'IN_PROGRESS',
    completionDate TIMESTAMP NULL,
    CONSTRAINT fk_student FOREIGN KEY (studentId) REFERENCES "Student"(id) ON DELETE CASCADE,
    CONSTRAINT fk_course FOREIGN KEY (courseId) REFERENCES "Course"(id) ON DELETE CASCADE,
    CONSTRAINT unique_student_course UNIQUE (studentId, courseId)
);

-- Inserts:
INSERT INTO "Course" (name) VALUES
('Design'),
('FrontEnd'),
('BackEnd');

INSERT INTO "Student" (
  firstName, lastName, birthDate, cpf, gender, email, zipCode, street, number,
  complement, neighborhood, city, state, country
) VALUES
('Matheus', 'Souza', '2002-10-10', '12345678906', 'MALE', 'matheus@example.com',
 '60115060', 'Rua das Palmeiras', '123', 'Apto 402', 'Aldeota', 'Fortaleza', 'CE', 'Brasil'),

('Ana', 'Silva', '1998-05-12', '98765432100', 'FEMALE', 'ana.silva@example.com',
 '01001000', 'Av. Paulista', '1000', NULL, 'Bela Vista', 'São Paulo', 'SP', 'Brasil'),

('Lucas', 'Oliveira', '1999-08-23', '22233344455', 'MALE', 'lucas@example.com',
 '30140071', 'Rua da Bahia', '250', NULL, 'Centro', 'Belo Horizonte', 'MG', 'Brasil');

INSERT INTO "Enrollment" (studentId, courseId, status, completionDate) VALUES
(1, 1, 'IN_PROGRESS', '2025-08-30'),
(1, 2, 'COMPLETED', '2024-12-15'),
(2, 3, 'IN_PROGRESS', NULL),
(3, 1, 'IN_PROGRESS', '2026-03-20');
