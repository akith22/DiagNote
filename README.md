# Healthcare WebApp  

## 📌 Introduction  
This project is a healthcare management web application that facilitates interactions between doctors, patients, and lab technicians.  

- **Doctors** can log in, view patient history, and create new prescriptions.  
- **Patients** can manage their profiles, book appointments with doctors, and access their prescriptions and lab reports.  
- **Lab Technicians** can upload lab reports when requested by doctors.  

The system provides a centralized platform for efficient healthcare workflows and secure data management.  

---

## 🛠 Tech Stack  
- **Backend:** Spring Boot (Java 17)  
- **Frontend:** Vite + TypeScript  
- **Runtime:** Node.js 22  
- **Database:** MySQL  

---

## 🚀 Installation Guide  

### Prerequisites  
- Java 17  
- Node.js 22 and npm  
- MySQL (running locally or remotely)  
- Maven  

### Backend Setup (Spring Boot)  
```bash
# Clone the repository
git clone https://github.com/your-username/healthcare-webapp.git
cd healthcare-webapp/backend

# Configure database settings in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/diagnote
spring.datasource.username=root
spring.datasource.password=123456
spring.jpa.hibernate.ddl-auto=update

# Run backend
mvn spring-boot:run
```
### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

