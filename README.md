# project : 我的餐廳清單

打造的餐廳清單網站, 收錄了許多家餐廳的相關資訊, 給喜歡收藏美食的愛好者可以進行收藏和搜尋。
<hr>
# 開發工具
    使用下列
    Node.js 
    Express
    Express-handlebars
    Sequelize
    Sequelize-cli
    mysql2
    method-override

# Features : 
  <ul>
    <li>瀏覽收藏的餐廳全名單，包含店名、類別、圖片、和評分</li>
    <li>點擊任何餐廳，可查看餐廳的詳細資料，如店名、地址、電話、描述</li>
    <li>可以使用中英文搜尋餐廳名稱和類別</li>
    <li>可以增加收藏餐廳名單</li>
    <li>可以更新收藏餐廳名單</li>
    <li>可以刪除收藏餐廳名單</li>
  </ul>
  
# Demo View

![image](https://github.com/Ash2700/Restaurant-List/blob/668a932627bb8906ca7ec4df7d88f470e17c57d3/demo_jp/%E9%A4%90%E5%BB%B3%E6%B8%85%E5%96%AE%E6%93%B7%E5%8F%961.JPG)
![image](https://github.com/Ash2700/Restaurant-List/blob/b9c9170dfadcb7c68804521053a55b36e5a24675/demo_jp/%E9%A4%90%E5%BB%B3%E6%B8%85%E5%96%AE%E6%93%B7%E5%8F%962.JPG)
![image](https://github.com/Ash2700/Restaurant-List/blob/b9c9170dfadcb7c68804521053a55b36e5a24675/demo_jp/%E9%A4%90%E5%BB%B3%E6%B8%85%E5%96%AE%E6%93%B7%E5%8F%963.JPG)

  ## [Installation - 安裝]

1. 確保在這個檔案中，確保 development 部分有正確的資料庫相關設定，包括 username、password、database等。這是一個例子：
  ```jsx
  "development": {
  "username": "root",
  "password": "your_password",
  "database": "restaurant",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
  ```
  
2. MySQL 伺服器：

請確保 MySQL 伺服器是運行的，而且可以使用你在 config.json 中設定的資料庫名稱、使用者名稱和密碼。


3. 資料庫建立：

在執行 npm run table 之前，確保你的資料庫已經存在，如果不存在，你可以在 MySQL 中手動建立：

```jsx
CREATE DATABASE restaurant;
```
確保 your_database_name 與你在 config.json 中設定的相同。

4. 環境變數的設定
在執行之前根據env.example內的資料建立一個.env檔案
```jsx
touch .env;
```
在sESSION_SECRTE內輸入一個值

```jsx
//.env
SESSION_SECRET=skip;
```
並且在terminal 根據作業系統設定環境變數NODE_ENV

```jsx
export NODE_ENV=development
```

1. 終端機指令：

確保你依次執行以下指令：
```jsx
git clone https://github.com/Ash2700/Restaurant-List.git
cd Restaurant-List
npm install 
npm install -g nodemon 
npm run table
npm run seed
npm run dev

```
這些指令會將專案複製到你的本地，安裝相依套件，建立資料表，填充資料，然後啟動伺服器。

1. 當 terminal 出現以下字樣，表示伺服器與資料庫已啟動並成功連結
   
```jsx
express server is running on http://localhost:3000
```
最後，請開啟任一瀏覽器瀏覽器輸入 [http://localhost:3000](http://localhost:3000) ，就可以開始瀏覽餐廳清單！



<hr>
Contributor : Ash2700
