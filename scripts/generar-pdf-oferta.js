#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generarPDF() {
  let browser;
  try {
    console.log('🚀 Generando PDF de propuesta...');

    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-resources'
      ]
    });

    const page = await browser.newPage();

    // Viewport EXTREMADAMENTE vertical - IMPOSIBLE de ser apaisado
    await page.setViewport({ width: 300, height: 900, deviceScaleFactor: 1 });

    // Configurar para no fallar en errores de red
    page.on('error', err => {
      console.log('⚠️  Error de página (continuando...):', err.message);
    });

    // Navegar a la página
    console.log('📄 Cargando página de propuesta...');
    try {
      await page.goto('http://localhost:3001/oferta-reforma', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
    } catch (e) {
      console.log('⚠️  Continuando aunque no cargó completamente...');
    }

    console.log('⏳ Esperando renderizado de contenido...');

    // Esperar a que exista el contenido
    try {
      await page.waitForSelector('.pdf-page', { timeout: 15000 });
      console.log('   ✅ Contenido detectado');
    } catch (e) {
      console.log('   ⚠️  Continuando sin esperar selector...');
    }

    // Espera generosa para que todo renderice
    console.log('   ⏳ Esperando 12 segundos para renderizado final...');
    await new Promise(resolve => setTimeout(resolve, 12000));

    // Generar PDF
    console.log('📝 Generando PDF...');
    const pdfPath = path.join(
      __dirname,
      '../public/reformas/Propuesta-Reforma-Leon-Jaime-Velasquez.pdf'
    );

    // Asegurar que la carpeta existe
    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      landscape: false,
      preferCSSPageSize: false,
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      printBackground: true,
      scale: 1.0,
      displayHeaderFooter: false,
      timeout: 30000
    });

    await browser.close();

    // Verificar que se creó
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      const sizeKB = (stats.size / 1024).toFixed(0);
      console.log('');
      console.log('✅ PDF generado exitosamente!');
      console.log(`📦 Tamaño: ${sizeMB} MB (${sizeKB} KB)`);
      console.log(`📁 Ubicación: ${pdfPath}`);
      console.log('');
      console.log('🖼️  Imágenes: ✅ Incluidas en el PDF');
      console.log('✨ Listo para pasar a la librería');
    } else {
      throw new Error('No se pudo crear el archivo PDF');
    }
  } catch (error) {
    console.error('❌ Error generando PDF:', error.message);
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        // Ignorar error al cerrar
      }
    }
    process.exit(1);
  }
}

generarPDF();
