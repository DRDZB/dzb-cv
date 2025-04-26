// Usage: pnpm tsx src/scripts/generate-pdfs.ts <job-posting-directory>
// Example: pnpm tsx src/scripts/generate-pdfs.ts job-postings/indeed-village-green-assistant-manager-palatine-il-4a0f6f67a3267662
//
// This script will look for source/Dawn_Zurick_Beilfuss_CV.md and source/Dawn_Zurick_Beilfuss_Cover_Letter.md in the given directory,
// and output HTML and PDF versions to generated/.

import { MarkdownConverter } from '../utils/markdown-converter.js';
import { HTMLToPDFConverter } from '../utils/html-to-pdf.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'node:fs/promises';
import path from 'node:path';

async function generatePDFsForJob(jobDir: string) {
  // Use pdfMode for PDF output
  const markdownConverter = new MarkdownConverter({}, true);
  const htmlToPdf = new HTMLToPDFConverter();

  const sourceDir = path.join(jobDir, 'source');
  const generatedDir = path.join(jobDir, 'generated');
  await fs.mkdir(generatedDir, { recursive: true });

  // File names
  const files = [
    {
      name: 'CV',
      md: 'Dawn_Zurick_Beilfuss_CV.md',
      html: 'Dawn_Zurick_Beilfuss_CV.html',
      pdf: 'Dawn_Zurick_Beilfuss_CV.pdf',
      title: 'Dawn Zurick Beilfuss',
      subtitle: 'Curriculum Vitae',
    },
    {
      name: 'Cover Letter',
      md: 'Dawn_Zurick_Beilfuss_Cover_Letter.md',
      html: 'Dawn_Zurick_Beilfuss_Cover_Letter.html',
      pdf: 'Dawn_Zurick_Beilfuss_Cover_Letter.pdf',
      title: 'Dawn Zurick Beilfuss',
      subtitle: 'Cover Letter',
    },
  ];

  for (const file of files) {
    const mdPath = path.join(sourceDir, file.md);
    try {
      const markdown = await fs.readFile(mdPath, 'utf-8');
      // Convert to HTML (normal for HTML output, pdfMode for PDF output)
      const html = markdownConverter.convertToHTML(markdown, file.title, file.subtitle, {
        suppressHeadings: true,
        pdfMode: false,
      });
      const htmlPath = path.join(generatedDir, file.html);
      await fs.writeFile(htmlPath, html);
      // Convert to PDF (with pdfMode and suppressHeadings)
      const pdfHtml = markdownConverter.convertToHTML(markdown, file.title, file.subtitle, {
        suppressHeadings: true,
        pdfMode: true,
      });
      const pdfBytes = await htmlToPdf.convertToPDF(pdfHtml);
      const pdfPath = path.join(generatedDir, file.pdf);
      await fs.writeFile(pdfPath, pdfBytes);
      // For cover letter, warn if >1 page
      if (file.name === 'Cover Letter') {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        if (pdfDoc.getPageCount() > 1) {
          console.warn(
            'Warning: Cover letter exceeds one page! Consider shortening the content or adjusting formatting.',
          );
        }
      }
      console.log(`${file.name}: HTML and PDF generated.`);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        console.warn(`${file.name} markdown not found at ${mdPath}, skipping.`);
      } else {
        console.error(`Error processing ${file.name}:`, err);
      }
    }
  }
  await htmlToPdf.close();
  console.log('Done!');
}

// Accept CLI argument for job posting directory
const [, , jobDir] = process.argv;
if (!jobDir) {
  console.error('Usage: pnpm tsx src/scripts/generate-pdfs.ts <job-posting-directory>');
  process.exit(1);
}

generatePDFsForJob(jobDir).catch(console.error);
