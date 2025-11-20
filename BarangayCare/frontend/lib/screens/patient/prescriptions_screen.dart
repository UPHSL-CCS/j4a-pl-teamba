import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/prescription_management_service.dart';
import '../../services/api_service.dart';
import 'package:intl/intl.dart';

class PrescriptionsScreen extends StatefulWidget {
  const PrescriptionsScreen({super.key});

  @override
  State<PrescriptionsScreen> createState() => _PrescriptionsScreenState();
}

class _PrescriptionsScreenState extends State<PrescriptionsScreen> {
  final PrescriptionService _prescriptionService = PrescriptionService();
  List<Map<String, dynamic>> _prescriptions = [];
  bool _isLoading = true;
  String? _error;
  String _filter = 'active'; // active, all

  @override
  void initState() {
    super.initState();
    _loadPrescriptions();
  }

  Future<void> _loadPrescriptions() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      print('🔍 Loading prescriptions...');
      
      // Get patient profile to get patient_id
      final profile = await ApiService.getProfile(token);
      print('📋 Profile: $profile');
      final patientId = profile['_id'];
      print('👤 Patient ID: $patientId');

      // Get prescriptions
      final prescriptions = await _prescriptionService.getPatientPrescriptions(
        patientId: patientId,
        status: _filter == 'active' ? 'active' : null,
      );
      
      print('📦 Received ${prescriptions.length} prescriptions');
      print('📦 Raw data: $prescriptions');

