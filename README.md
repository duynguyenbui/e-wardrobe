# eWardrobe Website

***Database*** MongoDB 
```bash 
docker run -d -p 27017:27017 --name e-wardrobe -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=mongopw mongo
```

***Payment*** Stripe
```
.\stripe.exe listen --forward-to localhost:3000/api/stripe/webhooks
```