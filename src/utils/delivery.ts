export const getDeliveryPrice = (wilaya: string): number => {
  if (!wilaya) return 0;

  // Zone 1: Alger
  if (wilaya.startsWith('16')) return 400;

  // Zone 3: Sud & Lointain (Exemples de Wilayas du Sud)
  const sudWilayas = [
    '01', // Adrar
    '08', // Béchar
    '11', // Tamanrasset
    '30', // Ouargla
    '33', // Illizi
    '37', // Tindouf
    '39', // El Oued
    '47', // Ghardaïa
    '49', '50', '51', '52', '53', '54', '55', '56', '57', '58' // Nouvelles Wilayas du Sud
  ];

  const wilayaCode = wilaya.split(' ')[0];
  if (sudWilayas.includes(wilayaCode)) return 900;

  // Zone 2: Reste du Nord / Proximité
  return 600;
};
