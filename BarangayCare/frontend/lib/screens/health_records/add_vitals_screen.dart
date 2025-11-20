import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/health_records_service.dart';

/// Add Vitals Screen
/// Form for inputting new vital signs
/// Demonstrates: Control Flow, Form Validation, Data Input
class AddVitalsScreen extends StatefulWidget {
  const AddVitalsScreen({super.key});

  @override
  State<AddVitalsScreen> createState() => _AddVitalsScreenState();
}

class _AddVitalsScreenState extends State<AddVitalsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _systolicController = TextEditingController();
  final _diastolicController = TextEditingController();
  final _heartRateController = TextEditingController();
  final _temperatureController = TextEditingController();
  final _weightController = TextEditingController();
  final _heightController = TextEditingController();
  final _oxygenController = TextEditingController();
  final _notesController = TextEditingController();
  
  bool _isSubmitting = false;
  double? _calculatedBMI;

  @override
  void dispose() {
    _systolicController.dispose();
    _diastolicController.dispose();
    _heartRateController.dispose();
    _temperatureController.dispose();
    _weightController.dispose();
    _heightController.dispose();
    _oxygenController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  /// Calculate BMI when weight or height changes
  /// Control Flow: Validation and calculation
  void _updateBMI() {
    final weight = double.tryParse(_weightController.text);
    final height = double.tryParse(_heightController.text);
    
    setState(() {
      _calculatedBMI = HealthRecordsService.calculateBMI(weight, height);
    });
  }

  /// Submit vital signs
  /// Control Flow: Form validation before submission
  Future<void> _submitVitalSigns() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    // Ensure at least one vital sign is entered
    if (_systolicController.text.isEmpty &&
        _heartRateController.text.isEmpty &&
        _temperatureController.text.isEmpty &&
        _weightController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter at least one vital sign measurement'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      // Build vitals data map
      final vitalsData = <String, dynamic>{};

      // Blood pressure (if both values provided)
      if (_systolicController.text.isNotEmpty &&
          _diastolicController.text.isNotEmpty) {
        vitalsData['blood_pressure'] =
            '${_systolicController.text}/${_diastolicController.text}';
      }

      // Heart rate
      if (_heartRateController.text.isNotEmpty) {
        vitalsData['heart_rate'] = int.parse(_heartRateController.text);
      }

      // Temperature
      if (_temperatureController.text.isNotEmpty) {
        vitalsData['temperature'] = double.parse(_temperatureController.text);
      }

      // Weight
      if (_weightController.text.isNotEmpty) {
        vitalsData['weight'] = double.parse(_weightController.text);
      }

      // Height
      if (_heightController.text.isNotEmpty) {
        vitalsData['height'] = double.parse(_heightController.text);
      }

      // Oxygen saturation
      if (_oxygenController.text.isNotEmpty) {
        vitalsData['oxygen_saturation'] = int.parse(_oxygenController.text);
      }

      // Notes
      if (_notesController.text.isNotEmpty) {
        vitalsData['notes'] = _notesController.text;
      }

      await HealthRecordsService.addVitalSigns(token, vitalsData);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Vital signs recorded successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, true); // Return true to indicate success
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Vital Signs'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text(
              'Enter your vital signs measurements',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 24),

            // Blood Pressure Section
            const Text(
              'Blood Pressure',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _systolicController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Systolic',
                      hintText: '120',
                      border: OutlineInputBorder(),
                      suffixText: 'mmHg',
                    ),
                    validator: (value) {
                      if (value != null && value.isNotEmpty) {
                        final val = int.tryParse(value);
                        if (val == null || val < 70 || val > 200) {
                          return 'Invalid';
                        }
                      }
                      return null;
                    },
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: Text('/', style: TextStyle(fontSize: 24)),
                ),
                Expanded(
                  child: TextFormField(
                    controller: _diastolicController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Diastolic',
                      hintText: '80',
                      border: OutlineInputBorder(),
                      suffixText: 'mmHg',
                    ),
                    validator: (value) {
                      if (value != null && value.isNotEmpty) {
                        final val = int.tryParse(value);
                        if (val == null || val < 40 || val > 130) {
                          return 'Invalid';
                        }
                      }
                      return null;
                    },
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Heart Rate
            TextFormField(
              controller: _heartRateController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Heart Rate',
                hintText: '72',
                border: OutlineInputBorder(),
                suffixText: 'bpm',
                prefixIcon: Icon(Icons.favorite, color: Colors.red),
              ),
              validator: (value) {
                if (value != null && value.isNotEmpty) {
                  final val = int.tryParse(value);
                  if (val == null || val < 40 || val > 200) {
                    return 'Invalid heart rate (40-200 bpm)';
                  }
                }
                return null;
              },
            ),

            const SizedBox(height: 16),

            // Temperature
            TextFormField(
              controller: _temperatureController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                labelText: 'Temperature',
                hintText: '36.5',
                border: OutlineInputBorder(),
                suffixText: '°C',
                prefixIcon: Icon(Icons.thermostat, color: Colors.orange),
              ),
              validator: (value) {
                if (value != null && value.isNotEmpty) {
                  final val = double.tryParse(value);
                  if (val == null || val < 35 || val > 42) {
                    return 'Invalid temperature (35-42°C)';
                  }
                }
                return null;
              },
            ),

            const SizedBox(height: 16),

            // Weight
            TextFormField(
              controller: _weightController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                labelText: 'Weight',
                hintText: '65',
                border: OutlineInputBorder(),
                suffixText: 'kg',
                prefixIcon: Icon(Icons.monitor_weight, color: Colors.green),
              ),
              onChanged: (_) => _updateBMI(),
              validator: (value) {
                if (value != null && value.isNotEmpty) {
                  final val = double.tryParse(value);
                  if (val == null || val < 20 || val > 300) {
                    return 'Invalid weight (20-300 kg)';
                  }
                }
                return null;
              },
            ),

            const SizedBox(height: 16),

            // Height
            TextFormField(
              controller: _heightController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                labelText: 'Height',
                hintText: '165',
                border: OutlineInputBorder(),
                suffixText: 'cm',
                prefixIcon: Icon(Icons.height, color: Colors.blue),
              ),
              onChanged: (_) => _updateBMI(),
              validator: (value) {
                if (value != null && value.isNotEmpty) {
                  final val = double.tryParse(value);
                  if (val == null || val < 100 || val > 250) {
                    return 'Invalid height (100-250 cm)';
                  }
                }
                return null;
              },
            ),

            // BMI Display
            if (_calculatedBMI != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.teal.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('BMI:', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(
                      '${_calculatedBMI!.toStringAsFixed(1)} - ${HealthRecordsService.interpretBMI(_calculatedBMI)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 16),

            // Oxygen Saturation
            TextFormField(
              controller: _oxygenController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Oxygen Saturation',
                hintText: '98',
                border: OutlineInputBorder(),
                suffixText: '%',
                prefixIcon: Icon(Icons.air, color: Colors.cyan),
              ),
              validator: (value) {
                if (value != null && value.isNotEmpty) {
                  final val = int.tryParse(value);
                  if (val == null || val < 70 || val > 100) {
                    return 'Invalid O2 saturation (70-100%)';
                  }
                }
                return null;
              },
            ),

            const SizedBox(height: 16),

            // Notes
            TextFormField(
              controller: _notesController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Notes (optional)',
                hintText: 'Any additional observations...',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.note, color: Colors.grey),
              ),
            ),

            const SizedBox(height: 24),

            // Submit Button
            ElevatedButton(
              onPressed: _isSubmitting ? null : _submitVitalSigns,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                textStyle: const TextStyle(fontSize: 18),
              ),
              child: _isSubmitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text('Record Vital Signs'),
            ),

            const SizedBox(height: 16),

            // Info Card
            Card(
              color: Colors.blue.shade50,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: const [
                    Icon(Icons.info_outline, color: Colors.blue),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Enter at least one vital sign measurement. All fields are optional.',
                        style: TextStyle(fontSize: 12, color: Colors.blue),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
