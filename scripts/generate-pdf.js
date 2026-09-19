import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

function getBase64Image(filePath) {
  const fileData = fs.readFileSync(filePath);
  return `data:image/jpeg;base64,${fileData.toString('base64')}`;
}

async function generatePDF() {
  console.log('Generating SYNTRA Feature Guide PDF...');

  // Create A4 PDF (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Paths
  const logoPath = path.resolve('public/previews/syntra_logo.jpg');
  const overviewPath = path.resolve('public/previews/overview_map.jpg');
  const navPath = path.resolve('public/previews/navigation_sos.jpg');
  const simPath = path.resolve('public/previews/simulation_twin.jpg');

  // Colors
  const darkBg = [11, 15, 20];
  const cardBg = [22, 29, 38];
  const textWhite = [255, 255, 255];
  const textMuted = [160, 175, 192];
  const cyanAccent = [0, 163, 255];
  const greenAccent = [53, 201, 139];
  const redAlert = [224, 90, 90];

  // Helper: Draw Background
  function drawPageBackground(pageNum, totalPages) {
    doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header strip
    doc.setDrawColor(40, 49, 60);
    doc.setLineWidth(0.5);
    doc.line(margin, 15, pageWidth - margin, 15);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 163, 255);
    doc.text('SYNTRA', margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('AI-POWERED TRAFFIC INTELLIGENCE & DIGITAL TWIN', margin + 20, 11);

    // Footer strip
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.text('CONFIDENTIAL & PROPRIETARY — HYDERABAD SMART MOBILITY SUITE', margin, pageHeight - 9);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
  }

  // ================= PAGE 1: COVER & EXECUTIVE SUMMARY =================
  drawPageBackground(1, 4);

  // Cover Hero Logo Image
  if (fs.existsSync(logoPath)) {
    const logoBase64 = getBase64Image(logoPath);
    doc.addImage(logoBase64, 'JPEG', margin, 22, contentWidth, 75);
  }

  let y = 104;

  // Title Box
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F');
  doc.setDrawColor(0, 163, 255);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('Product Architecture & Feature Guide', margin + 6, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 229, 255);
  doc.text('SYNTRA Urban Traffic Digital Twin Platform (Hyderabad Edition)', margin + 6, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const introText = 'SYNTRA is an end-to-end urban mobility platform integrating macro/micro traffic simulation, real-time Google Maps telemetry, optimal vehicle route guidance, and instant 108 emergency ambulance dispatch with corridor green-wave preemption.';
  const splitIntro = doc.splitTextToSize(introText, contentWidth - 12);
  doc.text(splitIntro, margin + 6, y + 25);

  y = 150;

  // Key Features Overview Matrix
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('1. Core Architectural Pillars', margin, y);

  y += 6;

  const pillars = [
    {
      title: 'Digital Twin City Simulation',
      desc: 'Real-time telemetry across 14+ major Hyderabad corridors, speed index calculations, incident heatmaps, and bottleneck prediction.',
      color: cyanAccent
    },
    {
      title: 'Optimal Router & Navigation',
      desc: 'Multi-criteria route planning (Fastest, Scenic, Eco-Friendly, Avoiding Bottlenecks) with clean route-only navigation and live GPS turn tracking.',
      color: greenAccent
    },
    {
      title: '108 Emergency SOS Dispatch',
      desc: 'One-touch in-vehicle emergency alert calculating the nearest trauma center, dispatching ALS ambulances with live countdown ETA.',
      color: redAlert
    },
    {
      title: 'What-If & Ripple Simulator',
      desc: 'Simulate road closures and metro flyover construction to model secondary congestion ripple effects and test AI mitigation strategies.',
      color: [180, 110, 240]
    }
  ];

  const colWidth = (contentWidth - 6) / 2;
  pillars.forEach((p, idx) => {
    const colX = margin + (idx % 2) * (colWidth + 6);
    const rowY = y + Math.floor(idx / 2) * 38;

    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(colX, rowY, colWidth, 34, 2, 2, 'F');
    doc.setDrawColor(40, 49, 60);
    doc.setLineWidth(0.4);
    doc.roundedRect(colX, rowY, colWidth, 34, 2, 2, 'D');

    // Color indicator bar
    doc.setFillColor(p.color[0], p.color[1], p.color[2]);
    doc.rect(colX, rowY, 3, 34, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(p.color[0], p.color[1], p.color[2]);
    doc.text(p.title, colX + 6, rowY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const splitDesc = doc.splitTextToSize(p.desc, colWidth - 10);
    doc.text(splitDesc, colX + 6, rowY + 15);
  });

  y = 236;
  // Specifications Box
  doc.setFillColor(18, 24, 32);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'F');
  doc.setDrawColor(40, 49, 60);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('Key Platform Specifications & Coverage', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('• Supported Region: Hyderabad Metropolitan Area (Gachibowli, Hitec City, Jubilee Hills, Secunderabad, Outer Ring Road)', margin + 6, y + 16);
  doc.text('• Mapping Engines: Dual-Engine architecture supporting Google Maps Platform Vector API and Leaflet Fallback', margin + 6, y + 23);
  doc.text('• Emergency Integration: Government 108 EMRI Emergency Ambulance Service with 8 pre-mapped trauma hospital nodes', margin + 6, y + 30);
  doc.text('• Real-Time Frequency: 5-second telemetry polling with AI congestion propagation forecasting', margin + 6, y + 37);

  // ================= PAGE 2: DIGITAL TWIN & OVERVIEW DASHBOARD =================
  doc.addPage();
  drawPageBackground(2, 4);

  let y2 = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('2. Feature 1: Digital Twin Citywide Traffic Control Center', margin, y2);

  y2 += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('High-fidelity operational map reflecting live corridor speeds, queue lengths, bottleneck clusters, and incident alerts.', margin, y2);

  y2 += 6;
  if (fs.existsSync(overviewPath)) {
    const mapBase64 = getBase64Image(overviewPath);
    doc.addImage(mapBase64, 'JPEG', margin, y2, contentWidth, 88);
  }

  y2 += 94;

  // Breakdown Card
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, y2, contentWidth, 75, 2, 2, 'F');
  doc.setDrawColor(40, 49, 60);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y2, contentWidth, 75, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
  doc.text('Digital Twin Functional Capabilities:', margin + 6, y2 + 9);

  const twinFeatures = [
    {
      name: 'Dynamic Lane Color Encoding:',
      desc: 'Corridors are rendered with distinct congestion states—Free Flow (Green), Moderate Density (Amber), and Severe Gridlock (Red).'
    },
    {
      name: 'Live Speed Index & Health Score:',
      desc: 'Continuous measurement of average city speed (target 38 km/h), vehicle density per lane km, and automated network stress indexes.'
    },
    {
      name: 'Incident Management & Reporting:',
      desc: 'Displays active accidents, road construction zones, stalled heavy vehicles, and waterlogging alerts with severity classification.'
    },
    {
      name: 'Corridor Filter Layers:',
      desc: 'Instant toggles for Google Traffic Layer, Bottlenecks, Signal Synchronization, and Emergency Priority Routes directly on the map HUD.'
    }
  ];

  let ty = y2 + 18;
  twinFeatures.forEach((tf) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
    doc.text(`• ${tf.name}`, margin + 6, ty);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const splitDesc = doc.splitTextToSize(tf.desc, contentWidth - 14);
    doc.text(splitDesc, margin + 10, ty + 5);
    ty += 13;
  });

  y2 += 80;
  // Key Telemetry Summary Table
  doc.setFillColor(18, 24, 32);
  doc.roundedRect(margin, y2, contentWidth, 42, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(greenAccent[0], greenAccent[1], greenAccent[2]);
  doc.text('HYDERABAD NETWORK TELEMETRY BENCHMARKS', margin + 6, y2 + 8);

  const metrics = [
    ['Monitored Corridors', '14 Key Arterials', 'Outer Ring Road, PVNR Expressway, Gachibowli Flyover'],
    ['Signal Control Nodes', '38 Synchronized Junctions', 'Adaptive Green Wave Corridor Automation'],
    ['Mean Incident Resolution', '18.4 Minutes', 'Automated Routing Diversion & Traffic Advisory Push'],
    ['Congestion Reduction', '-23% Peak Delay', 'Achieved through predictive vehicle balancing algorithms']
  ];

  let mY = y2 + 15;
  metrics.forEach(([label, val, note]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
    doc.text(label, margin + 6, mY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 163, 255);
    doc.text(val, margin + 55, mY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(note, margin + 98, mY);
    mY += 6.5;
  });

  // ================= PAGE 3: OPTIMAL ROUTER & EMERGENCY SOS =================
  doc.addPage();
  drawPageBackground(3, 4);

  let y3 = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('3. Feature 2: Clean Navigation & In-Vehicle 108 SOS Dispatch', margin, y3);

  y3 += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Turn-by-turn guidance with route-only display isolation and immediate emergency trauma center dispatch.', margin, y3);

  y3 += 6;
  if (fs.existsSync(navPath)) {
    const navBase64 = getBase64Image(navPath);
    doc.addImage(navBase64, 'JPEG', margin, y3, contentWidth, 88);
  }

  y3 += 94;

  // Feature Details
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, y3, contentWidth, 80, 2, 2, 'F');
  doc.setDrawColor(40, 49, 60);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y3, contentWidth, 80, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(redAlert[0], redAlert[1], redAlert[2]);
  doc.text('Emergency SOS & Clean Driving Mode Innovations:', margin + 6, y3 + 9);

  const navFeatures = [
    {
      name: 'Clean Route-Only Navigation Mode:',
      desc: 'Upon clicking "Start Navigation", the map hides all unrelated road lanes, bottleneck markers, and secondary polylines. Only the driver\'s active route, origin, and destination remain visible.'
    },
    {
      name: 'In-Vehicle Emergency SOS Button:',
      desc: 'A prominent pulsing red SOS Ambulance button sits directly at the top of the turn-by-turn navigation HUD, accessible with a single tap in case of a collision or medical emergency.'
    },
    {
      name: 'Proximity Hospital Assignment Engine:',
      desc: 'Calculates the closest trauma hospital (AIG Hospitals, Apollo Jubilee Hills, NIMS, or Care Hospital) based on live driver coordinates and dispatches an Advanced Life Support (ALS) 108 unit.'
    },
    {
      name: 'Corridor Green Wave Preemption:',
      desc: 'Transmits real-time signal override signals along the oncoming path to ensure continuous green lights for the approaching ambulance.'
    }
  ];

  let ny = y3 + 18;
  navFeatures.forEach((nf) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
    doc.text(`• ${nf.name}`, margin + 6, ny);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const splitDesc = doc.splitTextToSize(nf.desc, contentWidth - 14);
    doc.text(splitDesc, margin + 10, ny + 5);
    ny += 14.5;
  });

  y3 += 85;
  // SOS Ambulance Telemetry Box
  doc.setFillColor(32, 18, 22);
  doc.roundedRect(margin, y3, contentWidth, 38, 2, 2, 'F');
  doc.setDrawColor(224, 90, 90);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y3, contentWidth, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 100, 100);
  doc.text('108 AMBULANCE DISPATCH TELEMETRY (LIVE SCENARIO)', margin + 6, y3 + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('• Assigned Unit: ALS Ambulance #TS-108-EMRI-42 (Stationed at AIG Hospitals Gachibowli)', margin + 6, y3 + 16);
  doc.text('• Response Time: 4 minutes 12 seconds with Automated Green-Wave Corridor Clearing', margin + 6, y3 + 23);
  doc.text('• Automatic Incident Broadcast: Alert published to city digital twin & surrounding drivers diverted', margin + 6, y3 + 30);

  // ================= PAGE 4: WHAT-IF SIMULATION & GREEN WAVE =================
  doc.addPage();
  drawPageBackground(4, 4);

  let y4 = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('4. Feature 3: What-If Scenario Simulator & Ripple Analysis', margin, y4);

  y4 += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Evaluate the impact of infrastructure changes, VIP convoys, and road closures before physical deployment.', margin, y4);

  y4 += 6;
  if (fs.existsSync(simPath)) {
    const simBase64 = getBase64Image(simPath);
    doc.addImage(simBase64, 'JPEG', margin, y4, contentWidth, 88);
  }

  y4 += 94;

  // Features list
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, y4, contentWidth, 76, 2, 2, 'F');
  doc.setDrawColor(40, 49, 60);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y4, contentWidth, 76, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(greenAccent[0], greenAccent[1], greenAccent[2]);
  doc.text('Simulation & Decision-Support Capabilities:', margin + 6, y4 + 9);

  const simFeatures = [
    {
      name: 'Secondary Congestion Ripple Modeling:',
      desc: 'When a main artery (e.g., Gachibowli Flyover) is closed, SYNTRA models secondary overflow onto arterial bypasses (Financial District, Telecom Nagar) over 15, 30, and 60-minute horizons.'
    },
    {
      name: 'Signal Timing Optimization (Green Wave):',
      desc: 'Simulate coordinated signal offsets along key avenues (Madhapur to Begumpet) to create non-stop vehicle progression bands and reduce queue dissipation times by 35%.'
    },
    {
      name: 'AI-Powered Mitigation Recommendations:',
      desc: 'The integrated AI engine recommends dynamic signal duration adjustments, variable speed limits, and preemptive navigation re-routing to restore network equilibrium.'
    },
    {
      name: 'Live Historical Playback & Compare Modes:',
      desc: 'Side-by-side comparison of baseline traffic versus modified scenario parameters with travel time deltas and carbon emission projections.'
    }
  ];

  let sy = y4 + 18;
  simFeatures.forEach((sf) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
    doc.text(`• ${sf.name}`, margin + 6, sy);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const splitDesc = doc.splitTextToSize(sf.desc, contentWidth - 14);
    doc.text(splitDesc, margin + 10, sy + 5);
    sy += 13.5;
  });

  y4 += 81;
  // Final Sign-off Box
  doc.setFillColor(18, 24, 32);
  doc.roundedRect(margin, y4, contentWidth, 42, 2, 2, 'F');
  doc.setDrawColor(0, 163, 255);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y4, contentWidth, 42, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('SYNTRA — Urban Traffic Intelligence Platform', margin + 6, y4 + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Hyderabad Mobility Command & Traffic Management Cell', margin + 6, y4 + 17);
  doc.text('Status: Active Twin Instance | Version: 2.4-TWIN | Google Maps & Leaflet Hybrid Core', margin + 6, y4 + 24);
  doc.setTextColor(0, 229, 255);
  doc.text('Simulate the City Before It Moves. Powered by SYNTRA AI.', margin + 6, y4 + 32);

  // Output file
  const outputPath = path.resolve('public/SYNTRA_Product_Specification_and_Feature_Guide.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, pdfBuffer);

  // Also create shorter alias for direct downloads
  const aliasPath = path.resolve('public/SYNTRA_Feature_Guide.pdf');
  fs.writeFileSync(aliasPath, pdfBuffer);

  console.log(`PDF successfully generated at: ${outputPath} (${pdfBuffer.length} bytes)`);
}

generatePDF().catch(console.error);
