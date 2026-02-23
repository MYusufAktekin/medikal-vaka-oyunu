// data/cases.tsx
export const medicalCases = [
  {
    id: 1,
    title: "Vaka #1: Acilde Nefes Darlığı (Pnömoni & ARDS)",
    introVideo: "/ambulans.mp4", // public klasöründeki ambulans videosu
    intubationVideo: "/entubasyon.mp4", // public klasöründeki entübasyon videosu
    
    educationalMessage: "EĞİTİCİ VAKA ÖZETİ (Harrison's Principles of Internal Medicine): ARDS, pulmoner ve ekstrapulmoner nedenlerle gelişebilen, alveolo-kapiller membran hasarı ile karakterize bir sendromdur. Bu vakada ağır toplum kökenli pnömoni ARDS'yi tetiklemiştir. ARDS yönetiminde mortaliteyi azalttığı kanıtlanmış en önemli strateji 'Akciğer Koruyucu Ventilasyon'dur (ARDSNet Protokolü). Barotravma ve volütravmayı önlemek için Düşük Tidal Volüm (İdeal vücut ağırlığına göre 6 mL/kg) ve Plato Basıncı <30 cmH2O hedeflenmelidir. Dirençli hipoksemide 'Prone Pozisyonu' (yüzüstü yatırma) sürvivi artırır. Ayrıca alveoler ödemi azaltmak için, hastanın hemodinamisi izin verdiği ölçüde diüretiklerle 'Konservatif Sıvı Yönetimi' (negatif sıvı dengesi) uygulanmalıdır.",

    patient: {
      name: "Mehmet Bey", age: 62, gender: "Erkek",
      anamnesis: "Şikayeti: Nefes darlığı, yüksek ateş, pürülan balgam.\n\nHikayesi: 5 gün önce üşüme, titreme ve 39°C'yi bulan ateş, sağ yan ağrısı ve pas renkli balgam. 2 gün önce dış merkezde pnömoni tanısıyla oral amoksisilin-klavulanat başlanmış ama gerilememiş. Acil servisimizde 2 L/dk O2 ihtiyacı saptanıp IV antibiyoterapi planıyla servise devredilmiş.",
      history: "Tip 2 Diabetes Mellitus, Hipertansiyon. 15 paket/yıl sigara öyküsü (5 yıl önce bırakmış)."
    },
    muayene: {
      vitals: "Ateş: 38.9 °C | Nabız: 128/dk | Kan Basıncı: 100/60 mmHg | Solunum: 36/dk | SpO2: %88 (15L Rezervuarlı Maske)",
      findings: "Genel Durum: Kötü, ajite, solunum sıkıntısı içerisinde. Terli ve siyanotik. Baş-Boyun: Boyun ven dolgunluğu yok. Yardımcı solunum kasları solunuma katılıyor. Nörolojik: GKS 11 (E3, V3, M5), konfüze. Fokal defisit yok. Solunum: Sağ alt lobda bronşiyal sesler, kaba raller ve iki taraflı yaygın ince raller. KVS: Taşikardik, periferik nabızlar zayıf. Batın: Doğal."
    },
    labs: [
      { id: "kangazi", name: "Arteriyel Kan Gazı", cost: 50, time: 0.5, result: "pH: 7.26 | PaCO2: 52 mmHg | PaO2: 58 mmHg | HCO3: 20 mEq/L | Laktat: 3.1 mmol/L (Asidoz ve Ağır Hipoksemi)" },
      { id: "hemogram", name: "Hemogram", cost: 50, time: 1, result: "WBC: 22.000 /mm³ (%88 nötrofil) | Hb: 13.2 g/dL | PLT: 110.000 /mm³" },
      { id: "biyokimya", name: "Biyokimya", cost: 100, time: 1.5, result: "BUN: 54 mg/dL | Kreatinin: 1.8 mg/dL | AST: 85 U/L | ALT: 92 U/L | Na: 134 | K: 4.8" },
      { id: "enfeksiyon", name: "Enfeksiyon Belirteçleri", cost: 150, time: 2, result: "CRP: 285 mg/L | Prokalsitonin: 12.4 ng/mL" }
    ],
    imaging: [
      { id: "akciger_grafi", name: "PA Akciğer Grafisi", cost: 150, time: 1, 
        result: "Sağ alt lobda konsolidasyon ve bilateral yaygın heterojen opasiteler. (ARDS ile uyumlu).",
        imagePath: "/akciger.jpg" // public klasörüne akciger.jpg yüklemelisin
      }
    ],
    // AŞAMA 1: İLK MÜDAHALE
    phase1Decisions: [
      { id: "nimv", name: "Hastaya Non-invazif mekanik ventilasyon (NIMV) başlayalım", type: "wrong", penalty: 15, story: "Hata! Hastanın bilinci konfüze (GKS 11). Bilinci kapalı veya ajite hastada NIMV aspirasyon riskini artırır ve kontrendikedir." },
      { id: "nazal", name: "Rezervuarlı maskenin içerisinden hastaya nazal oksijen de takalım, öyle takip edelim", type: "wrong", penalty: 50, story: "Hata! Hasta 15 Litre oksijen altında zaten %88 satüre ve asidotik. Oksijeni üst üste takmak solunum yetmezliğini çözmez." },
      { id: "kat_kurali", name: "Hastayı katta entübe etmenin yasak olup olmadığını öğrenelim", type: "wrong", penalty: 70, story: "Hata! Acil havayolu ihtiyacı olan bir hastada bürokratik kuralları sorgulamak vakit kaybıdır. Hasta gözünün önünde arrest olabilir." },
      { id: "entube", name: "Acil Entübasyon Kararı Al ve Hastayı Entübe Et", type: "success", story: "Doğru Karar! Hasta başarıyla entübe edildi ve mekanik ventilatöre bağlandı. Şimdi ARDS yönetimini planlamalısın." }
    ],
    // AŞAMA 2: ARDS YÖNETİMİ (Entübasyon sonrası açılır)
    phase2Decisions: [
      { id: "high_vt", name: "Volüm Kontrol Modu: Yüksek Tidal Volüm (12 mL/kg) ve Yüksek PEEP verelim", type: "fatal", story: "Kritik Hata! Hastada 'Volütravma' (Ventilatör İlişkili Akciğer Hasarı) gelişti. Yüksek hacim alveolleri patlattı ve hasta pnömotoraks sonucu arrest oldu." },
      { id: "sivi_yukle", name: "Hemodinamisi sınırda, bol IV sıvı yüklemesi yapalım", type: "wrong", penalty: 30, story: "Hata! ARDS'de kapiller permeabilite artmıştır. Fazla sıvı vermek akciğerdeki ödemi (pulmoner ödem) daha da artırarak oksijenizasyonu bozar. Konservatif sıvı yönetimi esastır." },
      { id: "ards_net", name: "Akciğer Koruyucu Ventilasyon (6 mL/kg Düşük VT), Gerekirse Prone Pozisyonu ve Konservatif Sıvı Yönetimi", type: "victory", story: "Mükemmel Yönetim! Düşük tidal volüm ile akciğeri korudun, uygun PEEP ve prone pozisyonu ile alveolleri açtın. Hastanın oksijenizasyonu düzeldi, ekstübasyon planlanıyor." }
    ],
    jokers: {
      kidemli: "Hastanın kan gazına ve bilincine iyi bak. PCO2 yüksek, hasta yorulmuş ve GKS düşüyor. Bu hastayı maskeyle toparlayamazsın, havayolunu güvenceye alman lazım.",
      uptodate: "ARDSNET protokolüne göre ARDS yönetiminde düşük tidal volüm (6 mL/kg) ve plato basıncı <30 cmH2O hedeflenmelidir. Oksijenizasyon düzelmezse Prone (yüzüstü) pozisyon önerilir."
    }
  }
];