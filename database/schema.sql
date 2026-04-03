CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Availability (
    slot_id INT PRIMARY KEY,
    available_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

-- Indexes for performance
CREATE INDEX idx_user_email ON Users(email);
CREATE INDEX idx_booking_user ON Bookings(user_id);
CREATE INDEX idx_booking_date ON Bookings(booking_date);