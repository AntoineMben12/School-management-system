import { PDFDocument } from 'pdfkit';

export function generateReportCardPdf(reportCard) {
    const pdfDoc = PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText(reportCard.studentName);
    page.drawText(reportCard.class);
    page.drawText(reportCard.term);
    page.drawText(reportCard.academicYear);
    page.drawText(reportCard.totalAverage);
    page.drawText(reportCard.rankInClass);
    page.drawText(reportCard.remarks);
    return pdfDoc.save();
}