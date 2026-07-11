# Oflayn xəritə (PMTiles)

`public/xerite.pmtiles` — kənd bölgəsinin vektor xəritə faylı
(bbox: 46.75,39.92 – 47.05,40.12, ~2 MB). Xəritə səhifəsi fayl
mövcud olanda Protomaps vektor rejimində işləyir; service worker
faylı bütöv keşə saldığından xəritə **internetsiz də açılır**.
Fayl silinsə, komponent avtomatik köhnə OSM raster rejiminə qayıdır.

## Faylı yeniləmək (ildə 1-2 dəfə bəs edir)

```bash
# pmtiles CLI: https://github.com/protomaps/go-pmtiles/releases
# Ən son gündəlik build: https://build.protomaps.com/YYYYMMDD.pmtiles

pmtiles extract https://build.protomaps.com/20260709.pmtiles \
  public/xerite.pmtiles --bbox=46.83,39.97,46.96,40.07
```

Sonra commit + deploy. Qeyd: bbox böyüdülsə fayl da böyüyür —
repo/pulsuz tier üçün ~10 MB-dan saxlamamaq məsləhətdir.

## Necə işləyir

- `VillageMap` `pmtilesUrl` prop-u alanda `pmtiles` protokolunu qeydə
  alır və `protomaps-themes-base` (light) üslubunu qurur; yer adları
  `az` dilində.
- Şrift/spraytlar `protomaps.github.io`-dan gəlir və SW tərəfindən
  CacheFirst keşlənir.
- SW quraşdırılanda faylı bütöv keşə salır; PMTiles-in range
  sorğularını `RangeRequestsPlugin` keşdəki tam fayldan dilimləyir.
