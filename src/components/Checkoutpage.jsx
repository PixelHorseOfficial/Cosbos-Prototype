import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import './CheckoutPage.css'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', sub: 'GPay • PhonePe • Paytm • BHIM', icon: '◐' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa • Mastercard • RuPay', icon: '◑' },
  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks', icon: '◒' },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay at doorstep + ₹40', icon: '◓' },
]

// Turns "₹1,700.00" into 1700
const parsePrice = (price) => {
  const n = Number(String(price).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const CheckoutPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product

  const [couponInput, setCouponInput] = useState('')
  const [couponLabel, setCouponLabel] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [agreed, setAgreed] = useState(false)

  // Someone landed here without picking a product (e.g. a direct link, or a refresh
  // that lost router state) — send them back instead of showing a broken total.
  if (!product) {
    return (
      <div className="checkout-empty">
        <p>No product selected.</p>
        <Link to="/">← Back to products</Link>
      </div>
    )
  }

  const subtotal = parsePrice(product.price)
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + gst - discount

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    if (code === 'LUMINA10') {
      setDiscount(Math.round(subtotal * 0.1))
      setCouponLabel('LUMINA10 −10%')
    } else if (code === 'COSBOS') {
      setDiscount(100)
      setCouponLabel('COSBOS ₹100 off')
    } else {
      setDiscount(50)
      setCouponLabel(`"${couponInput}" applied`)
    }
    setCouponInput('')
  }

  const handlePay = () => {
    if (!agreed) {
      alert('Please agree to Terms & Shipping Policy')
      return
    }
    alert(`Processing ₹${total.toFixed(2)} via ${paymentMethod.toUpperCase()}`)
  }

  return (
    <div className="checkout">
      <button className="checkout-back" onClick={() => navigate(-1)}>← BACK</button>

      <div className="checkout-card">
        <div className="checkout-eyebrow">RETAIL • SECURE CHECKOUT</div>

        <div className="checkout-heading">
          <h1>Payment Check</h1>
          <p>Complete your professional order. Disulfide-safe delivery.</p>
        </div>

        <div className="checkout-section">
          <div className="checkout-row checkout-row--label">
            <span>ORDER</span>
            <span className="checkout-accent">1 ITEM</span>
          </div>
          <div className="checkout-item">
            {product.name} — {product.size} × 1 — ₹{subtotal.toFixed(2)}
          </div>
        </div>

        <div className="checkout-section checkout-totals">
          <div className="checkout-row">
            <span className="checkout-label">SUBTOTAL</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout-row">
            <span className="checkout-label">SHIPPING</span>
            <span>Free</span>
          </div>
          <div className="checkout-row">
            <span className="checkout-label">GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="checkout-row checkout-row--discount">
              <span className="checkout-label">
                DISCOUNT {couponLabel && <span className="checkout-coupon-label">• {couponLabel}</span>}
              </span>
              <span>−₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="checkout-row checkout-row--total">
            <span>TOTAL PAYABLE</span>
            <span className="checkout-total-value">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="checkout-section checkout-coupon">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Coupon code"
          />
          <button onClick={applyCoupon}>APPLY</button>
        </div>

        <div className="checkout-section">
          <div className="checkout-subhead">BILLING DETAILS</div>
          <div className="checkout-grid">
            <label>
              <span>FULL NAME</span>
              <input placeholder="A. Sharma" />
            </label>
            <label>
              <span>MOBILE</span>
              <input placeholder="+91 98XXXX XXXXX" />
            </label>
            <label className="checkout-grid-full">
              <span>ADDRESS</span>
              <input placeholder="Studio / House no., Street, Area" />
            </label>
            <label>
              <span>PINCODE</span>
              <input placeholder="1100XX" />
            </label>
          </div>
        </div>

        <div className="checkout-section">
          <div className="checkout-subhead">PAYMENT METHOD</div>
          <div className="checkout-methods">
            {PAYMENT_METHODS.map((m) => (
              <div key={m.id} className="checkout-method-wrap">
                <button
                  onClick={() => setPaymentMethod(m.id)}
                  className={`checkout-method ${paymentMethod === m.id ? 'is-active' : ''}`}
                >
                  <span className="checkout-method-left">
                    <span className="checkout-method-icon">{m.icon}</span>
                    <span>
                      <span className="checkout-method-label">{m.label}</span>
                      <span className="checkout-method-sub">{m.sub}</span>
                    </span>
                  </span>
                  <span className={`checkout-radio ${paymentMethod === m.id ? 'is-active' : ''}`}>
                    {paymentMethod === m.id && <span className="checkout-radio-dot" />}
                  </span>
                </button>

                {m.id === 'card' && paymentMethod === 'card' && (
                  <div className="checkout-card-fields">
                    <label>
                      <span>CARD NUMBER</span>
                      <input placeholder="4242 4242 4242 4242" />
                    </label>
                    <div className="checkout-grid">
                      <label>
                        <span>MM / YY</span>
                        <input placeholder="12 / 27" />
                      </label>
                      <label>
                        <span>CVV</span>
                        <input placeholder="•••" className="checkout-cvv" />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-terms">
          <button
            className={`checkout-checkbox ${agreed ? 'is-checked' : ''}`}
            onClick={() => setAgreed(!agreed)}
            aria-label="Agree to terms"
          >
            {agreed && '✓'}
          </button>
          <div>
            I agree to Terms &amp; Shipping Policy
            <span className="checkout-muted"> — returns not accepted on opened professional use.</span>
          </div>
        </div>

        <div className="checkout-pay-wrap">
          <button className="checkout-pay" onClick={handlePay}>
            <span>PAY ₹{total.toFixed(2)}</span>
            <span className="checkout-pay-arrow">→</span>
          </button>
          <div className="checkout-secure">Protected by 256-bit SSL • UPI &amp; Cards</div>
        </div>

        <div className="checkout-footer-tags">
          <span>Secure Payment</span>
          <span>Disulfide-safe</span>
          <span>No returns on opened products</span>
        </div>

        <div className="checkout-brand">COSBOS PROFESSIONALS</div>
      </div>
    </div>
  )
}

export default CheckoutPage