import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useSiteConfig } from '../lib/useSiteConfig';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, 
  User, Mail, Phone, MessageSquare, CheckCircle, Shield, Loader2
} from 'lucide-react';

const WEEKDAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const AREA_OPTIONS = [
  'Direito Civil',
  'Direito do Consumidor',
  'Direito do Trabalho',
  'Contratos',
  'Direito Societário',
  'Direito Empresarial',
  'Direito Condominial',
  'Consultoria Jurídica',
  'Consultoria Preventiva',
  'Compliance',
  'Due Diligence',
  'Chief Compliance Officer (CCO)',
  'LGPD',
  'Adequação e Estruturação Empresarial'
];

export default function BookingPage() {
  const navigate = useNavigate();
  const { config } = useSiteConfig();
  
  // Selection states
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    client_type: 'PF',
    area: '',
    has_lawyer: false,
    modality: 'Online',
    message: ''
  });
  
  const [submittedAppt, setSubmittedAppt] = useState(null);

  const selectedDateStr = selectedDate 
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : '';

  // 1. Fetch blocked dates
  const { data: blockedDates = [] } = useQuery({
    queryKey: ['publicBlockedDates'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blocked_dates').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  // 2. Fetch standard availability slots
  const { data: availability = [] } = useQuery({
    queryKey: ['publicAvailability'],
    queryFn: async () => {
      const { data, error } = await supabase.from('availability').select('*');
      if (error) throw error;
      return data.filter(item => !item.date && item.active);
    },
    initialData: [],
  });

  // 3. Fetch booked appointments for the selected date
  const { data: bookedAppointments = [], isLoading: isLoadingBooked } = useQuery({
    queryKey: ['publicBookedAppointments', selectedDateStr],
    enabled: !!selectedDateStr,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('time, status')
        .eq('date', selectedDateStr);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  // Booking Mutation
  const bookMutation = useMutation({
    mutationFn: async (apptData) => {
      const { error } = await supabase
        .from('appointments')
        .insert({
          ...apptData,
          status: 'Pendente'
        });
      if (error) throw error;
      return { ...apptData, status: 'Pendente' };
    },
    onSuccess: (data) => {
      setSubmittedAppt(data);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('Consulta agendada com sucesso!');
    },
    onError: (err) => {
      toast.error('Erro ao agendar consulta: ' + err.message);
    }
  });

  // Reset selected time if date changes
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);

  // Phone input formatting
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    // Format (XX) XXXXX-XXXX
    if (value.length > 6) {
      value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    } else if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setFormData({ ...formData, phone: value });
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    const today = new Date();
    if (currentMonth.getFullYear() > today.getFullYear() || 
       (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() > today.getMonth())) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  };

  const getCalculatedFee = () => {
    if (formData.modality === 'Presencial') return 'A combinar';
    if (formData.client_type === 'PF' && (formData.area === 'Direito do Trabalho' || formData.area === 'Direito do Consumidor')) {
      return 'Gratuita';
    }
    return 'R$ 300,00';
  };

  const calculatedFee = getCalculatedFee();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error('Selecione data e hora para a consulta.');
      return;
    }
    if (!formData.name || !formData.email || !formData.phone || !formData.area) {
      toast.error('Preencha todos os campos obrigatórios (incluindo a Área da Consulta).');
      return;
    }

    const apptTime = selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime;
    
    bookMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      client_type: formData.client_type,
      area: formData.area,
      has_lawyer: formData.has_lawyer,
      modality: formData.modality,
      fee: calculatedFee,
      message: formData.message,
      date: selectedDateStr,
      time: apptTime
    });
  };

  // Build Calendar Days
  const getCalendarDays = () => {
    const startDay = currentMonth.getDay();
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells = [];

    // Prepend empty cells for alignment
    for (let i = 0; i < startDay; i++) {
      cells.push({ day: null, isDummy: true });
    }

    // Append actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const cellDateKey = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
      
      const isPast = cellDate < today;
      const isSunday = cellDate.getDay() === 0;
      const isBlocked = blockedDates.some(b => b.date === cellDateKey && !b.time);
      
      // Check if weekday has standard availability slots configured
      const weekday = cellDate.getDay();
      const hasWeekdaySlots = availability.some(s => s.weekday === weekday);
      
      const isDisabled = isPast || isSunday || isBlocked || !hasWeekdaySlots;
      const isSelected = selectedDate && 
                         selectedDate.getDate() === day && 
                         selectedDate.getMonth() === currentMonth.getMonth() && 
                         selectedDate.getFullYear() === currentMonth.getFullYear();

      cells.push({
        day,
        date: cellDate,
        dateKey: cellDateKey,
        isDisabled,
        isSelected
      });
    }

    return cells;
  };

  // Calculate available times for the selected date
  // Calculate all slots for the selected date (both available and occupied)
  const getAllSlots = () => {
    if (!selectedDate) return [];
    
    const weekday = selectedDate.getDay();
    
    // Find all slots configured for this day of the week
    const templates = availability
      .filter(s => s.weekday === weekday)
      .map(s => s.time.substring(0, 5));
      
    // Find already booked times (excluding cancelled appointments)
    const bookings = bookedAppointments
      .filter(appt => appt.status !== 'Cancelado')
      .map(appt => appt.time.substring(0, 5));

    // Find specifically blocked times for this date
    const blockedTimesForDate = blockedDates
      .filter(b => b.date === selectedDateStr && b.time)
      .map(b => b.time.substring(0, 5));
      
    // Return all template slots with their booking status
    return templates
      .map(time => ({
        time,
        isBooked: bookings.includes(time) || blockedTimesForDate.includes(time)
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const calendarDays = getCalendarDays();
  const allSlots = getAllSlots();  return (
    <div className="booking-page-container" style={{ background: '#ECEEF1', minHeight: '100vh', color: '#1A2B4A' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Instrument+Sans:wght@300;400;500;600;700&display=swap');

        .booking-page-container {
          font-family: 'Instrument Sans', sans-serif;
        }
        
        .booking-heading {
          font-family: 'Cormorant Garamond', serif;
        }

        .booking-card {
          background: #ffffff;
          border: 1px solid rgba(26, 43, 74, 0.12);
          border-radius: 4px;
        }

        .booking-input {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          border: 1px solid rgba(26, 43, 74, 0.15);
          border-radius: 4px;
          padding-top: 12px;
          padding-bottom: 12px;
          padding-right: 16px;
          padding-left: 40px;
          background: #ffffff;
          color: #1A2B4A;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }

        .booking-input:focus {
          border-color: #B8A068;
        }

        .booking-btn-primary {
          background: #1A2B4A;
          color: #ffffff;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border-radius: 4px;
          transition: background-color 0.3s;
          width: 100%;
        }

        .booking-btn-primary:hover:not(:disabled) {
          background-color: #B8A068;
        }

        .booking-btn-ghost {
          border: 1px solid rgba(26, 43, 74, 0.15);
          color: #4A5A72;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border-radius: 4px;
          transition: all 0.3s;
          width: 100%;
        }

        .booking-btn-ghost:hover {
          background-color: rgba(26, 43, 74, 0.05);
          color: #1A2B4A;
        }
      `}</style>
      
      <Navbar config={config} />

      <div className="pt-32 pb-20 px-4 sm:px-8 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!submittedAppt ? (
            <motion.div 
              key="booking-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Intro Title */}
              <div className="text-center max-w-xl mx-auto space-y-3">
                <h1 className="booking-heading text-3xl sm:text-4xl font-normal tracking-tight text-[#1A2B4A]">
                  Agendamento de Consulta
                </h1>
                <div style={{ width: 40, height: 1, background: '#B8A068', margin: '12px auto' }} />
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">
                  Escolha o dia e o horário conveniente na agenda abaixo e insira seus dados para pré-agendamento.
                </p>
              </div>

              {/* Main Container Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Left Column: Interactive Calendar and Hour slots */}
                <div className="booking-card p-6 space-y-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="booking-heading font-medium text-base flex items-center gap-2 text-gray-800">
                      <CalendarIcon className="w-4 h-4 text-[#B8A068]" />
                      {MONTHS[currentMonth.getMonth()]} de {currentMonth.getFullYear()}
                    </h2>
                    <div className="flex gap-1">
                      <button 
                        onClick={handlePrevMonth}
                        type="button"
                        className="p-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        disabled={
                          currentMonth.getFullYear() === new Date().getFullYear() && 
                          currentMonth.getMonth() === new Date().getMonth()
                        }
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={handleNextMonth}
                        type="button"
                        className="p-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid Wrapper */}
                  <div className="max-w-[280px] mx-auto">
                    {/* Weekdays indicator */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#B8A068] tracking-widest mb-3">
                      {WEEKDAYS_SHORT.map((w, idx) => (
                        <div key={idx} className="py-1">{w}</div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((cell, idx) => {
                        if (cell.isDummy) {
                          return <div key={`dummy-${idx}`} className="w-9 h-9"></div>;
                        }

                        return (
                          <button
                            key={`day-${cell.day}`}
                            type="button"
                            onClick={() => setSelectedDate(cell.date)}
                            disabled={cell.isDisabled}
                            className={`w-9 h-9 text-xs rounded flex items-center justify-center transition-all relative font-medium ${
                              cell.isSelected 
                                ? 'bg-[#1a2b4a] text-white font-bold border border-[#B8A068]'
                                : cell.isDisabled
                                  ? 'text-gray-300 cursor-not-allowed line-through hover:bg-transparent'
                                  : 'text-gray-600 hover:bg-[#B8A068]/15 border border-transparent hover:border-[#B8A068]/30'
                            }`}
                          >
                            <span>{cell.day}</span>
                            {/* Selected dot */}
                            {cell.isSelected && (
                              <span className="w-1 h-1 bg-[#B8A068] rounded-full absolute bottom-1"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Grid Inline */}
                  <AnimatePresence>
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-gray-100 pt-5"
                      >
                        <div className="space-y-4">
                          <h3 className="booking-heading font-medium text-sm flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4 text-[#B8A068]" />
                            Selecione o Horário
                          </h3>
                          
                          {isLoadingBooked ? (
                            <div className="py-6 flex justify-center">
                              <Loader2 className="w-5 h-5 text-[#B8A068] animate-spin" />
                            </div>
                          ) : allSlots.length === 0 ? (
                            <div className="py-6 text-center text-gray-400 bg-gray-50 rounded border border-dashed border-gray-200">
                              <p className="text-xs">Não há horários livres para esta data.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-4 gap-2">
                              {allSlots.map(({ time, isBooked }) => (
                                <button
                                  key={time}
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => setSelectedTime(time)}
                                  className={`py-2 rounded text-xs font-semibold border text-center transition-all ${
                                    isBooked
                                      ? 'bg-gray-50 border-gray-100 text-gray-300 line-through cursor-not-allowed'
                                      : selectedTime === time
                                        ? 'bg-[#B8A068] border-[#B8A068] text-white shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#B8A068] hover:bg-gray-50'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Column: Reservation Form */}
                <div className="booking-card p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="booking-heading font-medium text-lg text-[#1A2B4A]">Seus Dados</h3>
                    <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Dr. Hallison Matheus • OAB/GO</span>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Nome Completo *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full booking-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">E-mail *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full booking-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Telefone / WhatsApp *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="tel"
                          placeholder="(62) 99999-9999"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className="w-full booking-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Modality & Client Type */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Modalidade *</label>
                        <select
                          value={formData.modality}
                          onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                          className="w-full booking-input !pl-3"
                        >
                          <option value="Online">Online (Vídeo)</option>
                          <option value="Presencial">Presencial (Sede)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tipo de Cliente *</label>
                        <select
                          value={formData.client_type}
                          onChange={(e) => setFormData({ ...formData, client_type: e.target.value })}
                          className="w-full booking-input !pl-3"
                        >
                          <option value="PF">Pessoa Física (PF)</option>
                          <option value="CNPJ">Empresa (CNPJ)</option>
                        </select>
                      </div>
                    </div>

                    {/* Area & Has Lawyer */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Área da Consulta *</label>
                        <select
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          className="w-full booking-input !pl-3"
                          required
                        >
                          <option value="" disabled>Selecione...</option>
                          {AREA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Já possui advogado? *</label>
                        <select
                          value={formData.has_lawyer ? 'sim' : 'nao'}
                          onChange={(e) => setFormData({ ...formData, has_lawyer: e.target.value === 'sim' })}
                          className="w-full booking-input !pl-3"
                        >
                          <option value="nao">Não</option>
                          <option value="sim">Sim</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Breve relato sobre o tema</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        <textarea
                          rows={3}
                          placeholder="Descreva brevemente o que precisa..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full booking-input resize-none"
                        />
                      </div>
                    </div>

                    {/* Summary details before submission */}
                    {selectedDate && selectedTime && (
                      <div className="bg-[#1A2B4A]/5 border border-[#1A2B4A]/10 rounded p-4 text-[12px] text-[#1A2B4A] space-y-2 shadow-inner">
                        <div className="flex justify-between items-center border-b border-[#1A2B4A]/10 pb-2">
                          <span className="font-semibold uppercase tracking-widest text-[9px]">Resumo do Agendamento</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 mt-2 text-gray-600 text-xs">
                          <p><strong className="text-gray-800">Data:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
                          <p><strong className="text-gray-800">Horário:</strong> {selectedTime}</p>
                          <p><strong className="text-gray-800">Modalidade:</strong> {formData.modality}</p>
                          <p className="truncate"><strong className="text-gray-800">Área:</strong> {formData.area || '-'}</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1A2B4A]/10 flex justify-between items-center">
                          <span className="font-semibold text-xs text-gray-800">Valor da Consulta:</span>
                          <span className={`font-bold ${calculatedFee === 'Gratuita' ? 'text-emerald-600' : 'text-[#B8A068]'}`}>{calculatedFee}</span>
                        </div>
                      </div>
                    )}

                    {/* Warning about payment if fee is 300 */}
                    {selectedDate && selectedTime && calculatedFee !== 'Gratuita' && calculatedFee !== 'A combinar' && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] p-3 rounded mt-4">
                        <strong>Aviso Importante:</strong> A consulta somente será confirmada e realizada após o envio do comprovante de pagamento da taxa de {calculatedFee}. Nossa equipe entrará em contato com as instruções.
                      </div>
                    )}
                    {selectedDate && selectedTime && calculatedFee === 'A combinar' && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] p-3 rounded mt-4">
                        <strong>Aviso Importante:</strong> Consultorias presenciais possuem o valor a combinar dependendo do local de atendimento. Entraremos em contato com a proposta antes de confirmar a agenda.
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={bookMutation.isPending || !selectedDate || !selectedTime}
                      className="w-full py-3.5 booking-btn-primary disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm"
                    >
                      {bookMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                      ) : (
                        'Confirmar Agendamento'
                      )}
                    </button>
                  </form>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="booking-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center booking-card p-8 space-y-6 bg-white"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="booking-heading text-2xl font-normal text-gray-900">Agendamento Solicitado!</h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed font-light">
                  Sua consulta jurídica foi pré-agendada com sucesso. Nossa equipe entrará em contato em breve para confirmar os detalhes.
                </p>
              </div>

              {/* Booking Voucher card */}
              <div className="bg-gray-50 border border-gray-200 rounded p-5 text-left text-xs space-y-3.5 max-w-md mx-auto shadow-inner">
                <div className="border-b border-gray-200 pb-2.5">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Cliente</span>
                  <p className="font-bold text-gray-800 text-sm">{submittedAppt.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Data</span>
                    <p className="font-semibold text-gray-700">{new Date(submittedAppt.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Horário</span>
                    <p className="font-semibold text-gray-700">{submittedAppt.time.substring(0, 5)}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-gray-100 flex items-center gap-1.5 text-[10px] text-gray-400">
                  <Shield className="w-3.5 h-3.5 text-[#B8A068] flex-shrink-0" />
                  <span>Dados sigilosos e protegidos pela LGPD.</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3.5 booking-btn-primary"
                >
                  Voltar para o Início
                </button>
                <button
                  onClick={() => {
                    setSubmittedAppt(null);
                    setFormData({ name: '', email: '', phone: '', client_type: 'PF', area: '', has_lawyer: false, modality: 'Online', message: '' });
                    setSelectedDate(null);
                    setSelectedTime(null);
                  }}
                  className="w-full py-3.5 booking-btn-ghost"
                >
                  Agendar Outra Consulta
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer config={config} />
    </div>
  );
}
