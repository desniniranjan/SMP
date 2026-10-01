/**
 * Design System Category Visual Treatment
 * Tokens:
 * Text Primary: #1D1D1F
 * Text Secondary: #6E6E73
 * Accent Blue: #0066CC
 * Accent Orange: #FF791B
 * Accent Orange Dark: #B64400
 * Background: #F5F5F7
 * Surface: #D2D2D7
 * White: #FFFFFF
 */

export function getCategoryTheme(category = '') {
  const cat = String(category).toLowerCase().trim();

  if (cat.includes('workshop')) {
    return {
      name: 'Workshop',
      color: '#0066CC',
      accentClass: 'text-[#0066CC]',
      badgeBg: 'bg-[#0066CC]/10 text-[#0066CC]',
      dotBg: 'bg-[#0066CC]',
      borderClass: 'border-[#0066CC]',
    };
  }

  if (cat.includes('hackathon') || cat.includes('technical')) {
    return {
      name: 'Hackathon',
      color: '#0066CC',
      accentClass: 'text-[#0066CC]',
      badgeBg: 'bg-[#0066CC]/10 text-[#0066CC]',
      dotBg: 'bg-[#0066CC]',
      borderClass: 'border-[#0066CC]',
    };
  }

  if (cat.includes('certification') || cat.includes('seminar')) {
    return {
      name: 'Certification',
      color: '#FF791B',
      accentClass: 'text-[#FF791B]',
      badgeBg: 'bg-[#FF791B]/15 text-[#B64400]',
      dotBg: 'bg-[#FF791B]',
      borderClass: 'border-[#FF791B]',
    };
  }

  if (cat.includes('sport') || cat.includes('cultural')) {
    return {
      name: 'Sports',
      color: '#B64400',
      accentClass: 'text-[#B64400]',
      badgeBg: 'bg-[#B64400]/10 text-[#B64400]',
      dotBg: 'bg-[#B64400]',
      borderClass: 'border-[#B64400]',
    };
  }

  // Default fallback (Technical / Academic / Other)
  return {
    name: category || 'Technical',
    color: '#0066CC',
    accentClass: 'text-[#0066CC]',
    badgeBg: 'bg-[#0066CC]/10 text-[#0066CC]',
    dotBg: 'bg-[#0066CC]',
    borderClass: 'border-[#0066CC]',
  };
}
