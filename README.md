# Personal Weather Assistant

This is a mini web application that provides personalized weather forecasts and clothing recommendations based on the selected city and date.

---

## Tech Stack

- **Frontend:** React JS
- **Backend:** Node.js (Express)
- **Weather API:** OpenWeatherMap
- **AI Recommendations:** Groq SDK (LLaMA 3)

---

## Installation

### 1. Clone the repository

```
git clone https://github.com/madzida/task_bulb.git
cd your-repo-name
```

### 2. Install dependencies

**Backend**

```
cd backend
npm install
```

While in backend folder create *.env* file that looks like this:
```
GROQ_API_KEY=your_groq_key
OPENWEATHER_API_KEY=your_openweather_key
PORT=8000
```

**GROQ API Key**

To use the Groq API, you need to:
1. Create an account at Groq Console.
2. After logging in, go to the Keys section here:
https://console.groq.com/keys
3. Generate a new API key and paste it in *.env* file.

**OpenWeatherMap API Key**

To use the OpenWeatherMap API, you need to:
1. Sign up for an account at OpenWeatherMap.
2. After logging in, find your API key at:
https://home.openweathermap.org/api_keys
3. Paste the API key in *.env* file.

**Frontend**

```
cd frontend
npm install
```

### 3. Running the app

**Start the backend server**

```
cd backend
node index.js
```
**Start the frontend app**

```
cd frontend
npm run dev
```

## Example Usage

1. Open the application in your browser: http://localhost:5173
2. Enter the name of the city (e.g. Zagreb) and select a date within the next 5 days (including today).
3. Click the button **Get the weather forecast**
4. The weather forecast and personalized recommendation will be displayed.
