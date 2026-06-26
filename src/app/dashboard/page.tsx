'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

export default function DashboardPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<any>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    todayBookings: 0,
  });

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Selected Booking for Modal Details
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  
  // Confirmation state for deletion
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadDashboardData();
  }, [search, statusFilter, page]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load bookings with filters
      const bookingsResponse = await api.get('/booking', {
        params: {
          search,
          status: statusFilter || undefined,
          page,
          limit,
        },
      });

      // Handle backend response format
      if (bookingsResponse.data) {
        if (Array.isArray(bookingsResponse.data)) {
          setBookings(bookingsResponse.data);
          setTotalCount(bookingsResponse.data.length);
        } else if (bookingsResponse.data.data && Array.isArray(bookingsResponse.data.data)) {
          setBookings(bookingsResponse.data.data);
          setTotalCount(bookingsResponse.data.total || bookingsResponse.data.data.length);
        }
      }

      // Load stats
      const statsResponse = await api.get('/dashboard/stats');
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // If token expired or invalid, redirect to login
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      await api.put(`/booking/${id}`, { status: newStatus });
      
      // Update selected booking details view if currently open
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status: newStatus }));
      }
      
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setActionLoading(id);
    try {
      await api.delete(`/booking/${id}`);
      setSelectedBooking(null);
      setDeleteConfirmId(null);
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to delete booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    // Clear cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-950/40 text-amber-400 border-amber-500/20';
      case 'CONFIRMED':
        return 'bg-blue-950/40 text-blue-400 border-blue-500/20';
      case 'COMPLETED':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20';
      case 'CANCELLED':
        return 'bg-red-950/40 text-red-400 border-red-500/20';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-mesh-glow min-h-screen text-neutral-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 glass-card border-x-0 border-t-0 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold tracking-widest gold-gradient-text">MAHESH STUDIO</span>
            <span className="text-[10px] tracking-widest bg-gold-950/80 border border-gold-500/20 px-2 py-0.5 rounded text-gold-400 font-semibold uppercase">
              ADMIN CONTROL
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="/" 
              target="_blank" 
              className="text-xs text-neutral-400 hover:text-gold-400 font-medium transition-colors"
            >
              VISIT SITE ↗
            </a>
            <button
              onClick={logout}
              className="bg-neutral-900 border border-neutral-800 hover:border-red-500/40 hover:text-red-400 text-neutral-300 font-bold px-4 py-2 rounded-full transition-all duration-300 text-xs tracking-widest cursor-pointer"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-card p-6 rounded-2xl border-neutral-900 flex flex-col justify-between">
            <span className="text-[10px] tracking-wider font-bold text-neutral-500 uppercase">Total Bookings</span>
            <span className="font-serif text-3xl font-bold text-neutral-100 mt-2">{stats.totalBookings}</span>
          </div>
          <div className="glass-card p-6 rounded-2xl border-neutral-900 flex flex-col justify-between">
            <span className="text-[10px] tracking-wider font-bold text-amber-500 uppercase">Pending Review</span>
            <span className="font-serif text-3xl font-bold text-amber-400 mt-2">{stats.pendingBookings}</span>
          </div>
          <div className="glass-card p-6 rounded-2xl border-neutral-900 flex flex-col justify-between">
            <span className="text-[10px] tracking-wider font-bold text-blue-500 uppercase">Confirmed</span>
            <span className="font-serif text-3xl font-bold text-blue-400 mt-2">{stats.confirmedBookings}</span>
          </div>
          <div className="glass-card p-6 rounded-2xl border-neutral-900 flex flex-col justify-between">
            <span className="text-[10px] tracking-wider font-bold text-red-500 uppercase">Cancelled</span>
            <span className="font-serif text-3xl font-bold text-red-400 mt-2">{stats.cancelledBookings}</span>
          </div>
          <div className="glass-card p-6 rounded-2xl border-neutral-900 flex flex-col justify-between col-span-2 lg:col-span-1">
            <span className="text-[10px] tracking-wider font-bold text-gold-500 uppercase">Requested Today</span>
            <span className="font-serif text-3xl font-bold gold-gradient-text mt-2">{stats.todayBookings}</span>
          </div>
        </div>

        {/* Filters and List */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border-neutral-900 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-neutral-100">Reservations</h2>
              <p className="text-xs text-neutral-500 mt-1">Review bookings, update event status, or manage clients.</p>
            </div>
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search customer name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-dark-900 border border-neutral-800 focus:border-gold-500 text-neutral-200 text-xs px-4 py-2.5 rounded-xl transition-all outline-none min-w-[200px]"
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-dark-900 border border-neutral-800 focus:border-gold-500 text-neutral-200 text-xs px-4 py-2.5 rounded-xl transition-all outline-none uppercase tracking-wider font-semibold"
              >
                <option value="">ALL STATUSES</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Bookings Grid/Table */}
          {loading ? (
            <div className="py-20 flex flex-col justify-center items-center gap-4 text-neutral-400">
              <svg className="animate-spin h-8 w-8 text-gold-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs uppercase tracking-widest font-semibold">LOADING RESERVATIONS...</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center">
              <svg className="w-8 h-8 text-neutral-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p className="text-sm font-semibold uppercase tracking-wider">No bookings found</p>
              <p className="text-xs text-neutral-600 mt-1">Try modifying your search query or filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-dark-900 border border-neutral-850 rounded-xl text-[10px] tracking-wider uppercase font-bold text-neutral-500">
                <div className="col-span-3">Customer</div>
                <div className="col-span-2">Email & Phone</div>
                <div className="col-span-2">Shoot Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center px-6 py-5 bg-dark-900/40 hover:bg-dark-900 border border-neutral-850 hover:border-gold-500/20 rounded-2xl transition-all duration-300 relative group"
                >
                  {/* Left Column: Customer details */}
                  <div className="col-span-3">
                    <p className="font-serif font-bold text-neutral-200">{booking.customerName}</p>
                    <span className="text-[10px] text-neutral-500 font-mono tracking-wider">{booking.id.substring(0, 8)}...</span>
                  </div>

                  {/* Second Column: Email & Phone */}
                  <div className="col-span-2 space-y-0.5 text-xs text-neutral-400">
                    <p className="truncate">{booking.email}</p>
                    <p className="font-mono">{booking.phone}</p>
                  </div>

                  {/* Third Column: Date */}
                  <div className="col-span-2 text-xs">
                    <p className="text-neutral-300 font-semibold">{formatDate(booking.eventDate)}</p>
                  </div>

                  {/* Fourth Column: Status badge */}
                  <div className="col-span-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] tracking-wider font-semibold border ${getStatusStyle(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Fifth Column: Actions */}
                  <div className="col-span-3 flex items-center justify-end gap-2 text-xs w-full lg:w-auto">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-3.5 py-1.5 rounded-lg border border-neutral-800 hover:border-gold-500 text-neutral-300 hover:text-gold-400 bg-neutral-900/30 transition-colors font-medium cursor-pointer"
                    >
                      View
                    </button>
                    
                    {booking.status === 'PENDING' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                        disabled={actionLoading === booking.id}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-neutral-950 border border-blue-500/20 transition-all font-semibold cursor-pointer"
                      >
                        Confirm
                      </button>
                    )}

                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                        disabled={actionLoading === booking.id}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 border border-emerald-500/20 transition-all font-semibold cursor-pointer"
                      >
                        Complete
                      </button>
                    )}

                    <div className="relative">
                      {deleteConfirmId === booking.id ? (
                        <div className="flex gap-1 items-center bg-red-950 border border-red-800 rounded-lg p-1">
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-neutral-400 hover:text-white px-2 py-1 rounded text-[10px] cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(booking.id)}
                          className="p-2 rounded-lg border border-neutral-800 hover:border-red-500/50 hover:text-red-400 bg-neutral-900/30 transition-colors cursor-pointer"
                          title="Delete booking"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {totalCount > limit && (
                <div className="flex items-center justify-between border-t border-neutral-900 pt-6">
                  <span className="text-xs text-neutral-500">
                    Showing {bookings.length} of {totalCount} reservations
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="px-4 py-2 border border-neutral-850 hover:border-gold-500 rounded-xl text-xs text-neutral-400 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page * limit >= totalCount}
                      onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 border border-neutral-850 hover:border-gold-500 rounded-xl text-xs text-neutral-400 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-2xl bg-neutral-950 border border-neutral-900 p-8 rounded-3xl relative shadow-2xl animate-float-slow">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-6 right-6 p-2 rounded-full border border-neutral-850 hover:border-gold-500 text-neutral-400 hover:text-gold-400 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] tracking-wider font-semibold border uppercase mb-3 ${getStatusStyle(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
                <h3 className="font-serif text-3xl font-bold text-neutral-100">{selectedBooking.customerName}</h3>
                <p className="text-xs text-neutral-500 mt-1">Booking reference: {selectedBooking.id}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-neutral-900 py-6">
                <div>
                  <h5 className="text-[10px] tracking-wider font-bold text-neutral-500 uppercase mb-1">Email Address</h5>
                  <p className="text-xs text-neutral-300 break-all">{selectedBooking.email}</p>
                </div>
                <div>
                  <h5 className="text-[10px] tracking-wider font-bold text-neutral-500 uppercase mb-1">Phone Number</h5>
                  <p className="text-xs text-neutral-300 font-mono">{selectedBooking.phone}</p>
                </div>
                <div>
                  <h5 className="text-[10px] tracking-wider font-bold text-neutral-500 uppercase mb-1">Event Date</h5>
                  <p className="text-xs text-neutral-300 font-semibold">{formatDate(selectedBooking.eventDate)}</p>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] tracking-wider font-bold text-neutral-500 uppercase mb-2">Message & Details</h5>
                <div className="bg-dark-900 border border-neutral-850 p-4 rounded-xl text-xs text-neutral-400 whitespace-pre-wrap leading-relaxed">
                  {selectedBooking.message || 'No additional requirements specified.'}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap gap-2 justify-end pt-4">
                {selectedBooking.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'CANCELLED')}
                    className="px-4 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-red-400 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}

                {selectedBooking.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'CONFIRMED')}
                    className="px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-neutral-950 border border-blue-500/20 transition-all text-xs font-bold cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                )}

                {selectedBooking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'COMPLETED')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 border border-emerald-500/20 transition-all text-xs font-bold cursor-pointer"
                  >
                    Complete Booking
                  </button>
                )}

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-gold-500 text-neutral-300 transition-colors text-xs font-semibold cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}