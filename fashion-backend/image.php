<?php
// Load environment variables from .env file
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile);
    foreach ($lines as $line) {
        putenv(trim($line));
    }
}

// Database connection using environment variables
$servername = getenv('DB_HOST');
$username = getenv('DB_USER');
$password = getenv('DB_PASSWORD');
$dbname = getenv('DB_NAME');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Directories containing images
$imageDirs = [
    __DIR__ . "fashion-backend\public\lower", // Update this path to your first images folder
    __DIR__ . "fashion-backend\public\Upperwear"  // Update this path to your second images folder
];

// Loop through each directory
foreach ($imageDirs as $imageDir) {
    // Get all files in the directory
    $images = scandir($imageDir);

    foreach ($images as $image) {
        // Skip the current and parent directory entries
        if ($image !== '.' && $image !== '..') {
            $imagePath = $imageDir . $image;

            // Prepare the SQL statement to insert the image path
            $stmt = $conn->prepare("INSERT INTO cute (image_url) VALUES (?)");
            $stmt->bind_param("s", $imagePath); // "s" indicates a string type

            // Execute the statement
            if ($stmt->execute()) {
                echo "Inserted: " . htmlspecialchars($imagePath) . "<br>";
            } else {
                echo "Error inserting: " . $stmt->error . "<br>";
            }

            // Close the statement
            $stmt->close();
        }
    }
}

// Close the connection
$conn->close();
?>