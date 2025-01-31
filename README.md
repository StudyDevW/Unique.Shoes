# Сервисы: 
1. AccountAPI URL: http://localhost:8081/ui-swagger 
2. MarketAPI URL: http://localhost:8082/ui-swagger 
3. PaymentAPI URL: http://localhost:8083/ui-swagger
4. Frontend URL: http://localhost:4000
5. Grafana URL: http://localhost:3000
6. RabbitMQ URL: http://localhost:15672

# Дополнительная информация

- На каждом микросервисе реализован редирект из корня "/" к "/ui-swagger"
  
- Связь между микросервисами реализована через "HTTP" метод, а так же через RabbitMQ
  
- База данных PostgreSQL
  
- Панель управления базой данных PgAdmin4: http://localhost:5050/
  
- JWT токены подписаны RS512 с публичным и приватным ключом RSA
  
- Использовал для хранения JWT токенов и их управлением, Redis

- Данные от PgAdmin4<br>
 Логин: qwerty11ert@gmail.com<br>
 Пароль: root<br>

- Данные от RabbitMQ<br>
 Логин: guest<br>
 Пароль: guest<br>

- Данные от Grafana<br>
 Логин: admin<br>
 Пароль: admin<br>

- Данные от PostgreSQL<br>
 Server: postgres_db<br>
 POSTGRES_DB: uniqueshoes<br>
 POSTGRES_USER: practice_user<br>
 POSTGRES_PASSWORD: root<br>
 
# Скриншоты: 
# Главная
  ![image](https://github.com/user-attachments/assets/bce82e68-9ff4-4a0d-8d72-d63313baa94e)
# Подробнее о товаре 
  ![image](https://github.com/user-attachments/assets/aaa55dde-b006-4769-9f03-fc844b4a09bf)
# Корзина
  ![image](https://github.com/user-attachments/assets/a210c231-94ec-482c-911f-195501bc2a73)
# Панель менеджера, добавить товар
  ![image](https://github.com/user-attachments/assets/a7207e70-0356-44e5-83b4-5eb1c32a5ef0)
# Панель менеджера, изменить товар
  ![image](https://github.com/user-attachments/assets/bd7138f0-1a9c-4cf3-a2d7-e566a2575567)
# Своя касса оплаты
  ![image](https://github.com/user-attachments/assets/9ec00eb3-55ac-4a0d-ac11-83c9bd7d59bc)
# Профиль
  ![image](https://github.com/user-attachments/assets/94cdd7ec-0a6c-455c-a25d-a1a20fec7c4b)



