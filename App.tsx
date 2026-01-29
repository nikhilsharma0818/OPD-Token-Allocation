import React, { useState } from 'react';
import { 
  Doctor, 
  PatientType, 
  TokenStatus
} from './types';
import { TokenEngine } from './services/engine';
import Documentation from './components/Documentation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Arnab',
    specialty: 'General Physician',
    slots: [
      { id: 'd1-s1', startTime: '09:00', endTime: '10:00', capacity: 5, tokens: [] },
      { id: 'd1-s2', startTime: '10:00', endTime: '11:00', capacity: 5, tokens: [] },
      { id: 'd1-s3', startTime: '11:00', endTime: '12:00', capacity: 5, tokens: [] },
    ]
  },
  {
    id: 'd2',
    name: 'Dr. Priya',
    specialty: "Kid's Specialist",
    slots: [
      { id: 'd2-s1', startTime: '09:00', endTime: '10:00', capacity: 4, tokens: [] },
      { id: 'd2-s2', startTime: '10:00', endTime: '11:00', capacity: 4, tokens: [] },
      { id: 'd2-s3', startTime: '11:00', endTime: '12:00', capacity: 4, tokens: [] },
    ]
  },
  {
    id: 'd3',
    name: 'Dr. Rahul',
    specialty: 'Bone Specialist',
    slots: [
      { id: 'd3-s1', startTime: '09:00', endTime: '10:00', capacity: 6, tokens: [] },
      { id: 'd3-s2', startTime: '10:00', endTime: '11:00', capacity: 6, tokens: [] },
      { id: 'd3-s3', startTime: '11:00', endTime: '12:00', capacity: 6, tokens: [] },
    ]
  }
];

const App: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'docs'>('dashboard');
  const [formData, setFormData] = useState({
    doctorId: 'd1',
    slotId: 'd1-s1',
    patientName: '',
    type: PatientType.WALK_IN
  });

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName) return;

    const doctor = doctors.find(d => d.id === formData.doctorId);
    if (!doctor) return;

    const result = TokenEngine.allocateToken(
      doctor, 
      formData.slotId, 
      formData.patientName, 
      formData.type
    );

    if (result.error) {
      alert(result.error);
      return;
    }

    setDoctors(prev => prev.map(d => d.id === result.updatedDoctor.id ? result.updatedDoctor : d));
    setFormData(prev => ({ ...prev, patientName: '' }));
  };

  const handleCancel = (doctorId: string, tokenId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    const updatedDoctor = TokenEngine.cancelToken(doctor, tokenId);
    setDoctors(prev => prev.map(d => d.id === doctorId ? updatedDoctor : d));
  };

  const getStatsData = () => {
    return doctors.map(d => {
      const totalTokens = d.slots.reduce((acc, s) => acc + s.tokens.filter(t => t.status !== TokenStatus.CANCELLED).length, 0);
      const capacity = d.slots.reduce((acc, s) => acc + s.capacity, 0);
      return {
        name: d.name,
        booked: totalTokens,
        capacity: capacity
      };
    });
  };

  const getPriorityColor = (type: PatientType) => {
    switch (type) {
      case PatientType.EMERGENCY: return 'bg-red-100 text-red-700 border-red-200';
      case PatientType.PAID_PRIORITY: return 'bg-amber-100 text-amber-700 border-amber-200';
      case PatientType.FOLLOW_UP: return 'bg-blue-100 text-blue-700 border-blue-200';
      case PatientType.ONLINE: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              OPD
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Token Manager</h1>
            </div>
          </div>
          <nav className="flex gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${activeTab === 'docs' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              Docs
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {activeTab === 'docs' ? (
          <Documentation />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold mb-4">Book Appointment</h2>
                <form onSubmit={handleAllocate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Doctor</label>
                    <select 
                      value={formData.doctorId}
                      onChange={(e) => {
                        const docId = e.target.value;
                        const doc = doctors.find(d => d.id === docId);
                        setFormData({ ...formData, doctorId: docId, slotId: doc?.slots[0].id || '' });
                      }}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    >
                      {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Slot</label>
                    <select 
                      value={formData.slotId}
                      onChange={(e) => setFormData({ ...formData, slotId: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    >
                      {doctors.find(d => d.id === formData.doctorId)?.slots.map(s => (
                        <option key={s.id} value={s.id}>{s.startTime} - {s.endTime}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Patient Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Amit Kumar"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as PatientType })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    >
                      {Object.values(PatientType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg">
                    Submit
                  </button>
                </form>
              </section>

              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold mb-4">Slot Stats</h2>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getStatsData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="booked" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {doctors.map(doctor => (
                <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">{doctor.name} - {doctor.specialty}</h3>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {doctor.slots.map(slot => (
                      <div key={slot.id} className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-slate-700 text-xs">
                            {slot.startTime}
                          </h4>
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 space-y-2 min-h-[150px]">
                          {slot.tokens.map((token, tIdx) => (
                            <div 
                              key={token.id} 
                              className={`p-2 rounded border text-xs ${
                                token.status === TokenStatus.CANCELLED 
                                  ? 'bg-slate-200 border-slate-300 opacity-50' 
                                  : 'bg-white border-white shadow-sm'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold">T-{tIdx + 1}</span>
                                <span className={`text-[8px] px-1 rounded ${getPriorityColor(token.patient.type)}`}>
                                  {token.patient.type}
                                </span>
                              </div>
                              <div className="truncate font-medium">{token.patient.name}</div>
                              {token.status === TokenStatus.BOOKED && (
                                <button 
                                  onClick={() => handleCancel(doctor.id, token.id)}
                                  className="text-[8px] text-rose-500 font-bold mt-1 uppercase"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;