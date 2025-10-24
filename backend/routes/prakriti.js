// routes/prakriti.js
const express = require('express');
const Analysis = require('../models/Analysis'); // Fix import
const { auth } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.post('/analyze', auth, async (req, res) => {
  const { traits } = req.body;
  try {
    const prakriti = analyzePrakriti(traits);
    const recommendations = generateRecommendations(prakriti);

    const newAnalysis = new Analysis({
      userId: req.user.id,
      traits,
      prakriti,
      recommendations,
    });

    await newAnalysis.save();
    res.json(newAnalysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/history', auth, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const analyzePrakriti = (traits) => {
  const vataTraits = {
    skin: 'Dry',
    bodyBuild: 'Thin',
    hair: 'Dry, thin',
    mindset: 'Restless',
    memory: 'Forgetful',
    emotions: 'Anxious',
    diet: 'Warm, dry food',
    sleep: 'Light',
    energy: 'Variable',
    weatherPreference: 'Warm',
    stressResponse: 'Anxious',
  };

  const pittaTraits = {
    skin: 'Oily',
    bodyBuild: 'Muscular',
    hair: 'Oily, thinning',
    mindset: 'Intense',
    memory: 'Sharp',
    emotions: 'Angry',
    diet: 'Cold, spicy',
    sleep: 'Moderate',
    energy: 'High, bursts',
    weatherPreference: 'Cool',
    stressResponse: 'Irritable',
  };

  const kaphaTraits = {
    skin: 'Balanced',
    bodyBuild: 'Heavier',
    hair: 'Thick, oily',
    mindset: 'Calm',
    memory: 'Slow but long-term',
    emotions: 'Content',
    diet: 'Light, sweet',
    sleep: 'Deep',
    energy: 'Steady',
    weatherPreference: 'Warm and dry',
    stressResponse: 'Calm',
  };

  let vataScore = 0, pittaScore = 0, kaphaScore = 0;

  Object.keys(traits).forEach((key) => {
    if (traits[key] === vataTraits[key]) vataScore++;
    if (traits[key] === pittaTraits[key]) pittaScore++;
    if (traits[key] === kaphaTraits[key]) kaphaScore++;
  });

  const scores = [
    { dosha: 'Vata', score: vataScore },
    { dosha: 'Pitta', score: pittaScore },
    { dosha: 'Kapha', score: kaphaScore },
  ].sort((a, b) => b.score - a.score);

  return {
    primary: scores[0].dosha,
    secondary: scores[1].score > 0 ? scores[1].dosha : null,
  };
};

// routes/prakriti.js
const generateRecommendations = (prakriti) => {
  const allRecommendations = {
    Pitta: {
      diet: {
        breakfast: ['Oatmeal with cooling fruits like pears and pomegranate.'],
        lunch: ['Steamed vegetables with rice and cooling herbs like coriander.'],
        dinner: ['Light soups with cucumber salad.'],
        snacks: ['Coconut water, fresh mint juice.'],
        waterIntake: 'At least 2.5 liters of cool water daily.',
        fruits: ['Melon, pears, pomegranate.'],
      },
      schedule: {
        morning: ['Gentle yoga or stretching.'],
        afternoon: ['Short rest after lunch.'],
        evening: ['Light walk during sunset.'],
        night: ['Avoid late-night work; sleep before 10:30 PM.'],
      },
      followUp: ['Weekly meditation to manage irritability.'],
    },
    Vata: {
      diet: {
        breakfast: ['Warm porridge with ghee and nuts.'],
        lunch: ['Rice with dal and steamed vegetables.'],
        dinner: ['Vegetable stew with roti.'],
        snacks: ['Warm herbal teas like ginger tea.'],
        waterIntake: 'At least 2 liters of warm water daily.',
        fruits: ['Banana, mango, papaya.'],
      },
      schedule: {
        morning: ['Oil massage before a warm shower.'],
        afternoon: ['Short nap if needed.'],
        evening: ['Gentle evening meditation.'],
        night: ['Go to bed by 10 PM.'],
      },
      followUp: ['Daily breathing exercises to reduce anxiety.'],
    },
    Kapha: {
      diet: {
        breakfast: ['Light smoothie with ginger and berries.'],
        lunch: ['Millet roti with spicy vegetables.'],
        dinner: ['Clear vegetable soup.'],
        snacks: ['Herbal teas like tulsi or cinnamon tea.'],
        waterIntake: 'At least 2 liters of warm water daily.',
        fruits: ['Apples, pears, pomegranate.'],
      },
      schedule: {
        morning: ['Brisk walking or jogging.'],
        afternoon: ['Avoid heavy naps.'],
        evening: ['Dance or aerobic activity.'],
        night: ['Light stretching before bed.'],
      },
      followUp: ['Bi-weekly progress check-ins.'],
    },
  };

  let finalRecommendations = {
    diet: { breakfast: [], lunch: [], dinner: [], snacks: [], waterIntake: '', fruits: [] },
    schedule: { morning: [], afternoon: [], evening: [], night: [] },
    followUp: [],
  };

  const primaryDosha = prakriti.primary;
  const secondaryDosha = prakriti.secondary;

  if (allRecommendations[primaryDosha]) {
    const recs = allRecommendations[primaryDosha];
    finalRecommendations.diet.breakfast.push(...recs.diet.breakfast);
    finalRecommendations.diet.lunch.push(...recs.diet.lunch);
    finalRecommendations.diet.dinner.push(...recs.diet.dinner);
    finalRecommendations.diet.snacks.push(...recs.diet.snacks);
    finalRecommendations.diet.waterIntake = recs.diet.waterIntake;
    finalRecommendations.diet.fruits.push(...recs.diet.fruits);
    finalRecommendations.schedule = { ...recs.schedule };
    finalRecommendations.followUp.push(...recs.followUp);
  }

  if (secondaryDosha && allRecommendations[secondaryDosha]) {
    const recs = allRecommendations[secondaryDosha];
    finalRecommendations.diet.breakfast.push(...recs.diet.breakfast);
    finalRecommendations.diet.lunch.push(...recs.diet.lunch);
    finalRecommendations.diet.dinner.push(...recs.diet.dinner);
    finalRecommendations.diet.snacks.push(...recs.diet.snacks);
    finalRecommendations.diet.fruits.push(...recs.diet.fruits);
    // Merge schedule and followUp arrays
    for (const key in recs.schedule) {
      finalRecommendations.schedule[key].push(...recs.schedule[key]);
    }
    finalRecommendations.followUp.push(...recs.followUp);
  }

  return finalRecommendations;
};
module.exports = router;