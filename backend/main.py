
# Career Prediction Backend (FastAPI + MongoDB + JWT)
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel


import threading
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

app = FastAPI()

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Career Prediction API is running."}

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Persistent user storage in users.json
USERS_FILE = "users.json"
def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}
def save_users(users):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f)

users = load_users()
predictions = {}
feedbacks = []
lock = threading.Lock()

# JWT
SECRET_KEY = os.getenv("JWT_SECRET", "secret")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# Models
class User(BaseModel):
    username: str
    password: str

class Profile(BaseModel):
    user_id: str
    skills: list[str]
    education: str
    interests: list[str]
    personality: str
    goals: str

class Prediction(BaseModel):
    user_id: str
    careers: list[dict]
    reasoning: str
    roadmap: list[str]

class Feedback(BaseModel):
    user_id: str
    feedback: str

# Auth utils
async def authenticate_user(username: str, password: str):
    with lock:
        user = users.get(username)
        if user and user["password"] == password:
            return user
    return None

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        with lock:
            user = users.get(username)
            if user is None:
                raise HTTPException(status_code=401, detail="User not found")
            return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth endpoints

@app.post("/auth/signup")
async def signup(user: User):
    with lock:
        if user.username in users:
            raise HTTPException(status_code=400, detail="Username exists")
        users[user.username] = user.dict()
        save_users(users)
    return {"msg": "User created"}

