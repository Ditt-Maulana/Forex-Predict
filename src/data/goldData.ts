export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema50?: number;
  ema200?: number;
  upperBB?: number;
  lowerBB?: number;
  midBB?: number;
}

export interface AnalysisPayload {
  kondisiPasar: {
    hargaTerkini: string;
    trendUtama: 'Bullish' | 'Bearish' | 'Sideways Konsolidasi';
    strukturPasar: string;
    ringkasanKondisi: string;
  };
  analisisTeknikal: {
    supportUtama: string[];
    resistanceUtama: string[];
    levelPsikologis: string[];
    ema50_200: string;
    rsi: {
      nilai: number;
      kondisi: string;
      catatan: string;
    };
    macd: {
      status: string;
      histogram: string;
      catatan: string;
    };
    bollingerBands: string;
    chartPattern: string;
    fibonacci: string;
    volumeMomentum: string;
  };
  analisisFundamental: {
    dxyPengaruh: string;
    yield10YTreasury: string;
    kebijakanFedFOMC: string;
    dataEkonomiRilis: string;
    geopolitikSafeHaven: string;
    sentimenEmasFisikBankSentral: string;
  };
  prediksiSetupTrading: {
    biasUtama: 'Bullish' | 'Bearish' | 'Neutral';
    skenarioPalingMungkin: string;
    entryZone: string;
    takeProfit1: string;
    takeProfit2: string;
    stopLoss: string;
    riskRewardRatio: string;
    invalidationLevel: string;
    alasanSetup: string;
  };
  manajemenRisiko: {
    persentaseRisiko: string;
    kondisiRisikoTinggi: string[];
    tingkatKeyakinan: 'Low' | 'Medium' | 'High';
    catatanPenting: string;
  };
  logikaPergerakanHarga: {
    rangkumanLogika: string;
    faktorPendorongUtama: string;
    risikoPembalikan: string;
  };
}

export type AnalysisTimeframe = 'M1' | 'M5' | 'H1' | 'H4' | 'Daily';

