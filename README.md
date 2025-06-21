# Haftalık Alışkanlık Planlayıcı

Minimalist, modern ve kullanıcı dostu bir haftalık alışkanlık takip uygulaması.

## Proje Özeti
Bu uygulama, haftalık alışkanlıklarınızı kolayca eklemenizi, düzenlemenizi ve ilerlemenizi takip etmenizi sağlar. Kategoriler veya karmaşık hedefler olmadan, sade ve profesyonel bir arayüz sunar. İlerlemenizi haftalık olarak analiz edebilir ve başarılarınızı paylaşabilirsiniz.

## Özellikler
- **Minimalist ve modern arayüz**
- Haftalık alışkanlık ekleme, düzenleme ve silme
- Her alışkanlık için ikon ve renk seçimi
- Haftalık planlayıcı ve gün bazlı görünüm
- Tamamlanan alışkanlıkların işaretlenmesi
- Haftalık istatistikler ve paylaşılabilir başarı kartı
- Motivasyonel alıntılar
- Responsive (mobil uyumlu) tasarım

## Kullanılan Teknolojiler
- **React** (Vite ile)
- **TypeScript**
- **Material UI (MUI)**
- **Day.js** (tarih işlemleri için)
- **Recharts** (grafikler için)

## Kurulum
1. **Depoyu klonlayın:**
   ```bash
   git clone https://github.com/FurkanAslan6565/planweek-web.git
   cd planweek-web
   ```
2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```
3. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```
4. Tarayıcınızda `http://localhost:5173` adresini açın.

## Klasör Yapısı
```
habittt/
├── public/                # Statik dosyalar
├── src/
│   ├── assets/            # Görseller ve ikonlar
│   ├── components/        # Yeniden kullanılabilir React bileşenleri
│   ├── contexts/          # Global state/context yönetimi
│   ├── hooks/             # Özel React hook'ları
│   ├── pages/             # Sayfa bileşenleri (Dashboard, Stats)
│   ├── types/             # TypeScript tip tanımları
│   ├── utils/             # Yardımcı fonksiyonlar
│   ├── index.css          # Global stiller
│   └── main.tsx           # Giriş noktası
├── package.json
├── tsconfig.json
└── README.md
```

## Kullanım
- **Alışkanlık eklemek için:** Sağ alttaki `+` butonuna tıklayın, alışkanlık adını, isteğe bağlı açıklamayı, ikon ve rengi seçin.
- **Hafta seçmek için:** Üstteki tarih seçiciden haftanızı belirleyin.
- **Gün seçmek için:** Sol taraftaki günlerden birine tıklayın.
- **Alışkanlıkları tamamlamak için:** İlgili günün detayında alışkanlık kartındaki tamamla butonuna tıklayın.
- **İstatistikleri paylaşmak için:** İstatistikler sayfasında "Paylaş" butonunu kullanın.

## Katkıda Bulunma
Katkılarınızı memnuniyetle karşılıyoruz! Lütfen önce bir issue açın ve ardından bir pull request gönderin.

1. Fork'layın
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniozellik`)
3. Değişikliklerinizi commitleyin (`git commit -m 'Açıklama'`)
4. Branch'e pushlayın (`git push origin feature/yeniozellik`)
5. Pull request oluşturun

## Lisans
[MIT](LICENSE)

## İletişim
Her türlü soru ve öneriniz için:
- **Furkan Aslan**  
  [GitHub](https://github.com/FurkanAslan6565)  
  furkanaslan@example.com