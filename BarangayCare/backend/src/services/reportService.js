import PDFDocument from 'pdfkit';
import { getHealthProfile, analyzeHealthTrends, getHealthRecordsByDateRange } from './healthRecordsService.js';

/**
 * Report Service
 * Generates PDF health reports for patients
 * Demonstrates: Abstraction, Subprograms
 */

/**
 * Generate comprehensive health report PDF
 * Abstraction: Abstract interface for PDF generation
 */
export async function generateHealthReport(firebaseUid, options = {}) {
  try {
    const { reportType = 'comprehensive', startDate, endDate, includeTrends = true } = options;

    // Fetch health data based on report type (Control Flow)
    let healthData;
    
    if (reportType === 'comprehensive') {
      healthData = await getHealthProfile(firebaseUid);
    } else if (reportType === 'date_range' && startDate && endDate) {
      healthData = await getHealthRecordsByDateRange(firebaseUid, startDate, endDate);
    } else {
      throw new Error('Invalid report type or missing date range');
    }

    // Get trends if requested
    let trends = null;
    if (includeTrends) {
      trends = await analyzeHealthTrends(firebaseUid, 30);
    }

    // Create PDF
    const pdfBuffer = await createPDFReport(healthData, trends, reportType);

    return {
      success: true,
      report_type: reportType,
      generated_at: new Date(),
      pdf_buffer: pdfBuffer
    };
  } catch (error) {
    console.error('Error generating health report:', error);
    throw error;
  }
}

/**
 * Create PDF document
 * Subprogram: PDF creation logic
 */
async function createPDFReport(healthData, trends, reportType) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];

      // Collect PDF data
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Generate PDF content
      generatePDFHeader(doc);
      
      if (reportType === 'comprehensive') {
        generatePatientInfo(doc, healthData.patient_info);
        generateHealthSummary(doc, healthData.summary);
        generateConditionsSection(doc, healthData.conditions);
        generateConsultationsSection(doc, healthData.consultations);
        generateVitalSignsSection(doc, healthData.vital_signs);
        
        if (trends) {
          generateTrendsSection(doc, trends);
        }
      } else if (reportType === 'date_range') {
        generateDateRangeReport(doc, healthData);
      }

      generatePDFFooter(doc);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate PDF header
 * Subprogram: Header formatting
 */
function generatePDFHeader(doc) {
  doc
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('BarangayCare Health Report', { align: 'center' })
    .moveDown(0.5);
  
  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, { align: 'center' })
    .moveDown(1);

  // Horizontal line
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke()
    .moveDown(1);
}

/**
 * Generate patient information section
 * Subprogram: Patient info formatting
 */
function generatePatientInfo(doc, patientInfo) {
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Patient Information', { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(11)
    .font('Helvetica');

  const info = [
    ['Name', patientInfo.name],
    ['Age', `${patientInfo.age} years old`],
    ['Gender', patientInfo.gender],
    ['Blood Type', patientInfo.blood_type || 'Not specified'],
    ['Contact', patientInfo.contact]
  ];

  info.forEach(([label, value]) => {
    doc
      .font('Helvetica-Bold')
      .text(label + ': ', { continued: true })
      .font('Helvetica')
      .text(value);
  });

  if (patientInfo.allergies && patientInfo.allergies.length > 0) {
    doc
      .font('Helvetica-Bold')
      .text('Allergies: ', { continued: true })
      .fillColor('red')
      .font('Helvetica')
      .text(patientInfo.allergies.join(', '))
      .fillColor('black');
  }

  doc.moveDown(1.5);
}

/**
 * Generate health summary section
 * Subprogram: Summary statistics formatting
 */
function generateHealthSummary(doc, summary) {
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Health Summary', { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(11)
    .font('Helvetica');

  const summaryData = [
    ['Total Consultations', summary.total_consultations],
    ['Vital Signs Records', summary.total_vital_records],
    ['Medical Documents', summary.total_documents],
    ['Active Conditions', summary.active_conditions]
  ];

  summaryData.forEach(([label, value]) => {
    doc
      .font('Helvetica-Bold')
      .text(label + ': ', { continued: true })
      .font('Helvetica')
      .text(value.toString());
  });

  doc.moveDown(1.5);
}

/**
 * Generate conditions section
 * Subprogram: Medical conditions formatting
 */
