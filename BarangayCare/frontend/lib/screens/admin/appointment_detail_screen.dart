import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../services/prescription_management_service.dart';
import 'package:intl/intl.dart';

class AppointmentDetailScreen extends StatefulWidget {
  final Map<String, dynamic> appointment;

  const AppointmentDetailScreen({super.key, required this.appointment});

  @override
  State<AppointmentDetailScreen> createState() => _AppointmentDetailScreenState();
}

class _AppointmentDetailScreenState extends State<AppointmentDetailScreen> {
  final _notesController = TextEditingController();
  final _rejectionReasonController = TextEditingController();
  bool _processing = false;

  @override
  void dispose() {
    _notesController.dispose();
    _rejectionReasonController.dispose();
    super.dispose();
  }

  Future<void> _approveAppointment() async {
    setState(() => _processing = true);

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      await ApiService.approveAppointment(
        token,
        widget.appointment['_id'],
        notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Appointment approved successfully'),
          backgroundColor: Colors.green,
        ),
      );

      Navigator.of(context).pop(true); // Return true to indicate update
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _processing = false);
      }
    }
  }

  Future<void> _rejectAppointment() async {
    final reason = _rejectionReasonController.text.trim();

    if (reason.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please provide a reason for rejection'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    setState(() => _processing = true);

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      await ApiService.rejectAppointment(
        token,
        widget.appointment['_id'],
        reason: reason,
        notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Appointment rejected'),
          backgroundColor: Colors.orange,
        ),
      );

      Navigator.of(context).pop(true); // Return true to indicate update
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _processing = false);
      }
    }
  }

  void _showRejectDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reject Appointment'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Please provide a reason for rejecting this appointment:'),
            const SizedBox(height: 16),
            TextField(
              controller: _rejectionReasonController,
              decoration: const InputDecoration(
                labelText: 'Rejection Reason *',
                border: OutlineInputBorder(),
                hintText: 'e.g., Doctor unavailable, scheduling conflict',
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _rejectAppointment();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Reject'),
          ),
        ],
      ),
    );
  }

  Future<void> _completeAppointment() async {
    setState(() => _processing = true);

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      await ApiService.completeAppointment(
        token,
        widget.appointment['_id'],
        notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      );

      if (!mounted) return;

      // Ask if admin wants to create prescription
      final createPrescription = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Appointment Completed'),
          content: const Text('Would you like to create a prescription for this patient?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Not Now'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Create Prescription'),
            ),
          ],
        ),
      );

      if (!mounted) return;

      if (createPrescription == true) {
        // Navigate to prescription creation screen
        await _showCreatePrescriptionDialog();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Appointment marked as completed'),
            backgroundColor: Colors.blue,
          ),
        );
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _processing = false);
      }
    }
  }

  Future<void> _showCreatePrescriptionDialog() async {
    final prescriptionService = PrescriptionService();
    final diagnosisController = TextEditingController();
    final notesController = TextEditingController();
    int validDays = 30;
    List<Map<String, dynamic>> prescribedMedicines = [];

    // Fetch available medicines
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final token = await authProvider.user?.getIdToken();
    
    if (token == null) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Not authenticated'), backgroundColor: Colors.red),
      );
      return;
    }

    List<Map<String, dynamic>> availableMedicines = [];
    try {
      final medicinesData = await ApiService.getMedicines(token: token);
      availableMedicines = List<Map<String, dynamic>>.from(medicinesData);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load medicines: $e'), backgroundColor: Colors.red),
      );
      return;
    }

    if (!mounted) return;

    await showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Create Prescription'),
          content: SingleChildScrollView(
            child: SizedBox(
              width: double.maxFinite,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Diagnosis field
                  TextField(
                    controller: diagnosisController,
                    decoration: const InputDecoration(
                      labelText: 'Diagnosis *',
                      border: OutlineInputBorder(),
                      hintText: 'e.g., Common Cold, Hypertension',
                    ),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 16),

                  // Notes field
                  TextField(
                    controller: notesController,
                    decoration: const InputDecoration(
                      labelText: 'Doctor Notes',
                      border: OutlineInputBorder(),
                      hintText: 'Additional instructions or observations',
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 16),

                  // Valid days dropdown
                  DropdownButtonFormField<int>(
                    value: validDays,
                    decoration: const InputDecoration(
                      labelText: 'Prescription Validity',
                      border: OutlineInputBorder(),
                    ),
                    items: [7, 14, 30, 60, 90].map((days) {
                      return DropdownMenuItem(
                        value: days,
                        child: Text('$days days'),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setDialogState(() {
                        validDays = value ?? 30;
                      });
                    },
                  ),
                  const SizedBox(height: 16),

                  // Medicines section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Prescribed Medicines',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add_circle, color: Colors.blue),
                        onPressed: () {
                          setDialogState(() {
                            prescribedMedicines.add({
                              'medicine_id': '',
                              'medicine_name': '',
                              'dosage': '',
                              'quantity': 1,
                              'instructions': 'Take as directed',
                              'frequency': '',
                            });
                          });
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Medicine list
                  if (prescribedMedicines.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 16),
                      child: Center(
                        child: Text('No medicines added yet. Click + to add.'),
                      ),
                    ),

                  ...prescribedMedicines.asMap().entries.map((entry) {
                    final index = entry.key;
                    final medicine = entry.value;
                    
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Medicine ${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                IconButton(
                                  icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                                  onPressed: () {
                                    setDialogState(() {
                                      prescribedMedicines.removeAt(index);
                                    });
                                  },
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            DropdownButtonFormField<String>(
                              value: medicine['medicine_id']?.isEmpty ?? true ? null : medicine['medicine_id'],
                              decoration: const InputDecoration(
                                labelText: 'Select Medicine',
                                border: OutlineInputBorder(),
                                isDense: true,
                              ),
                              items: availableMedicines.map((med) {
                                return DropdownMenuItem<String>(
                                  value: med['_id'].toString(),
                                  child: Text(med['med_name']),
                                );
                              }).toList(),
                              onChanged: (value) {
                                setDialogState(() {
                                  final selectedMed = availableMedicines.firstWhere(
                                    (m) => m['_id'].toString() == value,
                                  );
                                  prescribedMedicines[index]['medicine_id'] = value;
                                  prescribedMedicines[index]['medicine_name'] = selectedMed['med_name'];
                                });
                              },
                            ),
                            const SizedBox(height: 8),
                            TextField(
                              decoration: const InputDecoration(
                                labelText: 'Dosage (e.g., 500mg, 10ml)',
                                border: OutlineInputBorder(),
                                isDense: true,
                              ),
                              onChanged: (value) {
                                prescribedMedicines[index]['dosage'] = value;
                              },
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: TextField(
                                    decoration: const InputDecoration(
                                      labelText: 'Quantity',
                                      border: OutlineInputBorder(),
                                      isDense: true,
                                    ),
                                    keyboardType: TextInputType.number,
                                    onChanged: (value) {
                                      prescribedMedicines[index]['quantity'] = int.tryParse(value) ?? 1;
                                    },
                                    controller: TextEditingController(text: '1'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: TextField(
                                    decoration: const InputDecoration(
                                      labelText: 'Frequency',
                                      border: OutlineInputBorder(),
                                      isDense: true,
                                      hintText: '2x daily',
                                    ),
                                    onChanged: (value) {
                                      prescribedMedicines[index]['frequency'] = value;
                                    },
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            TextField(
                              decoration: const InputDecoration(
                                labelText: 'Instructions',
                                border: OutlineInputBorder(),
                                isDense: true,
                              ),
                              onChanged: (value) {
                                prescribedMedicines[index]['instructions'] = value;
                              },
                              controller: TextEditingController(text: 'Take as directed'),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: prescribedMedicines.isEmpty || diagnosisController.text.trim().isEmpty
                  ? null
                  : () async {
                      // Create prescription
                      try {
                        await prescriptionService.createPrescription(
                          appointmentId: widget.appointment['_id'],
                          patientId: widget.appointment['patient_id'],
                          medicines: prescribedMedicines,
                          diagnosis: diagnosisController.text.trim(),
                          notes: notesController.text.trim(),
                          validDays: validDays,
                        );

                        if (!context.mounted) return;

                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Prescription created successfully!'),
                            backgroundColor: Colors.green,
                          ),
                        );
                        Navigator.of(context).pop(true);
                      } catch (e) {
                        if (!context.mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Error creating prescription: $e'),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    },
              child: const Text('Create Prescription'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appointment = widget.appointment;
    final status = appointment['status'] as String;
    final isPending = status.toLowerCase() == 'pending';
    final isApproved = status.toLowerCase() == 'approved';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Appointment Details'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status badge
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                decoration: BoxDecoration(
                  color: _getStatusColor(status).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: _getStatusColor(status), width: 2),
                ),
                child: Text(
                  status.toUpperCase(),
                  style: TextStyle(
                    color: _getStatusColor(status),
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Patient Information
            _buildSectionTitle('Patient Information'),
            _buildInfoCard([
              _buildInfoRow(Icons.person, 'Name', appointment['patient_name'] ?? 'Unknown'),
              if (appointment['patient_contact'] != null)
                _buildInfoRow(Icons.phone, 'Contact', appointment['patient_contact']),
            ]),
            const SizedBox(height: 16),

            // Doctor Information
            _buildSectionTitle('Doctor Information'),
            _buildInfoCard([
              _buildInfoRow(Icons.medical_services, 'Doctor', 'Dr. ${appointment['doctor_name'] ?? 'Unknown'}'),
              if (appointment['doctor_specialization'] != null)
                _buildInfoRow(Icons.local_hospital, 'Specialization', appointment['doctor_specialization']),
            ]),
            const SizedBox(height: 16),

            // Appointment Details
            _buildSectionTitle('Appointment Details'),
            _buildInfoCard([
              _buildInfoRow(Icons.calendar_today, 'Date', _formatDate(appointment['date'])),
              _buildInfoRow(Icons.access_time, 'Time', appointment['time'] ?? 'Not specified'),
            ]),
            const SizedBox(height: 16),

            // Pre-screening (if available)
            if (appointment['pre_screening'] != null && appointment['pre_screening'].isNotEmpty) ...[
              _buildSectionTitle('Pre-Screening Information'),
              _buildInfoCard([
                ...appointment['pre_screening'].entries.map((entry) => 
                  _buildInfoRow(Icons.info_outline, entry.key.toString(), entry.value.toString())
                ),
              ]),
              const SizedBox(height: 16),
            ],

            // Admin notes field (for pending appointments)
            if (isPending) ...[
              _buildSectionTitle('Admin Notes (Optional)'),
              TextField(
                controller: _notesController,
                decoration: const InputDecoration(
                  hintText: 'Add any notes or comments for this appointment...',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 24),
            ],

            // Existing notes/rejection reason
            if (appointment['admin_notes'] != null && appointment['admin_notes'].toString().isNotEmpty) ...[
              _buildSectionTitle('Admin Notes'),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(appointment['admin_notes']),
                ),
              ),
              const SizedBox(height: 16),
            ],

            if (appointment['rejection_reason'] != null) ...[
              _buildSectionTitle('Rejection Reason'),
              Card(
                color: Colors.red.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    appointment['rejection_reason'],
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Action buttons (only for pending appointments)
            if (isPending && !_processing) ...[
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _showRejectDialog,
                      icon: const Icon(Icons.cancel),
                      label: const Text('Reject'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _approveAppointment,
                      icon: const Icon(Icons.check_circle),
                      label: const Text('Approve'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ],

            // Complete button for approved appointments
            if (isApproved && !_processing) ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _completeAppointment,
                  icon: const Icon(Icons.done_all),
                  label: const Text('Mark as Completed'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
            ],

            if (_processing)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: CircularProgressIndicator(),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildInfoCard(List<Widget> children) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: children,
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Colors.teal),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'approved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      case 'completed':
        return Colors.blue;
      case 'cancelled':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(String? date) {
    if (date == null) return 'Not specified';
    try {
      final dateTime = DateTime.parse(date);
      return DateFormat('EEEE, MMMM dd, yyyy').format(dateTime);
    } catch (e) {
      return date;
    }
  }
}
