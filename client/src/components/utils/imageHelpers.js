// API base URL - Using only environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Helper function to construct image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Extract filename from path
  const filename = imagePath.split('/').pop();
  
  // Use the dedicated image route to avoid CORS issues
  return `${API_BASE_URL}/api/products/image/${filename}`;
};

// Default placeholder image
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgOTBDMTI3LjkwOSA5MCAxMTAgMTA3LjkwOSAxMTAgMTMwQzExMCAxNTIuMDkxIDEyNy45MDkgMTcwIDE1MCAxNzBDMTcyLjA5MSAxNzAgMTkwIDE1Mi4wOTEgMTkwIDEzMEMxOTAgMTA3LjkwOSAxNzIuMDkxIDkwIDE1MCA5MFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTcwIDIxMEg2MEM2MCAyMDQuNDc3IDY0LjQ3NzIgMjAwIDcwIDIwMEgyNDBDMjQ1LjUyMyAyMDAgMjUwIDIwNC40NzcgMjUwIDIxMEgyNDBINzBaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo=';
