# CropSafe AI - Edge AI Farmer Copilot

## Problem Statement

Farmers often detect crop diseases too late, when symptoms have already spread across the field and caused significant damage. Existing plant-disease detection systems depend heavily on cloud computing and internet connectivity, which is not feasible for rural farming communities with poor network access.

As a result:

Farmers do not have real-time, continuous monitoring of crop health.

Manual inspection of leaves is slow, inconsistent, and depends on expert knowledge.

Cloud-based plant disease apps fail without internet, leaving farmers without support.

There is no early-warning system to prevent outbreaks from spreading across farms.

Guidance provided is often generic, not tailored to a farmer’s crop, stage, or disease severity.

This gap creates huge agricultural losses and reduces productivity for small-scale farmers.

## Objective of the Project

The goal of CropSafe AI is to provide farmers with an **offline-capable**, affordable, and intelligent crop health monitoring system that:

Detects plant diseases, pest infections, and nutrient deficiencies early, even before visible spread.

Runs completely offline on edge devices using Edge Impulse models deployed in ESP32-CAM / Raspberry Pi as a Arduino library 

Uses Agentic AI to not just detect problems but also decide, plan, and guide farmers with actionable next steps.

Provides continuous monitoring and personalized treatment recommendations, improving farm productivity and reducing losses.

## Methodology
#### 1. Model Training using Edge Impulse

A plant leaf dataset was uploaded to **Edge Impulse** to train a lightweight and efficient image classification model optimized for edge devices.

#### 1.1 Dataset

The dataset used for training comes from publicly available Kaggle collections:
- [PlantDisease Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease)  
- [Plant Disease Recognition Dataset](https://www.kaggle.com/datasets/rashikrahmanpritom/plant-disease-recognition-dataset)

These datasets contain high-quality leaf images across multiple disease categories.  
For this project, the following classes were selected as the **possible prediction outcomes**:

- **Bacterial Spot**  
- **Blight**  
- **Healthy**  
- **Mosaic Virus**  
- **Powdery Mildew**  
- **Rust**  
- **Septoria Spot**

The dataset was cleaned, normalized, and then uploaded to Edge Impulse Studio for preprocessing, model training, and optimization for edge deployment.


The model is trained to classify diseases

The trained model is exported as a Arduino library for offline inference and as a Docker container when physical hardware is unavailable.

#### 2. Local Inference via Docker

The Edge Impulse model runs locally using a Docker Desktop container.

The inference API is exposed at http://localhost:1337/api/image for real-time predictions.

#### 3. Image Input Simulation

In real deployments, an ESP32-CAM or Raspberry Pi captures images.

Since hardware is not available, webcam/fileupload replicates this behavior by sending images to the NextJS Application

#### 4. NextJS Application

Receives leaf images from the simulated edge device.

Sends them to the Edge Impulse Docker model for inference.

Passes inference results to an AI Agentic Pipeline.

#### 5. Agentic AI Decision Layer

The agent:

Analyzes the disease prediction result

Assesses risk level

Generates step-by-step treatments

Issues reminders (e.g., spray in morning, repeat after 24 hours)

Sends real-time alerts and warnings

Helps prevent spread by recommending early interventions

#### 6. Farmer Dashboard (UI)

Displays disease status, confidence score, and treatment plan

Works offline with local backend

Acts as a simple farmer-facing app

## Scope of the Solution

### Current Scope

Offline disease detection using Edge Impulse + Docker

Real-time simulated edge-device image capture

NextJS based application

Agentic AI decision-making and guidance

Farmer-facing UI dashboard

Personalized recommendations

Early-warning alerts

Completely deployable on low-cost hardware

### Future Scope

Multispectral analysis

Soil health integration

Yield prediction

Weather-aware disease forecasting

Multi-language farmer guidance

Multi-sensor integration (humidity, moisture, temperature)

## Why CropSafe AI is Innovative

Offline inference → No internet needed

Agentic AI → Goes beyond prediction to guidance, planning, reminders

Low-cost hardware → ESP32-CAM / Raspberry Pi

Scalable architecture → Easy to deploy across farms

Real-time detection → Stops outbreaks early

Farmer-friendly solution → Simple UI, practical advice


## Current Flow Diagram 
Image Upload →  Edge Impulse Docker Inference  →  NextJS Application  →  AI Agent → UI Notifications

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
-   **Edge Impulse** [Edge Impulse Studio](https://studio.edgeimpulse.com/)
-   **Docker** Run Edge Impulse model as container for local inference

## Features

-   **Image-based Disease Detection**: Upload a PNG, JPG, or JPEG image of a plant leaf to have it analyzed.
-   **AI-Powered Analysis**: The app connects to a sophisticated edge impulse model via docker service to classify the plant's health status (e.g., Healthy, Blight, Rust).
-   **Confidence Score**: View the model's confidence level for the detected disease.
-   **AI Treatment Guidance**: For diagnosed diseases, the app uses Genkit to generate concise and actionable treatment advice.
-   **Detailed Disease Information**: Access descriptions, symptoms, and causes for a wide range of plant diseases.
-   **Responsive Design**: A clean, intuitive, and mobile-friendly user interface.

## How to Run Locally

To get the project running on your local machine, follow these steps:

**Pre-Requisite** : 
Make sure the docker container run in local using docker desktop
- Start your docker desktop
- Run the following command in cmd
```
docker run --rm -it \
    -p 1337:1337 \
    public.ecr.aws/g7a8t7v6/inference-container:v1.79.5 \
        --api-key ei_275d05304e725592c380f2f604b16f5f73826f52ffaa71ce3b73331d65500001 \
        --run-http-server 1337
```

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

<img width="1860" height="980" alt="EdgeAI Architecture (1)" src="https://github.com/user-attachments/assets/717ea4a4-42b3-4001-8c1e-77d9d6e15612" />

## Application Pages

<img width="2872" height="1631" alt="home-page" src="https://github.com/user-attachments/assets/20c319f5-197c-4cc6-b29a-c1860a47f4b6" />

<img width="2879" height="1640" alt="analyze-page-1" src="https://github.com/user-attachments/assets/4d684dab-aa7a-441b-8ac1-92f4ca48fac9" />

<img width="2877" height="1632" alt="analyze-page-2" src="https://github.com/user-attachments/assets/aef8a385-dc44-41c5-9bcf-f09a65325f74" />

<img width="2850" height="1661" alt="analyze-page-3" src="https://github.com/user-attachments/assets/d215b330-62bc-4688-b5ca-e1fc4ee6717a" />

<img width="2870" height="1634" alt="analyze-page-4" src="https://github.com/user-attachments/assets/4b5ddae7-8d11-4c1c-a91a-c44fa5368a55" />







# **Built with love ❤️ and innovation for the Edge AI Contest by Edge Impulse.**

