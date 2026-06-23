export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="page-header">
      <div className="container section-head center">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="section-sub">{subtitle}</p>}
      </div>
    </section>
  )
}
