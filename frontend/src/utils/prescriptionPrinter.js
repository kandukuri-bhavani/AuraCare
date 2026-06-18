/**
 * Utility helper to compile a clean, formal medical prescription layout
 * and trigger the browser's print engine to generate a high-fidelity PDF.
 */
export const printPrescription = (pres, patient, doctor, hospital) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Please allow popups to print / download the prescription chart.');
    return;
  }

  // Format date
  const presDate = pres?.date ? new Date(pres.date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) : new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AuraCare Digital Prescription - ${pres?.appointmentId || 'Rx'}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #1e293b;
          padding: 40px;
          margin: 0;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0f766e;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        .logo {
          font-size: 22px;
          font-weight: 800;
          color: #1e293b;
        }
        .logo span {
          color: #0f766e;
        }
        .badge {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .rx-title {
          font-size: 26px;
          font-weight: 850;
          color: #0f766e;
          margin-bottom: 20px;
        }
        .meta-grid {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 20px;
          border-radius: 16px;
        }
        .meta-section h3 {
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          margin: 0 0 8px 0;
          letter-spacing: 0.05em;
        }
        .meta-section p {
          margin: 4px 0;
          font-size: 12.5px;
          color: #475569;
        }
        .meta-section strong {
          color: #0f172a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }
        th {
          background-color: #f1f5f9;
          text-align: left;
          font-size: 10px;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          padding: 12px 14px;
          border-bottom: 2px solid #cbd5e1;
          letter-spacing: 0.02em;
        }
        td {
          padding: 12px 14px;
          font-size: 12.5px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        .advice-box {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #78350f;
          padding: 18px;
          border-radius: 16px;
          margin-bottom: 35px;
        }
        .advice-box h3 {
          margin: 0 0 6px 0;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .advice-box p {
          margin: 0;
          font-size: 12.5px;
          line-height: 1.6;
        }
        .footer {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          font-size: 10.5px;
          color: #64748b;
        }
        .signature {
          text-align: center;
        }
        .signature-line {
          width: 160px;
          border-bottom: 1.5px solid #94a3b8;
          margin-bottom: 6px;
          margin-left: auto;
          margin-right: auto;
        }
        @media print {
          body {
            padding: 10px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          Aura<span>Care</span> Clinicians Network
        </div>
        <div class="badge">NHA Certified Digital Rx</div>
      </div>

      <div class="rx-title">℞ Medical Prescription</div>

      <div class="meta-grid">
        <div class="meta-section">
          <h3>Consulting Specialist</h3>
          <p><strong>${doctor?.name || 'Dr. Specialist'}</strong></p>
          <p>${doctor?.specialization || 'Clinical Specialist'}</p>
          <p>${hospital?.name || 'AuraCare Registered Clinic'}</p>
        </div>
        <div class="meta-section">
          <h3>Patient Demographics</h3>
          <p><strong>Patient Name:</strong> ${patient?.name || 'Rohan Verma'}</p>
          <p><strong>Demographics:</strong> Age: ${patient?.age || '32'} &bull; Gender: ${patient?.gender || 'Male'}</p>
          <p><strong>ABHA Card ID:</strong> ${patient?.abhaId || '91-2083-4859-1039'}</p>
          <p><strong>Date of Consultation:</strong> ${presDate}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 35%">Drug Name & Strength</th>
            <th style="width: 15%">Dosage</th>
            <th style="width: 35%">Frequency Instruction</th>
            <th style="width: 15%">Duration</th>
          </tr>
        </thead>
        <tbody>
          ${pres.medicines?.map(med => `
            <tr>
              <td><strong>${med.name}</strong></td>
              <td>${med.dosage}</td>
              <td>${med.frequency}</td>
              <td>${med.duration}</td>
            </tr>
          `).join('') || `
            <tr>
              <td colspan="4" style="text-align: center; color: #94a3b8; font-style: italic;">No drug directives listed.</td>
            </tr>
          `}
        </tbody>
      </table>

      ${pres.advice ? `
        <div class="advice-box">
          <h3>Dietary & Clinical Advice</h3>
          <p>${pres.advice}</p>
        </div>
      ` : ''}

      <div class="footer">
        <div>
          <p>Booking ID: ${pres.appointmentId || 'AuraCare-Rx'}</p>
          <p>This is a secure electronic record issued under National Health Authority standards.</p>
        </div>
        <div class="signature">
          <div class="signature-line"></div>
          <p>Electronically Certified By</p>
          <p><strong>${doctor?.name || 'Consulting Practitioner'}</strong></p>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
