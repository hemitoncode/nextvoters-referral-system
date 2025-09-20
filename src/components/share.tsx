import React, { useEffect } from 'react'

const Share = () => {
  useEffect(() => {
    const handleDownload = async () => {
      try {
        const res = await fetch("/api/image", { // Make sure this matches your API route
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            referralCode: "ABC123",
            type: "insta",
          }),
        });

        // Check if the response is OK
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error:', errorText);
          alert(`Error: ${res.status} - ${errorText}`);
          return;
        }

        // Check if the response is actually an image
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('image')) {
          const errorText = await res.text();
          console.error('Not an image response:', errorText);
          alert('Server returned an error instead of an image');
          return;
        }

        const blob = await res.blob();
        
        // Verify the blob is not empty
        if (blob.size === 0) {
          console.error('Empty blob received');
          alert('Received empty image file');
          return;
        }

        const url = URL.createObjectURL(blob);
        
        // Create download link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `referral-ABC123.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        URL.revokeObjectURL(url);
        
      } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Check console for details.');
      }
    }
    
    handleDownload();
  }, [])

  return (
    <div>Share</div>
  )
}

export default Share