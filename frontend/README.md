## Ask.gov.my Front-end

### Overview

Ask.gov.my is a web application designed to allow citizens to ask questions to various agencies. It provides functionalities for browsing questions, searching for specific topics, and accessing agency information.

### Functionality

1. **Viewing Questions**
   - Users can view a list of questions from citizens on the main page (`MainQuestionBox`).
   - Questions are paginated to display a maximum of 5 questions per page.
   - Users can click on a question to view its details.
2. **Searching Questions**
   - Users can search for specific questions using keywords or topics in the `SearchNavbar`.
   - The search functionality filters questions based on the entered keywords.
3. **Filtering by Agency**
   - Users can filter questions by agency using the `AgencyListNavbar`.
   - Selecting an agency will display questions related to that agency.
4. **Navigation**
   - Users can navigate between pages using the navigation links provided.

### Technologies Used

- **React**: Front-end JavaScript library for building user interfaces.
- **Next.js**: React framework for building server-side rendered and statically generated web applications.
- **Tailwind CSS**: Utility-first CSS framework for styling web applications.
- **TypeScript**: Typed superset of JavaScript for improved code quality and developer experience.
- **API Services**: Custom APIs for fetching questions and agency information.

### Development Setup

For the development setup, follow these steps:

1. **Clone Repository**:

   - Clone the repository to your local machine using Git. Open your terminal and run the following command:
     ```
     git clone <repository_url>
     ```
   - Replace `<repository_url>` with the URL of the repository.

2. **Navigate to Frontend Directory**:

   - Change directory into the frontend folder using the `cd` command:
     ```
     cd frontend
     ```

3. **Install Dependencies**:

   - Once you're inside the frontend directory, install the project dependencies using npm:
     ```
     npm install
     ```

4. **Start Development Server**:

   - After the dependencies are installed successfully, you can start the development server:
     ```
     npm run dev
     ```
   - This command will start the development server, and you can access the application in your web browser at `http://localhost:3000`.

5. **Development**:
   - Now you're ready to start development! Make changes to the codebase as needed, and the development server will automatically reload with the updated changes.

By following these steps, you should have the development environment set up and ready to work on the frontend of your application. If you encounter any issues or have questions, feel free to ask!

### Deployment

1. Build the application using `npm run build`.
2. Deploy the built files to a hosting service like Vercel, Netlify, or AWS.
