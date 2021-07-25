# 使用 leaftletjs 和 Open Street Map 開發口罩地圖

### 首先建立 (初始化) 一個地圖

在模板內增加一個 `#map`
```
<template>
  <div id="map"></div>
</template>
```

**新增一個地圖, 有兩種方式**
```
const map = L.map(map).setView([lat, lng], zoom)
const map = L.map((map), { cetner: [lat, lng], zoom })
```

- 我們把 map 綁定 id 為 map 的 dom 元素, 這個動作只需要做一次
- 設定中心點和縮放比例, 可以用 setView 這個方法或在 {} 內設置

---

### 客製化圖標
```
const greenIcon = new L.Icon({
  iconUrl: "/marker/marker-icon-2x-green.png",
  shadowUrl: "/marker/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
```

- iconUrl 是圖標圖片
- shadowUrl 是圖標陰影
- iconSize 是圖標大小

參考資料: [leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers)

---

### 加入圖層

圖層可以是 UI Layer, 泛指圖標(marker) 或圖標群組(markerclustergroup), 也可以是 Tile Layer(圖資), 這個專案我們用 Open Street Map 作為圖資. _<圖層可以加入或移除>_

__第二個步驟加入 UI Layer, 我們在中心點加入圖標, 有兩種方法__
```
1. const marker = L.marker([lat, lng], { icon })
     .bindPoupu('哈囉')
     .openPopup()
2. const marker = L.marker(new L.LatLng(lat, lng), { icon })
     .bindPopup('哈囉')
```

- { icon } 是 optional, 如果我們有客製化的 icon, 可以加在 { icon } 內
- bindPopup() 是彈跳視窗, 我們可以放入點擊圖標後想讓用戶看到的信息, 比如經緯度, 商店名稱等
- openPopup() 預設開啟視窗, 移除這行預設不會開啟視窗

**再來就是把圖層加入地圖**

我們可以在 marker 後面接 `addTo()`, 或者用 `addLayer()` 這個方法
```
L.marker([lat, lng], { icon }).addTo(map) / marker.addTo(map)
map.addLayer(marker)
```

這兩種方法都行, 端看開發者的喜好, 我個人偏好 `addTo()`, 因為只需要一行代碼, 用 addLayer() 就要多一行代碼

**然後載入圖資**
```
const osm = L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution:
'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
maxZoom: 18,
}).addTo(map)
```

- 取名 osm 是因為我們用的是 Open Street Map

- 不要忘記把圖資加入地圖, `addTo(map)` 或者用 `map.addLayer(osm)` 也行

執行以上三個動作我們就可以在地圖中心點上看到開啟的紅色圖標

**如果有很多圖標, 我們可以用陣列迴圈的方式插圖標**

例如: stores 陣列含有 10 個店家資料(店名, 經緯度)
```
const stores = [
  {
    name: '好吃拉麵',
    lat: 25.5,
    lng: 121.6
  },
  {
    name: '頂級火鍋',
    lat: 25.1,
    lng: 121.2
  },
  ...
]
```

我們要在地圖上標示這10家圖標, 可以用迴圈的方式(`forEach`, `map` 等)

使用 _forEach_
```
stores.forEach(item => {
  L.marker([item.lat, item.lng])
  .bindPopup(item.name)  
})
```

使用 _map_ 
```
stores.map(item => {
  return L.marker([item.lat, item.lng])
  .bindPopup(item.name)
})
```

溫馨提示: 使用 `map` 做迴圈要加 `return` 唷 !

#### 如果圖標有很多, 比如好幾千甚至上萬, 我們可以把圖標加入群組

增加一個群駔, 順便把群組加入地圖
```
const group = L.markerClusterGroup().addTo(map)
```

把圖標加入群組
```
group.addLayer(marker)
```

參考資料: [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)

---

### 移除圖層

**如果要移除圖層, 用 _removeLayer()_ 這個方法**

移除圖標 (marker)
```
map.removeLayer(marker)
```

移除群組 (group)
```
map.removeLayer(group)
```

移除圖資 (osm)
```
map.removeLayer(osm)
```

移除所有圖標
```
map.eachLayer(layer => {
  if (layer instanceof L.marker) {
    map.removeLayer(layer)
  }
})
```

---

**切換到不同中心點, 有三種方法可以使用**

- 我們可以用 `setView` 來指定新的中心點, 例如
`map.setView([新的緯度, 新的經度], zoom)`
- 也可以用 `panTo`, 例如 `map.panTo([新的緯度, 新的經度])`
- 還可以用 `flyTo`, 例如 `map.flyTo([新的緯度, 新的經度])`

這三種用法的差異:
- 我們可以在 `setView` 指定縮放比例
- 使用 `flyTo` 可以產生漸變動畫
- 使用 `panTo` 沒有漸變效果, 也不能指定縮放比例




