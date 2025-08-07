# VibeHive - Social Forum Platform

A dynamic social forum platform that enables users to connect through meaningful conversations and shared experiences. Built with React.js and powered by Firebase.

## 🌟 Features

### User Management
- **Secure Authentication**: Login and registration system powered by Firebase
- **User Profiles**: Personalized profiles with user information and activity history
- **Role-Based Access**: Different permissions for regular users and administrators

### Content Creation & Management
- **Post Creation**: Users can create, edit, and delete their own posts
- **Interactive Comments**: Comment system with reporting capabilities
- **Voting System**: Upvote/downvote functionality for posts and content

### Administration
- **Admin Dashboard**: Comprehensive tools for platform management
- **User Management**: Admins can promote users to admin status
- **Content Moderation**: Tools to manage reported comments and inappropriate content
- **Announcements**: System-wide announcement functionality for important updates

### Notifications
- **Real-time Notifications**: Users receive notifications for relevant activities
- **Announcement Alerts**: Special notification system for admin announcements

## 🚀 Technology Stack

- **Frontend**: React.js with React Router for navigation
- **Backend**: Express.js with MongoDB
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS for responsive design
- **Authentication**: Firebase Authentication
- **HTTP Client**: Axios for API communication
- **Notifications**: Custom notification context system
- **Alerts & Modals**: SweetAlert2 and React Toastify
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Firebase project setup

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibehive
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

```
vibehive/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── admin/
│   │   └── notifications/
│   ├── pages/
│   ├── contexts/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```
## 📷 ScreenShot

### Home Page
![Home](https://i.ibb.co/Z1625jXc/Screenshot-2025-07-16-154551.png)
### Forum Post
![Post Section](https://i.ibb.co/JWq5VLGX/Screenshot-2025-07-16-154944.png)
### User Profile
![User Profile](https://i.ibb.co/bjFN1nVJ/Screenshot-2025-07-16-155228.png)
### Admin Profile
![Admin Profile](https://i.ibb.co/C5gB6DZ7/Screenshot-2025-07-16-155413.png)
### Mobile View
![Mobile View](https://i.ibb.co/CpGHyrrP/Screenshot-2025-07-16-155554.png)


## 🚀 Deployment

This project is configured for deployment on Vercel:

1. **Manual Deployment**
   ```bash
   npm run build
   ```
   Upload the `dist` folder to your hosting provider.

2. **Vercel Deployment**
   - Connect your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use Tailwind CSS for styling
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test your changes before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions, suggestions, or issues, please:
- Open an issue on GitHub
- Contact the maintainer: [sabbir-islam](https://github.com/sabbir-islam)

## 🙏 Acknowledgments

- Firebase for authentication and backend services
- Tailwind CSS for the utility-first CSS framework
- React community for excellent documentation and support
- All contributors who help make this project better

---

Made with ❤️ by [sabbir-islam](https://github.com/sabbir-islam)

