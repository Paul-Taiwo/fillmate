# Fillmate - Job Application Autofill Extension

Fillmate is a lightweight Chrome extension that helps you speed through job applications by automatically filling your saved information across popular job boards.

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?style=flat-square&logo=buy-me-a-coffee)](https://buymeacoffee.com/paultaiwo)

## 🚀 Features

✅ **Autofill common application fields with one click**

📎 **Upload and reuse your resume and cover letter files**

🌍 **Works across dozens of job platforms** including:
  - Greenhouse
  - Lever
  - AshbyHQ
  - And more job sites continuously being added

🧩 **Floating sidebar UI** that appears on supported job sites

✍️ **Add custom Q&A blocks** (e.g., "Why do you want this job?") - *Coming Soon*

🔒 **All data stored locally in your browser** (no cloud, no tracking)

💼 **Comprehensive Profile Management**: Store and manage your complete profile:
  - Personal details (name, email, phone)
  - Professional links (LinkedIn, GitHub, portfolio)
  - Location and visa information

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18+ or 20+) installed on your machine.

### Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/fillmate.git
    cd fillmate
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

## 🏗️ Development

To start the development server:

```sh
npm run dev
```

This will start the Vite development server and build the extension files.

## 📦 Build 

To create a production build:

```sh
npm run build
```

This will generate the build files in the `dist` directory.

## 📂 Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle switch in the top right corner.
3. Click "Load unpacked" and select the `dist` directory.

Your extension should now be loaded in Chrome! Navigate to a supported job application page to see it in action.

## 🗂️ Project Structure

- `public/`: Contains static files and the `manifest.json`.
- `src/`: 
  - `background/`: Background scripts for the extension
  - `content/`: Content scripts that run on job sites
  - `options/`: Profile settings page
  - `popup/`: Extension popup UI
  - `sidebar/`: Floating autofill button
  - `storage/`: Data storage logic
  - `utils/`: Utility functions and helpers
- `vite.config.ts`: Vite configuration file.
- `tsconfig.json`: TypeScript configuration file.
- `package.json`: Contains the project dependencies and scripts.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Pull requests and feedback are welcome! Please open an issue first to discuss major changes.

---

FillMate – Skip the typing. Focus on getting hired.
