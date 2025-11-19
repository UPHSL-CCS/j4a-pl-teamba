import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/health_records_service.dart';

/// Consultation History Screen
/// Displays past medical consultations with doctor notes
/// Demonstrates: Control Flow, Data Display, Subprograms
class ConsultationHistoryScreen extends StatefulWidget {
  const ConsultationHistoryScreen({super.key});

  @override
  State<ConsultationHistoryScreen> createState() =>
      _ConsultationHistoryScreenState();
}

class _ConsultationHistoryScreenState extends State<ConsultationHistoryScreen> {
  List<Map<String, dynamic>> _consultations = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadConsultations();
  }

  /// Load consultation history
  /// Subprogram: Data loading function
  Future<void> _loadConsultations() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      final consultations =
          await HealthRecordsService.getConsultationHistory(token);

      setState(() {
        _consultations = consultations;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Consultation History'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _buildBody(),
    );
  }

  /// Build body based on loading state
  /// Control Flow: Different UI based on state
  Widget _buildBody() {
    // Control Flow: Loading state
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Colors.blue),
      );
    }

    // Control Flow: Error state
    if (_errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            const Text(
              'Error loading consultations',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.grey),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadConsultations,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      );
    }

    // Control Flow: Empty state
    if (_consultations.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.medical_services_outlined, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'No consultation records',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            SizedBox(height: 8),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'Your consultation history will appear here after visiting the doctor.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ),
          ],
        ),
      );
    }

    // Success state: Display consultations
    return RefreshIndicator(
      onRefresh: _loadConsultations,
      color: Colors.blue,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _consultations.length,
        itemBuilder: (context, index) {
          return _buildConsultationCard(_consultations[index]);
        },
      ),
    );
  }

  /// Build consultation card
  /// Subprogram: UI component for consultation display
  Widget _buildConsultationCard(Map<String, dynamic> consultation) {
    final doctor = consultation['doctor'] as Map<String, dynamic>?;
    final doctorName = doctor != null ? 'Dr. ${doctor['name']}' : 'Unknown Doctor';
    final date = HealthRecordsService.formatDate(consultation['consultation_date']);

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: ExpansionTile(
        leading: CircleAvatar(
          backgroundColor: Colors.blue,
          child: const Icon(Icons.medical_services, color: Colors.white),
        ),
        title: Text(
          doctorName,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(date),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Chief Complaint
                if (consultation['chief_complaint'] != null &&
                    consultation['chief_complaint'].toString().isNotEmpty)
                  _buildDetailSection(
                    'Chief Complaint',
                    consultation['chief_complaint'],
                    Icons.report_problem,
                  ),

                // Diagnosis
                if (consultation['diagnosis'] != null &&
                    consultation['diagnosis'].toString().isNotEmpty)
                  _buildDetailSection(
                    'Diagnosis',
                    consultation['diagnosis'],
                    Icons.local_hospital,
                  ),

                // Treatment Plan
                if (consultation['treatment_plan'] != null &&
                    consultation['treatment_plan'].toString().isNotEmpty)
                  _buildDetailSection(
                    'Treatment Plan',
                    consultation['treatment_plan'],
                    Icons.healing,
                  ),

                // Prescription
                if (consultation['prescription'] != null &&
                    (consultation['prescription'] as List).isNotEmpty)
                  _buildPrescriptionSection(consultation['prescription']),

                // Doctor Notes
                if (consultation['notes'] != null &&
                    consultation['notes'].toString().isNotEmpty)
                  _buildDetailSection(
                    'Notes',
                    consultation['notes'],
                    Icons.note,
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Build detail section
  /// Subprogram: Reusable detail display widget
  Widget _buildDetailSection(String title, String content, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: Colors.blue),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(fontSize: 15),
          ),
        ],
      ),
    );
  }

  /// Build prescription section
  /// Subprogram: Display prescription list
  Widget _buildPrescriptionSection(List prescriptions) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.medication, size: 20, color: Colors.blue),
              SizedBox(width: 8),
              Text(
                'Prescription',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ...prescriptions.map((rx) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('• ', style: TextStyle(fontSize: 15)),
                  Expanded(
                    child: Text(
                      '${rx['medicine']} - ${rx['dosage']} (${rx['frequency']})',
                      style: const TextStyle(fontSize: 15),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}
