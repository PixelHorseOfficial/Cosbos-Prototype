import React, { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [form, setForm] = useState({ name: '', salon: '', email: '', message: '' })
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Thank you ${form.name}. Partner verification request received. Lab will contact via ${form.email}`)
    setForm({ name: '', salon: '', email: '', message: '' })
  }
  return (
    <section className="contact" id="contact">
      <div className="contact-inner">
        <div className="contact-left">
          <div className="section-number">PARTNER ACCESS</div>
          <h2>Verified salon<br/>distribution only.</h2>
          <p>LLPIN ABC-8663, GSTIN registered. Direct lab-to-salon chain, no marketplace dilution. Co-develop rituals with COSBOS lab.</p>
          <div className="contact-details">
            <div><span>LAB HQ</span><p>Raipur, Chhattisgarh<br/>India — 492001</p></div>
            <div><span>INQUIRIES</span><p>partners@cosbos.in<br/>+91 9XXXX XXXXX</p></div>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-field"><label>Licensed Professional Name</label><input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-field"><label>Salon / Studio Name</label><input type="text" placeholder="Salon name, city" value={form.salon} onChange={(e) => setForm({...form, salon: e.target.value})} required /></div>
          <div className="form-field"><label>Professional Email</label><input type="email" placeholder="you@salon.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
          <div className="form-field"><label>Message / Requirements</label><textarea placeholder="Tell us about your salon, services, client volume..." rows={4} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} /></div>
          <button type="submit" className="form-submit">Request Partner Verification</button>
          <p className="form-note">By submitting, you confirm you are a licensed professional. Retail inquiries via salon partners only.</p>
        </form>
      </div>
    </section>
  )
}
export default Contact
