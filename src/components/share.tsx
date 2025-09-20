import React, { useEffect } from 'react'
import { useReferralStore } from '@/store/use-referral-store'

const Share= () => {
  const referralCode = useReferralStore((state) => state.getReferralCode());
  
  useEffect(() => {
    const downloadBothImages = async () => {
      try {
        const res = await fetch("/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            referralCode
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error:', errorText);
          alert(`Error: ${res.status} - ${errorText}`);
          return;
        }

        const data = await res.json();
        
        if (!data.success || !data.images) {
          console.error('Invalid response format:', data);
          alert('Invalid response from server');
          return;
        }

        // Download LinkedIn image
        const linkedinLink = document.createElement('a');
        linkedinLink.href = data.images.linkedin.data;
        linkedinLink.download = data.images.linkedin.filename;
        document.body.appendChild(linkedinLink);
        linkedinLink.click();
        document.body.removeChild(linkedinLink);

        // Small delay before second download
        setTimeout(() => {
          // Download Instagram image
          const instaLink = document.createElement('a');
          instaLink.href = data.images.instagram.data;
          instaLink.download = data.images.instagram.filename;
          document.body.appendChild(instaLink);
          instaLink.click();
          document.body.removeChild(instaLink);
        }, 500);

        console.log('Both images downloaded successfully!');
        
      } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Check console for details.');
      }
    }
    
    downloadBothImages();
  }, [])

  return (
    <div className='text-black'>
      <h2>Downloading both referral images...</h2>
      <p>LinkedIn and Instagram images will download automatically.</p>
    </div>
  )
}

export default Share