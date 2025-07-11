import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import { Groq } from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PORT = process.env.PORT || 8000;

const groq = new Groq({
  apiKey: GROQ_API_KEY
});
app.options('/weather', cors());
app.post('/weather', async (req, res) => {
  const { city, date } = req.body;

  if (!city || !date) {
    return res.status(400).json({ error: "City and date are required" });
  }

  try {
    const weatherResp = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    const forecasts = weatherResp.data.list.filter(item => 
      item.dt_txt.split(' ')[0] === date
    );

    if (forecasts.length === 0) {
      return res.status(404).json({ error: `There is no forecast for ${city} on ${date}` });
    }

    const forecastSummary = forecasts.map(f => {
      const time = f.dt_txt.split(" ")[1].slice(0,5);
      const temp = f.main.temp;
      const desc = f.weather[0].description;
      return `${time} - ${temp}°C, ${desc}`;
    }).join("\n");
    const prompt = `Based on the weather forecast below, give clothing and activity recommendations for the whole day in ${city} on ${date}. 
    Forecast: 
    ${forecastSummary}
    Please summarize overall weather trends and suggest what people should wear and do that day. Also include specific and detailed activity ideas such as which museums, parks, cafes, or outdoor attractions to visit depending on the weather conditions.`;
 
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 500
    });

    const recommendation = chatCompletion.choices[0]?.message?.content || "No recommendation";
    res.json({
      weather: forecasts.map(f => ({
        time: f.dt_txt.split(" ")[1].slice(0,5),
        temperature: f.main.temp,
        description: f.weather[0].description,
      })),
      city,
      date,
      recommendation,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ 
      error: "Error retrieving data",
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server works on port ${PORT}`);
});
