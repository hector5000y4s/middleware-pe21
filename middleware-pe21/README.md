# PE-2.1: Configuración y primer servicio middleware con Node.js

## Pruebas de los escenarios

**a) Sin API key**
* **Comando:** `curl http://localhost:3000/health`
* **Salida real:** `{"error":"API key inválida o ausente"}`
* **Explicación:** El middleware de autenticación rechaza la petición con un código 401 porque no se incluyó el encabezado `x-api-key`.

**b) Con clave válida**
* **Comando:** `curl.exe -H "x-api-key: secreto-demo" http://localhost:3000/health`
* **Salida real:** `{"status":"ok","ts":"2026-06-11T20:36:26.545Z"}`
* **Explicación:** La petición incluye la clave correcta, por lo que el middleware permite el paso y el servidor responde con estado 200 y el timestamp actual.

**c) Ruta inexistente**
* **Comando:** `curl.exe -H "x-api-key: secreto-demo" http://localhost:3000/noexiste`
* **Salida real:** ```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /noexiste</pre>
</body>
</html>


## TA-2.1 Pruebas unitarias básicas
Para comprobar que los interceptores (el logger y el verificador de API Key) funcionan correctamente frente a diferentes escenarios, implementé pruebas unitarias usando Jest. Esto me permite validar la lógica de los middlewares sin necesidad de levantar el servidor de Express.

**Comando de ejecución:**
npm test

**Output de las pruebas:**
\`\`\`text
> api-hector@1.0.0 test
> jest --config jest.config.js

ts-jest[config] (WARN) message TS151001: If you have issues related to imports, you should consider setting `esModuleInterop` to `true` in your TypeScript configuration file (usually `tsconfig.json`). See https://blogs.msdn.microsoft.com/typescript/2018/01/31/announcing-typescript-2-7/#easier-ecmascript-module-interoperability for more information.
 PASS  src/middlewares/auth.test.ts
 PASS  src/middlewares/logger.test.ts

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.512 s, estimated 1 s
Ran all test suites.



## PE-2.2 Documentación y versionado de API 
## Documentación de Endpoints

### `GET /health`
Este endpoint se utiliza para verificar la disponibilidad y el estado de salud de la API. No requiere autenticación.

* **Método HTTP:** `GET`
* **Ruta:** `/health`
* **Datos de entrada:** No requiere parámetros de consulta (query), ni cuerpo (body), ni cabeceras (headers) especiales.
* **Respuesta exitosa (200 OK):** Retorna un objeto JSON indicando que el servidor está operativo, la fecha/hora de la consulta y la versión de la API.
  *Ejemplo:* `{"status": "OK", "timestamp": "2026-06-19T15:30:00Z", "version": "1.0.0"}`
* **Posibles errores:**
  * **400 Bad Request:** Retorna un objeto JSON indicando un error de sintaxis en la petición del cliente.
  *Ejemplo:* `{"error": "Bad Request", "details": "La petición contiene sintaxis inválida."}`
  * **503 Service Unavailable:** Retorna un objeto JSON detallando que el servicio no está disponible (ej. pérdida de conexión con la base de datos).
  *Ejemplo:* `{"error": "Service Unavailable", "details": "La base de datos principal no responde."}`

---

## Análisis de Versionado

A continuación, se presentan dos escenarios hipotéticos de cambios en la API y su impacto en la compatibilidad con los clientes actuales.

### 1. Cambio compatible (Backwards-compatible)
**Propuesta:** Añadir un nuevo campo opcional llamado `uptime` (tiempo de actividad del servidor en segundos) a la respuesta exitosa del endpoint `GET /health`.
* **Justificación técnica:** Este cambio es retrocompatible porque los clientes actuales que consumen la API ignorarán cualquier campo adicional que no reconozcan en el payload JSON. Su lógica de análisis (parsing) no se romperá, ya que los campos requeridos originales (`status`, `timestamp`) seguirán estando presentes en sus formatos habituales.

### 2. Cambio que rompe la compatibilidad (Breaking change)
**Propuesta:** Cambiar el tipo de dato del campo `status` en el endpoint `GET /health` de un `string` (ej. `"OK"`) a un `boolean` (ej. `true` o `false`).
* **Justificación técnica:** Este es un breaking change porque cualquier cliente, aplicación front-end o servicio de monitoreo que esté programado para leer un texto específico (como verificar si `status === "OK"`) fallará o arrojará excepciones de tipado. Requeriría que todos los consumidores de la API modifiquen su código y se desplieguen simultáneamente con la nueva versión de la API para evitar caídas del servicio.