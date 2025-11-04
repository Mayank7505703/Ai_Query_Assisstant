# STEMROBO AI Assistant

This project is a client-side AI chat assistant for STEMROBO Technologies, built with React and powered by the Google Gemini API.

## Project Structure

-   `/components`: React components for the frontend.
-   `App.tsx`: Main frontend application component.
-   `index.tsx`: Frontend entry point.
-   `index.html`: Main HTML file.
-   `package.json`: Project dependencies.
-   `constants.ts`: Contains the system prompt for the AI model.

## Local Setup and Running the Application

Follow these steps to run the application on your local machine.

**Prerequisites:**
*   A modern web browser.
*   A Google Gemini API key.

### Step 1: Set Up API Key

This application requires a Google Gemini API key to function. The key must be available as an environment variable named `API_KEY` in the environment where you host the application.

For local testing, you can temporarily add your key to `index.html` for the application to work, but **never commit your API key to version control.**

**Example for Local Testing (in `index.html`):**

Add this script tag inside the `<head>` section:

```html
<script>
  window.process = {
    env: {
      API_KEY: 'YOUR_GEMINI_API_KEY_HERE'
    }
  }
</script>
```

### Step 2: Run the Frontend

The easiest way to run the frontend is by opening the `index.html` file directly in your web browser.

Alternatively, you can use a simple live server for a better development experience.

1.  If you don't have the `live-server` package, you can install it using Node.js/npm:
    ```bash
    npm install -g live-server
    ```
2.  Once installed, run it from the project's root directory:
    ```bash
    live-server .
    ```
3.  Your browser will automatically open the chat application.

## Troubleshooting

-   **"Failed to initialize chat" Error:** This typically means the `API_KEY` is missing or invalid. Please double-check Step 1 and ensure your API key is correctly set up.
-   **"Something went wrong" Error:** This could be due to a network issue, an invalid API key, or a problem with the Gemini API service. Check your browser's developer console for more specific error details.
