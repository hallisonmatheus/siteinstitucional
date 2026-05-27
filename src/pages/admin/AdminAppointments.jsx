import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Search, Calendar as CalendarIcon, Clock, Filter, Eye, Trash2, 
  Check, X, User, Mail, Phone, FileText
} from 'lucide-react';

export default function AdminAppointments() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all'); // 'all', 'today', 'week', 'month'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Pendente', 'Confirmado', 'Concluído', 'Cancelado'
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['adminAppointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  // Mutate Status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['adminAppointments'] });
      toast.success(`Agendamento marcado como ${data.status}!`);
      // Update selected detail view in real time
      if (selectedAppt && selectedAppt.id === data.id) {
        setSelectedAppt(data);
      }
    },
    onError: (err) => {
      toast.error('Erro ao atualizar status: ' + err.message);
    }
  });

  // Mutate Reschedule
  const rescheduleMutation = useMutation({
    mutationFn: async ({ id, date, time }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ date, time })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['adminAppointments'] });
      toast.success('Agendamento reagendado com sucesso!');
      setIsEditingTime(false);
      if (selectedAppt && selectedAppt.id === data.id) {
        setSelectedAppt(data);
      }
    },
    onError: (err) => {
      toast.error('Erro ao reagendar: ' + err.message);
    }
  });

  // Delete Appointment
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminAppointments'] });
      toast.success('Agendamento excluído.');
      setSelectedAppt(null);
    },
    onError: (err) => {
      toast.error('Erro ao excluir: ' + err.message);
    }
  });

  // Filters calculation
  const getFilteredAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    return appointments.filter((appt) => {
      // 1. Text Search
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        appt.name.toLowerCase().includes(searchLower) ||
        appt.email.toLowerCase().includes(searchLower) ||
        appt.phone.includes(searchLower);

      if (!matchesSearch) return false;

      // 2. Status Filter
      if (filterStatus !== 'all' && appt.status !== filterStatus) return false;

      // 3. Period Filter
      if (filterPeriod === 'all') return true;

      const apptDate = new Date(appt.date + 'T00:00:00');

      if (filterPeriod === 'today') {
        return apptDate.toDateString() === today.toDateString();
      }

      if (filterPeriod === 'week') {
        return apptDate >= startOfWeek && apptDate <= endOfWeek;
      }

      if (filterPeriod === 'month') {
        return apptDate >= startOfMonth && apptDate <= endOfMonth;
      }

      return true;
    });
  };

  const filteredAppts = getFilteredAppointments();

  const handleOpenReschedule = (appt) => {
    setEditDate(appt.date);
    setEditTime(appt.time.substring(0, 5));
    setIsEditingTime(true);
  };

  const handleSaveReschedule = () => {
    if (!editDate || !editTime) {
      toast.error('Selecione data e hora válidas.');
      return;
    }
    rescheduleMutation.mutate({ 
      id: selectedAppt.id, 
      date: editDate, 
      time: `${editTime}:00` 
    });
  };

  const getStatusBadge = (status) => {
    const classes = {
      Pendente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Confirmado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Concluído: 'bg-slate-100 text-slate-700 border-slate-200',
      Cancelado: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${classes[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="px-8 py-6 border-b border-gray-200 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agendamentos de Consultas</h1>
          <p className="text-gray-500 text-sm mt-1">Veja e gerencie os agendamentos realizados pelos clientes.</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Filters and Search Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 bg-gray-50/50"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Period Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#B8A068]/50 bg-white"
              >
                <option value="all">Qualquer período</option>
                <option value="today">Hoje</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#B8A068]/50 bg-white"
            >
              <option value="all">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* List of Appointments */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white h-20 rounded-xl border border-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : filteredAppts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl py-20 text-center text-gray-400">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Nenhum agendamento encontrado para o filtro selecionado.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Data/Horário</th>
                    <th className="px-6 py-4">Contato</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredAppts.map((appt) => {
                    const apptDate = new Date(appt.date + 'T00:00:00');
                    const formattedDate = apptDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const formattedTime = appt.time.substring(0, 5);

                    return (
                      <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900 leading-none">{appt.name}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">{appt.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span>{formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formattedTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-700 text-xs font-mono">{appt.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(appt.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedAppt(appt)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-[#1a2b4a] text-gray-700 hover:text-white rounded-lg text-xs font-medium transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-950 font-serif text-lg">Detalhes do Agendamento</h2>
                <p className="text-xs text-gray-400 mt-0.5">Criado em {new Date(selectedAppt.created_at).toLocaleString('pt-BR')}</p>
              </div>
              <button 
                onClick={() => { setSelectedAppt(null); setIsEditingTime(false); }} 
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Client Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 border border-gray-200/50 rounded-xl p-5">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider"><User className="w-3 h-3" /> Nome completo</span>
                  <p className="text-sm font-semibold text-gray-900">{selectedAppt.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider"><Mail className="w-3 h-3" /> E-mail</span>
                  <p className="text-sm font-semibold text-gray-900 break-all">{selectedAppt.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider"><Phone className="w-3 h-3" /> Telefone/WhatsApp</span>
                  <p className="text-sm font-semibold text-gray-900 font-mono">{selectedAppt.phone}</p>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Data e Horário</span>
                    {!isEditingTime ? (
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                          <CalendarIcon className="w-4 h-4 text-[#B8A068]" />
                          {new Date(selectedAppt.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#B8A068]" />
                          {selectedAppt.time.substring(0, 5)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50"
                        />
                        <input
                          type="time"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50"
                        />
                        <button
                          onClick={handleSaveReschedule}
                          className="p-1.5 bg-[#1a2b4a] hover:bg-[#253965] text-white rounded-lg transition-colors"
                          title="Confirmar"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setIsEditingTime(false)}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingTime && selectedAppt.status !== 'Cancelado' && (
                    <button
                      onClick={() => handleOpenReschedule(selectedAppt)}
                      className="px-3 py-1.5 border border-[#B8A068]/30 hover:border-[#B8A068] hover:bg-[#B8A068]/5 text-[#B8A068] rounded-lg text-xs font-semibold transition-all"
                    >
                      Reagendar
                    </button>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider"><FileText className="w-3 h-3" /> Descrição/Mensagem</span>
                <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-4 min-h-[80px] text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedAppt.message || <span className="text-gray-400 italic">Nenhuma mensagem enviada.</span>}
                </div>
              </div>

              {/* Status Update */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-100 pt-6 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Atual:</span>
                  {getStatusBadge(selectedAppt.status)}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedAppt.status !== 'Confirmado' && selectedAppt.status !== 'Concluído' && selectedAppt.status !== 'Cancelado' && (
                    <button
                      onClick={() => statusMutation.mutate({ id: selectedAppt.id, status: 'Confirmado' })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Confirmar
                    </button>
                  )}

                  {selectedAppt.status === 'Confirmado' && (
                    <button
                      onClick={() => statusMutation.mutate({ id: selectedAppt.id, status: 'Concluído' })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Concluir
                    </button>
                  )}

                  {selectedAppt.status !== 'Cancelado' && selectedAppt.status !== 'Concluído' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
                          statusMutation.mutate({ id: selectedAppt.id, status: 'Cancelado' });
                        }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-rose-50 border border-amber-200 hover:border-rose-200 text-amber-700 hover:text-rose-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancelar Consulta
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm('Cuidado! Deseja realmente EXCLUIR permanentemente este agendamento do banco de dados? Esta ação não pode ser desfeita.')) {
                        deleteMutation.mutate(selectedAppt.id);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors ml-auto sm:ml-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
