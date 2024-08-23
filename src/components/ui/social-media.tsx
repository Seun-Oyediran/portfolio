import React from 'react';

const data = [
  {
    id: 1,
    label: 'EMAIL ADDRESS',
    url: 'mailto:seunoyediran22517@gmail.com?subject=Potential Collaboration Inquiry&body=Hello Seun,%0D%0A%0D%0AI am interested in collaborating with you on a project. Your expertise in frontend development, especially your specialization in 3D web applications, aligns well with our needs.%0D%0A%0D%0AI would like to discuss this further at your earliest convenience.%0D%0A%0D%0AThank you,%0D%0A[Your Name]',
  },
  { id: 2, label: 'TWITTER', url: 'https://x.com/shawn_kel' },
  { id: 3, label: 'GITHUB', url: 'https://github.com/Seun-Oyediran' },
];

export function SocialMedia() {
  return (
    <div className="flex flex-col app_social_media">
      {data.map((item) => (
        <div key={item?.id} className="app_social_media__item">
          <a href={item?.url} target="_blank" rel="noreferrer">
            <p className="app_social_media__item__label">{item?.label}</p>
          </a>
        </div>
      ))}

      <div className="app_social_media_item">
        <p className="app_social_media__item__label">get in touch</p>
      </div>
    </div>
  );
}
