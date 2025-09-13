# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally

To run this project on your local machine, follow these steps:

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 20 or later) and [npm](https://www.npmjs.com/) installed on your system.

### 2. Get a Gemini API Key

This project uses the Google Gemini model for its AI capabilities.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to create an API key.
2.  Create a new file named `.env` in the root of the project.
3.  Add your API key to the `.env` file like this:

    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

### 3. Install Dependencies

Open your terminal, navigate to the project directory, and run the following command to install the necessary packages:

```bash
npm install
```

### 4. Run the Development Servers

You'll need to run two separate processes in two different terminal windows.

**Terminal 1: Run the Next.js App**

This command starts the main application on [http://localhost:9002](http://localhost:9002).

```bash
npm run dev
```

**Terminal 2: Run the Genkit AI Flows**

This command starts the Genkit server, which handles the AI-powered calculations.

```bash
npm run genkit:dev
```

Once both servers are running, you can open your browser and navigate to [http://localhost:9002](http://localhost:9002) to see the calculator app in action.
