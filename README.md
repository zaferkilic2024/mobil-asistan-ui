# sift — mobil kumanda

`sift` sisteminin telefon arayüzü. Digest **Telegram'a** gider; buranın işi okumak değil,
kumanda etmek:

- izlenen kaynakları görmek, susturmak/açmak
- paylaş menüsünden yeni kaynak adresi bırakmak

## Anahtar

Uygulama Supabase'in **publishable** anahtarını kullanır ve onu yalnız tarayıcının
`localStorage`'ında tutar — **bu depoda anahtar yoktur.** Depo public olduğu için
anahtarı buraya gömmek, gelen kutusunu isteyen herkese açmak olurdu.

Anahtarın ne yapabildiğini sunucudaki RLS kuralları belirler (`sift/rls.sql`):

| yapabilir | yapamaz |
|---|---|
| kaynak listesini görmek (**adres hariç**) | kaynak silmek, adres/feed/aralık değiştirmek |
| `active` ve `muted_until` değiştirmek | `seen_items`, `digest_items`, `runs` okumak |
| gelen kutusuna `add_source` bırakmak | gelen kutusunu okumak, başka tür iş bırakmak |

Güvenlik anahtarı saklamaktan değil, yetkisinin darlığından gelir.

## Kaynak ekleme neden burada bitmiyor

Telefon yalnız **adresi** kuyruğa bırakır. Feed keşfi, erişilebilirlik denetimi ve
ekleme kararı sunucu turunun içinde verilir — çünkü bir sitenin erişilebilir olup
olmadığı kodun *nereden* koştuğuna bağlıdır. (Ölçüldü: bir kaynak ev bağlantısından
200, GitHub runner'ından 403 döndü.) Sonuç Telegram'dan bildirilir.

## Kurulum

1. `https://zaferkilic.tr/mobil-asistan-ui/` adresini aç
2. Supabase adresini ve publishable anahtarı gir
3. Tarayıcı menüsünden **Ana ekrana ekle** — paylaş menüsüne yerleşmesi buna bağlı

Tek dosyalık uygulama: derleme yok, bağımlılık yok, dış istek yok (Supabase hariç).
