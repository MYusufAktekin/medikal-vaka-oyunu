// data/cases.tsx
import React from "react";

export const medicalCases = [
  {
    id: 1,
    title: "Vaka #1: Açıklanamayan Dispne",
    // AMBULANS ÇAKARLARI VİDEOSU
    introVideo: "https://videos.pexels.com/video-files/6530182/6530182-uhd_2560_1440_30fps.mp4", 
    
    // OYUN SONU EĞİTİCİ MESAJ (NEJM Vaka Özeti)
    educationalMessage: "EĞİTİCİ VAKA ÖZETİ (NEJM Case 6-2026): Eozinofilik Granülomatöz Polianjiit (EGPA - eski adıyla Churg-Strauss Sendromu); erişkin yaşta başlayan astım, rinosinüzit ve >1500/µL eozinofili triadı ile karakterize sistemik bir vaskülittir. Bu vakada olduğu gibi masif eozinofililerde öncelikle sekonder nedenler (parazit, ilaç) dışlanmalı, ardından miyeloproliferatif hastalıklar (HES) ile ayrımı için B12 ve Triptaz düzeylerine bakılmalıdır. EGPA hastalarının sadece %40'ında ANCA pozitiftir (genellikle MPO-ANCA). Bu hastadaki PR3-ANCA (c-ANCA) pozitifliği EGPA için nadir görülen ancak literatürde tanımlanmış atipik bir varyanttır. Tedavide yüksek doz sistemik kortikosteroidler ve dirençli/nüks vakalarda IL-5 inhibitörleri (Mepolizumab) kullanılır.",

    patient: {
      name: "Ahmet Y.", age: 91, gender: "Erkek",
      anamnesis: "Son 8 aydır giderek artan efor dispnesi ve merdiven çıkarken zorlanma. Son 6 ayda 15.9 kg kilo kaybı. Kronik sinüs konjesyonu, rinore ve anozmi mevcut. 1950'lerden beri yurt dışı öyküsü yok. Sigarayı 30 yıl önce bırakmış.",
      history: "KOAH, Koroner Arter Hastalığı (8 yıl önce stent), Paroksismal Atriyal Fibrilasyon, Benign Prostat Hiperplazisi."
    },
    muayene: {
      vitals: "TA: 98/54 mmHg | Nabız: 71/dk | Ateş: 35.6 °C | SpO2: %93 (Oda havası)",
      findings: "Solunum: Bilateral yaygın wheezing, raller yok. KBB: Nazal mukozada solukluk ve polipoid değişiklikler. Kardiyak: Ritim irregüler irregüler, ek ses/üfürüm yok."
    },
    labs: [
      { id: "hemogram", name: "Tam Kan Sayımı (Hemogram)", cost: 50, time: 1, result: "WBC: 37,780 /µL | Eozinofil: 27,390 /µL | Hb: 12.8 g/dL | PLT: 248,000 /µL" },
      { id: "yayma", name: "Periferik Yayma", cost: 30, time: 2, condition: ["hemogram"], result: "Eozinofil %72. Atipik hücre veya blast saptanmadı." },
      { id: "biyokimya", name: "Geniş Biyokimya", cost: 100, time: 2, result: "Na: 139 mmol/L | K: 4.4 mmol/L | Kreatinin: 0.9 mg/dL | AST: 22 U/L | ALT: 18 U/L" },
      { id: "kardiyak", name: "Kardiyak Belirteçler (Trop T, BNP)", cost: 250, time: 2, result: "NT-proBNP: 4300 pg/mL | Troponin T: 56 ng/L" },
      { id: "ddimer", name: "D-Dimer", cost: 150, time: 1, result: "D-Dimer: 350 µg/L" },
      { id: "prokalsitonin", name: "Prokalsitonin", cost: 200, time: 2, result: "Prokalsitonin: 0.05 ng/mL" },
      { id: "sedim", name: "Sedimantasyon & CRP", cost: 80, time: 1, result: "ESH: 49 mm/sa | CRP: 28.0 mg/L" },
      { id: "tumor", name: "Tümör Markerları (CEA, CA 19-9, PSA)", cost: 450, time: 12, result: "CEA: 1.2 ng/mL | CA 19-9: 15 U/mL | PSA: 2.1 ng/mL" },
      { id: "romatoloji_temel", name: "Otoantikor Paneli (ANA, RF, Anti-CCP)", cost: 350, time: 8, result: "ANA: Negatif | RF: 12 IU/mL | Anti-CCP: Negatif" },
      { id: "spesifik", name: "Vaskülit / HES Paneli (ANCA, IgE, B12, Triptaz)", cost: 1200, time: 24, result: "Vitamin B12: 912 pg/mL | Triptaz: 6.3 ng/mL | IgE: 266 IU/mL | c-ANCA (Anti-PR3): >100 U/mL" },
      { id: "parazit", name: "Gaita & Parazit Paneli", cost: 300, time: 12, result: "Ova ve parazit: Negatif." }
    ],
    imaging: [
      { id: "akciger_grafi", name: "PA Akciğer Grafisi", cost: 150, time: 1, result: "Bilateral bazal yamasal opasiteler." },
      { id: "toraks_bt", name: "Toraks BT", cost: 800, time: 3, result: "Sağ alt lobda bronş duvarı kalınlaşması, mukus tıkaçları, 'tree-in-bud' patern." },
      { id: "eko", name: "Transtorasik Ekokardiyografi", cost: 600, time: 4, result: "EF %55. Sağ kalp boşlukları normal." },
      { id: "batin_usg", name: "Tüm Batın USG", cost: 300, time: 2, result: "Karaciğer, dalak ve böbrekler doğal. Solid kitle izlenmedi." },
      { id: "kranial_mr", name: "Kranial MR", cost: 1200, time: 6, result: "Akut infarkt veya kitle saptanmadı. Yaşa bağlı iskemik gliotik değişiklikler." },
      { id: "sft", name: "Solunum Fonksiyon Testi (SFT)", cost: 150, time: 2, result: "FEV1/FVC: %65. FEV1: %58 (Beklenen). Geri dönüşümlü obstrüktif patern." }
    ],
    consultations: [
      { id: "hematoloji", name: "Hematoloji Konsültasyonu", condition: ["hemogram"], success: "Hematoloji: 'Hastadaki tabloyu gördüm. Periferik yaymasını ve B12/Triptaz panellerini iste. Sonuçları polikliniğe yönlendir.'", fail: "Hematoloji: 'Elimizde tam kan sayımı (Hemogram) bile yokken neyi danışıyorsunuz?' (İtibar -20)" },
      { id: "romatoloji", name: "Romatoloji Konsültasyonu", condition: ["spesifik"], success: "Romatoloji: 'c-ANCA pozitifliği, astım kliniği ve masif eozinofili ile tablo EGPA (Churg-Strauss) ile uyumlu. Acil yatış ve sistemik steroid planlayın.'", fail: "Romatoloji: 'Hastanın vaskülit paneli (ANCA) nerede? Bu verilerle yorum yapamam.' (İtibar -20)" },
      { id: "gogus", name: "Göğüs Hst. Konsültasyonu", condition: ["toraks_bt"], success: "Göğüs Hastalıkları: 'Toraks BT'deki mukus tıkaçları ve tree-in-bud paterni astım/eozinofilik akciğer hastalıkları ile uyumlu. SFT'de obstrüksiyon da var.'", fail: "Göğüs Hastalıkları: 'Akciğer grafisi ile detaylı yorum yapamam, Toraks BT çekin.' (İtibar -15)" },
      { id: "kardiyoloji", name: "Kardiyoloji Konsültasyonu", condition: ["kardiyak"], success: "Kardiyoloji: 'Troponin ve BNP yüksekliği eozinofilik miyokardit şüphesi doğurur. EKO'da şu an belirgin yetmezlik yok ancak yakın takip gerekir.'", fail: "Kardiyoloji: 'Kardiyak markerlarını (Trop/BNP) görmeden konsültasyona gelmiyoruz.' (İtibar -15)" }
    ],
    treatments: [
      { id: "koah_tedavi", name: "KOAH Alevlenmesi -> İnhaler Bronkodilatör & Taburcu", type: "fatal", story: "Hastayı sadece bronkodilatör ile eve yolladın. 2 gün sonra eozinofilik infiltrasyona bağlı kardiyak arrest ile acile getirildi ve kaybedildi." },
      { id: "kalp_yetmezligi", name: "Kalp Yetmezliği -> Yüksek Doz Diüretik (Furosemid)", type: "fatal", story: "Altta yatan sistemik vasküliti atladın. Sıvı çekmek hastayı akut böbrek yetmezliğine soktu. Hasta multiorgan yetmezliğinden eks oldu." },
      { id: "parazit_tedavi", name: "Parazit Enfeksiyonu -> Ampirik İvermektin", type: "wrong", story: "Parazit bu yaşta ve seyahat öyküsü olmayan birinde bu tabloyu yapmaz. İlaç işe yaramadı, hasta kötüleşti. (İtibar -30)" },
      { id: "hes_tedavi", name: "Miyeloproliferatif HES -> İmatinib", type: "wrong", story: "B12 ve triptaz normaldi, PDGFRA mutasyonu kliniği yoktu. Yanlış hedefe yönelik tedavi verdin. (İtibar -40)" },
      { id: "egpa_tedavi", name: "EGPA (Churg-Strauss) -> Yüksek Doz Sistemik Glukokortikoid", type: "victory", story: "Doğru teşhis! Hasta steroide dramatik yanıt verdi. Dispnesi geriledi, eozinofilleri normale döndü." }
    ],
    jokers: {
      kidemli: "Dispne, kilo kaybı ve eozinofili bir aradaysa basit KOAH deyip geçme. Mutlaka detaylı kan sayımı ve vaskülit paneli gör.",
      uptodate: "Eozinofilik Granülomatöz Polianjiit (EGPA), erişkin başlangıçlı astım ve eozinofili ile seyreder. ANCA pozitifliği görülebilir."
    }
  }
];