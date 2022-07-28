# Deploy on k8s

## Build Docker
```
sudo docker build -t socializer_admin:latest .
```

## Run Docker
```
sudo docker run --name socializer_admin -p 6060:7070 -d socializer_admin:latest
```

### Run docker in bash
```
sudo docker run --rm -i -t -p 6060:7070 socializer_admin sh
```

## Push image to Digital Ocean registry
```
docker tag socializer_admin registry.digitalocean.com/socialzer/socializer_admin
docker push registry.digitalocean.com/socialzer/socializer_admin
```

## Create a namespace for muslim life in k8s
```
kubectl create namespace socializer-admin
```

## Deploy
```
kubectl apply -f ./k8s/deployment.yml
kubectl apply -f ./k8s/service.yml
kubectl apply -f ./k8s/ingress.yml
```

## Forward http to https
```
kubectl patch ingress socializer-admin-app-ingress -n socializer-admin -p '{"metadata":{"annotations":{"konghq.com/protocols":"https","konghq.com/https-redirect-status-code":"301"}}}'
```