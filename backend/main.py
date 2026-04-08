from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# 🔐 Load .env file
load_dotenv()

# 🔑 Get API key from .env
api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=api_key)

app = FastAPI(title="AI Resume & Career Agent 🚀")

# ✅ CORS FIX (MOST IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📥 Input Model
class UserInput(BaseModel):
    name: str
    skills: str

# ✅ Health Check
@app.get("/")
def home():
    return {"message": "Gemini AI Backend Running 🚀"}

# 🤖 AI Route
@app.post("/generate")
def generate(data: UserInput):
    try:
        prompt = f"""
        You are an expert career guidance AI.

        User Details:
        Name: {data.name}
        Skills: {data.skills}

        Give output in this EXACT format:

        Career Suggestions:
        - (list 3-5 roles)

        Skills to Improve:
        - (list important skills)

        Resume Summary:
        (write the name of user)
        (write 3-4 lines professional summary)

        Keep answer clean, no extra introduction.
        """


        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        response = model.generate_content(prompt)

        output = response.text.strip() if response.text else "No response"

        return {"message": output}

    except Exception as e:
        return {"error": str(e)}