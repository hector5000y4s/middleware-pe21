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
