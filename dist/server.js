"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./presentation/app");
const PORT = process.env.PORT;
const app = (0, app_1.createApp)();
app.listen(PORT, () => {
    console.log(`Fintech Core App API ejecutándose exitosamente en http://localhost:${PORT}`);
});
