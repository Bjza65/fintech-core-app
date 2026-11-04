import { createApp } from './presentation/app';

const PORT = process.env.PORT;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Fintech Core App API ejecutándose exitosamente en http://localhost:${PORT}`);
});