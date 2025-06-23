// Gemini AI Pricing API Integration
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default configuration
const API_KEY = "AIzaSyCE_5NgNdvOYkyx7fOvhSPgrdcXWmfrU_s";
const MODEL = global.gemini_model || 'gemini-2.0-flash';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export const generatePriceRecommendation = async (requestData) => {
  try {
    // Try to get API key from storage first, fallback to default
    let apiKey = await AsyncStorage.getItem('geminiApiKey');
    
    if (!apiKey) {
      apiKey = API_KEY; // Use default API key if none stored
      console.log('Using default API key');
    }

    const prompt = `Analyze this service request and provide pricing recommendation in Indonesian Rupiah:

Title: ${requestData.title}
Description: ${requestData.description}
Urgency: ${requestData.urgency}
People needed: ${requestData.peopleNeeded}
Category: ${requestData.categoryId || 'general'}

Consider:
- Base service cost
- Urgency multiplier (urgent: +50%, normal: +0%, santai: -20%)
- People multiplier
- Complexity based on description
- Indonesian market rates

Respond with JSON format:
{
  "basePrice": number,
  "servicePrice": number,
  "totalPrice": number,
  "breakdown": {
    "items": [
      {"name": "item description", "amount": number}
    ]
  }
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const pricing = JSON.parse(jsonMatch[0]);
      return pricing;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.log('Gemini API failed, using fallback:', error);
    return generateFallbackPricing(requestData);
  }
};

const generateFallbackPricing = (requestData) => {
  let basePrice = 15000;
  let servicePrice = 7000;

  // Category-based pricing
  const categoryPricing = {
    1: 5000,  // Print & Fotokopi
    2: 10000, // Antar Barang
    3: 15000, // Belanja
    4: 20000, // Bantuan Tugas
    5: 30000, // Bantuan Pindah
    6: 25000, // Bantuan Teknis
  };

  if (requestData.categoryId && categoryPricing[requestData.categoryId]) {
    basePrice = categoryPricing[requestData.categoryId];
  }

  // Urgency multiplier
  if (requestData.urgency === 'urgent') {
    servicePrice *= 1.5;
  } else if (requestData.urgency === 'santai') {
    servicePrice *= 0.8;
  }

  // People multiplier
  if (requestData.peopleNeeded > 1) {
    servicePrice *= requestData.peopleNeeded;
  }

  // Description complexity
  if (requestData.description?.length > 100) {
    servicePrice *= 1.2;
  }

  const totalPrice = Math.round(basePrice + servicePrice);

  return {
    basePrice,
    servicePrice: Math.round(servicePrice),
    totalPrice,
    breakdown: {
      items: [
        { name: 'Biaya dasar', amount: basePrice },
        { name: 'Biaya jasa', amount: Math.round(servicePrice) }
      ]
    }
  };
};

export const setGeminiApiKey = async (apiKey) => {
  await AsyncStorage.setItem('geminiApiKey', apiKey);
};

export const getGeminiApiKey = async () => {
  return await AsyncStorage.getItem('geminiApiKey');
};

// Function to get current model being used
export const getCurrentModel = () => {
  return MODEL;
};

// Function to get current API key (for debugging purposes)
export const getCurrentApiKey = async () => {
  const storedKey = await AsyncStorage.getItem('geminiApiKey');
  return storedKey || API_KEY;
};
