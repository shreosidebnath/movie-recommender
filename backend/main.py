from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from recommender import MovieRecommender
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Movie Recommender API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize recommender
recommender = MovieRecommender()

class RecommendationRequest(BaseModel):
    movie_ids: List[int]
    n_recommendations: int = 10

@app.on_event("startup")
async def startup_event():
    """Load movie dataset on startup"""
    print("Loading movie dataset...")
    recommender.prepare_dataset(num_movies=5000, cache_file='movies_cache_5000.json')
    print("Dataset loaded successfully!")
@app.get("/")
async def root():
    return {"message": "Movie Recommender API is running!"}

@app.get("/movies")
async def get_movies():
    if recommender.movies_df is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded")
    
    movies = recommender.movies_df.to_dict('records')
    return {
        "movies": [
            {
                "id": int(m['id']),
                "title": m['title'],
                "poster_path": m['poster_path'],
                "vote_average": float(m['vote_average']),
                "release_date": m['release_date'],
                "genres": m['genres']
            }
            for m in movies
        ]
    }

@app.post("/recommend")
async def recommend_movies(request: RecommendationRequest):
    if recommender.movies_df is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded")
    
    if len(request.movie_ids) < 1:
        raise HTTPException(status_code=400, detail="Please select at least 1 movie")
    
    recommendations = recommender.get_recommendations(
        request.movie_ids,
        request.n_recommendations
    )
    
    return {
        "recommendations": recommendations,
        "based_on": len(request.movie_ids)
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}