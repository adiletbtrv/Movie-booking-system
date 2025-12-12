
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Loader, Calendar } from 'lucide-react';
import { Movie } from '../types';
import { api } from '../services/api';

export default function Catalog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const moviesData: Movie[] = await api.get('/movies');
        setMovies(moviesData);
        setFilteredMovies(moviesData);
      } catch (error) {
        console.error("Failed to fetch catalog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredMovies(movies);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = movies.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) || 
      m.description?.toLowerCase().includes(lowerQuery)
    );
    setFilteredMovies(filtered);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-cinema-accent">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="pb-20 bg-cinema-900 min-h-full">
      <div className="relative h-[40vh] w-full overflow-hidden bg-cinema-800 border-b border-cinema-700">
        <img 
          src="https://picsum.photos/seed/cinema-hero-dark/1600/900" 
          className="w-full h-full object-cover opacity-30" 
          alt="Cinema Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-900 via-cinema-900/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-white tracking-tight">
            Now Showing
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-xl relative mt-4">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cinema-900 text-white pl-12 pr-4 py-3 rounded-lg border border-cinema-700 focus:outline-none focus:border-cinema-accent placeholder-gray-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          </form>
        </div>
      </div>

      <div className="p-6 lg:p-12">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No movies found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredMovies.map(movie => (
              <div 
                key={movie.id} 
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group bg-cinema-800 rounded-lg overflow-hidden cursor-pointer border border-cinema-700 hover:border-cinema-500 transition-all duration-200"
              >
                <div className="relative aspect-[2/3] bg-cinema-900 overflow-hidden">
                  <img 
                    src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/300/450`} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    loading="lazy" 
                  />
                  <div className="absolute top-2 right-2 bg-cinema-900/95 border border-cinema-700 px-2 py-1 rounded flex items-center gap-1">
                    <Star className="text-cinema-gold fill-current" size={12} />
                    <span className="text-xs font-bold text-white">{movie.rating}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-base font-bold truncate text-white mb-1 group-hover:text-cinema-accent transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {movie.genres?.slice(0, 2).map(g => (
                      <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-cinema-700 text-gray-400 border border-cinema-600">
                        {g}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full py-2 bg-cinema-700 group-hover:bg-cinema-accent rounded text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wide">
                    <Calendar size={14} /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