export const DEFAULT_ANALYSIS_DATA: Record<AnalysisTimeframe, AnalysisPayload> = {
  M1: {
    kondisiPasar: {
      hargaTerkini: "$2,684.50",
      trendUtama: "Bullish",
      strukturPasar: "Micro-Scalp Bullish Order Flow. Terbentuk micro Higher High di $2,685.20 dan Higher Low di $2,683.80. Algorithmic micro-pullback menuju 1-minute Fair Value Gap (FVG) di $2,684.10 berhasil diserap oleh buyer.",
      ringkasanKondisi: "Timeframe M1 digerakkan oleh eksekusi ultra-cepat algo/HFT. Momentum dorongan buyer mendominasi tape pembacaan order book dengan spread ketat 0.30 poin."
    },
    analisisTeknikal: {
      supportUtama: [
        "S1: $2,683.80 (Micro Swing Low M1)",
        "S2: $2,682.20 (EMA 50 M1 Dynamic Support)",
        "S3: $2,680.50 (EMA 200 M1 Base Floor)"
      ],
      resistanceUtama: [
        "R1: $2,685.80 (Micro High Sesi)",
        "R2: $2,687.20 (Liquidity Sweep Pool)",
        "R3: $2,689.40 (Puncak Sesi 24H)"
      ],
      levelPsikologis: [
        "$2,680.00 (Floor Intraday)",
        "$2,685.00 (Mid-level Magnet)",
        "$2,690.00 (Ceiling Psikologis)"
      ],
      ema50_200: "EMA 50 M1 ($2,683.20) berada di atas EMA 200 M1 ($2,681.40). Sudut kemiringan rata-rata bergerak mengindikasikan tekanan beli mikro yang agresif pada candle 1-menit.",
      rsi: {
        nilai: 63.8,
        kondisi: "Bullish Micro Momentum",
        catatan: "RSI 14 pada M1 memantul dari level 50, menunjukkan kelanjutan tren mikro tanpa overbought ekstrem."
      },
      macd: {
        status: "Micro Bullish Expansion",
        histogram: "+0.52 (Positif mikro)",
        catatan: "Histogram hijau bertumbuh pada candle 1-menit, menandakan tekanan beli spontan."
      },
      bollingerBands: "Harga merayap di upper band M1 ($2,685.10) dengan bandwidth stabil pasca pelebaran mikro.",
      chartPattern: "Micro Bull Flag pada grafik 1-menit dengan wick rejection di batas bawah.",
      fibonacci: "Retracement micro wave 61.8% berada tepat di $2,684.00 dan direspons pantulan instan.",
      volumeMomentum: "Lonjakan volume tick pada candle hijau M1 menandakan partisipasi eksekusi ritel dan algo scalper."
    },
    analisisFundamental: {
      dxyPengaruh: "DXY bergerak flat di level 102.85 pada interval menit, memberi ruang stabil bagi pasangan XAU/USD untuk bergerak berbasis teknikal murni.",
      yield10YTreasury: "Yield 10Y stabil di 4.08%, tanpa lonjakan volatilitas suku bunga dalam jangka menit.",
      kebijakanFedFOMC: "Tidak ada jadwal pidato pejabat The Fed dalam interval menit saat ini, pasar digerakkan oleh likuiditas reguler.",
      dataEkonomiRilis: "Kondisi kalender ekonomi aman dari rilis data merah (high-impact) dalam 30 menit ke depan.",
      geopolitikSafeHaven: "Bid buying pasif tetap mendasari harga spot fisik di pasar London.",
      sentimenEmasFisikBankSentral: "Aliran dana ETF emas harian memberikan stabilitas harga dasar."
    },
    prediksiSetupTrading: {
      biasUtama: "Bullish",
      skenarioPalingMungkin: "Scalp buy on dip saat harga menyentuh micro FVG $2,683.90 - $2,684.40 dengan target cepat ke $2,686.80.",
      entryZone: "$2,684.00 - $2,684.50 (Scalp Entry)",
      takeProfit1: "$2,686.80 (+23 pips)",
      takeProfit2: "$2,688.50 (+40 pips)",
      stopLoss: "$2,682.30",
      riskRewardRatio: "1 : 2.1",
      invalidationLevel: "$2,681.50 (Penembusan ke bawah level ini membatalkan setup scalp M1)",
      alasanSetup: "Konfluensi pantulan EMA 50 M1 + pengisian micro imbalance 1-menit."
    },
    manajemenRisiko: {
      persentaseRisiko: "0.25% - 0.5% per eksekusi scalp M1.",
      kondisiRisikoTinggi: [
        "Menjelang detik-detik pergantian jam atau rilis data kilat.",
        "Spread mendadak melebar di atas 5 pips pada sesi likuiditas tipis."
      ],
      tingkatKeyakinan: "Medium",
      catatanPenting: "Gunakan fixed stop-loss otomatis. Jangan biarkan posisi scalp M1 berubah menjadi posisi floating loss panjang."
    },
    logikaPergerakanHarga: {
      rangkumanLogika: "Pada skala mikro 1-menit, pergerakan harga didorong oleh eksekusi order flow instan dan absorbsi likuiditas resting stop order di atas swing high lokal.",
      faktorPendorongUtama: "Aliran order beli instan dari momentum trader dan likuidasi short sellers intraday.",
      risikoPembalikan: "Eksekusi market sell besar tiba-tiba dari institusi yang melikuidasi posisi."
    }
  },

  M5: {
    kondisiPasar: {
      hargaTerkini: "$2,684.50",
      trendUtama: "Bullish",
      strukturPasar: "5-Minute Market Structure Shift (MSS) bullish pasca sweep likuiditas sesi London di $2,681.00. Terjadi pembentukan imbalance FVG M5 di zona $2,682.50 - $2,683.50 yang menahan harga dengan kokoh.",
      ringkasanKondisi: "Pergerakan 5-menit memperlihatkan akumulasi volume pembeli yang sehat. Struktur swing mikro menunjukkan formasi Higher Highs berturut-turut."
    },
    analisisTeknikal: {
      supportUtama: [
        "S1: $2,682.50 (FVG Bullish M5 & Base Demand)",
        "S2: $2,679.00 (EMA 50 M5 & Session VWAP)",
        "S3: $2,674.50 (EMA 200 M5 Dynamic Floor)"
      ],
      resistanceUtama: [
        "R1: $2,688.00 (Resistance Sesi)",
        "R2: $2,692.00 (Major Intraday High)",
        "R3: $2,696.50 (Target Ekspansi M5)"
      ],
      levelPsikologis: [
        "$2,675.00 (Lantai Konsolidasi)",
        "$2,680.00 (Pivot Point)",
        "$2,685.00 (Resistance Dinamis)",
        "$2,690.00 (Batas Atas Intraday)"
      ],
      ema50_200: "EMA 50 M5 ($2,680.80) meluncur naik tajam di atas EMA 200 M5 ($2,676.20), membentuk Golden Cross M5 yang memvalidasi dorongan momentum.",
      rsi: {
        nilai: 59.4,
        kondisi: "Healthy Bullish",
        catatan: "RSI M5 berada di zona ekspansi sehat tanpa sinyal divergensi bearish."
      },
      macd: {
        status: "Bullish Cross",
        histogram: "+1.15",
        catatan: "Kedua garis MACD M5 berada di atas garis nol dengan histogram positif."
      },
      bollingerBands: "Pita Bollinger M5 mengembang ke atas dengan candle menunggangi upper band di $2,686.20.",
      chartPattern: "Ascending Channel mikro pada time frame 5-menit.",
      fibonacci: "Golden Ratio 61.8% dari low hari ini bertumpu di $2,682.80.",
      volumeMomentum: "Rata-rata volume tick pada candle 5-menit naik 40% di atas moving average volume."
    },
    analisisFundamental: {
      dxyPengaruh: "DXY cenderung melemah perlahan di sesi London, memberikan angin segar bagi pembeli emas.",
      yield10YTreasury: "Imbal hasil US 10Y flat di 4.08%, meredakan kekhawatiran kenaikan suku bunga kilat.",
      kebijakanFedFOMC: "Pasar memfaktorkan penurunan suku bunga The Fed secara konsisten.",
      dataEkonomiRilis: "Tidak ada ancaman berita kejutan dalam jendela 1 jam ke depan.",
      geopolitikSafeHaven: "Premi risiko geopolitik menopang minat beli setiap kali harga koreksi.",
      sentimenEmasFisikBankSentral: "Permintaan spot fisik Asia tetap mencatatkan premi."
    },
    prediksiSetupTrading: {
      biasUtama: "Bullish",
      skenarioPalingMungkin: "Re-test FVG M5 di $2,682.80 - $2,683.80 lalu akselerasi menembus $2,686.00 menuju target resistensi sesi $2,688.00.",
      entryZone: "$2,682.80 - $2,684.00 (Buy on Retest)",
      takeProfit1: "$2,688.00 (TP Konservatif M5)",
      takeProfit2: "$2,692.50 (TP Ekstensi M5)",
      stopLoss: "$2,679.50",
      riskRewardRatio: "1 : 2.3",
      invalidationLevel: "$2,678.00 (Penutupan candle M5 di bawah ini membatalkan setup)",
      alasanSetup: "MSS konfirmasi bullish + pantulan dinamis EMA 50 grafik 5-menit."
    },
    manajemenRisiko: {
      persentaseRisiko: "0.5% - 0.75% per trade scalping M5.",
      kondisiRisikoTinggi: [
        "15 menit menjelang berita US Initial Jobless Claims atau PMI.",
        "Volume tick mendadak anjlok saat transisi makan siang London."
      ],
      tingkatKeyakinan: "High",
      catatanPenting: "Kunci 50% profit pada TP1 $2,688.00 dan pasang trailing stop ke Break Even."
    },
    logikaPergerakanHarga: {
      rangkumanLogika: "Grafik 5-menit menangkap rotasi likuiditas institusional intraday, di mana pembeli menyerap penawaran jual di level support kunci.",
      faktorPendorongUtama: "Penyerapan likuiditas jual oleh smart money trader sesi London/New York.",
      risikoPembalikan: "Pelemahan momentum jika harga tertolak keras dengan candle engulfing di $2,688.00."
    }
  },
  H4: {
    kondisiPasar: {
      hargaTerkini: "$2,684.50",
      trendUtama: "Bullish",
      strukturPasar: "Bullish Continuation dengan formasi Higher High (HH) di $2,710.00 dan Higher Low (HL) terjaga di atas zona demand $2,658.00. Terjadi retest teratur pada level Break of Structure (BOS) $2,670.00 yang kini bertransformasi menjadi support konfirmasi.",
      ringkasanKondisi: "Struktur pasar pada timeframe H4 didominasi oleh kendali institusional pembeli (buyers market). Konsolidasi minor di range $2,675 - $2,695 merupakan fase absorpsi likuiditas sebelum potensi ekspansi menuju resistance tertinggi sepanjang masa."
    },
    analisisTeknikal: {
      supportUtama: [
        "S1: $2,670.00 (Flips Support / Mantan Resistance H4)",
        "S2: $2,654.50 (Order Block Bullish & EMA 50 H4)",
        "S3: $2,632.00 (Major Swing Low & Base Demand H4)"
      ],
      resistanceUtama: [
        "R1: $2,700.00 (Level Psikologis & Batas Atas Range)",
        "R2: $2,718.50 (Swing High Liquidity Pool)",
        "R3: $2,735.00 (Fibonacci Extension 127.2%)"
      ],
      levelPsikologis: [
        "$2,600.00 (Floor Support Makro Kuat)",
        "$2,650.00 (Mid-level Penentu Bias Jangka Pendek)",
        "$2,700.00 (Barier Psikologis Utama Penjual)",
        "$2,750.00 (Target Psikologis Institusional Berikutnya)"
      ],
      ema50_200: "EMA 50 ($2,652.80) berada nyaman di atas EMA 200 ($2,596.40), mengonfirmasi Golden Cross yang masih sangat solid. Kemiringan (slope) kedua rata-rata bergerak mengarah ke atas sekitar 35 derajat, mengindikasikan momentum tren yang belum menunjukkan tanda-tanda kelelahan struktural.",
      rsi: {
        nilai: 58.4,
        kondisi: "Neutral to Mildly Bullish",
        catatan: "RSI 14 berada di area sehat (58-60) tanpa indikasi overbought (>70) maupun hidden bearish divergence. Terdapat ruang ekspansi kenaikan yang cukup leluasa sebelum mencapai kondisi jenuh beli."
      },
      macd: {
        status: "Bullish Momentum Menguat",
        histogram: "+3.45 (Positif dan meningkat tipis)",
        catatan: "MACD Line (12, 26) telah memotong ke atas Signal Line (9) di atas centerline nol, menunjukkan dorongan impulsif baru sedang terbangun pada sesi perdagangan saat ini."
      },
      bollingerBands: "Pita Bollinger Bands (20, 2) sedang mengalami pelebaran bertahap setelah kontraksi (squeeze) selama 16 jam. Harga saat ini bergerak merayap di antara Middle Band ($2,672) dan Upper Band ($2,698), menunjukkan continuation band-riding yang sehat.",
      chartPattern: "Terbentuk pola Bull Flag / Ascending Triangle dengan neckline di batas $2,692.00. Penolakan harga (wick rejection) pada pengujian batas bawah mengindikasikan adanya minat beli institusional agresif setiap kali terjadi koreksi.",
      fibonacci: "Penarikan Fibonacci Retracement dari swing low $2,630.00 ke swing high $2,708.00 menunjukkan harga bertahan solid di atas level Golden Pocket 50.0% ($2,669.00) dan 61.8% ($2,659.80). Target ekspansi Fib 161.8% berada di $2,756.20.",
      volumeMomentum: "Volume tick institusional meningkat pada candle hijau (bullish candles) dan menyusut drastis pada candle pullback korektif. On-Balance Volume (OBV) membentuk higher peak, mengonfirmasi aliran modal masuk (inflow)."
    },
    analisisFundamental: {
      dxyPengaruh: "Indeks Dolar AS (DXY) tertahan di level 102.85 dengan struktur bearish rejection pada resistance 103.20. Korelasi negatif terbalik (inverse correlation) antara XAU/USD dan DXY berada pada koefisien -0.84, memberikan tailwind kuat bagi emas ketika USD melemah.",
      yield10YTreasury: "Yield Obligasi AS 10 Tahun (US 10Y Yield) mengalami penurunan ke 4.08% dari level 4.20%. Penurunan yield riil (TIPS yield) secara langsung mengurangi opportunity cost memegang emas batangan yang tidak berimbal hasil bunga (non-yielding asset).",
      kebijakanFedFOMC: "Pasar memperhitungkan probabilitas 85%+ pemangkasan suku bunga acuan Fed sebesar 25-50 bps pada pertemuan FOMC mendatang. Sikap Dovish Ketua Fed Jerome Powell dan komitmen menjaga pasar tenaga kerja mendukung pelonggaran likuiditas global.",
      dataEkonomiRilis: "Rilis data Indeks Harga Konsumen (CPI) menunjukkan tren disinflasi moderat, sementara data Non-Farm Payrolls (NFP) menandakan perlambatan bertahap di pasar tenaga kerja AS, menghalau kekhawatiran skenario 'higher for longer'.",
      geopolitikSafeHaven: "Eskalasi friksi geopolitik di Timur Tengah dan ancaman disrupsi rute pasokan maritim mempertahankan premi risiko (risk premium) emas tetap tinggi sebagai aset lindung nilai utama (safe-haven sanctuary).",
      sentimenEmasFisikBankSentral: "Akumulasi fisik emas oleh bank-bank sentral global (khususnya People's Bank of China / PBoC, Reserve Bank of India, dan Timur Tengah) untuk diversifikasi cadangan devisa dan de-dolarisasi struktural menciptakan lantai harga (price floor) struktural yang sangat tebal."
    },
    prediksiSetupTrading: {
      biasUtama: "Bullish",
      skenarioPalingMungkin: "Re-accumulation pullback ke zona support dinamis/flip level $2,674.00 - $2,679.00 diikuti oleh dorongan breakout menembus level psikologis $2,700.00 untuk menguji resistensi $2,718.00.",
      entryZone: "$2,675.00 - $2,681.00 (Buy on Dip saat terbentuk konfirmasi rejection candle H1/H4)",
      takeProfit1: "$2,698.00 (Target konservatif mendekati resistensi psikologis)",
      takeProfit2: "$2,718.00 (Target swing ekspansi likuiditas swing high)",
      stopLoss: "$2,663.00 (Di bawah swing low terdekat dan EMA 50 H4)",
      riskRewardRatio: "1 : 2.65 (Risk $15.00 vs Reward $40.00 pada TP2)",
      invalidationLevel: "$2,653.00 (Penembusan tegas dan penutupan candle H4 di bawah level ini membatalkan skenario bullish dan mengindikasikan deep retracement ke $2,630.00)",
      alasanSetup: "Konfluensi teknikal dari Bull Flag breakout, pantulan Golden Ratio Fibonacci 50-61.8%, didukung oleh tren penurunan yield obligasi US 10Y dan momentum pelemahan indeks DXY."
    },
    manajemenRisiko: {
      persentaseRisiko: "Maksimal 1.0% - 1.5% dari total ekuitas akun per trade.",
      kondisiRisikoTinggi: [
        "15 menit sebelum dan sesudah rilis data US CPI, NFP, atau pengumuman Fed FOMC (risiko slippage & pelebaran spread ekstrem).",
        "Sesi pergantian pasar New York close menuju Tokyo open (likuiditas tipis rawan fake breakout).",
        "Ketika DXY mengalami lonjakan tiba-tiba akibat intervensi mata uang global atau berita mendadak."
      ],
      tingkatKeyakinan: "High",
      catatanPenting: "Lakukan trailing stop ke Breakeven (BEP) seketika Take Profit 1 tercapai ($2,698.00). Kunci profit 50% lot (partial take-profit) untuk mengeliminasi risiko pasar secara terukur."
    },
    logikaPergerakanHarga: {
      rangkumanLogika: "Harga emas saat ini tidak sekadar didorong oleh spekulasi ritel, melainkan pergeseran arsitektur moneter global. Penurunan suku bunga global yang beriringan dengan tingkat utang negara-negara barat yang mencetak rekor menciptakan pelemahan daya beli mata uang fiat, menjadikan emas instrumen penyimpan nilai paling diminati.",
      faktorPendorongUtama: "1. Siklus pemangkasan suku bunga bank sentral dunia (Fed, ECB, BoE).\n2. Pembelian cadangan emas fisik oleh institusi moneter (De-dollarization).\n3. Ketidakpastian geopolitik global yang belum menemukan solusi diplomatik permanen.",
      risikoPembalikan: "Potensi koreksi tajam dapat terjadi jika The Fed secara tak terduga kembali mengadopsi narasi hawkish akibat lonjakan inflasi mendadak, atau terjadi de-eskalasi perdamaian komprehensif di kawasan konflik geopolitik dunia."
    }
  },

  H1: {
    kondisiPasar: {
      hargaTerkini: "$2,684.50",
      trendUtama: "Bullish",
      strukturPasar: "Intraday Bullish dengan micro Higher High di $2,688.20 dan Higher Low di $2,678.00. Terjadi pembentukan Fair Value Gap (FVG) bullish antara $2,679.50 - $2,682.00 pada pembukaan sesi London.",
      ringkasanKondisi: "Volatilitas intraday terkonsentrasi di rentang $2,678 - $2,689. Momentum pembeli mendominasi penutupan candle per jam dengan ekor bawah panjang (buying tail)."
    },
    analisisTeknikal: {
      supportUtama: [
        "S1: $2,678.50 (Intraday Point of Control & FVG)",
        "S2: $2,671.00 (Sesi Asia Low & EMA 50 H1)",
        "S3: $2,662.00 (EMA 200 H1 & Sesi Kemarin Low)"
      ],
      resistanceUtama: [
        "R1: $2,692.00 (High Sesi London Hari Ini)",
        "R2: $2,700.00 (Resistensi Psikologis Bulat)",
        "R3: $2,710.00 (Target Intraday R2 Pivot)"
      ],
      levelPsikologis: [
        "$2,650.00",
        "$2,675.00 (Quarter-point Intraday Magnet)",
        "$2,700.00",
        "$2,725.00"
      ],
      ema50_200: "Harga bergerak di atas EMA 50 H1 ($2,674.10) dan jauh di atas EMA 200 H1 ($2,658.70). Dinamika moving average berfungsi sebagai trailing dynamic support yang sangat presisi.",
      rsi: {
        nilai: 61.2,
        kondisi: "Bullish Zone",
        catatan: "RSI stabil di atas baseline 50 dan memantul dari level 55, mengonfirmasi dorongan buyer intraday tanpa divergence negatif."
      },
      macd: {
        status: "Bullish Expansion",
        histogram: "+1.82",
        catatan: "Histogram hijau bertumbuh, MACD signal line mengarah vertikal ke atas mengindikasikan lonjakan volume beli sesi New York."
      },
      bollingerBands: "Harga menguji upper band $2,689.50 setelah pantulan dari middle band $2,680.00. Bandwidth stabil mengindikasikan momentum ekspansi intraday berkelanjutan.",
      chartPattern: "Pola Bullish Pennant pada grafik 60-menit dengan target breakout menuju $2,698.00.",
      fibonacci: "Retracement dari low hari ini $2,672.00 ke high $2,689.00 menemukan support presisi di level 38.2% ($2,682.50).",
      volumeMomentum: "Lonjakan volume tick di atas rata-rata 20-perioda saat penembusan level $2,680.00."
    },
    analisisFundamental: {
      dxyPengaruh: "DXY melemah intraday 0.18% di sesi London, memberikan suntikan likuiditas langsung ke pair XAU/USD.",
      yield10YTreasury: "Yield 10Y AS flat di 4.08%, meredakan tekanan jual pada aset berdenominasi non-bunga.",
      kebijakanFedFOMC: "Komentar pejabat The Fed tadi malam menegaskan ketergantungan pada data (data-dependent) dengan kecenderungan pelonggaran kuartal berjalan.",
      dataEkonomiRilis: "Fokus intraday tertuju pada rilis klaim pengangguran mingguan (Jobless Claims) dan indeks manufaktur regional malam ini pukul 19:30 WIB.",
      geopolitikSafeHaven: "Peningkatan status siaga militer di Timur Tengah menjaga tawaran bid beli tetap aktif di pasar spot fisik London.",
      sentimenEmasFisikBankSentral: "Permintaan fisik di bursa Shanghai Gold Exchange (SGE) mencatatkan premi $12/oz di atas harga spot internasional."
    },
    prediksiSetupTrading: {
      biasUtama: "Bullish",
      skenarioPalingMungkin: "Buy on pullback saat harga menguji kembali FVG intraday $2,680.00 - $2,682.00 dengan target pertama di puncak sesi $2,692.00 dan ekstensi ke $2,699.00.",
      entryZone: "$2,681.00 - $2,683.50",
      takeProfit1: "$2,692.00",
      takeProfit2: "$2,699.50",
      stopLoss: "$2,675.00",
      riskRewardRatio: "1 : 2.4",
      invalidationLevel: "$2,672.00 (Break di bawah level ini membatalkan setup intraday dan membuka peluang drop ke $2,660.00)",
      alasanSetup: "Pantulan dari support intraday EMA 50 H1 + pengisian imbalance FVG sesi London."
    },
    manajemenRisiko: {
      persentaseRisiko: "0.5% - 1.0% per eksekusi intraday.",
      kondisiRisikoTinggi: [
        "Jendela waktu 19:15 - 19:45 WIB saat overlap rilis data ekonomi AS.",
        "Spread mekar saat perpindahan sesi NY-Asia."
      ],
      tingkatKeyakinan: "Medium",
      catatanPenting: "Tutup posisi atau pasang BEP sebelum sesi New York berakhir untuk menghindari risiko overnight gap."
    },
    logikaPergerakanHarga: {
      rangkumanLogika: "Aliran likuiditas intraday mencerminkan repositioning fund manager menjelang penutupan pasar mingguan, di mana penurunan DXY memicu algorithmic buying otomatis pada XAU/USD.",
      faktorPendorongUtama: "Aliran modal dari instrumen kas/valas ke logam mulia akibat ekspektasi pelemahan imbal hasil jangka pendek.",
      risikoPembalikan: "Kenaikan tak terduga pada yield obligasi jangka pendek jika data pasar tenaga kerja AS rilis sangat panas."
    }
  },

  Daily: {
    kondisiPasar: {
      hargaTerkini: "$2,684.50",
      trendUtama: "Bullish",
      strukturPasar: "Major Secular Bull Market. Struktur grafik harian memperlihatkan urutan Higher Highs dan Higher Lows yang konsisten sejak breakout dari area $2,075/$2,150. Emas berada di fase price discovery jangka panjang.",
      ringkasanKondisi: "Tren makro berada pada kondisi Bullish Parabolik terkontrol. Setiap koreksi mingguan 3-5% secara konsisten diserap oleh pembeli institusional institusi cadangan devisa dan sovereign wealth fund."
    },
    analisisTeknikal: {
      supportUtama: [
        "S1: $2,600.00 (Base Bulanan & Support Struktural Utama)",
        "S2: $2,530.00 (Breakout Zone Agustus/September)",
        "S3: $2,475.00 (EMA 200 Daily)"
      ],
      resistanceUtama: [
        "R1: $2,708.00 (All-Time High Terdekat)",
        "R2: $2,750.00 (Target Proyeksi Kuartalan)",
        "R3: $2,800.00 (Major Milestone Institusional)"
      ],
      levelPsikologis: [
        "$2,500.00 (Fondasi Kuat)",
        "$2,600.00 (Support Penjaga Tren)",
        "$2,700.00 (Threshold Kritis)",
        "$2,800.00 (Magnet Siklus Bull)"
      ],
      ema50_200: "EMA 50 Daily berada di $2,580.00 sementara EMA 200 Daily berada di $2,430.00. Jarak lebar antar moving average mengindikasikan tren bull institusional yang kokoh dan belum ada tanda exhaustion.",
      rsi: {
        nilai: 66.8,
        kondisi: "Strong Bullish Territory",
        catatan: "RSI Daily bergerak harmonis dengan kenaikan harga, tidak ada bearish divergence reguler. Koreksi ringan tempo hari berhasil mereset RSI dari level jenuh 78 ke 66."
      },
      macd: {
        status: "Bullish Trend Confirmation",
        histogram: "+8.90",
        catatan: "Kedua garis MACD harian berada jauh di atas garis nol dalam formasi open jaws ke atas."
      },
      bollingerBands: "Harga bergerak di separuh atas Bollinger Band bulanan (Upper Band $2,730, Mid Band $2,610), memperlihatkan karakteristik tren trending impulsif.",
      chartPattern: "Ascending Broadening Wedge / Bullish Channel yang telah berlangsung selama 12 bulan terakhir.",
      fibonacci: "Ekstensi 161.8% dari pergerakan impulsif siklus tahunan menunjuk ke zona target $2,780 - $2,820.",
      volumeMomentum: "Rata-rata volume COMEX harian menunjukkan akumulasi konstan dengan turnover transaksi fisik yang terus meningkat."
    },
    analisisFundamental: {
      dxyPengaruh: "Dolar AS menghadapi pelemahan struktural akibat beban defisit fiskal AS yang melebihi $1.9 triliun per tahun, mendorong diversifikasi global dari cadangan mata uang fiat ke aset keras.",
      yield10YTreasury: "Meskipun yield nominal berada di kisaran 4%, ekspektasi inflasi jangka panjang menjaga suku bunga riil berada pada level yang sangat bersahabat bagi emas.",
      kebijakanFedFOMC: "The Fed telah memasuki siklus pelonggaran kuantitatif moneter baru (Rate Cutting Cycle), secara historis selalu menjadi fase paling menguntungkan (bullish catalyst) bagi kenaikan harga komoditas emas.",
      dataEkonomiRilis: "Data ekonomi AS mengarah ke skenario 'soft landing' atau 'mild stagflation', yang secara empiris menghasilkan imbal hasil tahunan rata-rata 18-24% untuk emas.",
      geopolitikSafeHaven: "Fragmentasi geopolitik multi-polar (BRICS expansion, konflik teritorial) memicu penurunan kepercayaan terhadap sistem pembayaran SWIFT berbasis dolar.",
      sentimenEmasFisikBankSentral: "Laporan World Gold Council (WGC) mencatat pembelian bersih bank sentral melampaui 1,000 ton per tahun selama dua tahun berturut-turut, menjadi pembeli struktural tanpa henti."
    },
    prediksiSetupTrading: {
      biasUtama: "Bullish",
      skenarioPalingMungkin: "Akumulasi swing jangka menengah pada setiap penurunan ke area $2,630 - $2,660 dengan proyeksi swing ekspansi menuju $2,750 - $2,780.",
      entryZone: "$2,640.00 - $2,665.00 (Swing Accumulation Zone)",
      takeProfit1: "$2,720.00 (Penembusan ATH)",
      takeProfit2: "$2,780.00 (Ekstensi Siklus Kuartalan)",
      stopLoss: "$2,580.00 (Di bawah swing low penentu $2,600)",
      riskRewardRatio: "1 : 3.2",
      invalidationLevel: "$2,570.00 (Penutupan candle harian di bawah $2,570 mengindikasikan fase koreksi makro yang lebih dalam menuju $2,480.00)",
      alasanSetup: "Kombinasi siklus pelonggaran suku bunga global, akumulasi cadangan devisa bank sentral, dan konfirmasi teknikal bullish tren jangka panjang."
    },
    manajemenRisiko: {
      persentaseRisiko: "1.0% - 2.0% dari ekuitas portofolio untuk posisi swing trading.",
      kondisiRisikoTinggi: [
        "Perubahan arah kebijakan moneter The Fed jika inflasi mendadak melonjak kembali di atas 4%.",
        "Pemberlakuan pembatasan impor atau pajak likuiditas emas oleh negara-negara konsumen utama."
      ],
      tingkatKeyakinan: "High",
      catatanPenting: "Gunakan scaling-in (akumulasi bertahap) alih-alih all-in pada satu harga. Sesuaikan ukuran posisi (position sizing) agar toleransi drawdown harian tetap sehat."
    },
    logikaPergerakanHarga: {
      rangkumanLogika: "Secara fundamental makro, emas adalah mata uang independen tanpa risiko pihak ketiga (no counterparty risk). Ketika pasokan uang M2 global dan utang negara berkembang dan maju meroket, nilai riil emas menyesuaikan ke atas untuk mempertahankan paritas daya beli.",
      faktorPendorongUtama: "1. De-dollarization & pembelian masif oleh bank sentral negara berkembang.\n2. Siklus penurunan suku bunga Fed di tengah inflasi struktural yang persisten.\n3. Defisit anggaran fiskal AS yang memicu kekhawatiran devaluasi nilai tukar fiat.",
      risikoPembalikan: "Terjadinya resesi likuiditas ekstrem (credit crunch) di mana pelaku pasar terpaksa menjual emas secara massal untuk menutupi margin call di pasar saham (namun biasanya hanya bersifat sementara sebelum melonjak kembali)."
    }
  }
};

