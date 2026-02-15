import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptoms, age, gender, duration, painLevel, chronicDiseases, emergencyFlags, language } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it to your Supabase Edge Function secrets.");
    }

    const hasEmergencyFlag = emergencyFlags?.chestPain || emergencyFlags?.breathingDifficulty || emergencyFlags?.severeBleeding || emergencyFlags?.lossOfConsciousness;

    const isArabic = language === "ar";

    const prompt = `You are an AI medical specialty classifier. Based on the patient's symptoms, classify them into the most suitable MEDICAL SPECIALTY.

Patient Information:
- Symptoms: ${symptoms}
- Age: ${age || "not provided"}
- Gender: ${gender || "not provided"}
- Duration: ${duration || "not provided"}
- Pain level: ${painLevel}/10
- Chronic diseases: ${chronicDiseases || "none"}
- Emergency flags: ${hasEmergencyFlag ? `Chest pain: ${emergencyFlags.chestPain}, Breathing difficulty: ${emergencyFlags.breathingDifficulty}, Severe bleeding: ${emergencyFlags.severeBleeding}, Loss of consciousness: ${emergencyFlags.lossOfConsciousness}` : "None"}

Rules:
- Focus on SPECIALTY classification, not disease diagnosis
- Consider age, gender, pain level, duration, and chronic diseases
- Emergency flags should increase severity
- Severity levels: "high" (go to ER immediately), "medium" (visit a doctor soon), "low" (pharmacy or home care)
- Confidence is 0-100 percentage
- Suggest relevant lab tests or radiology scans
- Respond in ${isArabic ? "Arabic" : "English"}

Specialty examples: ${isArabic
        ? "أمراض القلب، طب العيون، جراحة العظام، الأمراض الجلدية، الطب الباطني، طب الأطفال، طب الأعصاب، أنف وأذن وحنجرة، أمراض الرئة، طب الطوارئ، أمراض النساء والتوليد، المسالك البولية، الطب النفسي، الجراحة العامة، الغدد الصماء، الجهاز الهضمي، طب الأسنان"
        : "Cardiology, Ophthalmology, Orthopedics, Dermatology, Internal Medicine, Pediatrics, Neurology, ENT, Pulmonology, Emergency Medicine, Gynecology, Urology, Psychiatry, General Surgery, Endocrinology, Gastroenterology, Dentistry"}

You MUST respond with a valid JSON object in this exact format:
{
  "specialty": "the recommended medical specialty",
  "severity": "high" or "medium" or "low",
  "nextStep": "suggested next step for the patient",
  "confidence": number between 0-100,
  "suggestedTests": ["test1", "test2", "test3"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API failed with status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No response from Gemini API");
    }

    // Extract JSON from the response (Gemini sometimes wraps it in markdown)
    let jsonText = generatedText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const result = JSON.parse(jsonText);

    // Validate the response structure
    if (!result.specialty || !result.severity || !result.nextStep || typeof result.confidence !== 'number') {
      throw new Error("Invalid response structure from Gemini");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-symptoms error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
