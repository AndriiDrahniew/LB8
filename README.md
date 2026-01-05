# Лабораторно-практична робота №8
## «Full-stack інтеграція: розробка UI на базі професійного бойлерплейту»
## 1. Короткий опис реалізованого функціоналу

## Реалізовано три основні сторінки:

### **Коні**
- Перегляд списку коней 
- Створення нового коня 
- Редагування існуючого коня  
- Видалення коня 

### **Звіти про торгівлю тваринами**
- Відображення всіх звітів 
- Створення нового звіту
- Редагування звіту
- Видалення звіту  

### **Заявки на тренування**
- Перегляд усіх заявок
- Додавання нової заявки
- Редагування заявки
- Видалення заявки

##  2. Приклади ключового коду

### **Конфігурація Axios**
```
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
```
### **Хуки для TanStack Query**
Приклад для коней

```
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export type Horse = {
  id: number;
  weight: number;
  stallNumber: number;
  using: string;
  owner: string;
  age: number;
  height: number;
  breed: string;
  name: string;
  sex: string;
};

const getHorses = async (): Promise<Horse[]> => {
  const res = await apiClient.get('/horses');
  return res.data;
};

const getHorseById = async (id: number): Promise<Horse> => {
  const res = await apiClient.get(`/horses/${id}`);
  return res.data;
};

const createHorse = async (data: Partial<Horse>): Promise<Horse> => {
  const res = await apiClient.post('/horses', data);
  return res.data;
};

const updateHorse = async ({ id, data }: { id: number; data: Partial<Horse> }) => {
  const res = await apiClient.patch(`/horses/${id}`, data);
  return res.data;
};

const deleteHorse = async (id: number) => {
  await apiClient.delete(`/horses/${id}`);
};

// React Query хуки

export const useHorses = () =>
  useQuery({
    queryKey: ['horses'],
    queryFn: getHorses,
  });

export const useHorse = (id: number) =>
  useQuery({
    queryKey: ['horses', id],
    queryFn: () => getHorseById(id),
    enabled: !!id,
  });

export const useCreateHorse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createHorse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['horses'] }),
  });
};

export const useUpdateHorse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateHorse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['horses'] }),
  });
};

export const useDeleteHorse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteHorse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['horses'] }),
  });
};
```
### **Zod-схема**
Валідація форми виконується за допомогою Zod-схеми.
Вона перевіряє правильність введених даних ще до надсилання на сервер

Приклад схеми коня
```
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

import { useHorse, useUpdateHorse } from '@/features/horses/api';

const horseSchema = z.object({
  name: z.string().min(2, 'Імʼя занадто коротке'),
  breed: z.string().min(2, 'Порода занадто коротка'),
  sex: z.string().min(1, 'Вкажіть стать'),
  owner: z.string().min(2, 'Власник занадто короткий'),
  using: z.string().min(2, 'Призначення занадто коротке'),

  age: z.number().int().positive('Вік має бути додатним'),
  weight: z.number().positive('Вага має бути додатною'),
  height: z.number().positive('Зріст має бути додатнім'),
  stallNumber: z.number().int().positive('Номер стійла має бути додатнім'),
});

type HorseFormData = z.infer<typeof horseSchema>;

export const Route = createFileRoute('/horses/$horseId')({
  component: HorseEditPage,
});

function HorseEditPage() {
  const { horseId } = useParams({
    from: '/horses/$horseId',
  });

  const { data: horse, isLoading, isError } = useHorse(Number(horseId));
  const updateMutation = useUpdateHorse();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HorseFormData>({
    resolver: zodResolver(horseSchema),
  });

  useEffect(() => {
    if (horse) {
      reset({
        name: horse.name,
        breed: horse.breed,
        sex: horse.sex,
        owner: horse.owner,
        using: horse.using,
        age: horse.age,
        weight: horse.weight,
        height: horse.height,
        stallNumber: horse.stallNumber,
      });
    }
  }, [horse, reset]);

  const onSubmit = (data: HorseFormData) => {
    updateMutation.mutate({
      id: Number(horseId),
      data,
    });
  };
```
## Скріншоти
### Сторінка логіну
![img](/Screenshots/Screenshot2026-01-03180413)
### Сторінка зі списком коней
![img](/Screenshots/Screenshot2026-01-03180428)
### Сторінка зі списком транзакцій Форма з помилками валідації від Zod
![img](/Screenshots/Screenshot2026-01-03180428)
### Сторінка зі списком заявок на тренування
![img](/Screenshots/Screenshot2026-01-03180509)
### Валідація Zod
![img]()

## Неперервна інтеграція (CI/CD)

### GitHub Actions Workflow

Для автоматизації процесу збірки, публікації Docker-образу та деплою створено workflow у файлі `.github/workflows/publish.yml`.

#### Тригери запуску

Workflow автоматично запускається у таких випадках:
- **Ручний запуск** через інтерфейс GitHub (`workflow_dispatch`)
- **Автоматично при push** у гілки:
  - `main`
  - `feature/*`

#### Дозволи (Permissions)
```yaml
permissions:
  packages: write    # Дозвіл на публікацію пакетів
  contents: read     # Дозвіл на читання репозиторію
```

#### Структура Workflow

Workflow складається з двох послідовних jobs:

### Job 1: build-and-push

Виконується на `ubuntu-latest` та включає наступні кроки:

1. **Checkout repository** (`actions/checkout@v4`)
   - Клонування коду репозиторію

2. **Install pnpm → dependencies → build**
   - Встановлення пакетного менеджера pnpm
   - Встановлення залежностей проєкту (`pnpm install`)
   - Збірка проєкту (`pnpm run build`)

3. **Login to GitHub Container Registry** (`docker/login-action@v3`)
   - Авторизація в GitHub Container Registry (ghcr.io)
   - Використовується вбудований `GITHUB_TOKEN`
   - Username отримується з контексту `github.actor`

4. **Build and push Docker image** (`docker/build-push-action@v6`)
   - Збірка Docker-образу з поточної директорії
   - Публікація образу в GitHub Container Registry
   - Тег образу: `ghcr.io/{{owner}}/{{repository}}:latest`

### Job 2: deploy-to-cloud

Виконується після успішного завершення `build-and-push` (залежність `needs: build-and-push`):

1. **Login to Azure** (`azure/login@v2`)
   - Авторизація в Azure за допомогою credentials зі secrets

2. **Deploy to Azure Web App** (`azure/webapps-deploy@v2`)
   - Деплой Docker-контейнера на Azure Web App з назвою `practicum`
   - Використовується щойно створений образ з GitHub Container Registry

#### Використання GitHub Context

У workflow використовуються змінні з GitHub context для динамічного формування назв:
- `${{ github.actor }}` — ім'я користувача, що запустив workflow
- `${{ github.repository_owner }}` — власник репозиторію
- `${{ github.event.repository.name }}` — назва репозиторію

#### Secrets

Для роботи workflow налаштовано наступні secrets:
- `GITHUB_TOKEN` — автоматично надається GitHub Actions
- `AZURE_CREDENTIALS` — облікові дані для Azure (налаштовано вручну)

---

## GitHub Skills
- [Hello GitHub Actions](https://github.com/AndriiDrahniew/skills-hello-github-actions)
- [Publish Packages](https://github.com/AndriiDrahniew/skills-publish-packages)