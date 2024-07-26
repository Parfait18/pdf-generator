import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { join } from 'path';

@Injectable()
export class PdfService {
  async generatePdf(templatePath: string, data: any): Promise<string> {
    // Load the HTML template
    const templateHtml = fs.readFileSync(templatePath, 'utf8');

    // Compile the template with Handlebars
    const template = handlebars.compile(templateHtml);

    // Generate the final HTML by injecting data
    const finalHtml = template(data);

    // Generate the PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Save the PDF to the public directory
    const pdfFileName = `file-${Date.now()}.pdf`;
    const pdfPath = join(__dirname, '..', '..', 'public', pdfFileName);
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Return the filename
    return pdfFileName;
  }
}