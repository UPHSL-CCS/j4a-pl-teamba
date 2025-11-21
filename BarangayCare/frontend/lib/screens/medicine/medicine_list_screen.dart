import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../prescription/upload_prescription_screen.dart';
import '../booking/doctor_list_screen.dart';
import '../patient/prescriptions_screen.dart';

class MedicineListScreen extends StatefulWidget {
  const MedicineListScreen({super.key});

  @override
  State<MedicineListScreen> createState() => _MedicineListScreenState();
}

class _MedicineListScreenState extends State<MedicineListScreen> {
  List<dynamic> _medicines = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadMedicines();
  }

  Future<void> _loadMedicines() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      final medicines = await ApiService.getMedicines(token: token);

      setState(() {
        _medicines = medicines;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  void _handleMedicineTap(Map<String, dynamic> medicine, bool requiresPrescription) {
    if (requiresPrescription) {
      // Show dialog explaining prescription requirement
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.medical_information, color: Colors.orange),
              SizedBox(width: 8),
              Text('Prescription Required'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'This medicine requires a valid prescription. You have two options:',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 16),
              _buildOptionRow(
                '1',
                'Get a Doctor-Issued Prescription',
                'Book a consultation with our doctors. After the consultation, the doctor will create a prescription for you.',
              ),
              const SizedBox(height: 12),
              _buildOptionRow(
                '2',
                'View Your Prescriptions',
                'If you already have a prescription from a recent consultation, go to the Prescriptions screen to request medicine.',
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Close'),
            ),
            TextButton.icon(
              onPressed: () {
                Navigator.of(context).pop();
                // Navigate to prescriptions screen
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const PrescriptionsScreen(),
                  ),
                );
              },
              icon: const Icon(Icons.receipt_long),
              label: const Text('View Prescriptions'),
            ),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pop();
                // Navigate to doctor list screen to book consultation
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const DoctorListScreen(),
                  ),
                );
              },
              icon: const Icon(Icons.calendar_today),
              label: const Text('Book Consultation'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      );
    } else {
      // Medicine doesn't require prescription, proceed with normal request
      _requestMedicine(medicine);
    }
  }

  Widget _buildOptionRow(String number, String title, String description) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: Colors.green,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              number,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _requestMedicine(Map<String, dynamic> medicine) async {
    final quantityController = TextEditingController(text: '1');

    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Request ${medicine['med_name']}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              medicine['description'] ?? 'No description available',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            Text(
              'Available Stock: ${medicine['stock_qty']}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: medicine['stock_qty'] > 0 ? Colors.green : Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: quantityController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Quantity',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.numbers),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Request'),
          ),
        ],
      ),
    );

    if (result == true) {
      await _submitRequest(
        medicineId: medicine['_id'].toString(),
        medicineName: medicine['med_name']?.toString() ?? 'Unknown Medicine',
        quantity: int.tryParse(quantityController.text) ?? 1,
        requiresPrescription: medicine['is_prescription_required'] ?? false,
      );
    }
  }

  Future<void> _submitRequest({
    required String medicineId,
    required String medicineName,
    required int quantity,
    required bool requiresPrescription,
  }) async {
    try {
      // Show loading
      if (!mounted) return;
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(),
        ),
      );

      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      final response = await ApiService.requestMedicine(
        medicineId: medicineId,
        quantity: quantity,
        token: token,
      );

      if (!mounted) return;
      Navigator.of(context).pop(); // Close loading

      // Extract request ID from response
      final requestId = response['data']?['_id']?.toString();

      // If prescription required and request created successfully, navigate to upload screen
      if (requiresPrescription && requestId != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Request created! Please upload your prescription.'),
            backgroundColor: Colors.blue,
            duration: Duration(seconds: 2),
          ),
        );

        // Navigate to upload prescription screen
        await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => UploadPrescriptionScreen(
              requestId: requestId,
              medicineName: medicineName,
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Medicine request submitted successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }

      // Reload medicines to update stock
      _loadMedicines();
    } catch (e) {
      if (!mounted) return;
      Navigator.of(context).pop(); // Close loading

      // Check if error is about missing consultation
      final errorMessage = e.toString();
      if (errorMessage.contains('complete a consultation first') ||
          errorMessage.contains('Prescription required')) {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Row(
              children: [
                Icon(Icons.warning_amber, color: Colors.orange),
                SizedBox(width: 8),
                Flexible(
                  child: Text('Prescription Required'),
                ),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'This medicine requires a prescription.',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                const Text(
                  'You must complete a consultation with a doctor first before requesting this medicine.',
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.info_outline, size: 20, color: Colors.blue),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Book a consultation from the home screen.',
                          style: TextStyle(fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            actions: [
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('OK'),
              ),
            ],
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to request medicine: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Request Medicine'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadMedicines,
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Error loading medicines',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                _error!,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey,
                    ),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadMedicines,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_medicines.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.medication_outlined,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'No Medicines Available',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Check back later for available medicines',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey,
                  ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadMedicines,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _medicines.length,
        itemBuilder: (context, index) {
          final medicine = _medicines[index];
          return _buildMedicineCard(medicine);
        },
      ),
    );
  }

  Widget _buildMedicineCard(Map<String, dynamic> medicine) {
    final bool inStock = medicine['stock_qty'] > 0;
    final bool requiresPrescription = medicine['is_prescription_required'] ?? false;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: inStock ? () => _handleMedicineTap(medicine, requiresPrescription) : null,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: inStock ? Colors.green.shade50 : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      Icons.medication,
                      color: inStock ? Colors.green : Colors.grey,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          medicine['med_name'] ?? 'Unknown Medicine',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          medicine['description'] ?? 'No description',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Colors.grey[600],
                              ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.inventory,
                        size: 16,
                        color: inStock ? Colors.green : Colors.red,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Stock: ${medicine['stock_qty']}',
                        style: TextStyle(
                          color: inStock ? Colors.green : Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  if (requiresPrescription)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.orange.shade50,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: Colors.orange),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.description,
                            size: 12,
                            color: Colors.orange,
                          ),
                          SizedBox(width: 4),
                          Text(
                            'Prescription Required',
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.orange,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
              if (!inStock)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.info_outline, size: 16, color: Colors.red),
                        SizedBox(width: 8),
                        Text(
                          'Out of Stock',
                          style: TextStyle(
                            color: Colors.red,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}
