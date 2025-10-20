'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaHeart } from 'react-icons/fa';

export default function FamilyPolaroid() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => router.push('/about')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '50px', // Lower it even more
        right: '-125px', // Show only ~5% initially (even less visible)
        cursor: 'pointer',
        zIndex: isHovered ? 3000 : 1500, // Higher z-index to appear above Capy character and floating header
        transform: isHovered ? 'translate(-110px, -20px) scale(1) rotate(-3deg)' : 'translate(0, 0) rotate(-5deg)', // Show 95% when hovered, keep same size
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))'
      }}
    >
      {/* Polaroid Frame */}
      <div
        style={{
          background: 'white',
          padding: '12px 12px 5px 12px',
          borderRadius: '4px',
          width: '140px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Photo */}
        <div
          style={{
            width: '100%',
            height: '140px',
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
            position: 'relative'
          }}
        >
          <Image
            src="/family.jpg"
            alt="Family"
            fill
            style={{
              objectFit: 'cover'
            }}
          />
        </div>
        
        {/* Polaroid Text */}
        <div
          style={{
            marginTop: '8px',
            textAlign: 'center',
            fontFamily: "'Brush Script MT', cursive, 'Comic Sans MS'",
            fontSize: '20px',
            color: '#333', // Dark text for visibility on white background
            fontStyle: 'italic',
            userSelect: 'none',
            whiteSpace: 'nowrap', // Keep text in one line
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          Made with <FaHeart size={16} style={{ color: '#ffb3ba' }} />
        </div>
      </div>


      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

