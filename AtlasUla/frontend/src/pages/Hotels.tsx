import {
AlertCircle,
Bed,
CheckCircle,
ExternalLink,
Heart,
MapPin,
ShieldCheck,
Star
} from 'lucide-react';
import React,{ useEffect,useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button,Card } from '../components/UI';
import { tripService } from '../services/api';
import { Hotel,Trip } from '../types';
import { MOCK_HOTELS } from '../utils/mockData';

export const Hotels: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>(MOCK_HOTELS.default);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bookingHotel, setBookingHotel] = useState<Hotel | null>(null);

  // Form Booking Date
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Load Trips
  const loadTrips = async () => {
    try {
      const loaded = await tripService.getTrips();
      setTrips(loaded);
      if (loaded.length > 0) {
        setSelectedTrip(loaded[0]);
        resolveHotels(loaded[0].destination);
      }
    } catch (e) {
      console.error(e);
      resolveHotels('default');
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const resolveHotels = (destination: string) => {
    const destLower = destination.toLowerCase();
    if (destLower.includes('paris')) {
      setHotels(MOCK_HOTELS.paris);
    } else if (destLower.includes('tokyo')) {
      setHotels(MOCK_HOTELS.tokyo);
    } else {
      setHotels(MOCK_HOTELS.default);
    }
  };

  const handleTripChange = (tripId: string) => {
    const match = trips.find(t => t.id === tripId) || null;
    setSelectedTrip(match);
    if (match) {
      resolveHotels(match.destination);
    } else {
      resolveHotels('default');
    }
  };

  const toggleWishlist = (hotelId: string) => {
    setWishlist(prev => 
      prev.includes(hotelId)
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
    const added = !wishlist.includes(hotelId);
    toast.success(added ? 'Added to wishlist!' : 'Removed from wishlist.', { id: 'wishlist' });
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingHotel || !selectedTrip) return;

    // Simulate adding lodging charge to trip expenses list
    const nights = checkIn && checkOut 
      ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
      : 1;
    
    const cost = bookingHotel.price * nights;

    const newExpense = {
      id: 'hotel_' + Math.random().toString(36).substring(2, 9),
      title: `${bookingHotel.name} (${nights} Nights)`,
      amount: cost,
      category: 'Hotel' as const,
      date: checkIn || new Date().toISOString().split('T')[0]
    };

    try {
      const updatedTrip = await tripService.logExpense(selectedTrip.id, newExpense);
      setSelectedTrip(updatedTrip);
      toast.success(`Booking Confirmed! logged $${cost} in Expenses.`, {
        icon: '🏨',
        duration: 4000
      });
      setBookingHotel(null);
    } catch (err) {
      toast.error('Failed to book lodging.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Hotel Stay Finder</h1>
          <p className="text-xs text-textSecondary mt-1">Discover safe, curated hotels matching active travel destinations.</p>
        </div>

        {trips.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-textSecondary font-medium">Select Destination:</span>
            <select
              value={selectedTrip?.id || ''}
              onChange={(e) => handleTripChange(e.target.value)}
              className="glass-input rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none cursor-pointer bg-card"
            >
              {trips.map(t => (
                <option key={t.id} value={t.id}>📍 {t.destination}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: Hotel List and Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Hotel Cards List */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
            <Bed className="w-5 h-5 text-accent" /> Premium Lodging Matches
          </h2>

          <div className="space-y-4">
            {hotels.map((hotel) => {
              const inWishlist = wishlist.includes(hotel.id);
              return (
                <Card 
                  key={hotel.id} 
                  variant="solid" 
                  className="bg-card/55 border-white/5 p-4 flex flex-col md:flex-row gap-5 hover:border-primary/25 transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="w-full md:w-48 h-40 rounded-xl overflow-hidden shrink-0 relative bg-white/5">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <button
                      onClick={() => toggleWishlist(hotel.id)}
                      className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-md border transition-all cursor-pointer ${
                        inWishlist 
                          ? 'bg-primary/20 border-primary/30 text-primary-light' 
                          : 'bg-background/40 border-white/5 text-textSecondary hover:text-white'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Info Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-sm font-bold text-white font-sora">{hotel.name}</h3>
                        <span className="text-sm font-extrabold text-accent shrink-0">${hotel.price}<span className="text-[10px] text-textSecondary font-medium">/night</span></span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-textSecondary mt-2">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-warning fill-warning" /> {hotel.rating} Rating</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-accent" /> {hotel.distance}</span>
                        <span className="flex items-center gap-1 text-success bg-success/15 px-2 py-0.5 rounded-full border border-success/20">
                          <ShieldCheck className="w-3 h-3" /> Safety Index: {hotel.safetyScore}
                        </span>
                      </div>

                      <p className="text-xs text-textSecondary mt-3.5 leading-relaxed">
                        {hotel.description}
                      </p>
                    </div>

                    {/* Amenities & Book */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 mt-4">
                      <div className="flex flex-wrap gap-1">
                        {hotel.amenities.map(a => (
                          <span key={a} className="text-[9px] px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/5 text-textSecondary">{a}</span>
                        ))}
                      </div>
                      
                      {selectedTrip ? (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => {
                            setBookingHotel(hotel);
                            setCheckIn(selectedTrip.startDate);
                            setCheckOut(selectedTrip.endDate);
                          }}
                          className="h-8.5 text-xs cursor-pointer"
                        >
                          Book Stay (Demo)
                        </Button>
                      ) : (
                        <span className="text-[10px] text-textSecondary italic">Save a trip to unlock booking</span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Map Preview Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-bold text-white font-sora">Map View</h2>
          <Card variant="solid" className="p-4 bg-card/65 border-white/5 text-center space-y-4">
            <div className="h-64 rounded-xl border border-white/10 relative overflow-hidden bg-background/90 flex items-center justify-center">
              {/* Simulated Map Layout */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Center pointer */}
              <div className="absolute w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center animate-pulse">
                <MapPin className="w-4 h-4 text-primary-light" />
              </div>

              {hotels.map((h, i) => (
                <div 
                  key={h.id} 
                  className="absolute p-1 bg-card rounded border border-white/10 shadow text-[9px] font-semibold text-white flex items-center gap-1"
                  style={{
                    top: `${30 + (i * 20)}%`,
                    left: `${20 + (i * 25)}%`
                  }}
                >
                  <Star className="w-2.5 h-2.5 text-warning fill-warning" />
                  <span>${h.price}</span>
                </div>
              ))}
              
              <div className="absolute bottom-3 left-3 right-3 text-[9px] bg-background/85 border border-white/5 py-1.5 px-2.5 rounded-lg text-textSecondary font-medium">
                Showing {hotels.length} luxury stays surrounding center.
              </div>
            </div>

            {selectedTrip && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=Hotels+in+${encodeURIComponent(selectedTrip.destination)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:text-white font-semibold pt-1 transition-colors"
              >
                Expand in Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </Card>
        </div>
      </div>

      {/* Booking Checkout Modal */}
      {bookingHotel && selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setBookingHotel(null)} />
          <Card variant="glass" className="w-full max-w-md relative z-10 border-white/10 p-6 space-y-4 transform animate-float">
            <div className="flex gap-3 border-b border-white/5 pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light"><CheckCircle className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-sm font-sora text-white">Lodging Reservation</h3>
                <p className="text-[10px] text-textSecondary">{bookingHotel.name}</p>
              </div>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Check-In</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Check-Out</label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1.5 text-xs text-textSecondary">
                <div className="flex justify-between">
                  <span>Price per night</span>
                  <span className="text-white font-bold">${bookingHotel.price}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1.5">
                  <span>Estimated Total</span>
                  <span className="text-accent font-extrabold">
                    ${bookingHotel.price * (checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-warning bg-warning/10 border border-warning/20 p-2.5 rounded-lg leading-normal">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Bookings are demo only and logged immediately under active expenses.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1 cursor-pointer">Confirm Booking</Button>
                <Button type="button" variant="outline" onClick={() => setBookingHotel(null)} className="cursor-pointer">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Hotels;
