import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createResource, deleteResource, listResource, updateResource } from '../services/resourceApi';
import '../styles/components/CrudPage.css';

export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
  requiredOnCreate?: boolean;
}

export interface ColumnConfig {
  key: string;
  label: string;
}

interface CrudPageProps {
  title: string;
  resource: string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
}

type Row = Record<string, any>;

function CrudPage({ title, resource, columns, fields }: CrudPageProps) {
  const emptyForm = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.name, field.options?.[0] || ''])),
    [fields]
  );

  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    setForm(emptyForm);
  }, [emptyForm]);

  useEffect(() => {
    load();
  }, [resource]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await listResource<Row>(resource);
      setRows(data);
    } catch (err: any) {
      setError(apiError(err, 'Cannot load data'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setToast('');

    const validationError = validateForm(fields, form, Boolean(editingId));
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await updateResource(resource, editingId, form);
      } else {
        await createResource(resource, form);
      }
      setEditingId(null);
      setForm(emptyForm);
      await load();
      setToast(editingId ? 'Updated successfully.' : 'Created successfully.');
    } catch (err: any) {
      setError(apiError(err, 'Cannot save data'));
    } finally {
      setSaving(false);
    }
  }

  function edit(row: Row) {
    const nextForm = Object.fromEntries(fields.map((field) => [field.name, toFormValue(field.name, row[field.name])]));
    setForm(nextForm);
    setEditingId(row.id);
  }

  async function remove(id: number) {
    if (!window.confirm('Delete this item?')) return;
    setError('');
    setToast('');
    try {
      await deleteResource(resource, id);
      await load();
      setToast('Deleted successfully.');
    } catch (err: any) {
      setError(apiError(err, 'Cannot delete data'));
    }
  }

  return (
    <section className="dashboard-section">
      <div className="section-heading">
        <h1>{title}</h1>
        <button className="secondary-button" disabled={loading} onClick={() => load()} type="button">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <form className="crud-form" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name}>
            <span>{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea
                value={form[field.name] ?? ''}
                onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
              />
            ) : field.type === 'select' ? (
              <select
                value={form[field.name] ?? ''}
                onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
              >
                {field.options?.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                value={form[field.name] ?? ''}
                required={field.required || (!editingId && field.requiredOnCreate)}
                onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
              />
            )}
          </label>
        ))}

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              className="secondary-button"
              disabled={saving}
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setError('');
              }}
            >
              Cancel
            </button>
          )}
        </div>
        {error && <p className="form-error">{error}</p>}
        {toast && <p className="toast-message">{toast}</p>}
      </form>

      {loading ? (
        <div className="page-state loading-state">
          <span className="loading-shimmer" />
          Loading {title.toLowerCase()}...
        </div>
      ) : rows.length === 0 ? (
        <div className="page-state empty-state">No data found.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key}>{formatValue(readValue(row, column.key))}</td>
                  ))}
                  <td className="row-actions">
                    <button type="button" disabled={saving} onClick={() => edit(row)}>
                      Edit
                    </button>
                    <button type="button" disabled={saving} className="danger-button" onClick={() => remove(row.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function readValue(row: Row, key: string) {
  return key.split('.').reduce<any>((value, part) => value?.[part], row);
}

function toFormValue(name: string, value: unknown) {
  if (name === 'roles' && Array.isArray(value)) {
    return value.map((item: any) => item.name || item).join(',');
  }
  return value ?? '';
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item: any) => item.name || String(item)).join(', ');
  }
  return String(value ?? '');
}

function validateForm(fields: FieldConfig[], form: Row, isEditing: boolean) {
  for (const field of fields) {
    const value = form[field.name];
    const isRequired = field.required || (!isEditing && field.requiredOnCreate);

    if (isRequired && (value === null || value === undefined || String(value).trim() === '')) {
      return `${field.label} is required.`;
    }

    if (field.name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
      return 'Email is invalid.';
    }

    if (field.type === 'number' && value !== '' && value !== null && Number.isNaN(Number(value))) {
      return `${field.label} must be a number.`;
    }
  }

  return '';
}

function apiError(error: any, fallback: string) {
  return error.response?.data?.message || fallback;
}

export default CrudPage;
