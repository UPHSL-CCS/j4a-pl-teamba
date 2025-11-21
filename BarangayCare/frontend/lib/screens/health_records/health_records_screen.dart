import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/health_records_service.dart';
import 'consultation_history_screen.dart';
import 'vital_signs_screen.dart';
import 'add_vitals_screen.dart';
import 'health_report_screen.dart';
import 'create_profile_screen.dart';

/// Health Records Screen
/// Main dashboard for patient health records
/// Demonstrates: Control Flow, UI/UX, Navigation
class HealthRecordsScreen extends StatefulWidget {
  const HealthRecordsScreen({super.key});

  @override
  State<HealthRecordsScreen> createState() => _HealthRecordsScreenState();
}

class _HealthRecordsScreenState extends State<HealthRecordsScreen> {
  Map<String, dynamic>? _healthProfile;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadHealthProfile();
  }

  /// Load complete health profile
  /// Subprogram: Data loading function
  Future<void> _loadHealthProfile() async {
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

      final profile = await HealthRecordsService.getHealthProfile(token);

      setState(() {
        _healthProfile = profile;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        // Check if error is 404 (profile not found) - this is expected for users without profiles
        if (e.toString().contains('404') || e.toString().contains('Patient profile not found')) {
          _healthProfile = null; // Explicitly set to null to show create profile UI
        } else {
          _errorMessage = e.toString();
        }
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Health Records'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadHealthProfile,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  /// Build main body based on loading state
  /// Control Flow: Different UI based on state
  Widget _buildBody() {
    // Control Flow: Loading state
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF00897B)),
      );
    }

    // Control Flow: No profile state - show create profile option
    if (_healthProfile == null && _errorMessage == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.folder_open, size: 80, color: Colors.grey),
            const SizedBox(height: 24),
            const Text(
              'No Patient Profile Found',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'Create your patient profile to access health records, track vital signs, and view consultation history.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: () async {
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const CreateProfileScreen(),
                  ),
                );

                // Reload if profile was created
                if (result != null) {
                  _loadHealthProfile();
                }
              },
              icon: const Icon(Icons.add),
              label: const Text('Create Patient Profile'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00897B),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ],
        ),
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
              'Error loading health records',
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
              onPressed: _loadHealthProfile,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00897B),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ],
        ),
      );
    }

    // Control Flow: Success state - display health profile
    return RefreshIndicator(
      onRefresh: _loadHealthProfile,
      color: const Color(0xFF00897B),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildPatientInfoCard(),
            const SizedBox(height: 16),
            _buildHealthSummaryCard(),
            const SizedBox(height: 16),
            _buildActiveConditionsCard(),
            const SizedBox(height: 16),
            _buildQuickActionsGrid(),
            const SizedBox(height: 80), // Space for FAB
          ],
        ),
      ),
    );
  }

  /// Build patient information card
  /// Subprogram: UI component for patient info
  Widget _buildPatientInfoCard() {
    final patientInfo = _healthProfile?['patient_info'] ?? {};

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: const Color(0xFF00897B),
                  radius: 30,
                  child: Text(
                    (patientInfo['name'] ?? 'U')[0].toUpperCase(),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        patientInfo['name'] ?? 'Unknown',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${patientInfo['age'] ?? 'N/A'} years • ${patientInfo['gender'] ?? 'N/A'}',
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            _buildInfoRow(Icons.bloodtype, 'Blood Type',
                patientInfo['blood_type'] ?? 'Not specified'),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.phone, 'Contact', patientInfo['contact'] ?? 'N/A'),
            // Control Flow: Show allergies if present
            if (patientInfo['allergies'] != null &&
                (patientInfo['allergies'] as List).isNotEmpty) ...[
              const SizedBox(height: 8),
              _buildInfoRow(
                Icons.warning_amber,
                'Allergies',
                (patientInfo['allergies'] as List).join(', '),
                isWarning: true,
              ),
            ],
          ],
        ),
      ),
    );
  }

  /// Build health summary card
  /// Subprogram: UI component for health summary
  Widget _buildHealthSummaryCard() {
    final summary = _healthProfile?['summary'] ?? {};

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Health Summary',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildSummaryItem(
                    Icons.medical_services,
                    'Consultations',
                    summary['total_consultations']?.toString() ?? '0',
                    Colors.blue,
                  ),
                ),
                Expanded(
                  child: _buildSummaryItem(
                    Icons.favorite,
                    'Vital Records',
                    summary['total_vital_records']?.toString() ?? '0',
                    Colors.red,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// Build active conditions card
  /// Subprogram: UI component for medical conditions
  Widget _buildActiveConditionsCard() {
    final conditions = _healthProfile?['conditions'] as List? ?? [];
    final activeConditions =
        conditions.where((c) => c['status'] == 'active').toList();

    // Control Flow: Show message if no active conditions
    if (activeConditions.isEmpty) {
      return Card(
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green, size: 32),
              SizedBox(width: 16),
              Expanded(
                child: Text(
                  'No active medical conditions',
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Active Medical Conditions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            ...activeConditions.take(3).map((condition) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    Icon(
                      Icons.circle,
                      size: 8,
                      color: _getSeverityColor(condition['severity']),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        condition['condition_name'] ?? 'Unknown',
                        style: const TextStyle(fontSize: 15),
                      ),
                    ),
                    Text(
                      condition['severity'] ?? '',
                      style: TextStyle(
                        fontSize: 12,
                        color: _getSeverityColor(condition['severity']),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  /// Build quick actions grid
  /// Subprogram: Navigation shortcuts
  Widget _buildQuickActionsGrid() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.3,
          children: [
            _buildActionCard(
              'Consultations',
              Icons.medical_services,
              Colors.blue,
              () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ConsultationHistoryScreen(),
                ),
              ),
            ),
            _buildActionCard(
              'Vital Signs',
              Icons.favorite,
              Colors.red,
              () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const VitalSignsScreen(),
                ),
              ),
            ),
            _buildActionCard(
              'Health Reports',
              Icons.description,
              Colors.green,
              () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const HealthReportScreen(),
                ),
              ),
            ),
            _buildActionCard(
              'Add Vitals',
              Icons.add_circle,
              const Color(0xFF00897B),
              () async {
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AddVitalsScreen(),
                  ),
                );
                if (result == true) _loadHealthProfile();
              },
            ),
          ],
        ),
      ],
    );
  }

  /// Helper: Build info row
  /// Subprogram: Reusable info row widget
  Widget _buildInfoRow(IconData icon, String label, String value,
      {bool isWarning = false}) {
    return Row(
      children: [
        Icon(icon, size: 20, color: isWarning ? Colors.red : Colors.grey),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: const TextStyle(fontWeight: FontWeight.w500),
        ),
        Expanded(
          child: Text(
            value,
            style: TextStyle(
              color: isWarning ? Colors.red : Colors.black87,
              fontWeight: isWarning ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ],
    );
  }

  /// Helper: Build summary item
  /// Subprogram: Reusable summary widget
  Widget _buildSummaryItem(
      IconData icon, String label, String value, Color color) {
    return Column(
      children: [
        Icon(icon, size: 36, color: color),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  /// Helper: Build action card
  /// Subprogram: Reusable action button
  Widget _buildActionCard(
      String title, IconData icon, Color color, VoidCallback onTap) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 40, color: color),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Helper: Get severity color
  /// Control Flow: Color coding based on severity
  Color _getSeverityColor(String? severity) {
    switch (severity?.toLowerCase()) {
      case 'mild':
        return Colors.green;
      case 'moderate':
        return Colors.orange;
      case 'severe':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
