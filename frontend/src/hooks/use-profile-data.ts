'use client';

import {useState} from 'react';

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  profileImage?: string;
  backgroundImage?: string;
  company: {
    name: string;
    description: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  socialLinks: {
    gmail: string;
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

export function useProfileData() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Shaik Ahmad Alisha',
    title: 'UI/UX designer',
    location: 'Visakhapatnam, Andhra Pradesh',

    backgroundImage: '/colorful-gradient-mountain-landscape-pink-purple-o.png',
    company: {
      name: 'CONNECTREE SOFTECH SOLUTIONS PVT LTD',
      description:
        'Connectree Softech Solutions Pvt. Ltd. is a company that appears to be based in Visakhapatnam, India, and offers a variety of IT services and solutions. They have job openings available and are hiring for various positions, according to Jobaaj and LinkedIn',
    },
    contact: {
      phone: '9848652785',
      email: 'contact@connectree.co',
    },
    socialLinks: {
      gmail: 'mailto:contact@connectree.co',
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
    },
  });

  return {profileData, setProfileData};
}
