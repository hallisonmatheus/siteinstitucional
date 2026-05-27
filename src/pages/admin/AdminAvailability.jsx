import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Calendar as CalendarIcon, Clock, Plus, Trash2, Copy, 
  Check, CalendarDays, Loader2
} from 'lucide-react';

const WEEKDAYS = [
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' }
];

export default function AdminAvailability() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('weekly'); // 'weekly' or 'blocked'
  
  // Weekly slots state
  const [selectedWeekday, setSelectedWeekday] = useState(1);
  const [newTime, setNewTime] = useState('09:00');
  const [copyToDays, setCopyToDays] = useState([]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Blocked dates state
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [blockType, setBlockType] = useState('single'); // 'single' | 'range'
  const [endDate, setEndDate] = useState('');
  const [timeBlockType, setTimeBlockType] = useState('all'); // 'all' | 'specific'
  const [selectedTimeBlock, setSelectedTimeBlock] = useState('');

  // 1. Fetch Availability
  const { data: availability = [], isLoading: isLoadingAvail } = useQuery({
    queryKey: ['availability'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('availability')
        .select('*');
      if (error) throw error;
      // Filter out exceptions (only return weekly template where date is null)
      return data.filter(item => !item.date);
    },
    initialData: [],
  });

  // 2. Fetch Blocked Dates
  const { data: blockedDates = [], isLoading: isLoadingBlocked } = useQuery({
    queryKey: ['blocked_dates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  // Mutations
  const addSlotMutation = useMutation({
    mutationFn: async ({ weekday, time }) => {
      const formattedTime = time.length === 5 ? `${time}:00` : time;
      const { data, error } = await supabase
        .from('availability')
        .insert({ weekday, time: formattedTime, active: true })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Horário adicionado com sucesso!');
    },
    onError: (err) => {
      toast.error('Erro ao adicionar horário. Verifique se ele já está cadastrado.');
    }
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Horário removido.');
    },
    onError: (err) => {
      toast.error('Erro ao remover horário.');
    }
  });

  const copySlotsMutation = useMutation({
    mutationFn: async ({ fromWeekday, toWeekdays }) => {
      const sourceSlots = availability.filter(s => s.weekday === fromWeekday);
      if (sourceSlots.length === 0) {
        throw new Error('Nenhum horário cadastrado no dia de origem para copiar.');
      }

      const inserts = [];
      toWeekdays.forEach(day => {
        sourceSlots.forEach(s => {
          const exists = availability.some(existing => existing.weekday === day && existing.time === s.time);
          if (!exists) {
            inserts.push({
              weekday: day,
              time: s.time,
              active: true
            });
          }
        });
      });

      if (inserts.length === 0) return;

      const { error } = await supabase
        .from('availability')
        .insert(inserts);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['availability'] });
      setIsCopyModalOpen(false);
      setCopyToDays([]);
      toast.success('Horários copiados com sucesso!');
    },
    onError: (err) => {
      toast.error('Erro ao copiar horários: ' + err.message);
    }
  });

  const addBlockedDatesMutation = useMutation({
    mutationFn: async (blocksArray) => {
      const { data, error } = await supabase
        .from('blocked_dates')
        .insert(blocksArray)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blocked_dates'] });
      setNewBlockedDate('');
      setEndDate('');
      setSelectedTimeBlock('');
      toast.success('Bloqueio(s) adicionado(s) com sucesso!');
    },
    onError: (err) => {
      toast.error('Erro ao cadastrar bloqueio(s). Verifique se as datas e horários já estão na lista.');
    }
  });

  const deleteBlockedDateMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blocked_dates'] });
      toast.success('Bloqueio removido.');
    },
    onError: (err) => {
      toast.error('Erro ao remover bloqueio.');
    }
  });

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newTime) return;
    addSlotMutation.mutate({ weekday: selectedWeekday, time: newTime });
  };

  const handleCopySlots = () => {
    if (copyToDays.length === 0) {
      toast.error('Selecione pelo menos um dia para destino.');
      return;
    }
    copySlotsMutation.mutate({ fromWeekday: selectedWeekday, toWeekdays: copyToDays });
  };

  const handleAddBlockedDate = (e) => {
    e.preventDefault();
    if (!newBlockedDate) {
      toast.error('Selecione a data de início.');
      return;
    }

    const blocksArray = [];
    const timeValue = timeBlockType === 'specific' && selectedTimeBlock 
      ? `${selectedTimeBlock}:00` 
      : null;

    if (blockType === 'single') {
      blocksArray.push({
        date: newBlockedDate,
        time: timeValue
      });
    } else {
      if (!endDate) {
        toast.error('Selecione a data de término.');
        return;
      }
      if (endDate < newBlockedDate) {
        toast.error('A data de término deve ser posterior à data de início.');
        return;
      }

      // Generate all dates in the range
      let current = new Date(newBlockedDate + 'T00:00:00');
      const last = new Date(endDate + 'T00:00:00');
      while (current <= last) {
        blocksArray.push({
          date: current.toISOString().split('T')[0],
          time: timeValue
        });
        current.setDate(current.getDate() + 1);
      }
    }

    // Filter out already blocked combinations locally
    const existingKeys = blockedDates.map(b => `${b.date}_${b.time || 'all'}`);
    const filteredBlocks = blocksArray.filter(b => !existingKeys.includes(`${b.date}_${b.time || 'all'}`));

    if (filteredBlocks.length === 0) {
      toast.error('Todas as datas e horários selecionados já estão bloqueados.');
      return;
    }

    addBlockedDatesMutation.mutate(filteredBlocks);
  };

  // Helper functions for specific time blocking selection
  const getAvailableSlotsForDate = (dateStr) => {
    if (!dateStr) return [];
    const dateObj = new Date(dateStr + 'T00:00:00');
    const weekday = dateObj.getDay();
    return availability
      .filter(s => s.weekday === weekday)
      .map(s => s.time.substring(0, 5))
      .sort((a, b) => a.localeCompare(b));
  };

  const allUniqueTimes = Array.from(
    new Set(availability.map(s => s.time.substring(0, 5)))
  ).sort((a, b) => a.localeCompare(b));

  const toggleCopyToDay = (dayValue) => {
    setCopyToDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue) 
        : [...prev, dayValue]
    );
  };

  const selectedDayLabel = WEEKDAYS.find(w => w.value === selectedWeekday)?.label;
  const selectedDaySlots = availability
    .filter(s => s.weekday === selectedWeekday)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <AdminLayout>
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Agenda e Disponibilidade</h1>
        <p className="text-gray-500 text-sm mt-1">Defina seus horários de atendimento e configure dias sem expediente.</p>
      </div>

      {/* Tabs Menu */}
      <div className="px-8 bg-white border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`py-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'weekly' 
                ? 'border-[#B8A068] text-[#1a2b4a]' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Horários Semanais Recorrentes
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`py-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'blocked' 
                ? 'border-[#B8A068] text-[#1a2b4a]' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Datas Bloqueadas
          </button>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'weekly' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Weekdays Navigation */}
            <div className="lg:col-span-1 space-y-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Dias de Atendimento</span>
              {WEEKDAYS.map((day) => {
                const count = availability.filter(s => s.weekday === day.value).length;
                return (
                  <button
                    key={day.value}
                    onClick={() => setSelectedWeekday(day.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      selectedWeekday === day.value
                        ? 'border-[#B8A068] bg-[#1a2b4a] text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium text-sm">{day.label}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      selectedWeekday === day.value 
                        ? 'bg-[#B8A068] text-[#1a2b4a]' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count} {count === 1 ? 'horário' : 'horários'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Slots Administration */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 mb-5 gap-3">
                  <div>
                    <h2 className="font-bold text-gray-950 font-serif text-lg">{selectedDayLabel}</h2>
                    <p className="text-gray-400 text-xs mt-0.5">Gerencie os horários de consulta para este dia da semana.</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsCopyModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#B8A068]/30 hover:border-[#B8A068] hover:bg-[#B8A068]/5 text-[#B8A068] rounded-xl text-xs font-semibold transition-all"
                      disabled={selectedDaySlots.length === 0}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copiar horários...
                    </button>
                  </div>
                </div>

                {/* Loading / Empty / Content States */}
                {isLoadingAvail ? (
                  <div className="py-20 flex justify-center">
                    <Loader2 className="w-8 h-8 text-[#B8A068] animate-spin" />
                  </div>
                ) : selectedDaySlots.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Clock className="w-10 h-10 mx-auto mb-2 opacity-25" />
                    <p className="text-sm">Nenhum horário cadastrado para este dia.</p>
                    <p className="text-xs text-gray-400 mt-1">Adicione um horário abaixo para começar.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedDaySlots.map((slot) => {
                      const timeStr = slot.time.substring(0, 5);
                      return (
                        <div 
                          key={slot.id} 
                          className="flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 transition-colors"
                        >
                          <span className="font-semibold">{timeStr}</span>
                          <button
                            onClick={() => {
                              if (window.confirm(`Deseja remover o horário ${timeStr} da ${selectedDayLabel}?`)) {
                                deleteSlotMutation.mutate(slot.id);
                              }
                            }}
                            className="p-1 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-md transition-colors"
                            title="Excluir Horário"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Time Form */}
                <form onSubmit={handleAddSlot} className="border-t border-gray-100 pt-6 mt-8 flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Adicionar Horário</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 bg-gray-50/50 font-semibold"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={addSlotMutation.isPending}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3.5 bg-[#1a2b4a] hover:bg-[#253965] text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                  >
                    {addSlotMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Adicionar
                  </button>
                </form>

              </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Block Date Form */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-950 font-serif text-base mb-1">Bloquear Nova Data</h3>
                <p className="text-gray-400 text-xs mb-5">Escolha se deseja bloquear um único dia, períodos maiores (como férias) ou horários específicos.</p>
                
                <form onSubmit={handleAddBlockedDate} className="space-y-4">
                  {/* Selector of block type: Single or Range */}
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tipo de Intervalo</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBlockType('single')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                          blockType === 'single'
                            ? 'bg-[#1a2b4a] border-[#1a2b4a] text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Dia Único
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlockType('range')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                          blockType === 'range'
                            ? 'bg-[#1a2b4a] border-[#1a2b4a] text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Período / Férias
                      </button>
                    </div>
                  </div>

                  {/* Dates input depending on type */}
                  {blockType === 'single' ? (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Data para Bloqueio</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={newBlockedDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setNewBlockedDate(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 bg-gray-50/50 font-semibold"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Data de Início</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            value={newBlockedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setNewBlockedDate(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 bg-gray-50/50 font-semibold"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Data de Término</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            value={endDate}
                            min={newBlockedDate || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 bg-gray-50/50 font-semibold"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selector of scope: All Day or Specific Time */}
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Abrangência</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTimeBlockType('all')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                          timeBlockType === 'all'
                            ? 'bg-[#1a2b4a] border-[#1a2b4a] text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Dia Inteiro
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeBlockType('specific')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                          timeBlockType === 'specific'
                            ? 'bg-[#1a2b4a] border-[#1a2b4a] text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Horário Específico
                      </button>
                    </div>
                  </div>

                  {/* Dropdown for specific time block */}
                  {timeBlockType === 'specific' && (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Selecionar Horário</label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <select
                          value={selectedTimeBlock}
                          onChange={(e) => setSelectedTimeBlock(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8A068]/50 bg-gray-50/50 font-semibold appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Selecione um horário...</option>
                          {blockType === 'single' && newBlockedDate ? (
                            getAvailableSlotsForDate(newBlockedDate).map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))
                          ) : (
                            allUniqueTimes.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={addBlockedDatesMutation.isPending}
                    className="w-full flex items-center justify-center gap-1.5 px-5 py-3.5 bg-[#1a2b4a] hover:bg-[#253965] text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                  >
                    {addBlockedDatesMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Confirmar Bloqueio
                  </button>
                </form>
              </div>
            </div>

            {/* Blocked Dates List */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-950 font-serif text-base mb-1">Datas e Horários Bloqueados</h3>
                <p className="text-gray-400 text-xs mb-5">Lista de dias ou horários indisponíveis para agendamento.</p>

                {isLoadingBlocked ? (
                  <div className="py-20 flex justify-center">
                    <Loader2 className="w-8 h-8 text-[#B8A068] animate-spin" />
                  </div>
                ) : blockedDates.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-25" />
                    <p className="text-sm">Nenhuma data ou horário bloqueado.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto pr-2">
                    {blockedDates.map((item) => {
                      const blockDate = new Date(item.date + 'T00:00:00');
                      const weekdayName = blockDate.toLocaleDateString('pt-BR', { weekday: 'long' });
                      const formattedDate = blockDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

                      return (
                        <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900 text-sm">{formattedDate}</p>
                              {item.time ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                                  <Clock className="w-2.5 h-2.5" />
                                  {item.time.substring(0, 5)}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] font-semibold border border-slate-200">
                                  Dia Inteiro
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 capitalize mt-0.5">{weekdayName}</p>
                          </div>
                          <button
                            onClick={() => {
                              const detailStr = item.time ? `o horário ${item.time.substring(0, 5)} no dia ${formattedDate}` : `o dia inteiro ${formattedDate}`;
                              if (window.confirm(`Deseja remover o bloqueio para ${detailStr}?`)) {
                                deleteBlockedDateMutation.mutate(item.id);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remover
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Copy Slots Modal */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-950 font-serif text-base">Copiar Horários</h3>
                <p className="text-xs text-gray-400 mt-0.5">Copiar os horários de {selectedDayLabel}</p>
              </div>
              <button 
                onClick={() => { setIsCopyModalOpen(false); setCopyToDays([]); }}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Escolha os dias de destino:</span>
              
              <div className="space-y-2">
                {WEEKDAYS.filter(d => d.value !== selectedWeekday).map((day) => (
                  <label 
                    key={day.value}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      copyToDays.includes(day.value)
                        ? 'border-[#B8A068] bg-[#B8A068]/5 font-semibold text-gray-900'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="text-sm">{day.label}</span>
                    <input
                      type="checkbox"
                      checked={copyToDays.includes(day.value)}
                      onChange={() => toggleCopyToDay(day.value)}
                      className="rounded border-gray-300 text-[#1a2b4a] focus:ring-[#B8A068] w-4.5 h-4.5 cursor-pointer accent-[#1a2b4a]"
                    />
                  </label>
                ))}
              </div>

              {/* Special presets */}
              <div className="flex justify-end gap-2 text-xs pt-1">
                <button
                  onClick={() => {
                    const workingDays = WEEKDAYS.map(w => w.value).filter(val => val !== selectedWeekday && val !== 6);
                    setCopyToDays(workingDays);
                  }}
                  className="text-[#B8A068] hover:underline"
                >
                  Selecionar Seg-Sex
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    const allOthers = WEEKDAYS.map(w => w.value).filter(val => val !== selectedWeekday);
                    setCopyToDays(allOthers);
                  }}
                  className="text-[#B8A068] hover:underline"
                >
                  Selecionar Todos
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={() => { setIsCopyModalOpen(false); setCopyToDays([]); }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCopySlots}
                disabled={copySlotsMutation.isPending || copyToDays.length === 0}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#1a2b4a] hover:bg-[#253965] text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {copySlotsMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Confirmar Cópia
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}