function generateConditionsSection(doc, conditions) {
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Medical Conditions', { underline: true })
    .moveDown(0.5);

  if (!conditions || conditions.length === 0) {
    doc
      .fontSize(11)
      .font('Helvetica-Oblique')
      .text('No recorded medical conditions')
      .moveDown(1.5);
    return;
  }

  doc.fontSize(11).font('Helvetica');

  conditions.slice(0, 10).forEach((condition, index) => {
    const statusColor = condition.status === 'active' ? 'red' : 
                       condition.status === 'resolved' ? 'green' : 'orange';
    
    doc
      .font('Helvetica-Bold')
      .text(`${index + 1}. ${condition.condition_name}`, { continued: true })
      .font('Helvetica')
      .text(` - Diagnosed: ${new Date(condition.diagnosed_date).toLocaleDateString()}`);
    
    doc
      .fillColor(statusColor)
      .text(`   Status: ${condition.status.toUpperCase()} | Severity: ${condition.severity}`)
      .fillColor('black');

    if (condition.notes) {
      doc.text(`   Notes: ${condition.notes}`);
    }

    doc.moveDown(0.5);
  });

  doc.moveDown(1);
}

/**
 * Generate consultations section
 * Subprogram: Consultation history formatting
 */
function generateConsultationsSection(doc, consultations) {
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Recent Consultations', { underline: true })
    .moveDown(0.5);

  if (!consultations || consultations.length === 0) {
    doc
      .fontSize(11)
      .font('Helvetica-Oblique')
      .text('No consultation records')
      .moveDown(1.5);
    return;
  }

  doc.fontSize(10).font('Helvetica');

  consultations.slice(0, 5).forEach((consultation, index) => {
    // Check if we need a new page
    if (doc.y > 700) {
      doc.addPage();
    }

    const doctorName = consultation.doctor ? 
      `Dr. ${consultation.doctor.name}` : 'Unknown Doctor';
    
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(`${index + 1}. ${new Date(consultation.consultation_date).toLocaleDateString()} - ${doctorName}`)
      .fontSize(10)
      .font('Helvetica');

    if (consultation.chief_complaint) {
      doc.text(`   Chief Complaint: ${consultation.chief_complaint}`);
    }

    if (consultation.diagnosis) {
      doc.text(`   Diagnosis: ${consultation.diagnosis}`);
    }

    if (consultation.treatment_plan) {
      doc.text(`   Treatment: ${consultation.treatment_plan}`);
    }

    if (consultation.notes) {
      doc.text(`   Notes: ${consultation.notes}`);
    }

    doc.moveDown(0.7);
  });

  doc.moveDown(1);
}

/**
 * Generate vital signs section
 * Subprogram: Vital signs formatting with table
 */
function generateVitalSignsSection(doc, vitalSigns) {
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Recent Vital Signs', { underline: true })
    .moveDown(0.5);

  if (!vitalSigns || vitalSigns.length === 0) {
    doc
      .fontSize(11)
      .font('Helvetica-Oblique')
      .text('No vital signs records')
      .moveDown(1.5);
    return;
  }

  // Check if we need a new page
  if (doc.y > 650) {
    doc.addPage();
  }

  doc.fontSize(9).font('Helvetica');

  // Table header
  const tableTop = doc.y;
  const col1X = 50;
  const col2X = 130;
  const col3X = 200;
  const col4X = 260;
  const col5X = 320;
  const col6X = 400;

  doc
    .font('Helvetica-Bold')
    .text('Date', col1X, tableTop)
    .text('BP', col2X, tableTop)
    .text('HR', col3X, tableTop)
    .text('Temp', col4X, tableTop)
    .text('Weight', col5X, tableTop)
    .text('O2 Sat', col6X, tableTop);

  doc.moveDown(0.3);

  // Table rows
  doc.font('Helvetica');
  vitalSigns.slice(0, 10).forEach((vital) => {
    const rowY = doc.y;
    
    doc
      .text(new Date(vital.recorded_at).toLocaleDateString(), col1X, rowY, { width: 75 })
      .text(vital.blood_pressure || '-', col2X, rowY, { width: 65 })
      .text(vital.heart_rate ? `${vital.heart_rate} bpm` : '-', col3X, rowY, { width: 55 })
      .text(vital.temperature ? `${vital.temperature}°C` : '-', col4X, rowY, { width: 55 })
      .text(vital.weight ? `${vital.weight} kg` : '-', col5X, rowY, { width: 75 })
      .text(vital.oxygen_saturation ? `${vital.oxygen_saturation}%` : '-', col6X, rowY, { width: 50 });

    doc.moveDown(0.5);
  });

  doc.moveDown(1);
}

