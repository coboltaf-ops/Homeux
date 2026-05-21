import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as Blob;

    if (!pdfFile) {
      return NextResponse.json(
        { success: false, error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Convertir Blob a Buffer
    const buffer = Buffer.from(await pdfFile.arrayBuffer());

    // Ruta donde guardar el PDF
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
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'PDF guardado exitosamente en carpeta reformas',
      filePath: '/reformas/Propuesta-Reforma-Leon-Jaime-Velasquez.pdf',
    });
  } catch (error) {
    console.error('Error guardando PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar PDF' },
      { status: 500 }
    );
  }
}
