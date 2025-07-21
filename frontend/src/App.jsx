import React, { useEffect, useState } from 'react';

const API = 'http://localhost:4000';

export default function App() {
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', fields: [{ name: '', type: 'string', required: false }] });
  const [projectName, setProjectName] = useState('crud-gen');
  const [message, setMessage] = useState('');

  // โหลด schema
  const fetchSchemas = async () => {
    const res = await fetch(`${API}/schemas`);
    setSchemas(await res.json());
  };
  useEffect(() => { fetchSchemas(); }, []);

  // ฟอร์ม field
  const handleFieldChange = (idx, key, value) => {
    setForm(f => {
      const fields = [...f.fields];
      fields[idx][key] = value;
      return { ...f, fields };
    });
  };
  const addField = () => setForm(f => ({ ...f, fields: [...f.fields, { name: '', type: 'string', required: false }] }));
  const removeField = idx => setForm(f => ({ ...f, fields: f.fields.filter((_, i) => i !== idx) }));

  // สร้าง schema
  const submitSchema = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch(`${API}/schemas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: '', fields: [{ name: '', type: 'string', required: false }] });
      fetchSchemas();
      setMessage('✅ สร้าง schema สำเร็จ');
    } else {
      setMessage('❌ เกิดข้อผิดพลาดในการสร้าง schema');
    }
    setLoading(false);
  };

  // Generate CRUD
  const generateCRUD = async schemaName => {
    setLoading(true);
    setMessage('');
    const res = await fetch(`${API}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName, schemaName }),
    });
    if (res.ok) setMessage('✅ Generate CRUD สำเร็จ');
    else setMessage('❌ เกิดข้อผิดพลาดในการ generate CRUD');
    setLoading(false);
  };

  // Delete CRUD
  const deleteCRUD = async entityName => {
    setLoading(true);
    setMessage('');
    const res = await fetch(`${API}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName, entityName }),
    });
    if (res.ok) setMessage('🗑️ ลบ CRUD สำเร็จ');
    else setMessage('❌ เกิดข้อผิดพลาดในการลบ CRUD');
    setLoading(false);
  };

  // เพิ่มฟังก์ชัน downloadSchema
  function downloadSchema(schemaName) {
    fetch(`${API}/schemas/${schemaName}`)
      .then(res => res.text())
      .then(content => {
        const blob = new Blob([content], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${schemaName}.schema.js`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      });
  }

  // ลบไฟล์ schema จริง
  const handleDeleteSchema = async (schemaName) => {
    if (!window.confirm(`ต้องการลบ schema '${schemaName}' จริงหรือไม่?`)) return;
    setLoading(true);
    setMessage('');
    const res = await fetch(`${API}/schemas/${schemaName}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage(`🗑️ ลบ schema '${schemaName}' สำเร็จ`);
      fetchSchemas();
    } else {
      setMessage('❌ เกิดข้อผิดพลาดในการลบ schema');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-indigo-700 text-white py-6 shadow-md mb-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-3">
          Sximen
          <span className="text-3xl">⚡</span>
          <h1 className="text-2xl font-bold tracking-wide">CRUD Generator UI by </h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-1 gap-8">
        {/* ซ้าย: ฟอร์มสร้าง/แก้ไข schema */}
        <section className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 border border-indigo-100">
          <h2 className="font-semibold text-lg mb-2 flex items-center gap-2"><span>📝</span>สร้าง Schema ใหม่</h2>
          <form onSubmit={submitSchema} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อ schema</label>
              <input className="border border-indigo-300 p-2 rounded w-full focus:ring-2 focus:ring-indigo-200" placeholder="เช่น product" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fields</label>
              <div className="flex flex-col gap-2">
                {form.fields.map((field, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-indigo-50 rounded p-2">
                    <input className="border p-1 rounded flex-1" placeholder="field name" value={field.name} onChange={e => handleFieldChange(idx, 'name', e.target.value)} required />
                    <select className="border p-1 rounded" value={field.type} onChange={e => handleFieldChange(idx, 'type', e.target.value)}>
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                    </select>
                    <label className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked={field.required} onChange={e => handleFieldChange(idx, 'required', e.target.checked)} /> required
                    </label>
                    {form.fields.length > 1 && <button type="button" className="text-red-500 hover:text-red-700 text-lg" onClick={() => removeField(idx)} title="ลบ field">✖️</button>}
                  </div>
                ))}
                <button type="button" className="text-indigo-600 hover:underline text-sm mt-1" onClick={addField}>+ เพิ่ม field</button>
              </div>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition disabled:opacity-50" disabled={loading}>💾 บันทึก schema</button>
          </form>
        </section>
        {/* ขวา: รายการ schema + action */}
        <section className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-6 border border-indigo-100">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><span>📦</span>จัดการ Schema</h2>
            <div className="mb-3">
              <label className="text-sm font-medium">Project Name: </label>
              <input className="border p-1 rounded ml-2 w-40" value={projectName} onChange={e => setProjectName(e.target.value)} />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded">
                <thead>
                  <tr className="bg-indigo-50 text-indigo-700">
                    <th className="py-2 px-3 text-left w-1/2">ชื่อ Schema</th>
                    <th className="py-2 px-3 text-left w-1/2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schemas.length === 0 && (
                    <tr><td colSpan={2} className="text-gray-400 py-2 text-center">ยังไม่มี schema</td></tr>
                  )}
                  {schemas.map(s => (
                    <tr key={s} className="border-b last:border-b-0">
                      <td className="py-2 px-3 font-mono text-indigo-700">{s}</td>
                      <td className="py-2 px-3 flex gap-2 justify-center">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-xs flex items-center gap-1" onClick={() => generateCRUD(s)} disabled={loading} title="Generate CRUD">⚙️ Generate</button>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-xs flex items-center gap-1" onClick={() => deleteCRUD(s)} disabled={loading} title="Delete CRUD">🗑️ Delete Module</button>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow text-xs flex items-center gap-1" onClick={() => downloadSchema(s)} title="Download schema">⬇️ Download</button>
                        <button className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded shadow text-xs flex items-center gap-1" onClick={() => handleDeleteSchema(s)} disabled={loading} title="Delete schema file">❌ Delete schema</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {message && <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded shadow-sm animate-pulse">{message}</div>}
          {loading && <div className="flex items-center gap-2 text-gray-500"><span className="animate-spin">⏳</span>กำลังดำเนินการ...</div>}
        </section>
      </main>
      <footer className="text-center text-xs text-gray-400 py-6 mt-10">CRUD Generator UI &copy; {new Date().getFullYear()}</footer>
    </div>
  );
} 