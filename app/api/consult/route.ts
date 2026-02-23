// app/api/consult/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// API Anahtarını tanımlıyoruz
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message, patientData, department } = await req.json();

    // YAPAY ZEKA KARAKTER (PERSONA) YARATIMI
    const prompt = `
      Sen Ankara Üniversitesi Tıp Fakültesi İç Hastalıkları departmanında çalışan kıdemli, bilgili ama biraz asabi ve yoğun bir ${department} uzmanısın/icapçısısın.
      Karşında sana telefonda hastayı danışan bir dahiliye asistanı var.
      
      Hastanın o anki verileri ve asistanın bulduğu sonuçlar şunlar: 
      ${JSON.stringify(patientData)}
      
      Asistanın sana telefonda söylediği şey: "${message}"
      
      GÖREVİN:
      1. Asistanın sorusuna gerçek bir uzman hekim gibi Türkçe cevap ver.
      2. Eğer asistan gereksiz bir soru soruyorsa, temel verileri (örneğin TİT) eksikse veya saçmalıyorsa onu usulünce (ama saygılı bir tıp çerçevesinde) fırçala.
      3. Eğer mantıklı bir yaklaşım sergiliyorsa tebrik et ve tanı/tedavi konusunda ufak bir yönlendirme yap (her şeyi direkt söyleme, düşünmesini sağla).
      4. Cevabın bir telefon konuşması doğallığında olsun (Maksimum 3-4 cümle). "Hocam", "Kardeşim", "Doktor" gibi hitaplar kullanabilirsin.
    `;

    // Gemini 2.5 Flash modelini kullanıyoruz (Hızlı ve zeki)
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Konsültan telefona cevap vermiyor, hatta bir sorun var.' }, { status: 500 });
  }
}