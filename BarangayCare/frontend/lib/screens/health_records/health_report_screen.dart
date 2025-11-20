import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../providers/auth_provider.dart';
import '../../services/health_records_service.dart';

/// Health Report Screen
/// Generate and view health reports with charts and analytics
/// Demonstrates: Control Flow, Data Visualization, PDF Generation
class HealthReportScreen extends StatefulWidget {
  const HealthReportScreen({super.key});

  @override
  State<HealthReportScreen> createState() => _HealthReportScreenState();
}

class _HealthReportScreenState extends State<HealthReportScreen> {
  Map<String, dynamic>? _trends;
  bool _isLoading = true;
  bool _isGeneratingPDF = false;
  String? _errorMessage;
  int _selectedDays = 30;

  @override
  void initState() {
    super.initState();
    _loadTrends();
  }

  Future<void> _loadTrends() async {
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

      final trends =
          await HealthRecordsService.analyzeHealthTrends(token, days: _selectedDays);

      setState(() {
        _trends = trends;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _generatePDFReport() async {
    setState(() => _isGeneratingPDF = true);

    try {
      // Request storage permission for Android
      if (Platform.isAndroid) {
        // Check Android SDK version
        var status = await Permission.storage.status;
        
        // For Android 13+ (API 33+), use manageExternalStorage permission
        if (Platform.isAndroid) {
          // Try to get storage permission first
          if (!status.isGranted) {
            status = await Permission.storage.request();
          }
          
          // If storage permission denied, try manageExternalStorage for Android 13+
          if (!status.isGranted) {
            var manageStatus = await Permission.manageExternalStorage.status;
            if (!manageStatus.isGranted) {
              manageStatus = await Permission.manageExternalStorage.request();
              if (!manageStatus.isGranted) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Storage permission is required to save PDF reports. Please grant storage access in app settings.'),
                      backgroundColor: Colors.orange,
                      duration: Duration(seconds: 5),
                    ),
                  );
                }
                return;
              }
            }
          }
        }
      }

      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await authProvider.getIdToken();

      if (token == null) {
        throw Exception('Not authenticated');
      }

      final pdfBytes = await HealthRecordsService.generateHealthReport(token);

      // Save PDF to Downloads folder
      Directory? directory;
      if (Platform.isAndroid) {
        // Use external storage Downloads directory for Android
        directory = Directory('/storage/emulated/0/Download');
        
        // Fallback to external storage directory if Downloads not available
        if (!await directory.exists()) {
          directory = await getExternalStorageDirectory();
        }
      } else {
        // Use application documents directory for other platforms
        directory = await getApplicationDocumentsDirectory();
      }

      final fileName = 'health_report_${DateTime.now().millisecondsSinceEpoch}.pdf';
      final filePath = '${directory!.path}/$fileName';
      final file = File(filePath);
      await file.writeAsBytes(pdfBytes);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Report saved successfully: $fileName\nLocation: ${directory.path}'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 5),
            action: SnackBarAction(
              label: 'OK',
              textColor: Colors.white,
              onPressed: () {},
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error generating report: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isGeneratingPDF = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Health Reports'),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.picture_as_pdf),
            onPressed: _isGeneratingPDF ? null : _generatePDFReport,
            tooltip: 'Generate PDF',
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Colors.green),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            const Text(
              'Error loading health trends',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadTrends,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildPeriodSelector(),
          const SizedBox(height: 20),
          _buildTrendsOverview(),
          const SizedBox(height: 20),
          if (_trends?['weight']?['status'] == 'available')
            _buildWeightTrendCard(),
          if (_trends?['heart_rate']?['status'] == 'available')
            _buildHeartRateTrendCard(),
          const SizedBox(height: 20),
          _buildGenerateReportCard(),
        ],
      ),
    );
  }

  Widget _buildPeriodSelector() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Analysis Period',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            SegmentedButton<int>(
              segments: const [
                ButtonSegment(value: 7, label: Text('7 Days')),
                ButtonSegment(value: 30, label: Text('30 Days')),
                ButtonSegment(value: 90, label: Text('90 Days')),
              ],
              selected: {_selectedDays},
              onSelectionChanged: (Set<int> newSelection) {
                setState(() {
                  _selectedDays = newSelection.first;
                });
                _loadTrends();
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrendsOverview() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Health Trends Overview',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            if (_trends?['weight']?['status'] == 'available')
              _buildTrendRow('Weight', _trends!['weight']),
            if (_trends?['heart_rate']?['status'] == 'available')
              _buildTrendRow('Heart Rate', _trends!['heart_rate']),
            if (_trends?['temperature']?['status'] == 'available')
              _buildTrendRow('Temperature', _trends!['temperature']),
          ],
        ),
      ),
    );
  }

  Widget _buildTrendRow(String label, Map<String, dynamic> trendData) {
    final trend = trendData['trend'] ?? 'stable';
    final average = trendData['average'] ?? 0;
    final min = trendData['min'] ?? 0;
    final max = trendData['max'] ?? 0;

    IconData trendIcon;
    Color trendColor;

    switch (trend) {
      case 'increasing':
        trendIcon = Icons.trending_up;
        trendColor = Colors.red;
        break;
      case 'decreasing':
        trendIcon = Icons.trending_down;
        trendColor = Colors.blue;
        break;
      default:
        trendIcon = Icons.trending_flat;
        trendColor = Colors.green;
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
          ),
          Expanded(
            flex: 3,
            child: Text('Avg: $average ($min-$max)'),
          ),
          Icon(trendIcon, color: trendColor, size: 20),
          const SizedBox(width: 4),
          Text(
            trend,
            style: TextStyle(color: trendColor, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildWeightTrendCard() {
    final weightData = _trends!['weight'];
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Weight Trend',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: FlGridData(show: true),
                  titlesData: FlTitlesData(
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: true, reservedSize: 40),
                    ),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    rightTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    topTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                  ),
                  borderData: FlBorderData(show: true),
                  lineBarsData: [
                    LineChartBarData(
                      spots: [
                        FlSpot(0, weightData['min'].toDouble()),
                        FlSpot(1, weightData['average'].toDouble()),
                        FlSpot(2, weightData['max'].toDouble()),
                      ],
                      isCurved: true,
                      color: Colors.green,
                      barWidth: 3,
                      dotData: FlDotData(show: true),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Average: ${weightData['average']} kg | Range: ${weightData['min']}-${weightData['max']} kg',
              style: const TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeartRateTrendCard() {
    final hrData = _trends!['heart_rate'];
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Heart Rate Trend',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  gridData: FlGridData(show: true),
                  titlesData: FlTitlesData(
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: true, reservedSize: 40),
                    ),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          switch (value.toInt()) {
                            case 0:
                              return const Text('Min');
                            case 1:
                              return const Text('Avg');
                            case 2:
                              return const Text('Max');
                            default:
                              return const Text('');
                          }
                        },
                      ),
                    ),
                    rightTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    topTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                  ),
                  borderData: FlBorderData(show: true),
                  barGroups: [
                    BarChartGroupData(
                      x: 0,
                      barRods: [
                        BarChartRodData(
                          toY: hrData['min'].toDouble(),
                          color: Colors.blue,
                        ),
                      ],
                    ),
                    BarChartGroupData(
                      x: 1,
                      barRods: [
                        BarChartRodData(
                          toY: hrData['average'].toDouble(),
                          color: Colors.red,
                        ),
                      ],
                    ),
                    BarChartGroupData(
                      x: 2,
                      barRods: [
                        BarChartRodData(
                          toY: hrData['max'].toDouble(),
                          color: Colors.orange,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Average: ${hrData['average']} bpm | Range: ${hrData['min']}-${hrData['max']} bpm',
              style: const TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGenerateReportCard() {
    return Card(
      elevation: 2,
      color: Colors.green.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.description, color: Colors.green, size: 32),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Generate PDF Report',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Text(
              'Download a comprehensive PDF report of your health records including consultations, vital signs, and health trends.',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _isGeneratingPDF ? null : _generatePDFReport,
                icon: _isGeneratingPDF
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Icon(Icons.download),
                label: Text(_isGeneratingPDF
                    ? 'Generating...'
                    : 'Download PDF Report'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
