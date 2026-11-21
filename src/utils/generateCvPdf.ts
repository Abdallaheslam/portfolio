import { jsPDF } from 'jspdf';

interface CvExperienceEntry {
  role: string;
  meta: string;
  bullets: string[];
}

interface CvProjectEntry {
  title: string;
  bullets: string[];
}

const CV_RESUME_DATA = {
  name: 'ABDULLAH ESLAM HASSAN',
  headline: 'GENERAL IT SUPPORT | COMPUTER SCIENCE STUDENT',
  contact: 'Benha, Egypt | +20 115 599 6956 | abdallaheslam815@gmail.com',
  summary:
    'Computer Science student with hands-on experience in IT support operations, end-user assistance, hardware and software troubleshooting, and team coordination. Experienced in supporting staff at Toukh Central Hospital through SoluTech Programming Company, alongside online recruitment and project-based freelance responsive bilingual (RTL/LTR) web development. Familiar with Windows, Microsoft Office, networking, web/mobile tools, databases, and documentation.',
  experience: [
    {
      role: 'IT Support Team Leader',
      meta: 'SoluTech Programming Company | Client Site: Toukh Central Hospital | July 2025 - Present',
      bullets: [
        'Lead daily IT support operations and coordinate issue resolution.',
        'Provide hardware, software, printer, and network support to hospital staff.',
        'Assist users with Microsoft Word, Excel, and Outlook.',
        'Document incidents, maintain IT equipment, and support day-to-day technical operations.',
      ],
    },
    {
      role: 'Online HR Recruiter',
      meta: 'Dragons Unity | 2 months',
      bullets: [
        'Managed online recruitment activities and organized candidate information.',
        'Screened candidates, coordinated interviews, and maintained accurate records.',
        'Communicated with candidates throughout the recruitment process.',
      ],
    },
    {
      role: 'Freelance Web Developer',
      meta: 'Self-Employed - Freelance | Remote, Egypt | Project-Based',
      bullets: [
        'Designed and built responsive Arabic (RTL) and bilingual (RTL/LTR) websites using HTML, CSS, JavaScript, and modern UI patterns.',
        'Delivered custom web storefronts and service landing pages with direct WhatsApp ordering and mobile-first layouts.',
        'Collaborated remotely with clients on project-based work to gather requirements, refine UI/UX designs, and deploy production websites.',
      ],
    },
  ] satisfies CvExperienceEntry[],
  education: {
    degree: 'Bachelor of Computer Science (B.Sc.)',
    institution: 'Modern Academy for Computer Science and Management Technology, Maadi',
    period: '2023 - 2027 | Expected Graduation: 2027',
  },
  technicalSkills: [
    'IT Support & Troubleshooting',
    'Hardware & Software Support',
    'Printer & Network Support',
    'Windows',
    'Microsoft Word, Excel & Outlook',
    'Data Entry & Data Organization',
    'File & Document Management',
    'HTML, CSS & JavaScript',
    'Node.js & Express',
    'Dart & Flutter',
    'Firebase',
    'SQL & MongoDB',
    'Git & GitHub',
    'VS Code & Postman',
    'Figma / UI-UX Design',
    'OOP & CRUD Operations',
  ],
  projects: [
    {
      title: 'Flutter ToDo App',
      bullets: [
        'Developed a mobile application using Flutter with a Firebase backend.',
        'Implemented CRUD operations and user authentication.',
      ],
    },
    {
      title: 'Node.js Web Application',
      bullets: [
        'Built a web application using Node.js, Express, MongoDB, HTML, CSS, and JavaScript.',
        'Used Postman for API testing and development.',
      ],
    },
  ] satisfies CvProjectEntry[],
  coreSkills: [
    'Team Coordination',
    'Customer Communication',
    'Attention to Detail',
    'Accuracy & Quality Focus',
    'Time Management',
    'Task Organization',
    'Quick Learning',
    'Working Under Pressure',
    'Remote Work',
  ],
  languages: ['Arabic: Native', 'English: Intermediate (B1)'],
};

