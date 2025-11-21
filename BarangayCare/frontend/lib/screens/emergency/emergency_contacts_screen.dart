import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../services/emergency_service.dart';

class EmergencyContactsScreen extends StatefulWidget {
  const EmergencyContactsScreen({super.key});

  @override
  State<EmergencyContactsScreen> createState() => _EmergencyContactsScreenState();
}

class _EmergencyContactsScreenState extends State<EmergencyContactsScreen> {
  final EmergencyService _emergencyService = EmergencyService();
  
  List<Map<String, dynamic>> _contacts = [];
  List<Map<String, dynamic>> _categories = [];
  String? _selectedCategory;
  bool _isLoading = false;
  bool _isFindingNearest = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadCategories();
    _loadContacts();
  }

  /// Load category summary
  Future<void> _loadCategories() async {
    try {
      final categories = await _emergencyService.getCategories();
      if (!mounted) return;

      setState(() {
        _categories = categories;
      });
    } catch (e) {
      print('Error loading categories: $e');
    }
  }

  /// Load all contacts or filtered by category
  Future<void> _loadContacts() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final contacts = await _emergencyService.getAllContacts(
        category: _selectedCategory,
      );
      if (!mounted) return;

      setState(() {
        _contacts = contacts;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _errorMessage = 'Failed to load emergency contacts';
        _isLoading = false;
      });
    }
  }

  /// Find nearest emergency contacts based on user location
  Future<void> _findNearestContacts() async {
    setState(() {
      _isFindingNearest = true;
      _errorMessage = null;
    });

    try {
      // Check location permission
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception('Location permission denied');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception('Location permission permanently denied. Please enable in settings.');
      }

      // Get current position
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      if (!mounted) return;

      // Find nearest contacts
      final nearestContacts = await _emergencyService.getNearestContacts(
        latitude: position.latitude,
        longitude: position.longitude,
        category: _selectedCategory,
        maxDistance: 10000, // 10km radius
        limit: 10,
      );

      if (!mounted) return;

      setState(() {
        _contacts = nearestContacts;
        _isFindingNearest = false;
      });

      if (nearestContacts.isEmpty) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No emergency contacts found within 10km'),
            backgroundColor: Colors.orange,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
        _isFindingNearest = false;
      });

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_errorMessage ?? 'Failed to find nearest contacts'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  /// Make a phone call
  Future<void> _makeCall(String phoneNumber, String contactId) async {
    try {
      final uri = Uri.parse('tel:$phoneNumber');
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri);
        // Log the action
        await _emergencyService.logEmergencyAction(contactId, 'call');
      } else {
        throw Exception('Could not launch phone dialer');
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to make call: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  /// Send SMS
  Future<void> _sendSMS(String phoneNumber, String contactId) async {
    try {
      final uri = Uri.parse('sms:$phoneNumber');
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri);
        // Log the action
        await _emergencyService.logEmergencyAction(contactId, 'sms');
      } else {
        throw Exception('Could not launch SMS');
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to send SMS: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  /// Get icon for category
  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'hospital':
        return Icons.local_hospital;
      case 'ambulance':
        return Icons.airport_shuttle;
      case 'police':
        return Icons.local_police;
      case 'fire':
        return Icons.local_fire_department;
      case 'emergency':
        return Icons.emergency;
      default:
        return Icons.phone;
    }
  }

  /// Get color for category
  Color _getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'hospital':
        return Colors.blue;
      case 'ambulance':
        return Colors.orange;
      case 'police':
        return Colors.indigo;
      case 'fire':
        return Colors.red;
      case 'emergency':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Emergency Hotlines'),
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(_isFindingNearest ? Icons.hourglass_empty : Icons.my_location),
            onPressed: _isFindingNearest ? null : _findNearestContacts,
            tooltip: 'Find Nearest',
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _isLoading ? null : _loadContacts,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: Column(
        children: [
          // Quick Dial Section
          _buildQuickDialSection(),
          
          // Category Filter
          _buildCategoryFilter(),
          
          // Error Message
          if (_errorMessage != null)
            Container(
              padding: const EdgeInsets.all(12),
              color: Colors.red.shade100,
              child: Row(
                children: [
                  const Icon(Icons.error, color: Colors.red),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _errorMessage!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  ),
                ],
              ),
            ),
          
          // Contacts List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _contacts.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search_off, size: 64, color: Colors.grey.shade400),
                            const SizedBox(height: 16),
                            Text(
                              'No emergency contacts found',
                              style: TextStyle(color: Colors.grey.shade600, fontSize: 16),
                            ),
                            const SizedBox(height: 8),
                            TextButton.icon(
                              onPressed: _loadContacts,
                              icon: const Icon(Icons.refresh),
                              label: const Text('Try Again'),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(8),
                        itemCount: _contacts.length,
                        itemBuilder: (context, index) {
                          final contact = _contacts[index];
                          return _buildContactCard(contact);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  /// Build Quick Dial Section
  Widget _buildQuickDialSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.red.shade50,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Quick Dial',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.red,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildQuickDialButton('911', 'Emergency', Icons.emergency, Colors.red),
              _buildQuickDialButton('143', 'Fire', Icons.local_fire_department, Colors.orange),
              _buildQuickDialButton('117', 'Police', Icons.local_police, Colors.blue),
              _buildQuickDialButton('160', 'Ambulance', Icons.airport_shuttle, Colors.green),
            ],
          ),
        ],
      ),
    );
  }

  /// Build Quick Dial Button
  Widget _buildQuickDialButton(String number, String label, IconData icon, Color color) {
    return Column(
      children: [
        Material(
          color: color,
          borderRadius: BorderRadius.circular(50),
          child: InkWell(
            borderRadius: BorderRadius.circular(50),
            onTap: () => _makeCall(number, ''),
            child: Container(
              padding: const EdgeInsets.all(16),
              child: Icon(icon, color: Colors.white, size: 28),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          number,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  /// Build Category Filter
  Widget _buildCategoryFilter() {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 8),
        children: [
          _buildCategoryChip('All', null),
          ..._categories.map((cat) {
            final category = cat['category'] as String;
            final count = cat['count'] as int;
            return _buildCategoryChip(
              '${category[0].toUpperCase()}${category.substring(1)} ($count)',
              category,
            );
          }),
        ],
      ),
    );
  }

  /// Build Category Chip
  Widget _buildCategoryChip(String label, String? category) {
    final isSelected = _selectedCategory == category;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (selected) {
          setState(() {
            _selectedCategory = selected ? category : null;
          });
          _loadContacts();
        },
        selectedColor: Colors.red.shade100,
        checkmarkColor: Colors.red,
      ),
    );
  }

  /// Build Contact Card
  Widget _buildContactCard(Map<String, dynamic> contact) {
    final id = contact['_id'] as String? ?? '';
    final name = contact['name'] as String? ?? 'Unknown';
    final category = contact['category'] as String? ?? 'emergency';
    final phoneNumber = contact['phone_number'] as String? ?? '';
    final address = contact['address'] as String? ?? '';
    final operatingHours = contact['operating_hours'] as String? ?? '24/7';
    final distance = contact['distance'] as String?;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      elevation: 2,
      child: InkWell(
        onTap: () async {
          // Log view action
          await _emergencyService.logEmergencyAction(id, 'view');
        },
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with icon and category
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: _getCategoryColor(category).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      _getCategoryIcon(category),
                      color: _getCategoryColor(category),
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: _getCategoryColor(category),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                category.toUpperCase(),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            if (distance != null) ...[
                              const SizedBox(width: 8),
                              Icon(Icons.location_on, size: 14, color: Colors.grey.shade600),
                              const SizedBox(width: 4),
                              Text(
                                distance,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              
              // Contact Details
              if (phoneNumber.isNotEmpty) ...[
                Row(
                  children: [
                    Icon(Icons.phone, size: 16, color: Colors.grey.shade600),
                    const SizedBox(width: 8),
                    Text(
                      phoneNumber,
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
              ],
              
              if (address.isNotEmpty) ...[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.location_on, size: 16, color: Colors.grey.shade600),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        address,
                        style: const TextStyle(fontSize: 12),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
              ],
              
              Row(
                children: [
                  Icon(Icons.access_time, size: 16, color: Colors.grey.shade600),
                  const SizedBox(width: 8),
                  Text(
                    operatingHours,
                    style: const TextStyle(fontSize: 12),
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton.icon(
                    onPressed: () => _sendSMS(phoneNumber, id),
                    icon: const Icon(Icons.message, size: 18),
                    label: const Text('SMS'),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton.icon(
                    onPressed: () => _makeCall(phoneNumber, id),
                    icon: const Icon(Icons.phone, size: 18),
                    label: const Text('Call'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
