import React, { useEffect } from "react";

function Testimonials() {
    const testimonials = [
        {
            id: 1,
            name: "Valeria Gómez",
            text: "Desde que descubrí Spa Sentirse Bien, mi rutina cambió por completo. Cada visita es un oasis de calma y renovación.",
            image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=face&auto=format"
        },
        {
            id: 2,
            name: "Luciano Ferreira",
            text: "Los masajes y tratamientos corporales son increíbles. El profesionalismo y la calidez del equipo se sienten en cada detalle.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format"
        },
        {
            id: 3,
            name: "Charles Patterson",
            text: "Me encantó la experiencia grupal de meditación. El ambiente es hermoso y realmente salís sintiéndote renovado.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&auto=format"
        }
    ];

    useEffect(() => {
        const styleId = "testimonials-water-effect-style";
        if (!document.getElementById(styleId)) {
            const styleTag = document.createElement("style");
            styleTag.id = styleId;
            styleTag.innerHTML = `
                .testimonials-page-container {
                    position: relative;
                    min-height: 65vh;
                    overflow: hidden;
                }

                #testimonials-svg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -2;
                    pointer-events: none;
                }

                #testimonials-distorted-image {
                    filter: url("#testimonials-disFilter");
                }
                
                .testimonials-content {
                    position: relative;
                    z-index: 1;
                    padding-bottom: 3rem;
                }

                .testimonials-card {
                    background-color: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(5px);
                    margin-bottom: 2rem;
                }

                .testimonials-title {
                    color: white !important;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                }

                .green-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, 
                        rgba(0, 170, 91, 0.57) 0%, 
                        rgba(0, 170, 91, 0.57) 25%, 
                        rgba(0, 170, 91, 0.57) 50%, 
                        rgba(0, 170, 91, 0.57) 75%, 
                        rgba(0, 170, 91, 0.57) 100%);
                    z-index: -1;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(styleTag);
        }

        const turbulence = document.querySelector('#testimonials-disFilter feTurbulence');
        let frameId;
        let base = 0.004;
        let direction = 0.3;

        const animate = () => {
            if (!turbulence) return;

            base += direction * 0.000015;
            if (base >= 0.01 || base <= 0.004) direction *= -1;

            turbulence.setAttribute('baseFrequency', base.toString());
            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className="testimonials-page-container" id="testimonials">
            <svg id="testimonials-svg">
                <defs>
                    <filter id="testimonials-disFilter">
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0.01"
                            numOctaves="3"
                            seed="1"
                            result="turbulence"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="turbulence"
                            scale="30"
                            xChannelSelector="R"
                            yChannelSelector="B"
                            result="displacement"
                        />
                    </filter>
                </defs>

                <image
                    id="testimonials-distorted-image"
                    xlinkHref="https://klevron.github.io/codepen/misc/water-texture.jpg"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                    preserveAspectRatio="none"
                />
            </svg>

            <div className="green-overlay"></div>

            <div className="container d-flex flex-column align-items-center justify-content-center px-4 px-md-0 testimonials-content" style={{ minHeight: "65dvh" }}>
                <div className="row text-center mb-5">
                    <h2 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.25rem', fontWeight: "1000" }}
                        className="testimonials-title mb-4">
                        Lo Que Opinan Nuestros Clientes
                    </h2>
                </div>
                
                <div className="row g-4 w-100">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm border-0 testimonials-card" style={{ borderRadius: '15px' }}>
                                <div className="card-body d-flex flex-column p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-quote text-success" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                    <p className="card-text flex-grow-1 mb-4 text-muted">
                                        {testimonial.text}
                                    </p>
                                    <div className="d-flex align-items-center mt-auto">
                                        <img 
                                            src={testimonial.image} 
                                            alt={testimonial.name}
                                            className="rounded-circle me-3"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h6 className="mb-0 fw-bold color-4">{testimonial.name}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Testimonials;