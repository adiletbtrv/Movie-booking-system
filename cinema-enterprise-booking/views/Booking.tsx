import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Ticket, CheckCircle, Timer, Loader } from 'lucide-react';
import { Movie, Screening, Seat, SeatStatus, BookedTicket } from '../types';
import { api } from '../services/api';

const generateLayout = (): Seat[] => {
  const seats: Seat[] = [];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = 10;
  
  for (let r = 0; r < rowLabels.length; r++) {
    for (let c = 1; c <= cols; c++) {
      let priceMod = 1.0;
      if (r === rowLabels.length - 1) {
        priceMod = 1.5;
      }

      seats.push({
        id: `${rowLabels[r]}${c}`,
        row: rowLabels[r],
        number: c,
        rowIndex: r,
        seatIndex: c,
        status: SeatStatus.AVAILABLE,
        priceModifier: priceMod
      });
    }
  }
  return seats;
};

export default function Booking() {
  const { movieId, screeningId } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(300); // 5 minutes
  const [step, setStep] = useState<'seats' | 'payment' | 'confirmation'>('seats');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const movies: Movie[] = await api.get('/movies');
        const foundMovie = movies.find(m => m.id === movieId || String(m.id) === movieId);
        if (foundMovie) setMovie(foundMovie);

        const screenings: Screening[] = await api.get(`/screenings?movieId=${movieId}`);
        const foundScreening = screenings.find(s => s.id === screeningId || String(s.id) === screeningId);
        if (foundScreening) setScreening(foundScreening);

        const initialSeats = generateLayout();
        if (foundScreening) {
            const bookedTickets: BookedTicket[] = await api.get(`/screenings/${screeningId}/seats`);
            
            const updatedSeats = initialSeats.map(seat => {
                const isBooked = bookedTickets.some(
                    ticket => ticket.rowIndex === seat.rowIndex && ticket.seatIndex === seat.seatIndex
                );
                return isBooked ? { ...seat, status: SeatStatus.OCCUPIED } : seat;
            });
            setSeats(updatedSeats);
        } else {
            setSeats(initialSeats);
        }

      } catch (e) {
        console.error("Failed to load booking data", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (movieId && screeningId) {
        fetchData();
    }
  }, [movieId, screeningId]);

  useEffect(() => {
    if (selectedSeatIds.length > 0 && step === 'seats') {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0) {
            setSelectedSeatIds([]); 
            alert("Reservation time expired");
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
        setTimer(300); 
    }
  }, [selectedSeatIds, step]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === SeatStatus.OCCUPIED || seat.status === SeatStatus.LOCKED) return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 6) {
        alert("Max 6 seats per booking");
        return;
      }
      setSelectedSeatIds(prev => [...prev, seat.id]);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePayment = async () => {
    if (!screening) return;
    setIsProcessing(true);
    
    try {
        for (const seatId of selectedSeatIds) {
            const seat = seats.find(s => s.id === seatId);
            if (seat) {
                await api.post('/bookings', {
                    screeningId: screening.id,
                    rowIndex: seat.rowIndex,
                    seatIndex: seat.seatIndex
                });
            }
        }
        
        setStep('confirmation');
    } catch (e) {
        console.error(e);
        alert("Booking failed. Some seats may have been taken.");
    } finally {
        setIsProcessing(false);
    }
  };

  if (isLoading || !movie || !screening) {
    return (
        <div className="flex h-screen items-center justify-center bg-cinema-900 text-white">
            <Loader className="animate-spin" size={48} />
        </div>
    );
  }

  const totalPrice = selectedSeatIds.reduce((sum, id) => {
    const seat = seats.find(s => s.id === id);
    return sum + (screening.price * (seat?.priceModifier || 1));
  }, 0);

  if (step === 'confirmation') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 animate-fade-in text-white">
        <div className="w-24 h-24 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-400 mb-8">Your tickets have been sent to your email.</p>
        
        <div className="bg-cinema-800 p-6 rounded-2xl w-full max-w-md border border-cinema-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-cinema-accent"></div>
            <h3 className="text-xl font-bold mb-4">{movie.title}</h3>
            <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>{new Date(screening.startTime).toLocaleDateString()}</span>
                <span>{new Date(screening.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="flex justify-between items-center border-t border-cinema-700 pt-4">
                <div className="text-left">
                    <p className="text-xs text-gray-500">SEATS</p>
                    <p className="font-bold text-cinema-gold">{selectedSeatIds.join(', ')}</p>
                </div>
            </div>
        </div>

        <button onClick={() => navigate('/')} className="mt-8 text-cinema-accent hover:underline">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden text-white">
        <div className="w-full lg:w-1/3 p-6 lg:p-10 bg-cinema-800 border-r border-cinema-700 flex flex-col z-10 shadow-2xl">
            <button onClick={() => navigate('/')} className="self-start flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft size={18} /> Back
            </button>

            <div className="flex gap-4 mb-6">
                <img src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/200/300`} alt={movie.title} className="w-24 h-36 object-cover rounded-lg shadow-lg" />
                <div>
                    <h1 className="text-2xl font-bold mb-1">{movie.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span className="bg-cinema-700 px-2 py-0.5 rounded text-xs">{screening.type}</span>
                        <span>{movie.durationMin} min</span>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(screening.startTime).toLocaleString()}</p>
                </div>
            </div>

            <div className="flex-1">
                {selectedSeatIds.length > 0 && (
                    <div className="bg-cinema-900/50 p-4 rounded-xl border border-cinema-700 mb-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Time remaining</span>
                            <div className="flex items-center gap-1 text-cinema-accent font-mono font-bold">
                                <Timer size={16} />
                                {formatTime(timer)}
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            {selectedSeatIds.map(id => {
                                const seat = seats.find(s => s.id === id);
                                const price = screening.price * (seat?.priceModifier || 1);
                                return (
                                    <div key={id} className="flex justify-between text-sm">
                                        <span>Seat {id} {seat?.status === SeatStatus.VIP && '(VIP)'}</span>
                                        <span>${price.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="border-t border-cinema-700 mt-4 pt-4 flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>
            
            {selectedSeatIds.length > 0 && step === 'seats' && (
                <button 
                    onClick={() => setStep('payment')}
                    className="w-full py-4 bg-cinema-accent hover:bg-rose-600 rounded-xl font-bold shadow-lg shadow-cinema-accent/25 transition-all active:scale-95"
                >
                    Proceed to Payment
                </button>
            )}

            {step === 'payment' && (
                <div className="space-y-4">
                    <div className="bg-cinema-900 p-4 rounded-xl border border-cinema-700">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <CreditCard size={18} /> Card Details
                        </h3>
                        <input type="text" placeholder="Card Number" className="w-full bg-cinema-800 border border-cinema-600 rounded-lg p-3 mb-3 text-sm focus:outline-none focus:border-cinema-accent" />
                        <div className="flex gap-3">
                            <input type="text" placeholder="MM/YY" className="w-1/2 bg-cinema-800 border border-cinema-600 rounded-lg p-3 text-sm focus:outline-none focus:border-cinema-accent" />
                            <input type="text" placeholder="CVC" className="w-1/2 bg-cinema-800 border border-cinema-600 rounded-lg p-3 text-sm focus:outline-none focus:border-cinema-accent" />
                        </div>
                    </div>
                    <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold shadow-lg shadow-green-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                    </button>
                </div>
            )}
        </div>

        <div className="flex-1 bg-cinema-900 overflow-auto relative flex flex-col items-center justify-center p-4">
            {step === 'seats' && (
                <>
                    <div className="w-3/4 h-8 bg-gradient-to-b from-white/10 to-transparent rounded-[50%] mb-12 relative shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-gray-500 text-sm tracking-[0.5em] uppercase">Screen</div>
                    </div>

                    <div className="grid gap-y-4 gap-x-2 md:gap-x-4 mb-12">
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((rowLabel) => {
                            return (
                                <div key={rowLabel} className="flex items-center gap-4">
                                    <span className="w-6 text-center text-gray-500 text-xs font-bold">{rowLabel}</span>
                                    <div className="flex gap-2 md:gap-3">
                                        {seats.filter(s => s.row === rowLabel).map(seat => {
                                            const isSelected = selectedSeatIds.includes(seat.id);
                                            const isOccupied = seat.status === SeatStatus.OCCUPIED;
                                            const isVip = seat.priceModifier > 1;

                                            return (
                                                <button
                                                    key={seat.id}
                                                    disabled={isOccupied}
                                                    onClick={() => handleSeatClick(seat)}
                                                    className={`
                                                        w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-md text-[10px] flex items-center justify-center transition-all duration-200 relative group
                                                        ${isOccupied ? 'bg-cinema-700 cursor-not-allowed opacity-40' : 
                                                          isSelected ? 'bg-cinema-accent text-white shadow-lg shadow-cinema-accent/50 scale-110' : 
                                                          isVip ? 'bg-cinema-gold text-black hover:bg-yellow-400' : 
                                                          'bg-cinema-700 text-gray-300 hover:bg-cinema-600'}
                                                    `}
                                                >
                                                    {seat.number}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <span className="w-6 text-center text-gray-500 text-xs font-bold">{rowLabel}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-cinema-700"></div> Available</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-cinema-accent"></div> Selected</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-cinema-gold"></div> VIP</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-cinema-700 opacity-40"></div> Occupied</div>
                    </div>
                </>
            )}
            
            {step === 'payment' && (
                <div className="text-gray-500 flex flex-col items-center">
                    <Ticket size={64} className="mb-4 opacity-20" />
                    <p>Complete your payment on the left to finalize booking.</p>
                </div>
            )}
        </div>
    </div>
  );
}