const img1 = '["https://something.com/img.jpg"]';
const img2 = "https://something.com/img.jpg";

function getFirstImage(img: string | null | undefined): string | null {
  if (!img) return null;
  try {
    const parsed = JSON.parse(img);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
  } catch (e) {
    // If not JSON, return as is
  }
  return img.startsWith("[") ? null : img;
}

console.log(getFirstImage(img1));
console.log(getFirstImage(img2));
