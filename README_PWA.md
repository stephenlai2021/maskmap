# 增加 PWA 到口罩地圖

__五個 PWA 特點__
- Home Screen Installation
- Precaching
- Caching Strategies
- Background Sync
- Push Notifications

### 首先運行專案

- 執行 `quasar dev -m mode`
- 在根目錄下會產生 `src-pwa` 資料夾

### 更新 `manifest.json` 檔案  

`manifest.json` 的內容寫在 `quasar.conf.js` 的 pwa 物件中, 
```
pwa: {
  manifest: {
    name: `Maskmap101`, // 原本是 Maskmap
    short_name: `Maskmap`,
    description: `mask shop where you find detailed info about the mask amount`,
    display: "fullscreen",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0097a7",
    icons: [
      {
        src: "icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
}

```

- 首先我們把 name 改成 Maskmap101(原來是 Maskmap) 然後存檔
- 在網頁點擊右鍵進入開發者模式, 點選右邊的 `Storage` 項目 
- 點擊下方 `Clear site data` button 清除舊資料
- 重整網頁 (這個步驟不見得需要, 有時 quasar 重新編新專案順便清除舊資料)
- 點選右邊的 `Manifest` 選項, 這時可以看到 `Name` 已經更新為 Maskmap101; 同理應用在其他項目

### 使用 icongenie 產生 icon

首先安裝 icongenie `npm i -g @quasar/icongenie`
這個步驟如果碰到錯誤信息, 請參閱 (Icon Genie CLI Installation)['https://quasar.dev/icongenie/installation]

 在根目錄準備一張 1024x1024 的 PNG 圖檔

 執行 `icongenie generate -i mask1024.png --skip-trim --theme-color 0097a7` 
- `skip-trim` 是選項, 意思是省去剪裁圖片四邊空白部分
- `--theme-color` 也是選項, 我們可以設置主題顏色

### 在桌面安裝 PWA (Home Screen Installation)

首先我們在 template 置入 banner, 我們到 (Banner)[https://quasar.dev/vue-components/banner], 拷貝並貼上以下代碼
```
<q-banner inline-actions class="text-white">
  <template v-slot:avatar>
    <q-avatar size="md" color="red" text-color="white" icon="directions" />
  </template>
  <b>Install Maskmap ?</b>
  <template v-slot:action>
    <q-btn flat label="Yes" dense class="q-px-sm" />
    <q-btn flat label="Later" dense class="q-px-sm" />
    <q-btn flat label="Never" dense class="q-px-sm" />
  </template>
</q-banner>
```

## Service Workers & Workbox

### What is Service Workder ?

### Service Worker Events

- Fetch
- Push Message
- Notification Interaction
- Background Sync
- Service Worker Lifecycle

### What is Workbox ?

- A Tool by Google for Easy Service Worker Management
- Precaching - Made Easier
- Caching Strategies - Made Easier
- Background Sync - Made Easier

### src-pwa folder

---

## PWA - Precaching

### What is Precaching ?

- Allow us to cache all the core files of our app
- HTML, CSS, JavaScript etc stored in browser on first load
- When user returns, core shell loaded from cache
- Better performance
- Launch offline

### Enable Precache








