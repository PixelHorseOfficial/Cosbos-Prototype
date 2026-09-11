import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProductShowcase.css'

const products = [
  {
    id: 'serum',
    image: '/images/product-1.png',
    tag: 'RETAIL',
    size: '50ML',
    name: 'Bond Repairé Hair Serum',
    price: '₹750.00',
    descriptor: 'Weightless gloss that seals split ends without silicone buildup',
  },
  {
    id: 'conditioner',
    image: '/images/product-2.png',
    tag: 'RETAIL',
    size: '250ML',
    name: 'Bond Repairé Conditioner',
    price: '₹950.00',
    descriptor: 'Disulfide-safe rinse, pH 4.5 — detangles without weighing hair down',
  },
  {
    id: 'shampoo',
    image: '/images/product-3.png',
    tag: 'RETAIL',
    size: '250ML / 1000ML',
    name: 'Bond Repairé Shampoo — pH 4.5',
    price: '₹850.00',
    descriptor: 'Low-sulfate, disulfide-safe, COSBOS signature aroma',
  },
  {
    id: 'boto-therapy',
    image: '/images/product-4.png',
    tag: 'SALON KIT',
    size: '4-STEP',
    name: 'Fibro Boto Therapy',
    price: '₹4,500.00',
    descriptor: 'In-salon fibre reconstruction — professional application only',
  },
  {
    id: 'renovia-mask',
    image: '/images/product-5.png',
    tag: 'PROFESSIONAL',
    size: '500ML',
    name: 'COSBOS Integrity Mask — High Active',
    price: '₹1,700.00',
    descriptor: '90-min in-salon protocol, calibrated for licensed pros',
  },
]

const ProductShowcase = () => {
  const [activeProduct, setActiveProduct] = useState(products[0])
  const navigate = useNavigate()

  const goToCheckout = (product) => {
    // Product travels with the navigation so the checkout page can render
    // the right name / size / price without re-fetching anything.
    navigate(`/checkout/${product.id}`, { state: { product } })
  }

  return (
    <section className="products" id="products">
      <div className="products-content">
        <div className="section-number">PRODUCT SYSTEM</div>
        <h2>Lumina<br/>Haircare<br/>Studio</h2>

        <div className="product-list">
          {products.map((p) => (
            <div
              className="product-item"
              key={p.id}
              onMouseEnter={() => setActiveProduct(p)}
              onClick={() => goToCheckout(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') goToCheckout(p)
              }}
            >
              <div className="product-thumb">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <div className="product-info">
                <div className="product-top">
                  <span>{p.tag}</span>
                  <span>{p.size}</span>
                </div>
                <h4>{p.name}</h4>
                <p className="product-descriptor">{p.descriptor}</p>
                <div className="product-price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="products-note">Salon System available to verified professionals only. Partner verification required. Retail system available through salon partners.</div>
      </div>

      <div className="products-image">
        {products.map((p) => (
          <img
            key={p.id}
            src={p.image}
            alt={p.name}
            className={`products-preview-img ${activeProduct.id === p.id ? 'is-active' : ''}`}
          />
        ))}
        <div className="products-badge">{activeProduct.name.toUpperCase()} — {activeProduct.price}</div>
      </div>
    </section>
  )
}
export default ProductShowcase