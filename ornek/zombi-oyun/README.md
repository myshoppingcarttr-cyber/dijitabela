# SON VARDİYA — 2D zombi aksiyon oyunu (dikey dilim prototipi)

Yandan görünüşlü, mobil öncelikli 2D zombi oyunu. Phaser 3.80.1 ile yazıldı, derleme gerektirmez:
klasörü herhangi bir statik sunucuya koymak yeterli. Android Chrome (dikey + yatay) ve masaüstünde çalışır.

**İçerik:** 2 bölüm (Karanlık Mahalle / Eski Liman), 10 görev bölgesi, 3 silah, 3 zombi türü, 2 boss,
hikâye kartları, telsiz diyalogları, kombo/puan, yıldızlı bölüm sonu, kayıt (localStorage), ayarlar, geliştirici paneli.

## Dosya yapısı

```
index.html              yükleme ekranı, yazı tipleri, script sırası
veri/
  bolumler.json         bölümler, görev bölgeleri, dalgalar, boss değerleri, TÜM hikâye/diyalog metinleri
  silahlar.json         hasar, atış hızı, şarjör, yedek mermi, menzil, delme, saçma, sarsıntı
  denge.json            oyuncu canı/hızı/zıplama, zorluk seviyeleri, zombi türleri, kombo, puan, düşen eşyalar
js/
  config.js             ekran yerleşimi, renk temaları (gece/şafak), kontrol boyutu, ses seviyesi, MÜŞTERİ GÖRSELLERİ
  kayit.js              ilerleme + ayar kaydı
  ses.js                ses motoru: assets/ses/ CC0 dosyalarını çalar (müzik/efekt/ortam kanalları)
  sanat-karakter.js     iskelet tabanlı karakter çizimi ve tüm animasyon kareleri, portreler
  sanat-dunya.js        paralaks katmanlar, dekorlar, hikâye sahnesi
  sanat-efekt.js        efekt/ikon/logo dokuları + üretim sırası
  oyun-dunya.js         katmanların ve bölüm dekorlarının sahneye kurulması, ışıklar, sis, yağmur
  oyun-kahraman.js      oyuncu: hareket, zıplama, silah, şarjör, hasar
  oyun-zombi.js         zombi yapay zekâsı + boss saldırıları
  oyun-efekt.js         kan, kovan, iz, namlu ışığı, puan yazıları (havuzlu)
  sahne-*.js            Yükleme, Menü, Hikâye, Oyun, Arayüz (HUD + dokunmatik), Sonuç
  gelistirici.js        ?gelistirici=1 paneli
assets/
  LISANS.txt            varlık ve lisans dökümü (her ses dosyasının CC0 kaynağı)
  ses/                  CC0 sesler, .ogg + .mp3 yedek (~2,2 MB toplam)
  musteri/              müşterinin kendi sprite sheet'leri buraya
```

## Neyi nereden değiştiririm?

| İstek | Dosya / alan |
|---|---|
| Zombi daha dayanıklı / hızlı / sert vursun | `veri/denge.json` → `zombiler.aylak.can`, `hiz`, `hasar` |
| Oyuncu canı, koşu hızı, zıplama | `veri/denge.json` → `oyuncu` |
| Kolay / Normal / Zor çarpanları | `veri/denge.json` → `zorluk` |
| Silah hasarı, şarjör, atış hızı, yeni değer | `veri/silahlar.json` |
| Bir dalgaya daha çok zombi | `veri/bolumler.json` → `bolgeler[].dalgalar[]` (`t`, `tur`, `adet`, `yon`, `aralik`) |
| Görev türü (temizle / topla / savun / boss / ulas) ve süreleri | `veri/bolumler.json` → `bolgeler[].tip`, `sure`, `hedef_x` |
| Boss canı, hücum hızı, şok dalgası, varil | `veri/bolumler.json` → `bolgeler[].boss` |
| Hikâye kartları ve telsiz konuşmaları | `veri/bolumler.json` → `giris_kartlari`, `cikis_kartlari`, `diyalog_*` |
| Yıldız eşikleri | `veri/bolumler.json` → `yildiz_puan` |
| Dekor yerleri (eczane, polis arabası, tekne...) | `veri/bolumler.json` → `dekor` |
| Kombo süresi, puanlar, düşen can/mermi şansı | `veri/denge.json` → `kombo`, `puan`, `dusurme` |
| Gece/şafak ışık ve sis rengi, yağmur | `js/config.js` → `temalar` |
| Dokunmatik düğme boyutu | `js/config.js` → `kontrol.dugmeOlcek` |

