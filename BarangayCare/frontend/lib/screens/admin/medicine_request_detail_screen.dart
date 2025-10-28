import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../providers/auth_provider.dart';

class MedicineRequestDetailScreen extends StatefulWidget {
  final String requestId;
  final VoidCallback? onStatusChanged;

  const MedicineRequestDetailScreen({
    super.key,
    required this.requestId,
    this.onStatusChanged,
  });

  @override
  State<MedicineRequestDetailScreen> createState() => _MedicineRequestDetailScreenState();
}

class _MedicineRequestDetailScreenState extends State<MedicineRequestDetailScreen> {
  Map<String, dynamic>? _request;
  bool _isLoading = true;
  bool _isProcessing = false;
  final TextEditingController _notesController = TextEditingController();
  final TextEditingController _rejectionController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadRequestDetails();
  }

  @override
  void dispose() {
    _notesController.dispose();
    _rejectionController.dispose();
    super.dispose();
  }

  Future<void> _loadRequestDetails() async {
    setState(() => _isLoading = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await ApiService.getMedicineRequestDetail(
        widget.requestId,
        token: token,
      );
      setState(() {
        _request = response;
        _isLoading = false;
      });
    } catch (e) {
      print('❌ Error loading request details: $e');
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load request: $e')),
        );
      }
    }
  }

  Future<void> _approveRequest() async {
    setState(() => _isProcessing = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      await ApiService.approveMedicineRequest(
        widget.requestId,
        notes: _notesController.text.trim(),
        token: token,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Request approved successfully'),
            backgroundColor: Colors.green,
          ),
        );
        widget.onStatusChanged?.call();
        Navigator.pop(context);
      }
    } catch (e) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to approve: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _rejectRequest() async {
    final reason = _rejectionController.text.trim();
    if (reason.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please provide a rejection reason')),
      );
      return;
    }

    setState(() => _isProcessing = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      await ApiService.rejectMedicineRequest(
        widget.requestId,
        reason: reason,
        token: token,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('❌ Request rejected'),
            backgroundColor: Colors.orange,
          ),
        );
        widget.onStatusChanged?.call();
        Navigator.pop(context);
      }
    } catch (e) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to reject: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _showApproveDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Approve Request'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Are you sure you want to approve this medicine request?'),
            const SizedBox(height: 16),
            TextField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText: 'Admin Notes (Optional)',
                hintText: 'Add any notes...',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _approveRequest();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
            child: const Text('Approve'),
          ),
        ],
      ),
    );
  }

  void _showRejectDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reject Request'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Please provide a reason for rejection:'),
            const SizedBox(height: 16),
            TextField(
              controller: _rejectionController,
              decoration: const InputDecoration(
                labelText: 'Rejection Reason *',
                hintText: 'Out of stock, invalid prescription, etc.',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
              autofocus: true,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _rejectRequest();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Reject'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Request Details'),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _request == null
              ? const Center(child: Text('Request not found'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Status Badge
                      Center(child: _buildStatusBadge(_request!['status'] ?? 'unknown')),
                      const SizedBox(height: 24),

                      // Medicine Info Card
                      _buildInfoCard(
                        title: 'Medicine Information',
                        icon: Icons.medication,
                        children: [
                          _buildInfoRow('Medicine', _request!['medicine_name'] ?? 'Unknown'),
                          _buildInfoRow('Quantity Requested', '${_request!['quantity_requested'] ?? _request!['quantity'] ?? 'N/A'}'),
                          _buildInfoRow('Current Stock', '${_request!['current_stock'] ?? 0}'),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Patient Info Card
                      _buildInfoCard(
                        title: 'Patient Information',
                        icon: Icons.person,
                        children: [
                          _buildInfoRow('Name', _request!['patient_name'] ?? 'Unknown'),
                          _buildInfoRow('Contact', _request!['patient_contact'] ?? 'N/A'),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Request Info Card
                      _buildInfoCard(
                        title: 'Request Information',
                        icon: Icons.info_outline,
                        children: [
                          _buildInfoRow('Request ID', _request!['_id'] ?? 'N/A'),
                          _buildInfoRow(
                            'Requested At',
                            _request!['created_at'] != null
                                ? _formatDateTime(DateTime.parse(_request!['created_at']))
                                : 'N/A',
                          ),
                          if (_request!['approved_at'] != null)
                            _buildInfoRow(
                              'Approved At',
                              _formatDateTime(DateTime.parse(_request!['approved_at'])),
                            ),
                          if (_request!['rejected_at'] != null)
                            _buildInfoRow(
                              'Rejected At',
                              _formatDateTime(DateTime.parse(_request!['rejected_at'])),
                            ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Admin Notes (if any)
                      if (_request!['admin_notes'] != null && _request!['admin_notes'].toString().isNotEmpty)
                        _buildInfoCard(
                          title: 'Admin Notes',
                          icon: Icons.note,
                          children: [
                            Text(
                              _request!['admin_notes'],
                              style: const TextStyle(fontSize: 14),
                            ),
                          ],
                        ),

                      // Rejection Reason (if rejected)
                      if (_request!['rejection_reason'] != null)
                        Padding(
                          padding: const EdgeInsets.only(top: 16),
                          child: _buildInfoCard(
                            title: 'Rejection Reason',
                            icon: Icons.cancel,
                            children: [
                              Text(
                                _request!['rejection_reason'],
                                style: const TextStyle(fontSize: 14, color: Colors.red),
                              ),
                            ],
                          ),
                        ),

                      const SizedBox(height: 24),

                      // Action Buttons (only if pending)
                      if (_request!['status'] == 'pending') ...[
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: _isProcessing ? null : _showRejectDialog,
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
                                onPressed: _isProcessing ? null : _showApproveDialog,
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
                    ],
                  ),
                ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color backgroundColor;
    Color textColor;
    IconData icon;

    switch (status.toLowerCase()) {
      case 'pending':
        backgroundColor = Colors.orange[100]!;
        textColor = Colors.orange[900]!;
        icon = Icons.hourglass_empty;
        break;
      case 'approved':
        backgroundColor = Colors.green[100]!;
        textColor = Colors.green[900]!;
        icon = Icons.check_circle;
        break;
      case 'rejected':
        backgroundColor = Colors.red[100]!;
        textColor = Colors.red[900]!;
        icon = Icons.cancel;
        break;
      case 'fulfilled':
        backgroundColor = Colors.blue[100]!;
        textColor = Colors.blue[900]!;
        icon = Icons.done_all;
        break;
      default:
        backgroundColor = Colors.grey[100]!;
        textColor = Colors.grey[900]!;
        icon = Icons.help_outline;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20, color: textColor),
          const SizedBox(width: 8),
          Text(
            status.toUpperCase(),
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 20, color: Colors.green),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[700],
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDateTime(DateTime dt) {
    return '${dt.year}-${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')} '
        '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }
}
