import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    // Generar PDF desde la página de oferta reforma
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Navegar a la página local
    await page.goto('http://localhost:3001/oferta-reforma', {
      waitUntil: 'networkidle0',
    });

    // Generar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      printBackground: true,
    });

    await browser.close();

    // Guardar en la carpeta reformas
    const filePath = path.join(
      process.cwd(),
      'public/reformas',
      'Propuesta-Reforma-Leon-Jaime-Velasquez.pdf'
    );

    // Crear la carpeta si no existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Guardar el archivo
    fs.writeFileSync(filePath, pdfBuffer);

    return NextResponse.json({
      success: true,
      message: 'PDF generado exitosamente',
      filePath: '/reformas/Propuesta-Reforma-Leon-Jaime-Velasquez.pdf',
    });
  } catch (error) {
    console.error('Error generando PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}
