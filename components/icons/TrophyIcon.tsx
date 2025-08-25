
import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6.111A3.375 3.375 0 0112.375 3h.05A3.375 3.375 0 0115.8 6.111V19M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2M15 19c0 1.105 1.343 2 3 2s3-.895 3-2M5 10h.01M19 10h.01" />
    </svg>
);
