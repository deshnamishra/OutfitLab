create database webdev;
use webdev;
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE styles (
  style_id INT PRIMARY KEY AUTO_INCREMENT,
  style_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE outfits (
  outfit_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  style_id INT,
  outfit_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (style_id) REFERENCES styles(style_id)
);
CREATE TABLE upperwear (
  upperwear_id INT PRIMARY KEY AUTO_INCREMENT,
  outfit_id INT,
  image_url VARCHAR(255) NOT NULL,
  position_top INT,    -- to save canvas position if needed
  position_left INT,
  width INT,           -- to save resized width if needed
  FOREIGN KEY (outfit_id) REFERENCES outfits(outfit_id)
);
CREATE TABLE lowerwear (
  lowerwear_id INT PRIMARY KEY AUTO_INCREMENT,
  outfit_id INT,
  image_url VARCHAR(255) NOT NULL,
  position_top INT,    
  position_left INT,
  width INT,           
  FOREIGN KEY (outfit_id) REFERENCES outfits(outfit_id)
);
CREATE TABLE favorites (
  favorite_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  outfit_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (outfit_id) REFERENCES outfits(outfit_id)
);
INSERT INTO users (username, email, password) VALUES
('john_doe', 'john@example.com', 'hashedpassword123'),
('emma_watson', 'emma@example.com', 'hashedpassword456');
INSERT INTO styles (style_name, description) VALUES
('Cute Style', 'A playful and charming outfit selection.'),
('Casual Style', 'Comfortable and relaxed daily wear.'),
('Party Style', 'Bold and stylish for party vibes.');
INSERT INTO outfits (user_id, style_id, outfit_name) VALUES
(1, 1, 'John’s Cute Combo'),
(2, 2, 'Emma’s Casual Look');
INSERT INTO upperwear (outfit_id, image_url, position_top, position_left, width) VALUES
(1, 'images/cute_top1.png', 50, 100, 300),
(2, 'images/casual_shirt1.png', 60, 110, 320);
INSERT INTO lowerwear (outfit_id, image_url, position_top, position_left, width) VALUES
(1, 'images/cute_skirt1.png', 250, 100, 320),
(2, 'images/casual_jeans1.png', 270, 110, 340);
show tables;
select*from outfits;

