// Campo reutilizável: label + controle + mensagem de erro/ajuda ligados por aria
export default function Field({ id, label, error, hint, as = 'input', children, ...props }) {
  const Tag = as;
  const desc = [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Tag id={id} name={id} aria-invalid={!!error} aria-describedby={desc} {...props}>
        {children}
      </Tag>
      {hint && <span id={`${id}-hint`} className="hint">{hint}</span>}
      {error && <span id={`${id}-err`} className="err" role="alert">{error}</span>}
    </div>
  );
}