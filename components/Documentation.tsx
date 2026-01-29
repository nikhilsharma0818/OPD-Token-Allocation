import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">OPD Engine Documentation</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-indigo-600">1. Prioritization Logic</h2>
        <p className="text-slate-600 mb-4">
          The system uses a priority queue. Each patient gets a priority score based on their category:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-600">
          <li><strong>Emergency (0):</strong> Highest priority. Can bypass capacity limits.</li>
          <li><strong>Paid Priority (1):</strong> High priority for premium bookings.</li>
          <li><strong>Follow-up (2):</strong> Returning patients.</li>
          <li><strong>Online (3):</strong> Standard internet bookings.</li>
          <li><strong>Walk-in (4):</strong> Desk arrivals (Lowest Priority).</li>
        </ul>
        <p className="mt-4 text-sm bg-indigo-50 p-3 border-l-4 border-indigo-400">
          If priority levels are the same, the system uses First-Come-First-Served based on booking time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-indigo-600">2. Case Handling</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-bold mb-1">Cancellations</h3>
            <p className="text-sm text-slate-600">Marked as CANCELLED. Sorting ignores these and shifts other patients up.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-bold mb-1">No-Shows</h3>
            <p className="text-sm text-slate-600">Marked as NO_SHOW to move to the next patient in queue.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-bold mb-1">Emergency</h3>
            <p className="text-sm text-slate-600">Added to current slot immediately regardless of capacity.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-bold mb-1">Limits</h3>
            <p className="text-sm text-slate-600">Hard limits prevent overbooking standard slots.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-indigo-600">3. API Design</h2>
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`POST /api/tokens/allocate
{
  "doctorId": "doc1",
  "slotId": "slot1",
  "patientName": "Name",
  "type": "EMERGENCY"
}

DELETE /api/tokens/:id

GET /api/doctors/:id/schedule`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-indigo-600">4. Error Handling</h2>
        <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm">
          <li>Checks for slot availability before allocation.</li>
          <li>Prevents invalid token states.</li>
          <li>Ensures doctor data consistency using state copies.</li>
        </ul>
      </section>
    </div>
  );
};

export default Documentation;