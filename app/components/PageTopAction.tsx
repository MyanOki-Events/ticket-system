import React, { useState, useEffect } from 'react';

const Page = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect when the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true); // Show the "Scroll to Top" button when scrolled 200px down
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {/* Scroll to Top Button */}
      {isScrolled && (
        <button 
          onClick={scrollToTop} 
          className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4" 
          style={{ width: '50px', height: '50px', fontSize: '20px' }}>
          ↑
        </button>
      )}
    </div>
  );
};

export default Page;
