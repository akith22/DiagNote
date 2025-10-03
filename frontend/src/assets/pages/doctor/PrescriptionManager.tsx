import React, { useState, useEffect } from 'react';
import { 
  FiFileText, FiEdit, FiPlus, FiSearch, FiUser, FiCalendar, FiClock,
  FiCheck, FiX, FiAlertCircle, FiRefreshCw
} from 'react-icons/fi';
import { prescriptionService, type PrescriptionDto } from '../../../services/PrescriptionService';

interface PrescriptionManagerProps {
  activeAppointment?: {
    id: number;
    patientId: number;
    patientName: string;
  } | null;
  onPrescriptionComplete?: () => void;
}

const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({ 
  activeAppointment, 
  onPrescriptionComplete 
}) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    notesJson: '',
    appointmentId: activeAppointment?.id || 0
  });

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => {
    if (activeAppointment) {
      setShowForm(true);
      setFormData(prev => ({
        ...prev,
        appointmentId: activeAppointment.id
      }));
      fetchPrescriptions(activeAppointment.id);
    } else {
      setShowForm(false);
      setPrescriptions([]);
    }
  }, [activeAppointment]);

  const fetchPrescriptions = async (appointmentId: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await prescriptionService.getByAppointment(appointmentId);
      setPrescriptions(data || []);
    } catch (err: any) {
      console.error('Fetch prescriptions error:', err);
      setError(err.response?.data || err.message || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.notesJson.trim()) {
      setError('Prescription details are required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await prescriptionService.createPrescription(formData.appointmentId, { notesJson: formData.notesJson });
      setSuccess('Prescription created successfully!');
      setFormData({ notesJson: '', appointmentId: formData.appointmentId });
      setShowForm(false);
      if (activeAppointment) fetchPrescriptions(activeAppointment.id);
      if (onPrescriptionComplete) onPrescriptionComplete();
    } catch (err: any) {
      console.error('Create prescription error:', err);
      setError(err.response?.data || err.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrescription) return;
    if (!formData.notesJson.trim()) {
      setError('Prescription details are required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await prescriptionService.updatePrescription(editingPrescription.id!, { notesJson: formData.notesJson });
      setSuccess('Prescription updated successfully!');
      setEditingPrescription(null);
      setFormData({ notesJson: '', appointmentId: formData.appointmentId });
      setShowForm(false);
      if (activeAppointment) fetchPrescriptions(activeAppointment.id);
    } catch (err: any) {
      console.error('Update prescription error:', err);
      setError(err.response?.data || err.message || 'Failed to update prescription');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (prescription: PrescriptionDto) => {
    setEditingPrescription(prescription);
    setFormData({ notesJson: prescription.notesJson || '', appointmentId: prescription.appointmentId });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingPrescription(null);
    setFormData({ notesJson: '', appointmentId: formData.appointmentId });
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const refreshPrescriptions = () => {
    if (activeAppointment) fetchPrescriptions(activeAppointment.id);
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.notesJson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 md:p-8">
      <header className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiFileText className="mr-3 text-blue-600" />
              Prescription Management
            </h1>
            <p className="text-gray-600 mt-1">Create and manage patient prescriptions</p>
          </div>
          <div className="flex items-center gap-3">
            {activeAppointment && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center py-2.5 px-5 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-all duration-300"
              >
                <FiPlus className="mr-2" /> New Prescription
              </button>
            )}
            <button
              onClick={refreshPrescriptions}
              disabled={loading}
              className="flex items-center py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {activeAppointment && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-blue-700">
              <div className="flex items-center"><FiUser className="mr-2" /><strong>Patient:</strong> {activeAppointment.patientName}</div>
              <div className="flex items-center"><FiCalendar className="mr-2" /><strong>Appointment ID:</strong> {activeAppointment.id}</div>
              <div className="flex items-center"><FiClock className="mr-2" /><strong>Patient ID:</strong> {activeAppointment.patientId}</div>
            </div>
          </div>
        )}
      </header>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
            <span className="ml-3 text-sm text-red-700">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FiCheck className="h-5 w-5 text-green-500" />
            <span className="ml-3 text-sm text-green-700">{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{editingPrescription ? 'Edit Prescription' : 'Create New Prescription'}</h2>
            <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700"><FiX size={24} /></button>
          </div>

          <form onSubmit={editingPrescription ? handleUpdatePrescription : handleCreatePrescription}>
            <div className="space-y-4">
              <textarea
                value={formData.notesJson}
                onChange={(e) => setFormData({ ...formData, notesJson: e.target.value })}
                placeholder="Enter prescription details, medications, dosage, instructions..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={submitting}
              />
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting} className="flex items-center py-2.5 px-6 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? <FiRefreshCw className="mr-2 animate-spin" /> : <FiCheck className="mr-2" />}
                  {editingPrescription ? (submitting ? 'Updating...' : 'Update Prescription') : (submitting ? 'Creating...' : 'Create Prescription')}
                </button>
                <button type="button" onClick={cancelEdit} disabled={submitting} className="flex items-center py-2.5 px-6 bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:bg-gray-200 transition-all duration-300">
                  <FiX className="mr-2" /> Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Prescriptions List */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Previous Prescriptions {prescriptions.length > 0 && `(${prescriptions.length})`}
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading prescriptions...</p>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FiFileText className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-lg font-medium mb-2">No prescriptions found</p>
            {!activeAppointment ? (
              <p className="text-sm">Select an appointment to view prescriptions</p>
            ) : searchTerm ? (
              <p className="text-sm">No prescriptions match your search</p>
            ) : (
              <p className="text-sm">No prescriptions created for this appointment yet</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg">Prescription #{prescription.id}</h4>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center"><FiCalendar className="mr-1" />{new Date(prescription.dateIssued).toLocaleDateString()}</span>
                      {prescription.patientName && <span className="flex items-center"><FiUser className="mr-1" />{prescription.patientName}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(prescription)}
                      className="flex items-center py-1.5 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      <FiEdit className="mr-1" size={14} /> Edit
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{prescription.notesJson}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionManager;
