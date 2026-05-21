'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import { usePersonalStore, type Personal } from '@/features/personal/store/personal-store';
import { useConfigStore } from '@/features/configuracion/store/configuracion-store';
import { exportToExcel, exportToPDF, printTable } from '@/shared/lib/export-helpers';
import { compressImage } from '@/shared/lib/compress-image';

const inputSt: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  borderRadius: 8,
  padding: '8px 12px',
  width: '100%',
  outline: 'none',
  fontSize: 14,
};

const selectSt: React.CSSProperties = {
  background: 'rgba(41,15,5,0.9)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  borderRadius: 8,
  padding: '8px 12px',
  width: '100%',
  outline: 'none',
  fontSize: 14,
};

const primaryBtnSt: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(30,64,175,0.8), rgba(59,130,246,0.6))',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
};

const verBtnSt: React.CSSProperties = {
  background: 'rgba(4,120,87,0.9)',
  border: '1px solid rgba(4,120,87,1)',
  color: '#fff',
  borderRadius: 6,
  padding: '6px 14px',
  cursor: 'pointer',
  fontSize: 13,
};

const editBtnSt: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(30,64,175,0.8), rgba(59,130,246,0.6))',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '6px 14px',
  cursor: 'pointer',
  fontSize: 13,
};

const deleteBtnSt: React.CSSProperties = {
  background: 'rgba(220,38,38,0.9)',
  border: '1px solid rgba(220,38,38,1)',
  color: '#fff',
  borderRadius: 6,
  padding: '6px 14px',
  cursor: 'pointer',
  fontSize: 13,
};

const pdfBtnSt: React.CSSProperties = {
  background: 'rgba(220,38,38,0.9)',
  border: '1px solid rgba(220,38,38,1)',
  color: '#fff',
  borderRadius: 8,
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
};

const excelBtnSt: React.CSSProperties = {
  background: 'rgba(4,120,87,0.9)',
  border: '1px solid rgba(4,120,87,1)',
  color: '#fff',
  borderRadius: 8,
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
};

const imprimirBtnSt: React.CSSProperties = {
  background: 'rgba(202,138,4,0.9)',
  border: '1px solid rgba(202,138,4,1)',
  color: '#fff',
  borderRadius: 8,
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  padding: 24,
  width: '100%',
  maxWidth: 780,
  maxHeight: '90vh',
  overflowY: 'auto',
  color: '#fff',
};

const labelSt: React.CSSProperties = {
  fontSize: 13,
  color: 'rgba(255,255,255,0.7)',
  marginBottom: 4,
  display: 'block',
};

const sectionSt: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: 'rgba(59,130,246,0.9)',
  borderBottom: '1px solid rgba(59,130,246,0.3)',
  paddingBottom: 6,
  marginBottom: 16,
  marginTop: 20,
  gridColumn: '1 / -1',
};

type PersonalForm = Omit<Personal, 'id'>;

const emptyForm: PersonalForm = {
  codigo: '',
  tipo: 'Persona',
  tipo_identificacion: '',
  nro_documento: '',
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  movil: '',
  estado_civil: '',
  fecha_nacimiento: '',
  formacion: '',
  habilidades: [],
  ha_trabajado_con_nosotros: false,
  fecha_ingreso_plantilla: '',
  referencias: '',
  situacion: '',
  imagen: undefined,
};

