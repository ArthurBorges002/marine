# Backend — Marine Ops (API Laravel)

API REST em Laravel 13 com autenticação por token (Sanctum) e PostgreSQL (Neon).

```bash
composer install
cp .env.example .env   # preencha DATABASE_URL
php artisan key:generate
php artisan migrate
php artisan serve      # http://localhost:8000/api
php artisan test
```

Veja o [README principal](../README.md) para configuração do Neon, endpoints e estrutura.