      setState(() {
        _prescriptions = prescriptions;
        _isLoading = false;
      });
    } catch (e, stackTrace) {
      print('❌ Error loading prescriptions: $e');
      print('📍 Stack trace: $stackTrace');
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _requestMedicineFromPrescription(
    Map<String, dynamic> prescription,
    Map<String, dynamic> medicine,
  ) async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      // Show quantity dialog
      final quantityController = TextEditingController(
        text: medicine['quantity'].toString(),
      );

      final confirmed = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Request ${medicine['medicine_name'] ?? 'Medicine'}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Prescribed: ${medicine['quantity'] ?? 0} ${medicine['dosage'] ?? 'N/A'}'),
              const SizedBox(height: 8),
              if (medicine['instructions'] != null && medicine['instructions'].toString().isNotEmpty)
                Text('Instructions: ${medicine['instructions']}'),
              const SizedBox(height: 16),
              TextField(
                controller: quantityController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Quantity to Request',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Request'),
            ),
          ],
        ),
      );

      if (confirmed != true) return;

      final quantity = int.tryParse(quantityController.text) ?? 1;

      if (!mounted) return;

      // Show loading
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(child: CircularProgressIndicator()),
      );

      await ApiService.requestMedicine(
        medicineId: medicine['medicine_id'].toString(),
        quantity: quantity,
        token: token,
        prescriptionId: prescription['_id'].toString(),
      );

      if (!mounted) return;
      Navigator.pop(context); // Close loading

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Medicine request submitted successfully!'),
          backgroundColor: Colors.green,
        ),
      );

      // Reload prescriptions
      _loadPrescriptions();
    } catch (e) {
      if (!mounted) return;
      Navigator.pop(context); // Close loading

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Prescriptions'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadPrescriptions,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter tabs
          Container(
            padding: const EdgeInsets.all(8),
            color: Colors.grey[100],
            child: Row(
              children: [
                Expanded(
                  child: _buildFilterChip('Active', 'active'),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildFilterChip('All', 'all'),
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: _buildBody(),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _filter == value;
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setState(() => _filter = value);
          _loadPrescriptions();
        }
      },
      selectedColor: Colors.teal,
      checkmarkColor: Colors.white,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black87,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text('Error: $_error'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadPrescriptions,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_prescriptions.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.description_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              _filter == 'active'
                  ? 'No active prescriptions'
                  : 'No prescriptions yet',
              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
            ),
            const SizedBox(height: 8),
            Text(
              'Complete a consultation to get a prescription',
              style: TextStyle(color: Colors.grey[500]),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadPrescriptions,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _prescriptions.length,
        itemBuilder: (context, index) {
          try {
            return _buildPrescriptionCard(_prescriptions[index]);
          } catch (e, stackTrace) {
            print('❌ Error building prescription card $index: $e');
            print('📦 Prescription data: ${_prescriptions[index]}');
            print('📍 Stack trace: $stackTrace');
            return Card(
              margin: const EdgeInsets.only(bottom: 16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text('Error loading prescription: $e'),
              ),
            );
          }
        },
      ),
    );
  }

  Widget _buildPrescriptionCard(Map<String, dynamic> prescription) {
    final issuedDate = prescription['issued_date'] != null 
        ? DateTime.parse(prescription['issued_date'])
        : DateTime.now();
    final expiryDate = prescription['expiry_date'] != null
        ? DateTime.parse(prescription['expiry_date'])
        : DateTime.now().add(const Duration(days: 30));
    final status = prescription['status'] ?? 'active';
    final isActive = status == 'active';
    final isExpired = DateTime.now().isAfter(expiryDate);
    final daysRemaining = _prescriptionService.getDaysRemaining(prescription);

    Color statusColor;
    IconData statusIcon;
    if (isExpired || status == 'expired') {
      statusColor = Colors.grey;
      statusIcon = Icons.access_time;
    } else if (status == 'used') {
      statusColor = Colors.blue;
      statusIcon = Icons.check_circle;
    } else if (status == 'cancelled') {
      statusColor = Colors.red;
      statusIcon = Icons.cancel;
    } else {
      statusColor = Colors.green;
      statusIcon = Icons.verified;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(statusIcon, color: statusColor, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        status.toUpperCase(),
                        style: TextStyle(
                          color: statusColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    if (isActive && !isExpired)
                      Chip(
                        label: Text('$daysRemaining days left'),
                        backgroundColor: daysRemaining < 7 ? Colors.orange : Colors.blue,
                        labelStyle: const TextStyle(color: Colors.white, fontSize: 12),
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Dr. ${prescription['doctor_name'] ?? 'Unknown'}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Issued: ${DateFormat('MMM dd, yyyy').format(issuedDate)}',
                  style: TextStyle(color: Colors.grey[600], fontSize: 12),
                ),
                Text(
                  'Expires: ${DateFormat('MMM dd, yyyy').format(expiryDate)}',
                  style: TextStyle(color: Colors.grey[600], fontSize: 12),
                ),
              ],
            ),
          ),

          // Diagnosis
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Diagnosis',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 4),
                Text(prescription['diagnosis'] ?? 'Not specified'),
                
                if (prescription['notes'] != null && prescription['notes'].toString().isNotEmpty) ...[
                  const SizedBox(height: 12),
                  const Text(
                    'Doctor\'s Notes',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                  const SizedBox(height: 4),
                  Text(prescription['notes']),
                ],

                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 8),

                // Medicines
                const Text(
                  'Prescribed Medicines',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 12),

                if (prescription['medicines'] != null && prescription['medicines'] is List)
                  ...List.generate(
                    (prescription['medicines'] as List).length,
                    (index) {
                      final medicine = prescription['medicines'][index];
                      return _buildMedicineItem(prescription, medicine, isActive && !isExpired);
                    },
                  )
                else
                  const Text(
                    'No medicines prescribed',
                    style: TextStyle(color: Colors.grey),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicineItem(
    Map<String, dynamic> prescription,
    Map<String, dynamic> medicine,
    bool canRequest,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.medication, color: Colors.teal, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  medicine['medicine_name'] ?? 'Unknown Medicine',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          _buildMedicineDetail('Dosage', medicine['dosage'] ?? 'N/A'),
          _buildMedicineDetail('Quantity', '${medicine['quantity'] ?? 0}'),
          if (medicine['frequency'] != null && medicine['frequency'].toString().isNotEmpty)
            _buildMedicineDetail('Frequency', medicine['frequency']),
          if (medicine['instructions'] != null && medicine['instructions'].toString().isNotEmpty)
            _buildMedicineDetail('Instructions', medicine['instructions']),
          
          if (canRequest) ...[
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _requestMedicineFromPrescription(prescription, medicine),
                icon: const Icon(Icons.add_shopping_cart, size: 18),
                label: const Text('Request Medicine'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildMedicineDetail(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 90,
            child: Text(
              '$label:',
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 13,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
