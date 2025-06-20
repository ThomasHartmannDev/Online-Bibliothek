-- Insert mock data into Schools table
INSERT INTO Schools (name, address, contact_email) VALUES
('Springfield High School', '123 Elm St, Springfield', 'contact@springfieldhigh.edu'),
('Riverview Academy', '456 River Rd, Riverview', 'info@riverviewacademy.edu'),
('Tech Valley Institute', '789 Tech Blvd, Silicon City', 'admin@techvalley.edu');

-- Insert mock data into Users table
INSERT INTO Users (name, email, password_hash, role, school_id) VALUES
('John Doe', 'john.doe@example.com', 'hashedpassword123', 'TEACHER', 1),
('Jane Smith', 'jane.smith@example.com', 'hashedpassword456', 'STUDENT', 1),
('Alice Brown', 'alice.brown@example.com', 'hashedpassword789', 'ADMIN', 2),
('Bob Johnson', 'bob.johnson@example.com', 'hashedpassword321', 'DIRECTOR', 3);

-- Insert mock data into Modules table
INSERT INTO Modules (name, description, school_id) VALUES
('Mathematics 101', 'Introduction to Algebra and Geometry', 1),
('Physics Basics', 'Fundamentals of Physics', 2),
('Programming Fundamentals', 'Introduction to Programming', 3);

-- Insert mock data into Resources table
INSERT INTO Resources (title, url, module_id, uploaded_by, user_owner) VALUES
('Algebra Basics', 'http://example.com/algebra-basics', 1, 1, 1),
('Physics Notes', 'http://example.com/physics-notes', 2, 3, 2),
('Programming Guide', 'http://example.com/programming-guide', 3, 4, 4);

-- Insert mock data into Feedbacks table
INSERT INTO Feedbacks (user_id, resource_id, rating, comments) VALUES
(2, 1, 5, 'Very helpful resource for algebra!'),
(3, 2, 4, 'Great notes but could use more examples.'),
(4, 3, 5, 'Excellent programming guide!');

-- Insert mock data into AccessLogs table
INSERT INTO AccessLogs (user_id, action, resource_id) VALUES
(2, 'VIEWED', 1),
(3, 'DOWNLOADED', 2),
(4, 'SHARED', 3);
