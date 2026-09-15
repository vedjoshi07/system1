FROM php:8.2-apache

# Enable Apache rewrite module
RUN a2enmod rewrite

# Install pdo_mysql
RUN docker-php-ext-install pdo pdo_mysql

# Set Apache document root to /var/www/html/backend/public
ENV APACHE_DOCUMENT_ROOT /var/www/html/backend/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Configure directory permissions for Apache mod_rewrite
RUN echo '<Directory /var/www/html/backend/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /etc/apache2/apache2.conf

# Copy application files
WORKDIR /var/www/html
COPY . /var/www/html/

# Make sure uploads directory exists and is writable
RUN mkdir -p /var/www/html/backend/public/uploads/items && \
    chmod -R 777 /var/www/html/backend/public/uploads

EXPOSE 80

CMD ["apache2-foreground"]
