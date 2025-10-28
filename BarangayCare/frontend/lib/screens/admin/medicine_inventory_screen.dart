import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';

class MedicineInventoryScreen extends StatefulWidget {
  final String? filter;

  const MedicineInventoryScreen({super.key, this.filter});

  @override
  State<MedicineInventoryScreen> createState() => _MedicineInventoryScreenState();
}

class _MedicineInventoryScreenState extends State<MedicineInventoryScreen> {
  List<dynamic> _medicines = [];
  bool _loading = true;
  String? _error;
  bool _showLowStockOnly = false;

  @override
  void initState() {
    super.initState();
    _showLowStockOnly = widget.filter == 'low-stock';
    _loadMedicines();
  }

  Future<void> _loadMedicines() async {
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

      final medicines = _showLowStockOnly
          ? await ApiService.getLowStockMedicines(token)
          : await ApiService.getMedicines(token: token);

      setState(() {
        _medicines = medicines;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  void _showAdjustStockDialog(Map<String, dynamic> medicine) {
    final quantityController = TextEditingController();
    final reasonController = TextEditingController();
    String changeType = 'restock';

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text('Adjust Stock: ${medicine['med_name'] ?? medicine['medicine_name'] ?? 'Unknown'}'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Current Stock: ${medicine['stock_qty']} ${medicine['unit'] ?? 'units'}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: changeType,
                  decoration: const InputDecoration(
                    labelText: 'Change Type',
                    border: OutlineInputBorder(),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'restock', child: Text('Restock (+)')),
                    DropdownMenuItem(value: 'dispense', child: Text('Dispense (-)')),
                    DropdownMenuItem(value: 'expired', child: Text('Expired (-)')),
                    DropdownMenuItem(value: 'adjustment', child: Text('Adjustment (±)')),
                  ],
                  onChanged: (value) {
                    setDialogState(() {
                      changeType = value!;
                    });
                  },
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: quantityController,
                  decoration: const InputDecoration(
                    labelText: 'Quantity Change',
                    border: OutlineInputBorder(),
                    hintText: 'Enter positive or negative number',
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: reasonController,
                  decoration: const InputDecoration(
                    labelText: 'Reason *',
                    border: OutlineInputBorder(),
                    hintText: 'e.g., New stock delivery, dispensed to patient',
                  ),
                  maxLines: 2,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _adjustStock(
                  medicine['_id'],
                  int.tryParse(quantityController.text) ?? 0,
                  changeType,
                  reasonController.text,
                );
              },
              child: const Text('Adjust'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _adjustStock(
    String medicineId,
    int quantityChange,
    String changeType,
    String reason,
  ) async {
    if (quantityChange == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid quantity')),
      );
      return;
    }

    if (reason.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please provide a reason')),
      );
      return;
    }

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.user?.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      await ApiService.adjustMedicineStock(
        token,
        medicineId,
        quantityChange: quantityChange,
        changeType: changeType,
        reason: reason,
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Stock adjusted successfully'),
          backgroundColor: Colors.green,
        ),
      );

      _loadMedicines();
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Medicine Inventory'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(_showLowStockOnly ? Icons.filter_alt : Icons.filter_alt_off),
            onPressed: () {
              setState(() {
                _showLowStockOnly = !_showLowStockOnly;
                _loadMedicines();
              });
            },
            tooltip: _showLowStockOnly ? 'Show All' : 'Show Low Stock Only',
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadMedicines,
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
                        onPressed: _loadMedicines,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _medicines.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.inventory_2, size: 64, color: Colors.grey[400]),
                          const SizedBox(height: 16),
                          Text(
                            _showLowStockOnly
                                ? 'No low stock medicines'
                                : 'No medicines found',
                            style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadMedicines,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _medicines.length,
                        itemBuilder: (context, index) {
                          final medicine = _medicines[index];
                          return _buildMedicineCard(medicine);
                        },
                      ),
                    ),
    );
  }

  Widget _buildMedicineCard(Map<String, dynamic> medicine) {
    final stockQty = medicine['stock_qty'] ?? 0;
    final reorderLevel = medicine['reorder_level'] ?? 20;
    final isLowStock = stockQty <= reorderLevel;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Medicine name and low stock indicator
            Row(
              children: [
                Expanded(
                  child: Text(
                    medicine['med_name'] ?? medicine['medicine_name'] ?? 'Unknown Medicine',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                if (isLowStock)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.red),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.warning, size: 14, color: Colors.red),
                        SizedBox(width: 4),
                        Text(
                          'LOW STOCK',
                          style: TextStyle(
                            color: Colors.red,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            // Stock information
            Row(
              children: [
                const Icon(Icons.inventory, size: 16, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  'Stock: $stockQty ${medicine['unit'] ?? 'units'}',
                  style: TextStyle(
                    color: isLowStock ? Colors.red : Colors.grey[700],
                    fontWeight: isLowStock ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.refresh, size: 16, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  'Reorder at: $reorderLevel',
                  style: TextStyle(color: Colors.grey[600], fontSize: 13),
                ),
              ],
            ),

            // Description if available
            if (medicine['description'] != null && medicine['description'].toString().isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                medicine['description'],
                style: TextStyle(color: Colors.grey[600], fontSize: 13),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],

            const SizedBox(height: 12),

            // Adjust stock button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _showAdjustStockDialog(medicine),
                icon: const Icon(Icons.edit, size: 18),
                label: const Text('Adjust Stock'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
