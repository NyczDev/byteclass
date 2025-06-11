# 📖 ByteClass

ByteClass is a web-based school management system developed to optimize the academic routines of educational institutions. Its purpose is to centralize and simplify the management of students, teachers, classes, subjects, and grades, offering specific functionalities for each user type (administrator, teacher, and student) in an intuitive and accessible environment.

---

## 👥 Team Members

- Igor Felipe Viana (32785828)  
- Igor Hey Matos (32573499)  
- Nicolas Czekoski Yasumoto (34241159)  
- Otavio Carlos Wenzel Júnior (34613188)  
- Rafael Marchello Villa (28977262)

---

## 🛠️ Technologies Used

- Language: C#, TypeScript  
- Framework: ASP.NET Core (Back-end), React (Front-end)  
- ORM/Database: Entity Framework Core, MySQL  
- Other Technologies: Tailwind CSS, Vite, GitHub, Postman (for API testing), Axios (HTTP requests in the front-end), React Router DOM (page routing)

---

## 🎥 Pitch Video

[Pitch](https://drive.google.com/file/d/1jHKNWP5cXUjuQfifbXarQxpPC-aArRIa/view)

---

### Prerequisites

- [.NET SDK 7.0+](https://dotnet.microsoft.com/en-us/download)  
- MySQL installed  
- [Node 22+](https://nodejs.org/en/download)  
- Git installed

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/NyczDev/byteclass

# 2. Access the project's back-end
cd back
cd byteclassAPI

# 3. Restore packages
dotnet restore

# 4. Initialize the database
dotnet ef migrations add recreateDB
dotnet ef database update

# 5. Run the back-end
dotnet run

# 6. Access the project's front-end
cd front

# 7. Install dependencies
npm install --force

# 8. Run the front-end
npm run dev