/**
 * Generate trends section
 * Subprogram: Health trends visualization
 */
function generateTrendsSection(doc, trends) {
  // Check if we need a new page
  if (doc.y > 650) {
    doc.addPage();
  }

  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Health Trends Analysis', { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`Period: ${trends.period}`)
    .moveDown(0.5);

  // Weight trend
  if (trends.weight && trends.weight.status === 'available') {
    generateTrendItem(doc, 'Weight', trends.weight, 'kg');
  }

  // Blood pressure trend
  if (trends.blood_pressure && trends.blood_pressure.status === 'available') {
    doc
      .font('Helvetica-Bold')
      .text('Blood Pressure: ', { continued: true })
      .font('Helvetica')
      .text(`Average: ${trends.blood_pressure.average}`);
    
    doc.text(`  Systolic: ${trends.blood_pressure.systolic.average} (${trends.blood_pressure.systolic.min}-${trends.blood_pressure.systolic.max})`);
    doc.text(`  Diastolic: ${trends.blood_pressure.diastolic.average} (${trends.blood_pressure.diastolic.min}-${trends.blood_pressure.diastolic.max})`);
    doc.moveDown(0.5);
  }

  // Heart rate trend
  if (trends.heart_rate && trends.heart_rate.status === 'available') {
    generateTrendItem(doc, 'Heart Rate', trends.heart_rate, 'bpm');
  }

  // BMI trend
  if (trends.bmi && trends.bmi.status === 'available') {
    generateTrendItem(doc, 'BMI', trends.bmi, '');
  }

  doc.moveDown(1);
}

/**
 * Generate individual trend item
 * Subprogram: Helper for trend formatting
 */
function generateTrendItem(doc, label, trendData, unit) {
  const trendArrow = trendData.trend === 'increasing' ? '↑' : 
                    trendData.trend === 'decreasing' ? '↓' : '→';
  
  const trendColor = trendData.trend === 'increasing' ? 'red' : 
                     trendData.trend === 'decreasing' ? 'blue' : 'black';

  doc
    .font('Helvetica-Bold')
    .fillColor('black')
    .text(`${label}: `, { continued: true })
    .font('Helvetica')
    .text(`Average: ${trendData.average}${unit} (${trendData.min}-${trendData.max}${unit})`, { continued: true })
    .fillColor(trendColor)
    .text(` ${trendArrow} ${trendData.trend}`)
    .fillColor('black');

  doc.text(`  ${trendData.data_points} data points`);
  doc.moveDown(0.5);
}

/**
 * Generate date range report
 * Subprogram: Specialized date range formatting
 */
function generateDateRangeReport(doc, healthData) {
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text(`Health Records from ${new Date(healthData.period.start).toLocaleDateString()} to ${new Date(healthData.period.end).toLocaleDateString()}`)
    .moveDown(1);

  generateConsultationsSection(doc, healthData.consultations);
  generateVitalSignsSection(doc, healthData.vital_signs);
}

/**
 * Generate PDF footer
 * Subprogram: Footer formatting
 */
function generatePDFFooter(doc) {
  const bottomMargin = 50;
  const pageHeight = doc.page.height;

  doc
    .fontSize(8)
    .font('Helvetica-Oblique')
    .text(
      'This is a confidential medical document. For authorized use only.',
      50,
      pageHeight - bottomMargin,
      { align: 'center', width: 500 }
    );

  doc
    .fontSize(8)
    .text(
      'Generated by BarangayCare Health Management System',
      50,
      pageHeight - bottomMargin + 15,
      { align: 'center', width: 500 }
    );
}

/**
 * Generate quick summary report (simplified version)
 * Subprogram: Simplified report generation
 */
export async function generateQuickSummary(firebaseUid) {
  try {
    const healthData = await getHealthProfile(firebaseUid);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    
    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      generatePDFHeader(doc);
      generatePatientInfo(doc, healthData.patient_info);
      generateHealthSummary(doc, healthData.summary);
      generatePDFFooter(doc);

      doc.end();
    });

    return {
      success: true,
      report_type: 'quick_summary',
      generated_at: new Date(),
      pdf_buffer: pdfBuffer
    };
  } catch (error) {
    console.error('Error generating quick summary:', error);
    throw error;
  }
}
