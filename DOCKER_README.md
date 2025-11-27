# Hestia Porto - Docker Deployment

This project is containerized with Docker for easy deployment to VPS.

## Local Development Setup

1. Build and start the containers:
```bash
docker-compose up -d --build
```

2. Install dependencies and set up the application:
```bash
docker-compose exec app bash
composer install
npm install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
```

3. Access the application:
- Frontend: http://localhost
- Admin Panel: http://localhost/admin

## Production Deployment

1. On your VPS, make sure Docker and Docker Compose are installed

2. Copy the project files to your VPS

3. Create your production .env file:
```bash
cp .env.production .env
```

4. Update the .env file with your specific settings

5. Build and run the containers:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

6. Run initial setup commands:
```bash
docker-compose -f docker-compose.prod.yml exec app php artisan key:generate
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --seed
docker-compose -f docker-compose.prod.yml exec app php artisan storage:link
```

## Required VPS Setup

Before deploying, ensure your VPS has:
- Docker Engine
- Docker Compose
- Domain name pointing to the server IP
- SSL certificate (for HTTPS)

Since you'll be using Caddy, make sure it's installed and configured to proxy requests to the PHP container.

## Environment Variables

Key environment variables to configure for production:
- `APP_URL` - Your domain name
- `DB_HOST` - Should be 'db' when using the docker-compose setup
- `REDIS_HOST` - Should be 'redis' when using the docker-compose setup
- Database credentials
- Mail settings (if needed)

## Notes

- The production setup assumes you'll use Caddy as the web server
- The PHP-FPM container exposes port 9000 for the web server to connect
- All static assets are built during the Docker image build process
- File uploads are stored in the `storage` directory, which should be persistent