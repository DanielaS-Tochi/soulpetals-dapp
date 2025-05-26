// Vercel Serverless Function for NFT metadata
module.exports = (req, res) => {
  // Parse the URL to get query parameters
  const url = new URL(req.url, `https://${req.headers.host}`);
  const tokenId = url.pathname.split('/').pop();
  const mood = url.searchParams.get('mood') || 'default';
  const level = url.searchParams.get('level') || '0';
  
  // Determine the image URL based on the mood
  const getImageUrl = (mood) => {
    const baseUrl = 'https://soulpetals-dapp.vercel.app';
    const moodMap = {
      peaceful: `${baseUrl}/images/moods/peaceful.jpeg`,
      joyful: `${baseUrl}/images/moods/joyful.jpeg`,
      vibrant: `${baseUrl}/images/moods/vibrant.jpeg`,
      serene: `${baseUrl}/images/moods/serene.jpeg`,
      mystical: `${baseUrl}/images/moods/mystical.jpeg`,
    };
    
    return moodMap[mood.toLowerCase()] || `${baseUrl}/images/moods/default.jpeg`;
  };
  
  // Generate attributes based on mood and level
  const getAttributes = (mood, level) => {
    const attributes = [
      {
        trait_type: "Mood",
        value: mood
      },
      {
        trait_type: "Level",
        value: parseInt(level),
        max_value: 10
      }
    ];
    
    // Add additional attributes based on mood
    if (mood.toLowerCase() === 'peaceful') {
      attributes.push({
        trait_type: "Energy",
        value: "Low"
      });
    } else if (mood.toLowerCase() === 'vibrant') {
      attributes.push({
        trait_type: "Energy",
        value: "High"
      });
    }
    
    return attributes;
  };
  
  // Create the metadata object
  const metadata = {
    name: `SoulPetals Garden #${tokenId}`,
    description: `A ${mood} garden at level ${level}, growing in the SoulPetals metaverse.`,
    image: getImageUrl(mood),
    external_url: `https://soulpetals-dapp.vercel.app/?tokenId=${tokenId}`,
    attributes: getAttributes(mood, level)
  };
  
  // Set the content type and return the metadata
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(metadata);
}