type Voice = {
  ShortName: string;
  Gender: string;
  Locale: string;
  LocaleName: string;
  DisplayName: string;
};

export function groupVoicesByCountry(allVoices: Voice[]) {
  const voices = allVoices.map((voice: any) => {
    const rawName = voice.FriendlyName;
    const nameMatch = rawName.match(/Microsoft\s(.+?)\s(Online|Neural)/i);
    const cleanName = nameMatch ? nameMatch[1] : rawName;
    const countryMatch = voice.FriendlyName.match(/\(([^)]+)\)$/);
    const countryName = countryMatch ? countryMatch[1] : "Unknown";
    return {
      name: cleanName,
      voice: voice.ShortName,
      gender: voice.Gender,
      country: countryName,
    };
  });

  const preferredCountries = [
    "Nigeria",
    "United States",
    "United Kingdom",
    "Kenya",
    "India",
    "France",
    "Spain",
    "Germany",
    "Brazil",
    "China",
    "Japan",
    "South Africa",
    "Canada",
    "Mexico",
    "Italy",
    "Netherlands",
    "UAE",
    "Saudi Arabia",
    "Egypt",
    "Ghana",
    "Pakistan",
  ];

  const relevantVoices = voices
    .filter((v) => preferredCountries.includes(v.country))
    .slice(0, 50);

  const grouped = relevantVoices.reduce((acc: Record<string, any[]>, voice) => {
    if (!acc[voice.country]) acc[voice.country] = [];
    acc[voice.country].push(voice);
    return acc;
  }, {});

  const sortedCountries = Object.keys(grouped).sort((a, b) => {
    if (a === "Nigeria") return -1;
    if (b === "Nigeria") return 1;
    return a.localeCompare(b);
  });

  const result = sortedCountries.flatMap((country) => {
    return grouped[country].sort((a, b) => a.name.localeCompare(b.name));
  });

  return result;
}
