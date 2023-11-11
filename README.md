<h1 align="center">Backend - Segunda preEntrega</h1>

## 🛠️ Ejecución del proyecto

**Para la ejecución del proyecto se debe clonar el mismo y ejecutar el siguiente comando:**

`npm install`

**Luego de esto ejecutar:**

`npm start`

**o bien, pararse en la capeta "src" y ejecutar:**

`nodemon ./app.js`
<h1 align="center">Backend - E-commerce</h1>

# Acceda al sitio web [aquí](https://cheery-lebkuchen-6aaa90.netlify.app/)

## 🛠️ Ejecución del proyecto

**Para la ejecución del proyecto se debe clonar el mismo y ejecutar el siguiente comando:**

`npm install`

**Luego de esto ejecutar:**

`npm start`

**o bien, pararse en la capeta "src" y ejecutar:**

`nodemon ./app.js`

## ⚙️ Configuración del proyecto:

**Recuerda crear tu propio archivo .env dentro de la carpeta src, en el que incluirás las variables de entorno necesaria para el funcionamiento. La misma será:** 

- `PORT`: puerto local
- `DATABASE_URL`: URL de tu base de datos de MongoDB Atlas.
- `DATABASE_TEST_URL`: URL de tu base de datos de MongoDB Atlas para testing.
- `MONGO_STORE_SECRET`: Para MongoDB
- `CLIENT_ID`: Para la autenticación mediante GitHub.
- `CLIENT_SECRET`: Para la autenticación mediante GitHub.
- `LOGGER_LEVEL`: Nivel de logger a partír del cual se desea loggear
- `MAIL`: Mail configurado para servicio de mensajería
- `MAIL_PASSWORD`: Password para mensajería

## ⚒️ Testeo del proyecto:

### El flujo principal se encontrará a partir de `http://localhost:<PORT>/login`

### Puede visitar adicionalmente los siguientes enlaces para acceder a diferentes vistas:

- http://localhost:<PORT>/
    **En esta página encontrará el listado de productos actuales cargados a la base de datos. Debe estar logeado para acceder.**

- http://localhost:<PORT>/realtimeproducts 
    **En esta página encontrará el listado de productos cargados a la base de datos actualizados en tiempo real.**

#### Si se encuentra logeado como admin podra acceder adicionalmente a:

- http://localhost:<PORT>/info 
    **En esta página podrá vizualizar información de usuarios, reasignarles un nuevo rol y eliminarlos.**


### Para las request, utilice el siguiente formato:

**El siguiente ejemplo muestra un POST de un producto, recuerde que podrá prescindir del campo "thumbnails" si así lo desea.**

![Postman request example](./public/assets/images/POST_example.png)

**El siguiente es un ejemplo de un PUT de un producto, en el cual podrá actualizar tantos campos como considere necesario.**

![Postman request example](./public/assets/images/PUT_example.png)

**El siguiente es un ejemplo de un PUT de un cart, en el cual podrá actualizar únicamente el valor quantity.**

![Postman request example](./public/assets/images/PUT_cart_example.png)

**Por último un ejemplo de un PUT de un cart mediante un array de productos.**

![Postman request example](./public/assets/images/PUT_cart_example2.png)