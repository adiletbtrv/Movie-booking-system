
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Star, Loader, Info } from 'lucide-react';
import { Movie, Screening } from '../types';
import { api } from '../services/api';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDuration = (mins: number) => {
    if (!mins || mins === 0) return 'TBA';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const groupScreeningsByDate = (screenings: Screening[]) => {
    const groups: Record<string, Screening[]> = {};
    screenings.forEach(s => {
      const date = new Date(s.startTime).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(s);
    });
    return groups;
  };

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setIsLoading(true);
        const allMovies: Movie[] = await api.get('/movies');
        const found = allMovies.find(m => String(m.id) === id);
        
        if (found) {
          setMovie(found);
          const scr: Screening[] = await api.get(`/screenings?movieId=${id}`);
          const future = scr.filter(s => new Date(s.startTime) > new Date()).sort((a, b) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
          setScreenings(future);
        }
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-cinema-accent">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="p-8 text-center text-gray-400">
        <h2 className="text-xl font-bold mb-2">Movie not found</h2>
        <button onClick={() => navigate('/')} className="text-cinema-accent hover:underline">Return Home</button>
      </div>
    );
  }

  const groupedScreenings = groupScreeningsByDate(screenings);

  return (
    <div className="bg-cinema-900 min-h-full">
      <div className="p-4 lg:p-8">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} /> Back to Catalog
        </button>

        <div className="flex flex-col md:flex-row gap-8 bg-cinema-800 p-6 rounded-xl border border-cinema-700">
          <div className="shrink-0 w-full md:w-64">
             <img 
               src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/300/450`} 
               alt={movie.title} 
               className="w-full rounded-lg shadow-none border border-cinema-600"
             />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
               <span className="bg-cinema-accent text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Now Showing</span>
               <div className="flex items-center gap-1 text-cinema-gold">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">{movie.rating}</span>
               </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{movie.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-300 mb-6 pb-6 border-b border-cinema-700">
               <div className="flex items-center gap-2">
                  <Clock size={18} className="text-gray-500" />
                  <span className="font-medium">{formatDuration(movie.durationMin)}</span>
               </div>
               <div className="flex gap-2">
                 {movie.genres?.map(g => (
                   <span key={g} className="px-2 py-1 bg-cinema-700 rounded text-xs text-gray-300 border border-cinema-600">{g}</span>
                 ))}
               </div>
               {movie.director && (
                   <div className="hidden md:block text-gray-400">
                       Dir. <span className="text-gray-200">{movie.director}</span>
                   </div>
               )}
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Synopsis</h3>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-3xl">
                {movie.description || "No description available for this movie."}
            </p>

            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="text-cinema-accent" size={20} /> Showtimes
                </h3>

                {Object.keys(groupedScreenings).length === 0 ? (
                    <div className="bg-cinema-900 border border-cinema-700 rounded-lg p-6 text-center">
                        <p className="text-gray-500">No upcoming screenings available.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedScreenings).map(([date, shows]) => (
                            <div key={date}>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{date}</h4>
                                <div className="flex flex-wrap gap-3">
                                    {shows.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => navigate(`/book/${movie.id}/${s.id}`)}
                                            className="group flex flex-col items-center justify-center bg-cinema-900 border border-cinema-600 hover:border-cinema-accent hover:bg-cinema-800 rounded-lg px-6 py-3 transition-all min-w-[100px]"
                                        >
                                            <span className="text-lg font-bold text-white group-hover:text-cinema-accent">
                                                {new Date(s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[10px] bg-cinema-700 px-1 rounded text-gray-300">{s.type}</span>
                                                <span className="text-[10px] text-cinema-gold font-bold">${s.price}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
