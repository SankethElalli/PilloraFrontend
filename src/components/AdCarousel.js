import React from 'react';
import '../styles/ProductCarousel.css';

const ads = [
  {
    image: '/ads/ad1.jpg',
    link: 'https://example.com/ad1',
    alt: 'Ad 1'
  },
  {
    image: '/ads/ad2.jpg',
    link: 'https://example.com/ad2',
    alt: 'Ad 2'
  },
  {
    image: '/ads/ad3.jpg',
    link: 'https://example.com/ad3',
    alt: 'Ad 3'
  }
];

export default function AdCarousel() {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="product-carousel-section py-3" style={{ marginBottom: 0 }}>
      <div className="container">
        <div className="pillora-carousel-outer" style={{ minHeight: 180, background: '#f8fafc', marginBottom: 0 }}>
          <button
            className="pillora-carousel-arrow left"
            onClick={() => setCurrent((current - 1 + ads.length) % ads.length)}
            style={{ left: 0 }}
            aria-label="Previous Ad"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <div className="pillora-carousel-track" style={{ height: 160, justifyContent: 'center', alignItems: 'center', gap: 0 }}>
            <a
              href={ads[current].link}
              target="_blank"
              rel="noopener noreferrer"
              className="pillora-carousel-card"
              style={{
                width: 400,
                minHeight: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                boxShadow: '0 2px 12px rgba(73,125,116,0.07)',
                borderRadius: 16,
                padding: 0,
                margin: 0
              }}
            >
              <img
                src={ads[current].image}
                alt={ads[current].alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: 120,
                  borderRadius: 12,
                  objectFit: 'cover'
                }}
              />
            </a>
          </div>
          <button
            className="pillora-carousel-arrow right"
            onClick={() => setCurrent((current + 1) % ads.length)}
            style={{ right: 0 }}
            aria-label="Next Ad"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
          <div className="pillora-carousel-dots" style={{ bottom: 8 }}>
            {ads.map((_, idx) => (
              <button
                key={idx}
                className={`pillora-carousel-dot${current === idx ? ' active' : ''}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to ad ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