@app.post("/auth/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}

# Main endpoints


# Content-based filtering: static career database
CAREER_DATABASE = [
    # --- ENGINEERING DOMAIN ---
    {
        "title": "Software Engineer",
        "domain": "Engineering",
        "skills": ["programming", "software development", "algorithms", "problem-solving", "technology", "teamwork"],
        "description": "Designs, develops, and maintains software applications and systems.",
        "roadmap": ["Earn a degree in Computer Science or related field", "Learn programming languages (e.g., Python, Java, C++)", "Build software projects", "Apply for software engineering roles"]
    },
    {
        "title": "Civil Engineer",
        "domain": "Engineering",
        "skills": ["structural analysis", "project management", "math", "design", "construction", "problem-solving"],
        "description": "Designs and oversees construction of infrastructure projects like roads, bridges, and buildings.",
        "roadmap": ["Earn a degree in Civil Engineering", "Gain internship experience", "Get licensed (PE)", "Apply for civil engineering jobs"]
    },
    {
        "title": "Mechanical Engineer",
        "domain": "Engineering",
        "skills": ["mechanical design", "CAD", "math", "physics", "problem-solving", "manufacturing"],
        "description": "Designs and builds mechanical systems and devices.",
        "roadmap": ["Earn a degree in Mechanical Engineering", "Learn CAD software", "Work on engineering projects", "Apply for mechanical engineering roles"]
    },
    {
        "title": "Electrical Engineer",
        "domain": "Engineering",
        "skills": ["circuit design", "electronics", "math", "problem-solving", "embedded systems", "communication"],
        "description": "Designs and develops electrical systems and components.",
        "roadmap": ["Earn a degree in Electrical Engineering", "Work on electronics projects", "Apply for electrical engineering jobs"]
    },
    # --- MEDICINE DOMAIN ---
    {
        "title": "Cardiologist",
        "domain": "Medicine",
        "skills": ["medicine", "cardiology", "diagnosis", "patient care", "communication", "research"],
        "description": "Diagnoses and treats heart and cardiovascular conditions.",
        "roadmap": ["Earn a medical degree (MD)", "Complete residency in internal medicine", "Complete fellowship in cardiology", "Get board certified", "Apply for cardiologist positions"]
    },
    {
        "title": "General Surgeon",
        "domain": "Medicine",
        "skills": ["surgery", "anatomy", "patient care", "decision-making", "teamwork", "medical knowledge"],
        "description": "Performs surgical operations to treat diseases and injuries.",
        "roadmap": ["Earn a medical degree (MD)", "Complete surgical residency", "Get board certified", "Apply for surgeon positions"]
    },
    {
        "title": "Nurse Practitioner",
        "domain": "Medicine",
        "skills": ["nursing", "patient care", "diagnosis", "communication", "medical knowledge", "teamwork"],
        "description": "Provides advanced nursing care and can diagnose and treat illnesses.",
        "roadmap": ["Earn a nursing degree (BSN)", "Become a registered nurse (RN)", "Complete nurse practitioner program (MSN or DNP)", "Get certified", "Apply for NP jobs"]
    },
    # --- SCIENCE DOMAIN ---
    {
        "title": "Data Scientist",
        "domain": "Science",
        "skills": ["statistics", "data analysis", "machine learning", "programming", "math", "curiosity"],
        "description": "Analyzes and interprets complex data to help organizations make decisions.",
        "roadmap": ["Earn a degree in Data Science, Statistics, or related field", "Learn Python/R", "Work on data projects", "Apply for data scientist roles"]
    },
    {
        "title": "Research Physicist",
        "domain": "Science",
        "skills": ["physics", "math", "research", "problem-solving", "experimentation", "critical thinking"],
        "description": "Conducts research to understand physical phenomena and develop new technologies.",
        "roadmap": ["Earn a degree in Physics", "Complete a PhD in Physics", "Conduct research and publish papers", "Apply for research positions"]
    },
    {
        "title": "Environmental Scientist",
        "domain": "Science",
        "skills": ["environmental science", "research", "analysis", "problem-solving", "communication"],
        "description": "Studies the environment and develops solutions to environmental problems.",
        "roadmap": ["Earn a degree in Environmental Science", "Conduct research", "Apply for scientist roles"]
    },
    # --- POLITICS & GOVERNMENT DOMAIN ---
    {
        "title": "Policy Analyst",
        "domain": "Politics",
        "skills": ["policy analysis", "research", "writing", "critical thinking", "communication", "public speaking"],
        "description": "Researches and analyzes policies to advise governments and organizations.",
        "roadmap": ["Earn a degree in Political Science, Public Policy, or related field", "Gain experience in policy research", "Apply for policy analyst roles"]
    },
    {
        "title": "Diplomat",
        "domain": "Politics",
        "skills": ["diplomacy", "negotiation", "foreign languages", "communication", "international relations", "problem-solving"],
        "description": "Represents a country abroad and manages international relations.",
        "roadmap": ["Earn a degree in International Relations or related field", "Pass foreign service exam", "Gain experience abroad", "Apply for diplomat positions"]
    },
    {
        "title": "Legislative Assistant",
        "domain": "Politics",
        "skills": ["research", "writing", "policy analysis", "communication", "organization", "public policy"],
        "description": "Assists lawmakers by researching issues, drafting legislation, and communicating with constituents.",
        "roadmap": ["Earn a degree in Political Science or related field", "Intern with a legislator", "Apply for legislative assistant roles"]
    },
    # --- BUSINESS & MANAGEMENT DOMAIN ---
    {
        "title": "Product Manager",
        "domain": "Business",
        "skills": ["product management", "leadership", "communication", "strategy", "market research", "problem-solving"],
        "description": "Oversees the development and success of products from conception to launch.",
        "roadmap": ["Earn a degree in Business, Engineering, or related field", "Gain experience in product development", "Apply for product manager roles"]
    },
    {
        "title": "Financial Analyst",
        "domain": "Business",
        "skills": ["finance", "analysis", "excel", "communication", "problem-solving", "accounting"],
        "description": "Analyzes financial data to help organizations make investment decisions.",
        "roadmap": ["Earn a degree in Finance, Accounting, or related field", "Learn financial modeling", "Apply for financial analyst jobs"]
    },
    {
        "title": "Human Resources Manager",
        "domain": "Business",
        "skills": ["human resources", "communication", "organization", "leadership", "conflict resolution", "recruitment"],
        "description": "Manages hiring, training, and employee relations in organizations.",
        "roadmap": ["Earn a degree in Human Resources or related field", "Gain HR experience", "Apply for HR manager roles"]
    },
    # --- CREATIVE & DESIGN DOMAIN ---
    {
        "title": "Graphic Designer",
        "domain": "Creative",
        "skills": ["creativity", "design", "visual arts", "communication", "technology", "adobe suite"],
        "description": "Creates visual content for print and digital media.",
        "roadmap": ["Earn a degree in Graphic Design or related field", "Build a portfolio", "Apply for design jobs"]
    },
    {
        "title": "UX/UI Designer",
        "domain": "Creative",
        "skills": ["design", "creativity", "user research", "technology", "communication", "prototyping"],
        "description": "Designs user interfaces and experiences for digital products.",
        "roadmap": ["Learn UX/UI principles", "Build a design portfolio", "Apply for UX/UI jobs"]
    },
    {
        "title": "Copywriter",
        "domain": "Creative",
        "skills": ["writing", "creativity", "marketing", "storytelling", "communication", "editing"],
        "description": "Writes persuasive and engaging content for advertising and marketing.",
        "roadmap": ["Earn a degree in English, Marketing, or related field", "Build a writing portfolio", "Apply for copywriting jobs"]
    },
    {
        "title": "Software Engineer",
        "skills": ["programming", "problem-solving", "logic", "technology", "math"],
        "description": "Designs and builds software applications and systems.",
        "roadmap": ["Learn programming basics", "Build software projects", "Apply for internships/jobs"]
    },
    {
        "title": "Data Scientist",
        "skills": ["statistics", "data analysis", "programming", "math", "curiosity"],
        "description": "Analyzes and interprets complex data to help organizations make decisions.",
        "roadmap": ["Learn statistics and Python", "Practice with datasets", "Apply for data science roles"]
    },
    {
        "title": "Graphic Designer",
        "skills": ["creativity", "design", "visual arts", "communication", "technology"],
        "description": "Creates visual content for print and digital media.",
        "roadmap": ["Learn design tools", "Build a portfolio", "Apply for design jobs"]
    },
    {
        "title": "Mechanical Engineer",
        "skills": ["math", "physics", "problem-solving", "design", "technology"],
        "description": "Designs and builds mechanical systems and devices.",
        "roadmap": ["Study engineering fundamentals", "Work on engineering projects", "Apply for engineering roles"]
    },
    {
        "title": "Teacher",
        "skills": ["communication", "patience", "organization", "subject knowledge", "empathy"],
        "description": "Educates students in a variety of subjects.",
        "roadmap": ["Earn a teaching degree", "Gain classroom experience", "Apply for teaching positions"]
    },
    {
        "title": "Marketing Specialist",
        "skills": ["communication", "creativity", "analytics", "strategy", "persuasion"],
        "description": "Promotes products and services to target audiences.",
        "roadmap": ["Learn marketing basics", "Work on campaigns", "Apply for marketing jobs"]
    },
    {
        "title": "Nurse",
        "skills": ["empathy", "medical knowledge", "patience", "teamwork", "attention to detail"],
        "description": "Provides care and support to patients in healthcare settings.",
        "roadmap": ["Earn a nursing degree", "Complete clinical training", "Apply for nursing jobs"]
    },
    {
        "title": "Accountant",
        "skills": ["math", "attention to detail", "organization", "finance", "analysis"],
        "description": "Manages financial records and prepares reports for organizations.",
        "roadmap": ["Earn an accounting degree", "Get certified (e.g., CPA)", "Apply for accounting jobs"]
    },
    {
        "title": "Civil Engineer",
        "skills": ["math", "design", "project management", "problem-solving", "teamwork"],
        "description": "Designs and oversees construction projects like roads, bridges, and buildings.",
        "roadmap": ["Earn a civil engineering degree", "Work on construction projects", "Apply for engineering roles"]
    },
    {
        "title": "Chef",
        "skills": ["creativity", "cooking", "organization", "time management", "teamwork"],
        "description": "Prepares meals and manages kitchen staff in restaurants or hotels.",
        "roadmap": ["Attend culinary school", "Gain kitchen experience", "Apply for chef positions"]
    },
    {
        "title": "Pharmacist",
        "skills": ["medical knowledge", "attention to detail", "communication", "organization", "science"],
        "description": "Dispenses medications and advises patients on their proper use.",
        "roadmap": ["Earn a pharmacy degree", "Complete internship", "Apply for pharmacist jobs"]
    },
    {
        "title": "Lawyer",
        "skills": ["critical thinking", "communication", "research", "argumentation", "analysis"],
        "description": "Represents clients in legal matters and provides legal advice.",
        "roadmap": ["Earn a law degree", "Pass the bar exam", "Apply for legal positions"]
    },
    {
        "title": "Psychologist",
        "skills": ["empathy", "research", "communication", "analysis", "patience"],
        "description": "Studies mental processes and helps people manage mental health issues.",
        "roadmap": ["Earn a psychology degree", "Complete supervised practice", "Apply for psychologist roles"]
    },
    {
        "title": "Sales Manager",
        "skills": ["communication", "persuasion", "leadership", "strategy", "negotiation"],
        "description": "Leads sales teams and develops strategies to meet sales targets.",
        "roadmap": ["Gain sales experience", "Develop leadership skills", "Apply for sales manager roles"]
    },
    {
        "title": "Web Developer",
        "skills": ["programming", "design", "problem-solving", "technology", "creativity"],
        "description": "Builds and maintains websites and web applications.",
        "roadmap": ["Learn web development", "Build web projects", "Apply for web developer jobs"]
    },
    {
        "title": "Electrician",
        "skills": ["technical skills", "problem-solving", "attention to detail", "safety", "math"],
        "description": "Installs and maintains electrical systems in homes and businesses.",
        "roadmap": ["Complete electrician training", "Get licensed", "Apply for electrician jobs"]
    },
    {
        "title": "Journalist",
        "skills": ["writing", "research", "communication", "curiosity", "critical thinking"],
        "description": "Researches and writes news stories for media outlets.",
        "roadmap": ["Earn a journalism degree", "Build a writing portfolio", "Apply for journalist positions"]
    },
    {
        "title": "UX/UI Designer",
        "skills": ["design", "creativity", "user research", "technology", "communication"],
        "description": "Designs user interfaces and experiences for digital products.",
        "roadmap": ["Learn UX/UI principles", "Build a design portfolio", "Apply for UX/UI jobs"]
    },
    {
        "title": "Environmental Scientist",
        "skills": ["science", "research", "analysis", "problem-solving", "communication"],
        "description": "Studies the environment and develops solutions to environmental problems.",
        "roadmap": ["Earn an environmental science degree", "Conduct research", "Apply for scientist roles"]
    },
    {
        "title": "Entrepreneur",
        "skills": ["leadership", "creativity", "risk-taking", "strategy", "problem-solving"],
        "description": "Starts and manages new business ventures.",
        "roadmap": ["Develop a business idea", "Create a business plan", "Launch and grow your business"]
    },
    {
        "title": "Project Manager",
        "skills": ["leadership", "organization", "communication", "planning", "problem-solving"],
        "description": "Oversees projects and teams to ensure goals are met on time and within budget.",
        "roadmap": ["Earn a degree (any field)", "Gain project experience", "Get PMP certification", "Apply for project manager roles"]
    },
    {
        "title": "Social Worker",
        "skills": ["empathy", "communication", "problem-solving", "advocacy", "organization"],
        "description": "Helps individuals and families cope with challenges in their lives.",
        "roadmap": ["Earn a social work degree", "Complete supervised practice", "Apply for social worker jobs"]
    },
    {
        "title": "Police Officer",
        "skills": ["physical fitness", "communication", "problem-solving", "teamwork", "integrity"],
        "description": "Protects the public, prevents crime, and enforces laws.",
        "roadmap": ["Complete police academy training", "Pass background checks", "Apply for police officer positions"]
    },
    {
        "title": "Flight Attendant",
        "skills": ["communication", "customer service", "problem-solving", "teamwork", "adaptability"],
        "description": "Ensures passenger safety and comfort on flights.",
        "roadmap": ["Meet airline requirements", "Complete training", "Apply for flight attendant jobs"]
    },
    {
        "title": "Fitness Trainer",
        "skills": ["physical fitness", "motivation", "communication", "teaching", "planning"],
        "description": "Helps clients achieve fitness goals through exercise and nutrition guidance.",
        "roadmap": ["Earn fitness certification", "Gain experience", "Apply for trainer positions"]
    },
    {
        "title": "Plumber",
        "skills": ["technical skills", "problem-solving", "attention to detail", "manual dexterity", "customer service"],
        "description": "Installs and repairs plumbing systems in homes and businesses.",
        "roadmap": ["Complete apprenticeship", "Get licensed", "Apply for plumber jobs"]
    },
    {
        "title": "Veterinarian",
        "skills": ["medical knowledge", "empathy", "problem-solving", "attention to detail", "communication"],
        "description": "Provides medical care to animals.",
        "roadmap": ["Earn a veterinary degree", "Complete clinical training", "Apply for veterinarian jobs"]
    },
    # Add more careers as needed
]

from difflib import SequenceMatcher

# Synonyms map for real-life matching
SYNONYMS = {
    "programming": ["coding", "software development", "developer", "engineer"],
    "math": ["mathematics", "arithmetic", "calculus", "algebra"],
    "communication": ["speaking", "writing", "presenting", "public speaking"],
    "creativity": ["creative", "imagination", "innovation", "artistic"],
    "problem-solving": ["troubleshooting", "critical thinking", "solution", "analytical"],
    "leadership": ["management", "supervision", "team lead", "coordinator"],
    "organization": ["organizational", "planning", "scheduling", "coordination"],
    "customer service": ["client service", "customer support", "help desk"],
    "medical knowledge": ["medicine", "healthcare", "clinical", "doctor", "nurse"],
    # Add more as needed
}

def expand_keywords(keywords):
    expanded = set()
    for kw in keywords:
        expanded.add(kw)
        for k, syns in SYNONYMS.items():
            if kw == k or kw in syns:
                expanded.add(k)
                expanded.update(syns)
    return expanded

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio() > 0.7

def get_career_recommendation_content_based(profile: Profile):
    # Combine all user profile fields into a set of keywords
    user_keywords = set()
    user_keywords.update([s.lower() for s in profile.skills])
    user_keywords.update([s.lower() for s in profile.interests])
    user_keywords.add(profile.education.lower())
    user_keywords.add(profile.personality.lower())
    user_keywords.add(profile.goals.lower())
    user_keywords = expand_keywords(user_keywords)

    # Score each career by overlap, partial match, and synonyms
    scored_careers = []
    for career in CAREER_DATABASE:
        career_keywords = expand_keywords([s.lower() for s in career["skills"]])
        overlap = len(user_keywords.intersection(career_keywords))
        # Add partial match score
        for uk in user_keywords:
            for ck in career_keywords:
                if uk != ck and similar(uk, ck):
                    overlap += 0.5
        scored_careers.append((overlap, career))

    # Sort by score descending, then by title
    scored_careers.sort(key=lambda x: (-x[0], x[1]["title"]))

    # Return top 3 matches with descriptions and roadmap
    recommendations = []
    for score, career in scored_careers[:3]:
        if score > 0:
            recommendations.append({
                "career": career["title"],
                "description": career["description"],
                "roadmap": career["roadmap"],
                "match_score": score
            })
    if not recommendations:
        recommendations.append({
            "career": "No strong match found",
            "description": "Try providing more detailed or different answers in the survey.",
            "roadmap": [],
            "match_score": 0
        })
    return recommendations

# New endpoint for content-based prediction
@app.post("/predict-career-content-based")
async def predict_career_content_based(profile: Profile, user=Depends(get_current_user)):
    recommendations = get_career_recommendation_content_based(profile)
    prediction = {
        "user_id": profile.user_id,
        "careers": recommendations,
        "reasoning": "Based on your skills, interests, and background, these careers are a strong fit.",
        "roadmap": recommendations[0]["roadmap"] if recommendations and recommendations[0]["roadmap"] else []
    }
    with lock:
        predictions[profile.user_id] = prediction
    return prediction

@app.get("/results/{user_id}")
async def get_results(user_id: str, user=Depends(get_current_user)):
    with lock:
        result = predictions.get(user_id)
        if not result:
            raise HTTPException(status_code=404, detail="No results found")
        return result

@app.post("/feedback")
async def submit_feedback(feedback: Feedback, user=Depends(get_current_user)):
    with lock:
        feedbacks.append(feedback.dict())
    return {"msg": "Feedback received"}