export function createCvPdfDocument(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 44;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 36;
  let cursorY = 40;

  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > bottomLimit) {
      doc.addPage();
      cursorY = 40;
    }
  };

  const drawBulletDot = (x: number, y: number) => {
    doc.setFillColor(37, 99, 235);
    doc.circle(x, y - 3, 1.35, 'F');
  };

  const addSectionHeading = (title: string) => {
    ensureSpace(26);
    cursorY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.8);
    doc.setTextColor(30, 64, 175);
    doc.text(title.toUpperCase(), marginX, cursorY);
    cursorY += 3.5;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.75);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 11.5;
  };

  const addWrappedText = (
    text: string,
    fontSize = 8.9,
    color: [number, number, number] = [51, 65, 85],
    fontStyle: 'normal' | 'bold' = 'normal',
    indent = 0,
    lineHeight = 11.6,
  ) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentWidth - indent) as string[];
    ensureSpace(lines.length * lineHeight + 2);
    for (const line of lines) {
      doc.text(line, marginX + indent, cursorY);
      cursorY += lineHeight;
    }
  };

  const addBulletLine = (text: string) => {
    const bulletX = marginX + 5;
    const textIndent = 14;
    const lineHeight = 11.4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    const lines = doc.splitTextToSize(text, contentWidth - textIndent) as string[];
    ensureSpace(lines.length * lineHeight + 1);
    drawBulletDot(bulletX, cursorY);
    doc.setTextColor(51, 65, 85);
    for (const line of lines) {
      doc.text(line, marginX + textIndent, cursorY);
      cursorY += lineHeight;
    }
  };

  const addMultiColumnBullets = (items: string[], columns: 2 | 3) => {
    const colGap = 14;
    const colWidth = (contentWidth - colGap * (columns - 1)) / columns;
    const rowCount = Math.ceil(items.length / columns);
    const rowHeight = 11.6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.7);

    for (let row = 0; row < rowCount; row++) {
      ensureSpace(rowHeight);
      for (let col = 0; col < columns; col++) {
        const item = items[col * rowCount + row];
        if (!item) continue;
        const colX = marginX + col * (colWidth + colGap);
        drawBulletDot(colX + 4, cursorY);
        doc.setTextColor(51, 65, 85);
        doc.text(item, colX + 11, cursorY, { maxWidth: colWidth - 12 });
      }
      cursorY += rowHeight;
    }
  };

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17.5);
  doc.setTextColor(15, 23, 42);
  doc.text(CV_RESUME_DATA.name, marginX, cursorY);
  cursorY += 14.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.8);
  doc.setTextColor(37, 99, 235);
  doc.text(CV_RESUME_DATA.headline, marginX, cursorY);
  cursorY += 12.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.6);
  doc.setTextColor(71, 85, 105);
  doc.text(CV_RESUME_DATA.contact, marginX, cursorY);
  cursorY += 7;

  // Professional Summary
  addSectionHeading('Professional Summary');
  addWrappedText(CV_RESUME_DATA.summary, 8.8, [51, 65, 85], 'normal', 0, 11.6);
  cursorY += 1;

  // Professional Experience
  addSectionHeading('Professional Experience');
  for (const job of CV_RESUME_DATA.experience) {
    ensureSpace(38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(job.role, marginX, cursorY);
    cursorY += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(job.meta, marginX, cursorY);
    cursorY += 11.5;

    for (const bullet of job.bullets) {
      addBulletLine(bullet);
    }
    cursorY += 3.5;
  }

  // Education
  addSectionHeading('Education');
  ensureSpace(32);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(CV_RESUME_DATA.education.degree, marginX, cursorY);
  cursorY += 11;

  addWrappedText(CV_RESUME_DATA.education.institution, 8.8, [51, 65, 85], 'normal', 0, 11.2);
  addWrappedText(CV_RESUME_DATA.education.period, 8.5, [71, 85, 105], 'normal', 0, 11);
  cursorY += 1;

  // Technical Skills
  addSectionHeading('Technical Skills');
  addMultiColumnBullets(CV_RESUME_DATA.technicalSkills, 2);
  cursorY += 1;

  // Projects
  addSectionHeading('Projects');
  for (const project of CV_RESUME_DATA.projects) {
    ensureSpace(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.4);
    doc.setTextColor(15, 23, 42);
    doc.text(project.title, marginX, cursorY);
    cursorY += 11;

    for (const bullet of project.bullets) {
      addBulletLine(bullet);
    }
    cursorY += 2.5;
  }

  // Core Skills
  addSectionHeading('Core Skills');
  addMultiColumnBullets(CV_RESUME_DATA.coreSkills, 3);
  cursorY += 1;

  // Languages
  addSectionHeading('Languages');
  addMultiColumnBullets(CV_RESUME_DATA.languages, 2);

  return doc;
}

export function getCvPdfBytes(): Uint8Array {
  const doc = createCvPdfDocument();
  return new Uint8Array(doc.output('arraybuffer'));
}

export function downloadCvPdf(): void {
  const doc = createCvPdfDocument();
  doc.save('Abdullah_Islam_CV.pdf');
}

export { CV_RESUME_DATA };
