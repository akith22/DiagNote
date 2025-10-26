FROM alpine:3.18
WORKDIR /app

RUN apk add --no-cache openjdk17 mariadb mariadb-client bash

RUN mkdir -p /run/mysqld && chown -R mysql:mysql /run/mysqld

COPY backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
COPY db_dump/ ./db_dump
COPY start.sh .

RUN chmod +x /app/start.sh

EXPOSE 8080 3306
CMD ["./start.sh"]