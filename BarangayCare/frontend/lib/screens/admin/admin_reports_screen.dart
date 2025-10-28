import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../providers/auth_provider.dart';

class AdminReportsScreen extends StatefulWidget {
  const AdminReportsScreen({super.key});

  @override
  State<AdminReportsScreen> createState() => _AdminReportsScreenState();
}

class _AdminReportsScreenState extends State<AdminReportsScreen> {
  Map<String, dynamic>? _stats;
  List<dynamic> _recentAppointments = [];
  List<dynamic> _recentMedicineRequests = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadReports();
  }

  Future<void> _loadReports() async {
    setState(() => _isLoading = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      final dashboardStats = await ApiService.getAdminDashboardStats(token);
      final appointments = await ApiService.getAdminAppointments(
        token,
        status: 'all',
        limit: 5,
      );
      final medicineRequests = await ApiService.getMedicineRequests(
        status: 'all',
        token: token,
      );
      
      setState(() {
        _stats = dashboardStats;
        _recentAppointments = appointments;
        _recentMedicineRequests = (medicineRequests['requests'] as List?)?.take(5).toList() ?? [];
        _isLoading = false;
      });
    } catch (e) {
      print('❌ Error loading reports: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports & Analytics'),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadReports,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Summary Statistics
                    Text(
                      'System Overview',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 16),
                    _buildSummaryCard(),
                    const SizedBox(height: 24),

                    // Appointment Statistics
                    Text(
                      'Appointment Statistics',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 16),
                    _buildAppointmentStats(),
                    const SizedBox(height: 24),

                    // Medicine Statistics
                    Text(
                      'Medicine Statistics',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 16),
                    _buildMedicineStats(),
                    const SizedBox(height: 24),

                    // Recent Activity
                    Text(
                      'Recent Activity',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 16),
                    _buildRecentActivity(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSummaryCard() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildStatRow('Total Patients', _stats?['total_patients']?.toString() ?? '0', Icons.people),
            const Divider(height: 24),
            _buildStatRow('Total Doctors', _stats?['total_doctors']?.toString() ?? '0', Icons.medical_services),
            const Divider(height: 24),
            _buildStatRow('Pending Appointments', _stats?['pending_appointments']?.toString() ?? '0', Icons.event),
            const Divider(height: 24),
            _buildStatRow('Low Stock Medicines', _stats?['low_stock_medicines']?.toString() ?? '0', Icons.warning),
          ],
        ),
      ),
    );
  }

  Widget _buildAppointmentStats() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildStatRow('Pending', _stats?['pending_appointments']?.toString() ?? '0', Icons.hourglass_empty, color: Colors.orange),
            const Divider(height: 24),
            _buildStatRow('Today', _stats?['today_appointments']?.toString() ?? '0', Icons.today, color: Colors.blue),
          ],
        ),
      ),
    );
  }

  Widget _buildMedicineStats() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildStatRow('Pending Requests', _stats?['pending_medicine_requests']?.toString() ?? '0', Icons.request_page, color: Colors.purple),
            const Divider(height: 24),
            _buildStatRow('Low Stock Items', _stats?['low_stock_medicines']?.toString() ?? '0', Icons.inventory, color: Colors.red),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value, IconData icon, {Color? color}) {
    return Row(
      children: [
        Icon(icon, color: color ?? Colors.green, size: 24),
        const SizedBox(width: 16),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(fontSize: 16),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color ?? Colors.green,
          ),
        ),
      ],
    );
  }

  Widget _buildRecentActivity() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Recent Appointments',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            if (_recentAppointments.isEmpty)
              const Text('No recent appointments', style: TextStyle(color: Colors.grey))
            else
              ..._recentAppointments.take(3).map((apt) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _getStatusColor(apt['status']),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          '${apt['patient_name']} - ${apt['doctor_name']}',
                          style: const TextStyle(fontSize: 14),
                        ),
                      ),
                      Text(
                        apt['status'] ?? '',
                        style: TextStyle(
                          fontSize: 12,
                          color: _getStatusColor(apt['status']),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            const Divider(height: 24),
            const Text(
              'Recent Medicine Requests',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            if (_recentMedicineRequests.isEmpty)
              const Text('No recent medicine requests', style: TextStyle(color: Colors.grey))
            else
              ..._recentMedicineRequests.take(3).map((req) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _getStatusColor(req['status']),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          '${req['patient_name']} - ${req['medicine_name']}',
                          style: const TextStyle(fontSize: 14),
                        ),
                      ),
                      Text(
                        req['status'] ?? '',
                        style: TextStyle(
                          fontSize: 12,
                          color: _getStatusColor(req['status']),
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

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'approved':
      case 'completed':
        return Colors.green;
      case 'rejected':
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
