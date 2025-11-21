import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  Map<String, dynamic>? _stats;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      final stats = await ApiService.getAdminDashboardStats(token);

      if (!mounted) return;

      setState(() {
        _stats = stats;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadStats,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final navigator = Navigator.of(context);
              await authProvider.signOut();
              if (!mounted) return;
              navigator.pushReplacementNamed('/login');
            },
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 48, color: Colors.red),
                      const SizedBox(height: 16),
                      Text('Error: $_error'),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadStats,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadStats,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Welcome header
                        Text(
                          'Welcome, Administrator',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'System Overview',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: Colors.grey[600],
                              ),
                        ),
                        const SizedBox(height: 24),

                        // Statistics Grid
                        LayoutBuilder(
                          builder: (context, constraints) {
                            // Calculate aspect ratio based on available width
                            final cardWidth = (constraints.maxWidth - 16) / 2;
                            final cardHeight = cardWidth * 0.8; // Make cards slightly taller
                            
                            return GridView.count(
                              crossAxisCount: 2,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              mainAxisSpacing: 12,
                              crossAxisSpacing: 12,
                              childAspectRatio: cardWidth / cardHeight,
                              children: [
                            _buildStatCard(
                              context,
                              title: 'Pending Appointments',
                              value: _stats?['pending_appointments']?.toString() ?? '0',
                              icon: Icons.pending_actions,
                              color: Colors.orange,
                              onTap: () => Navigator.pushNamed(
                                context,
                                '/admin/appointments',
                                arguments: {'status': 'pending'},
                              ),
                            ),
                            _buildStatCard(
                              context,
                              title: "Today's Appointments",
                              value: _stats?['today_appointments']?.toString() ?? '0',
                              icon: Icons.calendar_today,
                              color: Colors.blue,
                              onTap: () => Navigator.pushNamed(context, '/admin/appointments'),
                            ),
                            _buildStatCard(
                              context,
                              title: 'Low Stock Medicines',
                              value: _stats?['low_stock_medicines']?.toString() ?? '0',
                              icon: Icons.medication,
                              color: Colors.red,
                              onTap: () => Navigator.pushNamed(
                                context,
                                '/admin/medicines',
                                arguments: {'filter': 'low-stock'},
                              ),
                            ),
                            _buildStatCard(
                              context,
                              title: 'Medicine Requests',
                              value: _stats?['pending_medicine_requests']?.toString() ?? '0',
                              icon: Icons.request_page,
                              color: Colors.purple,
                              onTap: () => Navigator.pushNamed(
                                context,
                                '/admin/medicine-requests',
                                arguments: {'filter': 'pending'},
                              ),
                            ),
                            _buildStatCard(
                              context,
                              title: 'Total Patients',
                              value: _stats?['total_patients']?.toString() ?? '0',
                              icon: Icons.people,
                              color: Colors.green,
                            ),
                            _buildStatCard(
                              context,
                              title: 'Active Doctors',
                              value: _stats?['total_doctors']?.toString() ?? '0',
                              icon: Icons.medical_services,
                              color: Colors.teal,
                            ),
                          ],
                        );
                          },
                        ),

                        const SizedBox(height: 32),

                        // Quick Actions
                        Text(
                          'Quick Actions',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 16),
                        _buildQuickAction(
                          context,
                          title: 'Manage Appointments',
                          subtitle: 'Review and approve pending appointments',
                          icon: Icons.event_note,
                          onTap: () => Navigator.pushNamed(context, '/admin/appointments'),
                        ),
                        const SizedBox(height: 12),
                        _buildQuickAction(
                          context,
                          title: 'Medicine Inventory',
                          subtitle: 'Manage stock levels and medicines',
                          icon: Icons.inventory,
                          onTap: () => Navigator.pushNamed(context, '/admin/medicines'),
                        ),
                        const SizedBox(height: 12),
                        _buildQuickAction(
                          context,
                          title: 'Medicine Requests',
                          subtitle: 'Review and approve medicine requests',
                          icon: Icons.medication,
                          onTap: () => Navigator.pushNamed(context, '/admin/medicine-requests'),
                        ),
                        const SizedBox(height: 12),
                        _buildQuickAction(
                          context,
                          title: 'View Reports',
                          subtitle: 'Analytics and system reports',
                          icon: Icons.analytics,
                          onTap: () => Navigator.pushNamed(context, '/admin/reports'),
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    VoidCallback? onTap,
  }) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: color, size: 28),
              const Spacer(),
              FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  value,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: color,
                      ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey[600],
                      fontSize: 11,
                    ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAction(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 1,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.teal.withValues(alpha: 0.1),
          child: Icon(icon, color: Colors.teal),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}