export const INTERMARKET_LIVE_DATA = {
  xauusd: { price: 2684.50, change: +12.80, changePct: +0.48, high24h: 2689.40, low24h: 2668.20 },
  dxy: { value: 102.85, change: -0.22, changePct: -0.21, status: 'Bearish Pullback' },
  us10y: { value: '4.08%', change: -0.04, changePct: -0.97, status: 'Easing Yields' },
  brent: { value: '$78.40', change: +0.65, changePct: +0.84, status: 'Energy Inflation Risk' },
  silver: { value: '$31.85', change: +0.42, changePct: +1.33, status: 'High Beta Outperformance' },
  goldSilverRatio: { value: 84.28, status: 'Normalizing' }
};

export type ChartInterval = '1m' | '5m' | '15m' | '1H' | '4H' | 'Daily';

// Generate realistic candlestick sample points for visualization across different intervals
export function generateCandlestickSeries(interval: ChartInterval, count = 45): CandlestickData[] {
  const result: CandlestickData[] = [];
  const now = new Date();

  // Interval-specific parameters
  let stepMinutes: number;
  let basePrice: number;
  let volatility: number;

  switch (interval) {
    case '1m':
      stepMinutes = 1;
      basePrice = 2682.5;
      volatility = 0.9;
      break;
    case '5m':
      stepMinutes = 5;
      basePrice = 2679.5;
      volatility = 1.8;
      break;
    case '15m':
      stepMinutes = 15;
      basePrice = 2676.0;
      volatility = 3.2;
      break;
    case '1H':
      stepMinutes = 60;
      basePrice = 2665.0;
      volatility = 6.5;
      break;
    case '4H':
      stepMinutes = 240;
      basePrice = 2640.0;
      volatility = 14.0;
      break;
    case 'Daily':
    default:
      stepMinutes = 1440;
      basePrice = 2590.0;
      volatility = 28.0;
      break;
  }

  for (let i = 0; i < count; i++) {
    const candleTime = new Date(now.getTime() - (count - i) * stepMinutes * 60 * 1000);
    let timeLabel: string;

    if (interval === 'Daily') {
      timeLabel = candleTime.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    } else if (interval === '4H') {
      timeLabel = `${candleTime.getDate()}/${candleTime.getMonth() + 1} ${candleTime.getHours().toString().padStart(2, '0')}:00`;
    } else if (interval === '1m') {
      timeLabel = candleTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else {
      timeLabel = candleTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    // Natural upward trending waves with pullbacks
    const progress = i / count;
    const macroTrend = progress * volatility * 1.5;
    const wave = Math.sin(i * 0.65) * (volatility * 0.45) + Math.cos(i * 0.3) * (volatility * 0.25);
    const noise = (Math.random() - 0.48) * (volatility * 0.35);

    const open = Math.round((basePrice + macroTrend + wave + noise) * 10) / 10;
    const isBull = Math.random() > 0.44 || i > count - 3;
    const bodySize = Math.max(0.4, Math.random() * (volatility * 0.38));
    const close = Math.round((isBull ? open + bodySize : open - bodySize) * 10) / 10;

    const wickUpper = Math.random() * (volatility * 0.22);
    const wickLower = Math.random() * (volatility * 0.22);
    const high = Math.round((Math.max(open, close) + wickUpper) * 10) / 10;
    const low = Math.round((Math.min(open, close) - wickLower) * 10) / 10;

    const baseVol = interval === '1m' ? 850 : interval === '5m' ? 1400 : interval === '15m' ? 2200 : interval === '1H' ? 4200 : interval === '4H' ? 9500 : 24000;
    const volume = Math.floor(baseVol + Math.random() * (baseVol * 0.8) + (isBull ? baseVol * 0.3 : 0));

    result.push({
      time: timeLabel,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  // Calculate moving averages and Bollinger Bands
  for (let i = 0; i < result.length; i++) {
    const slice = result.slice(0, i + 1);
    const closes = slice.map(c => c.close);
    const avg = closes.reduce((a, b) => a + b, 0) / closes.length;

    const emaOffset50 = interval === 'Daily' ? 18 : interval === '4H' ? 9 : interval === '1H' ? 4 : 2;
    const emaOffset200 = interval === 'Daily' ? 55 : interval === '4H' ? 24 : interval === '1H' ? 11 : 5;
    const bbDist = interval === 'Daily' ? 26 : interval === '4H' ? 14 : interval === '1H' ? 7 : 3.5;

    result[i].ema50 = Math.round((avg - emaOffset50 + (i * 0.1)) * 10) / 10;
    result[i].ema200 = Math.round((avg - emaOffset200) * 10) / 10;
    result[i].midBB = Math.round(avg * 10) / 10;
    result[i].upperBB = Math.round((avg + bbDist) * 10) / 10;
    result[i].lowerBB = Math.round((avg - bbDist) * 10) / 10;
  }

  // Anchor the latest candle close to current gold reference price 2684.50
  if (result.length > 0) {
    const last = result[result.length - 1];
    last.close = 2684.50;
    last.high = Math.max(last.high, 2689.40);
    last.low = Math.min(last.low, 2678.00);
  }

  return result;
}
