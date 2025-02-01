### Chalet Rental Mobile Application Documentation

#### Introduction
I’m delighted to introduce to you the new Chalet Rental Mobile Application that serves brokers and renters to manage and organize their work, preventing interference between different chalets and their reservations while minimizing errors and unintended faults. The application provides a seamless user interface.

The idea is based on organizing bookings between the renter and their assistants. It includes features such as adding chalets, viewing chalet details, editing chalets, submitting reservations, viewing reservations, and deleting reservations. It also prevents issues like double booking, confusion between chalet names and details, and more.

The application is built based on Role-Based Access Control (RBAC), which restricts certain features from ordinary assistants, such as adding, editing, and deleting chalets. This gives the admin full control over these critical actions.

#### Technology Stack
- **Front-end:** React Native, Expo
- **Back-end:** Firebase (Firestore, Authentication)
- **Tools:** Firebase Authentication, Firebase Firestore for data storage
- **Libraries:** React Navigation, React Native Paper

#### Installation Guide
##### Prerequisites:
1. Download and install Node.js (version 20.18.0 or higher)
2. Create a new folder, open it using VS Code, and open a new terminal
3. Install the Expo CLI by running:
   ```sh
   npm install -g expo-cli
   ```

##### Installation Steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/yasser1123/Chalet-Rental-App.git
   ```
2. Navigate to the project folder:
   ```sh
   cd ChaletRentalApp
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run the app:
   ```sh
   npx expo start
   ```
5. Download Expo Go to run the application on your device.
6. Scan the QR code and wait for the app to bundle.

---

### Waterfall Model Implementation
The entire software was designed and implemented according to the Waterfall model principles, reducing software creation time and providing organized steps for efficient development.

#### 1. Requirements Analysis
After consulting with the customer and understanding their needs, I brainstormed possible features and finalized the following:
- **User authentication**
- **RBAC (Role-Based Access Control)**
- **Adding chalets**
- **Editing chalets**
- **Viewing chalets**
- **Deleting chalets**
- **Submitting reservations**
- **Tracking reservations**

#### 2. System Analysis & Design
This phase involved choosing the right technologies and structuring files for easy development and maintenance. 

**Technology Stack Choices:**
- **Front-End:** React Native for building both iOS and Android apps with a single codebase.
- **Database:** Firebase Firestore for real-time data storage.
- **Authentication:** Firebase Authentication for secure logins and role management.
- **RBAC:** Implemented to control access and permissions.
- **Navigation:** React Navigation for smooth user experience.
- **UI Components:** React Native Paper for a polished interface.

#### 3. Implementation
Following the design plan, I developed the application in stages:
- Implemented user login and RBAC for role management.
- Developed chalet management features for admins (add, edit, delete chalets).
- Implemented the reservation system to prevent double bookings.
- Designed a simple and user-friendly navigation using React Navigation and React Native Paper.

#### 4. Testing
Once development was completed, thorough testing was conducted:
- **Unit Testing:** Verified login functionality and role-based access.
- **Integration Testing:** Ensured correct interaction between reservation and chalet data.
- **End-to-End Testing:** Simulated full user scenarios to check usability for both admins and assistants.

#### 5. Maintenance
The final phase ensures ongoing app stability:
- **Bug Fixes:** Regular monitoring and error resolution.
- **Feature Updates:** Adding new features like notifications based on user feedback.
- **Security Enhancements:** Keeping Firebase tools updated to protect user data.

---

### Disadvantages & Personal Opinion on the Waterfall Model
While the Waterfall model provides structured development phases, it has drawbacks:
- **Lack of Flexibility:** Any new feature request or change requires going back to earlier phases, which can be time-consuming.
- **Testing Phase Placement:** Issues discovered late in testing may require significant rework.

**Example Challenges Faced:**
- A validation bug allowed unsafe input injection, which could compromise data security.
- Handling special characters (e.g., backslashes causing navigation issues) required additional fixes.

However, for small-scale projects like this, the Waterfall model is still manageable since bugs and issues can be fixed without affecting a large user base. With technological advancements, some weaknesses of the model might be mitigated in the future, making software development more efficient.

---

### Future Enhancements
- **Implement proper input validation** to prevent security vulnerabilities.
- **Add remote configuration support** to enable real-time updates without redeploying.
- **Enhance role management features** to refine permissions and improve security.
- **Introduce push notifications** for reservation updates and alerts.

This documentation outlines the complete journey of developing the Chalet Rental Mobile Application using the Waterfall model while considering future improvements.