JSON'u değiştirip sayfayı yenilemek yeterli. Yeni bölüm eklemek için `bolumler` dizisine bir nesne daha eklenir
(`tema`: `gece` ya da `safak`); menü, kayıt ve bölüm seçimi otomatik genişler.

## Geliştirici paneli (müşteriyle canlı ayar)

Adresin sonuna `?gelistirici=1` ekleyin: bölüm/bölge atlama, boss'a git, ölümsüzlük, sınırsız mermi,
zorluk çarpanı (0.5–2.5), zombi doğurma, can doldurma, FPS göstergesi.
Diğer parametreler: `?sahne=oyun&bolum=b2&bolge=2` (doğrudan bölge), `?sahne=sanat` (tüm animasyonlar),
`?dokunmatik=1` (masaüstünde dokunmatik düğmeleri göster).

## Kendi tasarımlarınızı takmak (sprite sheet)

Şu an tüm karakterler kodla çiziliyor. Sizin çizimleriniz geldiğinde **kod değiştirmeden** takılır:

1. PNG'yi `assets/musteri/` içine koyun (ör. `kahraman.png`). Kareler eşit boyutlu, soldan sağa / yukarıdan aşağı.
2. `js/config.js` → `hariciGorseller` içine ekleyin:
   ```js
   kahraman: { dosya: "assets/musteri/kahraman.png", kareG: 240, kareY: 172, ayakX: 108, ayakY: 166,
               namlu: { tabanca: { x: 60, y: 106 }, pompali: { x: 72, y: 104 }, tufek: { x: 72, y: 106 } } }
   ```
   `ayakX/ayakY`: karakterin ayaklarının karedeki noktası (yere basma noktası). `namlu`: ayak noktasına göre namlu ucu.
3. Kare sırası yordamsal sürümle aynıdır (aşağıdaki tablo). Farklı sıranız varsa `animasyonlar` ile verin:
   ```js
   aylak: { dosya: "assets/musteri/aylak.png", kareG: 200, kareY: 182, ayakX: 100, ayakY: 176,
            animasyonlar: { yuru: { kareler: [0,1,2,3,4,5], fps: 8 }, saldiri: { kareler: [6,7,8,9], fps: 10, tekrar: 0 },
                            hasar: { kareler: [10,11] }, olum: { kareler: [12,13,14,15,16,17], tekrar: 0 } } }
   ```

| Karakter anahtarı | Animasyonlar (sırayla, kare sayısı) |
|---|---|
| `kahraman` | her silah için (tabanca, pompali, tufek): dur 4, kos 8, zipla 2, hasar 2, doldur 6 → sonra olum 8 |
| `aylak`, `aylak2`, `kosucu`, `hantal` | yuru 8, saldiri 5, hasar 2, olum 8 |
| `kasap` | yuru 8, vurus 6, hucum 5, kukre 3, hasar 1, olum 7 |
| `dev` | yuru 8, vurus 6, firlat 5, kukre 3, hasar 1, olum 7 |

Karakterler sağa bakacak şekilde çizilmelidir (oyun sola dönerken aynalar).
Arka planlar da aynı yolla değiştirilebilir: `gece_gok`, `gece_yakin`, `safak_orta` vb. anahtarlarla PNG yüklenip
`sahne-yukle.js` içindeki `preload`'a eklenir (paralaks katmanları 2048 px genişliğinde, yatay döşenebilir olmalı).

## Performans

- Toplam indirme: Phaser ~1.2 MB (CDN) + oyun kodu ~180 KB + sesler ~1,1 MB (tarayıcı yalnız ogg ya da mp3'ü indirir) + yazı tipleri.
- Tüm dokular yüklemede bir kez üretilir (orta segment Android'de ~1–2 sn), oyun sırasında çizim yapılmaz.
- Kan, kovan, toz, yazı efektleri havuzludur (sürekli nesne oluşturulmaz). Ayarlar > Grafik: Düşük → yağmur ve ön sis kapanır.

## Bilinen sınırlar (prototip)

- Sesler CC0 kaynaklıdır (assets/LISANS.txt). Ses değiştirmek: aynı adla assets/ses/ içine .ogg + .mp3 koymak yeterli; düzeyler js/ses.js > HARITA.
- Android mağaza paketi için Capacitor/Cordova sarmalayıcısı ve yerel titreşim/reklam/IAP entegrasyonu bu prototipte yok.
- Bölümler tek yönlü (soldan sağa); platform/merdiven gibi dikey hareket yok.
