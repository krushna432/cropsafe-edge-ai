# CropSafe AI

CropSafe AI is an intelligent, web-based application designed to assist farmers and gardeners in identifying and treating plant diseases. By uploading an image of a plant leaf, users can get an instant AI-powered analysis to detect potential diseases and receive expert guidance on how to manage them.

## Tech Stack

This project is built with a modern, performant, and scalable tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **UI Library**: [React](https://reactjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
-   **AI Integration**: [Genkit (by Firebase)](https://firebase.google.com/docs/genkit)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Features

-   **Image-based Disease Detection**: Upload a PNG, JPG, or JPEG image of a plant leaf to have it analyzed.
-   **AI-Powered Analysis**: The app connects to a sophisticated backend service to classify the plant's health status (e.g., Healthy, Blight, Rust).
-   **Confidence Score**: View the model's confidence level for the detected disease.
-   **AI Treatment Guidance**: For diagnosed diseases, the app uses Genkit to generate concise and actionable treatment advice.
-   **Detailed Disease Information**: Access descriptions, symptoms, and causes for a wide range of plant diseases.
-   **Responsive Design**: A clean, intuitive, and mobile-friendly user interface.

## How to Run Locally

To get the project running on your local machine, follow these steps:

1.  **Install Dependencies**:
    Open your terminal and run the following command to install all the necessary packages.
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables**:
    Create a `.env` file in the root of your project. This is where you'll store your API keys and other secrets. For this project, you'll need your Gemini API key.
    ```
    GEMINI_API_KEY=YOUR_API_KEY
    ```

3.  **Run the Development Server**:
    Execute the command below to start the Next.js development server.
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`.

## Architecture & Flow

The application follows a client-server architecture pattern, leveraging the capabilities of Next.js for both frontend and backend logic.

1.  **Frontend (Client-Side)**: The user interface is built with React and ShadCN components. When a user uploads an image, the client-side code in `src/app/page.tsx` handles the file selection and preview.
2.  **Form Submission**: On clicking "Analyze," the image is sent to a Next.js Server Action (`detectDisease` in `src/app/actions.ts`).
3.  **Disease Detection API**: The server action sends the image file to an external machine learning API (`https://edge-ai-crop-rakshak.loca.lt/api/image`), which returns a classification of the plant's disease along with a confidence score.
4.  **AI Treatment Guidance (Genkit)**: If a disease is detected, the server action then calls a Genkit flow (`generateTreatmentGuidance` in `src/ai/flows/generate-treatment-guidance.ts`). This flow connects to the Gemini API to generate helpful treatment recommendations based on the detected disease.
5.  **Display Results**: The server action combines the disease information, confidence score, and AI-generated treatment plan into a single response, which is then sent back to the client and displayed in the `ResultDisplay` component.

## Future Development

-   **Real-time Camera Analysis**: Integrate webcam support for instant analysis without needing to upload a file.
-   **Historical Analysis**: Implement a user authentication and database system (like Firebase Auth & Firestore) to save and track a history of user uploads and results.
-   **Expanded Disease Database**: Add more detailed information and images for a wider variety of plant diseases.

