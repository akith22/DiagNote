#!/bin/bash
set -e

echo "----------------------------------------"
echo "🚀 Starting Diagnote Container"
echo "----------------------------------------"

# Ensure correct permissions for MySQL socket directory
mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld

# Initialize MariaDB data directory if empty
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing MariaDB data directory..."
    mysql_install_db --user=mysql --datadir=/var/lib/mysql
fi

# Create custom MariaDB configuration to enable TCP connections
cat > /etc/my.cnf.d/override.cnf <<EOF
[mysqld]
port=3306
bind-address=0.0.0.0
skip-networking=0
socket=/run/mysqld/mysqld.sock
datadir=/var/lib/mysql
user=mysql
EOF

# Start MariaDB in the background
echo "Starting MariaDB service..."
mysqld --defaults-file=/etc/my.cnf.d/override.cnf &

# Wait for MariaDB to become ready
echo "Waiting for MariaDB to accept connections..."
until mysqladmin ping -h127.0.0.1 --silent; do
    sleep 1
done
echo "✅ MariaDB is accepting connections."

# Set up root user securely using socket authentication
echo "Setting up root user and database..."
mysql --protocol=SOCKET -uroot <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

# Create the application database and import initial data
mysql -uroot -p123456 -e "CREATE DATABASE IF NOT EXISTS diagnote;"
mysql -uroot -p123456 diagnote < /app/db_dump/init.sql
echo "✅ Database 'diagnote' is ready."

# Start the Spring Boot application
echo "----------------------------------------"
echo "Starting Spring Boot application..."
echo "----------------------------------------"
exec java -jar -Dspring.datasource.url=jdbc:mysql://127.0.0.1:3306/diagnote -Dspring.datasource.username=root -Dspring.datasource.password=123456 app.jar