function generateCode(list: Personal[]): string {
  const nums = list
    .map((p) => {
      const match = p.codigo.match(/PER-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(Boolean);
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `PER-${String(next).padStart(5, '0')}`;
}

export default function PersonalPage() {
  const { personal, addPersonal, updatePersonal, deletePersonal } = usePersonalStore();
  const config = useConfigStore();

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<Personal | null>(null);
  const [form, setForm] = useState<PersonalForm>(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return personal;
    const q = search.toLowerCase();
    return personal.filter(
      (p) =>
        p.codigo.toLowerCase().includes(q) ||
        p.nombre.toLowerCase().includes(q) ||
        p.apellido.toLowerCase().includes(q) ||
        p.nro_documento.toLowerCase().includes(q) ||
        p.formacion.toLowerCase().includes(q) ||
        p.situacion.toLowerCase().includes(q) ||
        p.tipo.toLowerCase().includes(q)
    );
  }, [personal, search]);

  const openCreate = useCallback(() => {
    setEditingId(null);
    setForm({ ...emptyForm, codigo: generateCode(personal) });
    setShowForm(true);
  }, [personal]);

  const openEdit = useCallback((p: Personal) => {
    setEditingId(p.id);
    const { id, ...rest } = p;
    setForm(rest);
    setShowForm(true);
  }, []);

  const openView = useCallback((p: Personal) => {
    setViewItem(p);
    setShowView(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm('Estas seguro de eliminar este registro?')) {
        deletePersonal(id);
      }
    },
    [deletePersonal]
  );

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setForm((prev) => ({ ...prev, imagen: compressed }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.nombre.trim() || !form.apellido.trim()) return;
    if (editingId) {
      updatePersonal(editingId, form);
    } else {
      addPersonal({ ...form, id: crypto.randomUUID() });
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  }, [editingId, form, addPersonal, updatePersonal]);

  const handleExportPDF = useCallback(() => {
    const rows = filtered.map((p) => [p.codigo, p.tipo, p.nombre + ' ' + p.apellido, p.nro_documento, p.formacion, p.situacion]);
    exportToPDF('Personal de Labores', ['Codigo', 'Tipo', 'Nombre', 'Documento', 'Formacion', 'Situacion'], rows);
  }, [filtered]);

  const handleExportExcel = useCallback(() => {
    const rows = filtered.map((p) => ({
      Codigo: p.codigo,
      Tipo: p.tipo,
      Nombre: p.nombre + ' ' + p.apellido,
      Documento: p.nro_documento,
      Formacion: p.formacion,
      Situacion: p.situacion,
    }));
    exportToExcel(rows, 'Personal de Labores');
  }, [filtered]);

  const handlePrint = useCallback(() => {
    const rows = filtered.map((p) => [p.codigo, p.tipo, p.nombre + ' ' + p.apellido, p.nro_documento, p.formacion, p.situacion]);
    printTable('Personal de Labores', ['Codigo', 'Tipo', 'Nombre', 'Documento', 'Formacion', 'Situacion'], rows);
  }, [filtered]);

  const setField = useCallback(<K extends keyof PersonalForm>(field: K, value: PersonalForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleHabilidad = useCallback((nombre: string) => {
    setForm((prev) => {
      const has = prev.habilidades.includes(nombre);
      return {
        ...prev,
        habilidades: has
          ? prev.habilidades.filter((h) => h !== nombre)
          : [...prev.habilidades, nombre],
      };
    });
  }, []);

  return (
    <div style={{ padding: 24, minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Personal de Labores</h1>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar personal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputSt, maxWidth: 320 }}
        />
        <button style={primaryBtnSt} onClick={openCreate}>
          + Nuevo Personal
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={pdfBtnSt} onClick={handleExportPDF}>PDF</button>
          <button style={excelBtnSt} onClick={handleExportExcel}>Excel</button>
          <button style={imprimirBtnSt} onClick={handlePrint}>Imprimir</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {['Codigo', 'Tipo', 'Nombre', 'Documento', 'Formacion', 'Situacion', 'Acciones'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 8px',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  No se encontraron registros
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '10px 8px', fontSize: 14 }}>{p.codigo}</td>
                <td style={{ padding: '10px 8px', fontSize: 14 }}>{p.tipo}</td>
                <td style={{ padding: '10px 8px', fontSize: 14 }}>{p.nombre} {p.apellido}</td>
                <td style={{ padding: '10px 8px', fontSize: 14 }}>{p.nro_documento}</td>
                <td style={{ padding: '10px 8px', fontSize: 14 }}>{p.formacion}</td>
                <td style={{ padding: '10px 8px', fontSize: 14 }}><span data-situacion={p.situacion} className="px-3 py-1 rounded-lg text-xs font-bold">{p.situacion}</span></td>
                <td style={{ padding: '10px 8px', display: 'flex', gap: 6 }}>
                  <button style={verBtnSt} onClick={() => openView(p)}>Ver</button>
                  <button style={editBtnSt} onClick={() => openEdit(p)}>Editar</button>
                  <button style={deleteBtnSt} onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showView && viewItem && (
        <div style={overlayStyle} onClick={() => setShowView(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Detalle del Personal</h2>
              <button
                onClick={() => setShowView(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {viewItem.imagen && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img
                  src={viewItem.imagen}
                  alt={viewItem.nombre}
                  style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(59,130,246,0.6)' }}
                />
              </div>
            )}

            {/* Datos Generales */}
            <h3 style={sectionSt}>Datos Generales</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {([
                ['Codigo', viewItem.codigo],
                ['Tipo', viewItem.tipo],
                ['Tipo Identificacion', viewItem.tipo_identificacion],
                ['Nro Documento', viewItem.nro_documento],
                ['Nombre', viewItem.nombre],
                ['Apellido', viewItem.apellido],
                ['Correo', viewItem.correo],
                ['Telefono', viewItem.telefono],
                ['Movil', viewItem.movil],
                ['Estado Civil', viewItem.estado_civil],
                ['Fecha de Nacimiento', viewItem.fecha_nacimiento],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  <p style={{ margin: '4px 0 0', fontSize: 14 }}>{value || '—'}</p>
                </div>
              ))}
            </div>

            {/* Formacion y Habilidades */}
            <h3 style={sectionSt}>Formacion y Habilidades</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Formacion</span>
                <p style={{ margin: '4px 0 0', fontSize: 14 }}>{viewItem.formacion || '—'}</p>
              </div>
              <div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Habilidades</span>
                <p style={{ margin: '4px 0 0', fontSize: 14 }}>{viewItem.habilidades.length > 0 ? viewItem.habilidades.join(', ') : '—'}</p>
              </div>
            </div>

            {/* Datos Laborales */}
            <h3 style={sectionSt}>Datos Laborales</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {([
                ['Ha Trabajado con Nosotros', viewItem.ha_trabajado_con_nosotros ? 'Si' : 'No'],
                ['Fecha Ingreso Plantilla', viewItem.fecha_ingreso_plantilla],
                ['Situacion', viewItem.situacion],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  <p style={{ margin: '4px 0 0', fontSize: 14 }}>{value || '—'}</p>
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Referencias</span>
                <p style={{ margin: '4px 0 0', fontSize: 14 }}>{viewItem.referencias || '—'}</p>
              </div>
            </div>

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button style={primaryBtnSt} onClick={() => setShowView(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      {showForm && (
        <div style={overlayStyle} onClick={() => setShowForm(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editingId ? 'Editar Personal' : 'Nuevo Personal'}</h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* ========== Datos Generales ========== */}
              <h3 style={sectionSt}>Datos Generales</h3>

              {/* Codigo */}
              <div>
                <label style={labelSt}>Codigo</label>
                <input style={{ ...inputSt, opacity: 0.6 }} value={form.codigo} readOnly />
              </div>

              {/* Tipo */}
              <div>
                <label style={labelSt}>Tipo</label>
                <select style={selectSt} value={form.tipo} onChange={(e) => setField('tipo', e.target.value)}>
                  <option value="Persona">Persona</option>
                  <option value="Empresa">Empresa</option>
                </select>
              </div>

              {/* Tipo Identificacion */}
              <div>
                <label style={labelSt}>Tipo Identificacion</label>
                <select style={selectSt} value={form.tipo_identificacion} onChange={(e) => setField('tipo_identificacion', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {config.tiposIdentificacion.map((t) => (
                    <option key={t.id} value={t.nombre}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Nro Documento */}
              <div>
                <label style={labelSt}>Nro Documento</label>
                <input style={inputSt} value={form.nro_documento} onChange={(e) => setField('nro_documento', e.target.value)} />
              </div>

              {/* Nombre */}
              <div>
                <label style={labelSt}>Nombre *</label>
                <input style={inputSt} value={form.nombre} onChange={(e) => setField('nombre', e.target.value)} />
              </div>

              {/* Apellido */}
              <div>
                <label style={labelSt}>Apellido *</label>
                <input style={inputSt} value={form.apellido} onChange={(e) => setField('apellido', e.target.value)} />
              </div>

              {/* Correo */}
              <div>
                <label style={labelSt}>Correo</label>
                <input style={inputSt} type="email" value={form.correo} onChange={(e) => setField('correo', e.target.value)} />
              </div>

              {/* Telefono */}
              <div>
                <label style={labelSt}>Telefono</label>
                <input style={inputSt} value={form.telefono} onChange={(e) => setField('telefono', e.target.value)} />
              </div>

              {/* Movil */}
              <div>
                <label style={labelSt}>Movil</label>
                <input style={inputSt} value={form.movil} onChange={(e) => setField('movil', e.target.value)} />
              </div>

              {/* Estado Civil */}
              <div>
                <label style={labelSt}>Estado Civil</label>
                <select style={selectSt} value={form.estado_civil} onChange={(e) => setField('estado_civil', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {config.estadosCiviles.map((t) => (
                    <option key={t.id} value={t.nombre}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label style={labelSt}>Fecha de Nacimiento</label>
                <input style={inputSt} type="date" value={form.fecha_nacimiento} onChange={(e) => setField('fecha_nacimiento', e.target.value)} />
              </div>

              {/* Imagen */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelSt}>Imagen</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    type="button"
                    style={{ ...primaryBtnSt, padding: '8px 16px' }}
                    onClick={() => fileRef.current?.click()}
                  >
                    Seleccionar imagen
                  </button>
                  {form.imagen && (
                    <img
                      src={form.imagen}
                      alt="preview"
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
                    />
                  )}
                </div>
              </div>

              {/* ========== Formacion y Habilidades ========== */}
              <h3 style={sectionSt}>Formacion y Habilidades</h3>

              {/* Formacion */}
              <div>
                <label style={labelSt}>Formacion</label>
                <select style={selectSt} value={form.formacion} onChange={(e) => setField('formacion', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {config.formaciones.map((t) => (
                    <option key={t.id} value={t.nombre}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Habilidades (multi-select checkboxes) */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelSt}>Habilidades</label>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8,
                    padding: 12,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    maxHeight: 160,
                    overflowY: 'auto',
                  }}
                >
                  {config.habilidades.map((h) => (
                    <label
                      key={h.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.85)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.habilidades.includes(h.nombre)}
                        onChange={() => toggleHabilidad(h.nombre)}
                        style={{ accentColor: '#3b82f6' }}
                      />
                      {h.nombre}
                    </label>
                  ))}
                </div>
              </div>

              {/* ========== Datos Laborales ========== */}
              <h3 style={sectionSt}>Datos Laborales</h3>

              {/* Ha trabajado con nosotros */}
              <div>
                <label style={labelSt}>Ha Trabajado con Nosotros</label>
                <select
                  style={selectSt}
                  value={form.ha_trabajado_con_nosotros ? 'si' : 'no'}
                  onChange={(e) => setField('ha_trabajado_con_nosotros', e.target.value === 'si')}
                >
                  <option value="no">No</option>
                  <option value="si">Si</option>
                </select>
              </div>

              {/* Fecha Ingreso Plantilla */}
              <div>
                <label style={labelSt}>Fecha Ingreso Plantilla</label>
                <input style={inputSt} type="date" value={form.fecha_ingreso_plantilla} onChange={(e) => setField('fecha_ingreso_plantilla', e.target.value)} />
              </div>

              {/* Situacion */}
              <div>
                <label style={labelSt}>Situacion</label>
                <select style={selectSt} value={form.situacion} onChange={(e) => setField('situacion', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {config.situacionesPersonal.map((t) => (
                    <option key={t.id} value={t.nombre}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Referencias */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelSt}>Referencias</label>
                <textarea
                  style={{ ...inputSt, minHeight: 60, resize: 'vertical' }}
                  value={form.referencias}
                  onChange={(e) => setField('referencias', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                style={{ ...primaryBtnSt, background: 'rgba(255,255,255,0.1)' }}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button style={primaryBtnSt} onClick={handleSubmit}>
                {editingId ? 'Guardar Cambios' : 'Crear Personal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
