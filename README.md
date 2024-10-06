# SummerHack2024

Click the link below to see out website demo: https://women-in-tech-competition-team.github.io/SummerHack2024/

# About Us
QuestionGenie is a website that uses advanced AI algorithms to generate personalized practice questions for any subject. Simply input your topic, and our system will create tailored questions to help you study effectively.
1. Personalized Learning: Questions tailored to your specific needs.
2. Enhanced Understanding: Practice questions help reinforce your knowledge.
3. Time Efficiency: Save time by focusing on areas where you need the most practice.
4. Confidence Boost: Improve your confidence by mastering challenging topics.

# Our Mission
At QuestionGenie, our mission is to revolutionize the way people learn by providing innovative, AI-driven tools that empower individuals to achieve their academic goals. We believe in making education accessible, personalized, and effective for everyone.

# Services
- Our service utilizes Ollama as our AI of choice, allowing the use of the many models built for Ollama.
- As we rely on our own services for our AI, your data is kept private by design.
- Our AI is custom-tailored to respond to queries  with simple explanations and helpful problems

# Running Locally

- Download and run Ollama:
  - Follow this link to download Ollama. This software is available for macOS, Linux, and Windows: https://ollama.com/
  - After it has been installed, open a terminal and run `ollama pull llama3.1:latest`.
  - After the model has been downloaded, run `ollama serve` and keep the terminal open in the background.

- Demo website
  - Open our Github project by following by this link: https://github.com/Women-in-Tech-Competition-Team/SummerHack2024
  - Click on “<> Code”, download the project as a ZIP folder, and unzip it somewhere.	
  - Once finished, open your software code editor (ex: VS Code) and open the SummerHack2024-main folder.
  - Change `OLLAMA_HOST` in serviceScript.js to `http://127.0.0.1:11434` (line 4)
  - Open a terminal and run `python -m http.server` inside it
  - Navigate to http://127.0.0.1:8000/ in your browser.
