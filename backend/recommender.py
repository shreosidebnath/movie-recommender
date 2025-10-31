import pandas as pd
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv
import time
import json
import numpy as np

load_dotenv()

class MovieRecommender:
    def __init__(self):
        self.api_key = '6d9a6e401fb6623572f7d7a77eafd963'
        self.base_url = "https://api.themoviedb.org/3"
        self.movies_df = None
        self.tfidf_matrix = None
        self.vectorizer = None
        print(f"API Key loaded: {self.api_key[:10]}..." if self.api_key else "API Key not found!")
        
    def fetch_popular_movies(self, num_pages=10):
        """Fetch popular movies from TMDB"""
        all_movies = []
        
        for page in range(1, num_pages + 1):
            url = f"{self.base_url}/movie/popular"
            params = {
                'api_key': self.api_key,
                'page': page,
                'language': 'en-US'
            }
            
            try:
                response = requests.get(url, params=params, timeout=10)
                print(f"Page {page} status: {response.status_code}")
                
                if response.status_code == 200:
                    movies = response.json()['results']
                    all_movies.extend(movies)
                    print(f"✓ Fetched page {page}/{num_pages} - Got {len(movies)} movies")
                else:
                    print(f"✗ Error on page {page}: {response.status_code} - {response.text}")
                    
                time.sleep(0.3)
                
            except Exception as e:
                print(f"✗ Exception fetching page {page}: {e}")
        
        return all_movies
    
    def fetch_movie_details(self, movie_id):
        """Fetch detailed info for a movie including genres and keywords"""
        url = f"{self.base_url}/movie/{movie_id}"
        params = {
            'api_key': self.api_key,
            'append_to_response': 'keywords'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error fetching movie {movie_id}: {response.status_code}")
                return None
        except Exception as e:
            print(f"Exception fetching movie {movie_id}: {e}")
            return None
    
    def prepare_dataset(self, num_movies=200, cache_file='movies_cache.json'):
        """Prepare movie dataset with features"""
        
        # Try to load from cache first
        if os.path.exists(cache_file):
            print(f"Loading movies from cache file: {cache_file}")
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    cached_data = json.load(f)
                    self.movies_df = pd.DataFrame(cached_data)
                    
                # Rebuild TF-IDF matrix
                self.movies_df['features'] = (
                    self.movies_df['overview'].fillna('') + ' ' +
                    self.movies_df['genres'].fillna('') + ' ' +
                    self.movies_df['keywords'].fillna('')
                )
                
                self.vectorizer = TfidfVectorizer(stop_words='english', max_features=200)
                self.tfidf_matrix = self.vectorizer.fit_transform(self.movies_df['features'])
                
                print(f"✓✓✓ Loaded {len(self.movies_df)} movies from cache! ✓✓✓")
                return self.movies_df
                
            except Exception as e:
                print(f"Error loading cache: {e}")
                print("Fetching fresh data instead...")
        
        # No cache found - fetch fresh movies
        print("Fetching movies from TMDB...")
        num_pages = (num_movies // 20) + 1
        movies = self.fetch_popular_movies(num_pages=num_pages)
        
        print(f"Total movies fetched: {len(movies)}")
        
        if not movies:
            raise Exception("Failed to fetch any movies from TMDB. Check your API key!")
        
        movies_data = []
        print("Processing movie details...")
        
        target_count = min(num_movies, len(movies))
        
        for i, movie in enumerate(movies[:target_count], 1):
            try:
                details = self.fetch_movie_details(movie['id'])
                if details:
                    genres = ' '.join([g['name'] for g in details.get('genres', [])])
                    keywords_list = details.get('keywords', {}).get('keywords', [])
                    keywords = ' '.join([k['name'] for k in keywords_list[:5]])
                    
                    movies_data.append({
                        'id': movie['id'],
                        'title': movie['title'],
                        'overview': movie.get('overview', ''),
                        'genres': genres,
                        'keywords': keywords,
                        'popularity': movie.get('popularity', 0),
                        'vote_average': movie.get('vote_average', 0),
                        'poster_path': movie.get('poster_path', ''),
                        'release_date': movie.get('release_date', '')
                    })
                    
                    if i % 25 == 0:
                        print(f"✓ Processed {i}/{target_count} movies...")
                        
                time.sleep(0.25)
                
            except Exception as e:
                print(f"✗ Error processing movie {movie.get('title', 'Unknown')}: {e}")
                continue
        
        print(f"Total movies successfully processed: {len(movies_data)}")
        
        if not movies_data:
            raise Exception("No movies were processed successfully.")
        
        self.movies_df = pd.DataFrame(movies_data)
        
        # Create feature text
        self.movies_df['features'] = (
            self.movies_df['overview'].fillna('') + ' ' +
            self.movies_df['genres'].fillna('') + ' ' +
            self.movies_df['keywords'].fillna('')
        )
        
        # Create TF-IDF matrix
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=200)
        self.tfidf_matrix = self.vectorizer.fit_transform(self.movies_df['features'])
        
        # Save to cache
        print(f"Saving {len(self.movies_df)} movies to cache file: {cache_file}")
        self.movies_df.to_json(cache_file, orient='records', indent=2)
        print(f"✓✓✓ Dataset ready with {len(self.movies_df)} movies! ✓✓✓")
        
        return self.movies_df
    def get_recommendations(self, selected_movie_ids, n_recommendations=10):
        # Get recommendations based on selected movies
        if self.movies_df is None or self.tfidf_matrix is None:
            return []
        
        selected_indices = self.movies_df[self.movies_df['id'].isin(selected_movie_ids)].index.tolist()
        
        if not selected_indices:
            return []
        
        # Get selected movie vectors
        selected_vectors = self.tfidf_matrix[selected_indices]
        
        # Calculate average vector
        import numpy as np
        avg_vector = np.asarray(selected_vectors.mean(axis=0))
        
        # Calculate similarity with all movies
        similarities = cosine_similarity(avg_vector, self.tfidf_matrix)[0]
        movie_scores = list(enumerate(similarities))
        
        # Filter out selected movies and sort by similarity
        movie_scores = [
            (idx, score) for idx, score in movie_scores 
            if idx not in selected_indices
        ]
        movie_scores = sorted(movie_scores, key=lambda x: x[1], reverse=True)
        
        # Get top N recommendations
        top_indices = [idx for idx, _ in movie_scores[:n_recommendations]]
        
        recommendations = []
        for idx in top_indices:
            movie = self.movies_df.iloc[idx]
            similarity_score = next(score for i, score in movie_scores if i == idx)
            
            recommendations.append({
                'id': int(movie['id']),
                'title': movie['title'],
                'overview': movie['overview'],
                'genres': movie['genres'],
                'poster_path': movie['poster_path'],
                'vote_average': float(movie['vote_average']),
                'release_date': movie['release_date'],
                'similarity_score': float(similarity_score * 100)
            })
        
        return recommendations
