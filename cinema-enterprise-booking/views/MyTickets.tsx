import React, { useEffect, useState } from 'react';
import { Ticket as TicketIcon, Calendar, MapPin, Loader, QrCode } from 'lucide-react';
import { api } from '../services/api';
const getRowLetter = (index: number) => String.fromCharCode(65 + index);

export default function MyTickets() {
  const [tickets, setTickets] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await api.get('/bookings/my');
        
        const mappedTickets = (Array.isArray(data) ? data : []).map((t: any) => ({
          ...t,
          id: String(t.id),
          startTime: t.screeningTime || t.startTime,
          row: t.rowIndex !== undefined ? getRowLetter(t.rowIndex) : '?',
          number: t.seatIndex !== undefined ? t.seatIndex + 1 : 0, 
        }));

        const sorted = mappedTickets.sort((a: any, b: any) => 
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        setTickets(sorted);
      } catch (e) {
        console.error("Failed to fetch tickets", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-cinema-accent">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 bg-cinema-900 min-h-full">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
        <TicketIcon className="text-cinema-accent" size={32} /> My Tickets
      </h1>

      {tickets.length === 0 ? (
        <div className="bg-cinema-800 border border-cinema-700 rounded-xl p-12 text-center max-w-2xl mx-auto">
          <TicketIcon size={48} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-xl font-bold text-white mb-2">No tickets found</h2>
          <p className="text-gray-400">You haven't booked any movies yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex flex-col bg-cinema-800 rounded-xl overflow-hidden border border-cinema-700 hover:border-cinema-500 transition-colors">
        
              <div className="bg-cinema-900 p-4 border-b border-dashed border-cinema-600 relative">
                <h3 className="font-bold text-lg text-white truncate pr-8">{ticket.movieTitle}</h3>
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-cinema-900 rounded-full"></div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-cinema-900 rounded-full"></div>
              </div>

              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="text-cinema-accent mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Date & Time</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(ticket.startTime).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}
                    </p>
                    <p className="text-sm text-gray-300">
                      {new Date(ticket.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-cinema-accent mt-0.5 shrink-0" size={18} />
                  <div>
                     <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Hall & Seat</p>
                     <p className="text-sm font-medium text-white">{ticket.hallName}</p>
                     <div className="flex gap-2 mt-1">
                       <span className="bg-cinema-700 px-2 py-0.5 rounded text-xs text-cinema-gold font-bold border border-cinema-600">Row {ticket.row}</span>
                       <span className="bg-cinema-700 px-2 py-0.5 rounded text-xs text-cinema-gold font-bold border border-cinema-600">Seat {ticket.number}</span>
                     </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 flex items-center justify-between">
                <div className="text-cinema-900">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Booking ID</p>
                    <p className="font-mono font-bold text-lg tracking-tight">
                        {ticket.id.length > 8 ? ticket.id.substring(0, 8) : ticket.id}
                    </p>
                </div>
                <QrCode className="text-cinema-900" size={40} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}