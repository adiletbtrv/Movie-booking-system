import React, { useState, useEffect } from 'react';
import { Plus, Film, Users, DollarSign, Calendar, CheckCircle, AlertCircle, Trash2, Loader, LayoutList, Download } from 'lucide-react';
import { api } from '../services/api';
import { Hall, Movie, AdminStats, Screening } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'stats' | 'movies' | 'sessions' | 'create' | 'import'>('stats');
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const [createForm, setCreateForm] = useState({ movieId: '', hallId: '', date: '', price: '12.50' });
  const [tmdbId, setTmdbId] = useState('');
  
  const [selectedMovieForSessions, setSelectedMovieForSessions] = useState('');
  const [movieScreenings, setMovieScreenings] = useState<Screening[]>([]);

  useEffect(() => {
    loadTabContent();
  }, [activeTab]);

  const loadTabContent = async () => {
    setIsLoading(true);
    setActionMessage(null);
    try {
        if (activeTab === 'stats') {
            try {
                const s = await api.get('/admin/stats');
                setStats({
                    totalRevenue: s.totalRevenue || 0,
                    ticketsSold: s.ticketsSold || 0,
                    moviesCount: s.activeMovies || 0 
                });
            } catch {
                setStats({ totalRevenue: 0, ticketsSold: 0, moviesCount: 0 });
            }
        } else if (['movies', 'create', 'sessions'].includes(activeTab)) {
            const m = await api.get('/movies');
            const mappedMovies = Array.isArray(m) ? m.map((movie: any) => ({
                ...movie,
                id: String(movie.id)
            })) : [];
            setMovies(mappedMovies);

            if (activeTab === 'create') {
                const h = await api.get('/admin/halls');
                setHalls(h);
            }
        }
    } catch (e) {
        console.error("Failed to load tab content", e);
    } finally {
        setIsLoading(false);
    }
  };

  const deleteMovie = async (id: string) => {
    if (!window.confirm('Are you sure? This will delete the movie and ALL related screenings.')) return;
    try {
        await api.delete(`/admin/movies/${id}`);
        setMovies(prev => prev.filter(m => m.id !== id));
        setActionMessage({ type: 'success', text: 'Movie deleted successfully' });
    } catch (e) {
        setActionMessage({ type: 'error', text: 'Failed to delete movie' });
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmdbId) return;
    setIsLoading(true);
    try {
        await api.post(`/admin/movies/import/tmdb/${tmdbId}`, {});
        setActionMessage({ type: 'success', text: `Movie (ID: ${tmdbId}) imported successfully` });
        setTmdbId('');
    } catch (e) {
        setActionMessage({ type: 'error', text: 'Failed to import movie. Check TMDB ID.' });
    } finally {
        setIsLoading(false);
    }
  };

  const loadScreeningsForMovie = async (movieId: string) => {
      setSelectedMovieForSessions(movieId);
      if (!movieId) {
          setMovieScreenings([]);
          return;
      }
      try {
          const s = await api.get(`/screenings?movieId=${movieId}`);
          const mappedScreenings = Array.isArray(s) ? s.map((scr: any) => ({
              ...scr,
              id: String(scr.id)
          })) : [];
          setMovieScreenings(mappedScreenings);
      } catch (e) {
          console.error(e);
      }
  };

  const deleteScreening = async (id: string) => {
      if (!window.confirm('Delete this screening session?')) return;
      try {
          await api.delete(`/admin/screenings/${id}`);
          setMovieScreenings(prev => prev.filter(s => s.id !== id));
          setActionMessage({ type: 'success', text: 'Screening deleted' });
      } catch (e) {
          setActionMessage({ type: 'error', text: 'Failed to delete screening' });
      }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          await api.post('/admin/screenings', {
              movieId: createForm.movieId,
              hallId: createForm.hallId,
              startTime: new Date(createForm.date).toISOString(),
              price: parseFloat(createForm.price)
          });
          setActionMessage({ type: 'success', text: 'Session created successfully' });
          setCreateForm({ ...createForm, date: '' });
      } catch (e) {
          setActionMessage({ type: 'error', text: 'Failed to create session.' });
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="p-6 lg:p-12 min-h-full bg-cinema-900 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="flex bg-cinema-800 p-1 rounded-lg border border-cinema-700 overflow-x-auto">
           {[
             { id: 'stats', label: 'Overview', icon: LayoutList },
             { id: 'import', label: 'Import', icon: Download },
             { id: 'movies', label: 'Movies', icon: Film },
             { id: 'sessions', label: 'Sessions', icon: Calendar },
             { id: 'create', label: 'Create', icon: Plus }
           ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                     activeTab === tab.id ? 'bg-cinema-accent text-white shadow-sm' : 'text-gray-400 hover:text-white'
                 }`}
               >
                 <tab.icon size={16} />
                 <span className="hidden sm:inline">{tab.label}</span>
               </button>
           ))}
        </div>
      </div>

      {actionMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${
              actionMessage.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-red-900/20 text-red-400 border-red-800'
          }`}>
              {actionMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {actionMessage.text}
          </div>
      )}

      {activeTab === 'stats' && (
          <div className="animate-fade-in">
             {!stats ? <Loader className="animate-spin mx-auto text-cinema-accent" /> : (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-cinema-800 p-6 rounded-xl border border-cinema-700">
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="text-gray-400 font-medium">Total Revenue</h3>
                             <DollarSign className="text-green-500" />
                         </div>
                         <p className="text-3xl font-bold tracking-tight">${stats.totalRevenue?.toLocaleString()}</p>
                     </div>
                     <div className="bg-cinema-800 p-6 rounded-xl border border-cinema-700">
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="text-gray-400 font-medium">Tickets Sold</h3>
                             <Users className="text-blue-500" />
                         </div>
                         <p className="text-3xl font-bold tracking-tight">{stats.ticketsSold}</p>
                     </div>
                     <div className="bg-cinema-800 p-6 rounded-xl border border-cinema-700">
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="text-gray-400 font-medium">Active Movies</h3>
                             <Film className="text-cinema-accent" />
                         </div>
                         <p className="text-3xl font-bold tracking-tight">{stats.moviesCount}</p>
                     </div>
                 </div>
             )}
          </div>
      )}

      {activeTab === 'import' && (
          <div className="max-w-xl mx-auto mt-6 bg-cinema-800 p-8 rounded-xl border border-cinema-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Download className="text-cinema-accent" /> Import Movie from TMDB
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                  Enter the TMDB ID of the movie (e.g., 550 for Fight Club, 157336 for Interstellar).
              </p>
              <form onSubmit={handleImport} className="flex gap-4">
                  <input 
                      type="text" 
                      placeholder="TMDB ID" 
                      value={tmdbId}
                      onChange={(e) => setTmdbId(e.target.value)}
                      className="flex-1 bg-cinema-900 border border-cinema-600 rounded-lg p-3 text-white focus:outline-none focus:border-cinema-accent"
                      required
                  />
                  <button 
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-cinema-accent hover:bg-rose-600 rounded-lg font-bold disabled:opacity-50 transition-colors"
                  >
                      {isLoading ? 'Importing...' : 'Import'}
                  </button>
              </form>
          </div>
      )}

      {activeTab === 'movies' && (
          <div className="bg-cinema-800 rounded-xl border border-cinema-700 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-cinema-900 text-gray-400 uppercase font-bold text-xs border-b border-cinema-700">
                          <tr>
                              <th className="p-4">Movie</th>
                              <th className="p-4">Release Date</th>
                              <th className="p-4">Duration</th>
                              <th className="p-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-cinema-700">
                          {movies.length === 0 ? (
                              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No movies found. Please import some.</td></tr>
                          ) : movies.map(m => (
                              <tr key={m.id} className="hover:bg-cinema-700/30 transition-colors">
                                  <td className="p-4 font-medium text-white">{m.title}</td>
                                  <td className="p-4 text-gray-400">{new Date(m.releaseDate).toLocaleDateString()}</td>
                                  <td className="p-4 text-gray-400">{m.durationMin} min</td>
                                  <td className="p-4 text-right">
                                      <button 
                                        onClick={() => deleteMovie(m.id)}
                                        className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 p-2 rounded transition-all"
                                        title="Delete Movie"
                                      >
                                          <Trash2 size={18} />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {activeTab === 'sessions' && (
          <div className="max-w-4xl mx-auto">
              <div className="bg-cinema-800 p-6 rounded-xl border border-cinema-700 mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Movie</label>
                  <select 
                      value={selectedMovieForSessions}
                      onChange={(e) => loadScreeningsForMovie(e.target.value)}
                      className="w-full bg-cinema-900 border border-cinema-600 rounded-lg p-3 text-white focus:border-cinema-accent focus:outline-none"
                  >
                      <option value="">-- Choose a Movie to manage screenings --</option>
                      {movies.map(m => (
                          <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                  </select>
              </div>

              {selectedMovieForSessions && (
                   <div className="bg-cinema-800 rounded-xl border border-cinema-700 overflow-hidden">
                       <table className="w-full text-left text-sm">
                           <thead className="bg-cinema-900 text-gray-400 uppercase font-bold text-xs border-b border-cinema-700">
                               <tr>
                                   <th className="p-4">Start Time</th>
                                   <th className="p-4">Format</th>
                                   <th className="p-4">Price</th>
                                   <th className="p-4 text-right">Action</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-cinema-700">
                               {movieScreenings.length === 0 ? (
                                   <tr><td colSpan={4} className="p-8 text-center text-gray-500">No screenings found for this movie.</td></tr>
                               ) : movieScreenings.map(s => (
                                   <tr key={s.id} className="hover:bg-cinema-700/30">
                                       <td className="p-4 font-mono">{new Date(s.startTime).toLocaleString()}</td>
                                       <td className="p-4"><span className="bg-cinema-700 px-2 py-1 rounded text-[10px] border border-cinema-600">{s.type}</span></td>
                                       <td className="p-4 text-cinema-gold font-bold">${s.price}</td>
                                       <td className="p-4 text-right">
                                           <button 
                                             onClick={() => deleteScreening(s.id)}
                                             className="text-gray-400 hover:text-red-400 transition-colors"
                                           >
                                               <Trash2 size={16} />
                                           </button>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
              )}
          </div>
      )}

      {activeTab === 'create' && (
          <div className="max-w-xl mx-auto mt-6 bg-cinema-800 p-8 rounded-xl border border-cinema-700">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Calendar className="text-cinema-accent" /> Create New Session
              </h3>
              <form onSubmit={handleCreateSession} className="space-y-5">
                  <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Movie</label>
                      <select 
                          value={createForm.movieId}
                          onChange={(e) => setCreateForm({...createForm, movieId: e.target.value})}
                          className="w-full bg-cinema-900 border border-cinema-600 rounded-lg p-3 text-white focus:outline-none focus:border-cinema-accent"
                          required
                      >
                          <option value="">Select Movie</option>
                          {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hall</label>
                      <select 
                          value={createForm.hallId}
                          onChange={(e) => setCreateForm({...createForm, hallId: e.target.value})}
                          className="w-full bg-cinema-900 border border-cinema-600 rounded-lg p-3 text-white focus:outline-none focus:border-cinema-accent"
                          required
                      >
                          <option value="">Select Hall</option>
                          {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                      </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date & Time</label>
                          <input 
                              type="datetime-local" 
                              value={createForm.date}
                              onChange={(e) => setCreateForm({...createForm, date: e.target.value})}
                              className="w-full bg-cinema-900 border border-cinema-600 rounded-lg p-3 text-white focus:outline-none focus:border-cinema-accent scheme-dark"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price ($)</label>
                          <input 
                              type="number" 
                              step="0.5"
                              value={createForm.price}
                              onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
                              className="w-full bg-cinema-900 border border-cinema-600 rounded-lg p-3 text-white focus:outline-none focus:border-cinema-accent"
                              required
                          />
                      </div>
                  </div>
                  <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-cinema-accent hover:bg-rose-600 rounded-lg font-bold mt-4 disabled:opacity-50 transition-colors shadow-lg shadow-cinema-accent/20"
                  >
                      {isLoading ? 'Processing...' : 'Create Session'}
                  </button>
              </form>
          </div>
      )}
    </div>
  );
}