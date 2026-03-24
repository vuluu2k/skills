import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export const alt = 'devskill - Upgrade Your AI\'s Brain';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to right, #22d3ee, #f43f5e)',
            borderRadius: '32px',
            width: '120px',
            height: '120px',
            marginRight: '32px'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div style={{
            fontSize: '110px',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.02em'
          }}>
            devskill
          </div>
        </div>
        <div style={{
          fontSize: '48px',
          color: '#a1a1aa', // zinc-400
          fontWeight: 500,
          textAlign: 'center'
        }}>
          Equip your AI Agents with Expert Superpowers
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
